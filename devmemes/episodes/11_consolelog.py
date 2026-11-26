# MEME 11 — "bas ek console.log" → here, here again, aaaaa → PR merged → client demo, CTO opens DevTools
#          → console top line: "bhai ye chal kyu nahi raha", bottom line: "kisi ko pata na chale"
NAME = 'consolelog'
OUTNAME = 'meme11_console_log_demo'

GREY = hexc('#8A8FA8')
CYAN = hexc('#67E8F9')
YEL = hexc('#FDE047')
PURP = hexc('#C084FC')

CL_LINES = [
    ("console.log('here')", 0.55),
    ("console.log('here again')", 1.15),
    ("console.log(user) // ???", 1.75),
    ("console.log('aaaaaaa')", 2.3),
]

def editor(ctx, x, y, w, h, title):
    card(ctx, x, y, w, h, 30, hexc('#11131A'))
    ctx.set_source_rgba(*hexc('#1E2130')); rrect(ctx, x, y, w, 70, 30); ctx.fill(); ctx.rectangle(x, y + 40, w, 30); ctx.fill()
    for i, c in enumerate(('#FF5F57', '#FEBC2E', '#28C840')):
        ctx.set_source_rgba(*hexc(c)); ctx.arc(x + 40 + i * 32, y + 35, 10, 0, 2 * math.pi); ctx.fill()
    text(ctx, title, x + w / 2, y + 45, 28, GREY, font=MONO, bold=False)

def cl_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#059669'), hexc('#0E7490'), lt); blobs(ctx, lt, hexc('#A7F3D0')); confetti_dots(ctx, lt)
    slam(ctx, 'BUG HUNT', 540, 270, 110, WHITE, lt, 0.0, 1.8)
    s = spring(prog(lt, 0.1, 0.7), 7, 1.5)
    if s > 0:
        ctx.save(); ctx.translate(540, 760); ctx.scale(0.75 + 0.25 * s, 0.75 + 0.25 * s); ctx.translate(-540, -760)
        editor(ctx, 70, 380, 940, 760, 'checkout.js')
        rows = [('function pay(cart) {', WHITE, None)]
        for i, (sline, t0) in enumerate(CL_LINES):
            if lt >= t0:
                rows.append(('  ' + typed(sline, lt, t0, 40), YEL, t0))
            if i == 1:
                rows.append(('  const total = sum(cart);', WHITE, None))
        rows.append(('  return charge(total);', WHITE, None))
        rows.append(('}', WHITE, None))
        for j, (sline, col, t0) in enumerate(rows):
            y = 500 + j * 76
            if t0 is not None:
                hk = 1 - clamp((lt - t0) / 0.6)
                ctx.set_source_rgba(0.99, 0.88, 0.28, 0.08 + 0.25 * hk); ctx.rectangle(90, y - 50, 900, 70); ctx.fill()
            text(ctx, f'{j + 1:>2}', 100, y, 30, GREY, font=MONO, bold=False, align='left')
            text(ctx, sline, 170, y, 34, col, font=MONO, bold=False, align='left')
        ctx.restore()
    n = sum(1 for _, t0 in CL_LINES if lt >= t0)
    if n:
        ck = pop_scale(lt, CL_LINES[n - 1][1], 0.5)
        ctx.save(); ctx.translate(820, 1230); ctx.rotate(-0.06); ctx.scale(ck, ck)
        pill(ctx, 0, 0, f'console.log x{n}', 40, INK, YEL, font=MONO)
        ctx.restore()
    k = ease_out_cubic(prog(lt, 2.5, 0.4))
    if k > 0:
        text(ctx, '"bas ek console.log..."', 540, 1430 + 30 * (1 - k), 58, WHITE, alpha=k)

