import React, {useCallback, useEffect, useState} from "react";
import {api, fmtWhen, relative} from "../api.js";
import {Stage, Field, RenderBar, Platform} from "../ui.jsx";

const toForm = (s, title) => ({
  title: s?.title || title || "",
  hook: s?.hook || "",
  lines: (s?.lines || []).join("\n"),
  caption: s?.caption || "",
  ytTitle: s?.ytTitle || "",
});

export default function Review({id, toast, refresh}) {
  const [ep, setEp] = useState(null);
  const [form, setForm] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const e = await api.episode(id);
      setEp(e);
      setForm((f) => (f && dirty ? f : toForm(e.script, e.title)));
    } catch (err) {
      toast(err.message, "bad");
    }
  }, [id, toast, dirty]);
  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [load]);

  if (!ep || !form) return <div className="loading mono">LOADING…</div>;
  const set = (k) => (e) => {
    setForm({...form, [k]: e.target.value});
    setDirty(true);
  };
  const scriptPatch = () => ({
    script: {
      title: form.title.trim(),
      hook: form.hook.trim(),
      lines: form.lines.split("\n").map((x) => x.trim()).filter(Boolean),
      caption: form.caption,
      ytTitle: form.ytTitle.trim(),
    },
  });

  async function act(action, ok) {
    setBusy(true);
    try {
      if (dirty) await api.updateEpisode(ep.id, scriptPatch());
      setDirty(false);
      if (action) await api.act(ep.id, action);
      if (ok) toast(ok, "good");
      await load();
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  }

  const s = ep.stage;
  const editable = ["script_review", "video_review", "scheduled", "failed"].includes(s);
  const captionOnly = s !== "script_review" && s !== "failed";

  return (
    <div className="review">
      <a className="linkbtn" href={`#/pipelines/${ep.pipelineId}`}>← {ep.pipelineName}</a>
      <div className="rv-head">
        <div>
          <div className="eyebrow mono">EPISODE {ep.number} · AIRS {fmtWhen(ep.at).toUpperCase()} · {relative(ep.at).toUpperCase()}</div>
          <h1 className="title-l">{ep.title}</h1>
          <div className="row-gap"><Stage stage={s} /><span className="dim small">Topic: {ep.topic}</span></div>
        </div>
      </div>

      <div className="rv-grid">
        <div className="rv-video">
          {ep.videoUrl && s !== "rendering" ? (
            <video key={ep.videoUrl} src={ep.videoUrl} controls playsInline />
          ) : (
            <div className="preview-empty tall">
              <span className="frame-icon" aria-hidden="true" />
              <b>{s === "writing" ? "Writing the script…" : s === "script_review" ? "Approve the script to make the video" : s === "render_queued" ? "Waiting to make the video…" : s === "rendering" ? "Making the video…" : "No video"}</b>
              {s === "rendering" ? <RenderBar progress={ep.progress ?? 0} /> : null}
              {s === "render_queued" && ep.error === "credits" ? <a className="btn small" href="#/settings/plan">Not enough credits · see plans</a> : null}
            </div>
          )}
          <p className="dim small ai-label">Labelled "Made with AI" when posted.</p>
        </div>

        <div className="rv-side">
          {s === "failed" ? <div className="alert"><b>This episode failed.</b> {ep.error}</div> : null}
          {Object.keys(ep.results || {}).length ? (
            <div className="results">
              {Object.entries(ep.results).map(([p, r]) => (
                <a key={p} href={r.url || "#"} target="_blank" rel="noreferrer" className="result"><Platform name={p} /> Live on {p === "instagram" ? "Instagram" : "YouTube"} <span className="mono">↗</span></a>
              ))}
            </div>
          ) : null}

          {s === "writing" ? (
            <div className="panel"><b>Frameo is writing this script.</b><span className="dim small">It usually takes under a minute. You'll be notified when it's ready.</span></div>
          ) : (
            <div className="panel">
              <div className="rv-tabs mono">{captionOnly ? "POST TEXT" : "SCRIPT"}</div>
              {!captionOnly ? (
                <>
                  <Field label="Title"><input id="rv-title" value={form.title} onChange={set("title")} maxLength={80} disabled={!editable} /></Field>
                  <Field label="Opening line" hint="The first thing viewers read. Make it grab attention."><input id="rv-hook" value={form.hook} onChange={set("hook")} disabled={!editable} /></Field>
                  <Field label="Subtitle lines" hint="One per line, in order.">
                    <textarea id="rv-lines" rows={7} value={form.lines} onChange={set("lines")} disabled={!editable} />
                  </Field>
                </>
              ) : null}
              <Field label="Instagram caption" counter={`${form.caption.length}/2200`}>
                <textarea id="rv-caption" rows={6} value={form.caption} onChange={set("caption")} disabled={!editable} />
              </Field>
              <Field label="YouTube title"><input id="rv-yt" value={form.ytTitle} onChange={set("ytTitle")} maxLength={100} disabled={!editable} /></Field>
              {ep.script?.writtenBy === "placeholder" ? <p className="small warn-text">Written without AI (no AI key yet). Edit it, or add a Gemini key in Settings → Connections and rewrite.</p> : null}
            </div>
          )}

          <div className="rv-actions">
            {s === "script_review" ? (
              <>
                <button className="btn primary big" disabled={busy} onClick={() => act("approveScript", "Script approved. Making the video now.")}>Approve script</button>
                <button className="btn" disabled={busy} onClick={() => act("rewrite", "Rewriting the script…")}>Rewrite</button>
              </>
            ) : null}
            {s === "video_review" ? (
              <>
                <button className="btn primary big" disabled={busy} onClick={() => act("approveVideo", `Approved. Posts ${relative(ep.at)}.`)}>Approve video</button>
                <button className="btn" disabled={busy} onClick={() => act("postNow", "Posting now…")}>Post now</button>
                <button className="btn" disabled={busy} onClick={() => act("remake", "Remaking the video…")}>Remake video</button>
              </>
            ) : null}
            {s === "scheduled" ? (
              <>
                {dirty ? <button className="btn primary" disabled={busy} onClick={() => act(null, "Saved")}>Save changes</button> : null}
                <button className="btn" disabled={busy} onClick={() => act("postNow", "Posting now…")}>Post now</button>
              </>
            ) : null}
            {s === "failed" ? <button className="btn primary big" disabled={busy} onClick={() => act("retry", "Trying again…")}>Try again</button> : null}
            {!["posted", "posting", "rendering", "skipped"].includes(s) ? (
              <button className="linkbtn danger" disabled={busy} onClick={() => window.confirm("Skip this episode? It won't be posted.") && act("skip", "Skipped")}>Skip episode</button>
            ) : null}
          </div>
          {s === "scheduled" ? <p className="dim small">Approved. Posts automatically {relative(ep.at)} if the pipeline is live.</p> : null}
        </div>
      </div>
    </div>
  );
}
