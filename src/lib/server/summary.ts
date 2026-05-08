import type { AuditRequest, AuditResult } from "@/lib/audit/types";

export type SummaryResult = {
  summary: string;
  source: "llm" | "template";
  warning?: string;
};

const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generatePersonalizedSummary({
  request,
  audit
}: {
  request: AuditRequest;
  audit: AuditResult;
}): Promise<SummaryResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return {
      summary: audit.summary,
      source: "template",
      warning: "Groq is not configured."
    };
  }

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.35,
        max_tokens: 180,
        messages: [
          {
            role: "system",
            content:
              "You write concise, finance-aware AI spend audit summaries. Use only the provided numbers and recommendations. Do not invent savings or vendors."
          },
          {
            role: "user",
            content: buildSummaryPrompt(request, audit)
          }
        ]
      })
    });
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      return {
        summary: audit.summary,
        source: "template",
        warning: payload.error?.message || "Groq request failed."
      };
    }

    const summary = payload.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return {
        summary: audit.summary,
        source: "template",
        warning: "Groq returned an empty summary."
      };
    }

    return {
      summary: normalizeSummary(summary),
      source: "llm"
    };
  } catch (error) {
    return {
      summary: audit.summary,
      source: "template",
      warning: error instanceof Error ? error.message : "Groq summary failed."
    };
  }
}

function buildSummaryPrompt(request: AuditRequest, audit: AuditResult) {
  const recommendations = audit.results
    .map(
      (result) =>
        `- ${result.toolLabel} ${result.currentPlan}: ${result.recommendedAction}; $${result.monthlySavings}/mo savings; reason: ${result.reason}`
    )
    .join("\n");

  return `Write one paragraph of about 100 words for a startup founder or engineering manager.

Team size: ${request.teamSize}
Primary use case: ${request.primaryUseCase}
Current monthly AI spend: $${audit.totals.currentMonthlySpend}
Potential monthly savings: $${audit.totals.potentialMonthlySavings}
Potential annual savings: $${audit.totals.potentialAnnualSavings}
Credex eligible: ${audit.totals.credexEligible ? "yes" : "no"}

Recommendations:
${recommendations}

Rules:
- Be specific, calm, and honest.
- Do not invent savings beyond the provided recommendations.
- If savings are under $100/month, say the stack is already efficient and suggest monitoring pricing changes.
- If savings are over $500/month, mention discounted AI infrastructure credits may be worth exploring.
- Return only the paragraph.`;
}

function normalizeSummary(summary: string) {
  return summary.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
}
