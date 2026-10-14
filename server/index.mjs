// PixelScript server. Runs on your computer only (127.0.0.1).
// Serves the website, the API, and runs the engine that writes, renders and posts episodes.
import fs from "node:fs";
import path from "node:path";
import express from "express";
import {ROOT, setEnvValue, log} from "../scripts/lib/env.mjs";
import {db, id, now, event} from "./db.mjs";
import {signup, login, logout, forgot, reset, currentUser, requireUser, requireAdmin, publicUser} from "./auth.mjs";
import {TEMPLATES, PLANS, LANGUAGES, VOICE_READY, getTemplate, costOf, planOf} from "./templates.mjs";
import {startEngine, kick, nextSlots, renderProgress, notify} from "./engine.mjs";
import {whoami, refreshToken} from "../scripts/lib/instagram.mjs";
import {oauthClient, TOKEN_FILE} from "../scripts/lib/youtube.mjs";
import {testStorage} from "../scripts/lib/storage.mjs";

const PORT = Number(process.env.PORT || 5174);
const HOST = "127.0.0.1";
const OUT = path.join(ROOT, "out");
const WEB = path.join(ROOT, "dist-web");
const app = express();
app.use(express.json({limit: "1mb"}));

const wrap = (fn) => async (req, res) => {
  try {
    res.json(await fn(req, res));
  } catch (e) {
    res.status(e.status || 400).json({error: e.message || String(e)});
  }
};
const notFound = (what) => Object.assign(new Error(`${what} not found`), {status: 404});
const has = (k) => Boolean(process.env[k]);
const mine = (table, req) => {
  const row = db.find(table, (r) => r.id === req.params.id);
  if (!row || (row.userId !== req.user.id && req.user.role !== "admin")) throw notFound(table === "pipelines" ? "Pipeline" : "Episode");
  return row;
};

// ---------- shaping rows for the website ----------
function connections() {
  return {
    storage: {configured: ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "R2_PUBLIC_URL"].every(has), bucket: process.env.R2_BUCKET || "", publicUrl: process.env.R2_PUBLIC_URL || ""},
    instagram: {configured: has("IG_ACCESS_TOKEN") && has("IG_USER_ID"), userId: process.env.IG_USER_ID || ""},
    youtube: {configured: has("YT_CLIENT_ID") && has("YT_CLIENT_SECRET"), connected: fs.existsSync(TOKEN_FILE), privacy: process.env.YT_PRIVACY || "private"},
    writer: {configured: has("GEMINI_API_KEY")},
    telegram: {configured: has("TELEGRAM_BOT_TOKEN")},
  };
}
function shapeEpisode(ep) {
  const file = ep.file ? path.resolve(ROOT, ep.file) : null;
  const rendered = Boolean(file && fs.existsSync(file));
  const p = ep.single ? null : db.find("pipelines", (x) => x.id === ep.pipelineId);
  return {
    ...ep,
    pipelineName: ep.single ? "Single video" : p?.name || "",
    template: ep.single ? ep.spec?.template : p?.template,
    reviewMode: ep.single ? "review" : p?.reviewMode,
    cost: ep.single ? costOf(ep.spec?.template, ep.spec?.length, ep.spec?.voice) : p ? costOf(p.template, p.length, p.voice) : null,
    videoUrl: rendered ? `/videos/${path.relative(OUT, file).split(path.sep).map(encodeURIComponent).join("/")}?v=${Math.round(fs.statSync(file).mtimeMs)}` : null,
    progress: renderProgress(ep.id),
  };
}
function shapePipeline(p) {
  const eps = db.all("episodes", (e) => e.pipelineId === p.id);
  return {
    ...p,
    counts: {
      review: eps.filter((e) => ["script_review", "video_review"].includes(e.stage)).length,
      upcoming: eps.filter((e) => !["posted", "failed", "skipped"].includes(e.stage)).length,
      posted: eps.filter((e) => e.stage === "posted").length,
      failed: eps.filter((e) => e.stage === "failed").length,
    },
    topicsLeft: p.topics.filter((t) => !t.used).length,
    nextSlots: p.status === "active" ? nextSlots(p.schedule, 3).map((d) => d.toISOString()) : [],
    costPerEpisode: costOf(p.template, p.length, p.voice),
  };
}

// ---------- auth ----------
app.post("/api/auth/signup", wrap(signup));
app.post("/api/auth/login", wrap(login));
app.post("/api/auth/logout", wrap(logout));
app.post("/api/auth/forgot", wrap(forgot));
app.post("/api/auth/reset", wrap(reset));
app.get("/api/auth/me", wrap((req) => ({user: publicUser(currentUser(req))})));

