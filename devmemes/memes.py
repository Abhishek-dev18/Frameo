"""Dev Memes for Debug Diaries — 3-beat kinetic reels (setup → twist → punch).
Usage: python3 memes.py <meme> [preview]
Timing: if memes/<meme>/p1.mp3..p3.mp3 exist, each scene lasts as long as its voice part.
"""
import sys, os, math, random, subprocess, json
from common import *

MINT, CORAL, WHITE, INK = hexc('#4ADE80'), hexc('#FF7A6B'), hexc('#FFFFFF'), hexc('#0B0B10')
MONO = 'DejaVu Sans Mono'
TR = 0.32  # transition length

def grad_bg(ctx, c1, c2, t=0, angle_speed=0.15):
    a = t * angle_speed
    x0 = W / 2 + math.cos(a) * W; y0 = H / 2 + math.sin(a) * H * 0.6
    g = cairo.LinearGradient(x0, y0, W - x0, H - y0)
    g.add_color_stop_rgba(0, *c1); g.add_color_stop_rgba(1, *c2)
    ctx.set_source(g); ctx.paint()

def blobs(ctx, t, col, n=5, seed=3):
    rng = random.Random(seed)
    for i in range(n):
        bx = rng.uniform(0, W); by = rng.uniform(0, H); r = rng.uniform(220, 420); sp = rng.uniform(0.3, 0.7)
        x = bx + math.sin(t * sp + i) * 90; y = by + math.cos(t * sp * 0.8 + i) * 120
        g = cairo.RadialGradient(x, y, 0, x, y, r)
        g.add_color_stop_rgba(0, col[0], col[1], col[2], 0.28); g.add_color_stop_rgba(1, col[0], col[1], col[2], 0)
        ctx.set_source(g); ctx.arc(x, y, r, 0, 2 * math.pi); ctx.fill()

def confetti_dots(ctx, t, alpha=0.18):
    rng = random.Random(11)
    for i in range(36):
        x = rng.uniform(0, W); sp = rng.uniform(30, 90); y = (rng.uniform(0, H) - t * sp) % H
        s = rng.uniform(4, 10)
        ctx.set_source_rgba(1, 1, 1, alpha)
        ctx.arc(x, y, s, 0, 2 * math.pi); ctx.fill()

