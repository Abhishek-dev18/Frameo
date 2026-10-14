import type {Screenplay} from "./types";

// Demo used as the Screenplay composition's default props and as the explainer-cards sample.
export const DEMO_SCREENPLAY: Screenplay = {
  title: "Why your API needs a cache",
  scenes: [
    {
      section: "The problem",
      seconds: 4,
      blocks: [
        {type: "headline", lead: "Your app is slow because", text: "every request hits the *database*"},
        {type: "stat", value: "900ms", label: "average response time", tone: "bug"},
      ],
    },
    {
      section: "What happens",
      seconds: 5,
      blocks: [
        {type: "flow", title: "request path", nodes: [{label: "user", icon: "phone"}, {label: "api", icon: "server"}, {label: "postgres", icon: "db"}], bad: 2},
        {type: "log", title: "prod — logs", lines: ["WARN query took 870ms", "ERROR pool exhausted (20/20)"]},
      ],
    },
    {
      section: "The fix",
      seconds: 6,
      blocks: [
        {type: "code", file: "products.ts", tag: "FIX", mark: "redis.get", lines: ["const hit = await redis.get(key);", "if (hit) return JSON.parse(hit);", "const rows = await db.query(sql);", "await redis.set(key, rows, 'EX', 60);"]},
        {type: "compare", title: "before vs after", symbol: "→", left: {label: "no cache", value: "900ms"}, right: {label: "redis hit", value: "4ms"}},
      ],
    },
    {
      section: "Remember",
      seconds: 6,
      blocks: [
        {type: "cheatsheet", title: "caching", rows: [{k: "cache reads", v: "not writes"}, {k: "set a TTL", v: "always"}, {k: "invalidate", v: "on update"}]},
        {type: "next", text: "Cache *invalidation*, the hard part"},
      ],
    },
  ],
};
