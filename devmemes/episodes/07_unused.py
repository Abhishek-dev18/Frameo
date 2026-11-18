# MEME 7 — IDE says the variable is unused → delete one line → 37 tests fail, total: undefined → put it back, "DO NOT TOUCH", now I'm legacy too
NAME = 'unused'
OUTNAME = 'meme07_unused_line'

CODE_FS = 32
GREY = hexc('#6B7280')
KW, FN, STR, PL = hexc('#C084FC'), hexc('#60A5FA'), hexc('#FBBF24'), hexc('#E5E7EB')

def editor(ctx, x, y, w, h, title='checkout.ts'):
    card(ctx, x, y, w, h, 26, hexc('#151824'))
    ctx.set_source_rgba(*hexc('#1E2233')); rrect(ctx, x, y, w, 64, 26); ctx.fill(); ctx.rectangle(x, y + 40, w, 24); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(x + 40 + i * 34, y + 32, 11, 0, 2 * math.pi); ctx.fill()
    text(ctx, title, x + w / 2, y + 42, 26, hexc('#8A8FA8'), font=MONO, bold=False)

def code_line(ctx, x, y, n, parts, alpha=1.0):
    text(ctx, str(n), x + 60, y, 26, hexc('#4B5068'), font=MONO, bold=False, align='right', alpha=alpha)
    ctx.select_font_face(MONO, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL); ctx.set_font_size(CODE_FS)
    cx = x + 90
    for s, col in parts:
        text(ctx, s, cx, y, CODE_FS, col, font=MONO, bold=False, align='left', alpha=alpha)
        ctx.select_font_face(MONO, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL); ctx.set_font_size(CODE_FS)
        cx += ctx.text_extents(s).x_advance
    return cx

def squiggle(ctx, x0, x1, y, col, t):
    ctx.set_source_rgba(*col); ctx.set_line_width(3.5); ctx.move_to(x0, y)
    x = x0
    while x < x1:
        ctx.line_to(x, y + 6 * math.sin((x - x0) / 7 + t * 6)); x += 3
    ctx.stroke()

LEGACY = [('const ', KW), ('legacy', GREY), (' = ', PL), ('initPayments', FN), ('()', PL)]

