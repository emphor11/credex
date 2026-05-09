import type { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import { notFound } from "next/navigation";
import { auditSpend } from "@/lib/audit/engine";
import { SAMPLE_AUDIT } from "@/lib/audit/sample";
import { getAuditRecord } from "@/lib/server/storage";

type PublicAuditPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PublicAuditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = slug === "sample" ? null : await getAuditRecord(slug);
  const audit = slug === "sample" ? auditSpend(SAMPLE_AUDIT) : record?.result;

  if (!audit) {
    return {};
  }

  const title = `$${audit.totals.potentialMonthlySavings.toLocaleString()} in AI savings found`;
  const description = "A public AI spend audit from SpendTrim AI.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function PublicAuditPage({ params }: PublicAuditPageProps) {
  const { slug } = await params;
  const record = slug === "sample" ? null : await getAuditRecord(slug);

  if (slug !== "sample" && !record) {
    notFound();
  }

  const audit = slug === "sample" ? auditSpend(SAMPLE_AUDIT) : record!.result;
  const isHighSavings = audit.totals.credexEligible;
  const isEfficient = audit.totals.potentialMonthlySavings < 100;

  return (
    <main className="min-h-screen">
      <section className="border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[minmax(0,1fr)_320px] md:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-signal">
              <Sparkles size={14} />
              Public AI spend audit
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl">
              {isEfficient
                ? "This AI stack is already spending well."
                : `$${audit.totals.potentialMonthlySavings.toLocaleString()} monthly savings found.`}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{audit.summary}</p>
          </div>

          <aside className="grid content-start gap-3 rounded-md border border-white/10 bg-white p-5 text-ink">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink/60">Current monthly spend</p>
              <p className="text-xl font-semibold">
                ${audit.totals.currentMonthlySpend.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 pt-3">
              <p className="text-sm font-semibold text-ink/60">Potential monthly savings</p>
              <p className="text-xl font-semibold text-moss">
                ${audit.totals.potentialMonthlySavings.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 pt-3">
              <p className="text-sm font-semibold text-ink/60">Annualized savings</p>
              <p className="text-xl font-semibold">
                ${audit.totals.potentialAnnualSavings.toLocaleString()}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 md:px-8">
        {isHighSavings ? (
          <div className="rounded-md border border-moss/20 bg-white p-5 shadow-soft-panel">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-moss">
              <ShieldCheck size={18} />
              Credex consultation candidate
            </div>
            <p className="mt-3 max-w-3xl leading-7 text-ink/75">
              This audit is above the $500/month savings threshold. The highest-leverage next
              step is reviewing discounted AI infrastructure credits and billing corrections
              before asking the team to change tools.
            </p>
          </div>
        ) : null}

        {isEfficient ? (
          <div className="rounded-md border border-moss/20 bg-white p-5 shadow-soft-panel">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-moss">
              <CheckCircle2 size={18} />
              No fake savings
            </div>
            <p className="mt-3 max-w-3xl leading-7 text-ink/75">
              The audit did not manufacture a recommendation. This stack should be monitored for
              pricing changes, team growth, or API usage spikes rather than changed immediately.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4">
          {audit.results.map((result, index) => (
            <article
              className="rounded-md border border-ink/10 bg-white p-5 shadow-soft-panel"
              key={`${result.tool}-${index}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink">{result.toolLabel}</h2>
                  <p className="text-sm text-ink/60">{result.currentPlan}</p>
                </div>
                <div className="flex items-center gap-2 text-2xl font-semibold text-moss">
                  <TrendingDown size={22} />
                  ${result.monthlySavings.toLocaleString()} / mo
                </div>
              </div>
              <p className="mt-4 inline-flex rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
                {result.recommendationType.replaceAll("-", " ")}
              </p>
              <p className="mt-4 font-semibold text-ink">{result.recommendedAction}</p>
              <p className="mt-2 leading-7 text-ink/70">{result.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
