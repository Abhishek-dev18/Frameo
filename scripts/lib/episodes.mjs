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

export function update(id, patch) {
  const eps = loadEpisodes();
  const ep = eps.find((e) => e.id === id);
  Object.assign(ep, patch);
  saveEpisodes(eps);
  return ep;
}

// Renders (if needed) and posts one episode. With dryRun it stops after rendering.
export async function postEpisode(id, {dryRun = false, onStep = () => {}, onProgress = () => {}} = {}) {
  let ep = loadEpisodes().find((e) => e.id === id);
  if (!ep) throw new Error(`No episode "${id}" in content/episodes.json`);
  const file = path.resolve(ROOT, ep.file);
  if (!fs.existsSync(file) || process.env.FORCE_RENDER === "1") {
    onStep("Rendering video");
    await render(ep.composition, ep.file, onProgress);
  }
  if (dryRun) {
    log(`Dry run: ${ep.id} rendered at ${ep.file}. Nothing posted.`);
    return ep;
  }
  const results = {...(ep.results || {})};
  update(id, {status: "posting"});
  try {
    if (ep.platforms.includes("instagram") && !results.instagram) {
      onStep("Uploading to storage");
      log(`Uploading ${ep.file} to storage…`);
      const videoUrl = await uploadVideo(file);
      onStep("Publishing to Instagram");
      log(`Publishing to Instagram…`);
      results.instagram = await publishReel({videoUrl, caption: ep.caption});
      log(`Instagram ✓ ${results.instagram.url || results.instagram.id}`);
      update(id, {results});
    }
    if (ep.platforms.includes("youtube") && !results.youtube) {
      onStep("Uploading to YouTube");
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

export function createEpisode(data) {
  const eps = loadEpisodes();
  const n = eps.reduce((m, e) => Math.max(m, Number(String(e.id).replace(/\D/g, "")) || 0), 0) + 1;
  const id = data.id || `ep${n}`;
  if (eps.some((e) => e.id === id)) throw new Error(`Episode id "${id}" already exists`);
  const slug = String(data.title || id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  const ep = {
    id,
    composition: data.composition,
    file: data.file || `out/${id}-${slug}.mp4`,
    title: data.title || id,
    caption: data.caption || "",
    tags: data.tags || [],
    platforms: data.platforms || ["instagram", "youtube"],
    at: data.at || null,
    status: data.status || "draft",
  };
  eps.push(ep);
  saveEpisodes(eps);
  return ep;
}

export function deleteEpisode(id) {
  saveEpisodes(loadEpisodes().filter((e) => e.id !== id));
}
