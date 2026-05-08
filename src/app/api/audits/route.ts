import { NextResponse } from "next/server";
import { auditSpend } from "@/lib/audit/engine";
import type { PublicAuditRecord } from "@/lib/audit/public-record";
import { auditRequestSchema } from "@/lib/audit/schema";
import { createAuditSlug } from "@/lib/server/slugs";
import { saveAuditRecord, storageMode } from "@/lib/server/storage";
import { generatePersonalizedSummary } from "@/lib/server/summary";

export async function POST(request: Request) {
  const parsed = auditRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid audit payload.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const baseResult = auditSpend(parsed.data);
  const summary = await generatePersonalizedSummary({
    request: parsed.data,
    audit: baseResult
  });
  const result = {
    ...baseResult,
    summary: summary.summary,
    summarySource: summary.source
  };
  const record: PublicAuditRecord = {
    slug: createAuditSlug(),
    request: parsed.data,
    result,
    createdAt: new Date().toISOString()
  };

  try {
    await saveAuditRecord(record);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save audit." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      slug: record.slug,
      publicUrl: new URL(`/audits/${record.slug}`, getAppOrigin(request)).toString(),
      audit: result,
      storage: storageMode(),
      summaryWarning: summary.warning
    },
    { status: 201 }
  );
}

function getAppOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
}
