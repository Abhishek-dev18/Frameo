#!/usr/bin/env python3
"""Life in Weeks — daily reel renderer.
usage: python3 render.py episode.json out.mp4
Self-contained: downloads Poppins fonts + Kokoro TTS model into ./assets on first run.
Needs: pip install --break-system-packages kokoro-onnx soundfile scipy numpy pillow ; ffmpeg on PATH.
2026-11-14: calmer voice (default speed 0.85, longer gaps between lines) at the user's request.
"""
import json, math, os, subprocess, sys, urllib.request
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import butter, sosfilt, fftconvolve

SPEC = json.load(open(sys.argv[1])); OUT = sys.argv[2]
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets"); os.makedirs(ASSETS, exist_ok=True)
DL = {
    "Poppins-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
    "Poppins-SemiBold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-SemiBold.ttf",
    "Poppins-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
    "kokoro.onnx": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx",
    "voices.bin": "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin",
}
for fn, url in DL.items():
    p = os.path.join(ASSETS, fn)
    if not os.path.exists(p): subprocess.run(["curl", "-sSL", "-o", p, url], check=True)
A = lambda f: os.path.join(ASSETS, f)

W, H, FPS, S, SR = 1080, 1920, 30, 2, 24000
BG = (246, 241, 232); INK = (30, 28, 34); MUTED = (110, 104, 112); EMPTY = (200, 190, 175); ACCENT = tuple(SPEC.get("accent", [190, 80, 60]))
VOICE = SPEC.get("voice", "am_michael"); SPEED = SPEC.get("speed", 0.85)
LINE_GAP = SPEC.get("line_gap", 0.85)
def F(n, s): return ImageFont.truetype(A(n), s)
def ease(t): t = min(1, max(0, t)); return t * t * (3 - 2 * t)
def eout(t): t = min(1, max(0, t)); return 1 - (1 - t) ** 3

# ---------------- voice ----------------
from kokoro_onnx import Kokoro
K = Kokoro(A("kokoro.onnx"), A("voices.bin"))
def tts(txt):
    s, sr = K.create(txt, voice=VOICE, speed=SPEED, lang="en-us"); s = s.astype(np.float64)
    return s / (np.abs(s).max() + 1e-9) * 0.9
v_hook = tts(SPEC["say_hook"]); v_lines = [tts(l["say"]) for l in SPEC["lines"]]; v_out = tts(SPEC["say_outro"])
dur = lambda x: len(x) / SR

# ---------------- timeline ----------------
T = {}
T["hook"] = (0.5, 0.5 + dur(v_hook))
T["grid_in"] = (1.2, 3.0)
fill_len = SPEC.get("fill_seconds", 6.5)
T["fill"] = (max(T["hook"][1], T["grid_in"][1]) + 0.4, None); T["fill"] = (T["fill"][0], T["fill"][0] + fill_len)
t = T["fill"][1] + 0.6; subs = []
for l, v in zip(SPEC["lines"], v_lines):
    subs.append((t, t + dur(v), l["show"], v)); t += dur(v) + LINE_GAP
T["outro"] = (t + 0.4, None); t_out_voice = T["outro"][0] + 0.7
TOTAL = max(30.0, t_out_voice + dur(v_out) + 2.0); T["outro"] = (T["outro"][0], TOTAL)
NF = int(TOTAL * FPS); N = int(TOTAL * SR)
print("duration", round(TOTAL, 1))

# ---------------- grid geometry ----------------
total = SPEC["total"]; cols = SPEC["cols"]; rows = math.ceil(total / cols)
GX0, GY0, GW, GH = 90, 390, 900, 1210
cell = min(GW / cols, GH / rows); gw, gh = cell * cols, cell * rows
gx = (W - gw) / 2; gy = GY0 + (GH - gh) / 2
seg_end = np.cumsum([s["count"] for s in SPEC["segments"]]); filled_total = int(seg_end[-1])
def dot_color(i):
    for e, s in zip(seg_end, SPEC["segments"]):
        if i < e: return tuple(s["color"])
    return None

