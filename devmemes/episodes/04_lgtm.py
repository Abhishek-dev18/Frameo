# MEME 4 — Code review: 2-line PR gets 40 comments, 2000-line PR gets "LGTM"
NAME = 'lgtm'
OUTNAME = 'meme04_lgtm_code_review'

def pr_header(ctx, x, y, w, title, plus, minus, files, badge=None, badge_col=None):
    card(ctx, x, y, w, 210, 34, hexc('#FFFFFF'))
    # original "merge" glyph: two dots joined by a curve
    ctx.set_source_rgba(*hexc('#8B5CF6')); ctx.set_line_width(7)
    ctx.arc(x + 62, y + 58, 13, 0, 2 * math.pi); ctx.stroke(); ctx.arc(x + 62, y + 150, 13, 0, 2 * math.pi); ctx.stroke()
    ctx.move_to(x + 62, y + 71); ctx.line_to(x + 62, y + 137); ctx.stroke()
    text(ctx, title, x + 110, y + 76, 42, INK, align='left')
    text(ctx, plus, x + 110, y + 150, 36, hexc('#16A34A'), font=MONO, align='left')
    ctx.select_font_face(MONO, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(36)
    pw = ctx.text_extents(plus).x_advance
    text(ctx, minus, x + 130 + pw, y + 150, 36, hexc('#DC2626'), font=MONO, align='left')
    text(ctx, files, x + w - 40, y + 150, 30, hexc('#6B7280'), bold=False, align='right')

def lg_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#0EA5E9'), hexc('#4338CA'), lt); blobs(ctx, lt, hexc('#A5F3FC')); confetti_dots(ctx, lt)
    k = spring(prog(lt, 0.0, 0.7), 7, 1.5)
    ctx.save(); ctx.translate(0, -160 * (1 - k))
    pr_header(ctx, 70, 230, 940, 'fix: null check', '+2', '-1', '1 file')
    ctx.restore()
    comments = [('nit: rename x -> userCount', 'Senior'), ('optional chaining kyu nahi?', 'Tech Lead'),
                ('tests kahan hain?', 'QA'), ('nit: trailing space', 'Senior'), ('isko helper bana do', 'Architect')]
    for i, (s, who) in enumerate(comments):
        ck = prog(lt, 0.55 + i * 0.32, 0.5)
        if ck <= 0: continue
        sp = spring(ck, 8, 1.6); side = -1 if i % 2 == 0 else 1
        y = 560 + i * 165
        ctx.save(); ctx.translate(540 + side * 700 * (1 - sp), y); ctx.rotate(side * 0.025)
        card(ctx, -440, -62, 880, 128, 30, hexc('#FFFFFF'))
        ctx.set_source_rgba(*CORAL); ctx.arc(-375, 2, 34, 0, 2 * math.pi); ctx.fill()
        text(ctx, who[0], -375, 16, 38, WHITE)
        text(ctx, who, -320, -14, 26, hexc('#6B7280'), bold=False, align='left')
        text(ctx, s, -320, 34, 38, INK, align='left')
        ctx.restore()
    # counter
    n = int(clamp((lt - 0.55) / 2.0) * 40)
    if lt > 0.55:
        s = pop_scale(lt, 0.55)
        ctx.save(); ctx.translate(540, 1460); ctx.scale(s, s)
        pill(ctx, 0, 0, f'{n} comments', 56, WHITE, CORAL)
        ctx.restore()
    if lt > 2.5:
        kk = ease_out_cubic(prog(lt, 2.5, 0.4))
        pill(ctx, 540, 1610 + 30 * (1 - kk), 'CHANGES REQUESTED', 38, CORAL, hexc('#FFFFFF'), alpha=kk)

def lg_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#F97316'), hexc('#BE185D'), lt); blobs(ctx, lt, hexc('#FDE68A'), 4, 7)
    kk = ease_out_cubic(prog(lt, 0.05, 0.4))
    text(ctx, 'agle din...', 540, 300 + 20 * (1 - kk), 60, WHITE, alpha=kk)
    k = spring(prog(lt, 0.2, 0.7), 7, 1.5)
    ctx.save(); ctx.translate(540, 470); ctx.scale(max(k, 1e-3), max(k, 1e-3)); ctx.translate(-540, -470)
    pr_header(ctx, 70, 370, 940, 'refactor: everything', '+2,147', '-1,893', '86 files')
    ctx.restore()
    # diff window scrolling faster and faster
    x0, y0, w0, h0 = 70, 640, 940, 900
    card(ctx, x0, y0, w0, h0, 30, hexc('#11131A'))
    ctx.save(); rrect(ctx, x0, y0, w0, h0, 30); ctx.clip()
    off = 120 * lt + 260 * lt ** 2.3
    rng = random.Random(21)
    rows = [(rng.random(), rng.uniform(0.25, 0.9)) for _ in range(400)]
    rh = 44
    first = int(off // rh)
    for j in range(first, first + h0 // rh + 2):
        r, wl = rows[j % 400]
        y = y0 + 20 + j * rh - off
        if r < 0.45: col, bgc, sg = hexc('#4ADE80'), hexc('#14532D'), '+'
        elif r < 0.8: col, bgc, sg = hexc('#FB7185'), hexc('#4C0519'), '-'
        else: col, bgc, sg = hexc('#6B7280'), None, ' '
        if bgc: ctx.set_source_rgba(*bgc); ctx.rectangle(x0, y, w0, rh - 4); ctx.fill()
        text(ctx, sg, x0 + 24, y + 31, 30, col, font=MONO, bold=False, align='left')
        ctx.set_source_rgba(col[0], col[1], col[2], 0.7); rrect(ctx, x0 + 70, y + 12, (w0 - 120) * wl, 16, 8); ctx.fill()
    ctx.restore()
    if lt > 1.6:
        s = pop_scale(lt, 1.6)
        ctx.save(); ctx.translate(540, 1640); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'Review requested: 4 people', 40, INK, hexc('#FDE68A'))
        ctx.restore()

def lg_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#22C55E'), hexc('#065F46'), lt); blobs(ctx, lt, hexc('#BBF7D0'), 5, 4); confetti_dots(ctx, lt, 0.22)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, 50 * (1 - k))
    card(ctx, 140, 300, 800, 130, 34, hexc('#FFFFFF'))
    ctx.set_source_rgba(*MINT); ctx.arc(215, 365, 36, 0, 2 * math.pi); ctx.fill()
    ctx.set_source_rgba(*WHITE); ctx.set_line_width(9); ctx.move_to(197, 366); ctx.line_to(211, 381); ctx.line_to(235, 350); ctx.stroke()
    text(ctx, 'Approved  ·  2 min baad', 275, 382, 46, INK, align='left')
    ctx.restore()
    sx, sy = shake_xy(lt, 0.7, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'LGTM', 540, 760, 280, WHITE, lt, 0.7)
    # thumbs-up drawn as a simple fist shape (original)
    tk = pop_scale(lt, 1.05)
    if tk > 0:
        ctx.save(); ctx.translate(540, 1080); ctx.scale(tk, tk); ctx.rotate(-0.12)
        ctx.set_source_rgba(*hexc('#FDE047'))
        rrect(ctx, -90, -20, 170, 150, 36); ctx.fill()
        rrect(ctx, -40, -130, 70, 140, 35); ctx.fill()
        ctx.set_source_rgba(*hexc('#CA8A04')); ctx.set_line_width(6)
        for yy in (25, 65, 100): ctx.move_to(-20, yy); ctx.line_to(70, yy); ctx.stroke()
        ctx.set_source_rgba(*hexc('#1D4ED8')); rrect(ctx, -140, -30, 55, 170, 16); ctx.fill()
        ctx.restore()
    ctx.restore()
    if lt > 1.8:
        s = pop_scale(lt, 1.8)
        ctx.save(); ctx.translate(540, 1370); ctx.scale(s, s)
        pill(ctx, 0, 0, 'files viewed: 0 / 86', 48, WHITE, CORAL, font=MONO)
        ctx.restore()
    kk = ease_out_cubic(prog(lt, 2.4, 0.5))
    text(ctx, 'kisi ne kholi tak nahi.', 540, 1520 + 20 * (1 - kk), 52, hexc('#ECFDF5'), alpha=kk)

M = dict(scenes=[lg_s1, lg_s2, lg_s3], default=[3.0, 3.2, 3.6], accent=hexc('#FDE047'),
         sfx=lambda tr, c: (tr.add(c[0] + 0.05, whoosh(0.5), 0.4),
                            [tr.add(c[0] + 0.55 + i * 0.32, pop(500 + i * 90, 1100 + i * 90), 0.55) for i in range(5)],
                            [tr.add(c[0] + 0.6 + i * 0.05, blip(1500, 0.02), 0.12) for i in range(40)],
                            tr.add(c[0] + 2.5, buzz(120, 0.5), 0.35),
                            tr.add(c[1] + 0.2, thump(150), 0.8),
                            [tr.add(c[1] + x, blip(1200, 0.025), 0.18) for x in np.cumsum(np.maximum(0.03, 0.22 * np.exp(-np.arange(70) / 16)))
                             if x < c[2] - c[1] - 0.2],
                            tr.add(c[1] + 1.6, pop(700, 1200), 0.5),
                            tr.add(c[2] + 0.05, chime((880, 1318.5), 0.7), 0.45),
                            tr.add(c[2] + 0.7, thump(95, 0.55), 1.0), tr.add(c[2] + 1.05, pop(900, 500, 0.2), 0.5),
                            tr.add(c[2] + 1.8, buzz(98, 0.7), 0.4)))
