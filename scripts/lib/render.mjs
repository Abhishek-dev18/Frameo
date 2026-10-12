// Renders a Remotion composition to MP4 using the Remotion CLI.
// onProgress(0..1) is called as frames render.
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {ROOT, log} from "./env.mjs";

export function render(composition, outFile, onProgress = () => {}, propsFile = null) {
  const out = path.resolve(ROOT, outFile);
  fs.mkdirSync(path.dirname(out), {recursive: true});
  log(`Rendering ${composition} -> ${path.relative(ROOT, out)}`);
  const isWin = process.platform === "win32";
  const args = ["remotion", "render", "src/index.ts", composition, out, "--log=info"];
  if (propsFile) args.push(`--props=${propsFile}`);
  if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`);
  return new Promise((resolve, reject) => {
    const p = spawn(isWin ? "npx.cmd" : "npx", args, {cwd: ROOT, shell: isWin});
    let tail = "";
    const onData = (buf) => {
      const text = buf.toString();
      process.stdout.write(text);
      tail = (tail + text).slice(-2000);
      const m = [...text.matchAll(/Rendered (\d+)\/(\d+)/g)].pop();
      if (m) onProgress(Number(m[1]) / Number(m[2]));
    };
    p.stdout.on("data", onData);
    p.stderr.on("data", onData);
    p.on("exit", (code) => {
      if (code === 0) {
        onProgress(1);
        resolve(out);
      } else {
        reject(new Error(`Render failed (exit ${code}). ${tail.split("\n").filter(Boolean).slice(-3).join(" ")}`));
      }
    });
  });
}
