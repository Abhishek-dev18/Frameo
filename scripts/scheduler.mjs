// Command-line scheduler: keeps running and posts every episode when its time comes.
// (The dashboard runs the same scheduler; use one or the other, not both.)
import {createScheduler} from "./lib/scheduler.mjs";
import {loadEpisodes} from "./lib/episodes.mjs";

const upcoming = loadEpisodes().filter((e) => e.status === "scheduled").sort((a, b) => new Date(a.at) - new Date(b.at));
console.log(`${upcoming.length} episode(s) queued:`);
for (const e of upcoming) console.log(`   ${new Date(e.at).toLocaleString("en-IN")}  ${e.id}  ${e.title}  → ${e.platforms.join(" + ")}`);
createScheduler().start();