def pill(ctx, x, y, s, size, fg, bg, font='Inter Display', bold=True, pad=28, alpha=1):
    ctx.select_font_face(font, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(size); e = ctx.text_extents(s)
    w = e.width + pad * 2; h = size * 1.7
    ctx.set_source_rgba(bg[0], bg[1], bg[2], bg[3] * alpha); rrect(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill()
    text(ctx, s, x, y + size * 0.36, size, fg, bold=bold, font=font, alpha=alpha)

def pop_scale(lt, t0, d=0.7, damp=7, freq=1.7):
    return spring(prog(lt, t0, d), damp, freq)

def slam(ctx, s, x, y, size, col, lt, t0, start_scale=2.4, font='Inter Display'):
    k = prog(lt, t0, 0.55)
    if k <= 0: return
    sc = start_scale - (start_scale - 1) * spring(k, 7, 1.6)
    ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc)
    text(ctx, s, 0, size * 0.35, size, col, font=font, alpha=clamp((lt - t0) / 0.06))
    ctx.restore()

def typed(s, lt, t0, cps=28):
    n = int(max(0, lt - t0) * cps)
    return s[:n]

def shake_xy(lt, t0, amp=24, decay=7):
    if lt < t0: return 0, 0
    d = lt - t0; a = amp * math.exp(-d * decay)
    return a * math.sin(d * 71), a * math.cos(d * 53)

def card(ctx, x, y, w, h, r, fill, shadow=True):
    if shadow:
        ctx.set_source_rgba(0, 0, 0, 0.28); rrect(ctx, x + 10, y + 18, w, h, r); ctx.fill()
    ctx.set_source_rgba(*fill); rrect(ctx, x, y, w, h, r); ctx.fill()

def terminal(ctx, x, y, w, h, lines, title='zsh'):
    card(ctx, x, y, w, h, 26, hexc('#11131A'))
    ctx.set_source_rgba(*hexc('#1E2130')); rrect(ctx, x, y, w, 64, 26); ctx.fill(); ctx.rectangle(x, y + 40, w, 24); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(x + 40 + i * 34, y + 32, 11, 0, 2 * math.pi); ctx.fill()
    text(ctx, title, x + w / 2, y + 42, 26, hexc('#8A8FA8'), font=MONO, bold=False)
    for i, (s, col) in enumerate(lines):
        text(ctx, s, x + 40, y + 130 + i * 62, 38, col, font=MONO, bold=False, align='left')

def footer(ctx, lt, L, accent):
    # series tag top + handle bottom (always on)
    pill(ctx, 540, 120, 'DEV MEMES', 30, INK, accent)
    text(ctx, '@debugdiaries.io', 540, 1830, 34, WHITE, alpha=0.75)

def end_cta(ctx, lt, L, accent):
    k = ease_out_cubic(prog(lt, L - 1.3, 0.4))
    if k <= 0: return
    pill(ctx, 540, 1700 + 40 * (1 - k), 'Follow  Debug Diaries', 42, INK, accent, alpha=k)

# =====================================================================
# MEME 1 — Friday deploy
# =====================================================================
def m1_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#7C3AED'), hexc('#1E1B4B'), lt); blobs(ctx, lt, hexc('#F0ABFC')); confetti_dots(ctx, lt)
    # calendar
    s = pop_scale(lt, 0.05)
    ctx.save(); ctx.translate(540, 470); ctx.scale(max(s, 1e-3), max(s, 1e-3)); ctx.rotate(-0.05)
    card(ctx, -230, -200, 460, 400, 40, hexc('#FFFFFF'))
    ctx.set_source_rgba(*hexc('#EF4444')); rrect(ctx, -230, -200, 460, 120, 40); ctx.fill(); ctx.rectangle(-230, -120, 460, 40); ctx.fill()
    text(ctx, 'FRIDAY', 0, -118, 64, WHITE)
    text(ctx, '6:00', 0, 90, 150, INK)
    text(ctx, 'PM', 0, 160, 50, hexc('#6B7280'))
    ctx.restore()
    # terminal
    k = ease_out_cubic(prog(lt, 0.35, 0.5))
    ctx.save(); ctx.translate(0, 80 * (1 - k))
    cmd = typed('$ git push origin main', lt, 0.6, 30)
    lines = [(cmd + ('_' if int(lt * 3) % 2 and len(cmd) < 22 else ''), WHITE)]
    if lt > 1.5: lines.append(('✓ deployed to prod', MINT))
    if lt > 1.8: lines.append(('✓ tests green. merge.', MINT))
    if k > 0: terminal(ctx, 90, 820, 900, 360, lines)
    ctx.restore()
    if lt > 1.5:
        kk = ease_out_cubic(prog(lt, 1.5, 0.4))
        text(ctx, '"sirf 1 line ka change hai"', 540, 1400 + 30 * (1 - kk), 54, WHITE, alpha=kk)

def m1_s2(ctx, lt, L):
    pulse = 0.5 + 0.5 * math.sin(lt * 14)
    grad_bg(ctx, hexc('#7F1D1D'), hexc('#09090B'), lt)
    g = cairo.RadialGradient(540, 960, 300, 540, 960, 1300)
    g.add_color_stop_rgba(0, 1, 0, 0, 0); g.add_color_stop_rgba(1, 1, 0.1, 0.1, 0.35 + 0.25 * pulse)
    ctx.set_source(g); ctx.paint()
    slam(ctx, 'SAT  2:00 AM', 540, 300, 110, WHITE, lt, 0.0)
    # phone
    sx, sy = (math.sin(lt * 90) * 6, math.cos(lt * 77) * 3) if lt > 0.3 else (0, 0)
    ps = pop_scale(lt, 0.15)
    ctx.save(); ctx.translate(540 + sx, 1030 + sy); ctx.scale(max(ps, 1e-3), max(ps, 1e-3))
    card(ctx, -260, -480, 520, 960, 70, hexc('#0F0F14'))
    ctx.set_source_rgba(*hexc('#3F3F46')); ctx.set_line_width(8); rrect(ctx, -260, -480, 520, 960, 70); ctx.stroke()
    ctx.set_source_rgba(0, 0, 0, 1); rrect(ctx, -70, -460, 140, 34, 17); ctx.fill()
    alerts = [('CPU 100%', 'api-prod-3'), ('5xx errors  +900%', 'checkout'), ('Database: too many', 'connections'),
              ('PagerDuty x47', 'escalated'), ('17 missed calls', 'Manager')]
    for i, (a, b) in enumerate(alerts):
        ak = prog(lt, 0.45 + i * 0.32, 0.45)
        if ak <= 0: continue
        sp = spring(ak, 8, 1.6)
        y = -360 + i * 160
        ctx.save(); ctx.translate(0, y - 60 * (1 - sp)); ctx.scale(0.8 + 0.2 * sp, 0.8 + 0.2 * sp)
        col = CORAL if i < 4 else hexc('#FACC15')
        card(ctx, -230, -62, 460, 130, 28, hexc('#1F1F27'), shadow=False)
        ctx.set_source_rgba(*col); rrect(ctx, -230, -62, 14, 130, 7); ctx.fill()
        text(ctx, a, -190, -8, 38, WHITE, align='left')
        text(ctx, b, -190, 40, 28, hexc('#A1A1AA'), bold=False, align='left')
        ctx.restore()
    ctx.restore()

def m1_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#FACC15'), hexc('#F97316'), lt); blobs(ctx, lt, hexc('#FFFFFF'), 4, 9)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, 60 * (1 - k))
    cmd = typed('$ git blame checkout.js', lt, 0.15, 34)
    lines = [(cmd, WHITE)]
    if lt > 1.15: lines.append(('you (obviously)', CORAL))
    terminal(ctx, 90, 330, 900, 300, lines, 'who did this?')
    ctx.restore()
    sx, sy = shake_xy(lt, 1.5, 30)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '...main', 540, 900, 190, INK, lt, 1.5)
    slam(ctx, 'hi tha.', 540, 1110, 190, INK, lt, 1.75)
    ctx.restore()
    # sweat-drop face (simple, original)
    fk = pop_scale(lt, 2.1)
    if fk > 0:
        ctx.save(); ctx.translate(540, 1390); ctx.scale(fk, fk)
        ctx.set_source_rgba(*hexc('#FDE047')); ctx.arc(0, 0, 90, 0, 2 * math.pi); ctx.fill()
        ctx.set_source_rgba(*INK); ctx.set_line_width(9)
        ctx.arc(-32, -10, 14, math.pi, 2 * math.pi); ctx.stroke(); ctx.arc(32, -10, 14, math.pi, 2 * math.pi); ctx.stroke()
        ctx.arc(0, 22, 36, 0.15 * math.pi, 0.85 * math.pi); ctx.stroke()
        ctx.set_source_rgba(*hexc('#60A5FA')); ctx.move_to(70, -80); ctx.curve_to(90, -50, 100, -30, 82, -18); ctx.curve_to(64, -10, 52, -40, 70, -80); ctx.fill()
        ctx.restore()

