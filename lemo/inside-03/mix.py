"""Sound for Sunday Inside EP 03 (QR code scale zoom): voice; D major at 90 bpm with a lead instrument per level
(nylon guitar at the cart, marimba on the whole code, vibraphone on the finder, glockenspiel on the byte);
small-machine foley (blips per sight-line dot, click + bell on ring locks, whooshes for dives, a soft thump for the smudge,
rising harp for the recovery, ticks for the bits, a bell run for the upi://pay reveal). Run with LIB=<lemo-opuscar root>."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
LIB = os.environ.get('LIB'); sys.path.insert(0, LIB)
from core.audio import sampler as S
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh, thump
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'out', 'events.json'))); EV = D['ev']; DUR = float(D['dur']); N = int(DUR * SR) + SR
vo = np.zeros((N, 2), np.float32)
for e in EV:
    if e['type'] != 'vo': continue
    x, sr = sf.read(os.path.join(HERE, 'vo', e['id'] + '.wav'))
    if x.ndim > 1: x = x.mean(1)
    x = soxr.resample(x, sr, SR); x = hp(x, 80) / (np.abs(x).max() + 1e-9) * .7
    add(vo, compress(x, thr=.18, ratio=3.0, att=.003, rel=.12).astype(np.float32), e['t'], 1.0, 0)
vmask = lp((np.abs(vo.mean(1)) > 1e-3).astype(float), 3, 1) > .2
fx = np.zeros((N, 2), np.float32); ev = []
def blip(f, d=.06):
    n = int(d * SR); tt = np.arange(n) / SR; return (np.sin(2 * np.pi * f * tt * (1 + tt * 3)) * np.exp(-tt / .02) * .2).astype(np.float32)
for e in EV:
    t = e['t']; ty = e['type']
    if ty == 'sight':
        for i in range(8): add(fx, blip(880 + i * 110), t + i * e['d'] / 8, 1.0, -.4 + i * .1)
    elif ty == 'lock':
        add(fx, lp(click(pitch=.8), 3000) * .2, t, 1.0, .3); ev.append((t + .02, 'glockenspiel', ['D6', 'F#6', 'A6'][e['k']], 1.2, .55, .3, .6))
    elif ty == 'dive':
        add(fx, lp(whoosh(e['d'] + .3), 2600) * .18, t - .1, 1.0, 0); ev.append((t + e['d'], 'timpani', 'D2', 1.5, .5, 0, .7))
    elif ty == 'back': add(fx, lp(whoosh(e['d']), 3000) * .2, t, 1.0, 0)
    elif ty == 'smudge': add(fx, lp(thump(), 900) * .3, t, 1.0, .1)
    elif ty == 'heal':
        for i, p in enumerate(['D5', 'F#5', 'A5', 'D6']): ev.append((t + i * .09, 'harp', p, 1.6, .5, .2, .6))
    elif ty == 'bits':
        for i in range(8): add(fx, blip(1200 + i * 90, .04), t + i * .12, 1.0, .2)
    elif ty == 'reveal':
        for p, dt in [('D6', 0), ('F#6', .06), ('A6', .12), ('D7', .18)]: ev.append((t + dt, 'glockenspiel', p, 1.6, .6, .3, .7))
BEAT = 60 / 90
def bed(t0, t1, lead, notes, root):
    t = t0; i = 0
    while t < t1:
        ev.append((t, 'contrabass_pizz', root if i % 4 != 2 else root[:-1] + str(int(root[-1]) + 1), .6, .42, -.05, .8))
        if i % 2 == 0 or lead != 'guitar_nylon': ev.append((t, lead, notes[i % len(notes)], .9, .38, .2, .55))
        t += BEAT; i += 1
dv = [e['t'] for e in EV if e['type'] == 'dive']; back = [e['t'] for e in EV if e['type'] == 'back'][0]
bed(0.2, dv[0], 'guitar_nylon', ['D4', 'A4', 'D5', 'A4', 'F#4', 'A4'], 'D2')
bed(dv[0] + 1.6, dv[1], 'marimba', ['D5', 'F#5', 'A5', 'F#5', 'E5', 'G5', 'A5', 'D6'], 'G1')
bed(dv[1] + 1.6, dv[2], 'vibraphone', ['A4', 'D5', 'F#5', 'D5', 'B4', 'D5', 'A4', 'F#4'], 'B1')
bed(dv[2] + 1.6, back, 'glockenspiel', ['A5', 'D6', 'F#6', 'D6'], 'D2')
for i, p in enumerate(['A5', 'F#5', 'D5', 'A4', 'F#4', 'D4', 'A3', 'D3']): ev.append((back + i * .25, 'harp', p, 1.5, .5, .3 - .08 * i, .6))
bed(back + 2.8, DUR - 1.0, 'guitar_nylon', ['D4', 'A4', 'D5', 'A4', 'F#4', 'A4'], 'D2')
ev.append((DUR - 1.6, 'vibraphone', 'D4', 3.0, .5, 0, .6))
S.seed(3)
mus = S.render(ev, dur=N / SR, master=False); mus = S.room(mus, size=.35, mix=.16)[:N].astype(np.float32); mus = np.pad(mus, ((0, N - len(mus)), (0, 0)))
mus = mus - .5 * np.stack([bp(mus[:, c], 300, 4000, 2) for c in range(2)], 1).astype(np.float32)
def rms(x, m): return np.sqrt(np.mean(x[m] ** 2)) + 1e-12
mus *= (rms(vo, vmask) / rms(mus, vmask)) * 10 ** (-11 / 20); fx *= (rms(vo, vmask) / rms(fx, vmask)) * 10 ** (-10 / 20)
mix = (vo + mus + fx)[:int(DUR * SR)]; tt = np.arange(len(mix)) / SR; mix *= np.clip((DUR - tt) / 1.5, 0, 1)[:, None]
mix = np.stack([limit(mix[:, c], .9) for c in range(2)], 1); sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR); print('ok')
