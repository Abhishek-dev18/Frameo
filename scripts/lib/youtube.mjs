// YouTube Data API v3 upload. Shorts = vertical video under 3 minutes.
import fs from "node:fs";
import path from "node:path";
import {google} from "googleapis";
import {env, ROOT} from "./env.mjs";

export const TOKEN_FILE = path.join(ROOT, ".tokens", "youtube.json");

export function oauthClient(redirectUri) {
  return new google.auth.OAuth2(env("YT_CLIENT_ID"), env("YT_CLIENT_SECRET"), redirectUri);
}

export async function uploadShort({file, title, description, tags = [], privacy}) {
  if (!fs.existsSync(TOKEN_FILE)) throw new Error("No YouTube login yet. Run: npm run yt:auth");
  const auth = oauthClient();
  auth.setCredentials(JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8")));
  auth.on("tokens", (t) => {
    const saved = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
    fs.writeFileSync(TOKEN_FILE, JSON.stringify({...saved, ...t}, null, 2));
  });
  const yt = google.youtube({version: "v3", auth});
  const res = await yt.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {title: title.slice(0, 100), description, tags, categoryId: "28"},
      status: {privacyStatus: privacy || process.env.YT_PRIVACY || "private", selfDeclaredMadeForKids: false},
    },
    media: {body: fs.createReadStream(file)},
  });
  return {id: res.data.id, url: `https://youtube.com/shorts/${res.data.id}`};
}
