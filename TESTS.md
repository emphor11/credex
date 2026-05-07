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

## Planned Tests

- API route validation for audit creation and lead capture.
- Public audit payload strips identifying fields.
- Form state survives reload.
- LLM summary endpoint falls back when the provider is unavailable.
