# MEME 5 — All tests green → prod down → the tests mocked the database (and my confidence)
NAME = 'mocked'
OUTNAME = 'meme05_sab_mock_tha'

def db_cyl(ctx, x, y, w, h, body, top, dashed=False):
    ry = w * 0.18
    def ell(cy, a0, a1):
        ctx.save(); ctx.translate(x, cy); ctx.scale(w / 2, ry); ctx.arc(0, 0, 1, a0, a1); ctx.restore()
    ctx.save()
    ctx.set_source_rgba(*body); ctx.new_path(); ell(y + h, 0, math.pi); ctx.line_to(x - w / 2, y); ctx.line_to(x + w / 2, y); ctx.close_path(); ctx.fill()
    ctx.set_source_rgba(*top); ctx.set_line_width(7)
    for k in (1, 2):
        ctx.new_path(); ell(y + k * h / 3, 0, math.pi); ctx.stroke()
    ctx.new_path(); ell(y, 0, 2 * math.pi); ctx.fill()
    ctx.restore()

def mk_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#10B981'), hexc('#1E3A8A'), lt); blobs(ctx, lt, hexc('#A7F3D0')); confetti_dots(ctx, lt)
    k = ease_out_cubic(prog(lt, 0.0, 0.45))
    ctx.save(); ctx.translate(0, 80 * (1 - k))
    cmd = typed('$ npm test', lt, 0.1, 26)
    lines = [(cmd, WHITE)]
    n = int(clamp((lt - 0.55) / 0.8) * 142)
    if lt > 0.55: lines.append((f'PASS  {n} / 142 tests', MINT))
    if lt > 1.45: lines.append(('0 failing', MINT))
    terminal(ctx, 90, 260, 900, 360, lines, 'test')
    ctx.restore()
    # coverage bar
    ck = ease_in_out(prog(lt, 1.0, 0.9))
    if lt > 0.9:
        a = ease_out_cubic(prog(lt, 0.9, 0.3))
        text(ctx, 'coverage', 120, 760, 44, WHITE, align='left', alpha=a)
        text(ctx, f'{int(95 * ck)}%', 960, 760, 56, MINT, font=MONO, align='right', alpha=a)
        card(ctx, 110, 800, 860, 70, 35, hexc('#0B1220', 0.55), False)
        if ck > 0:
            ctx.set_source_rgba(*MINT); rrect(ctx, 110, 800, max(70, 860 * 0.95 * ck), 70, 35); ctx.fill()
    # big green badge
    s = pop_scale(lt, 1.8)
    if s > 0:
        ctx.save(); ctx.translate(540, 1150); ctx.scale(s, s); ctx.rotate(-0.06)
        ctx.set_source_rgba(*MINT); ctx.arc(0, 0, 150, 0, 2 * math.pi); ctx.fill()
        ctx.set_source_rgba(*WHITE); ctx.set_line_width(26); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.move_to(-70, 5); ctx.line_to(-15, 60); ctx.line_to(80, -55); ctx.stroke()
        ctx.restore()
    if lt > 2.2:
        kk = ease_out_cubic(prog(lt, 2.2, 0.4))
        pill(ctx, 540, 1450 + 30 * (1 - kk), 'git push --deploy  (full confidence)', 38, INK, hexc('#FFFFFF'), font=MONO, alpha=kk)

def mk_s2(ctx, lt, L):
    pulse = 0.5 + 0.5 * math.sin(lt * 13)
    grad_bg(ctx, hexc('#991B1B'), hexc('#0A0A0F'), lt); blobs(ctx, lt, hexc('#F87171'), 4, 8)
    g = cairo.RadialGradient(540, 960, 300, 540, 960, 1300)
    g.add_color_stop_rgba(0, 1, 0, 0, 0); g.add_color_stop_rgba(1, 1, 0.1, 0.1, 0.3 + 0.25 * pulse)
    ctx.set_source(g); ctx.paint()
    slam(ctx, '2 MIN BAAD', 540, 290, 110, WHITE, lt, 0.0)
    # status card
    s = pop_scale(lt, 0.3)
    if s > 0:
        sx, sy = (math.sin(lt * 80) * 5, math.cos(lt * 67) * 3) if lt > 0.6 else (0, 0)
        ctx.save(); ctx.translate(540 + sx, 560 + sy); ctx.scale(s, s)
        card(ctx, -440, -140, 880, 280, 40, hexc('#FFFFFF'))
        ctx.set_source_rgba(*CORAL); ctx.arc(-340, 0, 60, 0, 2 * math.pi); ctx.fill()
        ctx.set_source_rgba(*WHITE); ctx.set_line_width(14); ctx.set_line_cap(cairo.LINE_CAP_ROUND)
        ctx.move_to(-362, -22); ctx.line_to(-318, 22); ctx.move_to(-318, -22); ctx.line_to(-362, 22); ctx.stroke()
        text(ctx, '503', -240, -10, 96, INK, align='left')
        text(ctx, 'production is DOWN', -240, 70, 44, hexc('#DC2626'), align='left')
        ctx.restore()
    logs = [('ERROR connect ECONNREFUSED', CORAL), ('  db-prod:5432', hexc('#FCA5A5')), ('relation "users" does', CORAL),
            ('  not exist', hexc('#FCA5A5')), ('retrying... (37)', hexc('#FACC15'))]
    k = ease_out_cubic(prog(lt, 0.6, 0.4))
    if k > 0:
        ctx.save(); ctx.translate(0, 80 * (1 - k))
        shown = [l for i, l in enumerate(logs) if lt > 0.75 + i * 0.3]
        terminal(ctx, 90, 820, 900, 480, shown, 'prod logs')
        ctx.restore()
    if lt > 2.3:
        s2 = pop_scale(lt, 2.3)
        ctx.save(); ctx.translate(540, 1480); ctx.scale(s2, s2); ctx.rotate(0.04)
        pill(ctx, 0, 0, 'but tests were green?!', 46, WHITE, CORAL)
        ctx.restore()

