// Monthly credits for paid plans. Each month the balance is topped back up to the plan's allowance
// (unused monthly credits don't stack up). Free credits are a one-time grant and never refill.
import {db, event} from "./db.mjs";
import {PLANS, planOf} from "./templates.mjs";

const nextMonth = (from = new Date()) => {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString();
};

// Called when a plan starts (admin now; payments later). Gives the allowance straight away.
export function applyPlan(userId, planId) {
  const plan = PLANS[planId];
  return db.update("users", userId, (u) =>
    planId === "free"
      ? {plan: planId, creditsRenewAt: null}
      : {plan: planId, credits: Math.max(u.credits || 0, plan.credits), creditsRenewAt: nextMonth()},
  );
}

// Run from the engine loop: refills everyone whose month has rolled over.
export function refillDue(at = new Date()) {
  for (const u of db.all("users", (x) => x.plan && x.plan !== "free" && x.creditsRenewAt && new Date(x.creditsRenewAt) <= at)) {
    const plan = planOf(u);
    const credits = Math.max(u.credits || 0, plan.credits);
    db.update("users", u.id, {credits, creditsRenewAt: nextMonth(u.creditsRenewAt)});
    event(u.id, `Monthly credits renewed: ${credits} credits on ${plan.name}.`, "good");
  }
}
