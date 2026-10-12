// Usage: npm run post -- <episode-id> [--dry-run]
// Renders (if not already rendered) and posts one episode right now.
import {postEpisode, loadEpisodes} from "./lib/episodes.mjs";

const id = process.argv[2];
const dryRun = process.argv.includes("--dry-run");
if (!id) {
  console.log("Usage: npm run post -- <episode-id> [--dry-run]\n\nEpisodes:");
  for (const e of loadEpisodes()) console.log(`  ${e.id.padEnd(8)} ${e.status.padEnd(10)} ${e.title}`);
  process.exit(1);
}
try {
  const ep = await postEpisode(id, {dryRun});
  if (!dryRun) console.log(`\n✓ ${ep.id} posted`, ep.results);
} catch {
  process.exit(1);
}
