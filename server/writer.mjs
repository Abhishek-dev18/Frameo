// Writes an episode's script from a topic.
// With GEMINI_API_KEY set, Gemini writes it. Without a key, a simple placeholder script is used.
import {getTemplate} from "./templates.mjs";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function fallback(topic, pipeline, user) {
  const tag = (user.profile?.niche || "tech").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return {
    title: topic,
    hook: `Everyone gets this wrong: ${topic}.`,
    lines: [`Tonight's problem: ${topic}.`, "Here's what actually happens.", "And here's the one-line fix.", "Follow for the next episode."],
    caption: `${topic}\n\nFollow ${user.profile?.handle || ""} for a new episode every week.\n\n#${tag || "tech"} #programming #softwareengineering`.replace(/\n\n+#/, "\n\n#"),
    ytTitle: topic.slice(0, 90),
    ytDescription: `${topic}\n\n#Shorts`,
    hashtags: [tag || "tech", "programming", "softwareengineering"],
    writtenBy: "placeholder",
  };
}

export async function writeScript(topic, pipeline, user) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return fallback(topic, pipeline, user);
  const t = getTemplate(pipeline.template);
  const prompt = `You write scripts for short vertical videos (${pipeline.length || 30} seconds) for the channel "${user.profile?.channelName || "a tech channel"}" (niche: ${user.profile?.niche || "tech and AI"}).
Style: ${t?.name} — ${t?.blurb}${t?.characters?.length ? ` Characters: ${t.characters.join(" and ")}.` : ""}
Language: ${pipeline.language || "English"}.
Topic: ${topic}

Rules: technically correct; one clear takeaway; short spoken lines (max 12 words each); no emojis in lines.
Return JSON with keys: title (max 60 chars), hook (first line, grabs attention), lines (array of 5-8 subtitle lines in order), caption (Instagram caption, 2-4 short paragraphs, ending with 5-8 hashtags), ytTitle (max 90 chars), ytDescription (2-3 sentences), hashtags (array of words without #).`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({contents: [{parts: [{text: prompt}]}], generationConfig: {responseMimeType: "application/json", temperature: 0.8}}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Script writer (Gemini): ${data.error?.message || res.statusText}`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let s;
  try {
    s = JSON.parse(text);
  } catch {
    throw new Error("Script writer returned something that wasn't valid JSON. Try regenerating.");
  }
  if (!s.title || !Array.isArray(s.lines) || !s.caption) throw new Error("Script writer left out the title, lines or caption. Try regenerating.");
  return {...s, ytDescription: `${s.ytDescription || ""}\n\n#Shorts`.trim(), writtenBy: MODEL};
}
