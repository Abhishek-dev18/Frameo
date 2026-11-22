# MEME 9 — Order date feature: perfect on local, QA pass → 12:30 AM support call: today's orders show yesterday's date
#          → debugged all night: code was right, the server just lives on London time (UTC vs IST)
NAME = 'timezone'
OUTNAME = 'meme09_server_london_time'

GREY = hexc('#8A8FA8')
SKY = hexc('#7DD3FC')
YEL = hexc('#FDE047')

def order_row(ctx, x, y, w, oid, when, date, col, bad=False):
    card(ctx, x, y, w, 120, 26, hexc('#FFFFFF') if not bad else hexc('#1F1F27'), shadow=not bad)
    fg = INK if not bad else WHITE
    text(ctx, oid, x + 34, y + 52, 36, fg, align='left')
    text(ctx, when, x + 34, y + 96, 26, hexc('#6B7280') if not bad else hexc('#A1A1AA'), font=MONO, bold=False, align='left')
    pill(ctx, x + w - 130, y + 60, date, 34, WHITE, col, font=MONO, pad=22)

def tz_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#0D9488'), hexc('#1D4ED8'), lt); blobs(ctx, lt, hexc('#99F6E4')); confetti_dots(ctx, lt)
    kk = ease_out_cubic(prog(lt, 0.0, 0.4))
    text(ctx, 'feature: order date', 540, 290 + 20 * (1 - kk), 60, WHITE, alpha=kk)
    # app card
    s = spring(prog(lt, 0.1, 0.8), 7, 1.5)
    if s > 0:
        ctx.save(); ctx.translate(540, 760); ctx.scale(0.7 + 0.3 * s, 0.7 + 0.3 * s); ctx.translate(-540, -760)
        card(ctx, 90, 380, 900, 640, 40, hexc('#F1F5F9'))
        ctx.set_source_rgba(*hexc('#0F172A')); rrect(ctx, 90, 380, 900, 100, 40); ctx.fill(); ctx.rectangle(90, 440, 900, 40); ctx.fill()
        text(ctx, 'My Orders  ·  localhost:3000', 540, 445, 34, WHITE, font=MONO, bold=False)
        rows = [('Order #4819', 'placed 6:12 PM', '22 Nov'), ('Order #4820', 'placed 9:05 PM', '22 Nov'), ('Order #4821', 'placed 11:40 PM', '22 Nov')]
        for i, (a, b, c) in enumerate(rows):
            rk = prog(lt, 0.45 + i * 0.22, 0.45)
            if rk <= 0: continue
            sp = spring(rk, 8, 1.7)
            ctx.save(); ctx.translate(60 * (1 - sp), 0)
            order_row(ctx, 130, 520 + i * 160, 820, a, b, c, hexc('#16A34A'))
            ctx.restore()
        ctx.restore()
    # QA stamp
    st = pop_scale(lt, 1.7, 0.7)
    if st > 0:
        ctx.save(); ctx.translate(700, 1200); ctx.rotate(-0.16); ctx.scale(st, st)
        ctx.set_source_rgba(*MINT); ctx.set_line_width(12); rrect(ctx, -250, -85, 500, 170, 30); ctx.stroke()
        text(ctx, 'QA PASS ✓', 0, 28, 80, MINT, font=MONO)
        ctx.restore()
    k = ease_out_cubic(prog(lt, 2.2, 0.4))
    if k > 0:
        text(ctx, '"local pe perfect."', 540, 1420 + 30 * (1 - k), 56, WHITE, alpha=k)

def moon(ctx, x, y, r):
    ctx.set_source_rgba(*hexc('#FEF3C7')); ctx.arc(x, y, r, 0, 2 * math.pi); ctx.fill()
    ctx.set_source_rgba(*hexc('#1E1B4B')); ctx.arc(x + r * 0.45, y - r * 0.3, r * 0.85, 0, 2 * math.pi); ctx.fill()

