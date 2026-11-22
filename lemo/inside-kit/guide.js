// guide.js: «Kanchu», the Sunday Inside guide (Scale Zoom Explainer style). Needs flat.js (C, el, g, shaded, clipOf, r1).
// A small coral pebble-bodied walker with one big jeweller's-loupe eye. The loupe is the camera's lens.
// guide(p, x, y, s, P): x, y = body centre, s = height in px. Every pose is a continuous number so poses blend by easing:
//   look [lx, ly] -1..1 (where the loupe points), lid 0..1 (blink), smile 0..1 (iris bends into an arch),
//   zoom 0..1 (loupe barrel steps out with turning grooves, iris narrows), wide 0..1 (iris opens: surprise),
//   squash (>0 wider/shorter, <0 taller), rot (deg), step (leg phase, any number), wave 0..1 (right arm up).
// guideLens(x, y, s, P) gives the lens centre in the same space as x, y (for the sight line).
const gcl = x => Math.max(0, Math.min(1, x)), glp = (a, b, k) => a + (b - a) * k;
function guideSq(P) { const q = P.squash || 0; return [1 + q, 1 - q * 0.85]; }
function guideLocal(s, P) { const [lx, ly] = P.look || [0, 0]; return [s * (0.03 + lx * 0.07), s * (-0.1 + ly * 0.05)]; }
function guideLens(x, y, s, P = {}) {
  const [qx, qy] = guideLocal(s, P), [kx, ky] = guideSq(P), a = (P.rot || 0) * Math.PI / 180, px = qx * kx, py = qy * ky;
  const z = Math.max(0, P.zoom || 0), [lx, ly] = P.look || [0, 0], out = s * 0.06 * z;
  return [x + Math.cos(a) * px - Math.sin(a) * py + lx * out, y + Math.sin(a) * px + Math.cos(a) * py + ly * out];
}
function guide(p, x, y, s, P = {}) {
  const u = v => v * s, [lx, ly] = P.look || [0, 0], [kx, ky] = guideSq(P), st = P.step || 0;
  const G = g(p, { transform: `translate(${r1(x)},${r1(y)}) rotate(${r1(P.rot || 0)}) scale(${kx.toFixed(4)},${ky.toFixed(4)})` });
  // legs: two mint capsules with round feet, stepping on a slow sine
  for (const sx of [-1, 1]) {
    const lift = Math.max(0, Math.sin(st + (sx > 0 ? Math.PI : 0))) * u(0.04);
    el('rect', { x: r1(u(sx * 0.14 - 0.045)), y: r1(u(0.3) - lift), width: r1(u(0.09)), height: r1(u(0.16)), rx: r1(u(0.045)), fill: C.mintD }, G);
    shaded(G, 'ellipse', { cx: r1(u(sx * 0.14 + 0.03)), cy: r1(u(0.46) - lift), rx: r1(u(0.085)), ry: r1(u(0.045)) }, C.mint, C.mintD, u(0.02), u(0.02));
  }
  // arms: short coral capsules; the right one can wave / point
  const wv = gcl(P.wave || 0);
  el('path', { d: `M${r1(u(-0.3))},${r1(u(0.05))}q${r1(u(-0.09))},${r1(u(0.06))} ${r1(u(-0.08))},${r1(u(0.15))}`, fill: 'none', stroke: C.coralD, 'stroke-width': r1(u(0.07)), 'stroke-linecap': 'round' }, G);
  const ax = glp(0.09, 0.06, wv), ay = glp(0.15, -0.2, wv);
  el('path', { d: `M${r1(u(0.3))},${r1(u(0.05))}q${r1(u(0.09))},${r1(u(0.04))} ${r1(u(ax))},${r1(u(ay))}`, fill: 'none', stroke: C.coralD, 'stroke-width': r1(u(0.07)), 'stroke-linecap': 'round' }, G);
  // body: a coral pebble with one shade step, a cream belly patch
  shaded(G, 'rect', { x: r1(u(-0.33)), y: r1(u(-0.36)), width: r1(u(0.66)), height: r1(u(0.7)), rx: r1(u(0.3)) }, C.coral, C.coralD, u(0.06), u(0.05));
  el('ellipse', { cx: r1(u(-0.02)), cy: r1(u(0.2)), rx: r1(u(0.16)), ry: r1(u(0.09)), fill: C.cream }, G);
  // a little blue cap with a mist button (the series' mark)
  el('path', { d: `M${r1(u(-0.2))},${r1(u(-0.31))}Q${r1(u(-0.02))},${r1(u(-0.5))} ${r1(u(0.2))},${r1(u(-0.31))}Z`, fill: C.blue }, G);
  el('rect', { x: r1(u(-0.24)), y: r1(u(-0.34)), width: r1(u(0.48)), height: r1(u(0.05)), rx: r1(u(0.025)), fill: C.blueD }, G);
  el('circle', { cx: 0, cy: r1(u(-0.44)), r: r1(u(0.035)), fill: C.mist }, G);
  // the loupe eye: cream rim, blue barrel that steps out on zoom with six turning grooves, night glass, mint iris
  const z = Math.max(0, P.zoom || 0), [cx0, cy0] = guideLocal(s, P), out = u(0.06) * z, cx = cx0 + lx * out, cy = cy0 + ly * out;
  const R0 = u(0.2), R1 = u(0.15), Rc = R0 * (1 + 0.08 * z);
  el('circle', { cx: r1(cx0), cy: r1(cy0), r: r1(R0 * 1.06), fill: C.blueD }, G);
  if (z > 0.005) el('circle', { cx: r1((cx + cx0) / 2), cy: r1((cy + cy0) / 2), r: r1(R0 * 1.04), fill: C.blue }, G);
  el('circle', { cx: r1(cx), cy: r1(cy), r: r1(Rc), fill: C.cream }, G);
  if (z > 0.005) { const rr = (Rc + R1) / 2, k = Math.min(1, z * 2.5), a0 = z * 1.4;
    for (let i = 0; i < 6; i++) { const a = a0 + i * Math.PI / 3; el('circle', { cx: r1(cx + Math.cos(a) * rr), cy: r1(cy + Math.sin(a) * rr), r: r1(u(0.012) * k), fill: C.creamD }, G); } }
  el('circle', { cx: r1(cx), cy: r1(cy), r: r1(R1), fill: C.night }, G);
  const L = g(G, { 'clip-path': clipOf('circle', { cx: r1(cx), cy: r1(cy), r: r1(R1) }) });
  const sm = gcl(P.smile || 0), fx = u(lx * 0.035), fy = u(ly * 0.03);
  const ir = u(0.085) * (1 + 0.25 * (P.wide || 0)) * (1 - 0.3 * z) * (1 + 0.2 * sm), ix = cx + fx, iy = cy + fy - ir * 0.2 * sm;
  el('circle', { cx: r1(ix), cy: r1(iy), r: r1(ir), fill: C.mint }, L);
  el('circle', { cx: r1(ix), cy: r1(iy), r: r1(ir * (0.45 - 0.1 * z)), fill: C.night }, L);
  if (sm > 0.005) el('circle', { cx: r1(ix), cy: r1(iy + ir * glp(2.3, 0.5, sm)), r: r1(ir * glp(1.0, 0.92, sm)), fill: C.night }, L);
  if (sm < 0.995) el('circle', { cx: r1(ix - ir * 0.4), cy: r1(iy - ir * 0.45), r: r1(ir * 0.3 * (1 - sm)), fill: C.cream }, L);
  const lid = P.lid || 0;
  if (lid > 0.005) { const RL = R1 * 1.7; el('circle', { cx: r1(cx), cy: r1(cy - R1 - RL + 2 * R1 * lid), r: r1(RL), fill: C.coralD }, L); }
  // cheeks: two cream-dark ovals that lift with the smile
  for (const sx of [-1, 1]) el('ellipse', { cx: r1(cx0 + sx * u(0.235)), cy: r1(cy0 + u(0.15) - u(0.025) * sm), rx: r1(u(0.04)), ry: r1(u(0.025)), fill: C.creamD }, G);
  return G;
}
