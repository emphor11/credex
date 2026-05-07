import { describe, expect, it } from "vitest";
import { auditSpend } from "./engine";
import type { AuditRequest } from "./types";

describe("auditSpend", () => {
  it("downgrades small teams from team plans", () => {
    const audit = auditSpend({
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [{ tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 }]
    });

    expect(audit.results[0].recommendationType).toBe("downgrade");
    expect(audit.results[0].monthlySavings).toBe(40);
  });

  it("flags spend above the official same-vendor list price", () => {
    const audit = auditSpend({
      teamSize: 10,
      primaryUseCase: "coding",
      tools: [{ tool: "github-copilot", plan: "business", monthlySpend: 300, seats: 10 }]
    });

    expect(audit.results[0].recommendationType).toBe("same-vendor-correction");
    expect(audit.results[0].monthlySavings).toBe(110);
  });

  it("suggests cheaper alternatives when the use case fits", () => {
    const audit = auditSpend({
      teamSize: 3,
      primaryUseCase: "coding",
      tools: [{ tool: "claude", plan: "enterprise", monthlySpend: 240, seats: 3 }]
    });

    expect(audit.results[0].recommendationType).toBe("switch-tool");
    expect(audit.results[0].recommendedAction).toContain("GitHub Copilot");
  });

  it("surfaces Credex for high API-style retail spend", () => {
    const audit = auditSpend({
      teamSize: 12,
      primaryUseCase: "mixed",
      tools: [{ tool: "openai-api", plan: "api-direct", monthlySpend: 3000, seats: 1 }]
    });

    expect(audit.results[0].recommendationType).toBe("credits");
    expect(audit.results[0].monthlySavings).toBe(600);
    expect(audit.totals.credexEligible).toBe(true);
  });

  it("does not manufacture savings for efficient stacks", () => {
    const audit = auditSpend({
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [{ tool: "chatgpt", plan: "plus", monthlySpend: 20, seats: 1 }]
    });

    expect(audit.results[0].recommendationType).toBe("keep");
    expect(audit.totals.potentialMonthlySavings).toBe(0);
    expect(audit.summary).toContain("already fairly efficient");
  });

  it("adds annualized savings across multiple tools", () => {
    const request: AuditRequest = {
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [
        { tool: "cursor", plan: "business", monthlySpend: 80, seats: 2 },
        { tool: "openai-api", plan: "api-direct", monthlySpend: 1000, seats: 1 }
      ]
    };

    const audit = auditSpend(request);

    expect(audit.totals.potentialMonthlySavings).toBe(240);
    expect(audit.totals.potentialAnnualSavings).toBe(2880);
  });
});
