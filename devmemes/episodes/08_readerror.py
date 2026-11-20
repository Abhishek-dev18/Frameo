# MEME 8 — Build fails, 400-line stack trace → paste it all into AI, reinstall Node, clear cache, 20 min gone → line 1 already said it: typo in the import
NAME = 'readerror'
OUTNAME = 'meme08_read_the_error'

YEL = hexc('#FDE047')
GREY = hexc('#8A8FA8')

TRACE = [
    ('$ npm run build', WHITE),
    ("Error: Cannot find module './utlis'", CORAL),
    ('Require stack:', hexc('#FACC15')),
]
_fr = ['Module._resolveFilename', 'Module._load', 'Module.require', 'require (node:internal)',
       'Object.<anonymous> (src/app.js)', 'Module._compile', 'loadESM (node:internal)',
       'webpack/lib/Compiler.js', 'runLoaders (loader-runner)', 'processTicksAndRejections']
for _i in range(60):
    TRACE.append(('    at ' + _fr[_i % len(_fr)], hexc('#9CA3AF') if _i % 3 else hexc('#D1D5DB')))

def re_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#4F46E5'), hexc('#0EA5E9'), lt); blobs(ctx, lt, hexc('#A5B4FC')); confetti_dots(ctx, lt)
    kk = ease_out_cubic(prog(lt, 0.0, 0.4))
    text(ctx, 'build time.', 540, 280 + 20 * (1 - kk), 62, WHITE, alpha=kk)
    s = spring(prog(lt, 0.05, 0.8), 7, 1.5)
    if s <= 0: return
    x, y, w, h = 90, 360, 900, 900
    ctx.save(); ctx.translate(540, 810); ctx.scale(0.75 + 0.25 * s, 0.75 + 0.25 * s); ctx.translate(-540, -810)
    card(ctx, x, y, w, h, 26, hexc('#11131A'))
    ctx.set_source_rgba(*hexc('#1E2130')); rrect(ctx, x, y, w, 64, 26); ctx.fill(); ctx.rectangle(x, y + 40, w, 24); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(x + 40 + i * 34, y + 32, 11, 0, 2 * math.pi); ctx.fill()
    text(ctx, 'zsh — build', x + w / 2, y + 42, 26, GREY, font=MONO, bold=False)
    # scrolling stack trace
    ctx.save(); ctx.rectangle(x, y + 70, w, h - 80); ctx.clip()
    n_vis = int(max(0, lt - 0.25) * 40) + 1
    sc = 52 * max(0, (lt - 0.9)) ** 1.6 * 9 if lt > 0.9 else 0
    for i, (sline, col) in enumerate(TRACE[:n_vis]):
        yy = y + 130 + i * 52 - sc
        if yy < y + 40 or yy > y + h + 40: continue
        text(ctx, sline, x + 36, yy, 30, col, font=MONO, bold=False, align='left')
    ctx.restore()
    # scrollbar
    if lt > 0.9:
        f = clamp(sc / (52 * 55))
        ctx.set_source_rgba(1, 1, 1, 0.35); rrect(ctx, x + w - 22, y + 90 + f * (h - 220), 10, 110, 5); ctx.fill()
    ctx.restore()
    # line counter
    cnt = int(clamp((lt - 0.6) / 1.5) ** 1.5 * 400)
    if lt > 0.6:
        pill(ctx, 540, 1340, f'{max(cnt, 3)} / 400 lines', 44, WHITE, hexc('#111827'), font=MONO)
    pk = pop_scale(lt, 2.25)
    if pk > 0:
        ctx.save(); ctx.translate(540, 1500); ctx.scale(pk, pk); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'padhega kaun? scroll scroll', 46, INK, YEL)
        ctx.restore()

def ai_card(ctx, lt, t0):
    k = pop_scale(lt, t0, 0.6, 8, 1.8)
    if k <= 0: return
    ctx.save(); ctx.translate(90, 560); ctx.scale(k, k)
    card(ctx, 0, 0, 760, 330, 40, hexc('#FFFFFF'))
    text(ctx, 'AI', -2, -22, 28, WHITE, bold=False, align='left', alpha=0.8)
    text(ctx, 'Great question! Try these:', 40, 70, 40, INK, align='left')
    for i, s in enumerate(('1. reinstall Node', '2. clear npm cache', '3. delete node_modules')):
        if lt > t0 + 0.35 + i * 0.18:
            text(ctx, s, 40, 140 + i * 60, 36, hexc('#374151'), font=MONO, bold=False, align='left')
    ctx.restore()

