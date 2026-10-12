// The engine: every minute it plans upcoming episodes for each live pipeline and moves
// each episode through its stages:
//   writing → script_review → render_queued → rendering → video_review → scheduled → posting → posted
// (review stages are skipped when a pipeline is fully automatic; failed / skipped are end states).
import fs from "node:fs";
import path from "node:path";
import cron from "node-cron";
import {db, id, now, event} from "./db.mjs";
import {getTemplate, costOf} from "./templates.mjs";
import {writeScript} from "./writer.mjs";
import {ROOT, log} from "../scripts/lib/env.mjs";
import {render} from "../scripts/lib/render.mjs";
import {uploadVideo} from "../scripts/lib/storage.mjs";
import {publishReel, refreshToken} from "../scripts/lib/instagram.mjs";
import {uploadShort} from "../scripts/lib/youtube.mjs";

export const STAGES = ["writing", "script_review", "render_queued", "rendering", "video_review", "scheduled", "posting", "posted", "failed", "skipped"];
const PLAN_AHEAD = 3; // episodes prepared ahead per pipeline
const progress = new Map(); // episodeId -> 0..1 while rendering

export const renderProgress = (epId) => progress.get(epId) ?? null;

// ---------- schedule maths ----------
// schedule = {days: [1..7] (Mon=1), time: "21:00", startDate: "YYYY-MM-DD"}
export function nextSlots(schedule, count, after = new Date()) {
  const out = [];
  if (!schedule?.days?.length || !schedule.time) return out;
  const [hh, mm] = schedule.time.split(":").map(Number);
  const start = schedule.startDate ? new Date(`${schedule.startDate}T00:00:00`) : new Date();
  const d = new Date(Math.max(start.getTime(), new Date().setHours(0, 0, 0, 0)));
  for (let i = 0; i < 400 && out.length < count; i++) {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i, hh, mm, 0, 0);
    const wd = ((day.getDay() + 6) % 7) + 1;
    if (schedule.days.includes(wd) && day > after) out.push(day);
  }
  return out;
}

// ---------- notifications ----------
export async function notify(userId, text, {tone = "info", link = null} = {}) {
  db.insert("notifications", {id: id("ntf"), userId, at: now(), text, tone, link, read: false});
  event(userId, text, tone);
  const user = db.find("users", (u) => u.id === userId);
  const chat = user?.notify?.telegramChatId;
  const bot = process.env.TELEGRAM_BOT_TOKEN;
  if (chat && bot) {
    fetch(`https://api.telegram.org/bot${bot}/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({chat_id: chat, text: `Frameo: ${text}`}),
    }).catch((e) => log(`Telegram send failed: ${e.message}`));
  }
}

// ---------- planning ----------
function planUpcoming() {
  for (const p of db.all("pipelines", (x) => x.status === "active")) {
    const pending = db.all("episodes", (e) => e.pipelineId === p.id && !["posted", "failed", "skipped"].includes(e.stage));
    if (pending.length >= PLAN_AHEAD) continue;
    const taken = new Set(pending.map((e) => new Date(e.at).getTime()));
    const slots = nextSlots(p.schedule, PLAN_AHEAD + pending.length).filter((s) => !taken.has(s.getTime()));
    for (const slot of slots.slice(0, PLAN_AHEAD - pending.length)) {
      const topic = p.topics.find((t) => !t.used);
      if (!topic) {
        if (!p.outOfTopicsAt) {
          db.update("pipelines", p.id, {outOfTopicsAt: now()});
          notify(p.userId, `"${p.name}" has run out of topics. Add more to keep it posting.`, {tone: "warn", link: `#/pipelines/${p.id}`});
        }
        break;
      }
      topic.used = true;
      db.update("pipelines", p.id, {topics: p.topics, outOfTopicsAt: null});
      const n = db.all("episodes", (e) => e.pipelineId === p.id).length + 1;
      db.insert("episodes", {
        id: id("ep"),
        userId: p.userId,
        pipelineId: p.id,
        number: n,
        topic: topic.text,
        title: topic.text,
        at: slot.toISOString(),
        stage: "writing",
        script: null,
        file: null,
        results: {},
        error: null,
        creditsCharged: 0,
        createdAt: now(),
      });
    }
  }
}

// ---------- stage workers ----------
async function doWriting(ep) {
  const p = db.find("pipelines", (x) => x.id === ep.pipelineId);
  const user = db.find("users", (u) => u.id === ep.userId);
  try {
    const script = await writeScript(ep.topic, p, user);
    const review = p.reviewMode === "review";
    db.update("episodes", ep.id, {script, title: script.title, stage: review ? "script_review" : "render_queued", error: null});
    if (review) notify(ep.userId, `Script ready to review: "${script.title}"`, {link: `#/review/${ep.id}`});
  } catch (e) {
    fail(ep, e.message, false);
  }
}

