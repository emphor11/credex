import { afterEach, describe, expect, it, vi } from "vitest";
import { auditSpend } from "@/lib/audit/engine";
import { SAMPLE_AUDIT } from "@/lib/audit/sample";
import { generatePersonalizedSummary } from "./summary";

describe("generatePersonalizedSummary", () => {
  const originalGroqKey = process.env.GROQ_API_KEY;
  const audit = auditSpend(SAMPLE_AUDIT);

  afterEach(() => {
    process.env.GROQ_API_KEY = originalGroqKey;
    vi.restoreAllMocks();
  });

  it("returns the template summary when Groq is not configured", async () => {
    delete process.env.GROQ_API_KEY;

    const result = await generatePersonalizedSummary({
      request: SAMPLE_AUDIT,
      audit
    });

    expect(result.source).toBe("template");
    expect(result.summary).toBe(audit.summary);
    expect(result.warning).toContain("Groq");
  });

  it("returns the template summary when Groq fails", async () => {
    process.env.GROQ_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ error: { message: "rate limited" } }, { status: 429 })
      )
    );

    const result = await generatePersonalizedSummary({
      request: SAMPLE_AUDIT,
      audit
    });

    expect(result.source).toBe("template");
    expect(result.summary).toBe(audit.summary);
    expect(result.warning).toBe("rate limited");
  });

  it("returns the Groq summary when the provider succeeds", async () => {
    process.env.GROQ_API_KEY = "test-key";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          choices: [{ message: { content: "This startup can trim AI spend without disrupting engineers." } }]
        })
      )
    );

    const result = await generatePersonalizedSummary({
      request: SAMPLE_AUDIT,
      audit
    });

    expect(result.source).toBe("llm");
    expect(result.summary).toBe("This startup can trim AI spend without disrupting engineers.");
  });
});