def tz_s2(ctx, lt, L):
    pulse = 0.5 + 0.5 * math.sin(lt * 12)
    grad_bg(ctx, hexc('#1E1B4B'), hexc('#4C0519'), lt); blobs(ctx, lt, hexc('#818CF8'), 4, 7)
    # stars
    rng = random.Random(5)
    for i in range(40):
        x = rng.uniform(0, W); y = rng.uniform(180, 900); a = 0.3 + 0.5 * abs(math.sin(lt * 2 + i))
        ctx.set_source_rgba(1, 1, 1, a * 0.6); ctx.arc(x, y, rng.uniform(2, 4), 0, 2 * math.pi); ctx.fill()
    moon(ctx, 950, 200, 55)
    slam(ctx, '12:31 AM', 540, 330, 130, WHITE, lt, 0.0)
    text(ctx, 'IST  ·  23 Nov', 540, 450, 40, hexc('#C7D2FE'), font=MONO, bold=False, alpha=clamp(lt / 0.3))
    # incoming call
    ck = pop_scale(lt, 0.3)
    if ck > 0:
        sx = math.sin(lt * 80) * 5 if lt < 1.6 else 0
        ctx.save(); ctx.translate(540 + sx, 640); ctx.scale(ck, ck)
        card(ctx, -420, -90, 840, 180, 50, hexc('#111827'))
        ctx.set_source_rgba(0.29, 0.87, 0.5, 0.35 + 0.35 * pulse); ctx.arc(-320, 0, 58 + 10 * pulse, 0, 2 * math.pi); ctx.fill()
        ctx.set_source_rgba(*MINT); ctx.arc(-320, 0, 48, 0, 2 * math.pi); ctx.fill()
        # handset glyph
        ctx.set_source_rgba(*WHITE); ctx.set_line_width(12); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.arc(-320, 4, 22, math.pi * 0.85, math.pi * 2.15); ctx.stroke()
        text(ctx, 'Support calling...', -230, -10, 44, WHITE, align='left')
        text(ctx, '"orders galat date pe hain!"', -230, 46, 30, hexc('#FCA5A5'), bold=False, align='left')
        ctx.restore()
    # orders: today's orders with yesterday's date
    rows = [('Order #4822', 'placed 12:05 AM'), ('Order #4823', 'placed 12:18 AM'), ('Order #4824', 'placed 12:29 AM')]
    for i, (a, b) in enumerate(rows):
        rk = prog(lt, 1.0 + i * 0.3, 0.45)
        if rk <= 0: continue
        sp = spring(rk, 8, 1.7); side = -1 if i % 2 == 0 else 1
        ctx.save(); ctx.translate(side * 700 * (1 - sp), 0)
        order_row(ctx, 110, 860 + i * 160, 860, a, b, '22 Nov', CORAL, bad=True)
        ctx.restore()
    sk = pop_scale(lt, 2.2)
    if sk > 0:
        sx, sy = shake_xy(lt, 2.2, 18)
        ctx.save(); ctx.translate(540 + sx, 1430 + sy); ctx.rotate(-0.05); ctx.scale(sk, sk)
        pill(ctx, 0, 0, 'aaj ke orders = KAL ki date??', 46, WHITE, CORAL)
        ctx.restore()

def clock_card(ctx, cx, cy, label, time_s, date_s, col, lt, t0, hour_ang):
    k = pop_scale(lt, t0)
    if k <= 0: return
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k)
    card(ctx, -220, -250, 440, 500, 40, hexc('#111827'))
    text(ctx, label, 0, -190, 34, col, font=MONO)
    R = 95; ox, oy = 0, -40
    ctx.new_path(); ctx.set_source_rgba(*WHITE); ctx.set_line_width(8); ctx.arc(ox, oy, R, 0, 2 * math.pi); ctx.stroke()
    for i in range(12):
        a = i * math.pi / 6
        ctx.move_to(ox + math.cos(a) * (R - 18), oy + math.sin(a) * (R - 18)); ctx.line_to(ox + math.cos(a) * (R - 6), oy + math.sin(a) * (R - 6))
    ctx.set_line_width(4); ctx.stroke()
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    for ang, ln, wd in ((hour_ang, R * 0.5, 10), (math.pi * 2 * 31 / 60, R * 0.8, 6)):
        a = ang - math.pi / 2
        ctx.set_source_rgba(*col); ctx.set_line_width(wd); ctx.move_to(ox, oy); ctx.line_to(ox + math.cos(a) * ln, oy + math.sin(a) * ln); ctx.stroke()
    text(ctx, time_s, 0, 130, 54, WHITE, font=MONO)
    text(ctx, date_s, 0, 200, 40, col, font=MONO, bold=False)
    ctx.restore()

