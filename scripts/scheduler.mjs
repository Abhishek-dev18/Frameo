// Keeps running and posts every episode whose "at" time has passed.
// Your computer must stay on and awake while this runs.
import cron from "node-cron";
import {loadEpisodes, postEpisode} from "./lib/episodes.mjs";
import {refreshToken} from "./lib/instagram.mjs";
import {log} from "./lib/env.mjs";

let busy = false;

async function tick() {
  if (busy) return;
  busy = true;
  try {
    const due = loadEpisodes().filter((e) => e.status === "scheduled" && new Date(e.at) <= new Date());
    for (const ep of due) {
      log(`⏰ ${ep.id} is due (${ep.at}). Starting…`);
      await postEpisode(ep.id).catch(() => {});
    }
  } finally {
    busy = false;
  }
}

function showQueue() {
  const upcoming = loadEpisodes().filter((e) => e.status === "scheduled").sort((a, b) => new Date(a.at) - new Date(b.at));
  log(`Scheduler running. ${upcoming.length} episode(s) queued:`);
  for (const e of upcoming) console.log(`   ${new Date(e.at).toLocaleString("en-IN")}  ${e.id}  ${e.title}  → ${e.platforms.join(" + ")}`);
}

// Render each queued episode 30 minutes early so posting at the exact time is quick.
async function prerender() {
  const soon = loadEpisodes().filter((e) => e.status === "scheduled" && new Date(e.at) - Date.now() < 30 * 60 * 1000);
  for (const e of soon) await import("./lib/render.mjs").then(async ({render}) => {
    const fs = await import("node:fs");
    if (!fs.existsSync(e.file)) await render(e.composition, e.file).catch((err) => log(`Render failed for ${e.id}: ${err.message}`));
  });
}

cron.schedule("* * * * *", tick);
cron.schedule("*/10 * * * *", prerender);
cron.schedule("0 3 * * 0", async () => {
  if (!process.env.IG_ACCESS_TOKEN) return;
  try {
    const days = await refreshToken();
    log(`Instagram token refreshed (${days} days).`);
  } catch (e) {
    log(`Instagram token refresh failed: ${e.message}`);
  }
});

showQueue();
tick();
