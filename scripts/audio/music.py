# Original lo-fi background beds for PixelScript videos (no copyright: generated here).
# Usage: python3 scripts/audio/music.py <variant 0-2> <seconds> <out.wav>
import sys, wave
import numpy as np

variant = int(sys.argv[1]) if len(sys.argv) > 1 else 0
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 30.2
out_path = sys.argv[3] if len(sys.argv) > 3 else "music.wav"
VARIANTS = [
    # name, bpm, chord progression (MIDI), bass roots
    ("night-desk", 84, [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]], [45, 41, 36, 43]),   # Am7 Fmaj7 Cmaj7 G7
    ("blue-hour", 76, [[50, 53, 57, 60], [55, 58, 62, 65], [48, 52, 55, 58], [53, 57, 60, 64]], [38, 43, 36, 41]),   # Dm7 Gm7 C7 Fmaj7
    ("soft-loop", 92, [[52, 55, 59, 62], [48, 52, 55, 59], [55, 59, 62, 66], [50, 54, 57, 60]], [40, 36, 43, 38]),   # Em7 Cmaj7 Gmaj7 D7
]
name, bpm, chords, bass = VARIANTS[variant % len(VARIANTS)]
sr = 44100
beat = 60 / bpm
t = np.arange(int(sr * dur)) / sr
out = np.zeros_like(t)
rng = np.random.default_rng(7 + variant)

def note(f, start, length, amp, kind="keys"):
    s = int(start * sr); n = int(length * sr)
    if s >= len(t): return
    n = min(n, len(t) - s); tt = np.arange(n) / sr
    if kind == "keys":
        w = np.sin(2*np.pi*f*tt) + 0.35*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*3) + 0.12*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*5)
        env = np.minimum(1, tt / 0.02) * np.exp(-tt * 1.1)
    else:
        w = np.sin(2*np.pi*f*tt)
        env = np.minimum(1, tt / 0.01) * np.exp(-tt * 1.6)
    out[s:s+n] += amp * w * env

midi = lambda m: 440 * 2 ** ((m - 69) / 12)
bar = beat * 4
for b in range(int(dur / bar) + 1):
    c = chords[b % 4]
    for i, m in enumerate(c):
        note(midi(m), b * bar + i * 0.012, bar, 0.10)
        note(midi(m + 12), b * bar + beat * 2.5 + i * 0.01, beat * 1.5, 0.035)
    note(midi(bass[b % 4]), b * bar, beat * 2, 0.22, "bass")
    note(midi(bass[b % 4]), b * bar + beat * 2.5, beat * 1.5, 0.16, "bass")
for k in range(int(dur / beat) + 1):
    s = int(k * beat * sr)
    if k % 2 == 0 and s < len(t):
        n = min(int(0.25 * sr), len(t) - s); tt = np.arange(n) / sr
        out[s:s+n] += 0.35 * np.sin(2*np.pi*(50 + 60*np.exp(-tt*30))*tt) * np.exp(-tt*12)
    s2 = int((k + 0.5) * beat * sr)
    if s2 < len(t):
        n = min(int(0.05 * sr), len(t) - s2)
        noise = np.diff(rng.standard_normal(n), prepend=0)
        out[s2:s2+n] += 0.03 * noise * np.exp(-np.arange(n) / sr * 70)
a = 0.35; y = np.zeros_like(out)
for i in range(1, len(out)): y[i] = y[i-1] + a * (out[i] - y[i-1])
y += 0.004 * rng.standard_normal(len(y))
y *= np.minimum(1, np.minimum(t / 1.0, (dur - t) / 1.5))
y /= np.max(np.abs(y)) * 1.12
with wave.open(out_path, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print(name, round(dur, 1), "s ->", out_path)
