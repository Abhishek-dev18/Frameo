import React from "react";
import {Brand, Footer} from "../ui.jsx";
import {PLANS, TOPUP} from "../api.js";

const STYLES = [
  {id: "explainer-cards", name: "Explainer cards", line: "Animated step-by-step diagrams for any concept.", credits: 1},
  {id: "kahaani", name: "Character story", line: "Two characters act out the idea as a tiny story.", credits: 2},
  {id: "midnight-deploy", name: "Anime story", line: "A developer and his AI drone fix a real bug before sunrise.", credits: 2},
  {id: "anime-action", name: "Anime action", line: "Close-ups, a sword clash and a cliffhanger.", credits: 4},
];

// Everything a user gets on every plan. Small things, but they are what makes the price feel fair.
const INCLUDED = [
  {
    group: "Ready to post",
    items: [
      ["Caption + hashtags", "Every video comes with an Instagram caption and 5–8 hashtags picked for the topic."],
      ["YouTube title and description", "Title, description, tags and #Shorts written for YouTube search."],
      ["One video, two platforms", "Each episode goes to Instagram Reels and YouTube Shorts from one schedule."],
      ["Full HD vertical", "1080×1920, the size both apps want. 30 or 60 seconds."],
      ["Copyright-safe music", "Every video has a music bed made for PixelScript. No copyright claims, no muted videos."],
      ["Your name on every video", "Channel name, episode number and your handle are built into each video."],
    ],
  },
  {
    group: "You stay in control",
    items: [
      ["Edit before it posts", "Change the on-screen text, caption or title, then remake the video if you like."],
      ["Review or autopilot", "Approve every script and video, or let a pipeline run on its own once you trust it."],
      ["Missed a review?", "You decide: skip that episode, move it to the next slot, or post it anyway."],
      ["Your days, your time", "Pick posting days and an hour. A calendar shows the week ahead."],
      ["Hindi, English, Hinglish", "Scripts written in the language your audience speaks."],
      ["Download anytime", "Every finished MP4 is yours to download and post anywhere else."],
    ],
  },
  {
    group: "Peace of mind",
    items: [
      ["You own your videos", "Use them on any channel, in ads or for clients. Commercial use included."],
      ["Failed? Credits back", "If a video can't be made, its credits are refunded automatically."],
      ["Alerts that find you", "In-app and Telegram alerts when a script needs you or a video goes live."],
      ["Credits renew monthly", "Paid plans top back up every month. Top-up credits never expire."],
      ["Laid out for each topic", "Diagrams, code, logs and cheat sheets arranged for the idea. No reused stock clips."],
      ["Free to start", "30 credits, no card. Only Free videos carry a small watermark."],
    ],
  },
];

