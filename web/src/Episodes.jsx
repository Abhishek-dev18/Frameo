import React, {useEffect, useMemo, useState} from "react";
import {api, fmtWhen, relative, toLocalInput, fromLocalInput} from "./api.js";
import {Pill, Platform, Toggle, Field, Progress, Empty} from "./ui.jsx";

const FILTERS = [
  ["all", "All"],
  ["scheduled", "Queued"],
  ["draft", "Drafts"],
  ["posted", "Posted"],
  ["failed", "Failed"],
];

export default function Episodes({state, episodes, filter, setFilter, refresh, toast}) {
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => {
    const l = filter === "all" ? episodes : episodes.filter((e) => e.status === filter);
    return [...l].sort((a, b) => {
      if (!a.at) return 1;
      if (!b.at) return -1;
      return new Date(a.at) - new Date(b.at);
    });
  }, [episodes, filter]);

  const next = useMemo(
    () => episodes.filter((e) => e.status === "scheduled" && e.at).sort((a, b) => new Date(a.at) - new Date(b.at))[0],
    [episodes],
  );
  const count = (s) => episodes.filter((e) => e.status === s).length;
  const open = episodes.find((e) => e.id === openId);

  return (
    <>
      <div className="crumb mono">
        {state.channel.name.toUpperCase()} / <b>{FILTERS.find((f) => f[0] === filter)?.[1]} episodes</b>
      </div>

      <div className={`hero ${state.scheduler.enabled ? "" : "hero-off"}`}>
        <div className="pulse">
          <i />
          {state.scheduler.enabled ? "ON AIR · POSTING AUTOMATICALLY" : "OFF AIR · NOTHING POSTS AUTOMATICALLY"}
        </div>
        {next ? (
          <>
            <div className="hero-k mono">NEXT UP</div>
            <button className="hero-title" onClick={() => setOpenId(next.id)}>{next.title}</button>
            <div className="hero-when">
              {fmtWhen(next.at)} <span className="dim">· {relative(next.at)}</span>
              <span className="hero-plats">{next.platforms.map((p) => <Platform key={p} name={p} />)}</span>
            </div>
          </>
        ) : (
          <div className="hero-title muted">No episodes queued</div>
        )}
        <div className="hrow">
          <div><span>QUEUED</span><b>{count("scheduled")}</b></div>
          <div><span>DRAFTS</span><b>{count("draft")}</b></div>
          <div><span>POSTED</span><b>{count("posted")}</b></div>
          <div><span>FAILED</span><b className={count("failed") ? "bad" : ""}>{count("failed")}</b></div>
        </div>
      </div>

      <div className="lbl-row">
        <div className="seg" role="tablist">
          {FILTERS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? "on" : ""} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>
        <button className="btn primary" onClick={() => setCreating(true)}>+ New episode</button>
      </div>

      {list.length === 0 ? (
        <Empty
          title={filter === "all" ? "No episodes yet" : "Nothing here"}
          action={filter === "all" ? <button className="btn primary" onClick={() => setCreating(true)}>Create your first episode</button> : null}
        >
          {filter === "all" ? "An episode is one video: pick a story template, write the caption, choose when it airs." : "Episodes with this status will show up here."}
        </Empty>
      ) : (
        <div className="ftable">
          <div className="fh">
            <div>EPISODE</div>
            <div>AIRS</div>
            <div>WHERE</div>
            <div>STATUS</div>
          </div>
          {list.map((e) => (
            <button key={e.id} className="fr" onClick={() => setOpenId(e.id)}>
              <div className="n">
                <div className="thumb">
                  {e.videoUrl ? <video src={`${e.videoUrl}#t=2`} muted preload="metadata" /> : <span className="mono">{e.id.toUpperCase()}</span>}
                </div>
                <div className="n-text">
                  <div className="t">{e.title}</div>
                  <div className="m mono">{e.id.toUpperCase()} · {e.composition}{e.rendered ? " · RENDERED" : ""}</div>
                  {e.job ? <Progress job={e.job} /> : e.status === "failed" && e.error ? <div className="row-error">{e.error}</div> : null}
                </div>
              </div>
              <div className="dt mono">
                {e.at ? fmtWhen(e.at) : "—"}
                {e.at && e.status === "scheduled" ? <span className="dim">{relative(e.at)}</span> : null}
              </div>
              <div className="plats">{e.platforms.map((p) => <Platform key={p} name={p} small />)}</div>
              <div><Pill status={e.status} /></div>
            </button>
          ))}
        </div>
      )}

      {open || creating ? (
        <Editor
          key={open?.id || "new"}
          episode={creating ? null : open}
          state={state}
          onClose={() => {
            setOpenId(null);
            setCreating(false);
          }}
          onCreated={(ep) => {
            setCreating(false);
            setOpenId(ep.id);
          }}
          refresh={refresh}
          toast={toast}
        />
      ) : null}
    </>
  );
}

