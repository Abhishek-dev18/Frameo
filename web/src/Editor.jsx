import React, {useEffect, useState} from "react";
import {api, fmtWhen, relative, toLocalInput, fromLocalInput} from "./api.js";
import {Platform, Field, Progress} from "./ui.jsx";

const STATUS_TEXT = {
  draft: "Draft · not scheduled",
  scheduled: "Scheduled",
  posting: "Posting now",
  posted: "Posted",
  failed: "Failed",
};

export default function Editor({episode, initialAt, state, onClose, onCreated, refresh, toast}) {
  const isNew = !episode;
  const [form, setForm] = useState(() => ({
    title: episode?.title || "",
    composition: episode?.composition || state.compositions.find((c) => c === "MidnightDeploy") || state.compositions[0] || "",
    caption: episode?.caption || "",
    tags: (episode?.tags || []).join(", "),
    platforms: episode?.platforms || ["instagram", "youtube"],
    at: toLocalInput(episode?.at || initialAt),
  }));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({...f, [k]: e.target.value}));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const payload = () => ({
    title: form.title.trim(),
    composition: form.composition,
    caption: form.caption,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    platforms: form.platforms,
    at: fromLocalInput(form.at),
  });

  const dirty =
    !isNew &&
    (form.title !== episode.title ||
      form.composition !== episode.composition ||
      form.caption !== episode.caption ||
      form.tags !== (episode.tags || []).join(", ") ||
      form.platforms.join() !== episode.platforms.join() ||
      form.at !== toLocalInput(episode.at));

  async function run(fn, ok) {
    setBusy(true);
    try {
      const r = await fn();
      if (ok) toast(ok, "good");
      await refresh();
      return r;
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  }

  const check = () => {
    if (!form.title.trim()) throw new Error("Give the episode a title");
    if (!form.platforms.length) throw new Error("Pick at least one place to post");
  };
  const saveFirst = async () => {
    check();
    if (dirty) await api.updateEpisode(episode.id, payload());
  };

  const create = (schedule) =>
    run(async () => {
      check();
      if (schedule && !form.at) throw new Error("Pick a day and time first");
      const ep = await api.createEpisode({...payload(), status: schedule ? "scheduled" : "draft"});
      onCreated(ep);
      return ep;
    }, schedule ? `Scheduled for ${fmtWhen(fromLocalInput(form.at))}` : "Saved as a draft");

  const save = () => run(saveFirst, "Saved");
  const schedule = () =>
    run(async () => {
      if (!form.at) throw new Error("Pick a day and time first");
      await saveFirst();
      return api.updateEpisode(episode.id, {status: "scheduled"});
    }, `Scheduled for ${fmtWhen(fromLocalInput(form.at))}`);
  const unschedule = () => run(() => api.updateEpisode(episode.id, {status: "draft"}), "Unscheduled. It's a draft again.");
  const preview = () =>
    run(async () => {
      await saveFirst();
      return api.render(episode.id);
    }, "Making the preview. This takes a few minutes.");
  const postNow = () =>
    run(async () => {
      await saveFirst();
      return api.post(episode.id);
    }, "Posting started");
  const remove = () => {
    if (!window.confirm(`Delete "${episode.title}"?`)) return;
    run(() => api.deleteEpisode(episode.id), "Episode deleted").then(onClose);
  };

  const togglePlatform = (p) =>
    setForm((f) => ({...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p]}));

  const job = episode?.job;
  const running = job?.state === "running" || episode?.status === "posting";
  const posted = episode?.status === "posted";
  const c = state.connections;
  const missing = form.platforms.filter((p) => (p === "instagram" ? !(c.instagram.configured && c.storage.configured) : !c.youtube.connected));

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={isNew ? "New episode" : episode.title}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow mono">{isNew ? "NEW EPISODE" : `${episode.id.toUpperCase()} · ${(STATUS_TEXT[episode.status] || episode.status).toUpperCase()}`}</div>
            <h2 className="title-m">{isNew ? "New episode" : episode.title}</h2>
          </div>
          <button className="icobtn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="drawer-body">
          {!isNew ? (
            <div className="preview">
              {episode.videoUrl && !(job?.state === "running" && job.type === "render") ? (
                <video key={episode.videoUrl} src={episode.videoUrl} controls playsInline />
              ) : (
                <div className="preview-empty">
                  <span className="frame-icon" aria-hidden="true" />
                  <b>{job?.state === "running" ? "Making the preview…" : "No preview yet"}</b>
                  {job?.state !== "running" ? <button className="btn" onClick={preview} disabled={busy}>Make preview</button> : null}
                </div>
              )}
              {job ? <Progress job={job} /> : null}
              {episode.videoUrl && job?.state !== "running" ? (
                <button className="linkbtn" onClick={preview} disabled={busy}>Remake preview</button>
              ) : null}
            </div>
          ) : null}

          {episode?.status === "failed" && episode.error ? (
            <div className="alert">
              <b>Couldn't post.</b> {episode.error}
            </div>
          ) : null}

          {episode?.results ? (
            <div className="results">
              {Object.entries(episode.results).map(([p, r]) => (
                <a key={p} href={r.url || "#"} target="_blank" rel="noreferrer" className="result">
                  <Platform name={p} /> Live on {p === "instagram" ? "Instagram" : "YouTube"} <span className="mono">↗</span>
                </a>
              ))}
            </div>
          ) : null}

          <Field label="Title">
            <input value={form.title} onChange={set("title")} placeholder="Ep 2: The Cache That Lied" maxLength={100} />
          </Field>

          <Field label="Story" hint="The animated video template this episode uses.">
            <select value={form.composition} onChange={set("composition")}>
              {state.compositions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </Field>

          <Field label="Caption" counter={<span className={form.caption.length > 2200 ? "bad" : ""}>{form.caption.length}/2200</span>}>
            <textarea rows={6} value={form.caption} onChange={set("caption")} placeholder="What viewers read under the video. Add hashtags at the end." />
          </Field>

          <div className="field">
            <span className="field-label">Post to</span>
            <div className="choices">
              {["instagram", "youtube"].map((p) => (
                <button key={p} type="button" className={form.platforms.includes(p) ? "on" : ""} aria-pressed={form.platforms.includes(p)} onClick={() => togglePlatform(p)}>
                  <Platform name={p} /> {p === "instagram" ? "Instagram" : "YouTube"}
                </button>
              ))}
            </div>
            {missing.length ? (
              <span className="field-hint warn">
                {missing.map((p) => (p === "instagram" ? "Instagram" : "YouTube")).join(" and ")} {missing.length > 1 ? "aren't" : "isn't"} connected yet. <a href="#/settings" onClick={onClose}>Connect</a>
              </span>
            ) : null}
          </div>

          <Field label="When" hint={form.at ? relative(fromLocalInput(form.at)) : "Leave empty to keep it as a draft."}>
            <input type="datetime-local" value={form.at} onChange={set("at")} />
          </Field>

          <details className="more">
            <summary>More options</summary>
            <Field label="YouTube tags" hint="Separate with commas.">
              <input value={form.tags} onChange={set("tags")} placeholder="jwt, backend, javascript" />
            </Field>
          </details>
        </div>

        <div className="drawer-foot">
          {isNew ? (
            <>
              <button className="btn" onClick={() => create(false)} disabled={busy}>Save draft</button>
              <span className="spacer" />
              <button className="btn primary" onClick={() => create(true)} disabled={busy || !form.at}>Schedule</button>
            </>
          ) : posted ? (
            <>
              <button className="linkbtn danger" onClick={remove} disabled={busy}>Delete</button>
              <span className="spacer" />
              <button className="btn" onClick={save} disabled={busy || !dirty}>{dirty ? "Save" : "Saved"}</button>
            </>
          ) : (
            <>
              <button className="linkbtn danger" onClick={remove} disabled={busy || running}>Delete</button>
              <span className="spacer" />
              {dirty ? <button className="btn" onClick={save} disabled={busy}>Save</button> : null}
              <button className="btn" onClick={postNow} disabled={busy || running}>Post now</button>
              {episode.status === "scheduled" ? (
                <button className="btn primary" onClick={unschedule} disabled={busy || running}>Unschedule</button>
              ) : (
                <button className="btn primary" onClick={schedule} disabled={busy || running || !form.at}>Schedule</button>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
