import React from "react";

// Edits the on-screen text of a screenplay, scene by scene. The layout (block types, order, timing)
// stays as written; only the words change. *word* = green highlight, !word! = coral.
const KIND = {
  headline: "Big text",
  flow: "Diagram",
  code: "Code",
  compare: "Comparison",
  diff: "Code change",
  stat: "Number",
  steps: "Steps",
  cheatsheet: "Cheat sheet",
  log: "Log",
  next: "Next video teaser",
};

// [label, get, set, multiline]
const FIELDS = {
  headline: [["Small line", (b) => b.lead || "", (b, v) => ({...b, lead: v})], ["Big text", (b) => b.text, (b, v) => ({...b, text: v})]],
  flow: [["Title", (b) => b.title || "", (b, v) => ({...b, title: v})], ["Boxes (one per line)", (b) => b.nodes.map((n) => n.label).join("\n"), (b, v) => ({...b, nodes: b.nodes.map((n, i) => ({...n, label: v.split("\n")[i] ?? n.label}))}), true]],
  code: [["File name", (b) => b.file || "", (b, v) => ({...b, file: v})], ["Code", (b) => b.lines.join("\n"), (b, v) => ({...b, lines: v.split("\n").slice(0, 6)}), true], ["Circle this text", (b) => b.mark || "", (b, v) => ({...b, mark: v})]],
  compare: [
    ["Title", (b) => b.title || "", (b, v) => ({...b, title: v})],
    ["Left value", (b) => b.left.value, (b, v) => ({...b, left: {...b.left, value: v}})],
    ["Left label", (b) => b.left.label, (b, v) => ({...b, left: {...b.left, label: v}})],
    ["Right value", (b) => b.right.value, (b, v) => ({...b, right: {...b.right, value: v}})],
    ["Right label", (b) => b.right.label, (b, v) => ({...b, right: {...b.right, label: v}})],
  ],
  diff: [["Old line", (b) => b.minus, (b, v) => ({...b, minus: v})], ["New line", (b) => b.plus, (b, v) => ({...b, plus: v})]],
  stat: [["Number", (b) => b.value, (b, v) => ({...b, value: v})], ["Label", (b) => b.label, (b, v) => ({...b, label: v})]],
  steps: [["Title", (b) => b.title || "", (b, v) => ({...b, title: v})], ["Steps (one per line)", (b) => b.items.join("\n"), (b, v) => ({...b, items: v.split("\n").slice(0, 5)}), true]],
  cheatsheet: [["Title", (b) => b.title, (b, v) => ({...b, title: v})], ["Rows (term — meaning)", (b) => b.rows.map((r) => `${r.k} — ${r.v}`).join("\n"), (b, v) => ({...b, rows: v.split("\n").slice(0, 6).map((l) => {
    const [k, ...rest] = l.split(/\s+[—-]\s+/);
    return {k: k || "", v: rest.join(" — ")};
  })}), true]],
  log: [["Lines (start with ERROR, WARN or INFO)", (b) => b.lines.join("\n"), (b, v) => ({...b, lines: v.split("\n").slice(0, 5)}), true]],
  next: [["Teaser", (b) => b.text, (b, v) => ({...b, text: v})]],
};

export default function ScreenplayEditor({value, onChange, disabled}) {
  const setBlock = (si, bi, nb) => onChange({...value, scenes: value.scenes.map((s, i) => (i !== si ? s : {...s, blocks: s.blocks.map((b, j) => (j === bi ? nb : b))}))});
  const setSection = (si, section) => onChange({...value, scenes: value.scenes.map((s, i) => (i === si ? {...s, section} : s))});
  return (
    <div className="sp-editor">
      <p className="dim small">What appears on screen, scene by scene. Wrap a word in *stars* to make it green, or in !marks! for red.</p>
      {value.scenes.map((sc, si) => (
        <div key={si} className="sp-scene">
          <div className="sp-scene-head">
            <span className="mono dim">SCENE {si + 1} · {sc.seconds}s</span>
            <input aria-label={`Scene ${si + 1} label`} value={sc.section} onChange={(e) => setSection(si, e.target.value)} disabled={disabled} maxLength={22} />
          </div>
          {sc.blocks.map((b, bi) => (
            <div key={bi} className="sp-block">
              <span className="mono small accent">{KIND[b.type] || b.type}</span>
              {(FIELDS[b.type] || []).map(([label, get, put, multi]) => (
                <label key={label} className="sp-field">
                  <span className="small dim">{label}</span>
                  {multi ? (
                    <textarea rows={Math.min(6, Math.max(2, get(b).split("\n").length))} value={get(b)} onChange={(e) => setBlock(si, bi, put(b, e.target.value))} disabled={disabled} className={b.type === "code" || b.type === "log" ? "mono" : ""} />
                  ) : (
                    <input value={get(b)} onChange={(e) => setBlock(si, bi, put(b, e.target.value))} disabled={disabled} />
                  )}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
