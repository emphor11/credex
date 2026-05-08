import { NextResponse } from "next/server";
import { auditSpend } from "@/lib/audit/engine";
import { auditRequestSchema } from "@/lib/audit/schema";
import { generatePersonalizedSummary } from "@/lib/server/summary";

export async function POST(request: Request) {
  const parsed = auditRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid audit payload.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const audit = auditSpend(parsed.data);
  const summary = await generatePersonalizedSummary({
    request: parsed.data,
    audit
  });

  return NextResponse.json(summary);
}