M1 = dict(scenes=[m1_s1, m1_s2, m1_s3], default=[3.0, 3.0, 3.6], accent=hexc('#4ADE80'),
          sfx=lambda tr, c: (tr.add(c[0] + 0.05, pop(500, 1000), 0.6), [tr.add(c[0] + 0.6 + i / 30, blip(1800, 0.02), 0.12) for i in range(0, 22, 2)],
                             tr.add(c[0] + 1.5, chime((880, 1318.5), 0.8), 0.5),
                             tr.add(c[1], thump(90, 0.5), 1.0), tr.add(c[1] + 0.3, buzz(110, 2.5), 0.35),
                             [tr.add(c[1] + 0.45 + i * 0.32, blip(988, 0.09, 'sine'), 0.6) for i in range(5)],
                             [tr.add(c[2] + 0.15 + i / 34, blip(1700, 0.02), 0.1) for i in range(0, 27, 2)],
                             tr.add(c[2] + 1.5, thump(120), 0.9), tr.add(c[2] + 1.75, thump(100), 0.9), tr.add(c[2] + 2.1, pop(900, 400, 0.25), 0.5)))

# =====================================================================
# MEME 2 — "bas 5 minute ka kaam hai"
# =====================================================================
def bubble(ctx, s, x, y, right, fill, fg, lt, t0, size=46, label=None):
    k = pop_scale(lt, t0, 0.6, 8, 1.8)
    if k <= 0: return
    ctx.select_font_face('Inter Display', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(size)
    e = ctx.text_extents(s); w = e.width + 70; h = 120
    bx = x - w if right else x
    ctx.save(); ctx.translate(bx + (w if right else 0), y); ctx.scale(k, k); ctx.translate(-(bx + (w if right else 0)), -y)
    card(ctx, bx, y - h / 2, w, h, 40, fill)
    text(ctx, s, bx + 35, y + size * 0.35, size, fg, align='left')
    if label: text(ctx, label, bx + (w - 10 if right else 10), y - h / 2 - 18, 28, WHITE, bold=False, align='right' if right else 'left', alpha=0.8)
    ctx.restore()

def m2_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#F97316'), hexc('#DB2777'), lt); blobs(ctx, lt, hexc('#FDE68A')); confetti_dots(ctx, lt)
    bubble(ctx, 'Ye bug kab tak fix hoga?', 90, 520, False, hexc('#FFFFFF'), INK, lt, 0.1, label='Manager')
    bubble(ctx, 'bas 5 minute ka kaam hai', 990, 760, True, hexc('#22C55E'), WHITE, lt, 1.0, 50, label='You')
    if lt > 1.5:
        text(ctx, 'Seen ✓✓', 990, 860, 28, WHITE, font=MONO, bold=False, align='right', alpha=0.8)
    s = pop_scale(lt, 1.7)
    if s > 0:
        ctx.save(); ctx.translate(540, 1240); ctx.scale(s, s); ctx.rotate(-0.06)
        text(ctx, '5:00', 0, 80, 260, WHITE)
        ctx.restore()
        text(ctx, 'confidence: 100%', 540, 1420, 44, hexc('#FEF3C7'), font=MONO, bold=False, alpha=clamp(s))

def m2_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#1E1B4B'), hexc('#0F172A'), lt); blobs(ctx, lt, hexc('#6366F1'), 4)
    # accelerating clock
    speed = 2 + lt ** 2.2 * 6
    ang = (lt * speed)
    cx, cy, R = 540, 470, 210
    ctx.set_source_rgba(1, 1, 1, 0.08); ctx.arc(cx, cy, R + 20, 0, 2 * math.pi); ctx.fill()
    ctx.set_source_rgba(*WHITE); ctx.set_line_width(10); ctx.arc(cx, cy, R, 0, 2 * math.pi); ctx.stroke()
    for i in range(12):
        a = i * math.pi / 6; ctx.move_to(cx + math.cos(a) * (R - 30), cy + math.sin(a) * (R - 30)); ctx.line_to(cx + math.cos(a) * (R - 10), cy + math.sin(a) * (R - 10))
    ctx.set_line_width(6); ctx.stroke()
    for ln, sp, wdt, col in ((R * 0.55, 1 / 12, 14, WHITE), (R * 0.82, 1, 8, hexc('#FB7185'))):
        a = ang * sp * 2 * math.pi - math.pi / 2
        ctx.set_source_rgba(*col); ctx.set_line_width(wdt); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.move_to(cx, cy); ctx.line_to(cx + math.cos(a) * ln, cy + math.sin(a) * ln); ctx.stroke()
    # elapsed counter
    frac = clamp(lt / max(L - 0.3, 0.1)) ** 2.4
    secs = int(300 + frac * (5 * 3600 - 300))
    text(ctx, f'{secs // 3600:01d}h {secs % 3600 // 60:02d}m', 540, 790, 80, hexc('#FB7185'), font=MONO)
    tasks = [('$ npm install', WHITE), ('ERR peer dependency conflict', CORAL), ('StackOverflow (2014): try sudo', hexc('#FACC15')),
             ('$ rm -rf node_modules', WHITE), ('still broken.', CORAL)]
    for i, (s, col) in enumerate(tasks):
        k = prog(lt, 0.25 + i * (L - 0.6) / 5, 0.4)
        if k <= 0: continue
        sp = spring(k, 8, 1.7); side = -1 if i % 2 == 0 else 1
        x = 540 + side * 700 * (1 - sp); y = 920 + i * 150
        ctx.save(); ctx.translate(x, y); ctx.rotate(side * 0.03)
        card(ctx, -420, -55, 840, 110, 26, hexc('#11131A'))
        text(ctx, s, -380, 14, 38, col, font=MONO, bold=False, align='left')
        ctx.restore()

def m2_s3(ctx, lt, L):
    ctx.set_source_rgba(*INK); ctx.paint(); blobs(ctx, lt, hexc('#DB2777'), 4, 5)
    slam(ctx, 'ESTIMATE', 540, 420, 80, hexc('#A1A1AA'), lt, 0.05, 1.6)
    k1 = ease_out_cubic(prog(lt, 0.3, 0.4))
    card(ctx, 90, 500, 900, 120, 30, hexc('#1F1F27'), False)
    ctx.set_source_rgba(*MINT); rrect(ctx, 90, 500, max(60, 900 * 0.017 * 4 * k1), 120, 30); ctx.fill()
    text(ctx, '5 min', 990 - 40, 580, 60, MINT, align='right', alpha=k1)
    slam(ctx, 'REALITY', 540, 820, 80, hexc('#A1A1AA'), lt, 0.8, 1.6)
    k2 = ease_in_out(prog(lt, 1.05, 0.9))
    card(ctx, 90, 900, 900, 120, 30, hexc('#1F1F27'), False)
    if k2 > 0:
        ctx.set_source_rgba(*CORAL); rrect(ctx, 90, 900, max(60, 900 * k2), 120, 30); ctx.fill()
    sx, sy = shake_xy(lt, 1.95, 26)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '5 GHANTE', 540, 1220, 170, CORAL, lt, 1.95)
    ctx.restore()
    k3 = ease_out_cubic(prog(lt, 2.4, 0.4))
    text(ctx, 'fix: npm cache clean --force', 540, 1400, 48, hexc('#A1A1AA'), font=MONO, bold=False, alpha=k3)

