import type { ToolId, ToolPricing } from "./types";

export const VERIFIED_ON = "2026-05-07";

export const PRICING: Record<ToolId, ToolPricing> = {
  cursor: {
    id: "cursor",
    label: "Cursor",
    plans: [
      {
        id: "hobby",
        label: "Hobby",
        monthlyUsd: 0,
        billingModel: "flat",
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "pro",
        label: "Pro",
        monthlyUsd: 20,
        billingModel: "per-seat",
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "business",
        label: "Business",
        monthlyUsd: 40,
        billingModel: "per-seat",
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedOn: VERIFIED_ON,
        notes: "Cursor lists this team plan as Teams; the assignment names it Business."
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyUsd: null,
        billingModel: "custom",
        sourceUrl: "https://cursor.com/en-US/pricing",
        verifiedOn: VERIFIED_ON
      }
    ]
  },
  "github-copilot": {
    id: "github-copilot",
    label: "GitHub Copilot",
    plans: [
      {
        id: "individual",
        label: "Individual",
        monthlyUsd: 10,
        billingModel: "per-seat",
        sourceUrl: "https://docs.github.com/en/copilot/get-started/plans",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "business",
        label: "Business",
        monthlyUsd: 19,
        billingModel: "per-seat",
        sourceUrl: "https://docs.github.com/en/copilot/get-started/plans",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyUsd: 39,
        billingModel: "per-seat",
        sourceUrl: "https://docs.github.com/en/copilot/get-started/plans",
        verifiedOn: VERIFIED_ON
      }
    ]
  },
  claude: {
    id: "claude",
    label: "Claude",
    plans: [
      {
        id: "free",
        label: "Free",
        monthlyUsd: 0,
        billingModel: "flat",
        sourceUrl: "https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "pro",
        label: "Pro",
        monthlyUsd: 20,
        billingModel: "per-seat",
        sourceUrl: "https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "max",
        label: "Max",
        monthlyUsd: 100,
        billingModel: "per-seat",
        sourceUrl: "https://support.anthropic.com/en/articles/11049762-choosing-a-claude-ai-plan",
        verifiedOn: VERIFIED_ON,
        notes: "Uses the Max 5x plan as the conservative Max baseline."
      },
      {
        id: "team",
        label: "Team",
        monthlyUsd: 25,
        billingModel: "per-seat",
        sourceUrl: "https://claude.com/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyUsd: null,
        billingModel: "custom",
        sourceUrl: "https://claude.com/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "api-direct",
        label: "API direct",
        monthlyUsd: null,
        billingModel: "usage",
        sourceUrl: "https://claude.com/pricing",
        verifiedOn: VERIFIED_ON,
        notes: "Sonnet 4.6 is $3 input and $15 output per million tokens."
      }
    ]
  },
  chatgpt: {
    id: "chatgpt",
    label: "ChatGPT",
    plans: [
      {
        id: "plus",
        label: "Plus",
        monthlyUsd: 20,
        billingModel: "per-seat",
        sourceUrl: "https://openai.com/chatgpt/pricing/",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "team",
        label: "Team",
        monthlyUsd: 30,
        billingModel: "per-seat",
        sourceUrl: "https://openai.com/chatgpt/pricing/",
        verifiedOn: VERIFIED_ON,
        notes: "OpenAI pricing currently labels the workspace plan Business; the assignment names it Team."
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyUsd: null,
        billingModel: "custom",
        sourceUrl: "https://openai.com/chatgpt/pricing/",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "api-direct",
        label: "API direct",
        monthlyUsd: null,
        billingModel: "usage",
        sourceUrl: "https://openai.com/api/pricing/",
        verifiedOn: VERIFIED_ON,
        notes: "GPT-5.4 mini is $0.75 input and $4.50 output per million tokens."
      }
    ]
  },
  "anthropic-api": {
    id: "anthropic-api",
    label: "Anthropic API direct",
    plans: [
      {
        id: "api-direct",
        label: "API direct",
        monthlyUsd: null,
        billingModel: "usage",
        sourceUrl: "https://claude.com/pricing",
        verifiedOn: VERIFIED_ON,
        notes: "Sonnet 4.6 is $3 input and $15 output per million tokens."
      }
    ]
  },
  "openai-api": {
    id: "openai-api",
    label: "OpenAI API direct",
    plans: [
      {
        id: "api-direct",
        label: "API direct",
        monthlyUsd: null,
        billingModel: "usage",
        sourceUrl: "https://openai.com/api/pricing/",
        verifiedOn: VERIFIED_ON,
        notes: "GPT-5.4 mini is $0.75 input and $4.50 output per million tokens."
      }
    ]
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    plans: [
      {
        id: "pro",
        label: "Pro",
        monthlyUsd: 19.99,
        billingModel: "per-seat",
        sourceUrl: "https://gemini.google/subscriptions/",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "ultra",
        label: "Ultra",
        monthlyUsd: 249.99,
        billingModel: "per-seat",
        sourceUrl: "https://gemini.google/subscriptions/",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "api",
        label: "API",
        monthlyUsd: null,
        billingModel: "usage",
        sourceUrl: "https://ai.google.dev/pricing",
        verifiedOn: VERIFIED_ON,
        notes: "Gemini 2.5 Pro baseline is $1.25 input and $10 output per million tokens for context up to 200K."
      }
    ]
  },
  v0: {
    id: "v0",
    label: "v0",
    plans: [
      {
        id: "free",
        label: "Free",
        monthlyUsd: 0,
        billingModel: "flat",
        sourceUrl: "https://v0.dev/docs/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "premium",
        label: "Premium",
        monthlyUsd: 20,
        billingModel: "flat",
        sourceUrl: "https://v0.dev/docs/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "team",
        label: "Team",
        monthlyUsd: 30,
        billingModel: "per-seat",
        sourceUrl: "https://v0.dev/docs/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "business",
        label: "Business",
        monthlyUsd: 100,
        billingModel: "per-seat",
        sourceUrl: "https://v0.dev/docs/pricing",
        verifiedOn: VERIFIED_ON
      },
      {
        id: "enterprise",
        label: "Enterprise",
        monthlyUsd: null,
        billingModel: "custom",
        sourceUrl: "https://v0.dev/docs/pricing",
        verifiedOn: VERIFIED_ON
      }
    ]
  }
};

export function getPlan(toolId: ToolId, planId: string) {
  return PRICING[toolId].plans.find((plan) => plan.id === planId);
}

export function estimateListPrice(toolId: ToolId, planId: string, seats: number) {
  const plan = getPlan(toolId, planId);

  if (!plan || plan.monthlyUsd === null) {
    return null;
  }

  if (plan.billingModel === "per-seat") {
    return roundMoney(plan.monthlyUsd * Math.max(1, seats));
  }

  return roundMoney(plan.monthlyUsd);
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