def un_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#2563EB'), hexc('#0E7490'), lt); blobs(ctx, lt, hexc('#67E8F9')); confetti_dots(ctx, lt)
    kk = ease_out_cubic(prog(lt, 0.0, 0.4))
    text(ctx, 'code cleanup day', 540, 280 + 20 * (1 - kk), 60, WHITE, alpha=kk)
    s = spring(prog(lt, 0.1, 0.8), 7, 1.5)
    if s <= 0: return
    ctx.save(); ctx.translate(540, 760); ctx.scale(0.75 + 0.25 * s, 0.75 + 0.25 * s); ctx.translate(-540, -760)
    ex, ey, ew = 70, 400, 940
    dk = ease_in_out(prog(lt, 2.05, 0.35))  # line 3 collapses
    editor(ctx, ex, ey, ew, 640 - 70 * dk)
    lh = 70; y0 = ey + 130
    code_line(ctx, ex, y0, 1, [('import ', KW), ('{ initPayments }', PL), (' from ', KW), ("'./pay'", STR)])
    code_line(ctx, ex, y0 + lh, 2, [])
    # the "unused" line
    if dk < 1:
        yy = y0 + 2 * lh
        if lt > 1.75:  # selected for deletion
            hk = ease_out_cubic(prog(lt, 1.75, 0.2))
            ctx.set_source_rgba(*CORAL[:3], 0.35 * hk * (1 - dk)); ctx.rectangle(ex + 80, yy - 44, ew - 100, 60); ctx.fill()
        ctx.save(); ctx.translate(0, 0); ctx.scale(1, 1)
        endx = code_line(ctx, ex, yy, 3, LEGACY, alpha=1 - dk)
        ctx.restore()
        if lt > 0.75 and dk < 0.5:
            squiggle(ctx, ex + 90 + 6 * 19.3, ex + 90 + 12 * 19.3, yy + 12, hexc('#FACC15'), lt)
    n0 = 4 - (1 if dk >= 1 else 0)
    off = lh * (1 - dk)
    rest = [[], [('export function ', KW), ('checkout', FN), ('(cart) {', PL)],
            [('  return ', KW), ('window.pay.', PL), ('charge', FN), ('(cart)', PL)], [('}', PL)]]
    for j, parts in enumerate(rest):
        if 0 < dk < 1 and j == 0: continue
        code_line(ctx, ex, y0 + 2 * lh + off + j * lh - (0 if dk < 1 else 0), n0 + j if dk >= 1 else 4 + j, parts)
    # tooltip
    tk = pop_scale(lt, 0.8, 0.6, 8, 1.8)
    if tk > 0 and lt < 1.75:
        ctx.save(); ctx.translate(540, 1110); ctx.scale(tk, tk)
        card(ctx, -440, -70, 880, 140, 22, hexc('#252A3D'))
        ctx.set_source_rgba(*hexc('#FACC15')); rrect(ctx, -440, -70, 12, 140, 6); ctx.fill()
        text(ctx, "'legacy' is declared but its", -400, -12, 32, WHITE, font=MONO, bold=False, align='left')
        text(ctx, 'value is never read.  ts(6133)', -400, 38, 32, hexc('#D1D5DB'), font=MONO, bold=False, align='left')
        ctx.restore()
    ctx.restore()
    if lt > 1.75 and lt < 2.15:
        pill(ctx, 540, 1150, 'ctrl + shift + K', 44, INK, hexc('#FFFFFF'), font=MONO)
    pk = pop_scale(lt, 2.4)
    if pk > 0:
        ctx.save(); ctx.translate(540, 1300); ctx.scale(pk, pk); ctx.rotate(-0.04)
        pill(ctx, 0, 0, '-1 line.  clean code ✓', 50, INK, MINT)
        ctx.restore()

def un_s2(ctx, lt, L):
    pulse = 0.5 + 0.5 * math.sin(lt * 14)
    grad_bg(ctx, hexc('#B91C1C'), hexc('#0A0A0F'), lt); blobs(ctx, lt, hexc('#F87171'), 4, 8)
    g = cairo.RadialGradient(540, 960, 300, 540, 960, 1300)
    g.add_color_stop_rgba(0, 1, 0, 0, 0); g.add_color_stop_rgba(1, 1, 0.1, 0.1, 0.3 + 0.25 * pulse)
    ctx.set_source(g); ctx.paint()
    slam(ctx, '1 SECOND BAAD', 540, 290, 104, WHITE, lt, 0.0)
    k = ease_out_cubic(prog(lt, 0.2, 0.4))
    sx, sy = shake_xy(lt, 0.8, 18)
    ctx.save(); ctx.translate(sx, sy + 70 * (1 - k))
    cmd = typed('$ npm test', lt, 0.3, 26)
    lines = [(cmd, WHITE)]
    if lt > 0.8:
        n = int(clamp((lt - 0.8) / 0.5) * 37)
        lines.append((f'FAIL  {n} failing', CORAL))
    if lt > 1.35: lines.append(('TypeError: Cannot read', CORAL))
    if lt > 1.5: lines.append(('properties of undefined', CORAL))
    if lt > 1.65: lines.append(("(reading 'charge')", hexc('#FACC15')))
    if k > 0: terminal(ctx, 90, 420, 900, 460, lines, 'test')
    ctx.restore()
    # broken checkout card
    ck = pop_scale(lt, 2.0)
    if ck > 0:
        ctx.save(); ctx.translate(540, 1240); ctx.scale(ck, ck); ctx.rotate(0.03)
        card(ctx, -400, -200, 800, 400, 36, hexc('#FFFFFF'))
        text(ctx, 'Checkout', -350, -110, 52, INK, align='left')
        ctx.set_source_rgba(*hexc('#E5E7EB')); ctx.rectangle(-350, -80, 700, 4); ctx.fill()
        text(ctx, 'Total:', -350, 10, 50, hexc('#374151'), bold=False, align='left')
        text(ctx, 'undefined', 350, 10, 56, hexc('#E11D48'), font=MONO, align='right')
        ctx.set_source_rgba(*hexc('#D1D5DB')); rrect(ctx, -350, 60, 700, 100, 24); ctx.fill()
        text(ctx, 'Pay now', 0, 124, 44, hexc('#9CA3AF'))
        ctx.restore()