def cl_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#1E3A8A'), hexc('#581C87'), lt); blobs(ctx, lt, hexc('#A5B4FC'), 4, 7)
    pk = pop_scale(lt, 0.05)
    if pk > 0:
        ctx.save(); ctx.translate(540, 260); ctx.scale(pk, pk); ctx.rotate(-0.03)
        pill(ctx, 0, 0, 'PR merged ✓  bug fixed ✓', 46, INK, MINT)
        ctx.restore()
    slam(ctx, 'NEXT DAY · CLIENT DEMO', 540, 410, 62, WHITE, lt, 0.7, 1.6)
    # big screen with the product
    s = spring(prog(lt, 0.9, 0.7), 7, 1.5)
    if s > 0:
        ctx.save(); ctx.translate(540, 900); ctx.scale(0.7 + 0.3 * s, 0.7 + 0.3 * s); ctx.translate(-540, -900)
        card(ctx, 70, 500, 940, 820, 30, hexc('#F8FAFC'))
        ctx.set_source_rgba(*hexc('#E2E8F0')); rrect(ctx, 70, 500, 940, 70, 30); ctx.fill(); ctx.rectangle(70, 540, 940, 30); ctx.fill()
        text(ctx, 'shop.app/checkout', 540, 546, 28, hexc('#475569'), font=MONO, bold=False)
        ctx.set_source_rgba(*hexc('#4F46E5')); rrect(ctx, 110, 610, 520, 70, 14); ctx.fill()
        text(ctx, 'Checkout', 140, 660, 44, WHITE, align='left')
        for i in range(3):
            ctx.set_source_rgba(*hexc('#CBD5E1')); rrect(ctx, 110, 710 + i * 56, 860 - i * 180, 30, 10); ctx.fill()
        ctx.set_source_rgba(*hexc('#22C55E')); rrect(ctx, 690, 610, 280, 70, 35); ctx.fill()
        text(ctx, 'Pay now', 830, 657, 36, WHITE)
        # devtools sliding up
        dk = ease_out_cubic(prog(lt, 1.9, 0.45))
        if dk > 0:
            top = 1320 - 440 * dk
            ctx.save(); ctx.rectangle(70, 500, 940, 820); ctx.clip()
            ctx.set_source_rgba(*hexc('#1E1E24')); ctx.rectangle(70, top, 940, 440); ctx.fill()
            ctx.set_source_rgba(*hexc('#2A2A33')); ctx.rectangle(70, top, 940, 64); ctx.fill()
            for i, tab in enumerate(('Elements', 'Console', 'Network')):
                tx = 110 + i * 220
                if tab == 'Console':
                    ctx.set_source_rgba(*CYAN); ctx.rectangle(tx - 10, top + 58, 190, 6); ctx.fill()
                text(ctx, tab, tx, top + 44, 30, WHITE if tab == 'Console' else GREY, font=MONO, bold=False, align='left')
            pulse = 0.5 + 0.5 * math.sin(lt * 10)
            ctx.set_source_rgba(1, 0.48, 0.42, 0.75 + 0.25 * pulse); rrect(ctx, 790, top + 12, 190, 42, 21); ctx.fill()
            text(ctx, '47 logs', 885, top + 43, 28, WHITE, font=MONO)
            for i in range(4):
                ctx.set_source_rgba(1, 1, 1, 0.12); rrect(ctx, 110, top + 100 + i * 70, 820 - i * 90, 28, 8); ctx.fill()
            ctx.restore()
        ctx.restore()
    # CTO
    bubble(ctx, '"ek sec, DevTools kholta hoon"', 990, 1460, True, hexc('#FFFFFF'), INK, lt, 1.4, 42, label='CTO')
    if lt > 2.5:
        sx, sy = shake_xy(lt, 2.5, 16)
        k = pop_scale(lt, 2.5)
        ctx.save(); ctx.translate(540 + sx, 1620 + sy); ctx.scale(k, k)
        text(ctx, 'uh oh.', 0, 20, 64, CORAL)
        ctx.restore()

def log_row(ctx, y, msg, col, lt, t0, src):
    k = ease_out_cubic(prog(lt, t0, 0.35))
    if k <= 0: return
    ctx.save(); ctx.translate(60 * (1 - k), 0)
    ctx.set_source_rgba(1, 1, 1, 0.06 * k); ctx.rectangle(80, y - 46, 920, 74); ctx.fill()
    text(ctx, '›', 100, y, 38, GREY, font=MONO, alpha=k)
    text(ctx, msg, 140, y, 36, col, font=MONO, bold=False, align='left', alpha=k)
    text(ctx, src, 980, y, 24, GREY, font=MONO, bold=False, align='right', alpha=k)
    ctx.restore()

