// Instagram API with Instagram Login: publish a Reel in three steps
// (create container -> wait until processed -> publish).
import {env, sleep, setEnvValue} from "./env.mjs";

const base = () => `https://graph.instagram.com/${process.env.IG_API_VERSION || "v23.0"}`;

async function request(method, url, params) {
  const u = new URL(url);
  const opts = {method};
  if (method === "GET") {
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
  } else {
    opts.body = new URLSearchParams(params);
  }
  const res = await fetch(u, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const e = data.error || {};
    throw new Error(`Instagram API: ${e.message || res.statusText} (code ${e.code ?? res.status})`);
  }
  return data;
}

export async function whoami() {
  return request("GET", `${base()}/me`, {fields: "user_id,username,account_type", access_token: env("IG_ACCESS_TOKEN")});
}

export async function publishReel({videoUrl, caption, shareToFeed = true}) {
  const userId = env("IG_USER_ID");
  const token = env("IG_ACCESS_TOKEN");
  const container = await request("POST", `${base()}/${userId}/media`, {
    media_type: "REELS",
    video_url: videoUrl,
    caption,
    share_to_feed: String(shareToFeed),
    access_token: token,
  });
  // Instagram downloads and processes the video; this usually takes 20s–2min.
  for (let i = 0; ; i++) {
    await sleep(10000);
    const s = await request("GET", `${base()}/${container.id}`, {fields: "status_code,status", access_token: token});
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`Instagram processing failed: ${s.status || s.status_code}`);
    if (i >= 36) throw new Error("Instagram processing timed out after 6 minutes");
  }
  const published = await request("POST", `${base()}/${userId}/media_publish`, {creation_id: container.id, access_token: token});
  const info = await request("GET", `${base()}/${published.id}`, {fields: "permalink", access_token: token}).catch(() => ({}));
  return {id: published.id, url: info.permalink || null};
}

// Long-lived tokens last ~60 days; refreshing gives a fresh 60 days.
export async function refreshToken() {
  const data = await request("GET", "https://graph.instagram.com/refresh_access_token", {
    grant_type: "ig_refresh_token",
    access_token: env("IG_ACCESS_TOKEN"),
  });
  setEnvValue("IG_ACCESS_TOKEN", data.access_token);
  return Math.round(data.expires_in / 86400);
}
