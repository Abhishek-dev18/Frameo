# MEME 6 — Standup: "looking into it" Mon→Thu → QA closes it "Cannot reproduce" → standup: "fixed."
NAME = 'standup'
OUTNAME = 'meme06_looking_into_it'

def ticket(ctx, x, y, w, status, status_col, status_fg, sub=None):
    card(ctx, x, y, w, 250, 34, hexc('#FFFFFF'))
    # original bug glyph: red rounded square with a small dot
    ctx.set_source_rgba(*hexc('#EF4444')); rrect(ctx, x + 40, y + 40, 56, 56, 14); ctx.fill()
    ctx.set_source_rgba(*WHITE); ctx.arc(x + 68, y + 68, 12, 0, 2 * math.pi); ctx.fill()
    text(ctx, 'BUG-1427', x + 120, y + 82, 36, hexc('#6B7280'), font=MONO, align='left')
    text(ctx, 'Checkout total galat aa raha', x + 40, y + 160, 42, INK, align='left')
    pill(ctx, x + w - 170, y + 210, status, 30, status_fg, status_col, pad=22)
    if sub: text(ctx, sub, x + 40, y + 222, 28, hexc('#6B7280'), bold=False, align='left')

def say(ctx, s, x, y, lt, t0, fill, fg, size=50, who='You', rot=0.0):
    k = pop_scale(lt, t0, 0.6, 8, 1.8)
    if k <= 0: return
    ctx.select_font_face('Inter Display', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD); ctx.set_font_size(size)
    w = ctx.text_extents(s).x_advance + 80; h = 128
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k)
    card(ctx, -w / 2, -h / 2, w, h, 44, fill)
    text(ctx, s, 0, size * 0.36, size, fg)
    if who: text(ctx, who, -w / 2 + 16, -h / 2 - 16, 28, WHITE, bold=False, align='left', alpha=0.85)
    ctx.restore()

def su_s1(ctx, lt, L):
    grad_bg(ctx, hexc('#8B5CF6'), hexc('#1E3A8A'), lt); blobs(ctx, lt, hexc('#C4B5FD')); confetti_dots(ctx, lt)
    # meeting card
    s = pop_scale(lt, 0.05)
    ctx.save(); ctx.translate(540, 330); ctx.scale(max(s, 1e-3), max(s, 1e-3)); ctx.rotate(-0.03)
    card(ctx, -380, -90, 760, 180, 40, hexc('#FFFFFF'))
    ctx.set_source_rgba(*hexc('#2563EB')); rrect(ctx, -380, -90, 200, 180, 40); ctx.fill(); ctx.rectangle(-220, -90, 40, 180); ctx.fill()
    text(ctx, 'MON', -280, -6, 58, WHITE)
    text(ctx, '10:00', -280, 52, 36, hexc('#DBEAFE'), font=MONO, bold=False)
    text(ctx, 'Daily Standup', -140, -2, 52, INK, align='left')
    text(ctx, '15 min  ·  camera off', -140, 50, 32, hexc('#6B7280'), bold=False, align='left')
    ctx.restore()
    # ticket slides in
    k = spring(prog(lt, 0.35, 0.7), 7, 1.5)
    if k > 0:
        ctx.save(); ctx.translate(-900 * (1 - k), 0)
        ticket(ctx, 90, 540, 900, 'IN PROGRESS', hexc('#2563EB'), WHITE)
        ctx.restore()
    say(ctx, 'bug dekh raha hoon', 540, 1030, lt, 1.0, hexc('#22C55E'), WHITE, 54, rot=-0.02)
    say(ctx, 'aaj hi ho jayega', 540, 1240, lt, 1.7, hexc('#FFFFFF'), INK, 54, who=None, rot=0.02)
    if lt > 2.2:
        kk = ease_out_cubic(prog(lt, 2.2, 0.4))
        text(ctx, 'confidence: 100%', 540, 1450 + 30 * (1 - kk), 46, hexc('#E0E7FF'), font=MONO, bold=False, alpha=kk)

