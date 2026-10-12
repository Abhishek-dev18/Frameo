import React, {useEffect, useState, useCallback} from "react";
import {api, isReview, fmtWhen, relative, scheduleText, canPipeline} from "../api.js";
import {Stage, Platform, Empty} from "../ui.jsx";
import Calendar from "./Calendar.jsx";

export default function Home({state, toast}) {
  const [pipelines, setPipelines] = useState(null);
  const [episodes, setEpisodes] = useState([]);

  const load = useCallback(async () => {
    try {
      const [p, e] = await Promise.all([api.pipelines(), api.episodes()]);
      setPipelines(p);
      setEpisodes(e);
    } catch (err) {
      toast(err.message, "bad");
    }
  }, [toast]);
  useEffect(() => {
    load();
    const t = setInterval(load, 6000);
    return () => clearInterval(t);
  }, [load]);

  if (!pipelines) return <div className="loading mono">LOADING…</div>;
  const inbox = episodes.filter(isReview);
  const c = state.connections;
  const missing = [!c.instagram.configured && "Instagram", !c.youtube.connected && "YouTube", !c.storage.configured && "video hosting"].filter(Boolean);
  const greet = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";
  const videos = episodes.filter((e) => e.single).reverse();
  const inboxBlock = <Inbox inbox={inbox} />;

  // Free plan: single videos only.
  if (!canPipeline(state)) {
    return (
      <div className="home">
        <div className="home-head">
          <h1 className="title-l">{greet}, {state.user.name}</h1>
          <a className="btn primary" href="#/create">+ Make a video</a>
        </div>
        {inbox.length ? inboxBlock : null}
        {videos.length === 0 ? (
          <div className="section-gap">
            <Empty title="Make your first video" action={<a className="btn primary big" href="#/create">Make a video</a>}>
              Pick a style, type a topic and approve the script. Frameo makes a finished vertical video you can download and post anywhere.
            </Empty>
          </div>
        ) : (
          <section className="section-gap" aria-label="Recent videos">
            <div className="week-head">
              <h2 className="title-s">Recent videos</h2>
              <span className="mono dim">{videos.length}</span>
              <a className="linkbtn week-nav" href="#/videos">All videos →</a>
            </div>
            <div className="inbox-list">
              {videos.slice(0, 6).map((e) => (
                <a key={e.id} href={`#/review/${e.id}`} className="pipe">
                  <Stage stage={e.stage} />
                  <b>{e.title}</b>
                  <span className="dim small">{state.templates.find((t) => t.id === e.template)?.name} · {relative(e.createdAt)}</span>
                </a>
              ))}
            </div>
          </section>
        )}
        <div className="upsell section-gap">
          <div>
            <span className="eyebrow mono">STARTER · ₹499/MONTH</span>
            <b>Let your channel post by itself</b>
            <span className="dim small">Pipelines take a list of topics and a schedule, then write, make and post every episode to Instagram and YouTube on time. No watermark, no manual uploads.</span>
          </div>
          <a className="btn primary" href="#/settings/plan">See plans</a>
        </div>
      </div>
    );
  }

  if (pipelines.length === 0) {
    return (
      <div className="home">
        <div className="home-head">
          <h1 className="title-l">{greet}, {state.user.name}</h1>
          <a className="btn" href="#/create">+ Single video</a>
        </div>
        {inbox.length ? inboxBlock : null}
        <Empty title="Create your first pipeline" action={<a className="btn primary big" href="#/pipelines/new">Create a pipeline</a>}>
          A pipeline is a recipe: a video style, a list of topics, a schedule and where to post. Frameo then writes, makes and posts one episode per slot.
        </Empty>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-head">
        <h1 className="title-l">{greet}, {state.user.name}</h1>
        <span className="home-actions">
          <a className="btn" href="#/create">+ Single video</a>
          <a className="btn primary" href="#/pipelines/new">+ New pipeline</a>
        </span>
      </div>

      {missing.length && state.user.role === "admin" ? (
        <a className="setup" href="#/settings/connections">
          <span className="setup-count mono">!</span>
          <span><b>Connect {missing.join(", ")}</b> so approved episodes can post.</span>
          <span className="setup-go">Connect →</span>
        </a>
      ) : null}

      {inboxBlock}

      <div className="home-grid">
        <section className="pipes" aria-label="Your pipelines">
          <div className="week-head">
            <h2 className="title-s">Pipelines</h2>
            <span className="mono dim">{pipelines.length}</span>
          </div>
          <div className="pipe-list">
            {pipelines.map((p) => {
              const t = state.templates.find((x) => x.id === p.template);
              return (
                <a key={p.id} href={`#/pipelines/${p.id}`} className={`pipe ${p.status}`}>
                  <span className="pipe-top">
                    <b>{p.name}</b>
                    <span className={`live-tag mono ${p.status === "active" ? "on" : ""}`}>{p.status === "active" ? "● LIVE" : "‖ PAUSED"}</span>
                  </span>
                  <span className="dim small">{t?.name} · {scheduleText(p.schedule)}</span>
                  <span className="pipe-meta">
                    {p.channels.map((ch) => <Platform key={ch} name={ch} small />)}
                    {p.counts.review ? <span className="pill-mini review">{p.counts.review} to review</span> : null}
                    <span className={`pill-mini ${p.topicsLeft <= 2 ? "warn" : ""}`}>{p.topicsLeft} topics left</span>
                  </span>
                  {p.nextSlots[0] ? <span className="mono small dim">Next: {fmtWhen(p.nextSlots[0])}</span> : null}
                </a>
              );
            })}
          </div>
        </section>
        <Calendar episodes={episodes.filter((e) => !e.single && e.stage !== "skipped")} pipelines={pipelines} />
      </div>
    </div>
  );
}

function Inbox({inbox}) {
  return (
    <section className="inbox" aria-label="Needs your review">
      <div className="week-head">
        <h2 className="title-s">Needs your review</h2>
        <span className="mono dim">{inbox.length}</span>
      </div>
      {inbox.length ? (
        <div className="inbox-list">
          {inbox.map((e) => (
            <a key={e.id} href={`#/review/${e.id}`} className="inbox-item">
              <Stage stage={e.stage} />
              <b>{e.title}</b>
              <span className="dim small">{e.single ? "Single video" : `${e.pipelineName} · airs ${relative(e.at)}`}</span>
              <span className="inbox-go">Review →</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="dim small all-clear">All clear. New scripts and videos show up here for your approval.</p>
      )}
    </section>
  );
}