const FAQ = [
  ["Do I need to show my face or record my voice?", "No. Every episode is fully animated, with subtitles. Add an AI voiceover in Hindi, English or Hinglish, or keep it music-only."],
  ["Can I check videos before they go live?", "Yes. By default you approve each script and each video before it posts. You can switch a pipeline to fully automatic once you trust it."],
  ["Will YouTube and Instagram allow these videos?", "Yes, when each episode teaches something real. PixelScript writes a different story for every topic and labels videos as AI-made, which both platforms ask for. Endless near-identical uploads are what get channels in trouble."],
  ["What do I get for free?", "30 credits to make videos one at a time, with or without a voiceover. You approve the script, download the finished video and post it yourself. Free videos carry a small \"Made with PixelScript\" mark. Pipelines that post on a schedule, without the mark, start on Starter."],
  ["What's a credit?", "Each style has its own price for a 30-second video: explainer cards 1 credit, character and anime stories 2, anime action 4. An AI voiceover adds 2 credits per 30 seconds. A 60-second video is double, and 1 credit less on story styles. If a video fails, the credits come back."],
  ["Do I get captions and hashtags too?", "Yes, on every plan and at no extra credits. Each video comes with an Instagram caption ending in hashtags, plus a YouTube title, description and tags. With a pipeline they're posted with the video; on Free you copy them with one tap."],
  ["Can I change things before it posts?", "Yes. Edit the on-screen text, the caption or the title while the episode waits for review, and remake the video if you want. Nothing posts without your approval unless you turn on autopilot."],
  ["What if I miss a review?", "Each pipeline has a rule you choose: skip that episode, move it to the next free slot, or post it anyway."],
  ["Will the music get my video muted or claimed?", "No. The music in PixelScript videos is made for PixelScript and cleared for social media. You can still add trending audio inside Instagram if you want."],
  ["Who owns the videos?", "You do. Download them, post them on any channel, use them in ads or for clients."],
  ["Which languages?", "Hindi, English and Hinglish, for both the script and the voiceover. Mixing Hindi and English in one sentence sounds natural, not robotic."],
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="l-top">
        <Brand to="#/" />
        <nav className="l-links" aria-label="Sections">
          <a href="#how" onClick={(e) => (e.preventDefault(), document.getElementById("how")?.scrollIntoView({behavior: "smooth"}))}>How it works</a>
          <a href="#styles" onClick={(e) => (e.preventDefault(), document.getElementById("styles")?.scrollIntoView({behavior: "smooth"}))}>Styles</a>
          <a href="#included" onClick={(e) => (e.preventDefault(), document.getElementById("included")?.scrollIntoView({behavior: "smooth"}))}>What's included</a>
          <a href="#pricing" onClick={(e) => (e.preventDefault(), document.getElementById("pricing")?.scrollIntoView({behavior: "smooth"}))}>Pricing</a>
        </nav>
        <div className="l-cta">
          <a className="btn ghost-l" href="#/login">Log in</a>
          <a className="btn primary" href="#/signup">Start free</a>
        </div>
      </header>

      <section className="l-hero">
        <div className="l-hero-text">
          <div className="eyebrow mono">ANIME-STYLE TECH REELS · ON AUTOPILOT</div>
          <h1 className="l-h1">Your channel posts while you sleep.</h1>
          <p className="l-lede">
            Pick a story style, drop in your topics, set a schedule. PixelScript writes each episode, animates it, and posts it to Instagram and YouTube with the caption, hashtags and title already written.
            You approve everything before it goes live.
          </p>
          <div className="l-hero-cta">
            <a className="btn primary big" href="#/signup">Start free · 30 credits</a>
            <span className="dim small">No card needed</span>
          </div>
        </div>
        <div className="l-hero-video">
          <video src="/promo.mp4" poster="/promo-poster.jpg" autoPlay muted loop playsInline aria-label="PixelScript in 30 seconds: topics become animated episodes that post on schedule" />
        </div>
      </section>

      <section className="l-strip" aria-label="What PixelScript does">
        <div><b>4</b><span>story styles</span></div>
        <div><b>2</b><span>platforms, one schedule</span></div>
        <div><b>3</b><span>languages, with AI voice</span></div>
        <div><b>₹</b><span>Indian pricing, UPI</span></div>
      </section>

      <section id="how" className="l-section">
        <h2 className="l-h2">How it works</h2>
        <ol className="l-steps">
          <li><span className="mono">01</span><h3>Pick a style</h3><p>Explainer cards, character story, anime story or full anime action.</p></li>
          <li><span className="mono">02</span><h3>Add topics + voice</h3><p>Paste a list like "JWT expiry bug" or "What is RAG". Pick a voiceover in Hindi, English or Hinglish, or keep it music-only.</p></li>
          <li><span className="mono">03</span><h3>Set a schedule</h3><p>Choose days and a time. PixelScript prepares the next few episodes ahead.</p></li>
          <li><span className="mono">04</span><h3>Approve and post</h3><p>Check each script and video on your phone. Approved episodes post on time to Instagram and YouTube.</p></li>
        </ol>
      </section>

      <section id="styles" className="l-section">
        <h2 className="l-h2">Four styles to start</h2>
        <div className="l-styles">
          {STYLES.map((s) => (
            <figure key={s.id} className="l-style">
              <div className="l-style-video">
                <video src={`/samples/${s.id}.mp4`} poster={`/samples/${s.id}.jpg`} autoPlay muted loop playsInline preload="auto" />
              </div>
              <figcaption>
                <b>{s.name}</b>
                <span>{s.line}</span>
                <span className="mono dim">{s.credits} credit{s.credits > 1 ? "s" : ""} per 30s <span className="l-voice">· {s.credits + 2} with voice</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="included" className="l-section">
        <h2 className="l-h2">Everything included, on every plan</h2>
        <p className="dim l-sub">The small things that usually cost extra, or take you an hour per post.</p>
        <div className="l-inc">
          {INCLUDED.map((g) => (
            <div key={g.group} className="l-inc-group">
              <div className="mono l-inc-head">{g.group}</div>
              <ul>
                {g.items.map(([t, d]) => (
                  <li key={t}><b>{t}</b><span>{d}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="l-section l-why">
        <h2 className="l-h2">Built for creators who'd rather build</h2>
        <div className="l-why-grid">
          <div><h3>You stay in control</h3><p>Every script and video waits for your approval unless you say otherwise. Edit a line, remake the video, or skip it.</p></div>
          <div><h3>Real tech, explained right</h3><p>Episodes are built around real bugs and real code, with one takeaway viewers can repeat in an interview.</p></div>
          <div><h3>A series, not random clips</h3><p>Recurring characters, numbered episodes and cliffhangers give people a reason to follow.</p></div>
          <div><h3>Never misses a slot</h3><p>PixelScript prepares episodes days ahead and tells you on Telegram when something needs you.</p></div>
        </div>
      </section>

      <section id="pricing" className="l-section">
        <h2 className="l-h2">Simple pricing</h2>
        <p className="dim">Try it free with single videos you post yourself. Pipelines that post on a schedule start on Starter. Every plan includes AI voiceover in Hindi, English and Hinglish. Failed videos are refunded automatically.</p>
        <div className="l-plans">
          {PLANS.map((p) => (
            <div key={p.id} className={`l-plan ${p.featured ? "featured" : ""}`}>
              {p.featured ? <span className="l-badge mono">MOST POPULAR</span> : null}
              <h3>{p.name}</h3>
              <div className="l-price"><b>{p.price}</b><span>{p.per}</span></div>
              <div className="mono small accent">{p.credits}</div>
              <div className="dim small">{p.note}</div>
              <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
              <a className={`btn ${p.featured ? "primary" : ""}`} href="#/signup">{p.name === "Free" ? "Start free" : `Choose ${p.name}`}</a>
            </div>
          ))}
        </div>
        <div className="l-compare">
          <div>
            <span className="mono dim">TYPICAL AUTO-POSTING TOOLS</span>
            <ul>
              <li>One series per subscription</li>
              <li>From $15–19 a month (₹1,250+)</li>
              <li>Stock clips + voice, Hinglish rarely offered</li>
              <li>Priced in dollars, card only</li>
            </ul>
          </div>
          <div className="us">
            <span className="mono">PIXELSCRIPT</span>
            <ul>
              <li>1, 5 or unlimited pipelines</li>
              <li>From ₹499 a month, UPI</li>
              <li>Hindi, English, Hinglish · animated for each topic</li>
              <li>Caption, hashtags, YouTube title and music included</li>
            </ul>
          </div>
        </div>
        <div className="l-costs mono">
          <span>30s video <b>1–4 credits</b> by style</span>
          <span>AI voice <b>+2</b> per 30s</span>
          <span>60s <b>×2</b>, 1 less on story styles</span>
          <span>Top-up <b>{TOPUP.credits} credits · {TOPUP.price}</b></span>
        </div>
      </section>

      <section className="l-section l-faq">
        <h2 className="l-h2">Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      <section className="l-final">
        <h2 className="l-h1">Episode 1 is one topic away.</h2>
        <a className="btn primary big" href="#/signup">Start free</a>
      </section>

      <Footer />
    </div>
  );
}