def grid_img(kind):
    im = Image.new("RGB", (W * S, H * S), BG); d = ImageDraw.Draw(im); r = cell * S * .34
    for i in range(total):
        rr, cc = divmod(i, cols); cx = (gx + (cc + .5) * cell) * S; cy = (gy + (rr + .5) * cell) * S
        c = dot_color(i) if kind == "filled" else None
        if c: d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
        else: d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=EMPTY, width=max(1, int(cell * S * .09)))
    return np.asarray(im.resize((W, H), Image.LANCZOS))
G_EMPTY, G_FILL = grid_img("empty"), grid_img("filled")
yy, xx = np.mgrid[0:H, 0:W]
cc_ = np.floor((xx - gx) / cell).astype(int); rr_ = np.floor((yy - gy) / cell).astype(int)
IDX = np.where((cc_ >= 0) & (cc_ < cols) & (rr_ >= 0) & (rr_ < rows), rr_ * cols + cc_, -1)
IDX[IDX >= total] = -1
ROWV = np.where(IDX >= 0, IDX // cols, -1)
bg_base = np.full((H, W, 3), BG, np.uint8)
grain = np.random.default_rng(1).integers(-5, 6, (H, W, 1)).astype(np.int16)

# ---------------- audio ----------------
rng = np.random.default_rng(2); tt = np.arange(N) / SR
def lp(x, f): return sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)
def hp(x, f): return sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)
def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i]
def reverb(x, secs=1.2, wet=.2):
    n = int(secs * SR); ir = lp(rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.9 / secs), 5000)
    ir /= np.sqrt((ir ** 2).sum()); return x * (1 - wet) + fftconvolve(x, ir)[:len(x)] * wet * .6
voice = np.zeros(N); place(voice, reverb(v_hook, .8, .1), T["hook"][0])
for s0, s1, _, v in subs: place(voice, reverb(v, .8, .1), s0)
place(voice, reverb(v_out, .8, .1), t_out_voice)
sfx = np.zeros(N)
def tick(f, amp=1.0):
    n = int(.06 * SR); x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) * .6 + hp(rng.standard_normal(n), 3000) * .4) * np.exp(-x * 70) * amp
filled_rows = math.ceil(filled_total / cols); f0, f1 = T["fill"]
for r in range(filled_rows):  # one tick per filled row, rising pitch
    place(sfx, tick(900 + 900 * r / max(1, filled_rows), .5), f0 + (f1 - f0) * eout((r + 1) / filled_rows) ** 1.0)
for i in range(rows):  # soft pops as the empty grid draws in
    if i % 3 == 0: place(sfx, tick(500, .18), T["grid_in"][0] + (T["grid_in"][1] - T["grid_in"][0]) * i / rows)
def bell(f, d=2.5):
    x = np.arange(int(d * SR)) / SR; e = np.exp(-x * 2.5); return np.sin(2 * np.pi * f * x + 1.4 * e * np.sin(2 * np.pi * f * 2 * x)) * e
place(sfx, bell(880) * .5, f1 + .05)                    # "you are here"
place(sfx, reverb(bell(523, 4) + .6 * bell(784, 4), 2.5, .5) * .5, T["outro"][0])
whoosh = hp(rng.standard_normal(int(.7 * SR)), 800) * np.hanning(int(.7 * SR)); place(sfx, lp(whoosh, 4000) * .25, T["outro"][0] - .35)
music = np.zeros(N); midi = lambda m: 440 * 2 ** ((m - 69) / 12)
chords = SPEC.get("chords", [[41, 57, 60, 64], [45, 57, 60, 64], [38, 57, 60, 65], [46, 58, 62, 65]])
CH = 4.0
for k, c0 in enumerate(np.arange(0, TOTAL, CH)):
    ch = chords[k % len(chords)]; n = int((CH + 1.5) * SR); x = np.arange(n) / SR
    e = np.minimum(1, x / 1.0) * np.minimum(1, (CH + 1.5 - x) / 1.5)
    place(music, (sum(np.sin(2 * np.pi * midi(m) * x) for m in ch[1:]) * .1 + np.sin(2 * np.pi * midi(ch[0]) * x) * .12) * e, c0)
    for j, m in enumerate([ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12]):
        p = np.arange(int(1.6 * SR)) / SR
        place(music, (np.sin(2 * np.pi * midi(m) * p) + .3 * np.sin(4 * np.pi * midi(m) * p)) * np.exp(-p * 3.5) * .08, c0 + j * CH / 4)
