# PixelScript

PixelScript turns story scripts into anime-style tech Reels (rendered with [Remotion](https://www.remotion.dev)) and posts them to Instagram and YouTube on a schedule.

It's built to become a public SaaS: anyone signs up, picks a video style, drops in topics, sets a schedule, and PixelScript writes, makes and posts an episode on every slot. Right now it runs on your own computer. **[ROADMAP.md](ROADMAP.md)** lists everything still needed to run it publicly (Meta and Google approvals, payments, hosting, legal).

## Quick start

```bash
npm install
cp .env.example .env     # fill in what you have; everything is optional to start
npm run dev
```

Open **http://127.0.0.1:5173**. The first account you create becomes the **admin** (on the Free plan; switch your own plan on the Admin page to test pipelines) (it can set up the Instagram, YouTube, storage and AI keys for this install). Password-reset links are printed in the terminal until an email service is added.

## How it works for a user

1. **Landing page** → sign up (30 free credits).
2. **Onboarding**: name the channel → how posting works → pick a first style.
3. **Free plan: single videos.** Pick a style, type a topic → approve the script → download the MP4 (with a small "Made with PixelScript" mark) and upload it yourself. One video at a time.
4. **Starter and up: pipelines.** New pipeline (5 steps): style + episode length → topics (one per line) → days and time + review mode → Instagram / YouTube → cost check and save.
5. PixelScript plans the next 3 episodes. For each one: **writes the script** (Gemini) → you **approve the script** → it **makes the video** (Remotion) → you **approve the video** → it **posts** at the slot. In *Autopilot* mode both reviews are skipped.
6. **Home** shows what needs your review, your pipelines and the week's calendar. The bell and Telegram tell you when something needs you.

Episode stages: `writing → script_review → render_queued → rendering → video_review → scheduled → posting → posted` (or `failed` / `skipped`). Credits are charged when a video is made and refunded if it fails.

## What's inside

| Path | What it is |
|---|---|
| `server/index.mjs` | API server: auth, pipelines, episodes, notifications, admin, connections. |
| `server/engine.mjs` | Runs every minute: plans episodes, writes scripts, renders, posts. |
| `server/db.mjs` | Small JSON database in `content/db.json` (not committed). |
| `server/auth.mjs` | Signup, login, sessions, password reset. |
| `server/writer.mjs` | Gemini script writer (placeholder script when no key). |
| `server/templates.mjs` | The video styles and their credit cost. |
| `web/` | The website (React + Vite): landing, auth, onboarding, app, admin. |
| `web/public/promo.mp4` | Landing-page video (`src/PixelScriptPromo.tsx`). |
| `src/` | The Remotion videos. |
| `out/` | Rendered MP4s and `pixelscript.log` (not committed). |

To re-render the landing video: `npx remotion render src/index.ts PixelScriptPromo web/public/promo.mp4 --crf=24`.

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens Remotion Studio in your browser to preview and edit videos live. |
| `npm run render -- ep1` | Renders an episode to `out/` without posting. |
| `npm run post -- ep1 --dry-run` | Same as render, through the full posting path, but posts nothing. |
| `npm run post -- ep1` | Renders (if needed) and posts an episode right now. |
| `npm run scheduler` | Keeps running and posts every episode when its `at` time arrives. |
| `npm run ig:check` | Checks your Instagram token and shows your Instagram user ID. |
| `npm run ig:refresh` | Refreshes the Instagram token (the scheduler also does this every Sunday). |
| `npm run yt:auth` | One-time YouTube sign-in. |

---

The command-line tools above do the same things as the dashboard, if you prefer a terminal.

# Setup (one time, about 1–2 hours)

You can enter every key on the dashboard's **Connections** page instead of editing `.env` by hand; the steps below explain where each value comes from.

## 1. Install the basics

- **Node.js 20 or newer**: https://nodejs.org (LTS version)
- **Git**: https://git-scm.com

```bash
git clone https://github.com/Abhishek-dev18/PixelScript.git
cd PixelScript
npm install
cp .env.example .env        # Windows PowerShell: copy .env.example .env
```

Check the videos work:

```bash
npm run studio              # preview in the browser
npm run render -- ep1       # first render downloads a browser for Remotion; takes a few minutes
```

Your video is now at `out/ep1-the-expired-token.mp4`. Watch it before going further.

## 2. Set your channel name

Set the name and handle on the dashboard's Connections page (or in `content/settings.json`). If you have a royalty-free music track, put it in `public/` (for example `public/music.mp3`) and set `"music": "music.mp3"` in `content/settings.json`. Instagram's API can't add Instagram's own music, so any music must be inside the video.

## 3. Cloudflare R2 (video hosting)

Instagram doesn't accept file uploads through its API. It downloads the video from a public link, so the MP4 needs to be online first. R2's free tier (10 GB) is plenty.

1. Create a free Cloudflare account and open **R2 Object Storage**.
2. **Create bucket** named `pixelscript-videos`.
3. In the bucket's **Settings**, turn on **Public Development URL** (r2.dev). Copy the URL (looks like `https://pub-xxxx.r2.dev`) into `R2_PUBLIC_URL`.
4. Back in R2, open **Manage API tokens** and create a token with **Object Read & Write** on that bucket. Copy the **Access Key ID** and **Secret Access Key** into `.env`.
5. Your **Account ID** is shown on the R2 overview page; put it in `R2_ACCOUNT_ID`.

## 4. Instagram

You need an Instagram **professional account** (Creator or Business) for the channel. In the Instagram app: Settings, then Account type and tools, then Switch to professional account.

1. Go to https://developers.facebook.com, log in, and register as a developer.
2. **Create app**. Choose the use case for managing messaging and content on Instagram (the wording changes over time; pick the Instagram API option, app type Business if asked).
3. In the app, open **Instagram**, then **API setup with Instagram login**.
4. Add your channel's Instagram account. In development mode the account must have a role on the app: add it under **App roles** as an **Instagram Tester**, then accept the invite in Instagram (Settings, then Apps and websites, then Tester invites).
5. Make sure the permissions include `instagram_business_basic` and `instagram_business_content_publish`.
6. Click **Generate token** next to your account. Paste it into the dashboard's Instagram card and click **Connect**; PixelScript fills in your user ID itself. (Terminal alternative: put it in `IG_ACCESS_TOKEN` in `.env`, run `npm run ig:check` and copy the ID into `IG_USER_ID`.)

Tokens last about 60 days. The scheduler refreshes it every Sunday; you can also run `npm run ig:refresh`.

## 5. YouTube

1. Go to https://console.cloud.google.com and create a project called `pixelscript`.
2. **APIs & Services**, then **Library**: enable **YouTube Data API v3**.
3. **OAuth consent screen**: choose **External**, fill in the app name and your email, and add yourself as a **test user**.
4. **Important:** on the consent screen, click **Publish app** to move it to **In production**. In "Testing" mode Google expires your login every 7 days and uploads stop. Google will show an "unverified app" warning when you sign in; that's fine for your own account.
5. **Credentials**, then **Create credentials**, then **OAuth client ID**, type **Desktop app**. Paste the client ID and secret into the dashboard's YouTube card (or `YT_CLIENT_ID` and `YT_CLIENT_SECRET` in `.env`).
6. Click **Sign in with Google** on the dashboard and approve with the Google account that owns the channel. (Terminal alternative: `npm run yt:auth`.)

**Uploads start as private.** Google locks videos uploaded by unaudited API projects to private. Apply for the free audit now (search "YouTube API Services audit and quota extension form"); it can take a few weeks. Until it's approved, open YouTube Studio after each upload and publish or schedule the video by hand.

## 6. Post your first episode

On the dashboard, open Episode 1, check the caption and time, click **Render preview** and watch it. Then either click **Post now**, or switch on **Queue for auto-post** and turn **ON AIR** on in the top bar.

From a terminal instead:

```bash
npm run post -- ep1 --dry-run     # renders, posts nothing
npm run post -- ep1               # posts now
```

Or let it post at the scheduled time:

```bash
npm run scheduler
```

Keep the terminal open and the computer awake (turn off sleep while it runs). Results are saved into `content/episodes.json` and `out/pixelscript.log`.

## Adding the next episode

Add an object to `content/episodes.json`:

```json
{
  "id": "ep2",
  "composition": "CacheThatLied",
  "file": "out/ep2-the-cache-that-lied.mp4",
  "title": "Midnight Deploy · Ep 2: The Cache That Lied",
  "caption": "…",
  "tags": ["caching", "redis", "backend"],
  "platforms": ["instagram", "youtube"],
  "at": "2026-10-15T21:00:00+05:30",
  "status": "scheduled"
}
```

`composition` must match an `id` registered in `src/Root.tsx`. Use `"platforms": ["instagram"]` to post to one place only. If a post fails, its status becomes `failed` with the reason in `error`; fix the problem, set the status back to `scheduled`, and it retries. Platforms that already succeeded are skipped.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Missing … in .env` | Fill in that line in `.env`. |
| Instagram: `Invalid OAuth access token` | Token expired or was copied wrong. Generate a new one (step 4.6). |
| Instagram: processing failed | Check the R2 public URL opens the MP4 in a browser. The video must be MP4 (H.264 + AAC), 9:16. |
| YouTube: `invalid_grant` | Your consent screen is still in Testing mode, or you revoked access. Publish the app (step 5.4) and run `npm run yt:auth` again. |
| YouTube video stuck on private | Expected until the API audit is approved. Publish it in YouTube Studio. |
| Render fails to download a browser | Install Google Chrome and set `REMOTION_BROWSER` in `.env` to its path. |

## Security

`.env` and `.tokens/` hold your keys and logins. They're in `.gitignore`; never commit them or paste them anywhere.
