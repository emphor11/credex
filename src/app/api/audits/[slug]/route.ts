import { NextResponse } from "next/server";
import { getAuditRecord } from "@/lib/server/storage";

type AuditRouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: AuditRouteContext) {
  const { slug } = await context.params;
  const record = await getAuditRecord(slug);

  if (!record) {
    return NextResponse.json({ error: "Audit not found." }, { status: 404 });
  }

  return NextResponse.json(record);
}