M2 = dict(scenes=[m2_s1, m2_s2, m2_s3], default=[3.0, 3.4, 3.8], accent=hexc('#FDE68A'),
          sfx=lambda tr, c: (tr.add(c[0] + 0.1, pop(700, 1100), 0.6), tr.add(c[0] + 1.0, pop(500, 1300), 0.7),
                             tr.add(c[0] + 1.7, thump(150), 0.7),
                             [tr.add(c[1] + x, blip(1400, 0.03), 0.25) for x in np.cumsum(np.maximum(0.035, 0.3 * np.exp(-np.arange(60) / 14)))
                              if x < c[2] - c[1]],
                             [tr.add(c[1] + 0.25 + i * (c[2] - c[1] - 0.6) / 5, whoosh(0.3), 0.35) for i in range(5)],
                             tr.add(c[2] + 0.3, chime((880,), 0.5), 0.4), tr.add(c[2] + 1.05, whoosh(0.9), 0.5),
                             tr.add(c[2] + 1.95, thump(85, 0.6), 1.0), tr.add(c[2] + 1.95, buzz(98, 0.8), 0.4)))

# =====================================================================
# MEME 3 — Works in Chrome
# =====================================================================
LAYOUT = [  # x, y, w, h, kind
    (0, 0, 820, 80, 'nav'), (60, 140, 700, 90, 'h1'), (60, 250, 520, 40, 'p'), (60, 310, 600, 40, 'p'),
    (40, 400, 240, 260, 'c'), (290, 400, 240, 260, 'c'), (540, 400, 240, 260, 'c'), (260, 720, 300, 100, 'btn'),
]
def browser(ctx, lt, title, broken_t0=None, glow=None):
    bx, by, bw, bh = 130, 360, 820, 1000
    ctx.save()
    card(ctx, bx, by, bw, bh, 30, hexc('#FFFFFF'))
    ctx.set_source_rgba(*hexc('#E5E7EB')); rrect(ctx, bx, by, bw, 80, 30); ctx.fill(); ctx.rectangle(bx, by + 50, bw, 30); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(bx + 40 + i * 32, by + 40, 10, 0, 2 * math.pi); ctx.fill()
    card(ctx, bx + 150, by + 18, 520, 44, 22, hexc('#FFFFFF'), False)
    text(ctx, title, bx + 410, by + 50, 26, hexc('#374151'), font=MONO, bold=False)
    cols = {'nav': '#111827', 'h1': '#2563EB', 'p': '#D1D5DB', 'c': '#DBEAFE', 'btn': '#22C55E'}
    rng = random.Random(4)
    for i, (x, y, w, h, kind) in enumerate(LAYOUT):
        dx = dy = rot = 0
        if broken_t0 is not None:
            d = max(0, lt - broken_t0 - i * 0.07)
            vx = rng.uniform(-260, 260); vr = rng.uniform(-1.6, 1.6)
            if kind == 'btn': vx, vr = 900, 3
            dy = 0.5 * 2600 * d * d * (0.4 if kind == 'nav' else 1); dx = vx * d; rot = vr * d
            if kind == 'h1': dx, dy, rot = 120 * min(d, 0.3) * 3, 230 * min(1, d * 3), 0.12 * min(1, d * 3)
        cx, cy = bx + x + w / 2 + dx, by + 80 + 30 + y + h / 2 + dy
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot)
        ctx.set_source_rgba(*hexc(cols[kind])); rrect(ctx, -w / 2, -h / 2, w, h, 10 if kind != 'nav' else 0); ctx.fill()
        if kind == 'h1': text(ctx, 'Ship faster.', 0, 22, 64, WHITE)
        if kind == 'btn': text(ctx, 'Buy now', 0, 14, 40, WHITE)
        if kind == 'c':
            ctx.set_source_rgba(*hexc('#3B82F6')); ctx.arc(0, -50, 46, 0, 2 * math.pi); ctx.fill()
            ctx.set_source_rgba(*hexc('#93C5FD')); rrect(ctx, -80, 30, 160, 22, 8); ctx.fill(); rrect(ctx, -80, 70, 110, 22, 8); ctx.fill()
        ctx.restore()
    ctx.restore()