def cl_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#DB2777'), hexc('#EA580C'), lt); blobs(ctx, lt, hexc('#FDE68A'), 5, 2); confetti_dots(ctx, lt, 0.2)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, 60 * (1 - k))
    card(ctx, 60, 250, 960, 640, 30, hexc('#1E1E24'))
    ctx.set_source_rgba(*hexc('#2A2A33')); rrect(ctx, 60, 250, 960, 70, 30); ctx.fill(); ctx.rectangle(60, 290, 960, 30); ctx.fill()
    text(ctx, 'Console', 100, 297, 30, CYAN, font=MONO, bold=False, align='left')
    text(ctx, 'projector pe, live', 980, 297, 26, CORAL, font=MONO, bold=False, align='right')
    log_row(ctx, 400, "bhai ye chal kyu nahi raha", YEL, lt, 0.2, 'checkout.js:3')
    log_row(ctx, 490, "here", WHITE, lt, 0.5, ':4')
    log_row(ctx, 580, "here again", WHITE, lt, 0.6, ':6')
    if lt > 0.75:
        text(ctx, '... 43 more', 540, 670, 32, GREY, font=MONO, bold=False, alpha=clamp((lt - 0.75) / 0.3))
    log_row(ctx, 790, "kisi ko pata na chale", CORAL, lt, 1.2, 'checkout.js:51')
    ctx.restore()
    sx, sy = shake_xy(lt, 1.7, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'KISI KO', 540, 1080, 140, WHITE, lt, 1.6)
    slam(ctx, 'PATA NA CHALE.', 540, 1245, 108, YEL, lt, 1.85)
    ctx.restore()
    tk = ease_out_cubic(prog(lt, 2.3, 0.4))
    if tk > 0:
        text(ctx, '(ab poori company ko pata hai)', 540, 1390 + 20 * (1 - tk), 44, WHITE, bold=False, alpha=tk)
    s = pop_scale(lt, 2.7)
    if s > 0:
        ctx.save(); ctx.translate(540, 1530); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, '// eslint-disable no-console', 38, WHITE, INK, font=MONO)
        ctx.restore()

M = dict(scenes=[cl_s1, cl_s2, cl_s3], default=[3.0, 3.2, 3.6], accent=CYAN,
         sfx=lambda tr, c: (tr.add(c[0], thump(130, 0.3), 0.7), tr.add(c[0] + 0.1, whoosh(0.4), 0.3),
                            [tr.add(c[0] + t0 + i / 40, blip(1700, 0.02), 0.1) for _, t0 in CL_LINES for i in range(0, 22, 3)],
                            [tr.add(c[0] + t0, pop(600 + j * 150, 1200), 0.45) for j, (_, t0) in enumerate(CL_LINES)],
                            tr.add(c[1] + 0.05, chime((1046.5, 1568), 0.8), 0.5),
                            tr.add(c[1] + 0.7, thump(150, 0.3), 0.7), tr.add(c[1] + 0.9, whoosh(0.5), 0.35),
                            tr.add(c[1] + 1.4, pop(700, 1200), 0.5), tr.add(c[1] + 1.9, whoosh(0.4, False), 0.5),
                            tr.add(c[1] + 2.5, thump(90, 0.5), 1.0), tr.add(c[1] + 2.5, buzz(110, 0.5), 0.35),
                            [tr.add(c[2] + t, blip(880, 0.05, 'sine'), 0.35) for t in (0.2, 0.5, 0.6)],
                            tr.add(c[2] + 1.2, blip(660, 0.12, 'sine'), 0.5),
                            tr.add(c[2] + 1.6, thump(120, 0.4), 0.9), tr.add(c[2] + 1.7, noise_burst(0.2), 0.3),
                            tr.add(c[2] + 1.85, thump(90, 0.6), 1.0),
                            tr.add(c[2] + 2.7, pop(900, 500, 0.2), 0.5)))
