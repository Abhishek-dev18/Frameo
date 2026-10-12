# Frameo roadmap: from "works on my laptop" to a public SaaS

This file lists everything that is **built as a placeholder or stub today** and what it needs to become real. Read it top to bottom: section 1 blocks launch, the rest can follow.

Legend: **[blocker]** must be done before strangers can use it · **[launch]** needed for a paid launch · **[later]** improves the product.

---

## 0. Before anything public

- [ ] **[blocker] Employer side-project approval.** Check your employment contract and company side-project / outside-work policy (Ericsson) and get written approval before launching a paid product.
- [ ] **[blocker] Business entity + bank account.** Needed for Meta business verification, Razorpay, GST and invoices. Sole proprietorship with Udyam registration is the cheapest start; a Private Limited / LLP later.
- [ ] **[blocker] Domain + email.** e.g. `frameo.app` / `getframeo.com`. Set up `support@`, `privacy@`, `grievance@` mailboxes (Zoho Mail free tier or Google Workspace).

---

## 1. Platform approvals (the slow part: start these first)

### Meta / Instagram  **[blocker]**
Today: one Instagram account connected by pasting a token in Settings → Connections (admin only), using Instagram API with Instagram Login in **development mode**. Only accounts added as testers in the Meta app can post.

To let any user connect their own Instagram:
- [ ] Meta developer app, type **Business**, product **Instagram API with Instagram Login**.
- [ ] **Business verification** of your company in Meta Business Manager (needs entity documents, website on your domain).
- [ ] **App Review** for permissions: `instagram_business_basic`, `instagram_business_content_publish` (and `instagram_business_manage_insights` for view counts).
  - Needs: a screencast of the full flow (login → connect Instagram → schedule → video posted), a test account for reviewers, a clear description of why each permission is used.
- [ ] Public **Privacy Policy URL**, **Terms URL** and **Data Deletion** callback URL or instructions page. Drafts exist at `#/legal/privacy`, `#/legal/terms`, `#/legal/data`; they need real details and a lawyer's review (section 6).
- [ ] Switch app to **Live** mode.
- [ ] Respect limits: 100 API-published posts per account per 24h, Reels 3s–15min (90s recommended), 9:16, H.264/AAC, < 300 MB (Frameo renders fit this).
- Expect 2–6 weeks including rejections. Typical rejection reasons: screencast doesn't show the permission being used end-to-end, privacy policy missing data-deletion info.

### Google / YouTube  **[blocker]**
Today: one YouTube channel connected through a **Desktop OAuth client** with a loopback redirect (`127.0.0.1:5174/oauth/youtube`). The OAuth app is in **Testing** mode: tokens expire every 7 days and uploads are forced **private** until the project passes Google's audit.

- [ ] Google Cloud project on the company account; create a **Web application** OAuth client with redirect `https://<domain>/oauth/youtube`.
- [ ] OAuth consent screen: app name, logo, domain verification (Search Console), privacy policy + terms links, scope `youtube.upload` (+ `youtube.readonly` for stats).
- [ ] **OAuth verification** (sensitive scope): demo video, justification. Takes ~1–4 weeks.
- [ ] **YouTube API Services audit / compliance review** (form "YouTube API Services – Audit and Quota Extension"). Until it passes, videos uploaded via API are locked to private.
- [ ] **Quota.** Default 10,000 units/day; one upload costs ~1,600 units, so ~6 uploads/day for the whole app. Request a quota increase in the same audit form before launch.
- [ ] Follow the YouTube API Services Developer Policies (show the YouTube branding correctly, let users revoke access, delete their data within 30 days of disconnect).

### Per-user connections (code)  **[blocker]**
- [ ] Replace the admin-only Connections page with **one-click "Connect Instagram" / "Connect YouTube"** buttons per user (OAuth redirect flows on the server).
- [ ] Store tokens **per user**, **encrypted at rest** (AES-GCM with a key from env / KMS), never in `.env` or `.tokens/`.
- [ ] Token refresh jobs per user (Instagram long-lived tokens: refresh before 60 days; Google: refresh tokens).
- [ ] Handle revoked/expired tokens: mark the connection broken, pause posting, notify the user.
- [ ] Per-account posting rate limits and retries with backoff.

---

## 2. Money  **[launch]**

Today: plans and prices are shown (Free / Starter ₹499 / Creator ₹999 / Pro ₹2,499), "Upgrade" buttons are disabled, credits and plans are only changed by the admin (Admin page).

Plan rules already enforced in code (`server/templates.mjs` → `PLANS`):
- **Free**: 30 credits once; single videos only, one at a time; "Made with Frameo" watermark; user downloads the MP4 and uploads it by hand. No pipelines, no auto-posting.
- **Starter**: 1 live pipeline, auto-posting, no watermark. **Creator**: 5 pipelines. **Pro**: unlimited.
- Downgrading to Free stops that user's pipelines (nothing renders or posts until they upgrade).

