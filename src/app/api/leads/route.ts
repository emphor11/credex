import { NextResponse } from "next/server";
import { leadCaptureSchema } from "@/lib/audit/schema";
import { sendAuditConfirmationEmail } from "@/lib/server/email";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getAuditRecord, saveLeadRecord } from "@/lib/server/storage";

export async function POST(request: Request) {
  const limiter = checkRateLimit(getRateLimitKey(request));

  if (!limiter.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again soon." }, { status: 429 });
  }

  const parsed = leadCaptureSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead payload.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const audit = await getAuditRecord(parsed.data.auditSlug);

  if (!audit) {
    return NextResponse.json({ error: "Audit not found." }, { status: 404 });
  }

  try {
    await saveLeadRecord({
      auditSlug: parsed.data.auditSlug,
      email: parsed.data.email,
      companyName: parsed.data.companyName || undefined,
      role: parsed.data.role || undefined,
      teamSize: parsed.data.teamSize,
      highSavings: audit.result.totals.credexEligible,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save lead." },
      { status: 500 }
    );
  }

  const email = await sendAuditConfirmationEmail({
    audit,
    email: parsed.data.email,
    companyName: parsed.data.companyName || undefined
  });

  return NextResponse.json({
    ok: true,
    highSavings: audit.result.totals.credexEligible,
    email
  });
}

function getRateLimitKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}