async function doRender(ep) {
  const p = db.find("pipelines", (x) => x.id === ep.pipelineId);
  const user = db.find("users", (u) => u.id === ep.userId);
  const t = getTemplate(p.template);
  const cost = costOf(p.template, p.length);
  if (user.credits < cost) {
    if (ep.error !== "credits") {
      db.update("episodes", ep.id, {error: "credits"});
      notify(ep.userId, `Not enough credits to make "${ep.title}" (needs ${cost}, you have ${user.credits}).`, {tone: "bad", link: "#/settings/plan"});
    }
    return;
  }
  db.update("users", user.id, {credits: user.credits - cost});
  db.update("episodes", ep.id, {stage: "rendering", creditsCharged: cost, error: null});
  const file = `out/${user.id}/${ep.id}.mp4`;
  const propsFile = path.join(ROOT, "out", user.id, `${ep.id}.props.json`);
  fs.mkdirSync(path.dirname(propsFile), {recursive: true});
  fs.writeFileSync(
    propsFile,
    JSON.stringify({
      channelName: user.profile?.channelName || "",
      handle: user.profile?.handle || "",
      episodeTitle: ep.script?.title || ep.title,
      episodeNumber: ep.number,
      seriesName: p.custom?.seriesName || t.series,
      lines: ep.script?.lines || [],
    }),
  );
  try {
    progress.set(ep.id, 0);
    await render(t.composition, file, (x) => progress.set(ep.id, x), propsFile);
    const review = p.reviewMode === "review";
    db.update("episodes", ep.id, {file, stage: review ? "video_review" : "scheduled"});
    if (review) notify(ep.userId, `Video ready to review: "${ep.title}"`, {link: `#/review/${ep.id}`});
  } catch (e) {
    db.update("users", user.id, (u) => ({credits: u.credits + cost}));
    db.update("episodes", ep.id, {creditsCharged: 0});
    fail(ep, `${e.message} (${cost} credits refunded)`);
  } finally {
    progress.delete(ep.id);
  }
}

async function doPost(ep) {
  const p = db.find("pipelines", (x) => x.id === ep.pipelineId);
  const results = {...(ep.results || {})};
  db.update("episodes", ep.id, {stage: "posting"});
  const file = path.resolve(ROOT, ep.file);
  const s = ep.script || {};
  try {
    if (p.channels.includes("instagram") && !results.instagram) {
      const videoUrl = await uploadVideo(file);
      results.instagram = await publishReel({videoUrl, caption: s.caption || ep.title});
      db.update("episodes", ep.id, {results});
    }
    if (p.channels.includes("youtube") && !results.youtube) {
      results.youtube = await uploadShort({file, title: s.ytTitle || ep.title, description: s.ytDescription || s.caption || "", tags: s.hashtags || []});
      db.update("episodes", ep.id, {results});
    }
    db.update("episodes", ep.id, {stage: "posted", postedAt: now(), results, error: null});
    notify(ep.userId, `Posted "${ep.title}"`, {tone: "good", link: "#/posted"});
  } catch (e) {
    db.update("episodes", ep.id, {results});
    fail(ep, e.message);
  }
}

function fail(ep, message, alert = true) {
  db.update("episodes", ep.id, {stage: "failed", error: message});
  log(`✗ ${ep.id} failed: ${message}`);
  if (alert) notify(ep.userId, `"${ep.title}" failed: ${message}`, {tone: "bad", link: `#/review/${ep.id}`});
  else event(ep.userId, `"${ep.title}" failed: ${message}`, "bad");
}

// What happens when an episode is still waiting for review at its posting time.
function handleMissed(ep) {
  const p = db.find("pipelines", (x) => x.id === ep.pipelineId);
  const policy = p?.missedPolicy || "next";
  if (policy === "skip") {
    db.update("episodes", ep.id, {stage: "skipped"});
    notify(ep.userId, `Skipped "${ep.title}" because it wasn't reviewed in time.`, {tone: "warn"});
  } else if (policy === "post") {
    db.update("episodes", ep.id, {stage: ep.stage === "script_review" ? "render_queued" : "scheduled"});
    event(ep.userId, `Posting "${ep.title}" without review (pipeline setting).`, "warn");
  } else {
    const busy = new Set(db.all("episodes", (e) => e.pipelineId === p.id && e.id !== ep.id).map((e) => new Date(e.at).getTime()));
    const slot = nextSlots(p.schedule, 20).find((s) => !busy.has(s.getTime()));
    if (slot) {
      db.update("episodes", ep.id, {at: slot.toISOString()});
      notify(ep.userId, `"${ep.title}" wasn't reviewed in time, so it moved to ${slot.toLocaleString()}.`, {tone: "warn", link: `#/review/${ep.id}`});
    }
  }
}

// ---------- loop ----------
let busy = false;
export async function tick() {
  if (busy) return;
  busy = true;
  try {
    planUpcoming();
    const live = (e) => db.find("pipelines", (p) => p.id === e.pipelineId)?.status === "active" || e.manual;
    for (const ep of db.all("episodes", (e) => e.stage === "writing" && live(e))) await doWriting(ep);
    for (const ep of db.all("episodes", (e) => ["script_review", "video_review"].includes(e.stage) && new Date(e.at) <= new Date())) handleMissed(ep);
    const toRender = db.all("episodes", (e) => e.stage === "render_queued").sort((a, b) => new Date(a.at) - new Date(b.at))[0];
    if (toRender) await doRender(toRender);
    for (const ep of db.all("episodes", (e) => e.stage === "scheduled" && new Date(e.at) <= new Date())) await doPost(ep);
  } catch (e) {
    log(`Engine error: ${e.message}`);
  } finally {
    busy = false;
  }
}

export const kick = () => setTimeout(() => tick(), 50);

export function startEngine() {
  // anything left mid-render or mid-post by a crash goes back one step
  for (const ep of db.all("episodes", (e) => e.stage === "rendering")) db.update("episodes", ep.id, {stage: "render_queued"});
  for (const ep of db.all("episodes", (e) => e.stage === "posting")) db.update("episodes", ep.id, {stage: "scheduled"});
  cron.schedule("* * * * *", tick);
  cron.schedule("0 3 * * 0", async () => {
    if (!process.env.IG_ACCESS_TOKEN) return;
    try {
      log(`Instagram token refreshed (${await refreshToken()} days).`);
    } catch (e) {
      log(`Instagram token refresh failed: ${e.message}`);
    }
  });
  kick();
}
