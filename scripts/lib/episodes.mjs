// The episode list lives in content/episodes.json. Each episode knows which
// video to render, its caption/title, which platforms, when to post, and its status.
import fs from "node:fs";
import path from "node:path";
import {ROOT, log} from "./env.mjs";
import {render} from "./render.mjs";
import {uploadVideo} from "./storage.mjs";
import {publishReel} from "./instagram.mjs";
import {uploadShort} from "./youtube.mjs";

const FILE = path.join(ROOT, "content", "episodes.json");

export const loadEpisodes = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
export const saveEpisodes = (eps) => fs.writeFileSync(FILE, JSON.stringify(eps, null, 2) + "\n");

function update(id, patch) {
  const eps = loadEpisodes();
  const ep = eps.find((e) => e.id === id);
  Object.assign(ep, patch);
  saveEpisodes(eps);
  return ep;
}

// Renders (if needed) and posts one episode. With dryRun it stops after rendering.
export async function postEpisode(id, {dryRun = false} = {}) {
  let ep = loadEpisodes().find((e) => e.id === id);
  if (!ep) throw new Error(`No episode "${id}" in content/episodes.json`);
  const file = path.resolve(ROOT, ep.file);
  if (!fs.existsSync(file) || process.env.FORCE_RENDER === "1") await render(ep.composition, ep.file);
  if (dryRun) {
    log(`Dry run: ${ep.id} rendered at ${ep.file}. Nothing posted.`);
    return ep;
  }
  const results = {...(ep.results || {})};
  update(id, {status: "posting"});
  try {
    if (ep.platforms.includes("instagram") && !results.instagram) {
      log(`Uploading ${ep.file} to storage…`);
      const videoUrl = await uploadVideo(file);
      log(`Publishing to Instagram…`);
      results.instagram = await publishReel({videoUrl, caption: ep.caption});
      log(`Instagram ✓ ${results.instagram.url || results.instagram.id}`);
      update(id, {results});
    }
    if (ep.platforms.includes("youtube") && !results.youtube) {
      log(`Uploading to YouTube…`);
      const description = `${ep.caption}\n\n#Shorts`;
      results.youtube = await uploadShort({file, title: ep.title, description, tags: ep.tags || []});
      log(`YouTube ✓ ${results.youtube.url}`);
      update(id, {results});
    }
    ep = update(id, {status: "posted", postedAt: new Date().toISOString(), results, error: null});
  } catch (err) {
    update(id, {status: "failed", error: String(err.message || err), results});
    log(`✗ ${id} failed: ${err.message || err}`);
    throw err;
  }
  return ep;
}
