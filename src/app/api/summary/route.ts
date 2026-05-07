import { NextResponse } from "next/server";
import { auditSpend } from "@/lib/audit/engine";
import type { AuditRequest } from "@/lib/audit/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as AuditRequest;
  const audit = auditSpend(payload);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      summary: audit.summary,
      source: "template"
    });
  }

  return NextResponse.json({
    summary: audit.summary,
    source: "template",
    note: "LLM call will be wired after prompt evaluation and API key setup."
  });
}
