"use client";

import { BarChart3, Mail, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { auditSpend } from "@/lib/audit/engine";
import { PRICING } from "@/lib/audit/pricing";
import { SAMPLE_AUDIT } from "@/lib/audit/sample";
import type { AuditRequest, SpendInput, ToolId, UseCase } from "@/lib/audit/types";

const STORAGE_KEY = "spendtrim-audit-draft";

const emptyTool: SpendInput = {
  tool: "cursor",
  plan: "pro",
  monthlySpend: 20,
  seats: 1
};

export default function HomePage() {
  const [draft, setDraft] = useState<AuditRequest>({
    teamSize: 4,
    primaryUseCase: "coding",
    tools: [emptyTool]
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setDraft(JSON.parse(saved) as AuditRequest);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const audit = useMemo(() => auditSpend(draft), [draft]);

  function updateTool(index: number, patch: Partial<SpendInput>) {
    setDraft((current) => {
      const tools = current.tools.map((tool, toolIndex) => {
        if (toolIndex !== index) {
          return tool;
        }

        const nextTool = { ...tool, ...patch };
        const firstPlan = PRICING[nextTool.tool].plans[0]?.id ?? nextTool.plan;

        if (patch.tool) {
          nextTool.plan = firstPlan;
        }

        return nextTool;
      });

      return { ...current, tools };
    });
  }

  function addTool() {
    setDraft((current) => ({ ...current, tools: [...current.tools, emptyTool] }));
  }

  function removeTool(index: number) {
    setDraft((current) => ({
      ...current,
      tools: current.tools.filter((_, toolIndex) => toolIndex !== index)
    }));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-moss">
            SpendTrim AI
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal text-ink md:text-6xl">
            Find wasted AI spend before it compounds.
          </h1>
        </div>
        <button
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={() => setDraft(SAMPLE_AUDIT)}
        >
          <Sparkles size={18} />
          Load sample
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 rounded-md border border-ink/10 bg-white/80 p-4 shadow-soft-panel md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              Team size
              <input
                className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                min={1}
                type="number"
                value={draft.teamSize}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    teamSize: Number(event.target.value)
                  }))
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-ink">
              Primary use case
              <select
                className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                value={draft.primaryUseCase}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    primaryUseCase: event.target.value as UseCase
                  }))
                }
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
          </div>

          {draft.tools.map((tool, index) => (
            <div
              className="grid gap-4 rounded-md border border-ink/10 bg-white p-4 shadow-soft-panel md:grid-cols-4"
              key={`${tool.tool}-${index}`}
            >
              <label className="grid gap-2 text-sm font-medium text-ink">
                Tool
                <select
                  className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                  value={tool.tool}
                  onChange={(event) => updateTool(index, { tool: event.target.value as ToolId })}
                >
                  {Object.values(PRICING).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Plan
                <select
                  className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                  value={tool.plan}
                  onChange={(event) => updateTool(index, { plan: event.target.value })}
                >
                  {PRICING[tool.tool].plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                Monthly spend
                <input
                  className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                  min={0}
                  step="0.01"
                  type="number"
                  value={tool.monthlySpend}
                  onChange={(event) =>
                    updateTool(index, { monthlySpend: Number(event.target.value) })
                  }
                />
              </label>
              <div className="grid gap-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  Seats
                  <input
                    className="focus-ring rounded-md border border-ink/15 px-3 py-2"
                    min={1}
                    type="number"
                    value={tool.seats}
                    onChange={(event) => updateTool(index, { seats: Number(event.target.value) })}
                  />
                </label>
                <button
                  className="focus-ring text-left text-sm font-semibold text-coral disabled:text-ink/35"
                  disabled={draft.tools.length === 1}
                  type="button"
                  onClick={() => removeTool(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-ink/15 bg-white px-4 py-3 text-sm font-semibold text-ink"
            type="button"
            onClick={addTool}
          >
            <RotateCcw size={18} />
            Add another tool
          </button>
        </form>

        <aside className="h-fit rounded-md bg-ink p-5 text-white shadow-soft-panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">Potential savings</p>
              <p className="mt-1 text-5xl font-semibold">
                ${audit.totals.potentialMonthlySavings.toLocaleString()}
              </p>
              <p className="text-sm text-white/70">
                ${audit.totals.potentialAnnualSavings.toLocaleString()} per year
              </p>
            </div>
            <BarChart3 className="text-signal" size={42} />
          </div>

          <p className="mt-5 rounded-md bg-white/10 p-4 text-sm leading-6 text-white/85">
            {audit.summary}
          </p>

          <div className="mt-5 space-y-3">
            {audit.results.map((result) => (
              <article className="rounded-md bg-white p-4 text-ink" key={result.tool}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">{result.toolLabel}</h2>
                    <p className="text-sm text-ink/60">{result.currentPlan}</p>
                  </div>
                  <p className="text-right text-lg font-semibold text-moss">
                    ${result.monthlySavings.toLocaleString()}
                  </p>
                </div>
                <p className="mt-3 text-sm font-semibold">{result.recommendedAction}</p>
                <p className="mt-1 text-sm leading-6 text-ink/70">{result.reason}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 grid gap-3 rounded-md bg-white/10 p-4">
            <label className="grid gap-2 text-sm font-medium">
              Capture this report
              <input
                className="focus-ring rounded-md border border-white/20 bg-white px-3 py-2 text-ink"
                placeholder="founder@company.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-signal px-3 py-2 text-sm font-semibold text-ink"
                type="button"
              >
                <Mail size={16} />
                Email
              </button>
              <button
                className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink"
                type="button"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
