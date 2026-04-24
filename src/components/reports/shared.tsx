"use client";

import type { ReactNode } from "react";
import { SparklesIcon, TrendUpIcon } from "@/components/icons/AppIcons";
import { Sparkline } from "@/components/reports/charts";

// ─── Stat card ────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  icon,
  change,
  subtitle,
  positive = true,
  spark,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  change?: number | null;
  subtitle?: string;
  positive?: boolean;
  spark?: { values: number[]; color?: string };
}) {
  const showTrend = typeof change === "number";
  const trendColor = positive ? "var(--color-success)" : "var(--color-error)";
  return (
    <div className="group rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-panel)]">
      <div className="flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-[12px] font-medium text-[color:var(--color-text-secondary)]">{label}</p>
          <p className="mt-0.5 text-[24px] font-extrabold leading-none text-[color:var(--color-text)]">{value}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {showTrend ? (
          <div className="flex min-w-0 items-center gap-1 text-[11px] font-semibold" style={{ color: trendColor }}>
            <TrendUpIcon size={12} style={change! < 0 ? { transform: "rotate(180deg)" } : undefined} />
            {Math.abs(change!)}%
            <span className="truncate font-normal text-[color:var(--color-text-muted)]"> vs last 7 days</span>
          </div>
        ) : (
          <p className="min-w-0 truncate text-[11px] text-[color:var(--color-text-muted)]">{subtitle ?? ""}</p>
        )}
        {spark && (
          <div className="hidden shrink-0 opacity-90 sm:block">
            <Sparkline values={spark.values} color={spark.color ?? "#5B3DF5"} />
          </div>
        )}
      </div>
    </div>
  );
}

export function StatIconWrap({ children, bg }: { children: ReactNode; bg: string }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
      style={{ background: bg }}
    >
      {children}
    </div>
  );
}

// ─── AI Insights ──────────────────────────────────────────────────────────────

export type InsightTone = "positive" | "warning" | "info";
export type Insight = { tone: InsightTone; title: string; body: string };

export function InsightBadge({ tone }: { tone: InsightTone }) {
  const map = {
    positive: { bg: "#EAFBF1", fg: "#16A34A", icon: "📈" },
    warning:  { bg: "#FFF4DB", fg: "#B45309", icon: "⚠" },
    info:     { bg: "#EAF2FF", fg: "#2563EB", icon: "💡" },
  } as const;
  const c = map[tone];
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[14px]"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {c.icon}
    </div>
  );
}

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">AI Insights</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand-500)]">
            <SparklesIcon size={10} /> Beta
          </span>
        </div>
        <button
          type="button"
          className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]"
        >
          View all
        </button>
      </div>
      <ul className="space-y-3">
        {insights.map((ins, i) => (
          <li key={i} className="flex gap-3">
            <InsightBadge tone={ins.tone} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[color:var(--color-text)]">{ins.title}</p>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-text-secondary)]">{ins.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
