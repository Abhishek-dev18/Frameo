async function call(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: body ? {"Content-Type": "application/json"} : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  state: () => call("GET", "/api/state"),
  episodes: () => call("GET", "/api/episodes"),
  createEpisode: (b) => call("POST", "/api/episodes", b),
  updateEpisode: (id, b) => call("PATCH", `/api/episodes/${id}`, b),
  deleteEpisode: (id) => call("DELETE", `/api/episodes/${id}`),
  render: (id) => call("POST", `/api/episodes/${id}/render`),
  post: (id) => call("POST", `/api/episodes/${id}/post`),
  logs: () => call("GET", "/api/logs"),
  settings: (b) => call("PATCH", "/api/settings", b),
  saveStorage: (b) => call("POST", "/api/connections/storage", b),
  testStorage: () => call("POST", "/api/connections/storage/test"),
  connectInstagram: (token) => call("POST", "/api/connections/instagram", {token}),
  checkInstagram: () => call("POST", "/api/connections/instagram/check"),
  refreshInstagram: () => call("POST", "/api/connections/instagram/refresh"),
  saveYouTube: (b) => call("POST", "/api/connections/youtube", b),
  youtubeAuthUrl: (back) => call("GET", `/api/connections/youtube/auth-url?back=${encodeURIComponent(back)}`),
  disconnectYouTube: () => call("DELETE", "/api/connections/youtube"),
};

export const STATUS = {
  draft: {label: "Draft", tone: "neutral"},
  scheduled: {label: "Scheduled", tone: "info"},
  posting: {label: "Posting", tone: "accent"},
  posted: {label: "Posted", tone: "good"},
  failed: {label: "Failed", tone: "bad"},
};

export function fmtWhen(iso) {
  if (!iso) return "Not scheduled";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit"});
}

export function relative(iso) {
  if (!iso) return "";
  const diff = new Date(iso) - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const text = mins < 60 ? `${mins} min` : mins < 1440 ? `${Math.round(mins / 60)} h` : `${Math.round(mins / 1440)} d`;
  return diff >= 0 ? `in ${text}` : `${text} ago`;
}

// <input type="datetime-local"> works in local time without a timezone
export const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fromLocalInput = (v) => (v ? new Date(v).toISOString() : null);
