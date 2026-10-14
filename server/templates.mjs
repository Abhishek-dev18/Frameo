// The video styles users can pick, in the order they are shown. Each maps to a Remotion composition in src/Root.tsx.
// credits = price of one 30-second video in this style (each template has its own).
// 60 seconds = double, minus 1 for styles of 2+ credits (a 60s video costs us ~1.75x a 30s one:
// the script is one call, only rendering and voice double). An AI voiceover adds 2 credits per 30s.
export const TEMPLATES = [
  {
    id: "explainer-cards",
    name: "Explainer cards",
    series: "How it works",
    composition: "Screenplay",
    screenplay: true, // the writer produces scenes of blocks (src/screenplay) instead of fixed lines
    credits: 1,
    blurb: "Animated diagrams, code, logs and cheat sheets in a clean, minimal look. Every video is laid out for its topic.",
    best: "Concepts, interview questions",
    preview: "/samples/explainer-cards.mp4",
    characters: [],
  },
  {
    id: "kahaani",
    name: "Character story",
    series: "Tech Kahaani",
    composition: "RagStory",
    credits: 2,
    blurb: "Two cute characters act out the idea as a mini story, with stamps and flying props.",
    best: "Beginner-friendly explainers",
    preview: "/samples/kahaani.mp4",
    characters: ["Bot", "Retriever"],
  },
  {
    id: "midnight-deploy",
    name: "Anime story",
    series: "Midnight Deploy",
    composition: "MidnightDeploy",
    credits: 2,
    blurb: "A developer and his AI drone fix a real bug before sunrise. Letterbox, impact words, real code.",
    best: "Bugs, outages, security stories",
    preview: "/samples/midnight-deploy.mp4",
    characters: ["Kai", "Byte"],
  },
  {
    id: "anime-action",
    name: "Anime action",
    series: "The Last Blade",
    composition: "LastBlade",
    credits: 4,
    blurb: "Full anime episode: close-ups, split-screen eyes, a sword clash and a cliffhanger.",
    best: "Story channels, drama",
    preview: "/samples/anime-action.mp4",
    characters: ["Aya", "Rival"],
  },
];

export const getTemplate = (tid) => TEMPLATES.find((t) => t.id === tid);
// Explainer 1/2 · Character story 2/3 · Anime story 2/3 · Anime action 4/7 (30s/60s), +2/+4 with voice.
export const VOICE_CREDITS = 2; // per 30 seconds
export const baseCredits = (base, length = 30) => (length >= 60 ? (base >= 2 ? base * 2 - 1 : base * 2) : base);
export const costOf = (tid, length = 30, voice = false) =>
  baseCredits(getTemplate(tid)?.credits || 1, length) + (voice ? VOICE_CREDITS * (length >= 60 ? 2 : 1) : 0);
// Voiceover languages (Sarvam Bulbul). The voice pipeline is not built yet; until it is, VOICE_READY stays false
// and requests for a voice are treated as silent videos (and charged as silent).
export const LANGUAGES = ["English", "Hindi", "Hinglish"];
export const VOICE_READY = false;

// What each plan can do. Free makes one video at a time to download (watermarked) and
// upload by hand; pipelines (scheduled auto-posting) start on Starter.
export const PLANS = {
  free: {name: "Free", price: 0, credits: 30, monthly: false, pipelines: 0, watermark: true},
  starter: {name: "Starter", price: 499, credits: 90, monthly: true, pipelines: 1, watermark: false},
  creator: {name: "Creator", price: 999, credits: 225, monthly: true, pipelines: 5, watermark: false},
  pro: {name: "Pro", price: 2499, credits: 600, monthly: true, pipelines: Infinity, watermark: false},
};
export const planOf = (user) => PLANS[user?.plan] || PLANS.free;
