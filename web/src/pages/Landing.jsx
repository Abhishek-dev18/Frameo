import React, {useState} from "react";
import {Brand, Footer} from "../ui.jsx";

const STYLES = [
  {id: "midnight-deploy", name: "Anime story", line: "A developer and his AI drone fix a real bug before sunrise.", credits: "2 credits"},
  {id: "explainer-cards", name: "Explainer cards", line: "Animated step-by-step diagrams for any concept.", credits: "1 credit"},
  {id: "kahaani", name: "Character story", line: "Two characters act out the idea as a tiny story.", credits: "2 credits"},
  {id: "anime-action", name: "Anime action", line: "Close-ups, a sword clash and a cliffhanger.", credits: "3 credits"},
];

const PLANS = [
  {name: "Free", price: "₹0", per: "to try", credits: "30 credits once", points: ["Every style", "Review before posting", "Instagram + YouTube"]},
  {name: "Starter", price: "₹499", per: "/month", credits: "30 credits / month", points: ["About 15–30 episodes", "1 pipeline", "Email + Telegram alerts"]},
  {name: "Creator", price: "₹999", per: "/month", credits: "70 credits / month", points: ["About 35–70 episodes", "5 pipelines", "60-second episodes"], featured: true},
  {name: "Pro", price: "₹2,499", per: "/month", credits: "200 credits / month", points: ["About 100–200 episodes", "Unlimited pipelines", "Priority rendering"]},
];

const FAQ = [
  ["Do I need to show my face or record my voice?", "No. Every episode is fully animated, with subtitles. Voiceover is on the way."],
  ["Can I check videos before they go live?", "Yes. By default you approve each script and each video before it posts. You can switch a pipeline to fully automatic once you trust it."],
  ["Will YouTube and Instagram allow these videos?", "Yes, when each episode teaches something real. Frameo writes a different story for every topic and labels videos as AI-made, which both platforms ask for. Endless near-identical uploads are what get channels in trouble."],
  ["What's a credit?", "One credit makes one 30-second explainer. Story styles use 2–3 credits. A 60-second episode costs double. If a video fails, the credits come back."],
  ["Which languages?", "English today. Hindi and Hinglish are next."],
];

export default function Landing() {
  const [playing, setPlaying] = useState(null);
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
            Pick a story style, drop in your topics, set a schedule. Frameo writes each episode, animates it, and posts it to Instagram and YouTube.
            You approve everything before it goes live.
          </p>
          <div className="l-hero-cta">
            <a className="btn primary big" href="#/signup">Start free · 30 credits</a>
            <span className="dim small">No card needed</span>
          </div>
        </div>
        <div className="l-hero-video">
          <video src="/promo.mp4" poster="/promo-poster.jpg" autoPlay muted loop playsInline aria-label="Frameo in 30 seconds: topics become animated episodes that post on schedule" />
        </div>
      </section>

      <section className="l-strip" aria-label="What Frameo does">
        <div><b>4</b><span>story styles</span></div>
        <div><b>2</b><span>platforms, one schedule</span></div>
        <div><b>0</b><span>editing software</span></div>
        <div><b>₹</b><span>Indian pricing, UPI</span></div>
      </section>

      <section id="how" className="l-section">
        <h2 className="l-h2">How it works</h2>
        <ol className="l-steps">
          <li><span className="mono">01</span><h3>Pick a style</h3><p>Anime story, explainer cards, character story or full anime action.</p></li>
          <li><span className="mono">02</span><h3>Add topics</h3><p>Paste a list like "JWT expiry bug" or "What is RAG". One topic becomes one episode.</p></li>
          <li><span className="mono">03</span><h3>Set a schedule</h3><p>Choose days and a time. Frameo prepares the next few episodes ahead.</p></li>
          <li><span className="mono">04</span><h3>Approve and post</h3><p>Check each script and video on your phone. Approved episodes post on time to Instagram and YouTube.</p></li>
        </ol>
      </section>

      <section id="styles" className="l-section">
        <h2 className="l-h2">Four styles to start</h2>
        <div className="l-styles">
          {STYLES.map((s) => (
            <figure key={s.id} className="l-style" onMouseEnter={() => setPlaying(s.id)} onMouseLeave={() => setPlaying(null)}>
              <div className="l-style-video">
                <video src={`/samples/${s.id}.mp4`} poster={`/samples/${s.id}.jpg`} muted loop playsInline preload="metadata" ref={(v) => v && (playing === s.id ? v.play().catch(() => {}) : v.pause())} />
              </div>
              <figcaption>
                <b>{s.name}</b>
                <span>{s.line}</span>
                <span className="mono dim">{s.credits} per episode</span>
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
          <div><h3>Never misses a slot</h3><p>Frameo prepares episodes days ahead and tells you on Telegram when something needs you.</p></div>
        </div>
      </section>

      <section id="pricing" className="l-section">
        <h2 className="l-h2">Simple pricing</h2>
        <p className="dim">Credits pay for writing and rendering. Failed videos are refunded automatically.</p>
        <div className="l-plans">
          {PLANS.map((p) => (
            <div key={p.name} className={`l-plan ${p.featured ? "featured" : ""}`}>
              {p.featured ? <span className="l-badge mono">MOST POPULAR</span> : null}
              <h3>{p.name}</h3>
              <div className="l-price"><b>{p.price}</b><span>{p.per}</span></div>
              <div className="mono small accent">{p.credits}</div>
              <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>
              <a className={`btn ${p.featured ? "primary" : ""}`} href="#/signup">{p.name === "Free" ? "Start free" : `Choose ${p.name}`}</a>
            </div>
          ))}
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
