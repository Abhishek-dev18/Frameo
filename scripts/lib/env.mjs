// Loads .env and gives small helpers for reading and updating settings.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import dotenv from "dotenv";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const ENV_FILE = path.join(ROOT, ".env");
dotenv.config({path: ENV_FILE});

export function env(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === "") {
    throw new Error(`Missing ${name} in .env (see .env.example)`);
  }
  return v;
}

// Rewrites one KEY=value line in .env (used when a token is refreshed).
export function setEnvValue(name, value) {
  let text = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, "utf8") : "";
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  text = re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
  fs.writeFileSync(ENV_FILE, text);
  process.env[name] = value;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function log(msg) {
  const line = `[${new Date().toLocaleString("en-IN", {hour12: false})}] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.join(ROOT, "out"), {recursive: true});
  fs.appendFileSync(path.join(ROOT, "out", "pixelscript.log"), line + "\n");
}
