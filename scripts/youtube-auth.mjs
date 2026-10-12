// One-time YouTube login. Opens a Google sign-in link; after you approve,
// the refresh token is saved to .tokens/youtube.json so uploads work unattended.
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import {oauthClient, TOKEN_FILE} from "./lib/youtube.mjs";

const PORT = 53682;
const redirect = `http://127.0.0.1:${PORT}`;
const client = oauthClient(redirect);
const url = client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/youtube.upload"],
});

const server = http.createServer(async (req, res) => {
  const code = new URL(req.url, redirect).searchParams.get("code");
  if (!code) return res.end("Waiting for Google sign-in…");
  try {
    const {tokens} = await client.getToken(code);
    fs.mkdirSync(path.dirname(TOKEN_FILE), {recursive: true});
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    res.end("YouTube connected. You can close this tab and go back to the terminal.");
    console.log(`\n✓ Saved YouTube login to ${TOKEN_FILE}`);
  } catch (e) {
    res.end("Sign-in failed: " + e.message);
    console.error(e.message);
  }
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Open this link in your browser and sign in with the channel's Google account:\n");
  console.log(url + "\n");
});
