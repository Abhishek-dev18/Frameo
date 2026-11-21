# Original cinematic / epic motivational bed for Debug Diaries "Mindset" reels (synthesised here, no copyright).
# Usage: python3 scripts/audio/motivation_music.py <seconds> <out.wav> <marks>
#   marks = "hit,drums,lift,gap,final,run,end" in seconds:
#     0..hit-1   dark intro: heartbeat, clock tick, drone, sparse felt piano   (the 2 AM moment)
#     hit        reverse swell into a BRAAM + sub boom                          (the "RUKO!" turn)
#     hit..drums hopeful strings Dm-Bb-F-C, piano ostinato, soft toms
#     drums..lift taiko groove, string ostinato, bass pulse, cymbal swells
#     lift..gap  everything up: high strings, choir pad, snare roll building
#     gap..final near-silence (only a riser): the breath before the drop
#     final      impact; full arrangement; extra hit at `run`; hard final hit at `end`, ring out
# Built from research on motivational/cinematic scoring: rising energy (risers, sweeps), arrival accents
# (impacts/booms on downbeats), a pause before the drop, and a hard musical ending under the CTA.
import sys, wave
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

dur = float(sys.argv[1]); out_path = sys.argv[2]
hit, drums, lift, gap, final, run, end = [float(x) for x in sys.argv[3].split(",")]
sr = 44100; N = int(sr * dur)
rng = np.random.default_rng(21)
bpm = 80; beat = 60 / bpm; bar = 4 * beat
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
dry = np.zeros((N, 2)); wet = np.zeros((N, 2))   # wet goes through reverb

def lp(x, fc, o=2): return sosfilt(butter(o, fc / (sr / 2), "low", output="sos"), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc / (sr / 2), "high", output="sos"), x)

def put(sig, start, pan=0.0, rev=0.3, amp=1.0):
    s = int(start * sr)
    if s >= N or len(sig) == 0: return
    if s < 0: sig = sig[-s:]; s = 0
    n = min(len(sig), N - s); x = sig[:n] * amp
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    for buf, g in ((dry, 1 - rev), (wet, rev)):
        buf[s:s+n, 0] += x * gl * g * 1.41; buf[s:s+n, 1] += x * gr * g * 1.41

def tt(n): return np.arange(n) / sr

def saw_stack(freqs, n, det=0.006, voices=5):
    t = tt(n); s = np.zeros(n)
    for f in freqs:
        for v in range(voices):
            d = (v - (voices - 1) / 2) / ((voices - 1) / 2) * det
            ph = rng.random()
            s += 2 * ((t * f * (1 + d) + ph) % 1.0) - 1
    return s / (len(freqs) * voices)

def strings(notes, start, length, amp, bright=1800, att=0.6):
    n = int(length * sr); t = tt(n)
    s = lp(saw_stack([midi(m) for m in notes], n), bright, 2)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5 * t)
    env = np.minimum(1, t / att) * np.minimum(1, np.maximum(0, length - t) / 0.5)
    put(s * env * vib, start, 0, 0.55, amp)

def choir(notes, start, length, amp):
    n = int(length * sr); t = tt(n)
    base = saw_stack([midi(m) for m in notes], n, 0.004, 3)
    s = sum(sosfilt(butter(2, [f0 * 0.85 / (sr / 2), f0 * 1.15 / (sr / 2)], "band", output="sos"), base) * g
            for f0, g in ((700, 1.0), (1150, 0.6), (2600, 0.25)))  # "aah" formants
    env = np.minimum(1, t / 0.9) * np.minimum(1, np.maximum(0, length - t) / 0.6)
    put(s * env * 3, start, 0, 0.7, amp)

def piano(m, start, amp, length=2.5, pan=0.0):
    n = int(length * sr); t = tt(n); f = midi(m)
    s = (np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*2*f*t)*np.exp(-t*3) + 0.2*np.sin(2*np.pi*3*f*t)*np.exp(-t*6)
         + 0.08*np.sin(2*np.pi*4.02*f*t)*np.exp(-t*9))
    env = np.minimum(1, t / 0.004) * np.exp(-t * 1.5)
    put(lp(s * env, 3500), start, pan, 0.45, amp)

def stac(m, start, amp, pan):
    n = int(0.22 * sr); t = tt(n)
    s = lp(saw_stack([midi(m)], n, 0.005, 3), 2600)
    put(s * np.minimum(1, t / 0.01) * np.exp(-t * 14), start, pan, 0.3, amp)