// ---------- account ----------
app.patch("/api/me", requireUser, wrap((req) => {
  const b = req.body;
  const patch = {};
  if (b.name !== undefined) patch.name = String(b.name).trim();
  if (b.profile) patch.profile = {...req.user.profile, ...b.profile};
  if (b.notify) patch.notify = {...req.user.notify, ...b.notify};
  if (b.onboarded !== undefined) patch.onboarded = Boolean(b.onboarded);
  return publicUser(db.update("users", req.user.id, patch));
}));
app.delete("/api/me", requireUser, wrap((req) => {
  if (req.user.role === "admin" && db.all("users", (u) => u.role === "admin").length === 1) throw new Error("You're the only admin, so this account can't be deleted here.");
  const uid = req.user.id;
  for (const t of ["pipelines", "episodes", "notifications", "events", "sessions"]) db.remove(t, (r) => r.userId === uid);
  db.remove("users", (u) => u.id === uid);
  fs.rmSync(path.join(OUT, uid), {recursive: true, force: true});
  return {ok: true};
}));

app.get("/api/state", requireUser, wrap((req) => ({
  user: publicUser(req.user),
  plan: {...planOf(req.user), id: req.user.plan || "free", pipelines: Number.isFinite(planOf(req.user).pipelines) ? planOf(req.user).pipelines : 999},
  templates: TEMPLATES,
  languages: LANGUAGES,
  voiceReady: VOICE_READY,
  connections: connections(),
  unread: db.all("notifications", (n) => n.userId === req.user.id && !n.read).length,
})));

// ---------- pipelines ----------
function cleanPipeline(b, existing = {}) {
  const t = getTemplate(b.template ?? existing.template);
  if (!t) throw new Error("Pick a video style.");
  const name = String(b.name ?? existing.name ?? "").trim() || t.series;
  const schedule = b.schedule ?? existing.schedule;
  if (!schedule?.days?.length) throw new Error("Pick at least one day to post.");
  if (!/^\d{2}:\d{2}$/.test(schedule.time || "")) throw new Error("Pick a posting time.");
  const channels = (b.channels ?? existing.channels ?? []).filter((c) => ["instagram", "youtube"].includes(c));
  if (!channels.length) throw new Error("Pick at least one place to post.");
  return {
    name,
    template: t.id,
    custom: {...(existing.custom || {}), ...(b.custom || {})},
    language: LANGUAGES.includes(b.language ?? existing.language) ? (b.language ?? existing.language) : "English",
    voice: VOICE_READY && Boolean(b.voice ?? existing.voice),
    length: Number(b.length ?? existing.length ?? 30) >= 60 ? 60 : 30,
    schedule: {days: [...new Set(schedule.days.map(Number))].sort(), time: schedule.time, startDate: schedule.startDate || new Date().toISOString().slice(0, 10)},
    reviewMode: (b.reviewMode ?? existing.reviewMode) === "auto" ? "auto" : "review",
    missedPolicy: ["skip", "next", "post"].includes(b.missedPolicy ?? existing.missedPolicy) ? (b.missedPolicy ?? existing.missedPolicy) : "next",
    channels,
  };
}
const toTopics = (list) =>
  (Array.isArray(list) ? list : String(list || "").split("\n"))
    .map((t) => String(t).trim())
    .filter(Boolean)
    .map((text) => ({id: id("tp"), text, used: false}));

app.get("/api/pipelines", requireUser, wrap((req) => db.all("pipelines", (p) => p.userId === req.user.id).map(shapePipeline)));
// Pipelines (scheduled auto-posting) start on Starter; each plan has a pipeline limit.
function canAddPipeline(user, extra = 1) {
  const plan = planOf(user);
  if (!plan.pipelines) throw Object.assign(new Error("Pipelines start on the Starter plan. On Free you can make single videos and upload them yourself."), {status: 403});
  const active = db.all("pipelines", (p) => p.userId === user.id && p.status === "active").length;
  if (active + extra > plan.pipelines) throw Object.assign(new Error(`Your ${plan.name} plan allows ${plan.pipelines} live pipeline${plan.pipelines === 1 ? "" : "s"}. Pause one or upgrade.`), {status: 403});
}

