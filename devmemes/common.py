import math, os, subprocess, wave
import numpy as np
import cairo

W, H, FPS = 1080, 1920, 30
SR = 44100

# ---------- easing ----------
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def prog(t, start, dur):
    return clamp((t - start) / dur)

def ease_out_cubic(x):
    return 1 - (1 - x) ** 3

def ease_in_out(x):
    return 4 * x * x * x if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2

def spring(x, damp=6.0, freq=2.2):
    """0->1 with overshoot."""
    if x <= 0:
        return 0.0
    if x >= 1.5:
        return 1.0
    return 1 - math.exp(-damp * x) * math.cos(freq * 2 * math.pi * x)

def hexc(h, a=1.0):
    h = h.lstrip('#')
    return (int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255, a)

# ---------- drawing helpers ----------
def rrect(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x + r, y + r, r, math.pi, 3 * math.pi / 2)
    ctx.close_path()

def text(ctx, s, x, y, size, color, bold=True, align='center', font='Inter Display', alpha=1.0):
    ctx.select_font_face(font, cairo.FONT_SLANT_NORMAL,
                         cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size)
    ext = ctx.text_extents(s)
    if align == 'center':
        px = x - (ext.width / 2 + ext.x_bearing)
    elif align == 'right':
        px = x - (ext.width + ext.x_bearing)
    else:
        px = x
    r, g, b, a = color
    ctx.set_source_rgba(r, g, b, a * alpha)
    ctx.move_to(px, y)
    ctx.show_text(s)
    return ext

def glow_circle(ctx, x, y, r, color, glow=4.0):
    cr, cg, cb, _ = color
    grad = cairo.RadialGradient(x, y, 0, x, y, r * glow)
    grad.add_color_stop_rgba(0, cr, cg, cb, 0.55)
    grad.add_color_stop_rgba(1, cr, cg, cb, 0)
    ctx.set_source(grad)
    ctx.arc(x, y, r * glow, 0, 2 * math.pi)
    ctx.fill()
    ctx.set_source_rgba(1, 1, 1, 1)
    ctx.arc(x, y, r * 0.55, 0, 2 * math.pi)
    ctx.fill()
    ctx.set_source_rgba(cr, cg, cb, 1)
    ctx.arc(x, y, r, 0, 2 * math.pi)
    ctx.set_line_width(4)
    ctx.stroke()

def new_frame():
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    return surf, cairo.Context(surf)

# ---------- render ----------
def render(name, duration, draw, out_dir='out', post=None):
    os.makedirs(out_dir, exist_ok=True)
    final = os.path.join(out_dir, f'{name}_video.mp4')
    tmp = os.path.join(out_dir, f'{name}_video.tmp.mp4')
    n = int(round(duration * FPS))
    p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgra',
                          '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-crf', '19', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', tmp],
                         stdin=subprocess.PIPE)
    for i in range(n):
        t = i / FPS
        surf, ctx = new_frame()
        draw(ctx, t)
        surf.flush()
        buf = surf.get_data()
        if post is not None:
            arr = np.ndarray((H, W, 4), dtype=np.uint8, buffer=buf).copy()
            arr = post(arr, t)
            p.stdin.write(arr.tobytes())
        else:
            p.stdin.write(bytes(buf))
    p.stdin.close()
    if p.wait() == 0:
        os.replace(tmp, final)
    return final

def still(name, t, draw, post=None, out_dir='preview'):
    os.makedirs(out_dir, exist_ok=True)
    surf, ctx = new_frame()
    draw(ctx, t)
    surf.flush()
    if post is not None:
        arr = np.ndarray((H, W, 4), dtype=np.uint8, buffer=surf.get_data()).copy()
        arr = post(arr, t)
        surf = cairo.ImageSurface.create_for_data(bytearray(arr.tobytes()), cairo.FORMAT_ARGB32, W, H)
    path = os.path.join(out_dir, f'{name}_{t:.1f}.png')
    surf.write_to_png(path)
    return path

# ---------- audio ----------
class Track:
    def __init__(self, duration):
        self.buf = np.zeros(int(duration * SR) + SR, dtype=np.float64)
        self.duration = duration

    def add(self, t, sig, gain=1.0):
        i = int(t * SR)
        end = min(len(self.buf), i + len(sig))
        if end > i:
            self.buf[i:end] += sig[:end - i] * gain

    def save(self, path):
        b = self.buf[:int(self.duration * SR)]
        peak = np.max(np.abs(b)) or 1
        b = b / peak * 0.85
        pcm = (b * 32767).astype(np.int16)
        with wave.open(path, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes(pcm.tobytes())

def _t(d):
    return np.arange(int(d * SR)) / SR

def pop(f0=600, f1=1200, d=0.12):
    t = _t(d)
    f = np.linspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 28)

def blip(f, d=0.06, shape='tri'):
    t = _t(d)
    if shape == 'tri':
        s = 2 * np.abs(2 * ((t * f) % 1) - 1) - 1
    else:
        s = np.sin(2 * np.pi * f * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 35)
    return s * env

def thump(f0=140, d=0.35):
    t = _t(d)
    f = f0 * np.exp(-t * 9) + 40
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = np.random.randn(len(t)) * np.exp(-t * 300) * 0.4
    return (np.sin(ph) * np.exp(-t * 9) + click)

def whoosh(d=0.6, up=True):
    t = _t(d)
    n = np.random.randn(len(t))
    # simple one-pole lowpass with moving cutoff
    out = np.zeros_like(n)
    a_vals = np.linspace(0.02, 0.35, len(t)) if up else np.linspace(0.35, 0.02, len(t))
    y = 0.0
    for i in range(len(n)):
        y += a_vals[i] * (n[i] - y)
        out[i] = y
    env = np.sin(np.pi * t / d) ** 2
    return out * env * 2.5

def noise_burst(d=0.25):
    t = _t(d)
    s = np.random.randn(len(t)) * (np.sign(np.sin(2 * np.pi * 37 * t)) * 0.5 + 0.5)
    return s * np.exp(-t * 6) * 0.6

def buzz(f=110, d=0.6):
    t = _t(d)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.5 + np.sign(np.sin(2 * np.pi * f * 1.01 * t)) * 0.5
    env = np.minimum(1, t / 0.01) * np.exp(-t * 3)
    return s * env * 0.5

def chime(freqs=(880, 1108.7, 1318.5), d=1.6, spread=0.07):
    t = _t(d + spread * len(freqs))
    out = np.zeros_like(t)
    for k, f in enumerate(freqs):
        st = int(k * spread * SR)
        tt = t[:len(t) - st]
        s = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 3.2)
        out[st:] += s
    return out / len(freqs)

def mux(video, wav, out):
    tmp = out.replace('.mp4', '.tmp.mp4')
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-i', wav, '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', tmp])
    if r.returncode == 0:
        os.replace(tmp, out)
    return out
