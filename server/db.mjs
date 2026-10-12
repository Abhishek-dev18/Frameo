// A small JSON-file database for running PixelScript on one computer.
// Everything lives in content/db.json. Swap for Postgres before going public (see ROADMAP.md).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {ROOT} from "../scripts/lib/env.mjs";

const FILE = path.join(ROOT, "content", "db.json");
const EMPTY = {users: [], sessions: [], pipelines: [], episodes: [], notifications: [], events: []};

let data = null;
function load() {
  if (data) return data;
  data = fs.existsSync(FILE) ? {...EMPTY, ...JSON.parse(fs.readFileSync(FILE, "utf8"))} : structuredClone(EMPTY);
  return data;
}
let timer = null;
function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const tmp = FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, FILE);
  }, 50);
}

export const id = (prefix) => `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
export const now = () => new Date().toISOString();

export const db = {
  get: () => load(),
  all: (table, filter = () => true) => load()[table].filter(filter),
  find: (table, filter) => load()[table].find(filter),
  insert(table, row) {
    load()[table].push(row);
    save();
    return row;
  },
  update(table, rowId, patch) {
    const row = load()[table].find((r) => r.id === rowId);
    if (!row) return null;
    Object.assign(row, typeof patch === "function" ? patch(row) : patch, {updatedAt: now()});
    save();
    return row;
  },
  remove(table, filter) {
    const d = load();
    d[table] = d[table].filter((r) => !filter(r));
    save();
  },
  flush() {
    clearTimeout(timer);
    if (data) fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  },
};

// Activity events shown on the Activity page (per user) and written to out/pixelscript.log.
export function event(userId, text, tone = "info") {
  const row = {id: id("ev"), userId, at: now(), text, tone};
  const d = load();
  d.events.push(row);
  if (d.events.length > 2000) d.events.splice(0, d.events.length - 2000);
  save();
  return row;
}
