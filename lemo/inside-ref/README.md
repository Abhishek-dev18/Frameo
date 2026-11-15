# Scale Zoom reference (Sunday Inside)

A working 25 s sample in Lemo-Opuscar's **Scale Zoom Explainer** style (`styles/flat-space-explainer`), vertical 1080×1920:
"Har chamakta dot, ek payment": Earth → a city → a chai stall → a phone, then a pull-back through every ring.

Read it for technique, never copy its story, levels or shots.

- `flat.js` is the demo's palette + flat helpers with `W, H = 1080, 1920`; `orbi.js`, `heroes.js` are the demo's guide engine.
  The Sunday Inside series uses its own guide (`lemo/inside-kit/guide.js`), not Orbi.
- `film.js`: one depth parameter `d(t)` (0, 1, 2, 3 …); between integers the camera dives through the next-stop ring in log space
  (`scene()`), the next level grows inside the ring's clip. `ringLock`, `sightLine`, `instrument` (field-of-view readout + log ribbon),
  `subtitles` (Hinglish over English), `headline` (one big number).
- `window.EV` events (vo, sight, lock, dive, paid, back) drive `mix.py` (Lemo core sampler; run with `LIB=<lemo root>`).
- Render: `node core/render/events.mjs <proj> --size 1080x1920`, `LIB=. .venv/bin/python <proj>/mix.py`,
  `node core/render/video.mjs <proj> --size 1080x1920 --fps 24 --workers 2`, then mux with ffmpeg + loudnorm (-14 LUFS).
