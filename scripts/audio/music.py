# Original, generated lo-fi bed: soft electric-piano chords, sub bass, gentle kick + hat. 30 s, 44.1 kHz.
import numpy as np, wave
sr = 44100; dur = float(__import__("os").environ.get("DUR", 30.2)); bpm = 84; beat = 60 / bpm
t = np.arange(int(sr * dur)) / sr
out = np.zeros_like(t)
def note(f, start, length, amp, kind="keys"):
    s = int(start * sr); n = int(length * sr)
    if s >= len(t): return
    n = min(n, len(t) - s); tt = np.arange(n) / sr
    if kind == "keys":
        w = np.sin(2*np.pi*f*tt) + 0.35*np.sin(2*np.pi*2*f*tt)*np.exp(-tt*3) + 0.12*np.sin(2*np.pi*3*f*tt)*np.exp(-tt*5)
        env = np.minimum(1, tt / 0.02) * np.exp(-tt * 1.1)
    else:  # bass
        w = np.sin(2*np.pi*f*tt)
        env = np.minimum(1, tt / 0.01) * np.exp(-tt * 1.6)
    out[s:s+n] += amp * w * env
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]  # Am7 Fmaj7 Cmaj7 G7
bass = [45, 41, 36, 43]
bar = beat * 4
for b in range(int(dur / bar) + 1):
    c = chords[b % 4]
    for i, m in enumerate(c):
        note(midi(m), b * bar + i * 0.012, bar, 0.10, "keys")
        note(midi(m + 12), b * bar + beat * 2.5 + i * 0.01, beat * 1.5, 0.035, "keys")
    note(midi(bass[b % 4]), b * bar, beat * 2, 0.22, "bass")
    note(midi(bass[b % 4]), b * bar + beat * 2.5, beat * 1.5, 0.16, "bass")
rng = np.random.default_rng(7)
for k in range(int(dur / beat) + 1):
    s = int(k * beat * sr)
    # soft kick on 1 and 3
    if k % 2 == 0 and s < len(t):
        n = min(int(0.25 * sr), len(t) - s); tt = np.arange(n) / sr
        out[s:s+n] += 0.35 * np.sin(2*np.pi*(50 + 60*np.exp(-tt*30))*tt) * np.exp(-tt*12)
    # hats on off-beats
    for off in (0.5,):
        s2 = int((k + off) * beat * sr)
        if s2 < len(t):
            n = min(int(0.05 * sr), len(t) - s2)
            noise = rng.standard_normal(n); noise = np.diff(noise, prepend=0)  # brighter
            out[s2:s2+n] += 0.03 * noise * np.exp(-np.arange(n) / sr * 70)
# warmth: gentle low-pass (one-pole) + vinyl hiss
a = 0.35; y = np.zeros_like(out)
for i in range(1, len(out)): y[i] = y[i-1] + a * (out[i] - y[i-1])
y += 0.004 * rng.standard_normal(len(y))
fade = np.minimum(1, np.minimum(t / 1.0, (dur - t) / 1.5))
y *= fade; y /= np.max(np.abs(y)) * 1.12
with wave.open("out/music.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((y * 32767).astype(np.int16).tobytes())
print("music ok")
