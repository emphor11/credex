# SpendTrim AI

SpendTrim AI is a free audit tool for startup founders and engineering managers who want to understand whether their AI subscriptions and API usage are overbuilt for the team they have today. It gives an immediate savings estimate, explains each recommendation, and sets up the lead capture and share flow Credex needs.

Deployed URL: pending Vercel deploy.

## Screenshots

Screenshots or a 30-second Loom/YouTube link will be added after the first deployed UI pass. Day 1 has the app skeleton and audit logic in place; visual capture comes after the results page is polished.

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
- `ANTHROPIC_API_KEY`

Create the Supabase tables with `supabase/schema.sql` before enabling production storage. Without Supabase env vars, the app falls back to in-memory storage for local development only.

For Resend, local testing can use `SpendTrim AI <onboarding@resend.dev>`, but Resend only sends to the account email until a sending domain is verified. Production needs `RESEND_FROM_EMAIL` set to an address on a verified domain.

## Decisions

1. I chose Next.js React instead of a Vite SPA because shareable audit URLs need server-rendered Open Graph metadata.
2. I started the audit math as hardcoded rules because the assignment explicitly wants defensible finance logic, not LLM-generated math.
3. I chose Supabase for storage because it gives Postgres, row-level security, and simple server-side inserts without building auth.
4. I chose Resend for transactional email because it is fast to wire, has a simple API, and fits this single-report confirmation use case.
5. I chose v0 as the eighth supported tool because its public pricing is clear and it overlaps with startup AI build workflows.
6. I added an in-memory storage fallback for local demos, but production must use Supabase because serverless memory is not durable.
