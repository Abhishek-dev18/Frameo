import React, {useState} from "react";
import {api, go, canPipeline} from "../api.js";
import {Field} from "../ui.jsx";
import {TemplateCard} from "./Onboarding.jsx";

// Make one video: pick a style, say what it's about, review the script, download the MP4.
export default function Create({state, route, toast, refresh}) {
  const [f, setF] = useState({template: route.query.template || state.templates[0].id, topic: "", length: 30, language: state.user.profile?.language || "English"});
  const [busy, setBusy] = useState(false);
  const t = state.templates.find((x) => x.id === f.template);
  const cost = (t?.credits || 1) * (f.length === 60 ? 2 : 1);
  const free = !canPipeline(state);
  const short = state.user.credits < cost;

  async function make(e) {
    e.preventDefault();
    if (!f.topic.trim()) return toast("Type what the video is about.", "bad");
    setBusy(true);
    try {
      const ep = await api.createVideo(f);
      toast("Writing your script now. It takes under a minute.", "good");
      refresh();
      go(`review/${ep.id}`);
    } catch (err) {
      toast(err.message, "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="wizard create" onSubmit={make}>
      <div className="wiz-head">
        <a className="linkbtn" href="#/videos">← Videos</a>
        <h1 className="title-l">Make a video</h1>
        <p className="lede">
          Pick a style and tell Frameo what the video is about. You'll check the script, then download the finished MP4 and post it yourself.
          {free ? " Free videos carry a small \"Made with Frameo\" mark." : ""}
        </p>
      </div>

      <div className="wiz-body">
        <h2 className="title-s">1 · Style</h2>
        <div className="tpl-grid">
          {state.templates.map((x) => (
            <TemplateCard key={x.id} t={x} selected={f.template === x.id} onSelect={() => setF({...f, template: x.id})} />
          ))}
        </div>

        <h2 className="title-s section-gap">2 · What's it about?</h2>
        <Field label="Topic" hint='One idea per video works best, e.g. "Why JWTs expire at the wrong time" or "What is RAG?"' counter={`${f.topic.length}/200`}>
          <input id="create-topic" value={f.topic} maxLength={200} onChange={(e) => setF({...f, topic: e.target.value})} placeholder="How RAG works" autoComplete="off" />
        </Field>
        <div className="grid2 narrow">
          <Field label="Length">
            <div className="seg-choice">
              {[30, 60].map((n) => (
                <button key={n} type="button" className={f.length === n ? "on" : ""} onClick={() => setF({...f, length: n})} aria-pressed={f.length === n}>{n} seconds</button>
              ))}
            </div>
          </Field>
          <Field label="Language">
            <select id="create-lang" value={f.language} onChange={(e) => setF({...f, language: e.target.value})}>
              <option>English</option>
              <option>Hinglish</option>
              <option>Hindi</option>
            </select>
          </Field>
        </div>

        <div className="cost-box">
          <div>
            <span className="mono dim">COST</span>
            <b>{cost} credit{cost === 1 ? "" : "s"}</b>
            <span className="dim small">You have {state.user.credits}. Charged when the video is made; refunded if it fails.</span>
          </div>
          {short ? <a className="btn small" href="#/settings/plan">Get credits</a> : null}
        </div>

        {free ? (
          <div className="upsell">
            <div>
              <b>Want it to post by itself?</b>
              <span className="dim small">Starter adds pipelines: give Frameo a list of topics and a schedule, and it makes and posts every episode to Instagram and YouTube, without the watermark.</span>
            </div>
            <a className="btn small" href="#/settings/plan">See plans</a>
          </div>
        ) : null}
      </div>

      <div className="wiz-foot">
        <a className="btn" href="#/videos">Cancel</a>
        <span className="spacer" />
        <button className="btn primary big" disabled={busy || short}>{busy ? "Starting…" : "Write the script"}</button>
      </div>
    </form>
  );
}