def tz_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#F97316'), hexc('#DB2777'), lt); blobs(ctx, lt, hexc('#FDE68A'), 5, 2); confetti_dots(ctx, lt, 0.2)
    clock_card(ctx, 290, 520, 'YOU (IST)', '12:31 AM', '23 Nov', MINT, lt, 0.05, math.pi * 2 * (0.5 / 12))
    clock_card(ctx, 790, 520, 'SERVER (UTC)', '7:01 PM', '22 Nov', CORAL, lt, 0.4, math.pi * 2 * (7 / 12))
    tk = ease_out_cubic(prog(lt, 0.8, 0.35))
    if tk > 0:
        pill(ctx, 540, 840 + 20 * (1 - tk), 'new Date()  →  5.5 ghante peeche', 38, WHITE, INK, font=MONO, alpha=tk)
    slam(ctx, 'code sahi tha...', 540, 1010, 80, WHITE, lt, 1.2, 1.8)
    sx, sy = shake_xy(lt, 1.8, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'SERVER', 540, 1180, 150, YEL, lt, 1.8)
    slam(ctx, 'LONDON TIME', 540, 1340, 120, WHITE, lt, 2.05)
    slam(ctx, 'pe jeeta hai.', 540, 1470, 84, WHITE, lt, 2.25)
    ctx.restore()
    s = pop_scale(lt, 2.8)
    if s > 0:
        ctx.save(); ctx.translate(540, 1595); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'TZ=UTC  ·  aur main IST mein', 38, WHITE, hexc('#111827'), font=MONO)
        ctx.restore()

M = dict(scenes=[tz_s1, tz_s2, tz_s3], default=[3.0, 3.2, 3.6], accent=YEL,
         sfx=lambda tr, c: (tr.add(c[0] + 0.1, pop(500, 1000), 0.6),
                            [tr.add(c[0] + 0.45 + i * 0.22, pop(700 + i * 150, 1300), 0.4) for i in range(3)],
                            tr.add(c[0] + 1.7, thump(160), 0.8), tr.add(c[0] + 1.75, chime((1046.5, 1568), 0.8), 0.5),
                            tr.add(c[1], thump(90, 0.5), 0.9),
                            [tr.add(c[1] + 0.3 + i * 0.5, blip(988, 0.18, 'sine'), 0.45) for i in range(3)],
                            [tr.add(c[1] + 1.0 + i * 0.3, whoosh(0.3), 0.35) for i in range(3)],
                            tr.add(c[1] + 2.2, buzz(110, 0.6), 0.4), tr.add(c[1] + 2.2, thump(120, 0.3), 0.7),
                            tr.add(c[2] + 0.05, pop(600, 1100), 0.5), tr.add(c[2] + 0.4, pop(500, 900), 0.5),
                            tr.add(c[2] + 0.8, chime((880,), 0.4), 0.35),
                            tr.add(c[2] + 1.2, thump(140, 0.3), 0.7), tr.add(c[2] + 1.8, thump(90, 0.6), 1.0),
                            tr.add(c[2] + 1.8, buzz(98, 0.6), 0.35), tr.add(c[2] + 2.05, thump(110, 0.3), 0.8),
                            tr.add(c[2] + 2.8, pop(900, 500, 0.2), 0.5)))
