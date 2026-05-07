import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auditSpend } from "@/lib/audit/engine";
import { SAMPLE_AUDIT } from "@/lib/audit/sample";

type PublicAuditPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PublicAuditPageProps): Promise<Metadata> {
  const { slug } = await params;
  const audit = slug === "sample" ? auditSpend(SAMPLE_AUDIT) : null;

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

  if (slug !== "sample") {
    notFound();
  }

  const audit = auditSpend(SAMPLE_AUDIT);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">
        Public audit
      </p>
      <h1 className="mt-3 text-5xl font-semibold text-ink">
        ${audit.totals.potentialMonthlySavings.toLocaleString()} monthly savings found
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/70">{audit.summary}</p>

      <section className="mt-8 grid gap-4">
        {audit.results.map((result) => (
          <article className="rounded-md border border-ink/10 bg-white p-5 shadow-soft-panel" key={result.tool}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">{result.toolLabel}</h2>
                <p className="text-sm text-ink/60">{result.currentPlan}</p>
              </div>
              <p className="text-2xl font-semibold text-moss">
                ${result.monthlySavings.toLocaleString()} / mo
              </p>
            </div>
            <p className="mt-4 font-semibold text-ink">{result.recommendedAction}</p>
            <p className="mt-2 leading-7 text-ink/70">{result.reason}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
