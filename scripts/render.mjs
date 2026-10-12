// Usage: npm run render -- <episode-id>
// Renders the episode's video without posting it.
import {postEpisode} from "./lib/episodes.mjs";

const id = process.argv[2];
if (!id) {
  console.log("Usage: npm run render -- <episode-id>   (ids are in content/episodes.json)");
  process.exit(1);
}
process.env.FORCE_RENDER = "1";
await postEpisode(id, {dryRun: true});
