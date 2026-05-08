import { randomBytes } from "crypto";

export function createAuditSlug() {
  return `audit-${randomBytes(5).toString("hex")}`;
}
