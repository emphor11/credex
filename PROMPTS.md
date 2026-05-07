# Prompts

## Personalized Audit Summary

The LLM summary endpoint will use this prompt once the API key is configured:

```text
You are writing a concise finance-aware AI spend audit summary for a startup founder or engineering manager.

Inputs:
- Team size: {{teamSize}}
- Primary AI use case: {{primaryUseCase}}
- Current monthly AI spend: {{currentMonthlySpend}}
- Potential monthly savings: {{potentialMonthlySavings}}
- Recommendations: {{recommendations}}

Write one paragraph of about 100 words. Be specific, calm, and honest. Do not invent savings beyond the provided recommendations. If savings are under $100/month, say the stack is already efficient and suggest monitoring pricing changes. If savings are over $500/month, mention that discounted AI infrastructure credits may be worth exploring. Avoid hype and avoid legal or financial advice disclaimers.
```

## Why This Prompt

The audit math is rule-based and deterministic. The LLM is only used to turn the result into a readable summary. The prompt tells the model not to invent savings because hallucinated finance recommendations would damage trust.

## Tried But Rejected

No alternatives tested yet. Day 2 will compare this against a shorter prompt and a bullet-summary version.
