import React, {useMemo, useState} from "react";
import {api, go, DAYS, fmtWhen, scheduleText, canPipeline} from "../api.js";
import {Field, Platform} from "../ui.jsx";
import {TemplateCard} from "./Onboarding.jsx";

const STEPS = ["Style", "Topics", "Schedule", "Channels", "Review"];

// Same rule as the server: next posting slots from the schedule.
export function previewSlots(schedule, count) {
  const out = [];
  if (!schedule.days.length || !schedule.time) return out;
  const [hh, mm] = schedule.time.split(":").map(Number);
  const start = schedule.startDate ? new Date(`${schedule.startDate}T00:00:00`) : new Date();
  const base = new Date(Math.max(start.getTime(), new Date().setHours(0, 0, 0, 0)));
  for (let i = 0; i < 400 && out.length < count; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, hh, mm);
    const wd = ((d.getDay() + 6) % 7) + 1;
    if (schedule.days.includes(wd) && d > new Date()) out.push(d);
  }
  return out;
}

export default function Wizard({state, route, toast, refresh}) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState(() => ({
    template: route.query.template || state.templates[0].id,
    name: "",
    seriesName: "",
    topics: "",
    length: 30,
    schedule: {days: [2, 4, 6], time: "21:00", startDate: new Date().toISOString().slice(0, 10)},
    reviewMode: "review",
    missedPolicy: "next",
    channels: ["instagram", "youtube"],
  }));
  const t = state.templates.find((x) => x.id === f.template);
  const topics = f.topics.split("\n").map((x) => x.trim()).filter(Boolean);
  const slots = useMemo(() => previewSlots(f.schedule, 3), [f.schedule]);
  const perEp = (t?.credits || 1) * (f.length === 60 ? 2 : 1);
  const perMonth = Math.round(perEp * f.schedule.days.length * 4.3);
  const c = state.connections;

  const checks = [
    () => (!t ? "Pick a style." : null),
    () => (!topics.length ? "Add at least one topic." : null),
    () => (!f.schedule.days.length ? "Pick at least one day." : !f.schedule.time ? "Pick a time." : null),
    () => (!f.channels.length ? "Pick at least one place to post." : null),
    () => null,
  ];
  const next = () => {
    const err = checks[step]();
    if (err) return toast(err, "bad");
    setStep(step + 1);
  };
  const toggleDay = (d) => setF({...f, schedule: {...f.schedule, days: f.schedule.days.includes(d) ? f.schedule.days.filter((x) => x !== d) : [...f.schedule.days, d].sort()}});
  if (!canPipeline(state)) return <PipelineLocked template={f.template} />;
  const toggleCh = (ch) => setF({...f, channels: f.channels.includes(ch) ? f.channels.filter((x) => x !== ch) : [...f.channels, ch]});

  async function save() {
    setBusy(true);
    try {
      const p = await api.createPipeline({
        name: f.name.trim() || f.seriesName.trim() || t.series,
        template: f.template,
        custom: {seriesName: f.seriesName.trim() || t.series},
        topics,
        length: f.length,
        schedule: f.schedule,
        reviewMode: f.reviewMode,
        missedPolicy: f.missedPolicy,
        channels: f.channels,
      });
      toast("Pipeline saved. Frameo is writing the first scripts now.", "good");
      refresh();
      go(`pipelines/${p.id}`);
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wizard">
      <div className="wiz-head">
        <a className="linkbtn" href="#/home">← Home</a>
        <h1 className="title-l">New pipeline</h1>
        <ol className="wiz-steps" aria-label="Steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>
              <button type="button" onClick={() => i < step && setStep(i)} disabled={i > step}>
                <span className="mono">{i < step ? "✓" : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="wiz-body">
        {step === 0 ? (
          <>
            <h2 className="title-m">Pick a video style</h2>
            <p className="dim">Every episode in this pipeline uses this style. Hover to preview.</p>
            <div className="tpl-grid">
              {state.templates.map((x) => <TemplateCard key={x.id} t={x} selected={f.template === x.id} onSelect={() => setF({...f, template: x.id})} />)}
            </div>
            <div className="grid2 narrow">
              <Field label="Series name" hint="Shown on the end card of every episode.">
                <input id="wiz-series" value={f.seriesName} onChange={(e) => setF({...f, seriesName: e.target.value})} placeholder={t?.series} maxLength={40} />
              </Field>
              <Field label="Episode length">
                <div className="seg-choice" role="radiogroup">
                  {[30, 60].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={f.length === n} className={f.length === n ? "on" : ""} onClick={() => setF({...f, length: n})}>
                      {n} seconds <span className="dim small">· {(t?.credits || 1) * (n === 60 ? 2 : 1)} credits</span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </>
        ) : step === 1 ? (
          <>
            <h2 className="title-m">What should the episodes be about?</h2>
            <p className="dim">One topic per line. Each topic becomes one episode, in this order. You can add more later.</p>
            <Field label="Topics" counter={`${topics.length} topic${topics.length === 1 ? "" : "s"}`}>
              <textarea id="wiz-topics" rows={10} value={f.topics} onChange={(e) => setF({...f, topics: e.target.value})} placeholder={"JWT expiry compared in seconds vs milliseconds\nA cache that served stale prices for a day\nAn infinite retry loop that took down an API\nAn API key leaked in a public repo"} />
            </Field>
            <div className="tips">
              <b>What makes a good topic</b>
              <ul>
                <li>A real problem with a clear fix: "the N+1 query that slowed every page".</li>
                <li>One idea per topic. Split big subjects into several episodes.</li>
                <li>Specific beats general: "why JWT exp is in seconds" over "authentication".</li>
              </ul>
            </div>
            <button className="btn" type="button" disabled title={c.writer.configured ? "Coming soon" : "Needs an AI key in Settings → Connections"}>
              Suggest topics for me <span className="soon mono">SOON</span>
            </button>
          </>
        ) : step === 2 ? (
          <>
            <h2 className="title-m">When should it post?</h2>
            <div className="field">
              <span className="field-label">Days</span>
              <div className="day-pick">
                {DAYS.map(([n, d]) => (
                  <button key={n} type="button" aria-pressed={f.schedule.days.includes(n)} className={f.schedule.days.includes(n) ? "on" : ""} onClick={() => toggleDay(n)}>{d}</button>
                ))}
              </div>
              <span className="field-hint">
                <button type="button" className="linkbtn" onClick={() => setF({...f, schedule: {...f.schedule, days: [1, 2, 3, 4, 5, 6, 7]}})}>Every day</button> ·{" "}
                <button type="button" className="linkbtn" onClick={() => setF({...f, schedule: {...f.schedule, days: [1, 2, 3, 4, 5]}})}>Weekdays</button> ·{" "}
                <button type="button" className="linkbtn" onClick={() => setF({...f, schedule: {...f.schedule, days: [2, 4, 6]}})}>3 times a week</button>
              </span>
            </div>
            <div className="grid2 narrow">
              <Field label="Time" hint="Your computer's time zone. Evenings (7–10 PM) usually do best.">
                <input id="wiz-time" type="time" value={f.schedule.time} onChange={(e) => setF({...f, schedule: {...f.schedule, time: e.target.value}})} />
              </Field>
              <Field label="Start on">
                <input id="wiz-start" type="date" value={f.schedule.startDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setF({...f, schedule: {...f.schedule, startDate: e.target.value}})} />
              </Field>
            </div>
            <div className="field">
              <span className="field-label">Before posting</span>
              <div className="radio-cards" role="radiogroup">
                <button type="button" role="radio" aria-checked={f.reviewMode === "review"} className={f.reviewMode === "review" ? "on" : ""} onClick={() => setF({...f, reviewMode: "review"})}>
                  <b>Let me review</b>
                  <span className="dim small">You approve each script, then each video. Recommended while you're starting out.</span>
                </button>
                <button type="button" role="radio" aria-checked={f.reviewMode === "auto"} className={f.reviewMode === "auto" ? "on" : ""} onClick={() => setF({...f, reviewMode: "auto"})}>
                  <b>Fully automatic</b>
                  <span className="dim small">Frameo writes, makes and posts without asking. You can still check everything afterwards.</span>
                </button>
              </div>
            </div>
            {f.reviewMode === "review" ? (
              <Field label="If I haven't reviewed it by posting time">
                <select id="wiz-missed" value={f.missedPolicy} onChange={(e) => setF({...f, missedPolicy: e.target.value})}>
                  <option value="next">Move it to the next free slot</option>
                  <option value="skip">Skip it</option>
                  <option value="post">Post it anyway</option>
                </select>
              </Field>
            ) : null}
          </>
        ) : step === 3 ? (
          <>
            <h2 className="title-m">Where should it post?</h2>
            <div className="radio-cards">
              {[
                ["instagram", "Instagram Reels", c.instagram.configured],
                ["youtube", "YouTube Shorts", c.youtube.connected],
              ].map(([ch, label, ok]) => (
                <button key={ch} type="button" role="checkbox" aria-checked={f.channels.includes(ch)} className={f.channels.includes(ch) ? "on" : ""} onClick={() => toggleCh(ch)}>
                  <span className="row-gap"><Platform name={ch} /><b>{label}</b></span>
                  <span className={`small ${ok ? "ok-text" : "warn-text"}`}>{ok ? "Connected" : "Not connected yet. Videos will wait until you connect."}</span>
                </button>
              ))}
            </div>
            {state.user.role === "admin" && (!c.instagram.configured || !c.youtube.connected) ? (
              <p className="dim small">Connect accounts any time under <a href="#/settings/connections" target="_blank" rel="noreferrer">Settings → Connections</a>.</p>
            ) : null}
            <p className="note-box">Every video is labelled as AI-made, as Instagram and YouTube require for synthetic content.</p>
          </>
        ) : (
          <>
            <h2 className="title-m">Check and save</h2>
            <Field label="Pipeline name" hint="Only you see this.">
              <input id="wiz-name" value={f.name} onChange={(e) => setF({...f, name: e.target.value})} placeholder={f.seriesName || t?.series} />
            </Field>
            <div className="summary">
              <div><span className="mono dim">STYLE</span><b>{t?.name}</b><span className="dim small">{f.length} seconds · series "{f.seriesName || t?.series}"</span></div>
              <div><span className="mono dim">TOPICS</span><b>{topics.length} episodes</b><span className="dim small">First: {topics[0]}</span></div>
              <div><span className="mono dim">SCHEDULE</span><b>{scheduleText(f.schedule)}</b><span className="dim small">{f.reviewMode === "review" ? "You review each episode" : "Fully automatic"}</span></div>
              <div><span className="mono dim">POSTS TO</span><b className="row-gap">{f.channels.map((ch) => <Platform key={ch} name={ch} />)}</b></div>
            </div>
            <div className="cost-box">
              <div>
                <span className="mono dim">COST</span>
                <b>{perEp} credits per episode</b>
                <span className="dim small">About {perMonth} credits a month at this schedule. You have {state.user.credits}.</span>
              </div>
              {perMonth > state.user.credits ? <a className="btn" href="#/settings/plan" target="_blank" rel="noreferrer">See plans</a> : null}
            </div>
            <div className="field">
              <span className="field-label">First episodes</span>
              <ol className="first-eps">
                {slots.map((s, i) => (
                  <li key={s.toISOString()}>
                    <span className="mono">{fmtWhen(s.toISOString())}</span>
                    <span>{topics[i] || <span className="dim">No topic left. Add more topics.</span>}</span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>

      <div className="wiz-foot">
        {step > 0 ? <button className="btn" onClick={() => setStep(step - 1)}>Back</button> : <a className="btn" href="#/home">Cancel</a>}
        <span className="spacer" />
        {step < STEPS.length - 1 ? (
          <button className="btn primary big" onClick={next}>Continue</button>
        ) : (
          <button className="btn primary big" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save pipeline"}</button>
        )}
      </div>
    </div>
  );
}

// Free plan: pipelines are locked; point to single videos and plans.
function PipelineLocked({template}) {
  return (
    <div className="wizard">
      <div className="wiz-head">
        <a className="linkbtn" href="#/home">← Home</a>
        <div className="eyebrow mono">STARTER AND UP</div>
        <h1 className="title-l">Pipelines post for you</h1>
        <p className="lede">
          A pipeline takes a list of topics and a schedule, then writes, makes and posts every episode to Instagram and YouTube on time, without a watermark.
          Pipelines start on the Starter plan.
        </p>
      </div>
      <div className="upsell">
        <div>
          <b>On Free, you can still make videos</b>
          <span className="dim small">Make one video at a time, download it, and post it yourself.</span>
        </div>
        <span className="home-actions">
          <a className="btn" href={`#/create?template=${template}`}>Make a video</a>
          <a className="btn primary" href="#/settings/plan">See plans</a>
        </span>
      </div>
    </div>
  );
}
