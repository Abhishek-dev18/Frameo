// Renders a Remotion composition to MP4 using the Remotion CLI.
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {ROOT, log} from "./env.mjs";

export function render(composition, outFile) {
  const out = path.resolve(ROOT, outFile);
  fs.mkdirSync(path.dirname(out), {recursive: true});
  log(`Rendering ${composition} -> ${path.relative(ROOT, out)}`);
  const isWin = process.platform === "win32";
  const args = ["remotion", "render", "src/index.ts", composition, out];
  if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
  return new Promise((resolve, reject) => {
    const p = spawn(isWin ? "npx.cmd" : "npx", args, {cwd: ROOT, stdio: "inherit", shell: isWin});
    p.on("exit", (code) => (code === 0 ? resolve(out) : reject(new Error(`Render failed (exit ${code})`))));
  });
}