def su_s2(ctx, lt, L):
    grad_bg(ctx, hexc('#0D9488'), hexc('#0F172A'), lt); blobs(ctx, lt, hexc('#5EEAD4'), 4, 6)
    days = ['TUE', 'WED', 'THU']
    step = 0.75
    for i, d in enumerate(days):
        t0 = 0.15 + i * step
        k = prog(lt, t0, 0.5)
        if k <= 0: continue
        sp = spring(k, 8, 1.7); side = -1 if i % 2 == 0 else 1
        y = 330 + i * 300
        ctx.save(); ctx.translate(540 + side * 800 * (1 - sp), y); ctx.rotate(side * 0.02)
        card(ctx, -450, -110, 900, 220, 36, hexc('#FFFFFF'))
        ctx.set_source_rgba(*hexc('#F59E0B')); rrect(ctx, -450, -110, 190, 220, 36); ctx.fill(); ctx.rectangle(-300, -110, 40, 220); ctx.fill()
        text(ctx, d, -355, 20, 60, WHITE)
        text(ctx, '"looking into it"', -220, 0, 52, INK, align='left')
        text(ctx, 'ctrl+c  ·  ctrl+v', -220, 60, 30, hexc('#9CA3AF'), font=MONO, bold=False, align='left')
        ctx.restore()
    # ticket age counter
    n = 1 + min(3, int(max(0, lt - 0.15) / step) + 1) if lt > 0.15 else 1
    if lt > 0.15:
        s = pop_scale(lt, 0.15)
        ctx.save(); ctx.translate(540, 1300); ctx.scale(s, s)
        pill(ctx, 0, 0, f'ticket age: {n} din', 52, WHITE, CORAL, font=MONO)
        ctx.restore()
    if lt > 2.4:
        s2 = pop_scale(lt, 2.4)
        ctx.save(); ctx.translate(540, 1470); ctx.scale(s2, s2); ctx.rotate(-0.03)
        pill(ctx, 0, 0, 'same line. different din.', 44, INK, hexc('#FDE68A'))
        ctx.restore()

def su_s3(ctx, lt, L):
    grad_bg(ctx, hexc('#F43F5E'), hexc('#7C2D12'), lt); blobs(ctx, lt, hexc('#FDBA74'), 5, 2); confetti_dots(ctx, lt, 0.2)
    k = ease_out_cubic(prog(lt, 0.0, 0.4))
    ctx.save(); ctx.translate(0, -60 * (1 - k))
    closed = lt > 0.75
    if closed:
        ticket(ctx, 90, 240, 900, 'CLOSED', hexc('#6B7280'), WHITE, sub='QA: Cannot reproduce')
    else:
        ticket(ctx, 90, 240, 900, 'IN PROGRESS', hexc('#2563EB'), WHITE)
    ctx.restore()
    stk = prog(lt, 0.75, 0.4)
    if stk > 0:
        sc = 2.2 - 1.2 * spring(stk, 8, 1.6)
        ctx.save(); ctx.translate(700, 600); ctx.rotate(-0.12); ctx.scale(sc, sc)
        ctx.set_source_rgba(*hexc('#FFFFFF', 0.92)); rrect(ctx, -250, -50, 500, 100, 16); ctx.fill()
        ctx.set_source_rgba(*hexc('#E11D48')); ctx.set_line_width(8); rrect(ctx, -250, -50, 500, 100, 16); ctx.stroke()
        text(ctx, 'CANNOT REPRODUCE', 0, 16, 44, hexc('#E11D48'), font=MONO)
        ctx.restore()
    kk = ease_out_cubic(prog(lt, 1.25, 0.35))
    text(ctx, 'FRIDAY standup, me:', 540, 870 + 20 * (1 - kk), 58, WHITE, alpha=kk)
    sx, sy = shake_xy(lt, 1.7, 34)
    ctx.save(); ctx.translate(sx, sy)
    slam(ctx, '"FIXED."', 540, 1100, 230, hexc('#FDE047'), lt, 1.7)
    ctx.restore()
    s = pop_scale(lt, 2.4)
    if s > 0:
        ctx.save(); ctx.translate(540, 1390); ctx.scale(s, s); ctx.rotate(-0.04)
        pill(ctx, 0, 0, 'commits: 0', 54, WHITE, hexc('#111827'), font=MONO)
        ctx.restore()
    kk2 = ease_out_cubic(prog(lt, 2.8, 0.4))
    text(ctx, 'bug ne khud resign kar diya.', 540, 1540 + 20 * (1 - kk2), 46, hexc('#FFEDD5'), alpha=kk2)

M = dict(scenes=[su_s1, su_s2, su_s3], default=[3.0, 3.2, 3.6], accent=hexc('#FDE047'),
         sfx=lambda tr, c: (tr.add(c[0] + 0.05, pop(500, 1000), 0.6), tr.add(c[0] + 0.35, whoosh(0.5), 0.4),
                            tr.add(c[0] + 1.0, pop(600, 1200), 0.6), tr.add(c[0] + 1.7, pop(700, 1300), 0.6),
                            tr.add(c[0] + 2.2, chime((880, 1318.5), 0.7), 0.4),
                            [tr.add(c[1] + 0.15 + i * 0.75, whoosh(0.35), 0.4) for i in range(3)],
                            [tr.add(c[1] + 0.3 + i * 0.75, thump(140 - i * 15, 0.3), 0.7) for i in range(3)],
                            tr.add(c[1] + 2.4, pop(500, 900), 0.5),
                            tr.add(c[2] + 0.75, thump(160, 0.3), 0.8), tr.add(c[2] + 0.75, noise_burst(0.25), 0.4),
                            tr.add(c[2] + 1.7, thump(95, 0.55), 1.0), tr.add(c[2] + 1.7, buzz(98, 0.6), 0.35),
                            tr.add(c[2] + 2.4, pop(900, 500, 0.2), 0.5)))