app.post("/api/pipelines", requireUser, wrap((req) => {
  canAddPipeline(req.user);
  const topics = toTopics(req.body.topics);
  if (!topics.length) throw new Error("Add at least one topic.");
  const p = db.insert("pipelines", {id: id("pl"), userId: req.user.id, ...cleanPipeline(req.body), topics, status: "active", createdAt: now()});
  event(req.user.id, `Pipeline "${p.name}" created with ${topics.length} topics.`, "good");
  kick();
  return shapePipeline(p);
}));
app.get("/api/pipelines/:id", requireUser, wrap((req) => shapePipeline(mine("pipelines", req))));
app.patch("/api/pipelines/:id", requireUser, wrap((req) => {
  const p = mine("pipelines", req);
  const patch = req.body.status ? {status: req.body.status === "paused" ? "paused" : "active"} : cleanPipeline(req.body, p);
  if (patch.status === "active" && p.status !== "active") canAddPipeline(req.user);
  const out = db.update("pipelines", p.id, patch);
  if (req.body.status) event(req.user.id, `Pipeline "${p.name}" ${out.status === "paused" ? "paused" : "resumed"}.`);
  kick();
  return shapePipeline(out);
}));
app.post("/api/pipelines/:id/topics", requireUser, wrap((req) => {
  const p = mine("pipelines", req);
  const added = toTopics(req.body.topics);
  if (!added.length) throw new Error("Type at least one topic.");
  const out = db.update("pipelines", p.id, {topics: [...p.topics, ...added], outOfTopicsAt: null});
  kick();
  return shapePipeline(out);
}));
app.delete("/api/pipelines/:id/topics/:topicId", requireUser, wrap((req) => {
  const p = mine("pipelines", req);
  return shapePipeline(db.update("pipelines", p.id, {topics: p.topics.filter((t) => t.id !== req.params.topicId || t.used)}));
}));
app.delete("/api/pipelines/:id", requireUser, wrap((req) => {
  const p = mine("pipelines", req);
  db.remove("episodes", (e) => e.pipelineId === p.id && !["posted"].includes(e.stage));
  db.remove("pipelines", (x) => x.id === p.id);
  event(req.user.id, `Pipeline "${p.name}" deleted.`);
  return {ok: true};
}));

// ---------- single videos (every plan): topic → script → video → download ----------
app.post("/api/videos", requireUser, wrap((req) => {
  const t = getTemplate(req.body.template);
  if (!t) throw new Error("Pick a video style.");
  const topic = String(req.body.topic || "").trim();
  if (!topic) throw new Error("Type what the video is about.");
  if (topic.length > 200) throw new Error("Keep the topic under 200 characters.");
  const spec = {
    template: t.id,
    length: Number(req.body.length) >= 60 ? 60 : 30,
    language: LANGUAGES.includes(req.body.language) ? req.body.language : "English",
    voice: VOICE_READY && Boolean(req.body.voice),
    custom: {seriesName: String(req.body.seriesName || "").trim().slice(0, 40) || t.series},
  };
  const cost = costOf(t.id, spec.length, spec.voice);
  if (req.user.credits < cost) throw Object.assign(new Error(`This video needs ${cost} credits and you have ${req.user.credits}.`), {status: 402});
  const open = db.all("episodes", (e) => e.userId === req.user.id && e.single && ["writing", "script_review", "render_queued", "rendering"].includes(e.stage)).length;
  if (req.user.plan === "free" && open >= 1) throw Object.assign(new Error("Finish or delete the video you're making first. Free makes one video at a time."), {status: 429});
  const n = db.all("episodes", (e) => e.userId === req.user.id && e.single).length + 1;
  const ep = db.insert("episodes", {
    id: id("ep"),
    userId: req.user.id,
    pipelineId: null,
    single: true,
    spec,
    number: n,
    topic,
    title: topic,
    at: now(),
    stage: "writing",
    script: null,
    file: null,
    results: {},
    error: null,
    creditsCharged: 0,
    createdAt: now(),
  });
  event(req.user.id, `Started a video: "${topic}".`);
  kick();
  return shapeEpisode(ep);
}));
app.get("/api/episodes/:id/download", requireUser, (req, res) => {
  try {
    const ep = mine("episodes", req);
    const file = ep.file && path.resolve(ROOT, ep.file);
    if (!file || !fs.existsSync(file)) return res.status(404).json({error: "This video hasn't been made yet."});
    const name = `${(ep.script?.title || ep.title).replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").slice(0, 60) || "pixelscript-video"}.mp4`;
    res.download(file, name);
  } catch (e) {
    res.status(e.status || 400).json({error: e.message});
  }
});
app.delete("/api/episodes/:id", requireUser, wrap((req) => {
  const ep = mine("episodes", req);
  if (!ep.single) throw new Error("Pipeline episodes can be skipped, not deleted.");
  if (ep.stage === "rendering") throw new Error("Wait for the video to finish first.");
  if (ep.file) fs.rmSync(path.resolve(ROOT, ep.file), {force: true});
  fs.rmSync(path.join(OUT, ep.userId, `${ep.id}.props.json`), {force: true});
  db.remove("episodes", (e) => e.id === ep.id);
  return {ok: true};
}));

