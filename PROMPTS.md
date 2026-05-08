# Prompts

## Personalized Audit Summary

The LLM summary endpoint uses Groq Chat Completions with this prompt shape:

```text
System:
You write concise, finance-aware AI spend audit summaries. Use only the provided numbers and recommendations. Do not invent savings or vendors.

User:
Write one paragraph of about 100 words for a startup founder or engineering manager.

Team size: {{teamSize}}
Primary use case: {{primaryUseCase}}
Current monthly AI spend: {{currentMonthlySpend}}
Potential monthly savings: {{potentialMonthlySavings}}
Potential annual savings: {{potentialAnnualSavings}}
Credex eligible: {{yes_or_no}}

Recommendations:
{{recommendations}}

Rules:
- Be specific, calm, and honest.
- Do not invent savings beyond the provided recommendations.
- If savings are under $100/month, say the stack is already efficient and suggest monitoring pricing changes.
- If savings are over $500/month, mention discounted AI infrastructure credits may be worth exploring.
- Return only the paragraph.
```

## Why This Prompt

The audit math is rule-based and deterministic. Groq is only used to turn the result into a readable summary. The prompt tells the model not to invent savings because hallucinated finance recommendations would damage trust.

## Tried But Rejected

No alternatives tested yet. Day 2 will compare this against a shorter prompt and a bullet-summary version.

## Email Copy

Transactional confirmation emails are deterministic, not LLM-written. They include monthly savings, annual savings, the templated audit summary, a public report link, and a Credex note only when savings exceed $500/month.
