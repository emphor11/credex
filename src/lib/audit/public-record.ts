import type { AuditRequest, AuditResult } from "./types";

export type PublicAuditRecord = {
  slug: string;
  request: AuditRequest;
  result: AuditResult;
  createdAt: string;
};

export type LeadRecord = {
  auditSlug: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  highSavings: boolean;
  createdAt: string;
};