def re_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#F97316'), hexc('#BE123C'), lt); blobs(ctx, lt, hexc('#FED7AA'), 4, 6)
    bubble(ctx, 'Ctrl+V  (400 lines)', 990, 410, True, hexc('#111827'), WHITE, lt, 0.05, 46, label='You')
    ai_card(ctx, lt, 0.6)
    tries = ['$ nvm install 20', '$ npm cache clean --force', '$ rm -rf node_modules']
    for i, s in enumerate(tries):
        k = prog(lt, 1.35 + i * 0.32, 0.4)
        if k <= 0: continue
        sp = spring(k, 8, 1.7); side = -1 if i % 2 == 0 else 1
        cx = 540 + side * 700 * (1 - sp); cy = 1010 + i * 135
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(side * 0.025)
        card(ctx, -440, -52, 880, 104, 24, hexc('#11131A'))
        text(ctx, s, -400, 12, 36, WHITE, font=MONO, bold=False, align='left')
        if lt > 1.35 + i * 0.32 + 0.25:
            pill(ctx, 340, 0, 'still fail', 26, WHITE, CORAL, pad=18)
        ctx.restore()
    mins = int(clamp((lt - 1.3) / 1.6) * 20)
    if lt > 1.3:
        ctx.save(); ctx.translate(540, 1500); s = pop_scale(lt, 1.3); ctx.scale(s, s)
        text(ctx, f'{mins:02d}:00 min', 0, 40, 110, WHITE, font=MONO)
        ctx.restore()

def re_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#DB2777'), hexc('#4C1D95'), lt); blobs(ctx, lt, hexc('#F0ABFC'), 5, 2); confetti_dots(ctx, lt, 0.2)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, -60 * (1 - k))
    cmd = typed('$ scroll to top...', lt, 0.05, 30)
    lines = [(cmd, GREY)]
    if lt > 0.6: lines.append(("Error: Cannot find module", CORAL))
    if lt > 0.75: lines.append(("       './utlis'", CORAL))
    terminal(ctx, 90, 250, 900, 340, lines, 'line 1')
    if lt > 1.0:  # circle the typo
        ck = ease_out_cubic(prog(lt, 1.0, 0.35))
        ctx.set_source_rgba(*YEL); ctx.set_line_width(7); ctx.new_path()
        ctx.save(); ctx.translate(90 + 40 + 9.5 * 23 + 60, 250 + 130 + 2 * 62 - 13); ctx.scale(1.0, 0.36)
        ctx.arc(0, 0, 105, -math.pi / 2, -math.pi / 2 + 2 * math.pi * ck); ctx.restore(); ctx.stroke()
    if lt > 1.25:
        tk = ease_out_cubic(prog(lt, 1.25, 0.3))
        pill(ctx, 540, 660 + 20 * (1 - tk), "utlis  →  utils", 44, INK, MINT, font=MONO, alpha=tk)
    ctx.restore()
    sx, sy = shake_xy(lt, 1.9, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'error ne bataya tha.', 540, 900, 84, WHITE, lt, 1.6)
    slam(ctx, 'MAINE', 540, 1080, 170, YEL, lt, 1.9)
    slam(ctx, 'PADHA NAHI.', 540, 1260, 140, WHITE, lt, 2.15)
    ctx.restore()
    s = pop_scale(lt, 2.7)
    if s > 0:
        ctx.save(); ctx.translate(540, 1480); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'answer was in line 1. always.', 42, WHITE, hexc('#111827'), font=MONO)
        ctx.restore()

M = dict(scenes=[re_s1, re_s2, re_s3], default=[3.0, 3.2, 3.6], accent=YEL,
         sfx=lambda tr, c: (tr.add(c[0] + 0.05, pop(500, 1000), 0.6),
                            [tr.add(c[0] + 0.25 + i / 40, blip(1600, 0.015), 0.08) for i in range(0, 30, 2)],
                            [tr.add(c[0] + x, blip(1200, 0.02), 0.15) for x in 0.9 + np.cumsum(np.maximum(0.03, 0.18 * np.exp(-np.arange(40) / 8)))
                             if x < c[1] - c[0] - 0.4],
                            tr.add(c[0] + 2.25, pop(700, 1200), 0.6),
                            tr.add(c[1] + 0.05, pop(600, 1100), 0.6), tr.add(c[1] + 0.6, chime((880, 1318.5), 0.6), 0.4),
                            [tr.add(c[1] + 1.35 + i * 0.32, whoosh(0.3), 0.35) for i in range(3)],
                            [tr.add(c[1] + 1.6 + i * 0.32, buzz(120, 0.25), 0.3) for i in range(3)],
                            [tr.add(c[1] + 1.3 + i * 0.16, blip(900, 0.03), 0.2) for i in range(10)],
                            [tr.add(c[2] + 0.05 + i / 30, blip(1700, 0.02), 0.1) for i in range(0, 18, 2)],
                            tr.add(c[2] + 1.0, whoosh(0.35), 0.4), tr.add(c[2] + 1.25, chime((1046.5,), 0.4), 0.4),
                            tr.add(c[2] + 1.6, thump(140, 0.3), 0.7), tr.add(c[2] + 1.9, thump(90, 0.6), 1.0),
                            tr.add(c[2] + 1.9, buzz(98, 0.6), 0.35), tr.add(c[2] + 2.15, thump(110, 0.3), 0.8),
                            tr.add(c[2] + 2.7, pop(900, 500, 0.2), 0.5)))
