# Access Granted 03 — sound: soft upright piano chords, a vibraphone note per landing floor word,
# light foley (steps, badge beep, gate, door lamp, lock), Sarvam voice on top with the music ducked.
# usage: python3 mix.py   (reads events.json and ../../content/debug-diaries/iam-03/voice.wav, writes mix.wav)
import json, subprocess, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
ev = json.load(open(os.path.join(HERE, 'events.json')))
DUR, EV = ev['dur'], ev['ev']
N = int(DUR * SR)
VO = 0.3
rng = np.random.default_rng(3)

def tt(d): return np.arange(int(d * SR)) / SR
def add(buf, x, t, g=1.0, pan=0.0):
    i = int(t * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]
    buf[i:i + len(x), 0] += x * g * (1 - pan) ** .5
    buf[i:i + len(x), 1] += x * g * (1 + pan) ** .5
def hz(m): return 440 * 2 ** ((m - 69) / 12)

def piano(m, d=3.2, vel=.5):
    t = tt(d); f = hz(m); y = np.zeros_like(t)
    for k, a in enumerate([1, .45, .22, .12, .06], 1):
        y += a * np.sin(2 * np.pi * f * k * 1.0008 ** k * t) * np.exp(-t * (1.1 + .9 * k))
    att = np.minimum(1, t / .006)
    return y * att * vel * .35

def vib(m, d=2.2, vel=.5):
    t = tt(d); f = hz(m)
    y = np.sin(2 * np.pi * f * t) + .25 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 6)
    y *= np.exp(-t * 1.6) * (1 + .25 * np.sin(2 * np.pi * 5.5 * t)) * np.minimum(1, t / .003)
    return y * vel * .3

def noise_burst(d, lp=.0, decay=40):
    t = tt(d); n = rng.standard_normal(len(t))
    if lp:
        a = lp; y = np.zeros_like(n); s = 0.0
        for i in range(len(n)): s += a * (n[i] - s); y[i] = s
        n = y
    return n * np.exp(-t * decay)

def beep(f=1760, d=.12):
    t = tt(d); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .004) * np.minimum(1, (d - t) / .02) * .18

def thump(f=70, d=.25):
    t = tt(d); return np.sin(2 * np.pi * f * t * (1 - .4 * t)) * np.exp(-t * 18) * .5

music = np.zeros((N, 2)); fx = np.zeros((N, 2))
# progression in F major: F, Dm, Bb, C, Am, Bb (one chord per part), soft and spread
CH = [[53, 60, 65, 69], [50, 57, 62, 65], [46, 58, 62, 65], [48, 55, 60, 64], [45, 57, 60, 64], [46, 53, 62, 65]]
SCALE = [65, 67, 69, 72, 74, 77]
parts = [e for e in EV if e['type'] == 'chord']
for i, e in enumerate(parts):
    t0 = e['t']; t1 = parts[i + 1]['t'] if i + 1 < len(parts) else DUR
    beat = 0
    t = t0
    while t < t1 - .3:
        for j, m in enumerate(CH[e['i']]):
            add(music, piano(m, 3.5, .55 if beat == 0 else .32), t + j * .03, 1, (j - 1.5) * .2)
        t += 2.0; beat += 1
    add(music, piano(CH[e['i']][0] - 12, 4, .5), t0, 1)

ci = 0
for e in EV:
    ty, t = e['type'], e['t']
    if ty == 'char':
        m = SCALE[ci % len(SCALE)] + (12 if e.get('acc') else 0); ci += 1
        add(music, vib(m, 2.0, .55 if e.get('big') else .4), t, 1, .15)
    elif ty == 'step':
        add(fx, noise_burst(.07, .25, 60), t, .22, -.1)
    elif ty == 'beep':
        add(fx, beep(1760), t, 1); add(fx, beep(2350, .1), t + .13, 1)
    elif ty == 'lamp':
        add(fx, vib(84, 1.0, .35), t, 1, .2)
    elif ty == 'tick':
        add(fx, beep(1200, .05), t, .7)
    elif ty == 'gate':
        add(fx, noise_burst(.6, .05, 6) * .5, t, .5); add(fx, thump(110, .2), t + .55, .5)
    elif ty == 'door':
        add(fx, noise_burst(.7, .04, 5) * .5, t, .4)
    elif ty == 'lock':
        add(fx, thump(160, .12), t, .6); add(fx, noise_burst(.03, 0, 120), t, .25)
    elif ty == 'deny':
        add(fx, beep(440, .14), t, 1.2); add(fx, beep(370, .2), t + .18, 1.2)
    elif ty == 'slide':
        add(fx, noise_burst(.4, .08, 8) * .4, t, .4)
    elif ty == 'speak':
        pass

# voice
vw = os.path.join(HERE, '../../content/debug-diaries/iam-03/voice.wav')
raw = subprocess.run(['ffmpeg', '-v', '0', '-i', vw, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
voice = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
voice = voice / (np.abs(voice).max() + 1e-9) * .8
V = np.zeros(N); i0 = int(VO * SR); V[i0:i0 + len(voice)] = voice[: N - i0]
# ducking envelope from the voice level (music down ~14 dB under speech)
win = int(.05 * SR); env = np.sqrt(np.convolve(V ** 2, np.ones(win) / win, mode='same'))
on = (env > .02).astype(float)
k = int(.25 * SR); on = np.convolve(on, np.ones(k) / k, mode='same'); on = np.clip(on * 1.5, 0, 1)
duck = 1 - .8 * on
music *= duck[:, None]
fx *= (1 - .4 * on)[:, None]

out = music * .5 + fx * .6 + np.stack([V, V], 1) * .9
fade = np.ones(N); nf = int(1.0 * SR); fade[-nf:] = np.linspace(1, 0, nf)
out *= fade[:, None]
out /= max(1e-9, np.abs(out).max()) / .89
pcm = (out * 32767).astype('<i2')
import wave
with wave.open(os.path.join(HERE, 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('mix.wav', DUR, 's')
