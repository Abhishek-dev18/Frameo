// Frameo dashboard server. Runs on your computer only (127.0.0.1).
// It serves the dashboard, exposes a small API, runs render/post jobs and the scheduler.
import fs from "node:fs";
import path from "node:path";
import express from "express";
import {ROOT, setEnvValue, log} from "../scripts/lib/env.mjs";
import {loadEpisodes, saveEpisodes, postEpisode, createEpisode, deleteEpisode, update} from "../scripts/lib/episodes.mjs";
import {loadSettings, saveSettings} from "../scripts/lib/settings.mjs";
import {createScheduler} from "../scripts/lib/scheduler.mjs";
import {whoami, refreshToken} from "../scripts/lib/instagram.mjs";
import {oauthClient, TOKEN_FILE} from "../scripts/lib/youtube.mjs";
import {testStorage} from "../scripts/lib/storage.mjs";

const PORT = Number(process.env.PORT || 5174);
const HOST = "127.0.0.1";
const OUT = path.join(ROOT, "out");
const WEB = path.join(ROOT, "dist-web");
const app = express();
app.use(express.json({limit: "1mb"}));

// ---------- jobs (render / post) with live progress ----------
const jobs = new Map();
function runJob(id, type, fn) {
  if (jobs.get(id)?.state === "running") throw new Error("This episode is already busy");
  const job = {type, state: "running", step: type === "render" ? "Rendering video" : "Starting", progress: 0, error: null, startedAt: Date.now()};
  jobs.set(id, job);
  fn({onStep: (s) => (job.step = s), onProgress: (p) => (job.progress = p)})
    .then(() => Object.assign(job, {state: "done", step: "Done", progress: 1}))
    .catch((e) => Object.assign(job, {state: "error", error: e.message || String(e)}))
    .finally(() => setTimeout(() => jobs.get(id) === job && jobs.delete(id), 120000));
  return job;
}

const scheduler = createScheduler({
  run: (id) =>
    new Promise((resolve, reject) => {
      try {
        const job = runJob(id, "post", (cb) => postEpisode(id, cb));
        const t = setInterval(() => job.state !== "running" && (clearInterval(t), job.state === "done" ? resolve() : reject(new Error(job.error))), 1000);
      } catch (e) {
        reject(e);
      }
    }),
});
if (loadSettings().scheduler.enabled) scheduler.start();

// ---------- helpers ----------
const compositions = () => [...fs.readFileSync(path.join(ROOT, "src", "Root.tsx"), "utf8").matchAll(/<Composition\s+id="([^"]+)"/g)].map((m) => m[1]);
const has = (k) => Boolean(process.env[k]);
const wrap = (fn) => async (req, res) => {
  try {
    res.json(await fn(req, res));
  } catch (e) {
    res.status(400).json({error: e.message || String(e)});
  }
};
function withExtras(ep) {
  const file = path.resolve(ROOT, ep.file);
  const rendered = fs.existsSync(file);
  return {
    ...ep,
    rendered,
    videoUrl: rendered ? `/videos/${encodeURIComponent(path.basename(file))}?v=${Math.round(fs.statSync(file).mtimeMs)}` : null,
    job: jobs.get(ep.id) || null,
  };
}

