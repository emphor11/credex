# Devlog

## Day 1 - 2026-05-07

**Hours worked:** 2

**What I did:** Read the assignment PDF, clarified the full-submission scope, chose the Next.js React architecture, scaffolded the app, added the first typed audit model, built initial pricing-backed audit rules, created a sample audit UI, added CI config, and started all required root documentation.

**What I learned:** The assignment is weighted heavily toward shipping discipline and entrepreneurial evidence, not just code. The technical product needs to prove value before capturing email, and the docs have to make the implementation easy for an evaluator or LLM to understand.

**Blockers / what I'm stuck on:** Pricing pages change often, so the current constants need one more verification pass before final submission. User interviews also need to be scheduled with real people this week.

**Plan for tomorrow:** Finish the spend input UX, wire validation, improve the audit result page, add backend schema notes, and deepen the audit engine tests.

## Day 2 - 2026-05-08

**Hours worked:** 3

**What I did:** Added validated API routes for creating public audits, reading public audits by slug, and capturing leads after the result is shown. Added a Supabase-ready storage layer with local in-memory fallback, a Supabase schema, honeypot + basic rate limiting for lead capture, real share-link creation from the UI, and API tests covering audit creation, invalid plans, public payload privacy, invalid emails, and high-savings lead capture.

**What I learned:** The public audit and private lead flows need to be separate at the data-model level, not just hidden in the UI. That makes it much harder to accidentally leak email or company fields in a shared report.

**Blockers / what I'm stuck on:** Supabase and Resend credentials are still needed before this becomes a real deployed backend. User interviews have not happened yet and need to start today.

**Plan for tomorrow:** Wire Resend email confirmation, add the real LLM summary provider call with fallback, polish the public report page, and continue interview outreach.
