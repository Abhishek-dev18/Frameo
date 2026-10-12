// The video styles users can pick. Each maps to a Remotion composition in src/Root.tsx.
// credits = cost of one 30-second episode (60 seconds costs double).
export const TEMPLATES = [
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
    credits: 2,
    blurb: "Two cute characters act out the idea as a mini story, with stamps and flying props.",
    best: "Beginner-friendly explainers",
    preview: "/samples/kahaani.mp4",
    characters: ["Bot", "Retriever"],
  },
  {
    id: "anime-action",
    name: "Anime action",
    series: "The Last Blade",
    composition: "LastBlade",
    credits: 3,
    blurb: "Full anime episode: close-ups, split-screen eyes, a sword clash and a cliffhanger.",
    best: "Story channels, drama",
    preview: "/samples/anime-action.mp4",
    characters: ["Aya", "Rival"],
  },
];

export const getTemplate = (tid) => TEMPLATES.find((t) => t.id === tid);
export const costOf = (tid, length = 30) => (getTemplate(tid)?.credits || 1) * (length >= 60 ? 2 : 1);
