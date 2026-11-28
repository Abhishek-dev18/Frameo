# MEME 12 — Function written in 2 minutes, tests green → 40 minutes naming ONE variable (data, finalData, finalDataNew, actuallyFinal...)
#          → finally named it... data. First PR comment: "nit: naming thoda better karo?"
NAME = 'naming'
OUTNAME = 'meme12_variable_naming'

GREY = hexc('#8A8FA8')
YEL = hexc('#FDE047')
CYAN = hexc('#67E8F9')
PINK = hexc('#F472B6')
KW = hexc('#C084FC')

NAMES = [('data', 1.25), ('userData', 1.45), ('finalData', 1.62), ('finalDataNew', 2.05),
         ('finalData_v2', 2.35), ('actuallyFinal', 2.62), ('pleaseWork', 2.88)]

def code_card(ctx, x, y, w, h, title):
    card(ctx, x, y, w, h, 30, hexc('#11131A'))
    ctx.set_source_rgba(*hexc('#1E2130')); rrect(ctx, x, y, w, 70, 30); ctx.fill(); ctx.rectangle(x, y + 40, w, 30); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(x + 40 + i * 32, y + 35, 10, 0, 2 * math.pi); ctx.fill()
    text(ctx, title, x + w / 2, y + 45, 28, GREY, font=MONO, bold=False)

def blank(ctx, x, y, w, lt):
    pulse = 0.5 + 0.5 * math.sin(lt * 8)
    ctx.set_source_rgba(0.99, 0.88, 0.28, 0.25 + 0.35 * pulse); rrect(ctx, x, y - 38, w, 50, 10); ctx.fill()
    text(ctx, '???', x + w / 2, y, 34, INK, font=MONO)

def nm_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#2563EB'), hexc('#0891B2'), lt); blobs(ctx, lt, hexc('#A5F3FC')); confetti_dots(ctx, lt)
    slam(ctx, 'NAYA FEATURE', 540, 270, 100, WHITE, lt, 0.0, 1.8)
    s = spring(prog(lt, 0.1, 0.7), 7, 1.5)
    if s > 0:
        ctx.save(); ctx.translate(540, 700); ctx.scale(0.75 + 0.25 * s, 0.75 + 0.25 * s); ctx.translate(-540, -700)
        code_card(ctx, 70, 380, 940, 560, 'user.js')
        rows = [('async function getUser(id) {', 0.3), ('  const', 0.75), ('  return', 1.1), ('}', 1.35)]
        for j, (sline, t0) in enumerate(rows):
            y = 510 + j * 100
            if lt < t0: continue
            vis = typed(sline, lt, t0, 60)
            text(ctx, f'{j + 1:>2}', 100, y, 30, GREY, font=MONO, bold=False, align='left')
            if sline.strip() in ('const', 'return'):
                text(ctx, vis, 170, y, 36, KW, font=MONO, bold=False, align='left')
                if len(vis) == len(sline):
                    bx = 170 + (190 if 'const' in sline else 215)
                    blank(ctx, bx, y, 130, lt)
                    if 'const' in sline:
                        text(ctx, '= await db.find(id);', bx + 150, y, 34, WHITE, font=MONO, bold=False, align='left')
                    else:
                        text(ctx, ';', bx + 140, y, 34, WHITE, font=MONO, bold=False, align='left')
            else:
                text(ctx, vis, 170, y, 36, WHITE, font=MONO, bold=False, align='left')
        ctx.restore()
    for i, (lab, t0, x) in enumerate((('2 min ✓', 1.45, 330), ('tests ✓', 2.05, 750))):
        k = pop_scale(lt, t0, 0.5)
        if k > 0:
            ctx.save(); ctx.translate(x, 1080); ctx.rotate(-0.05 + i * 0.08); ctx.scale(k, k)
            pill(ctx, 0, 0, lab, 50, INK, MINT, font=MONO)
            ctx.restore()
    k = ease_out_cubic(prog(lt, 2.35, 0.4))
    if k > 0:
        text(ctx, '"bas ek naam rakhna hai..."', 540, 1330 + 30 * (1 - k), 58, WHITE, alpha=k)

def nm_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#4C1D95'), hexc('#0F172A'), lt); blobs(ctx, lt, hexc('#C084FC'), 4, 7)
    # elapsed clock pill
    frac = clamp(lt / max(L - 0.3, 0.1)) ** 1.6
    mins = int(2 + frac * 38)
    pk = pop_scale(lt, 0.0)
    ctx.save(); ctx.translate(540, 290); ctx.scale(max(pk, 1e-3), max(pk, 1e-3))
    pill(ctx, 0, 0, f'naam sochte hue: {mins} min', 50, WHITE, CORAL if mins > 20 else hexc('#7C3AED'), font=MONO)
    ctx.restore()
    qk = pop_scale(lt, 0.15) * (1 - ease_out_cubic(prog(lt, 1.05, 0.25)))
    if qk > 0.01:
        ctx.save(); ctx.translate(540, 960); ctx.scale(qk, qk); ctx.rotate(-0.04)
        text(ctx, 'ab naam', 0, -40, 130, WHITE)
        text(ctx, 'kya rakhu?', 0, 110, 130, YEL)
        ctx.restore()
    # list of candidate names, each struck out
    for i, (nm, t0) in enumerate(NAMES):
        k = prog(lt, t0, 0.4)
        if k <= 0: continue
        sp = spring(k, 8, 1.7); side = -1 if i % 2 == 0 else 1
        x = 540 + side * 700 * (1 - sp); y = 460 + i * 150
        ctx.save(); ctx.translate(x, y); ctx.rotate(side * 0.025)
        card(ctx, -380, -55, 760, 110, 26, hexc('#11131A'))
        text(ctx, 'const', -340, 14, 38, KW, font=MONO, bold=False, align='left')
        ext = text(ctx, nm, -200, 14, 40, YEL, font=MONO, bold=False, align='left')
        nxt = NAMES[i + 1][1] if i + 1 < len(NAMES) else 3.12
        sk = ease_out_cubic(prog(lt, nxt - 0.12, 0.2))
        if sk > 0:
            ctx.set_source_rgba(*CORAL); ctx.set_line_width(8)
            ctx.move_to(-210, 0); ctx.line_to(-210 + (ext.width + 20) * sk, 0); ctx.stroke()
            text(ctx, '✗', 330, 16, 44, CORAL, alpha=sk)
        ctx.restore()