// ---------- episodes ----------
app.get("/api/episodes", requireUser, wrap((req) => {
  const q = req.query;
  return db
    .all("episodes", (e) => e.userId === req.user.id && (!q.pipeline || e.pipelineId === q.pipeline) && (!q.stage || String(q.stage).split(",").includes(e.stage)) && (q.single === undefined || Boolean(e.single) === (q.single === "1")))
    .sort((a, b) => new Date(a.at) - new Date(b.at))
    .map(shapeEpisode);
}));
app.get("/api/episodes/:id", requireUser, wrap((req) => shapeEpisode(mine("episodes", req))));
app.patch("/api/episodes/:id", requireUser, wrap((req) => {
  const ep = mine("episodes", req);
  const patch = {};
  if (req.body.script) patch.script = {...ep.script, ...req.body.script};
  if (patch.script?.title) patch.title = patch.script.title;
  if (req.body.at) patch.at = new Date(req.body.at).toISOString();
  return shapeEpisode(db.update("episodes", ep.id, patch));
}));
const ACTIONS = {
  approveScript: (ep) => (ep.stage === "script_review" ? {stage: "render_queued"} : null),
  approveVideo: (ep) => (ep.stage === "video_review" ? {stage: "scheduled"} : null),
  rewrite: (ep) => (["script_review", "failed", "video_review"].includes(ep.stage) ? {stage: "writing", error: null} : null),
  remake: (ep) => (["video_review", "failed", "scheduled", "ready"].includes(ep.stage) && ep.script ? {stage: "render_queued", error: null} : null),
  skip: (ep) => (!ep.single && !["posted", "posting", "rendering"].includes(ep.stage) ? {stage: "skipped"} : null),
  postNow: (ep) => (!ep.single && ["video_review", "scheduled"].includes(ep.stage) ? {stage: "scheduled", at: now()} : null),
  retry: (ep) => (ep.stage === "failed" ? {stage: ep.file ? (ep.single ? "ready" : "scheduled") : ep.script ? "render_queued" : "writing", error: null} : null),
};
app.post("/api/episodes/:id/:action", requireUser, wrap((req) => {
  const ep = mine("episodes", req);
  const fn = ACTIONS[req.params.action];
  if (!fn) throw notFound("Action");
  const patch = fn(ep);
  if (!patch) throw new Error("That can't be done at this stage.");
  if (req.params.action === "retry" && patch.stage === "scheduled" && new Date(ep.at) < new Date()) patch.at = now();
  const out = db.update("episodes", ep.id, patch);
  kick();
  return shapeEpisode(out);
}));

// ---------- notifications + activity ----------
app.get("/api/notifications", requireUser, wrap((req) => db.all("notifications", (n) => n.userId === req.user.id).slice(-50).reverse()));
app.post("/api/notifications/read", requireUser, wrap((req) => {
  for (const n of db.all("notifications", (x) => x.userId === req.user.id && !x.read)) db.update("notifications", n.id, {read: true});
  return {ok: true};
}));
app.get("/api/activity", requireUser, wrap((req) => db.all("events", (e) => e.userId === req.user.id).slice(-300)));
app.post("/api/notifications/test", requireUser, wrap(async (req) => {
  await notify(req.user.id, "Test notification. If you see this on Telegram, alerts are working.", {tone: "good"});
  return {ok: true};
}));

