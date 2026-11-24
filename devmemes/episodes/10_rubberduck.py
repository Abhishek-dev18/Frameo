# MEME 10 — Stuck on a bug for 3 days → finally call the senior, share screen, start explaining line by line... "ruko."
#          → found it myself while explaining; senior said 0 words; "thanks bhai, bahut help hui" (senior = rubber duck)
NAME = 'rubberduck'
OUTNAME = 'meme10_senior_rubber_duck'

GREY = hexc('#8A8FA8')
YEL = hexc('#FDE047')
SKY = hexc('#7DD3FC')

def duck(ctx, x, y, s):
    # simple original rubber duck
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s)
    ctx.set_source_rgba(*hexc('#FACC15'))
    ctx.save(); ctx.scale(1.35, 0.85); ctx.arc(0, 30, 70, 0, 2 * math.pi); ctx.restore(); ctx.fill()
    ctx.arc(-30, -40, 50, 0, 2 * math.pi); ctx.fill()
    ctx.move_to(60, 0); ctx.line_to(115, -25); ctx.line_to(95, 30); ctx.close_path(); ctx.fill()  # tail
    ctx.set_source_rgba(*hexc('#F97316'))
    ctx.move_to(-75, -45); ctx.curve_to(-120, -48, -122, -22, -75, -22); ctx.close_path(); ctx.fill()  # beak
    ctx.set_source_rgba(*INK); ctx.arc(-40, -55, 9, 0, 2 * math.pi); ctx.fill()
    ctx.set_source_rgba(*hexc('#EAB308')); ctx.set_line_width(7)
    ctx.arc(10, 30, 38, 0.2 * math.pi, 0.9 * math.pi); ctx.stroke()  # wing
    ctx.restore()

def rd_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#4338CA'), hexc('#0F172A'), lt); blobs(ctx, lt, hexc('#A5B4FC')); confetti_dots(ctx, lt)
    slam(ctx, 'DAY 3', 540, 280, 120, WHITE, lt, 0.0, 1.8)
    k = ease_out_cubic(prog(lt, 0.15, 0.5))
    if k > 0:
        ctx.save(); ctx.translate(0, 80 * (1 - k))
        lines = [("TypeError: Cannot read", CORAL), ("properties of undefined", CORAL), ("(reading 'id')", CORAL)]
        if lt > 0.7: lines.append(('StackOverflow tabs: 14', YEL))
        terminal(ctx, 90, 400, 900, 400, lines, 'still broken')
        ctx.restore()
    bubble(ctx, 'bhai, ek call pe aa sakte ho?', 990, 1020, True, hexc('#22C55E'), WHITE, lt, 1.2, 44, label='You')
    bubble(ctx, 'haan, share karo', 90, 1240, False, hexc('#FFFFFF'), INK, lt, 2.1, 46, label='Senior')
    if lt > 2.4:
        kk = ease_out_cubic(prog(lt, 2.4, 0.4))
        text(ctx, '(3 din baad hi sahi)', 540, 1440 + 20 * (1 - kk), 44, hexc('#C7D2FE'), bold=False, alpha=kk)

CODE = [
    ('function getProfile(userId) {', WHITE),
    ('  const user = getUser(id);', WHITE),
    ('  return user.profile.id;', WHITE),
    ('}', WHITE),
]

def rd_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#0F766E'), hexc('#1E3A8A'), lt); blobs(ctx, lt, hexc('#5EEAD4'), 4, 7)
    pulse = 0.5 + 0.5 * math.sin(lt * 8)
    # screen share window
    s = spring(prog(lt, 0.0, 0.7), 7, 1.5)
    ctx.save(); ctx.translate(540, 700); ctx.scale(0.75 + 0.25 * s, 0.75 + 0.25 * s); ctx.translate(-540, -700)
    card(ctx, 60, 300, 960, 760, 34, hexc('#11131A'))
    ctx.set_source_rgba(*hexc('#1E2130')); rrect(ctx, 60, 300, 960, 80, 34); ctx.fill(); ctx.rectangle(60, 350, 960, 30); ctx.fill()
    ctx.set_source_rgba(0.94, 0.27, 0.27, 0.6 + 0.4 * pulse); ctx.arc(110, 340, 13, 0, 2 * math.pi); ctx.fill()
    text(ctx, 'You are sharing your screen', 140, 352, 30, hexc('#FCA5A5'), bold=False, align='left')
    # cursor highlight moving down the lines
    hl = min(3, int(max(0, lt - 0.4) / 0.55))
    found = lt > 2.0
    for i, (sline, col) in enumerate(CODE):
        y = 470 + i * 80
        if i == (1 if found else hl):
            c = CORAL if found else hexc('#334155')
            ctx.set_source_rgba(c[0], c[1], c[2], 0.35 if found else 0.9); ctx.rectangle(80, y - 50, 920, 72); ctx.fill()
        text(ctx, sline, 100, y, 38, col, font=MONO, bold=False, align='left')
    if found:
        ck = pop_scale(lt, 2.0)
        ctx.save(); ctx.translate(662, 525); ctx.scale(ck * 1.5, ck)
        ctx.new_path(); ctx.arc(0, 0, 46, 0, 2 * math.pi); ctx.restore(); ctx.save()
        ctx.set_source_rgba(*YEL); ctx.set_line_width(8); ctx.stroke()
        ctx.restore()
        text(ctx, "id = undefined  (userId hona tha)", 540, 830, 34, YEL, font=MONO, alpha=clamp((lt - 2.1) / 0.3))
    # senior tile: mic off
    tk = pop_scale(lt, 0.3)
    if tk > 0:
        ctx.save(); ctx.translate(800, 960); ctx.scale(tk, tk)
        card(ctx, -170, -70, 340, 140, 28, hexc('#1F2937'))
        ctx.set_source_rgba(*hexc('#64748B')); ctx.arc(-100, 0, 42, 0, 2 * math.pi); ctx.fill()
        text(ctx, 'S', -100, 15, 44, WHITE)
        text(ctx, 'Senior', -40, -8, 32, WHITE, align='left')
        text(ctx, 'mic off', -40, 34, 28, CORAL, bold=False, align='left')
        ctx.restore()
    ctx.restore()
    # explanation bubbles
    bubble(ctx, '"ye function, ye call karta hai..."', 90, 1220, False, hexc('#FFFFFF'), INK, lt, 0.5, 40, label='You')
    bubble(ctx, '"phir ye value..."', 90, 1400, False, hexc('#FFFFFF'), INK, lt, 1.2, 40)
    sx, sy = shake_xy(lt, 2.0, 22)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '...RUKO.', 540, 1600, 130, YEL, lt, 2.0)
    ctx.restore()

