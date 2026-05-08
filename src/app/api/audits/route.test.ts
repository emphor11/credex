import { describe, expect, it, beforeEach } from "vitest";
import { POST as createAudit } from "./route";
import { GET as getAudit } from "./[slug]/route";
import { POST as captureLead } from "../leads/route";
import { SAMPLE_AUDIT } from "@/lib/audit/sample";
import { clearRateLimitForTests } from "@/lib/server/rate-limit";
import { clearMemoryStorageForTests } from "@/lib/server/storage";

describe("audit API", () => {
  beforeEach(() => {
    clearMemoryStorageForTests();
    clearRateLimitForTests();
    delete process.env.RESEND_API_KEY;
  });

  it("creates a public audit and returns a share URL", async () => {
    const response = await createAudit(jsonRequest("http://localhost:3000/api/audits", SAMPLE_AUDIT));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.slug).toMatch(/^audit-/);
    expect(payload.publicUrl).toContain(`/audits/${payload.slug}`);
    expect(payload.audit.totals.potentialMonthlySavings).toBeGreaterThan(0);
  });

  it("rejects invalid tool plan combinations", async () => {
    const response = await createAudit(
      jsonRequest("http://localhost:3000/api/audits", {
        ...SAMPLE_AUDIT,
        tools: [{ tool: "cursor", plan: "not-real", monthlySpend: 10, seats: 1 }]
      })
    );

    expect(response.status).toBe(400);
  });

  it("serves saved public audits without private lead details", async () => {
    const createResponse = await createAudit(jsonRequest("http://localhost:3000/api/audits", SAMPLE_AUDIT));
    const created = await createResponse.json();
    const getResponse = await getAudit(new Request("http://localhost:3000/api/audits/test"), {
      params: Promise.resolve({ slug: created.slug })
    });
    const publicPayload = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(publicPayload.slug).toBe(created.slug);
    expect(JSON.stringify(publicPayload)).not.toContain("founder@example.com");
  });

  it("rejects invalid lead email addresses", async () => {
    const createResponse = await createAudit(jsonRequest("http://localhost:3000/api/audits", SAMPLE_AUDIT));
    const created = await createResponse.json();
    const leadResponse = await captureLead(
      jsonRequest("http://localhost:3000/api/leads", {
        auditSlug: created.slug,
        email: "not-an-email",
        companyName: "DemoCo",
        role: "Founder",
        teamSize: 8,
        website: ""
      })
    );

    expect(leadResponse.status).toBe(400);
  });

  it("captures valid leads and marks high-savings audits", async () => {
    const createResponse = await createAudit(jsonRequest("http://localhost:3000/api/audits", SAMPLE_AUDIT));
    const created = await createResponse.json();
    const leadResponse = await captureLead(
      jsonRequest("http://localhost:3000/api/leads", {
        auditSlug: created.slug,
        email: "founder@example.com",
        companyName: "DemoCo",
        role: "Founder",
        teamSize: 8,
        website: ""
      })
    );
    const leadPayload = await leadResponse.json();

    expect(leadResponse.status).toBe(200);
    expect(leadPayload.ok).toBe(true);
    expect(leadPayload.highSavings).toBe(true);
    expect(leadPayload.email.sent).toBe(false);
    expect(leadPayload.email.warning).toContain("Resend");
  });
});

function jsonRequest(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000"
    },
    body: JSON.stringify(body)
  });
}
