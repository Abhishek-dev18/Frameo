// Confirms the Instagram token works and prints the account it belongs to.
import {whoami} from "./lib/instagram.mjs";

try {
  const me = await whoami();
  console.log(`✓ Connected to Instagram as @${me.username} (${me.account_type})`);
  console.log(`  Put this in .env as IG_USER_ID: ${me.user_id}`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
