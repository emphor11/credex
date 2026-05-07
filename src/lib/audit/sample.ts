import type { AuditRequest } from "./types";

export const SAMPLE_AUDIT: AuditRequest = {
  teamSize: 8,
  primaryUseCase: "coding",
  tools: [
    {
      tool: "cursor",
      plan: "business",
      monthlySpend: 480,
      seats: 8
    },
    {
      tool: "github-copilot",
      plan: "enterprise",
      monthlySpend: 312,
      seats: 8
    },
    {
      tool: "openai-api",
      plan: "api-direct",
      monthlySpend: 1800,
      seats: 1
    }
  ]
};