function Editor({episode, state, onClose, onCreated, refresh, toast}) {
  const isNew = !episode;
  const [form, setForm] = useState(() => ({
    title: episode?.title || "",
    composition: episode?.composition || state.compositions[0] || "",
    caption: episode?.caption || "",
    tags: (episode?.tags || []).join(", "),
    platforms: episode?.platforms || ["instagram", "youtube"],
    at: toLocalInput(episode?.at),
  }));
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({...f, [k]: e?.target ? e.target.value : e}));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dirty =
    !isNew &&
    (form.title !== episode.title ||
      form.composition !== episode.composition ||
      form.caption !== episode.caption ||
      form.tags !== (episode.tags || []).join(", ") ||
      form.platforms.join() !== episode.platforms.join() ||
      form.at !== toLocalInput(episode.at));

  const payload = () => ({
    title: form.title.trim(),
    composition: form.composition,
    caption: form.caption,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    platforms: form.platforms,
    at: fromLocalInput(form.at),
  });

  const togglePlatform = (p) =>
    setForm((f) => ({...f, platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p]}));

  async function act(fn, ok) {
    setSaving(true);
    try {
      const r = await fn();
      if (ok) toast(ok, "good");
      await refresh();
      return r;
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setSaving(false);
    }
  }

  const save = () =>
    isNew
      ? act(async () => {
          if (!form.title.trim()) throw new Error("Give the episode a title");
          const ep = await api.createEpisode({...payload(), status: "draft"});
          onCreated(ep);
          return ep;
        }, "Episode created")
      : act(() => api.updateEpisode(episode.id, payload()), "Saved");

  const setQueued = (on) =>
    act(async () => {
      if (dirty) await api.updateEpisode(episode.id, payload());
      return api.updateEpisode(episode.id, {status: on ? "scheduled" : "draft"});
    }, on ? `Queued for ${fmtWhen(fromLocalInput(form.at))}` : "Moved back to drafts");

  const renderNow = () =>
    act(async () => {
      if (dirty) await api.updateEpisode(episode.id, payload());
      return api.render(episode.id);
    }, "Rendering started. This takes a few minutes.");

  const postNow = () =>
    act(async () => {
      if (dirty) await api.updateEpisode(episode.id, payload());
      return api.post(episode.id);
    }, "Posting started");

  const remove = () => {
    if (!window.confirm(`Delete "${episode.title}"? The rendered video file stays in the out folder.`)) return;
    act(() => api.deleteEpisode(episode.id), "Episode deleted").then(onClose);
  };

  const job = episode?.job;
  const running = job?.state === "running";
  const posted = episode?.status === "posted";
  const capLen = form.caption.length;
  const conn = state.connections;
  const missing = form.platforms.filter((p) => (p === "instagram" ? !(conn.instagram.configured && conn.storage.configured) : !conn.youtube.connected));

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-label={isNew ? "New episode" : episode.title}>
        <div className="drawer-head">
          <div>
            <div className="sheet-k mono">{isNew ? "NEW EPISODE" : `EPISODE · ${episode.id.toUpperCase()}`}</div>
            <h2>{isNew ? "Set up an episode" : episode.title}</h2>
          </div>
          {!isNew ? <Pill status={episode.status} /> : null}
          <button className="icobtn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="drawer-body">
          {!isNew ? (
            <div className="preview">
              {episode.videoUrl && !running ? (
                <video key={episode.videoUrl} src={episode.videoUrl} controls playsInline />
              ) : (
                <div className="preview-empty">
                  <div className="reticle"><span /><span /><span /><span /></div>
                  <div className="mono">{running ? job.step.toUpperCase() : "NOT RENDERED YET"}</div>
                  {!running ? <button className="btn" onClick={renderNow} disabled={saving}>Render preview</button> : null}
                </div>
              )}
              {job ? <Progress job={job} /> : null}
            </div>
          ) : null}

          {episode?.status === "failed" && episode.error ? (
            <div className="alert bad">
              <b>Last attempt failed.</b> {episode.error}
              <div className="dim">Fix the problem, then post again or re-queue it. Platforms that already succeeded are skipped.</div>
            </div>
          ) : null}

          {episode?.results ? (
            <div className="results">
              {Object.entries(episode.results).map(([p, r]) => (
                <a key={p} href={r.url || "#"} target="_blank" rel="noreferrer" className="result">
                  <Platform name={p} /> <span>Live on {p === "instagram" ? "Instagram" : "YouTube"}</span> <span className="mono dim">↗</span>
                </a>
              ))}
            </div>
          ) : null}

          <div className="lbl">STORY</div>
          <Field label="Title" hint="Used as the YouTube title. Keep it under 100 characters.">
            <input value={form.title} onChange={set("title")} placeholder="Midnight Deploy · Ep 2: The Cache That Lied" maxLength={100} />
          </Field>
          <Field label="Video template" hint="Which Remotion composition renders this episode. Changing it deletes the old render.">
            <select value={form.composition} onChange={set("composition")}>
              {state.compositions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <div className="lbl">POST</div>
          <Field label="Caption" counter={<span className={capLen > 2200 ? "bad" : ""}>{capLen} / 2200</span>} hint="Instagram caption and YouTube description. #Shorts is added for YouTube.">
            <textarea rows={7} value={form.caption} onChange={set("caption")} placeholder={"2:59 AM. 10,000 users logged out at once…\n\n#backend #programming"} />
          </Field>
          <Field label="YouTube tags" hint="Comma separated.">
            <input value={form.tags} onChange={set("tags")} placeholder="jwt, backend, javascript" />
          </Field>
          <div className="field">
            <span className="field-label">Post to</span>
            <div className="plat-pick">
              {["instagram", "youtube"].map((p) => (
                <button key={p} type="button" className={form.platforms.includes(p) ? "on" : ""} onClick={() => togglePlatform(p)} aria-pressed={form.platforms.includes(p)}>
                  <Platform name={p} /> {p === "instagram" ? "Instagram Reel" : "YouTube Short"}
                </button>
              ))}
            </div>
            {missing.length ? (
              <span className="field-hint warn">
                {missing.map((p) => (p === "instagram" ? "Instagram" : "YouTube")).join(" and ")} {missing.length > 1 ? "aren't" : "isn't"} connected yet. <a href="#/settings">Set up connections</a>
              </span>
            ) : null}
          </div>

          <div className="lbl">SCHEDULE</div>
          <Field label="Airs at" hint={form.at ? `${relative(fromLocalInput(form.at))} · your local time` : "Pick a date and time to queue this episode."}>
            <input type="datetime-local" value={form.at} onChange={set("at")} />
          </Field>
          {!isNew && !posted ? (
            <div className="queue-row">
              <div>
                <div className="queue-t">Queue for auto-post</div>
                <div className="dim small">
                  {state.scheduler.enabled ? "Posts automatically at the time above." : "Frameo is off air. Turn on ON AIR in the top bar for queued episodes to post."}
                </div>
              </div>
              <Toggle checked={episode.status === "scheduled"} onChange={setQueued} />
            </div>
          ) : null}
        </div>

        <div className="drawer-foot">
          {!isNew ? <button className="btn ghost danger" onClick={remove} disabled={saving || running}>Delete</button> : null}
          <span className="spacer" />
          {isNew ? (
            <button className="btn primary" onClick={save} disabled={saving}>Create episode</button>
          ) : (
            <>
              <button className="btn" onClick={save} disabled={saving || !dirty}>{dirty ? "Save changes" : "Saved"}</button>
              {!posted ? (
                <button className="btn primary" onClick={postNow} disabled={saving || running || !form.platforms.length}>Post now</button>
              ) : null}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