def bass(m, start, length, amp):
    n = int(length * sr); t = tt(n); f = midi(m)
    s = lp(np.sin(2*np.pi*f*t) + 0.4*(2*((t*f) % 1) - 1), 400)
    put(s * np.minimum(1, t / 0.01) * np.exp(-t * 3), start, 0, 0.05, amp)

def tom(start, amp, f0=70, dec=6, pan=0.0):
    n = int(1.2 * sr); t = tt(n)
    body = np.sin(2 * np.pi * np.cumsum(f0 + f0 * 1.2 * np.exp(-t * 25)) / sr) * np.exp(-t * dec)
    skin = lp(rng.standard_normal(n), 1800) * np.exp(-t * 40) * 0.5
    put(body + skin, start, pan, 0.35, amp)

def heartbeat(start, amp):
    for d, a in ((0, 1.0), (0.24, 0.65)):
        n = int(0.4 * sr); t = tt(n)
        put(lp(np.sin(2*np.pi*np.cumsum(42 + 30*np.exp(-t*30))/sr) * np.exp(-t * 11), 160), start + d, 0, 0.1, amp * a)

def tick(start, amp):
    n = int(0.03 * sr); t = tt(n)
    put(hp(rng.standard_normal(n), 3000) * np.exp(-t * 300), start, 0.3, 0.2, amp)

def snare(start, amp):
    n = int(0.4 * sr); t = tt(n)
    s = hp(rng.standard_normal(n), 900) * np.exp(-t * 14) + np.sin(2*np.pi*190*t) * np.exp(-t * 20) * 0.6
    put(s, start, 0, 0.35, amp)

def cym_swell(start, end, amp):
    n = int((end - start) * sr); t = tt(n)
    put(hp(rng.standard_normal(n), 5000) * (t / (end - start)) ** 3, start, 0, 0.5, amp)

def riser(start, end, amp):
    n = int((end - start) * sr); t = tt(n); x = t / (end - start)
    nz = hp(rng.standard_normal(n), 800) * x ** 2.5
    tone = saw_stack([110 * 2 ** (2 * x)], n, 0.01, 3) * x ** 2   # glides up two octaves
    put(lp(nz * 0.5 + tone, 6000), start, 0, 0.5, amp)

def whoosh(start, amp, length=0.7):
    n = int(length * sr); t = tt(n); x = t / length
    s = rng.standard_normal(n); out = np.zeros(n)
    for i in range(0, n, 2048):   # sweeping band
        fc = 300 + 4000 * np.sin(np.pi * min(1, i / n)) ; seg = s[i:i+2048]
        out[i:i+len(seg)] = sosfilt(butter(2, [fc*0.7/(sr/2), min(0.99, fc*1.3/(sr/2))], "band", output="sos"), seg)
    put(out * np.sin(np.pi * x) ** 2, start, 0, 0.4, amp)

def braam(start, amp, notes=(26, 38, 45, 50)):
    n = int(3.5 * sr); t = tt(n)
    s = saw_stack([midi(m) for m in notes], n, 0.012, 5)
    s = sosfilt(butter(2, 900 / (sr / 2), "low", output="sos"), s)
    env = np.minimum(1, t / 0.03) * np.exp(-t * 0.9)
    sub = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t * 6)) / sr) * np.exp(-t * 1.2)
    put(s * env * 1.6 + sub * 0.9, start, 0, 0.4, amp)
    put(hp(rng.standard_normal(int(2.5 * sr)), 2000) * np.exp(-tt(int(2.5 * sr)) * 2.2), start, 0, 0.6, amp * 0.25)

def reverse_swell(start, end, amp):
    n = int((end - start) * sr); t = tt(n); x = t / (end - start)
    s = lp(saw_stack([midi(50), midi(57), midi(62)], n, 0.01, 4), 2000) * x ** 3
    put(s, start, 0, 0.6, amp)

PROG = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64]]   # Dm Bb F C
ROOT = [38, 34, 41, 36]

# ---- intro: 2 AM
strings([38, 45], 0, hit - 0.9, 0.35, 500, 1.5)                  # low drone
for t0 in np.arange(0.3, hit - 1.0, 1.5): heartbeat(t0, 0.9)
for t0 in np.arange(0.0, hit - 1.0, 0.75): tick(t0, 0.12)
for i, t0 in enumerate(np.arange(0.5, hit - 1.2, beat * 2)):
    piano([62, 65, 69, 65, 64, 62][i % 6], t0, 0.16, pan=-0.2)
reverse_swell(hit - 1.1, hit, 0.6); riser(hit - 1.4, hit, 0.25)
braam(hit, 1.0)