def m3_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#06B6D4'), hexc('#2563EB'), lt); blobs(ctx, lt, hexc('#A5F3FC')); confetti_dots(ctx, lt)
    k = spring(prog(lt, 0.0, 0.8), 7, 1.5)
    ctx.save(); ctx.translate(540, 860); ctx.scale(0.7 + 0.3 * k, 0.7 + 0.3 * k); ctx.translate(-540, -860)
    browser(ctx, lt, 'localhost:3000  ·  Chrome')
    ctx.restore()
    s = pop_scale(lt, 1.4, 0.7)
    if s > 0:
        ctx.save(); ctx.translate(800, 1350); ctx.rotate(-0.18); ctx.scale(s, s)
        ctx.set_source_rgba(*MINT); ctx.set_line_width(12); rrect(ctx, -230, -80, 460, 160, 30); ctx.stroke()
        text(ctx, 'PERFECT ✓', 0, 26, 74, MINT, font=MONO)
        ctx.restore()

def m3_s2(ctx, lt, L):
    k = prog(lt, 0.4, 1.0)
    grad_bg(ctx, hexc('#2563EB'), hexc('#7F1D1D'), lt); blobs(ctx, lt, hexc('#FCA5A5'), 4)
    browser(ctx, lt, 'demo  ·  Safari (iPhone)', broken_t0=0.55)
    kk = ease_out_cubic(prog(lt, 0.1, 0.4))
    text(ctx, 'demo mein client ne Safari khola...', 540, 280 + 20 * (1 - kk), 56, WHITE, alpha=kk)
    if lt > 1.4:
        s = pop_scale(lt, 1.4)
        ctx.save(); ctx.translate(540, 1500); ctx.scale(s, s)
        pill(ctx, 0, 0, 'display: flex  →  display: chaos', 40, WHITE, CORAL, font=MONO, bold=False)
        ctx.restore()

