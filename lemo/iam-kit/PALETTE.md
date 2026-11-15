# Access Granted — "Neon Green + Claude Orange" look (from reel 06 on)

Chosen by the user on 2026-11-16. Dark room, two neon colours, real glow.
`neon-ref/` is the reel-05 project recoloured in this look: copy its COLOURS and
GLOW technique, never its story or shots.

| Role | Colour |
|---|---|
| Floor | `#020403` (near black), grid lines `#0B2412` |
| Sky / beyond the room | vertical-ish gradient `#000000` → `#00CC54` (green glow behind the walls) |
| Walls | `#0A100C` |
| Doors, windows, open gate leaf, "good / granted" things | neon green `#00FF66` |
| Turnstiles, posts, people's tops, props, guard, badges-in-use, "denied / alert" things | Claude orange `#D97757` |
| Dark props (server, bags, legs, shadows) | `#0F1A12` |
| Light objects (badges, warm lamps) | `#EEC677` / `#F1C474` |
| Floor text | white `#FFFFFF`, one accent word per phrase in `#D97757` |
| Header / subtitle / footer boxes | `rgba(4,8,5,.88)` with text `#DFFFE6` |
| "ACCESS GRANTED" | `#34D399`, "· NN" in `#D97757` |

kit.js `C`: `bg '#020403', paper '#0A0F0B', ink '#FFFFFF', soft '#B8D8C0', ghost '#0B2412',
accent '#D97757', accentLt '#D97757', green/greenMid/greenLt '#00FF66', ginger '#D97757'`;
`TOPS = ['#00FF66','#D97757','#00FF66','#FFFFFF']`, `LEGS` all `'#0F1A12'`;
`tri()` lift colour `'#FFCC66'`, drop colour `'#0F1A12'`.

Glow (bloom) — wrap the render entry at the end of main.js:

```js
window.render = t => { render(g, t);
  if (!window.__bc) { window.__bc = document.createElement('canvas'); window.__bc.width = W; window.__bc.height = H; }
  const bx = window.__bc.getContext('2d'); bx.clearRect(0, 0, W, H);
  bx.filter = 'blur(12px)'; bx.drawImage(cv, 0, 0); bx.filter = 'none';
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .75; g.drawImage(window.__bc, 0, 0); g.restore(); };
```

Cover: accent `#D97757`, accent_ink `#0B0D12`.
