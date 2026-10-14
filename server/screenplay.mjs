// Screenplay checks shared by the writer and the review editor.
// The composition (src/screenplay) trusts what it gets, so everything is cleaned here:
// known block types only, text clamped, 3–6 scenes, 1–3 blocks each, seconds fitted to the video length.

const ICONS = ["user", "phone", "server", "db", "cloud", "cache", "x", "check"];
const TYPES = ["headline", "flow", "code", "compare", "diff", "stat", "steps", "cheatsheet", "log", "next"];
const str = (v, n) => {
  const t = String(v ?? "").replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.lastIndexOf(" ", n);
  return (cut > n * 0.6 ? t.slice(0, cut) : t.slice(0, n)).replace(/[\s,;:.-]+$/, "");
};
const code = (v, n) => String(v ?? "").replace(/\t/g, "  ").replace(/\s+$/, "").slice(0, n);
const arr = (v, n) => (Array.isArray(v) ? v.slice(0, n) : []);
const side = (s) => ({label: str(s?.label, 18), value: str(s?.value, 10), ...(s?.note ? {note: str(s.note, 22)} : {})});

export function cleanBlock(b) {
  if (!b || !TYPES.includes(b.type)) return null;
  switch (b.type) {
    case "headline": {
      const text = str(b.text, 60);
      return text ? {type: "headline", ...(b.lead ? {lead: str(b.lead, 40)} : {}), text} : null;
    }
    case "flow": {
      const nodes = arr(b.nodes, 4).map((n) => ({label: str(n?.label, 12), icon: ICONS.includes(n?.icon) ? n.icon : "server"})).filter((n) => n.label);
      if (nodes.length < 2) return null;
      const bad = Number.isInteger(b.bad) && b.bad > 0 && b.bad < nodes.length ? b.bad : undefined;
      return {type: "flow", title: str(b.title || "flow", 28), nodes, ...(bad !== undefined ? {bad} : {})};
    }
    case "code": {
      const lines = arr(b.lines, 6).map((l) => code(l, 40));
      if (!lines.some(Boolean)) return null;
      const mark = b.mark && lines.some((l) => l.includes(b.mark)) ? str(b.mark, 30) : undefined;
      return {type: "code", file: str(b.file || "code", 28), lines, tag: ["BUG", "FIX", "INFO"].includes(b.tag) ? b.tag : "INFO", ...(mark ? {mark} : {})};
    }
    case "compare":
      if (!b.left?.value || !b.right?.value) return null;
      return {type: "compare", title: str(b.title || "compare", 28), symbol: str(b.symbol || "≠", 2), left: side(b.left), right: side(b.right)};
    case "diff":
      if (!b.minus || !b.plus) return null;
      return {type: "diff", file: str(b.file || "git diff", 28), minus: code(b.minus, 38), plus: code(b.plus, 38)};
    case "stat":
      if (!b.value) return null;
      return {type: "stat", value: str(b.value, 9), label: str(b.label, 40), tone: b.tone === "good" ? "good" : "bug"};
    case "steps": {
      const items = arr(b.items, 5).map((x) => str(x, 34)).filter(Boolean);
      return items.length ? {type: "steps", title: str(b.title || "steps", 28), items} : null;
    }
    case "cheatsheet": {
      const rows = arr(b.rows, 6).map((r) => ({k: str(r?.k, 18), v: str(r?.v, 22)})).filter((r) => r.k);
      return rows.length ? {type: "cheatsheet", title: str(b.title || "cheat sheet", 24), rows} : null;
    }
    case "log": {
      const lines = arr(b.lines, 5).map((x) => str(x, 38)).filter(Boolean);
      return lines.length ? {type: "log", title: str(b.title || "prod — logs", 28), lines} : null;
    }
    case "next": {
      const text = str(b.text, 48);
      return text ? {type: "next", text} : null;
    }
  }
  return null;
}

// Rough reading time for a block, used to share out the video's length between scenes.
const weight = (b) =>
  ({
    headline: () => 2 + (b.text || "").split(" ").length / 3.5,
    stat: () => 2.5,
    flow: () => 2.5 + b.nodes.length * 0.6,
    code: () => 1.5 + b.lines.length * 0.9,
    diff: () => 3.5,
    compare: () => 3.5,
    steps: () => 1.5 + b.items.length,
    log: () => 1.5 + b.lines.length * 0.9,
    cheatsheet: () => 2 + b.rows.length,
    next: () => 2.5,
  })[b.type]?.() || 3;

