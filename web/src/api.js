async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body ? {"Content-Type": "application/json"} : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const get = (u) => call("GET", u);
const post = (u, b) => call("POST", u, b || {});
const patch = (u, b) => call("PATCH", u, b);
const del = (u) => call("DELETE", u);

export const api = {
  // auth
  me: () => get("/api/auth/me"),
  signup: (b) => post("/api/auth/signup", b),
  login: (b) => post("/api/auth/login", b),
  logout: () => post("/api/auth/logout"),
  forgot: (email) => post("/api/auth/forgot", {email}),
  reset: (token, password) => post("/api/auth/reset", {token, password}),
  // account
  state: () => get("/api/state"),
  updateMe: (b) => patch("/api/me", b),
  deleteMe: () => del("/api/me"),
  // pipelines
  pipelines: () => get("/api/pipelines"),
  pipeline: (id) => get(`/api/pipelines/${id}`),
  createPipeline: (b) => post("/api/pipelines", b),
  updatePipeline: (id, b) => patch(`/api/pipelines/${id}`, b),
  addTopics: (id, topics) => post(`/api/pipelines/${id}/topics`, {topics}),
  removeTopic: (id, topicId) => del(`/api/pipelines/${id}/topics/${topicId}`),
  deletePipeline: (id) => del(`/api/pipelines/${id}`),
  // single videos
  createVideo: (b) => post("/api/videos", b),
  deleteEpisode: (id) => del(`/api/episodes/${id}`),
  downloadUrl: (id) => `/api/episodes/${id}/download`,
  // episodes
  episodes: (q = {}) => get(`/api/episodes?${new URLSearchParams(q)}`),
  episode: (id) => get(`/api/episodes/${id}`),
  updateEpisode: (id, b) => patch(`/api/episodes/${id}`, b),
  act: (id, action) => post(`/api/episodes/${id}/${action}`),
  // notifications
  notifications: () => get("/api/notifications"),
  readAll: () => post("/api/notifications/read"),
  testNotify: () => post("/api/notifications/test"),
  activity: () => get("/api/activity"),
  // admin
  admin: () => get("/api/admin/overview"),
  addCredits: (userId, add) => post(`/api/admin/users/${userId}/credits`, {add}),
  setPlan: (userId, plan) => post(`/api/admin/users/${userId}/plan`, {plan}),
  adminLog: () => get("/api/admin/log"),
  // connections (admin)
  saveStorage: (b) => post("/api/connections/storage", b),
  testStorage: () => post("/api/connections/storage/test"),
  connectInstagram: (token) => post("/api/connections/instagram", {token}),
  checkInstagram: () => post("/api/connections/instagram/check"),
  refreshInstagram: () => post("/api/connections/instagram/refresh"),
  saveYouTube: (b) => post("/api/connections/youtube", b),
  youtubeAuthUrl: (back) => get(`/api/connections/youtube/auth-url?back=${encodeURIComponent(back)}`),
  disconnectYouTube: () => del("/api/connections/youtube"),
  saveKeys: (b) => post("/api/connections/keys", b),
};

// ---------- helpers ----------
export const STAGES = {
  writing: {label: "Writing script", tone: "work"},
  script_review: {label: "Review script", tone: "review"},
  render_queued: {label: "Waiting to render", tone: "work"},
  rendering: {label: "Making video", tone: "work"},
  video_review: {label: "Review video", tone: "review"},
  ready: {label: "Ready to download", tone: "good"},
  scheduled: {label: "Scheduled", tone: "info"},
  posting: {label: "Posting", tone: "work"},
  posted: {label: "Posted", tone: "good"},
  failed: {label: "Failed", tone: "bad"},
  skipped: {label: "Skipped", tone: "neutral"},
};
export const PIPELINE_STEPS = ["writing", "script_review", "rendering", "video_review", "scheduled", "posted"];
export const isReview = (e) => e.stage === "script_review" || e.stage === "video_review";

export const DAYS = [
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thu"],
  [5, "Fri"],
  [6, "Sat"],
  [7, "Sun"],
];

export function fmtWhen(iso) {
  if (!iso) return "Not scheduled";
  return new Date(iso).toLocaleString(undefined, {weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit"});
}
export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
}
export function relative(iso) {
  if (!iso) return "";
  const diff = new Date(iso) - Date.now();
  const mins = Math.round(Math.abs(diff) / 60000);
  const text = mins < 1 ? "now" : mins < 60 ? `${mins} min` : mins < 1440 ? `${Math.round(mins / 60)} h` : `${Math.round(mins / 1440)} d`;
  if (text === "now") return "now";
  return diff >= 0 ? `in ${text}` : `${text} ago`;
}
export function scheduleText(s) {
  if (!s?.days?.length) return "No days set";
  const d = s.days.length === 7 ? "Every day" : s.days.join() === "1,2,3,4,5" ? "Weekdays" : s.days.map((n) => DAYS[n - 1][1]).join(", ");
  const [h, m] = s.time.split(":").map(Number);
  const t = new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
  return `${d} · ${t}`;
}

// Tiny hash router: "#/pipelines/abc?tab=x" -> {path: ["pipelines","abc"], query}
export function readRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [p, q] = raw.split("?");
  return {path: p ? p.split("/").filter(Boolean) : [], query: Object.fromEntries(new URLSearchParams(q || ""))};
}
export const go = (to) => {
  window.location.hash = to.startsWith("#") ? to : `#/${to.replace(/^\//, "")}`;
};

// Plans, in order. Free makes single videos (watermarked, you upload them);
// pipelines (scheduled auto-posting) start on Starter.
export const PLANS = [
  {id: "free", name: "Free", price: "₹0", per: "to try", credits: "30 credits once", points: ["Make videos one at a time", "Download and upload them yourself", "\"Made with PixelScript\" watermark", "Every style"]},
  {id: "starter", name: "Starter", price: "₹499", per: "/month", credits: "30 credits a month", points: ["1 auto-posting pipeline", "Schedule to Instagram + YouTube", "No watermark", "Telegram alerts"]},
  {id: "creator", name: "Creator", price: "₹999", per: "/month", credits: "70 credits a month", points: ["5 pipelines", "60-second episodes", "No watermark", "Everything in Starter"], featured: true},
  {id: "pro", name: "Pro", price: "₹2,499", per: "/month", credits: "200 credits a month", points: ["Unlimited pipelines", "Priority rendering", "No watermark", "Everything in Creator"]},
];
export const canPipeline = (state) => Boolean(state?.plan?.pipelines);