// ---------- admin ----------
app.get("/api/admin/overview", requireAdmin, wrap(() => {
  const eps = db.all("episodes");
  const users = db.all("users").map((u) => ({
    ...publicUser(u),
    pipelines: db.all("pipelines", (p) => p.userId === u.id).length,
    videos: eps.filter((e) => e.userId === u.id && e.single).length,
    posted: eps.filter((e) => e.userId === u.id && e.stage === "posted").length,
    failed: eps.filter((e) => e.userId === u.id && e.stage === "failed").length,
  }));
  return {
    totals: {
      users: users.length,
      pipelines: db.all("pipelines").length,
      live: db.all("pipelines", (p) => p.status === "active").length,
      posted: eps.filter((e) => e.stage === "posted").length,
      inProgress: eps.filter((e) => ["writing", "render_queued", "rendering", "posting"].includes(e.stage)).length,
      failed: eps.filter((e) => e.stage === "failed").length,
      creditsUsed: eps.reduce((s, e) => s + (e.creditsCharged || 0), 0),
    },
    users,
    failures: eps.filter((e) => e.stage === "failed").slice(-20).reverse().map(shapeEpisode),
    connections: connections(),
  };
}));
app.post("/api/admin/users/:id/credits", requireAdmin, wrap((req) => {
  const n = Number(req.body.add || 0);
  const u = db.update("users", req.params.id, (x) => ({credits: Math.max(0, x.credits + n)}));
  if (!u) throw notFound("User");
  event(u.id, `${n > 0 ? "Added" : "Removed"} ${Math.abs(n)} credits.`, "good");
  return publicUser(u);
}));
app.post("/api/admin/users/:id/plan", requireAdmin, wrap((req) => {
  const plan = String(req.body.plan || "");
  if (!PLANS[plan]) throw new Error("Unknown plan.");
  const u = db.update("users", req.params.id, {plan});
  if (!u) throw notFound("User");
  event(u.id, `Plan changed to ${PLANS[plan].name}.`, "good");
  return publicUser(u);
}));
app.get("/api/admin/log", requireAdmin, wrap(() => {
  const f = path.join(OUT, "pixelscript.log");
  return {lines: fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim().split("\n").slice(-300) : []};
}));

// ---------- connections (one set for this install; admin only until one-click connect exists) ----------
app.post("/api/connections/storage", requireAdmin, wrap((req) => {
  const map = {accountId: "R2_ACCOUNT_ID", accessKeyId: "R2_ACCESS_KEY_ID", secretAccessKey: "R2_SECRET_ACCESS_KEY", bucket: "R2_BUCKET", publicUrl: "R2_PUBLIC_URL"};
  for (const [k, envName] of Object.entries(map)) if (req.body[k]) setEnvValue(envName, String(req.body[k]).trim());
  return {ok: true};
}));
app.post("/api/connections/storage/test", requireAdmin, wrap(async () => ({url: await testStorage()})));
app.post("/api/connections/instagram", requireAdmin, wrap(async (req) => {
  if (!req.body.token) throw new Error("Paste the access token first.");
  setEnvValue("IG_ACCESS_TOKEN", String(req.body.token).trim());
  const me = await whoami();
  setEnvValue("IG_USER_ID", String(me.user_id));
  log(`Instagram connected as @${me.username}`);
  return me;
}));
app.post("/api/connections/instagram/check", requireAdmin, wrap(() => whoami()));
app.post("/api/connections/instagram/refresh", requireAdmin, wrap(async () => ({days: await refreshToken()})));
app.post("/api/connections/youtube", requireAdmin, wrap((req) => {
  if (req.body.clientId) setEnvValue("YT_CLIENT_ID", String(req.body.clientId).trim());
  if (req.body.clientSecret) setEnvValue("YT_CLIENT_SECRET", String(req.body.clientSecret).trim());
  if (req.body.privacy) setEnvValue("YT_PRIVACY", req.body.privacy);
  return {ok: true};
}));
app.post("/api/connections/keys", requireAdmin, wrap((req) => {
  if (req.body.gemini) setEnvValue("GEMINI_API_KEY", String(req.body.gemini).trim());
  if (req.body.telegram) setEnvValue("TELEGRAM_BOT_TOKEN", String(req.body.telegram).trim());
  return {ok: true};
}));
const ytRedirect = `http://${HOST}:${PORT}/oauth/youtube`;
app.get("/api/connections/youtube/auth-url", requireAdmin, wrap((req) => ({
  url: oauthClient(ytRedirect).generateAuthUrl({access_type: "offline", prompt: "consent", scope: ["https://www.googleapis.com/auth/youtube.upload"], state: String(req.query.back || "/")}),
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
app.delete("/api/connections/youtube", requireAdmin, wrap(() => {
  if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
  return {ok: true};
}));

// ---------- files + website ----------
app.use("/videos", express.static(OUT, {index: false, extensions: false, setHeaders: (res) => res.setHeader("Cache-Control", "private, max-age=3600")}));
if (fs.existsSync(WEB)) {
  app.use(express.static(WEB));
  app.get(/^\/(?!api|videos|oauth).*/, (_req, res) => res.sendFile(path.join(WEB, "index.html")));
} else {
  app.get("/", (_req, res) => res.send("Website not built yet. Run: npm run build:web (or npm run dev while developing)."));
}

process.on("SIGINT", () => {
  db.flush();
  process.exit(0);
});
startEngine();
app.listen(PORT, HOST, () => log(`PixelScript running at http://${HOST}:${PORT}`));