export function cleanScreenplay(sp, length = 30) {
  const scenes = arr(sp?.scenes, 6)
    .map((s) => ({section: str(s?.section || "", 22) || "Part", blocks: arr(s?.blocks, 3).map(cleanBlock).filter(Boolean)}))
    .filter((s) => s.blocks.length);
  if (scenes.length < 2) throw new Error("The screenplay needs at least two scenes with content.");
  // the first block must be readable at frame 0 — prefer a headline or stat up front
  const total = Math.max(15, Math.min(90, Number(length) || 30));
  const w = scenes.map((s) => s.blocks.reduce((t, b) => t + weight(b), 0));
  const sum = w.reduce((a, b) => a + b, 0);
  let left = total;
  scenes.forEach((s, i) => {
    const sec = i === scenes.length - 1 ? left : Math.max(3, Math.round((w[i] / sum) * total * 2) / 2);
    s.seconds = Math.max(3, sec);
    left -= s.seconds;
  });
  return {title: str(sp?.title, 60) || "Untitled", scenes};
}

// Plain subtitle-ish lines from a screenplay, used where a list of lines is still shown.
export const linesOf = (sp) =>
  (sp?.scenes || []).flatMap((s) => s.blocks.map((b) => (b.text || b.label || b.title || "").replace(/[*!]/g, "")).filter(Boolean)).slice(0, 10);

// Without an AI key: a simple, valid screenplay built from the topic alone.
export function fallbackScreenplay(topic, length = 30) {
  const t = str(topic, 50) || "Today's topic";
  return cleanScreenplay(
    {
      title: t,
      scenes: [
        {section: "Today", blocks: [{type: "headline", lead: "Most people get this wrong:", text: `*${t}*`}]},
        {section: "How it works", blocks: [{type: "flow", title: "the idea", nodes: [{label: "input", icon: "user"}, {label: "process", icon: "server"}, {label: "result", icon: "check"}]}]},
        {section: "Step by step", blocks: [{type: "steps", title: t.slice(0, 28), items: ["Start with the problem", "See what actually happens", "Apply the one-line fix"]}]},
        {section: "Remember", blocks: [{type: "cheatsheet", title: "quick recap", rows: [{k: "what", v: t.slice(0, 22)}, {k: "why", v: "it saves you time"}, {k: "next", v: "try it today"}]}, {type: "next", text: "One more idea, next video"}]},
      ],
    },
    length,
  );
}

export const SCREENPLAY_GUIDE = `A screenplay is JSON: {"title": string, "scenes": Scene[]}.
Scene = {"section": short label (2-3 words), "blocks": 1-3 Block}. Use 4-5 scenes. Every scene should look different: vary block types.
Block types (keep every text short, they are shown on a phone screen):
- {"type":"headline","lead":"optional small line","text":"big text, max 6 words"}
- {"type":"stat","value":"900ms","label":"what the number means","tone":"bug"|"good"}
- {"type":"flow","title":"request path","nodes":[{"label":"api","icon":"user|phone|server|db|cloud|cache|x|check"}, ... 2-4 nodes],"bad":index of first broken node (optional)}
- {"type":"code","file":"auth.ts","lines":["max 6 lines, max 38 chars each"],"mark":"exact substring to circle","tag":"BUG"|"FIX"|"INFO"}
- {"type":"diff","file":"auth.ts","minus":"old line","plus":"new line"}
- {"type":"compare","title":"before vs after","symbol":"≠ or →","left":{"label":"..","value":"short"},"right":{"label":"..","value":"short"}}
- {"type":"steps","title":"..","items":["3-5 short steps"]}
- {"type":"log","title":"prod — logs","lines":["ERROR ...","WARN ...","INFO ..."]}
- {"type":"cheatsheet","title":"..","rows":[{"k":"term","v":"meaning"}, 3-5 rows]}
- {"type":"next","text":"teaser for the next video"}
In headline/label/steps text, wrap one key word in *stars* to highlight it green, or in !bangs! for a bug/danger word in coral.
Scene 1 must open with a headline or stat (the hook). The last scene should hold a cheatsheet and/or next block.`;