// ---------- API ----------
app.get("/api/state", wrap(() => {
  const s = loadSettings();
  return {
    channel: s.channel,
    scheduler: {enabled: s.scheduler.enabled, running: scheduler.running},
    compositions: compositions(),
    connections: {
      storage: {configured: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"].every(has), bucket: process.env.R2_BUCKET || "", publicUrl: process.env.R2_PUBLIC_URL || ""},
      instagram: {configured: has("IG_ACCESS_TOKEN") && has("IG_USER_ID"), userId: process.env.IG_USER_ID || ""},
      youtube: {configured: has("YT_CLIENT_ID") && has("YT_CLIENT_SECRET"), connected: fs.existsSync(TOKEN_FILE), privacy: process.env.YT_PRIVACY || "private"},
    },
  };
}));

app.get("/api/episodes", wrap(() => loadEpisodes().map(withExtras)));
app.post("/api/episodes", wrap((req) => withExtras(createEpisode(req.body))));
app.patch("/api/episodes/:id", wrap((req) => {
  const allowed = ["title", "caption", "tags", "platforms", "at", "status", "composition"];
  const patch = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const before = loadEpisodes().find((e) => e.id === req.params.id);
  if (!before) throw new Error("Episode not found");
  if (patch.composition && patch.composition !== before.composition) {
    const f = path.resolve(ROOT, before.file);
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
  if (patch.status === "scheduled" && !(patch.at || before.at)) throw new Error("Pick a date and time before scheduling");
  if (patch.status === "scheduled") patch.error = null;
  return withExtras(update(req.params.id, patch));
}));
app.delete("/api/episodes/:id", wrap((req) => {
  deleteEpisode(req.params.id);
  return {ok: true};
}));
app.post("/api/episodes/:id/render", wrap((req) => {
  const ep = loadEpisodes().find((e) => e.id === req.params.id);
  if (!ep) throw new Error("Episode not found");
  const f = path.resolve(ROOT, ep.file);
  if (fs.existsSync(f)) fs.unlinkSync(f);
  return runJob(ep.id, "render", (cb) => postEpisode(ep.id, {...cb, dryRun: true}));
}));
app.post("/api/episodes/:id/post", wrap((req) => {
  const ep = loadEpisodes().find((e) => e.id === req.params.id);
  if (!ep) throw new Error("Episode not found");
  if (!ep.platforms?.length) throw new Error("Pick at least one platform");
  return runJob(ep.id, "post", (cb) => postEpisode(ep.id, cb));
}));

app.get("/api/logs", wrap(() => {
  const f = path.join(OUT, "frameo.log");
  return {lines: fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split("\n").slice(-200) : []};
}));

app.patch("/api/settings", wrap((req) => {
  const s = saveSettings(req.body);
  if (req.body.scheduler) s.scheduler.enabled ? scheduler.start() : scheduler.stop();
  return s;
}));

// ---------- connections ----------
app.post("/api/connections/storage", wrap((req) => {
  const map = {accountId: "R2_ACCOUNT_ID", accessKeyId: "R2_ACCESS_KEY_ID", secretAccessKey: "R2_SECRET_ACCESS_KEY", bucket: "R2_BUCKET", publicUrl: "R2_PUBLIC_URL"};
  for (const [k, envName] of Object.entries(map)) if (req.body[k]) setEnvValue(envName, String(req.body[k]).trim());
  return {ok: true};
}));
app.post("/api/connections/storage/test", wrap(async () => ({url: await testStorage()})));

app.post("/api/connections/instagram", wrap(async (req) => {
  if (!req.body.token) throw new Error("Paste the access token first");
  setEnvValue("IG_ACCESS_TOKEN", String(req.body.token).trim());
  const me = await whoami();
  setEnvValue("IG_USER_ID", String(me.user_id));
  log(`Instagram connected as @${me.username}`);
  return me;
}));
app.post("/api/connections/instagram/check", wrap(() => whoami()));
app.post("/api/connections/instagram/refresh", wrap(async () => ({days: await refreshToken()})));

app.post("/api/connections/youtube", wrap((req) => {
  if (req.body.clientId) setEnvValue("YT_CLIENT_ID", String(req.body.clientId).trim());
  if (req.body.clientSecret) setEnvValue("YT_CLIENT_SECRET", String(req.body.clientSecret).trim());
  if (req.body.privacy) setEnvValue("YT_PRIVACY", req.body.privacy);
  return {ok: true};
}));
const ytRedirect = `http://${HOST}:${PORT}/oauth/youtube`;
app.get("/api/connections/youtube/auth-url", wrap((req) => ({
  url: oauthClient(ytRedirect).generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/youtube.upload"],
    state: String(req.query.back || "/"),
  }),
})));
app.get("/oauth/youtube", async (req, res) => {
  const back = String(req.query.state || "/");
  try {
    const {tokens} = await oauthClient(ytRedirect).getToken(String(req.query.code));
    fs.mkdirSync(path.dirname(TOKEN_FILE), {recursive: true});
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    log("YouTube connected.");
    res.redirect(`${back}${back.includes("?") ? "&" : "?"}youtube=connected`);
  } catch (e) {
    res.redirect(`${back}${back.includes("?") ? "&" : "?"}youtube=error&message=${encodeURIComponent(e.message)}`);
  }
});
app.delete("/api/connections/youtube", wrap(() => {
  if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
  return {ok: true};
}));

// ---------- files + dashboard ----------
app.use("/videos", express.static(OUT));
if (fs.existsSync(WEB)) {
  app.use(express.static(WEB));
  app.get(/^\/(?!api|videos|oauth).*/, (_req, res) => res.sendFile(path.join(WEB, "index.html")));
} else {
  app.get("/", (_req, res) => res.send("Dashboard not built yet. Run: npm run build:web (or npm run dev for development)."));
}

// reset episodes stuck mid-post from a previous crash
saveEpisodes(loadEpisodes().map((e) => (e.status === "posting" ? {...e, status: "failed", error: "Interrupted (app was closed while posting)"} : e)));

app.listen(PORT, HOST, () => log(`Frameo dashboard running at http://127.0.0.1:${PORT}`));