def nm_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#F59E0B'), hexc('#DB2777'), lt); blobs(ctx, lt, hexc('#FDE68A'), 5, 2); confetti_dots(ctx, lt, 0.2)
    # final name
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, 60 * (1 - k))
    code_card(ctx, 70, 230, 940, 220, 'user.js  ·  final')
    text(ctx, 'const', 120, 380, 46, KW, font=MONO, bold=False, align='left')
    dk = pop_scale(lt, 0.95)
    if dk > 0:
        ctx.save(); ctx.translate(345, 364); ctx.scale(dk, dk)
        ctx.set_source_rgba(*MINT); rrect(ctx, -10, -34, 150, 58, 12); ctx.fill()
        text(ctx, 'data', 65, 14, 46, INK, font=MONO)
        ctx.restore()
    text(ctx, '= await db.find(id);', 515, 380, 37, WHITE, font=MONO, bold=False, align='left')
    ctx.restore()
    tk = ease_out_cubic(prog(lt, 1.2, 0.4))
    if tk > 0:
        text(ctx, '(itni research ke baad...)', 540, 540 + 20 * (1 - tk), 46, WHITE, bold=False, alpha=tk)
    # PR review comment
    ck = spring(prog(lt, 1.5, 0.6), 8, 1.6)
    if ck > 0:
        ctx.save(); ctx.translate(540, 780); ctx.scale(0.8 + 0.2 * ck, 0.8 + 0.2 * ck); ctx.translate(-540, -780)
        ctx.translate(0, 120 * (1 - ck))
        card(ctx, 70, 640, 940, 300, 30, hexc('#FFFFFF'))
        ctx.set_source_rgba(*hexc('#F1F5F9')); rrect(ctx, 70, 640, 940, 80, 30); ctx.fill(); ctx.rectangle(70, 690, 940, 30); ctx.fill()
        ctx.set_source_rgba(*hexc('#6366F1')); ctx.arc(125, 680, 26, 0, 2 * math.pi); ctx.fill()
        text(ctx, 'R', 125, 692, 32, WHITE)
        text(ctx, 'reviewer  ·  PR #482  ·  comment 1 of 1', 170, 692, 28, hexc('#475569'), bold=False, align='left')
        cm = typed('nit: naming thoda better karo?', lt, 2.55, 30)
        text(ctx, cm[:17], 120, 810, 58, INK, align='left')
        text(ctx, cm[17:].strip(), 120, 885, 58, INK, align='left')
        if lt < 2.55:
            ctx.set_source_rgba(*hexc('#CBD5E1')); [ (rrect(ctx, 120, 770 + i * 75, 700 - i * 260, 34, 10), ctx.fill()) for i in range(2)]
        ctx.restore()
    sx, sy = shake_xy(lt, 2.95, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '40 MINUTE', 540, 1150, 150, WHITE, lt, 2.85)
    slam(ctx, 'BARBAAD.', 540, 1340, 160, INK, lt, 3.05)
    ctx.restore()
    s = pop_scale(lt, 3.3)
    if s > 0:
        ctx.save(); ctx.translate(540, 1530); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'const data2 = data;', 40, WHITE, INK, font=MONO)
        ctx.restore()

def _sfx(tr, c):
    s1 = (c[1] - c[0]) / 3.0; s2 = (c[2] - c[1]) / 3.2; s3 = (c[3] - c[2] - 1.0) / 3.6
    a = lambda t: c[0] + t * s1; b = lambda t: c[1] + t * s2; d = lambda t: c[2] + t * s3
    tr.add(a(0), thump(130, 0.3), 0.7); tr.add(a(0.1), whoosh(0.4), 0.3)
    for i in range(0, 60, 3): tr.add(a(0.3) + i / 40, blip(1700, 0.02), 0.1)
    tr.add(a(1.45), chime((1046.5, 1568), 0.8), 0.45); tr.add(a(2.05), pop(700, 1300), 0.5)
    tr.add(b(0), pop(500, 1000), 0.5); tr.add(b(0.15), thump(140, 0.3), 0.6)
    for _, t0 in NAMES: tr.add(b(t0), whoosh(0.3), 0.3)
    for t0 in [n[1] for n in NAMES[1:]] + [3.12]: tr.add(b(t0 - 0.12), buzz(140, 0.15), 0.25)
    tr.add(d(0.95), chime((880,), 0.5), 0.4)
    tr.add(d(1.5), pop(600, 1200), 0.55)
    for i in range(0, 30, 3): tr.add(d(2.55) + i / 30, blip(1700, 0.02), 0.1)
    tr.add(d(2.85), thump(110, 0.5), 1.0); tr.add(d(2.85), noise_burst(0.2), 0.3)
    tr.add(d(3.05), thump(85, 0.6), 1.0); tr.add(d(3.05), buzz(98, 0.6), 0.35)
    tr.add(d(3.3), pop(900, 500, 0.2), 0.5)

M = dict(scenes=[nm_s1, nm_s2, nm_s3], default=[3.0, 3.2, 3.6], accent=YEL, sfx=_sfx)
