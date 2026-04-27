import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkline } from "@/components/ui/Sparkline";
import { TrendPill, type TrendDirection } from "@/components/ui/TrendPill";

export type StatTone = "primary" | "neutral" | "subtle" | "strong";

type ToneStyle = {
  cardBg: string;
  cardBorder: string;
  labelFg: string;
  valueFg: string;
  iconBg: string;
  iconFg: string;
  iconRing: string;
  sparkColor: string;
  /** TrendPill needs a different background tint on the dark anchor card. */
  invertedTrend: boolean;
  /** Adds a subtle gloss highlight overlay (used by the dark anchor card). */
  glossy?: boolean;
};

// Strict black-and-white treatment.
//
//   primary  → BLACK anchor card. One per row, the high-impact stat.
//   neutral  → CLEAN WHITE card. The rhythm of every other stat.
//   subtle   → WHITE card, slightly muted icon (kept for API parity).
//   strong   → WHITE card (renamed from the old inverted style — now sits
//              quietly alongside neutral so multiple cards can repeat
//              without jarring contrast).
//
// Trend chips keep semantic green/red because direction *is* the signal.
const TONE: Record<StatTone, ToneStyle> = {
  primary: {
    // Flat charcoal surface (gradient removed for a clean, calm look).
    cardBg: "#1B1B1F",
    cardBorder: "rgba(255,255,255,0.06)",
    labelFg: "rgba(255,255,255,0.72)",
    valueFg: "#FFFFFF",
    iconBg: "rgba(255,255,255,0.08)",
    iconFg: "rgba(255,255,255,0.92)",
    iconRing: "rgba(255,255,255,0.16)",
    sparkColor: "#FFFFFF",
    invertedTrend: true,
    glossy: true,
  },
  neutral: {
    cardBg: "var(--color-surface)",
    cardBorder: "var(--color-border)",
    labelFg: "var(--color-text-secondary)",
    valueFg: "var(--color-text)",
    iconBg: "var(--color-surface-2)",
    iconFg: "var(--color-text-secondary)",
    iconRing: "var(--color-border)",
    sparkColor: "var(--color-text-secondary)",
    invertedTrend: false,
  },
  subtle: {
    cardBg: "var(--color-surface)",
    cardBorder: "var(--color-border)",
    labelFg: "var(--color-text-secondary)",
    valueFg: "var(--color-text)",
    iconBg: "var(--color-surface-2)",
    iconFg: "var(--color-text)",
    iconRing: "var(--color-border)",
    sparkColor: "var(--color-text)",
    invertedTrend: false,
  },
  strong: {
    cardBg: "var(--color-surface)",
    cardBorder: "var(--color-border)",
    labelFg: "var(--color-text-secondary)",
    valueFg: "var(--color-text)",
    iconBg: "var(--color-surface-2)",
    iconFg: "var(--color-text)",
    iconRing: "var(--color-border)",
    sparkColor: "var(--color-text)",
    invertedTrend: false,
  },
};

export type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  tone?: StatTone;
  trend?: {
    direction: TrendDirection;
    value: ReactNode;
    description?: ReactNode;
  };
  spark?: number[];
  /** Optional href makes the card a link with a hover affordance. */
  href?: string;
  /** Hide the (no-op in B&W) accent strip — kept for API parity. */
  showAccent?: boolean;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  tone = "primary",
  trend,
  spark,
  href,
  className = "",
}: StatCardProps) {
  const t = TONE[tone];
  const cardClass = `group relative block overflow-hidden rounded-[var(--radius-card)] border p-5 transition-all duration-[var(--motion-normal)] ${
    href
      ? "hover:-translate-y-[2px] hover:shadow-[var(--shadow-card-hover)]"
      : ""
  } ${className}`;
  const cardStyle = {
    background: t.cardBg,
    borderColor: t.cardBorder,
    boxShadow: t.glossy
      // Glossy anchor: soft outer shadow + inset top highlight for the
      // shine, plus a gentle bottom inset shadow to deepen the bevel.
      ? "0 1px 2px rgba(0,0,0,0.10), 0 12px 28px -8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -10px 24px rgba(0,0,0,0.25)"
      : "var(--shadow-card)",
  } as const;

  const inner = (
    <>
      {/* Glossy overlays removed — flat surface. */}

      <div className="relative flex items-start justify-between gap-3">
        <p
          className="truncate text-[12.5px] font-medium"
          style={{ color: t.labelFg }}
        >
          {label}
        </p>
        {icon ? (
          <span
            aria-hidden
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{
              background: t.iconBg,
              color: t.iconFg,
              boxShadow: `inset 0 0 0 1px ${t.iconRing}`,
            }}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p
        className="relative mt-3 text-[28px] font-bold leading-[34px] tracking-tight tabular-nums sm:text-[30px]"
        style={{ color: t.valueFg }}
      >
        {value}
      </p>

      <div className="relative mt-2 flex min-h-[28px] items-end justify-between gap-3">
        {trend ? (
          <TrendPill
            direction={trend.direction}
            value={trend.value}
            description={trend.description}
            inverted={t.invertedTrend}
          />
        ) : (
          <span aria-hidden />
        )}
        {spark && spark.length > 1 ? (
          <div className="hidden shrink-0 opacity-90 transition-opacity group-hover:opacity-100 sm:block">
            <Sparkline values={spark} color={t.sparkColor} width={84} height={30} />
          </div>
        ) : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClass} style={cardStyle}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={cardClass} style={cardStyle}>
      {inner}
    </div>
  );
}