- [ ] **Razorpay** account (needs the business entity, KYC, website with pricing, refund policy, contact page).
- [ ] **Subscriptions** via Razorpay Subscriptions + **UPI Autopay** (RBI e-mandate rules: pre-debit notification 24h before each charge, Razorpay handles it).
- [ ] Webhooks: `subscription.charged` → add monthly credits; `subscription.halted/cancelled` → downgrade; verify webhook signatures.
- [ ] One-off **credit packs** (Orders API).
- [ ] **GST**: register once turnover crosses ₹20 lakh (or from day one if selling to other states' businesses that want input credit); 18% on SaaS. Show prices "incl. GST" or "+ GST" consistently.
- [ ] **Invoices** (auto-generated PDF per payment, GSTIN, HSN/SAC 998314) and a billing history page.
- [ ] International cards / Stripe later if users outside India sign up.
- [ ] Credit expiry rules and the "failed renders are refunded" rule written into Terms.
- [ ] Monthly credit top-up job for paid plans (today credits never reset).
- [ ] Admin: billing view, manual refunds, coupons.

---

## 3. Infrastructure  **[blocker]**

Today: everything runs on one laptop, listening on 127.0.0.1 only. Data is a JSON file. Videos render in the same process as the web server, one at a time.

- [ ] **Database: Postgres** (Neon / Supabase / Railway). Replace `server/db.mjs` with a real schema + migrations (users, sessions, pipelines, topics, episodes, connections, notifications, events, payments). Daily backups.
- [ ] **Render workers.** Rendering blocks the engine today. Move to a job queue (BullMQ + Redis, or Postgres `SKIP LOCKED`) with separate worker machines. Options:
  - a VPS with 4–8 vCPU (Hetzner/DigitalOcean, ~₹1,500–4,000/month) running 1–2 concurrent renders, or
  - **Remotion Lambda** on AWS (pay per render, scales automatically; ~₹1–3 per 30s video).
- [ ] **Remotion licence.** Remotion is free for individuals and companies up to 3 people; a **Company License** is required once the company has 4+ people. A SaaS that renders for customers should also check the "Automators" pricing on remotion.pro.
- [ ] **Storage: Frameo-owned Cloudflare R2 bucket**, one folder per user. Today `/videos` is served **without authentication**: move to private bucket + short-lived signed URLs; give Instagram a signed URL that lives long enough for it to fetch.
- [ ] Lifecycle rules: delete rendered videos N days after posting (cost + privacy).
- [ ] **Hosting** for the web + API: Railway / Render / Fly.io / a VPS behind Caddy. **HTTPS**, domain, `NODE_ENV=production`, secure cookies (`Secure` flag), trust proxy.
- [ ] Secrets in the host's secret manager, not `.env` files.
- [ ] **Scheduler reliability**: one engine leader (DB lock), idempotent posting (never double-post on restart), dead-letter for repeated failures.
- [ ] Timezones: store each user's timezone; schedule in it (today the server's local time is used).
- [ ] Monitoring: uptime check, error tracking (Sentry), render queue length, failed-post alerts to the admin.
- [ ] Cost guardrails: per-user daily render cap, global spend alerts.

---

## 4. Accounts and email  **[launch]**

Today: email + password with scrypt hashes and cookie sessions; reset links are printed in the server terminal; "Continue with Google" is a disabled button.

- [ ] **Email service** (Resend / Amazon SES / Brevo): verification email on signup, password reset, "script ready for review", "posted", weekly summary. Domain SPF/DKIM/DMARC.
- [ ] **Email verification** before the first render.
- [ ] **Google sign-in** (same Google project as YouTube, `openid email profile` scopes only for login).
- [ ] Rate limiting on login/signup/forgot (e.g. 5/min per IP + per email); CAPTCHA (Cloudflare Turnstile) on signup.
- [ ] CSRF protection for cookie-authenticated POSTs (SameSite=Lax helps; add a token for safety).
- [ ] Session management page ("log out other devices").
- [ ] Change email / change password in Profile.
- [ ] Account deletion that also revokes Instagram/YouTube tokens and deletes stored videos (today it deletes DB rows only).

---

## 5. The product itself

### Videos  **[launch]**
Today: the four styles are **fixed stories**. Only Midnight Deploy's end card changes per episode (channel name, episode number and title come from the episode). The AI-written script lines are stored but **don't drive the scenes yet**.

- [ ] **Data-driven templates**: define a "screenplay" JSON (scenes, characters, dialogue, on-screen text, timings) that the writer produces and each Remotion template renders. This is the single biggest item to make the product real.
- [ ] **Voiceover** (TTS): ElevenLabs / Google Cloud TTS / Azure; Hindi, English, Hinglish voices. Cost per 30s ≈ ₹1–4. Sync subtitles to the audio.
- [ ] **Captions** word-by-word from the voice track (Remotion `@remotion/captions`, Whisper for timestamps).
- [ ] Music library with licences that allow commercial use on social platforms (or Instagram/YouTube audio libraries).
- [ ] Brand kit per user: colours, logo, fonts, outro.
- [ ] More styles, and a way to add them without code changes (template registry in the DB).
- [ ] Use **Remotion Agent Skills** (`npx skills add remotion-dev/skills`) while building these: `/remotion-saas` for the SaaS/Lambda setup, `/remotion-captions` for subtitles, `/remotion-markup` for templates.

