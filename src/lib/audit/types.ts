export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "v0";

export type BillingModel = "per-seat" | "flat" | "usage" | "custom";

export type PlanPrice = {
  id: string;
  label: string;
  monthlyUsd: number | null;
  billingModel: BillingModel;
  sourceUrl: string;
  verifiedOn: string;
  notes?: string;
};

export type ToolPricing = {
  id: ToolId;
  label: string;
  plans: PlanPrice[];
};

export type SpendInput = {
  tool: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditRequest = {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: SpendInput[];
};

export type RecommendationType =
  | "downgrade"
  | "same-vendor-correction"
  | "switch-tool"
  | "credits"
  | "keep";

export type ToolAuditResult = {
  tool: ToolId;
  toolLabel: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendationType: RecommendationType;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  confidence: "low" | "medium" | "high";
};

export type AuditTotals = {
  currentMonthlySpend: number;
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  credexEligible: boolean;
};

export type AuditResult = {
  totals: AuditTotals;
  results: ToolAuditResult[];
  summary: string;
  summarySource?: "llm" | "template";
};