# ---- sections from the hit onward (bar grid anchored at the hit)
b = 0; t0 = hit
while t0 < dur:
    c = PROG[b % 4]; r = ROOT[b % 4]
    in_gap = gap <= t0 < final
    sec = 0 if t0 < drums else 1 if t0 < lift else 2 if t0 < gap else 3
    if not in_gap:
        L = min(bar + 0.4, max(0.1, (gap if t0 < gap else dur) - t0 + 0.2))
        strings(c, t0, L, [0.28, 0.30, 0.34, 0.40][sec], [1400, 2000, 2800, 3400][sec])
        strings([c[0] - 12], t0, L, [0.18, 0.22, 0.26, 0.30][sec], 700)
        if sec >= 2: choir([c[1] + 12, c[2] + 12], t0, L, 0.22 if sec == 2 else 0.28)
        if sec >= 2: strings([c[3] + 24, c[2] + 24], t0, L, 0.10, 4500)
        for k in range(8):                                   # piano / string ostinato in 8ths or 16ths
            for sub in ((0,) if sec == 0 else (0, 0.5)):
                ta = t0 + (k + sub) * beat / 2
                if ta >= dur or (t0 < gap <= ta): continue
                m = [c[0] + 12, c[2] + 12, c[1] + 12, c[2] + 12][(k * 2 + int(sub * 2)) % 4]
                if sec == 0: piano(m, ta, 0.12, 1.5, pan=0.25 if k % 2 else -0.25)
                else: stac(m + 12, ta, 0.06 if sec == 1 else 0.075, 0.4 if k % 2 else -0.4)
        if sec == 0: tom(t0, 0.35, 60, 5)
        else:
            pattern = [(0, 0.9, 62), (1.5, 0.55, 75), (2, 0.8, 62), (3, 0.5, 90), (3.5, 0.6, 80)]
            for pb, a, f0 in pattern:
                ta = t0 + pb * beat
                if ta < dur and not (t0 < gap <= ta): tom(ta, a * (0.75 if sec == 1 else 0.95), f0, 6, pan=(0.2 if f0 > 70 else -0.1))
            for k in range(8):
                ta = t0 + k * beat / 2
                if ta < dur and not (t0 < gap <= ta): bass(r, ta, beat / 2, 0.30 if sec < 3 else 0.36)
            if sec >= 2:
                for k in (1, 3):
                    ta = t0 + k * beat
                    if ta < dur and not (t0 < gap <= ta): snare(ta, 0.30)
    t0 += bar; b += 1

cym_swell(drums - 1.5, drums, 0.25); tom(drums, 1.0, 50, 3); whoosh(drums - 0.5, 0.3)
cym_swell(lift - 1.5, lift, 0.3); braam(lift, 0.55, (38, 50, 57)); whoosh(lift - 0.5, 0.3)
for i, ta in enumerate(np.arange(gap - 2.4, gap, 1 / 12)):          # snare roll building into the gap
    snare(ta, 0.05 + 0.25 * (i / 29) ** 2)
riser(gap, final, 0.55); reverse_swell(final - 0.9, final, 0.5)       # breath before the drop
braam(final, 1.0); tom(final, 1.0, 45, 2.5); cym_swell(final, final + 0.05, 0.0)
put(hp(rng.standard_normal(int(3 * sr)), 4000) * np.exp(-tt(int(3 * sr)) * 1.3), final, 0, 0.6, 0.35)   # crash
braam(run, 0.7, (38, 45, 50, 57)); whoosh(run - 0.4, 0.3)
braam(end, 1.1, (26, 38, 50, 57, 62)); tom(end, 1.0, 45, 2)

# ---- reverb (synthetic hall IR) and hard ending
irn = int(2.4 * sr); ir_t = tt(irn)
ir = np.stack([rng.standard_normal(irn), rng.standard_normal(irn)], 1) * np.exp(-ir_t * 2.6)[:, None]
ir[:, 0] = lp(ir[:, 0], 6000); ir[:, 1] = lp(ir[:, 1], 6000)
rv = np.stack([fftconvolve(wet[:, i], ir[:, i])[:N] for i in range(2)], 1) * 0.06
mixd = dry + rv
cut = int(end * sr)                                       # after the last hit: only its tail
tail = np.ones(N); tl = N - cut
if tl > 0: tail[cut:] = np.exp(-np.arange(tl) / sr * 0.9)
mixd *= tail[:, None]
fade = np.ones(N); fl = int(0.25 * sr); fade[-fl:] = np.linspace(1, 0, fl); mixd *= fade[:, None]
mixd = np.tanh(mixd / (np.abs(mixd).max() + 1e-9) * 1.4) / np.tanh(1.4) * 0.9
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((mixd * 32767).astype(np.int16).tobytes())
print("wrote", out_path)
