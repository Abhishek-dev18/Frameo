# Original uplifting/motivational bed for Debug Diaries motivation reels (generated here, no copyright).
# Usage: python3 scripts/audio/motivation_music.py <seconds> <out.wav> [sections]
#   sections: comma-separated times "hit,drums,lift,drop" in seconds (default 8,19,34.7,45.8):
#   0..hit      dark intro (low pad, slow pulse), riser into an impact at `hit`
#   hit..drums  hopeful chords (C G Am F) + soft arp
#   drums..lift kick 4-on-floor, claps, hats, 16th arp, bass
#   lift..drop  brighter: octave lead, open hats; riser into `drop`
#   drop..end   full drop with crash, ring-out at the end
import sys, wave
import numpy as np

dur = float(sys.argv[1]); out_path = sys.argv[2]
hit, drums, lift, drop = [float(x) for x in (sys.argv[3] if len(sys.argv) > 3 else "8,19,34.7,45.8").split(",")]
sr = 44100
N = int(sr * dur)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(11)
bpm = 100; beat = 60 / bpm; bar = 4 * beat
midi = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(sig, start, pan=0.0):
    s = int(start * sr)
    if s >= N or s + len(sig) <= 0: return
    if s < 0: sig = sig[-s:]; s = 0
    n = min(len(sig), N - s)
    L[s:s+n] += sig[:n] * (1 - pan) ** 0.5 if pan > 0 else sig[:n]
    R[s:s+n] += sig[:n] * (1 + pan) ** 0.5 if pan < 0 else sig[:n]

def saw(f, n, det=0.0):
    tt = np.arange(n) / sr
    s = np.zeros(n)
    for d in (-det, 0, det):
        ph = (tt * f * (1 + d)) % 1.0
        s += 2 * ph - 1
    return s / 3

def lowpass(x, a):
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc); y[i] = acc
    return y

def lp_fast(x, a):
    # one-pole lowpass via cumulative trick (vectorised enough with scipy-free loop over blocks)
    from numpy.lib.stride_tricks import sliding_window_view  # noqa
    return lowpass(x, a)

def pad(notes, start, length, amp, bright):
    n = int(length * sr); tt = np.arange(n) / sr
    s = sum(saw(midi(m), n, 0.004) for m in notes) / len(notes)
    s = lowpass(s, bright)
    env = np.minimum(1, tt / 0.4) * np.minimum(1, (length - tt) / 0.4)
    add(amp * s * env, start)

def pluck(m, start, length, amp, pan=0.0):
    n = int(length * sr); tt = np.arange(n) / sr; f = midi(m)
    s = (np.sin(2*np.pi*f*tt) + 0.5*np.sin(2*np.pi*2*f*tt) + 0.25*np.sign(np.sin(2*np.pi*f*tt))*0.3)
    env = np.minimum(1, tt / 0.003) * np.exp(-tt * 9)
    add(amp * s * env, start, pan)

def piano(m, start, length, amp):
    n = int(length * sr); tt = np.arange(n) / sr; f = midi(m)
    s = np.sin(2*np.pi*f*tt) + 0.4*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*2) + 0.15*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*4)
    env = np.minimum(1, tt / 0.005) * np.exp(-tt * 1.4)
    add(amp * s * env, start)

def kick(start, amp):
    n = int(0.35 * sr); tt = np.arange(n) / sr
    f = 50 + 110 * np.exp(-tt * 30)
    s = np.sin(2*np.pi*np.cumsum(f)/sr) * np.exp(-tt * 9)
    add(amp * s, start)

def noise_hit(start, length, amp, decay, bright, pan=0.0):
    n = int(length * sr); tt = np.arange(n) / sr
    s = rng.standard_normal(n)
    s = s - lowpass(s, bright)  # highpass-ish
    add(amp * s * np.exp(-tt * decay), start, pan)

def clap(start, amp):
    for k, d in enumerate((0, 0.012, 0.024)):
        noise_hit(start + d, 0.18, amp * (0.6 if k < 2 else 1), 28, 0.25)