def un_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#F59E0B'), hexc('#DB2777'), lt); blobs(ctx, lt, hexc('#FDE68A'), 5, 2); confetti_dots(ctx, lt, 0.2)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, -60 * (1 - k))
    ex, ey, ew = 70, 230, 940
    editor(ctx, ex, ey, ew, 290, 'checkout.ts  (restored)')
    hk = ease_out_cubic(prog(lt, 0.2, 0.3))
    ctx.set_source_rgba(*MINT[:3], 0.22 * hk); ctx.rectangle(ex + 80, ey + 86, ew - 100, 150); ctx.fill()
    cmt = typed('// DO NOT TOUCH. koi nahi jaanta kyun', lt, 0.5, 30)
    code_line(ctx, ex, ey + 130, 3, [(cmt, hexc('#4ADE80'))])
    code_line(ctx, ex, ey + 200, 4, LEGACY[:1] + [('legacy', PL)] + LEGACY[2:])
    ctx.restore()
    sx, sy = shake_xy(lt, 1.7, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'ab main bhi', 540, 860, 110, WHITE, lt, 1.6)
    slam(ctx, 'LEGACY', 540, 1080, 200, hexc('#FFFFFF'), lt, 1.85)
    slam(ctx, 'hoon.', 540, 1270, 130, INK, lt, 2.05)
    ctx.restore()
    s = pop_scale(lt, 2.6)
    if s > 0:
        ctx.save(); ctx.translate(540, 1500); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'unused. but load-bearing.', 46, WHITE, hexc('#111827'), font=MONO)
        ctx.restore()

M = dict(scenes=[un_s1, un_s2, un_s3], default=[3.0, 3.2, 3.6], accent=hexc('#67E8F9'),
         sfx=lambda tr, c: (tr.add(c[0] + 0.1, pop(500, 1000), 0.6), tr.add(c[0] + 0.8, blip(660, 0.12, 'sine'), 0.5),
                            tr.add(c[0] + 1.75, blip(1500, 0.04), 0.4), tr.add(c[0] + 2.05, whoosh(0.35), 0.5),
                            tr.add(c[0] + 2.4, chime((880, 1318.5), 0.7), 0.45),
                            tr.add(c[1], thump(90, 0.5), 1.0), tr.add(c[1] + 0.3, buzz(110, 2.2), 0.3),
                            [tr.add(c[1] + 0.3 + i / 26, blip(1700, 0.02), 0.1) for i in range(0, 10, 2)],
                            [tr.add(c[1] + 0.8 + i * 0.05, blip(500 - i * 10, 0.03), 0.3) for i in range(10)],
                            [tr.add(c[1] + 1.35 + i * 0.15, thump(200 - i * 30, 0.2), 0.5) for i in range(3)],
                            tr.add(c[1] + 2.0, noise_burst(0.3), 0.5), tr.add(c[1] + 2.0, thump(140, 0.3), 0.7),
                            tr.add(c[2] + 0.2, chime((1046.5,), 0.4), 0.35),
                            [tr.add(c[2] + 0.5 + i / 30, blip(1800, 0.02), 0.1) for i in range(0, 38, 2)],
                            tr.add(c[2] + 1.6, thump(130, 0.3), 0.8), tr.add(c[2] + 1.85, thump(90, 0.6), 1.0),
                            tr.add(c[2] + 1.85, buzz(98, 0.6), 0.35), tr.add(c[2] + 2.05, thump(110, 0.3), 0.8),
                            tr.add(c[2] + 2.6, pop(900, 500, 0.2), 0.5)))
