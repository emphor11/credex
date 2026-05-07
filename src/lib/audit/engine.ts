import { estimateListPrice, getPlan, PRICING, roundMoney } from "./pricing";
import type {
  AuditRequest,
  AuditResult,
  RecommendationType,
  SpendInput,
  ToolAuditResult,
  ToolId,
  UseCase
} from "./types";

const SAME_VENDOR_OVERPAY_THRESHOLD = 1.25;
const CREDEX_SAVINGS_RATE = 0.2;

type Alternative = {
  tool: ToolId;
  plan: string;
  monthlyUsd: number;
  useCases: UseCase[];
  reason: string;
};

const ALTERNATIVES: Alternative[] = [
  {
    tool: "github-copilot",
    plan: "business",
    monthlyUsd: 19,
    useCases: ["coding", "mixed"],
    reason: "Copilot Business covers team coding assistance at a lower per-seat floor than premium IDE-agent plans."
  },
  {
    tool: "chatgpt",
    plan: "plus",
    monthlyUsd: 20,
    useCases: ["writing", "research", "data", "mixed"],
    reason: "ChatGPT Plus is usually enough for individual general-purpose AI work before a team workspace is needed."
  },
  {
    tool: "gemini",
    plan: "pro",
    monthlyUsd: 19.99,
    useCases: ["research", "writing", "mixed"],
    reason: "Gemini Pro gives strong research and long-context value at a low individual monthly price."
  }
];

export function auditSpend(request: AuditRequest): AuditResult {
  const results = request.tools.map((input) => auditTool(input, request));
  const currentMonthlySpend = roundMoney(
    request.tools.reduce((total, item) => total + item.monthlySpend, 0)
  );
  const potentialMonthlySavings = roundMoney(
    results.reduce((total, item) => total + item.monthlySavings, 0)
  );

  return {
    totals: {
      currentMonthlySpend,
      potentialMonthlySavings,
      potentialAnnualSavings: roundMoney(potentialMonthlySavings * 12),
      credexEligible: potentialMonthlySavings > 500
    },
    results,
    summary: buildTemplatedSummary(currentMonthlySpend, potentialMonthlySavings)
  };
}

function auditTool(input: SpendInput, request: AuditRequest): ToolAuditResult {
  const tool = PRICING[input.tool];
  const plan = getPlan(input.tool, input.plan);
  const currentSpend = roundMoney(input.monthlySpend);
  const listPrice = estimateListPrice(input.tool, input.plan, input.seats);
  const downgrade = findSmallTeamDowngrade(input, request.teamSize);
  const alternative = findAlternative(input, request.primaryUseCase);

  if (downgrade && currentSpend > downgrade.monthlyUsd) {
    return resultFor(
      input,
      "downgrade",
      `Downgrade to ${downgrade.label}`,
      currentSpend - downgrade.monthlyUsd,
      `${tool.label} ${plan?.label ?? input.plan} is priced for admin controls your current team size is unlikely to need.`,
      "high"
    );
  }

  if (listPrice !== null && currentSpend > listPrice * SAME_VENDOR_OVERPAY_THRESHOLD) {
    return resultFor(
      input,
      "same-vendor-correction",
      `Correct billing to the listed ${plan?.label ?? input.plan} rate`,
      currentSpend - listPrice,
      `Your entered spend is more than ${Math.round(
        SAME_VENDOR_OVERPAY_THRESHOLD * 100
      )}% of the official list price for this plan and seat count.`,
      "high"
    );
  }

  if (isCreditCandidate(input) && currentSpend >= 500) {
    const savings = currentSpend * CREDEX_SAVINGS_RATE;

    return resultFor(
      input,
      "credits",
      "Explore discounted AI infrastructure credits",
      savings,
      "This is usage-style retail AI spend; a 20% savings estimate is conservative enough to justify a Credex consultation.",
      "medium"
    );
  }

  if (alternative && currentSpend > alternative.monthlyUsd * input.seats * 1.5) {
    const alternativeCost = roundMoney(alternative.monthlyUsd * Math.max(1, input.seats));

    return resultFor(
      input,
      "switch-tool",
      `Evaluate ${PRICING[alternative.tool].label} ${alternative.plan}`,
      currentSpend - alternativeCost,
      alternative.reason,
      "medium"
    );
  }

  return resultFor(
    input,
    "keep",
    "Keep current setup",
    0,
    "Your spend is close to the current public list price or below the threshold where switching costs are worth it.",
    "high"
  );
}

function findSmallTeamDowngrade(input: SpendInput, teamSize: number) {
  if (teamSize > 2 || input.seats > 2) {
    return null;
  }

  if (input.tool === "cursor" && input.plan === "business") {
    return { label: "Cursor Pro", monthlyUsd: 20 * Math.max(1, input.seats) };
  }

  if (input.tool === "github-copilot" && input.plan !== "individual") {
    return { label: "Copilot Individual", monthlyUsd: 10 * Math.max(1, input.seats) };
  }

  if (input.tool === "claude" && input.plan === "team") {
    return { label: "Claude Pro", monthlyUsd: 20 * Math.max(1, input.seats) };
  }

  if (input.tool === "chatgpt" && input.plan === "team") {
    return { label: "ChatGPT Plus", monthlyUsd: 20 * Math.max(1, input.seats) };
  }

  return null;
}

function findAlternative(input: SpendInput, useCase: UseCase) {
  return ALTERNATIVES.find((alternative) => {
    if (!alternative.useCases.includes(useCase)) {
      return false;
    }

    if (alternative.tool === input.tool) {
      return false;
    }

    return true;
  });
}

function isCreditCandidate(input: SpendInput) {
  return (
    input.tool === "anthropic-api" ||
    input.tool === "openai-api" ||
    input.plan === "api" ||
    input.plan === "api-direct" ||
    input.monthlySpend >= 1000
  );
}

function resultFor(
  input: SpendInput,
  recommendationType: RecommendationType,
  recommendedAction: string,
  savings: number,
  reason: string,
  confidence: ToolAuditResult["confidence"]
): ToolAuditResult {
  const monthlySavings = Math.max(0, roundMoney(savings));

  return {
    tool: input.tool,
    toolLabel: PRICING[input.tool].label,
    currentPlan: getPlan(input.tool, input.plan)?.label ?? input.plan,
    currentSpend: roundMoney(input.monthlySpend),
    recommendedAction,
    recommendationType,
    monthlySavings,
    annualSavings: roundMoney(monthlySavings * 12),
    reason,
    confidence
  };
}

function buildTemplatedSummary(currentMonthlySpend: number, potentialMonthlySavings: number) {
  if (potentialMonthlySavings >= 500) {
    return `This stack has a meaningful savings opportunity: about $${potentialMonthlySavings.toLocaleString()} per month on $${currentMonthlySpend.toLocaleString()} of AI spend. The biggest next step is to separate seat-based subscriptions from usage-based infrastructure spend, then use credits or plan changes where the math is clear.`;
  }

  if (potentialMonthlySavings < 100) {
    return "This stack is already fairly efficient. The best move is to keep monitoring pricing changes and revisit the audit when the team grows or usage shifts.";
  }

  return `This audit found about $${potentialMonthlySavings.toLocaleString()} in monthly savings. The recommendations focus on low-risk plan corrections before suggesting tool switches.`;
}