def m3_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#C026D3'), hexc('#1E1B4B'), lt); blobs(ctx, lt, hexc('#F0ABFC'), 5, 2)
    slam(ctx, 'SAFARI:', 540, 700, 200, WHITE, lt, 0.1)
    sx, sy = shake_xy(lt, 0.7, 30)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '= naya IE', 540, 960, 160, hexc('#FDE047'), lt, 0.7)
    ctx.restore()
    k = ease_out_cubic(prog(lt, 1.4, 0.5))
    lines = ['-webkit-', '-webkit-', '-webkit-']
    for i, s in enumerate(lines):
        kk = ease_out_cubic(prog(lt, 1.4 + i * 0.15, 0.4))
        text(ctx, s, 540 + (i - 1) * 300, 1250 + 20 * (1 - kk), 44, WHITE, font=MONO, bold=False, alpha=kk * 0.85)
    text(ctx, 'works everywhere. except there.', 540, 1360, 40, hexc('#E9D5FF'), bold=False, alpha=ease_out_cubic(prog(lt, 1.9, 0.5)))

M3 = dict(scenes=[m3_s1, m3_s2, m3_s3], default=[3.0, 3.2, 3.6], accent=hexc('#F0ABFC'),
          sfx=lambda tr, c: (tr.add(c[0], whoosh(0.5), 0.4), tr.add(c[0] + 1.4, thump(160), 0.8), tr.add(c[0] + 1.45, chime((1046.5, 1568), 0.8), 0.5),
                             tr.add(c[1] + 0.55, noise_burst(0.5), 0.6),
                             [tr.add(c[1] + 0.6 + i * 0.09, thump(260 - i * 18, 0.25), 0.55) for i in range(8)],
                             tr.add(c[1] + 1.4, buzz(130, 0.6), 0.4),
                             tr.add(c[2] + 0.1, thump(120), 0.9), tr.add(c[2] + 0.7, thump(95, 0.5), 1.0),
                             [tr.add(c[2] + 1.4 + i * 0.15, blip(660 + i * 220, 0.08, 'sine'), 0.4) for i in range(3)]))

