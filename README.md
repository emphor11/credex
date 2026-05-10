# SpendTrim AI

SpendTrim AI is a free audit tool for startup founders and engineering managers who want to understand whether their AI subscriptions and API usage are overbuilt for the team they have today. It gives an immediate savings estimate, explains each recommendation, and sets up the lead capture and share flow Credex needs.

Deployed URL: pending Vercel deploy.

## Current Submission Status

- Local MVP is implemented and verified with tests, lint, and production build.
- Production deployment is the next required step.
- Real user interviews are still pending and must be added before final submission.
- API keys used during local development should be rotated before final handoff because they were shared during setup.

## Screenshots

Screenshots or a 30-second Loom/YouTube link will be added after the Vercel deployment is live and smoke-tested.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy

Target deploy is Vercel with these environment variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `GROQ_API_KEY`
- `GROQ_MODEL`

Create the Supabase tables with `supabase/schema.sql` before enabling production storage. Without Supabase env vars, the app falls back to in-memory storage for local development only.

For Resend, local testing can use `SpendTrim AI <onboarding@resend.dev>`, but Resend only sends to the account email until a sending domain is verified. Production needs `RESEND_FROM_EMAIL` set to an address on a verified domain.

Production smoke test checklist:

1. Create an audit from the deployed homepage.
2. Confirm the returned report URL opens at `/audits/[slug]`.
3. Confirm the audit row is stored in Supabase.
4. Submit the lead form with the Resend-allowed test email.
5. Confirm the lead row is stored in Supabase and the email response is clear.
6. Confirm the audit summary reports `summarySource: "llm"` when Groq is configured.

## Decisions

1. I chose Next.js React instead of a Vite SPA because shareable audit URLs need server-rendered Open Graph metadata.
2. I started the audit math as hardcoded rules because the assignment explicitly wants defensible finance logic, not LLM-generated math.
3. I chose Supabase for storage because it gives Postgres, row-level security, and simple server-side inserts without building auth.
4. I chose Resend for transactional email because it is fast to wire, has a simple API, and fits this single-report confirmation use case.
5. I chose v0 as the eighth supported tool because its public pricing is clear and it overlaps with startup AI build workflows.
6. I added an in-memory storage fallback for local demos, but production must use Supabase because serverless memory is not durable.
7. I made the public report page direct and numbers-first because it is the asset people will screenshot or share.
