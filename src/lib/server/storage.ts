import { createClient } from "@supabase/supabase-js";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import type { LeadRecord, PublicAuditRecord } from "@/lib/audit/public-record";

type DatabaseAuditRow = {
  slug: string;
  request: PublicAuditRecord["request"];
  result: PublicAuditRecord["result"];
  created_at: string;
};

type DatabaseLeadInsert = {
  audit_slug: string;
  email: string;
  company_name?: string;
  role?: string;
  team_size?: number;
  high_savings: boolean;
  created_at: string;
};

const memoryAudits = new Map<string, PublicAuditRecord>();
const memoryLeads: LeadRecord[] = [];
const localStoreDir = path.join(process.cwd(), ".next", "spendtrim-store");

export function storageMode() {
  return hasSupabaseConfig() ? "supabase" : "memory";
}

export async function saveAuditRecord(record: PublicAuditRecord) {
  if (!hasSupabaseConfig()) {
    memoryAudits.set(record.slug, record);
    await writeLocalAudit(record);
    return record;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("audits").insert({
    slug: record.slug,
    request: record.request,
    result: record.result,
    created_at: record.createdAt
  });

  if (error) {
    throw new Error(error.message);
  }

  return record;
}

export async function getAuditRecord(slug: string) {
  const memoryRecord = memoryAudits.get(slug);

  if (memoryRecord) {
    return memoryRecord;
  }

  if (!hasSupabaseConfig()) {
    return readLocalAudit(slug);
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("audits")
    .select("slug, request, result, created_at")
    .eq("slug", slug)
    .single<DatabaseAuditRow>();

  if (error || !data) {
    return null;
  }

  return {
    slug: data.slug,
    request: data.request,
    result: data.result,
    createdAt: data.created_at
  } satisfies PublicAuditRecord;
}

export async function saveLeadRecord(record: LeadRecord) {
  if (!hasSupabaseConfig()) {
    memoryLeads.push(record);
    await appendLocalLead(record);
    return record;
  }

  const insert: DatabaseLeadInsert = {
    audit_slug: record.auditSlug,
    email: record.email,
    company_name: record.companyName || undefined,
    role: record.role || undefined,
    team_size: record.teamSize,
    high_savings: record.highSavings,
    created_at: record.createdAt
  };

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("leads").insert(insert);

  if (error) {
    throw new Error(error.message);
  }

  return record;
}

export function clearMemoryStorageForTests() {
  memoryAudits.clear();
  memoryLeads.splice(0, memoryLeads.length);

  if (existsSync(localStoreDir)) {
    rmSync(localStoreDir, { recursive: true, force: true });
  }
}

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

async function writeLocalAudit(record: PublicAuditRecord) {
  const dir = path.join(localStoreDir, "audits");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${record.slug}.json`), JSON.stringify(record), "utf8");
}

async function readLocalAudit(slug: string) {
  try {
    const file = await readFile(path.join(localStoreDir, "audits", `${slug}.json`), "utf8");
    return JSON.parse(file) as PublicAuditRecord;
  } catch {
    return null;
  }
}

async function appendLocalLead(record: LeadRecord) {
  await mkdir(localStoreDir, { recursive: true });
  await appendFile(path.join(localStoreDir, "leads.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
}
