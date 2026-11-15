"""Sound for the Scale Zoom film: voice, tuned percussion per level (vibraphone in space, marimba in the city, nylon guitar
at the stall, bells on the phone), small-machine foley (blips per sight-line dot, a click + bell when a ring locks, whooshes for dives)."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
LIB = os.environ.get('LIB'); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh, pop, thump
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'out', 'events.json'))); EV = D['ev']; DUR = float(D['dur']); N = int(DUR * SR) + SR
vo = np.zeros((N, 2), np.float32)
for e in EV:
    if e['type'] != 'vo': continue
    x, sr = sf.read(os.path.join(HERE, 'vo', e['id'] + '.wav')); x = soxr.resample(x, sr, SR); x = hp(x, 80) / (np.abs(x).max() + 1e-9) * .7
    add(vo, compress(x, thr=.18, ratio=3.0, att=.003, rel=.12).astype(np.float32), e['t'], 1.0, 0)
vmask = lp((np.abs(vo.mean(1)) > 1e-3).astype(float), 3, 1) > .2
fx = np.zeros((N, 2), np.float32); ev = []
def blip(f, d=.06):
    n = int(d * SR); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * f * tt * (1 + tt * 3)) * np.exp(-tt / .02) * .2).astype(np.float32)
for e in EV:
    t = e['t']
    if e['type'] == 'sight':
        for i in range(8): add(fx, blip(900 + i * 120), t + i * e['d'] / 8, 1.0, -.4 + i * .1)
    elif e['type'] == 'lock':
        add(fx, lp(click(pitch=.8), 3000) * .2, t, 1.0, .3); ev.append((t + .02, 'glockenspiel', ['E6', 'G6', 'B6'][e['k']], 1.2, .55, .3, .6))
    elif e['type'] == 'dive':
        add(fx, lp(whoosh(e['d'] + .3), 2600) * .18, t - .1, 1.0, 0); ev.append((t + e['d'], 'timpani', 'E2', 1.5, .55, 0, .7)); ev.append((t + e['d'], 'triangle', None, 1.0, .5, .3, .4)) if False else None
    elif e['type'] == 'back': add(fx, lp(whoosh(e['d']), 3000) * .2, t, 1.0, 0)
    elif e['type'] == 'paid':
        for p, dt in [('E6', 0), ('G#6', .06), ('B6', .12), ('E7', .18)]: ev.append((t + dt, 'glockenspiel', p, 1.6, .7, .3, .7))
# score: E major, 96 bpm (beat .625); lead instrument changes per level
BEAT = .625
def bed(t0, t1, lead, notes, root):
    t = t0; i = 0
    while t < t1:
        ev.append((t, 'contrabass_pizz', root if i % 4 != 2 else root[:-1] + str(int(root[-1]) + 1), .6, .45, -.05, .8))
        ev.append((t, lead, notes[i % len(notes)], .9, .4, .2, .55)); t += BEAT; i += 1
dv = [e['t'] for e in EV if e['type'] == 'dive']; back = [e['t'] for e in EV if e['type'] == 'back'][0]
bed(0.0, dv[0], 'vibraphone', ['B4', 'E5', 'G#5', 'E5', 'C#5', 'E5', 'B4', 'G#4'], 'E2')
bed(dv[0] + 1.3, dv[1], 'marimba', ['E5', 'G#5', 'B5', 'G#5', 'F#5', 'A5', 'B5', 'E6'], 'A1')
bed(dv[1] + 1.0, dv[2], 'guitar_nylon', ['E4', 'B4', 'E5', 'B4', 'G#4', 'B4'], 'B1')
for i, p in enumerate(['E4', 'G#4', 'B4', 'E5', 'G#5', 'B5']): ev.append((dv[2] + .9 + i * .08, 'harp', p, 2.0, .55, -.3 + .1 * i, .7))
bed(dv[2] + 1.6, back, 'glockenspiel', ['B5', 'E6', 'G#6', 'E6'], 'E2')
for i, p in enumerate(['B5', 'G#5', 'E5', 'B4', 'G#4', 'E4', 'B3', 'E3']): ev.append((back + i * .2, 'harp', p, 1.5, .5, .3 - .08 * i, .6))
ev.append((back + 1.9, 'vibraphone', 'E4', 3.0, .5, 0, .6)); ev.append((back + 1.9, 'contrabass_pizz', 'E1', 1.5, .6, 0, .8))
S.seed(2)
mus = S.render(ev, dur=N / SR, master=False); mus = S.room(mus, size=.35, mix=.16)[:N].astype(np.float32); mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
mus = mus - .5 * np.stack([bp(mus[:, c], 300, 4000, 2) for c in range(2)], 1).astype(np.float32)
def rms(x, m): return np.sqrt(np.mean(x[m] ** 2)) + 1e-12
mus *= (rms(vo, vmask) / rms(mus, vmask)) * 10 ** (-10 / 20); fx *= (rms(vo, vmask) / rms(fx, vmask)) * 10 ** (-9 / 20)
mix = (vo + mus + fx)[:int(DUR * SR)]; tt = np.arange(len(mix)) / SR; mix *= np.clip((DUR - tt) / 1.2, 0, 1)[:, None]
mix = np.stack([limit(mix[:, c], .9) for c in range(2)], 1); sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR); print('ok')
