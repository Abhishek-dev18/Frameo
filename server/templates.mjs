// The video styles users can pick, in the order they are shown. Each maps to a Remotion composition in src/Root.tsx.
// Credits follow real cost (1 credit ≈ ₹1): every style is 1 credit per 30 seconds,
// an AI voiceover adds 2 credits per 30 seconds (voice is the expensive part).
export const TEMPLATES = [
  {
    id: "explainer-cards",
    name: "Explainer cards",
    series: "How it works",
    composition: "HowRagWorks",
    credits: 1,
    blurb: "Step-by-step animated diagrams with a progress tracker. Clean and fast to watch.",
    best: "Concepts, interview questions",
    preview: "/samples/explainer-cards.mp4",
    characters: [],
  },
  {
    id: "kahaani",
    name: "Character story",
    series: "Tech Kahaani",
    composition: "RagStory",
    credits: 1,
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
    credits: 1,
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
    credits: 1,
    blurb: "Full anime episode: close-ups, split-screen eyes, a sword clash and a cliffhanger.",
    best: "Story channels, drama",
    preview: "/samples/anime-action.mp4",
    characters: ["Aya", "Rival"],
  },
];

export const getTemplate = (tid) => TEMPLATES.find((t) => t.id === tid);
// 30s: 1 credit (3 with voice) · 60s: 2 credits (6 with voice). Real cost ≈ ₹1.1 / ₹3.1 / ₹1.8 / ₹5.5.
export const VOICE_CREDITS = 2; // per 30 seconds
export const costOf = (tid, length = 30, voice = false) => {
  const m = length >= 60 ? 2 : 1;
  return (getTemplate(tid)?.credits || 1) * m + (voice ? VOICE_CREDITS * m : 0);
};
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
