// Eye-catching reel cover (thumbnail) for every Debug Diaries series, 1080x1920 JPG.
// Not a plain frame: a strong frame from the reel, zoomed and darkened, under a huge curiosity hook
// with one highlighted word, a series badge and a teaser line. All key text sits inside the centre
// 1080x1440 band, so the 3:4 profile-grid crop never cuts it.
//
// usage: node scripts/cover/cover.mjs cover.json
// cover.json:
// {
//   "bg": "/abs/path/frame.jpg",          // a striking frame from the reel (ffmpeg -ss T -i reel.mp4 -frames:v 1 frame.jpg)
//   "out": "/abs/path/cover.jpg",
//   "kicker": "ACCESS GRANTED · 03",       // series + number, small pill above the hook
//   "hook": ["Login worked.", "Still DENIED?"],  // 2-3 short lines, max ~14 characters each: a question, a surprise or a stakes line
//   "highlight": "DENIED?",                // one word/phrase of the hook drawn on an accent block
//   "teaser": "The 4 A's every dev mixes up", // one line under the hook that teases the payoff (no spoilers)
//   "accent": "#7A4FD6",                    // series colour (hook highlight, pill)
//   "accent_ink": "#FFFFFF",                // text colour on the accent block
//   "bg_crop": [260, 1560],                 // optional: keep only source rows y0..y1 (cut the reel's header/subtitles/HUD out of the background)
//   "bg_zoom": 1.25, "bg_focus": [0.5, 0.45], // zoom into the frame and where to centre it (0..1)
//   "sticker": "?",                         // optional big rotated sticker glyph or short word ("?", "BUG", "404", "2 min")
//   "brand": "DEBUG DIARIES"
// }
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // global preinstalled Playwright (or the repo's)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const S = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
if (S.bg_crop) { // crop the background frame to the clean picture band before using it
  const { execFileSync } = await import('node:child_process');
  const [y0, y1] = S.bg_crop, tmp = S.out.replace(/\.jpe?g$/i, '') + '.bg.jpg';
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', S.bg, '-vf', `crop=iw:${y1 - y0}:0:${y0}`, '-q:v', '2', tmp]);
  S.bg = tmp;
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const b64 = f => fs.readFileSync(f).toString('base64');
const mime = f => /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
const accent = S.accent || '#4ADE80', ink = S.accent_ink || '#0B0D12';
const zoom = S.bg_zoom ?? 1.2, [fx, fy] = S.bg_focus || [0.5, 0.45];
const hl = S.highlight || '';
const hookHtml = (S.hook || []).map(line => {
  let h = esc(line);
  if (hl && line.includes(hl)) h = h.replace(esc(hl), `<span class="hl">${esc(hl)}</span>`);
  return `<div class="line">${h}</div>`;
}).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/ttf;base64,${b64(path.join(here, 'fonts/Inter.ttf'))}) format('truetype');font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0B0D12;font-family:Inter,sans-serif}
.bg{position:absolute;inset:0;background:url(data:${mime(S.bg)};base64,${b64(S.bg)}) no-repeat;background-size:cover;
  background-position:${fx * 100}% ${fy * 100}%;transform:scale(${zoom});transform-origin:${fx * 100}% ${fy * 100}%;filter:saturate(1.25) contrast(1.08)}
.shade{position:absolute;inset:0;background:
  radial-gradient(120% 60% at 50% 50%, rgba(8,9,14,.15) 0%, rgba(8,9,14,.55) 60%, rgba(8,9,14,.9) 100%),
  linear-gradient(180deg, rgba(8,9,14,.85) 0%, rgba(8,9,14,.1) 22%, rgba(8,9,14,.1) 52%, rgba(8,9,14,.92) 100%)}
.glow{position:absolute;left:-200px;right:-200px;top:820px;height:520px;background:radial-gradient(closest-side, ${accent}55, transparent);filter:blur(30px)}
.safe{position:absolute;left:64px;right:64px;top:300px;bottom:300px;display:flex;flex-direction:column;justify-content:center}
.kicker{align-self:flex-start;background:${accent};color:${ink};font-weight:800;font-size:38px;letter-spacing:4px;padding:14px 26px;border-radius:14px;margin-bottom:34px;box-shadow:0 12px 40px rgba(0,0,0,.45)}
.hook{color:#fff;font-weight:900;font-size:128px;line-height:1.02;letter-spacing:-4px;text-shadow:0 8px 40px rgba(0,0,0,.65)}
.line{margin:6px 0;white-space:nowrap;width:max-content}
.hl{display:inline-block;background:${accent};color:${ink};padding:0 22px 6px;border-radius:18px;transform:rotate(-2.5deg);text-shadow:none;box-shadow:0 18px 50px rgba(0,0,0,.5)}
.teaser{margin-top:40px;color:#F3F1EA;font-weight:600;font-size:46px;line-height:1.2;max-width:900px;text-shadow:0 4px 24px rgba(0,0,0,.8)}
.teaser b{color:${accent};filter:brightness(1.35)}
.sticker{position:absolute;right:70px;top:330px;width:190px;height:190px;border-radius:50%;background:#FFD43B;color:#0B0D12;font-weight:900;
  font-size:${(S.sticker || '').length > 2 ? 54 : 130}px;display:flex;align-items:center;justify-content:center;transform:rotate(12deg);box-shadow:0 18px 50px rgba(0,0,0,.55);border:8px solid #0B0D12}
.brand{position:absolute;left:0;right:0;bottom:120px;text-align:center;color:rgba(255,255,255,.85);font-weight:800;font-size:30px;letter-spacing:8px}
.brand i{font-style:normal;color:${accent};filter:brightness(1.35)}
</style></head><body>
<div class="bg"></div><div class="shade"></div><div class="glow"></div>
${S.sticker ? `<div class="sticker">${esc(S.sticker)}</div>` : ''}
<div class="safe">
  ${S.kicker ? `<div class="kicker">${esc(S.kicker)}</div>` : ''}
  <div class="hook">${hookHtml}</div>
  ${S.teaser ? `<div class="teaser">${esc(S.teaser)}</div>` : ''}
</div>
<div class="brand"><i>●</i> ${esc(S.brand || 'DEBUG DIARIES')}</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
// shrink the hook if any line overflows the safe width
await page.evaluate(() => {
  const hook = document.querySelector('.hook'); let fs = 128;
  while (fs > 70 && [...hook.querySelectorAll('.line')].some(l => l.getBoundingClientRect().width > 952)) { fs -= 4; hook.style.fontSize = fs + 'px'; }
});
await page.screenshot({ path: S.out, type: 'jpeg', quality: 92 });
await browser.close();
console.log('cover', S.out);