def mk_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#A855F7'), hexc('#DB2777'), lt); blobs(ctx, lt, hexc('#FBCFE8'), 5, 2); confetti_dots(ctx, lt, 0.2)
    # test file card
    k = ease_out_cubic(prog(lt, 0.0, 0.45))
    ctx.save(); ctx.translate(0, -60 * (1 - k))
    card(ctx, 90, 230, 900, 330, 30, hexc('#11131A'))
    text(ctx, 'users.test.js', 540, 285, 28, hexc('#8A8FA8'), font=MONO, bold=False)
    code = [("jest.mock('./db')", hexc('#FDE047')), ('db.query = jest.fn(', WHITE), ('  () => [{ ok: true }])', MINT)]
    for i, (s, col) in enumerate(code):
        if lt > 0.25 + i * 0.25:
            text(ctx, typed(s, lt, 0.25 + i * 0.25, 40), 130, 370 + i * 64, 40, col, font=MONO, bold=False, align='left')
    ctx.restore()
    # cardboard db with MOCK stamp
    dk = pop_scale(lt, 0.6)
    if dk > 0:
        ctx.save(); ctx.translate(540, 760); ctx.scale(dk, dk); ctx.rotate(0.05)
        db_cyl(ctx, 0, -110, 260, 230, hexc('#E3B678'), hexc('#8B5E34'))
        text(ctx, 'prod DB', 0, 20, 44, hexc('#5B3A1E'))
        ctx.restore()
    stk = prog(lt, 1.0, 0.4)
    if stk > 0:
        sc = 2.2 - 1.2 * spring(stk, 8, 1.6)
        ctx.save(); ctx.translate(560, 860); ctx.rotate(-0.2); ctx.scale(sc, sc)
        ctx.set_source_rgba(*hexc('#FFFFFF', 0.9)); rrect(ctx, -170, -60, 340, 120, 18); ctx.fill()
        ctx.set_source_rgba(*hexc('#E11D48')); ctx.set_line_width(10); rrect(ctx, -170, -60, 340, 120, 18); ctx.stroke()
        text(ctx, 'MOCK', 0, 30, 84, hexc('#E11D48'), font=MONO)
        ctx.restore()
    sx, sy = shake_xy(lt, 1.5, 32)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, 'SAB MOCK', 540, 1130, 150, WHITE, lt, 1.5)
    slam(ctx, 'THA.', 540, 1290, 150, WHITE, lt, 1.7)
    ctx.restore()
    s = pop_scale(lt, 2.4)
    if s > 0:
        ctx.save(); ctx.translate(540, 1480); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'mera confidence bhi.', 54, INK, hexc('#FDE047'))
        ctx.restore()

M = dict(scenes=[mk_s1, mk_s2, mk_s3], default=[3.0, 3.2, 3.6], accent=hexc('#FDE047'),
         sfx=lambda tr, c: ([tr.add(c[0] + 0.1 + i / 26, blip(1700, 0.02), 0.12) for i in range(0, 10, 2)],
                            [tr.add(c[0] + 0.55 + i * 0.06, blip(1300 + i * 20, 0.02), 0.12) for i in range(14)],
                            tr.add(c[0] + 1.0, whoosh(0.8), 0.35),
                            tr.add(c[0] + 1.8, chime((880, 1318.5), 0.8), 0.5), tr.add(c[0] + 1.8, pop(600, 1200), 0.5),
                            tr.add(c[1], thump(90, 0.5), 1.0), tr.add(c[1] + 0.3, buzz(110, 1.6), 0.35),
                            [tr.add(c[1] + 0.75 + i * 0.3, blip(988, 0.08, 'sine'), 0.5) for i in range(5)],
                            tr.add(c[1] + 2.3, pop(500, 900), 0.5),
                            [tr.add(c[2] + 0.25 + i / 40, blip(1700, 0.02), 0.08) for i in range(0, 40, 3)],
                            tr.add(c[2] + 0.6, pop(400, 800, 0.2), 0.5), tr.add(c[2] + 1.0, thump(160, 0.3), 0.8),
                            tr.add(c[2] + 1.5, thump(110), 0.9), tr.add(c[2] + 1.7, thump(90, 0.5), 1.0),
                            tr.add(c[2] + 2.4, pop(900, 500, 0.2), 0.5)))