MEMES = {'friday': M1, 'fivemin': M2, 'safari': M3}
OUTNAMES = {'friday': 'meme01_friday_deploy', 'fivemin': 'meme02_5_minute_ka_kaam', 'safari': 'meme03_works_in_chrome'}

# New memes live in episodes/NN_<name>.py. Each file is exec'd with this module's helpers in scope
# and must define NAME (folder under memes/), OUTNAME (e.g. 'meme04_xyz') and M (same shape as M1).
import glob as _glob
for _f in sorted(_glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'episodes', '*.py'))):
    _ns = dict(globals()); exec(compile(open(_f).read(), _f, 'exec'), _ns)
    MEMES[_ns['NAME']] = _ns['M']; OUTNAMES[_ns['NAME']] = _ns['OUTNAME']

# =====================================================================
def voice_durs(name):
    d = os.path.join('memes', name)
    ps = [os.path.join(d, f'p{i}.mp3') for i in (1, 2, 3)]
    if not all(os.path.exists(p) for p in ps): return None
    out = []
    for p in ps:
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True)
        out.append(float(r.stdout.strip()))
    return out

def build(name, preview=False):
    M = MEMES[name]
    vd = voice_durs(name)
    if vd:
        lens = [max(d + 0.25, m) for d, m in zip(vd, [2.4, 2.6, 2.9])]
        lens[-1] += 1.0  # room for CTA after the last line
    else:
        lens = M['default']
    cuts = [0.0]
    for L in lens: cuts.append(cuts[-1] + L)
    dur = cuts[-1]
    scenes = M['scenes']

    def draw_scene(ctx, i, t):
        lt = t - cuts[i]; L = lens[i]; D = M['default'][i]
        sc = D / L if i < len(scenes) - 1 else D / max(L - 1.0, 0.1) if vd else 1.0
        scenes[i](ctx, lt * sc, D)
        footer(ctx, lt, L, M['accent'])
        if i == len(scenes) - 1: end_cta(ctx, lt, L, M['accent'])

    def draw(ctx, t):
        i = max(j for j in range(len(scenes)) if cuts[j] <= t)
        if i > 0 and t < cuts[i] + TR:
            k = ease_in_out((t - cuts[i]) / TR)
            ctx.save(); ctx.translate(-W * k, 0); draw_scene(ctx, i - 1, t); ctx.restore()
            ctx.save(); ctx.translate(W * (1 - k), 0); draw_scene(ctx, i, t); ctx.restore()
        else:
            draw_scene(ctx, i, t)

    def post(arr, t):
        g = 0
        for c in cuts[1:-1]:
            if c <= t < c + TR: g = 1 - abs((t - c) / TR - 0.5) * 2
        if name == 'safari' and cuts[1] + 0.55 <= t < cuts[1] + 1.0:
            g = max(g, 1 - prog(t, cuts[1] + 0.55, 0.45))
        if g <= 0.01: return arr
        out = arr.copy(); sh = int(6 + 30 * g)
        out[:, :, 2] = np.roll(arr[:, :, 2], sh, axis=1); out[:, :, 0] = np.roll(arr[:, :, 0], -sh, axis=1)
        rng = random.Random(int(t * 1000))
        for _ in range(int(3 + 8 * g)):
            y = rng.randrange(0, H - 80); h = rng.randrange(8, 70)
            out[y:y + h] = np.roll(out[y:y + h], rng.randrange(-int(150 * g) - 1, int(150 * g) + 1), axis=1)
        return out

    if preview:
        ts = []
        for i in range(3):
            ts += [cuts[i] + lens[i] * 0.75]
        ts += [cuts[1] + TR / 2, dur - 0.3]
        return [still(name, t, draw, post) for t in ts]

    os.makedirs('out', exist_ok=True)
    v = f'out/{name}_video.mp4'
    if not (os.environ.get('MUX_ONLY') and os.path.exists(v)):
        v = render(name, dur, draw, post=post)
    # sfx
    tr = Track(dur)
    for c in cuts[1:-1]: tr.add(c - 0.05, whoosh(TR + 0.1), 0.5)
    tr.add(dur - 1.3, pop(600, 1200), 0.5)
    M['sfx'](tr, cuts)
    tr.save(f'out/{name}_sfx.wav')
    # music bed
    subprocess.run(['python3', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'scripts', 'audio', 'music.py'), str(list(MEMES).index(name) % 3), f'{dur:.2f}', f'out/{name}_bed.wav'], check=True, capture_output=True)
    final = f'out/{OUTNAMES[name]}.mp4'
    inputs = ['-i', v, '-i', f'out/{name}_sfx.wav', '-i', f'out/{name}_bed.wav']
    fc = (f"[1:a]aresample=48000,volume=0.9,apad,atrim=0:{dur}[s];"
          f"[2:a]aresample=48000,volume=0.35,apad,atrim=0:{dur},afade=t=out:st={dur - 1.2}:d=1.2[m];")
    if vd:
        # voice parts placed at each scene start (+0.08s)
        for i in range(3):
            inputs += ['-i', f'memes/{name}/p{i + 1}.mp3']
        for i in range(3):
            fc += f"[{3 + i}:a]aresample=48000,adelay={int((cuts[i] + 0.08) * 1000)}:all=1[v{i}];"
        fc += f"[v0][v1][v2]amix=inputs=3:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,aresample=48000,apad,atrim=0:{dur},asplit=2[vo][vk];"
        fc += "[m][vk]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[md];"
        fc += "[vo]asplit=2[vo1][vo2];" if False else ""
        fc += "[s]volume=0.6[s2];[md][s2][vo]amix=inputs=3:normalize=0,alimiter=limit=0.95[o]"
    else:
        fc += "[m][s]amix=inputs=2:normalize=0,alimiter=limit=0.95[o]"
    tmp = final.replace('.mp4', '.tmp.mp4')
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *inputs, '-filter_complex', fc, '-map', '0:v:0', '-map', '[o]',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-shortest', tmp])
    if r.returncode == 0: os.replace(tmp, final)
    return final, dur, bool(vd)

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    name = sys.argv[1]
    res = build(name, preview=(sys.argv[2:] == ['preview']))
    print(res)
