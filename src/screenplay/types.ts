// The screenplay format: what the AI writer produces and the Screenplay composition plays.
// A video is a list of scenes; each scene has a section label, a length in seconds and 1–3 blocks
// stacked on screen. Text fields may use *word* (green highlight) and !word! (coral / bug highlight).

export type Icon = "user" | "phone" | "server" | "db" | "cloud" | "cache" | "x" | "check";

export type Block =
  | {type: "headline"; lead?: string; text: string}
  | {type: "flow"; title?: string; nodes: {label: string; icon: Icon}[]; bad?: number}
  | {type: "code"; file: string; lines: string[]; mark?: string; tag?: "BUG" | "FIX" | "INFO"}
  | {type: "compare"; title?: string; symbol?: string; left: {label: string; value: string; note?: string}; right: {label: string; value: string; note?: string}}
  | {type: "diff"; file?: string; minus: string; plus: string}
  | {type: "stat"; value: string; label: string; tone?: "bug" | "good"}
  | {type: "steps"; title?: string; items: string[]}
  | {type: "cheatsheet"; title: string; rows: {k: string; v: string}[]}
  | {type: "log"; title?: string; lines: string[]}
  | {type: "next"; text: string};

export type Scene = {section: string; seconds: number; blocks: Block[]};
export type Screenplay = {title: string; scenes: Scene[]};

export type ScreenplayProps = {
  screenplay: Screenplay;
  channelName?: string;
  handle?: string;
  episodeNumber?: number;
  music?: number; // 0..2 background track, -1 = none
  watermark?: boolean;
};

export const FPS = 30;
export const totalFrames = (sp: Screenplay) => Math.max(60, Math.round(sp.scenes.reduce((s, x) => s + x.seconds, 0) * FPS));
