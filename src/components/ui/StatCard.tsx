import Link from "next/link";
import type { ReactNode } from "react";
import { Sparkline } from "@/components/ui/Sparkline";
import { TrendPill, type TrendDirection } from "@/components/ui/TrendPill";

export type StatTone = "primary" | "neutral" | "subtle" | "strong";

type ToneStyle = {
  iconBg: string;
  iconFg: string;
  iconRing: string;
  accent: string;
  spark: string;
};

// Four tones spread across the enterprise hierarchy:
//   primary  → soft brand-blue moment (the "active" stat)
//   neutral  → true neutral grey (the calmest, most stats look like this)
//   subtle   → neutral grey wrap, brand-blue icon (a quieter brand moment)
//   strong   → near-black wrap with white icon (high-impact "win" stat —
//              gives the dashboard a black anchor so it doesn't feel
//              all-blue)
const TONE: Record<StatTone, ToneStyle> = {
  primary: {
    iconBg: "rgba(var(--accent-rgb, 46, 71, 224), 0.10)",
    iconFg: "var(--color-brand-600)",
    iconRing: "rgba(var(--accent-rgb, 46, 71, 224), 0.18)",
    accent: "var(--color-brand-500)",
    spark: "var(--color-brand-500)",
  },
  neutral: {
    iconBg: "var(--color-surface-2)",
    iconFg: "var(--color-text-secondary)",
    iconRing: "var(--color-border)",
    accent: "var(--color-text-secondary)",
    spark: "var(--color-text-secondary)",
  },
  subtle: {
    iconBg: "var(--color-surface-2)",
    iconFg: "var(--color-brand-500)",
    iconRing: "var(--color-border)",
    accent: "var(--color-brand-400)",
    spark: "var(--color-brand-400)",
  },
  strong: {
    iconBg: "var(--color-text)",
    iconFg: "#FFFFFF",
    iconRing: "var(--color-text)",
    accent: "var(--color-text)",
    spark: "var(--color-text)",
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
  /** Hide the top accent strip if you want a plainer card. */
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
  showAccent = true,
  className = "",
}: StatCardProps) {
  const t = TONE[tone];
  const cardClass = `group relative block overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 transition-all duration-[var(--motion-normal)] ${
    href
      ? "hover:-translate-y-[2px] hover:border-[color:var(--color-brand-200)] hover:shadow-[var(--shadow-card-hover)]"
      : ""
  } ${className}`;
  const cardStyle = { boxShadow: "var(--shadow-card)" } as const;

  const inner = (
    <>
      {showAccent ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] opacity-90"
          style={{
            background: `linear-gradient(90deg, ${t.accent}, color-mix(in srgb, ${t.accent} 35%, transparent) 60%, transparent)`,
          }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <p className="truncate text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
          {label}
        </p>
        {icon ? (
          <span
            aria-hidden
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
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

      <p className="mt-3 text-[28px] font-bold leading-[34px] tracking-tight tabular-nums text-[color:var(--color-text)] sm:text-[30px]">
        {value}
      </p>

      <div className="mt-2 flex min-h-[28px] items-end justify-between gap-3">
        {trend ? (
          <TrendPill
            direction={trend.direction}
            value={trend.value}
            description={trend.description}
          />
        ) : (
          <span aria-hidden />
        )}
        {spark && spark.length > 1 ? (
          <div className="hidden shrink-0 opacity-90 transition-opacity group-hover:opacity-100 sm:block">
            <Sparkline values={spark} color={t.spark} width={84} height={30} />
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