music = reverb(lp(music, 3000), 2.5, .4)
fade = lambda n, a, r: np.minimum(1, np.minimum(np.arange(n) / (a * SR), (n - np.arange(n)) / (r * SR)))
music *= fade(N, 1.5, 2.5)
vp = np.zeros(N)
for a, b in [T["hook"]] + [(s[0], s[1]) for s in subs] + [(t_out_voice, t_out_voice + dur(v_out))]: vp[int((a - .15) * SR):int((b + .2) * SR)] = 1
duck = 1 - .5 * lp(vp, 4); db = lambda d: 10 ** (d / 20)
ref = np.sqrt((voice[vp > 0] ** 2).mean())
nrm = lambda x: x / (np.sqrt((x ** 2).mean()) + 1e-9)
mix = voice + nrm(sfx) * ref * db(-12) + nrm(music) * ref * db(-16) * duck
mix *= fade(N, .3, 1.5); mix /= np.abs(mix).max() / db(-1)
wav = OUT + ".wav"; sf.write(wav, mix.astype(np.float32), SR)

# ---------------- frames ----------------
f_kick, f_hook = F("Poppins-SemiBold.ttf", 30), F("Poppins-Bold.ttf", 64)
f_sub, f_cnt, f_cntu = F("Poppins-SemiBold.ttf", 44), F("Poppins-Bold.ttf", 76), F("Poppins-Regular.ttf", 32)
f_out, f_foot = F("Poppins-Bold.ttf", 96), F("Poppins-Regular.ttf", 28)
def ctext(d, y, txt, font, col, a=1.0, dy=0):
    w = d.textlength(txt, font=font); d.text(((W - w) / 2, y + dy), txt, font=font, fill=col + (int(255 * a),))
def wrap(d, txt, font, maxw):
    out, cur = [], ""
    for w_ in txt.split():
        tst = (cur + " " + w_).strip()
        if d.textlength(tst, font=font) <= maxw: cur = tst
        else: out.append(cur); cur = w_
    return out + [cur]
