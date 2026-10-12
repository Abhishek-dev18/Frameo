// Channel name, handle and music come from content/settings.json,
// which you can edit from the PixelScript dashboard (Settings page).
import settings from "../content/settings.json";

export const CHANNEL = settings.channel as {
  name: string;
  handle: string;
  music: string | null;
  musicVolume: number;
};
