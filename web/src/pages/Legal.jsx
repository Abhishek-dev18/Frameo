import React from "react";

// TEMPLATES ONLY. Have a lawyer review these and fill in the [BRACKETS] before launching publicly.
const DOCS = {
  privacy: {
    title: "Privacy Policy",
    body: [
      ["Who we are", "PixelScript is operated by [YOUR LEGAL NAME / COMPANY], [ADDRESS, INDIA]. Contact: [SUPPORT EMAIL]."],
      ["What we collect", "Your name, email and password (stored as a secure hash); your channel details; the topics, scripts and videos you create; the Instagram and YouTube accounts you connect and the access tokens needed to post on your behalf; payment records (handled by our payment provider; we never see your card or UPI PIN); basic logs used to keep the service running."],
      ["How we use it", "To write, render and post the episodes you schedule; to send you notifications you turn on; to bill you; to keep the service secure. We don't sell your data."],
      ["Instagram and YouTube data", "We use the Instagram API and the YouTube Data API only to publish the videos you approve and to show you their status. PixelScript's use of information received from Google APIs follows the Google API Services User Data Policy, including the Limited Use requirements. You can disconnect either account at any time in Settings, and you can also revoke access from your Google or Instagram account settings."],
      ["AI services", "Your topics and scripts are sent to an AI provider ([e.g. Google Gemini]) to write episodes. Don't include personal or confidential information in topics."],
      ["Where data is stored", "[HOSTING PROVIDER AND REGION]. Videos are stored with [STORAGE PROVIDER] so the platforms can fetch them."],
      ["How long we keep it", "As long as your account exists. When you delete your account, we delete your data within 30 days, except records we must keep by law (such as invoices)."],
      ["Your rights", "You can access, correct, export or delete your data. Write to [SUPPORT EMAIL]. Under India's Digital Personal Data Protection Act, 2023 you may also contact our Grievance Officer: [NAME, EMAIL]."],
      ["Changes", "We'll tell you by email or in the app before significant changes take effect."],
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      ["The service", "PixelScript creates animated short videos from topics you provide and posts them to accounts you connect, on a schedule you set."],
      ["Your account", "You must be 18 or older. Keep your password safe. You're responsible for activity on your account."],
      ["Your content", "You own the videos PixelScript makes for you. You're responsible for what you publish: check facts, follow Instagram's and YouTube's rules, and label AI-generated content where they require it."],
      ["Not allowed", "Impersonating real people or brands, deepfakes, hate, harassment, sexual content, misinformation, spam or mass-produced repetitive uploads, or anything illegal in India or your country. We may suspend accounts that break these rules."],
      ["Credits and billing", "Credits pay for writing and rendering. Monthly credits don't roll over; top-up credits don't expire. Prices include applicable taxes unless stated."],
      ["Availability", "We work to post on time, but platforms and networks can fail. We refund credits for failed renders. We're not liable for lost views, revenue or platform penalties."],
      ["Ending", "You can delete your account any time. We may end the service with 30 days' notice."],
      ["Law", "These terms are governed by the laws of India. Courts in [CITY] have jurisdiction."],
    ],
  },
  refunds: {
    title: "Refund Policy",
    body: [
      ["Failed videos", "If a render or post fails on our side, the credits used are returned automatically."],
      ["Subscriptions", "You can cancel any time; you keep access until the end of the paid period. Paid months are not refunded once credits have been used."],
      ["Mistaken charges", "Write to [SUPPORT EMAIL] within 7 days and we'll sort it out. Approved refunds return to the original payment method within 5–7 working days."],
    ],
  },
  "data-deletion": {
    title: "Data Deletion",
    body: [
      ["Delete everything", "Go to Settings → Profile → Delete account. This removes your pipelines, scripts, videos and connected-account tokens immediately, and the rest of your data within 30 days."],
      ["Instagram / Facebook", "To remove PixelScript's access from Instagram: Instagram → Settings → Apps and websites → PixelScript → Remove. Then delete your PixelScript account as above, or email [SUPPORT EMAIL] with the subject \"Delete my data\"."],
      ["Google / YouTube", "Visit myaccount.google.com/permissions and remove PixelScript. Then delete your PixelScript account."],
      ["Confirmation", "We confirm deletion by email within 30 days."],
    ],
  },
};

export default function Legal({doc}) {
  const d = DOCS[doc] || DOCS.privacy;
  return (
    <article className="legal">
      <div className="eyebrow mono">LEGAL · DRAFT</div>
      <h1 className="title-l">{d.title}</h1>
      <p className="dim small">Last updated [DATE]. This is a draft template and must be reviewed before PixelScript is offered to the public.</p>
      {d.body.map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
      <nav className="legal-nav" aria-label="Other policies">
        {Object.entries(DOCS).map(([k, v]) => (
          <a key={k} href={`#/legal/${k}`} className={DOCS[doc] === v ? "on" : ""}>{v.title}</a>
        ))}
      </nav>
    </article>
  );
}
