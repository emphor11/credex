import { Resend } from "resend";
import type { PublicAuditRecord } from "@/lib/audit/public-record";

export type EmailResult = {
  sent: boolean;
  warning?: string;
  id?: string;
};

export async function sendAuditConfirmationEmail({
  audit,
  email,
  companyName
}: {
  audit: PublicAuditRecord;
  email: string;
  companyName?: string;
}): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      sent: false,
      warning: "Resend is not configured."
    };
  }

  const resend = new Resend(apiKey);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const auditUrl = `${appUrl.replace(/\/$/, "")}/audits/${audit.slug}`;
  const savings = audit.result.totals.potentialMonthlySavings;
  const subject =
    savings > 0
      ? `Your AI spend audit found $${savings.toLocaleString()}/mo in potential savings`
      : "Your AI spend audit is ready";

  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "SpendTrim AI <onboarding@resend.dev>",
      to: email,
      subject,
      text: buildTextEmail(audit, auditUrl, companyName),
      html: buildHtmlEmail(audit, auditUrl, companyName)
    });

    if (response.error) {
      return {
        sent: false,
        warning: response.error.message
      };
    }

    return {
      sent: true,
      id: response.data?.id
    };
  } catch (error) {
    return {
      sent: false,
      warning: error instanceof Error ? error.message : "Email delivery failed."
    };
  }
}

function buildTextEmail(audit: PublicAuditRecord, auditUrl: string, companyName?: string) {
  const greeting = companyName ? `Hi ${companyName} team,` : "Hi,";
  const savings = audit.result.totals.potentialMonthlySavings;
  const annual = audit.result.totals.potentialAnnualSavings;
  const credexLine = audit.result.totals.credexEligible
    ? "Because this audit shows more than $500/month in potential savings, Credex may be able to help capture more of that through discounted AI infrastructure credits."
    : "You can revisit this report when your team or AI usage changes.";

  return `${greeting}

Your SpendTrim AI audit is ready.

Potential savings: $${savings.toLocaleString()}/month, or $${annual.toLocaleString()}/year.

${audit.result.summary}

${credexLine}

View your public report:
${auditUrl}
`;
}

function buildHtmlEmail(audit: PublicAuditRecord, auditUrl: string, companyName?: string) {
  const greeting = companyName ? `Hi ${escapeHtml(companyName)} team,` : "Hi,";
  const savings = audit.result.totals.potentialMonthlySavings;
  const annual = audit.result.totals.potentialAnnualSavings;
  const credexLine = audit.result.totals.credexEligible
    ? "Because this audit shows more than $500/month in potential savings, Credex may be able to help capture more of that through discounted AI infrastructure credits."
    : "You can revisit this report when your team or AI usage changes.";

  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #101828; line-height: 1.6;">
      <p>${greeting}</p>
      <h1 style="font-size: 24px; margin: 0 0 12px;">Your SpendTrim AI audit is ready</h1>
      <p style="font-size: 18px; margin: 0 0 16px;">
        Potential savings: <strong>$${savings.toLocaleString()}/month</strong>,
        or <strong>$${annual.toLocaleString()}/year</strong>.
      </p>
      <p>${escapeHtml(audit.result.summary)}</p>
      <p>${escapeHtml(credexLine)}</p>
      <p>
        <a href="${auditUrl}" style="display:inline-block;background:#101828;color:#ffffff;padding:12px 16px;border-radius:6px;text-decoration:none;">
          View report
        </a>
      </p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
