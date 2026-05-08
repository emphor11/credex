# Tests

Run all tests:

```bash
npm test
```

## Automated Tests

- `src/lib/audit/engine.test.ts` - downgrades small teams from team plans.
- `src/lib/audit/engine.test.ts` - flags spend above official same-vendor list price.
- `src/lib/audit/engine.test.ts` - suggests cheaper alternatives when the use case fits.
- `src/lib/audit/engine.test.ts` - surfaces Credex for high API-style retail spend.
- `src/lib/audit/engine.test.ts` - avoids manufactured savings for efficient stacks.
- `src/lib/audit/engine.test.ts` - annualizes savings across multiple tools.
- `src/app/api/audits/route.test.ts` - creates public audits and returns share URLs.
- `src/app/api/audits/route.test.ts` - rejects invalid tool-plan combinations.
- `src/app/api/audits/route.test.ts` - serves saved public audits without private lead details.
- `src/app/api/audits/route.test.ts` - rejects invalid lead email addresses.
- `src/app/api/audits/route.test.ts` - captures valid leads and marks high-savings audits.
- `src/app/api/audits/route.test.ts` - lead capture returns a clear Resend warning when email is not configured.
- `src/lib/server/summary.test.ts` - returns template summary when Groq is not configured.
- `src/lib/server/summary.test.ts` - returns template summary when Groq fails.
- `src/lib/server/summary.test.ts` - returns the Groq summary when the provider succeeds.

## Planned Tests

- Form state survives reload.
- Mocked Resend success and failure behavior.