def rd_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#EC4899'), hexc('#F97316'), lt); blobs(ctx, lt, hexc('#FDE68A'), 5, 2); confetti_dots(ctx, lt, 0.2)
    pk = pop_scale(lt, 0.0)
    if pk > 0:
        ctx.save(); ctx.translate(540, 300); ctx.scale(pk, pk); ctx.rotate(-0.03)
        pill(ctx, 0, 0, 'BUG MIL GAYA ✓', 60, INK, MINT)
        ctx.restore()
    # stats card
    k = ease_out_cubic(prog(lt, 0.3, 0.45))
    if k > 0:
        ctx.save(); ctx.translate(0, 60 * (1 - k))
        card(ctx, 140, 420, 800, 300, 34, hexc('#111827'))
        rows = [('call duration', '00:47', WHITE), ('senior ke words', '0', CORAL), ('bugs fixed', '1', MINT)]
        for i, (a, b, c) in enumerate(rows):
            if lt < 0.4 + i * 0.25: continue
            y = 500 + i * 85
            text(ctx, a, 190, y, 38, GREY, font=MONO, bold=False, align='left')
            text(ctx, b, 890, y, 44, c, font=MONO, align='right')
        ctx.restore()
    sx, sy = shake_xy(lt, 1.7, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '"thanks bhai,', 540, 900, 110, WHITE, lt, 1.5)
    slam(ctx, 'BAHUT HELP', 540, 1060, 130, YEL, lt, 1.75)
    slam(ctx, 'HUI."', 540, 1200, 130, YEL, lt, 1.95)
    ctx.restore()
    dk = pop_scale(lt, 2.4)
    if dk > 0:
        duck(ctx, 540, 1400, 0.95 * dk)
        ctx.save(); ctx.translate(540, 1560); ctx.scale(dk, dk); ctx.rotate(-0.03)
        pill(ctx, 0, 0, 'senior = rubber duck with salary', 36, WHITE, INK, font=MONO)
        ctx.restore()

M = dict(scenes=[rd_s1, rd_s2, rd_s3], default=[3.0, 3.2, 3.6], accent=YEL,
         sfx=lambda tr, c: (tr.add(c[0], thump(120, 0.3), 0.7), tr.add(c[0] + 0.15, buzz(110, 0.4), 0.3),
                            tr.add(c[0] + 1.2, pop(600, 1100), 0.6), tr.add(c[0] + 2.1, pop(800, 1300), 0.5),
                            tr.add(c[1] + 0.05, pop(500, 900), 0.5),
                            [tr.add(c[1] + 0.4 + i * 0.55, blip(1200, 0.05, 'sine'), 0.3) for i in range(3)],
                            tr.add(c[1] + 0.5, pop(700, 1200), 0.4), tr.add(c[1] + 1.2, pop(700, 1200), 0.4),
                            tr.add(c[1] + 2.0, thump(90, 0.5), 1.0), tr.add(c[1] + 2.0, noise_burst(0.2), 0.3),
                            tr.add(c[2] + 0.05, chime((1046.5, 1568), 0.8), 0.5),
                            [tr.add(c[2] + 0.4 + i * 0.25, blip(988, 0.06), 0.35) for i in range(3)],
                            tr.add(c[2] + 1.5, thump(140, 0.3), 0.7), tr.add(c[2] + 1.75, thump(100, 0.5), 1.0),
                            tr.add(c[2] + 1.95, thump(90, 0.5), 0.9),
                            tr.add(c[2] + 2.4, pop(900, 500, 0.2), 0.5)))
