import fs from "node:fs";
import path from "node:path";
import {ROOT} from "./env.mjs";

const FILE = path.join(ROOT, "content", "settings.json");

export const loadSettings = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
export function saveSettings(patch) {
  const s = loadSettings();
  const next = {...s, ...patch, channel: {...s.channel, ...(patch.channel || {})}, scheduler: {...s.scheduler, ...(patch.scheduler || {})}};
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2) + "\n");
  return next;
}
