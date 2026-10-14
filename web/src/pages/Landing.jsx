import React from "react";
import {Brand, Footer} from "../ui.jsx";
import {PLANS, TOPUP} from "../api.js";

const STYLES = [
  {id: "explainer-cards", name: "Explainer cards", line: "Animated step-by-step diagrams for any concept.", credits: 1},
  {id: "kahaani", name: "Character story", line: "Two characters act out the idea as a tiny story.", credits: 2},
  {id: "midnight-deploy", name: "Anime story", line: "A developer and his AI drone fix a real bug before sunrise.", credits: 2},
  {id: "anime-action", name: "Anime action", line: "Close-ups, a sword clash and a cliffhanger.", credits: 3},
];

const FAQ = [
  ["Do I need to show my face or record my voice?", "No. Every episode is fully animated, with subtitles. Add an AI voiceover in Hindi, English or Hinglish, or keep it music-only."],
  ["Can I check videos before they go live?", "Yes. By default you approve each script and each video before it posts. You can switch a pipeline to fully automatic once you trust it."],
  ["Will YouTube and Instagram allow these videos?", "Yes, when each episode teaches something real. PixelScript writes a different story for every topic and labels videos as AI-made, which both platforms ask for. Endless near-identical uploads are what get channels in trouble."],
  ["What do I get for free?", "20 credits to make videos one at a time, with or without a voiceover. You approve the script, download the finished video and post it yourself. Free videos carry a small \"Made with PixelScript\" mark. Pipelines that post on a schedule, without the mark, start on Starter."],
  ["What's a credit?", "One credit makes a 30-second explainer. Story styles use 2–3. A voiceover adds 1 credit per 30 seconds, and a 60-second episode counts double. If a video fails, the credits come back."],
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
            Pick a story style, drop in your topics, set a schedule. PixelScript writes each episode, animates it, and posts it to Instagram and YouTube.
            You approve everything before it goes live.
          </p>
          <div className="l-hero-cta">
            <a className="btn primary big" href="#/signup">Start free · 20 credits</a>
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
                <span className="mono dim">{s.credits} credit{s.credits > 1 ? "s" : ""} per video <span className="l-voice">· voice +1</span></span>
              </figcaption>
            </figure>
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
        <div className="l-costs mono">
          <span>30s explainer <b>1 credit</b></span>
          <span>Story styles <b>2–3</b></span>
          <span>60s video <b>×2</b></span>
          <span>Voiceover <b>+1</b> per 30s</span>
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
