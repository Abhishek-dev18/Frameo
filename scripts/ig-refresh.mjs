// Refreshes the Instagram long-lived token (do this at least every ~50 days;
// the scheduler does it automatically every Sunday).
import {refreshToken} from "./lib/instagram.mjs";

try {
  const days = await refreshToken();
  console.log(`✓ Instagram token refreshed. Valid for about ${days} more days. Saved to .env`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
