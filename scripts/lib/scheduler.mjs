// The posting loop, shared by the CLI (npm run scheduler) and the dashboard server.
import fs from "node:fs";
import path from "node:path";
import cron from "node-cron";
import {loadEpisodes, postEpisode} from "./episodes.mjs";
import {render} from "./render.mjs";
import {refreshToken} from "./instagram.mjs";
import {log, ROOT} from "./env.mjs";

export function createScheduler({run = (id) => postEpisode(id)} = {}) {
  let busy = false;
  const tasks = [];

  async function tick() {
    if (busy) return;
    busy = true;
    try {
      const due = loadEpisodes().filter((e) => e.status === "scheduled" && e.at && new Date(e.at) <= new Date());
      for (const ep of due) {
        log(`⏰ ${ep.id} is due (${ep.at}). Starting…`);
        await run(ep.id).catch(() => {});
      }
    } finally {
      busy = false;
    }
  }

  // Render queued episodes up to 30 minutes early so posting on time is quick.
  async function prerender() {
    const soon = loadEpisodes().filter((e) => e.status === "scheduled" && e.at && new Date(e.at) - Date.now() < 30 * 60 * 1000);
    for (const e of soon) {
      if (!fs.existsSync(path.resolve(ROOT, e.file))) await render(e.composition, e.file).catch((err) => log(`Render failed for ${e.id}: ${err.message}`));
    }
  }

  async function weeklyRefresh() {
    if (!process.env.IG_ACCESS_TOKEN) return;
    try {
      log(`Instagram token refreshed (${await refreshToken()} days).`);
    } catch (e) {
      log(`Instagram token refresh failed: ${e.message}`);
    }
  }

  return {
    start() {
      if (tasks.length) return;
      tasks.push(cron.schedule("* * * * *", tick), cron.schedule("*/10 * * * *", prerender), cron.schedule("0 3 * * 0", weeklyRefresh));
      log("Scheduler started.");
      tick();
    },
    stop() {
      tasks.splice(0).forEach((t) => t.stop());
      log("Scheduler paused.");
    },
    get running() {
      return tasks.length > 0;
    },
  };
}