### Scripts  **[launch]**
- [ ] Topic suggestions (trending in the niche) and "fill the next 10 topics for me".
- [ ] Hindi and Hinglish quality: the writer passes the pipeline language to Gemini, but prompts and output need tuning and testing per language (and Devanagari vs Roman script choice).
- [ ] Fact-check pass / "sources" for explainer topics.
- [ ] Moderation of user topics and generated scripts (block hate, adult, medical/financial claims, real-person defamation).

### Posting  **[launch]**
- [ ] **AI content label**: set Instagram/YouTube "made with AI / altered or synthetic content" disclosures where the API supports it, and keep the "Made with AI" note in captions.
- [ ] Cover image / thumbnail per platform; first comment; collaborator tags.
- [ ] More destinations later: Facebook Reels (same Meta app), TikTok (separate app review), LinkedIn, X.

### Insights  **[later]**
- [ ] Pull views, likes, saves, watch time (Instagram insights permission + YouTube Analytics API) into the Posted page (today shows "—").
- [ ] Simple "what's working" per pipeline (best posting time, best style).

### Notifications  **[later]**
- [ ] Telegram works today with a shared bot token (admin) + each user's chat ID pasted by hand. Make it one tap: deep link `t.me/<bot>?start=<token>` that links the chat automatically.
- [ ] WhatsApp (Cloud API, needs Meta business verification and paid templates) as an option for India.
- [ ] Web push.

### App polish  **[later]**
- [ ] Drag episodes between days on the calendar; month view.
- [ ] Bulk approve.
- [ ] Undo for skip/delete.
- [ ] Team seats (agency plan): multiple users per workspace, roles.
- [ ] Mobile app or PWA install.

---

## 6. Legal and compliance  **[blocker]**

Today: Privacy, Terms, Refunds and Data deletion pages exist as **drafts with [BRACKETS]** to fill.

- [ ] Fill in company name, address, contact, grievance officer; have a lawyer review (₹5–15k for a startup package).
- [ ] **DPDP Act 2023 (India)**: consent notice at signup, purpose limitation, data principal rights (access, correction, erasure), **Grievance Officer** name + contact on the site, breach notification process.
- [ ] If EU/UK users: GDPR basics (lawful basis, DPA with sub-processors, cookie banner if any non-essential cookies).
- [ ] List of **sub-processors** (hosting, R2, Gemini, TTS, email, Razorpay, Meta, Google).
- [ ] Terms must cover: user owns topics and outputs, user responsible for what's posted on their accounts, acceptable use, AI-generated content disclaimer, credits/refund rules, termination.
- [ ] Gemini / TTS provider terms allow commercial use of outputs (check each).
- [ ] Copyright: no copyrighted characters or music in templates; anime *style* is fine, specific characters are not.
- [ ] Cookie use is only the session cookie today (no banner needed in India; check for EU).

---

## 7. Quality  **[launch]**

- [ ] Automated tests: API (auth, pipeline CRUD, episode state machine, credits charge/refund), engine (scheduling across days/timezones), and an end-to-end browser test of signup → pipeline → approve → render.
- [ ] Load test the render queue.
- [ ] Accessibility pass (keyboard, contrast, screen reader labels).
- [ ] Analytics (Plausible / PostHog) for the funnel: landing → signup → first pipeline → first post.
- [ ] Status page.

---

## What's already working (for reference)

- Landing page with promo video, style previews, pricing, FAQ.
- Signup / login / logout / forgot + reset password (reset link in terminal), sessions.
- Onboarding (channel → connections → first style).
- New pipeline wizard with schedule preview and credit cost.
- Engine: plans 3 episodes ahead, writes scripts with Gemini (or placeholder), script review → render → video review → scheduled → posts to Instagram and YouTube for the admin's connected accounts; missed-review policy; credits charged/refunded.
- Home with review inbox, pipelines and week calendar; pipeline page; review page; posted library; activity log; notifications (in-app + Telegram); settings; admin (users, credits, services, failures).

## Suggested order

1. Employer approval, entity, domain (week 1).
2. Submit Meta business verification and Google OAuth verification **now** (they take weeks) while building:
3. Postgres + hosting + render worker + private storage.
4. Per-user OAuth connections + encrypted tokens.
5. Data-driven templates + voiceover (the product is only as good as the videos).
6. Email service, Razorpay subscriptions, legal pages finalised.
7. Private beta with 10–20 creators on the Free plan → fix → public launch.