ep = SPEC["ep"]
ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                       "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                       "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-shortest", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
PREVIEW = [float(x) for x in os.environ.get("PREVIEW", "").split(",") if x]
frames = [int(p * FPS) for p in PREVIEW] if PREVIEW else range(NF)
for f in frames:
    t = f / FPS
    gi = eout((t - T["grid_in"][0]) / (T["grid_in"][1] - T["grid_in"][0]))
    rows_shown = gi * rows
    k = int(filled_total * eout((t - T["fill"][0]) / (T["fill"][1] - T["fill"][0]))) if t >= T["fill"][0] else 0
    arr = np.where((IDX >= 0)[..., None] & (ROWV < rows_shown)[..., None], np.where((IDX < k)[..., None], G_FILL, G_EMPTY), bg_base)
    outro = ease((t - T["outro"][0]) / .5)
    img = Image.fromarray(arr); d = ImageDraw.Draw(img, "RGBA")
    # "you are here" marker
    if SPEC.get("marker", True) and k >= filled_total and filled_total < total:
        i = filled_total; rr, cc = divmod(i, cols); cx = gx + (cc + .5) * cell; cy = gy + (rr + .5) * cell
        pt = t - T["fill"][1]; ring = cell * (.6 + 1.6 * ((pt * .8) % 1)); ra = 1 - ((pt * .8) % 1)
        d.ellipse([cx - ring, cy - ring, cx + ring, cy + ring], outline=INK + (int(180 * ra),), width=3)
        r = cell * .5 * (1 + .15 * math.sin(pt * 6)); d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=INK)
    # header
    a = ease((t - .2) / .5); ctext(d, 110, SPEC["kicker"] + f"  ·  #{ep}", f_kick, ACCENT, a, (1 - a) * 20)
    for j, ln in enumerate(SPEC["hook"]):
        a = ease((t - .4 - j * .25) / .5); ctext(d, 160 + j * 86, ln, f_hook, INK, a, (1 - a) * 30)
    # bottom area: counter during fill, then subtitles
    yb = gy + gh + 40
    if T["fill"][0] <= t < subs[0][0] - .1 if subs else T["outro"][0]:
        a = ease((t - T["fill"][0]) / .3) * (1 - ease((t - (subs[0][0] - .45)) / .3))
        ctext(d, yb, f"{k:,}", f_cnt, SPEC["segments"][0]["color"] and tuple(SPEC["segments"][-1]["color"]) if k else INK, a)
        ctext(d, yb + 100, SPEC.get("counter_unit", ""), f_cntu, MUTED, a)
    for s0, s1, txt, _ in subs:
        if s0 - .15 <= t <= s1 + .3:
            a = min(ease((t - s0 + .15) / .25), ease((s1 + .3 - t) / .25))
            for j, ln in enumerate(wrap(d, txt, f_sub, 900)):
                ctext(d, yb + 20 + j * 62, ln, f_sub, INK, a, (1 - a) * 12)
    if len(SPEC["segments"]) > 1 and t > T["fill"][1]:  # legend
        a = ease((t - T["fill"][1]) / .5); x0 = 90
        for s in SPEC["segments"]:
            lab = f"{s['label']} · {s['count']:,}"; d.ellipse([x0, 352, x0 + 18, 370], fill=tuple(s["color"]) + (int(255 * a),))
            d.text((x0 + 28, 345), lab, font=f_foot, fill=MUTED + (int(255 * a),)); x0 += 50 + d.textlength(lab, font=f_foot)
    # outro card
    if outro > 0:
        ov = Image.new("RGBA", (W, H), BG + (int(235 * outro),)); img = img.convert("RGBA"); img.alpha_composite(ov); d = ImageDraw.Draw(img, "RGBA")
        ys = 760
        for j, ln in enumerate(SPEC["outro"]):
            a = ease((t - T["outro"][0] - .2 - j * .25) / .5); ctext(d, ys + j * 120, ln, f_out, INK if j == 0 else ACCENT, a, (1 - a) * 30)
        a = ease((t - T["outro"][0] - 1.0) / .5)
        ctext(d, ys + 300, f"{SPEC['kicker'].title()}  ·  #{ep}", f_kick, MUTED, a)
        ctext(d, ys + 350, "Follow for tomorrow's dot.", f_kick, ACCENT, a)
        img = img.convert("RGB")
    if SPEC.get("footnote") and outro == 0:
        ImageDraw.Draw(img, "RGBA").text((W - 40 - d.textlength(SPEC["footnote"], font=f_foot), H - 70), SPEC["footnote"], font=f_foot, fill=MUTED + (160,))
    out = np.asarray(img.convert("RGB")).astype(np.int16) + grain
    if t < .3: out = out * ease(t / .3) + np.array(BG) * (1 - ease(t / .3))
    if t > TOTAL - .6: out = out * (1 - ease((t - TOTAL + .6) / .6)) + np.array(BG) * ease((t - TOTAL + .6) / .6)
    out = np.clip(out, 0, 255).astype(np.uint8)
    if PREVIEW: Image.fromarray(out).save(f"{OUT}_{t:.1f}.png"); continue
    ff.stdin.write(out.tobytes())
ff.stdin.close(); ff.wait(); os.remove(wav)
if PREVIEW and os.path.exists(OUT): os.remove(OUT)
print("done", OUT)