def riser(start, end, amp):
    n = int((end - start) * sr); tt = np.arange(n) / sr
    s = rng.standard_normal(n); s = s - lowpass(s, 0.05)
    env = (tt / (end - start)) ** 2.2
    sweep = np.sin(2*np.pi*np.cumsum(200 + 1400 * (tt/(end-start))**2)/sr) * 0.3
    add(amp * (s * 0.5 + sweep) * env, start)

def impact(start, amp):
    n = int(2.5 * sr); tt = np.arange(n) / sr
    boom = np.sin(2*np.pi*np.cumsum(38 + 80*np.exp(-tt*8))/sr) * np.exp(-tt * 1.8)
    add(amp * boom, start)
    noise_hit(start, 2.0, amp * 0.35, 2.2, 0.08)

def bass(m, start, length, amp):
    n = int(length * sr); tt = np.arange(n) / sr; f = midi(m)
    s = np.sin(2*np.pi*f*tt) + 0.3*np.sin(2*np.pi*2*f*tt)
    env = np.minimum(1, tt / 0.01) * np.minimum(1, (length - tt) / 0.05)
    add(amp * s * env, start)

CH = [[48, 52, 55, 60], [43, 50, 55, 59], [45, 52, 57, 60], [41, 48, 53, 57]]   # C G Am F (voicings)
ROOT = [36, 31, 33, 29]

# --- intro (dark): Am pad + slow piano + heartbeat
pad([45, 52, 57, 60], 0, hit + 0.3, 0.16, 0.02)
for i, t0 in enumerate(np.arange(0.2, hit - 0.5, beat * 2)):
    piano([69, 72, 76, 72][i % 4], t0, 2.0, 0.05)
for t0 in np.arange(0.4, hit - 0.6, beat * 2):
    kick(t0, 0.35); kick(t0 + 0.22, 0.2)
riser(hit - 2.0, hit, 0.18)
impact(hit, 0.7)

# --- progression from hit to end
b = 0; t0 = hit
while t0 < dur:
    c = CH[b % 4]; r = ROOT[b % 4]
    sec = 0 if t0 < drums else 1 if t0 < lift else 2 if t0 < drop else 3
    pad(c, t0, bar + 0.3, [0.34, 0.24, 0.30, 0.34][sec], [0.06, 0.07, 0.10, 0.12][sec])
    # arp
    step = beat / 2 if sec == 0 else beat / 4
    arp = [c[0] + 24, c[1] + 24, c[2] + 24, c[3] + 24, c[2] + 24, c[1] + 24]
    for k, ta in enumerate(np.arange(t0, t0 + bar - 1e-6, step)):
        if ta >= dur: break
        pluck(arp[k % len(arp)], ta, 0.4, [0.09, 0.05, 0.07, 0.08][sec], pan=(0.4 if k % 2 else -0.4))
    if sec >= 1:
        for k in range(4):
            tb = t0 + k * beat
            if tb >= dur - 0.2: break
            kick(tb, 0.6 if sec < 3 else 0.7)
            bass(r, tb + beat / 2, beat / 2 - 0.02, 0.16)
            if k % 2 == 1: clap(tb, 0.16)
            noise_hit(tb + beat / 2, 0.06 if sec < 2 else 0.18, 0.05, 60 if sec < 2 else 14, 0.5, pan=0.3)
            noise_hit(tb + beat / 4, 0.04, 0.025, 80, 0.6, pan=-0.3)
    if sec >= 2:
        lead = [c[3] + 12, c[2] + 12, c[3] + 12, c[1] + 24]
        for k in range(4):
            tb = t0 + k * beat
            if tb < dur: piano(lead[k] + 12, tb, 1.0, 0.09 if sec == 2 else 0.11)
    t0 += bar; b += 1

riser(drop - 2.4, drop, 0.22)
impact(drop, 0.55)
noise_hit(drop, 3.0, 0.22, 1.2, 0.3)          # crash
noise_hit(drums, 2.0, 0.12, 2.0, 0.3)          # small crash when drums enter

# fade out last 1.6 s
fade = np.ones(N); fl = int(1.6 * sr); fade[-fl:] = np.linspace(1, 0, fl)
L *= fade; R *= fade
st = np.stack([L, R], 1)
st = st / (np.abs(st).max() + 1e-9) * 0.89
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("wrote", out_path)
