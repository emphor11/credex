# Devlog

## Day 1 - 2026-05-07

**Hours worked:** 2

**What I did:** Read the assignment PDF, clarified the full-submission scope, chose the Next.js React architecture, scaffolded the app, added the first typed audit model, built initial pricing-backed audit rules, created a sample audit UI, added CI config, and started all required root documentation.

**What I learned:** The assignment is weighted heavily toward shipping discipline and entrepreneurial evidence, not just code. The technical product needs to prove value before capturing email, and the docs have to make the implementation easy for an evaluator or LLM to understand.

**Blockers / what I'm stuck on:** Pricing pages change often, so the current constants need one more verification pass before final submission. User interviews also need to be scheduled with real people this week.

**Plan for tomorrow:** Finish the spend input UX, wire validation, improve the audit result page, add backend schema notes, and deepen the audit engine tests.

## Day 2 - 2026-05-08

**Hours worked:** 3

**What I did:** Added validated API routes for creating public audits, reading public audits by slug, and capturing leads after the result is shown. Added a Supabase-ready storage layer with local in-memory fallback, a Supabase schema, honeypot + basic rate limiting for lead capture, real share-link creation from the UI, Resend confirmation email wiring, Groq-powered personalized summaries with fallback, and API tests covering audit creation, invalid plans, public payload privacy, invalid emails, high-savings lead capture, and LLM fallback behavior.

**What I learned:** The public audit and private lead flows need to be separate at the data-model level, not just hidden in the UI. That makes it much harder to accidentally leak email or company fields in a shared report.

**Blockers / what I'm stuck on:** Supabase, Resend, and Groq are configured locally, but Resend test mode only sends to the account email until a sending domain is verified. User interviews have not happened yet and need to start today.

**Plan for tomorrow:** Polish the public report page, prepare deployment, and continue interview outreach.

## Day 3 - 2026-05-09

**Hours worked:** 2

**What I did:** Polished the in-app audit result panel and public shared report page. Added explicit high-savings Credex consultation messaging for audits above $500/month, added an honest low-savings "you're spending well" path, improved recommendation labels, and made the public report page more screenshot-friendly with totals and clearer recommendation cards.

**What I learned:** The product needs to feel trustworthy in both directions: it should push Credex clearly when the savings case is real, but it should also visibly refuse to manufacture savings when the user's stack is already efficient.

**Blockers / what I'm stuck on:** The product still needs deployment, Lighthouse checks, screenshots/recording, and real user interviews. Resend still needs a verified sending domain before emailing arbitrary users.

**Plan for tomorrow:** Deploy to Vercel, add deployed URL to README, capture screenshots or a short recording, and continue interview collection.
