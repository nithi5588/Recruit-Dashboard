import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ProfileAdd,
  Profile2User,
  TickCircle,
  Timer1,
  type IconProps as IconsaxProps,
} from "iconsax-reactjs";
import type { ComponentType } from "react";
import { stats, type Stat } from "@/lib/sample-data";

function hrefFor(label: string): string {
  if (/total|new this/i.test(label)) return "/candidates";
  if (/in process/i.test(label))     return "/pipeline";
  if (/placement/i.test(label))      return "/pipeline";
  return "/candidates";
}

const TONE: Record<
  Stat["tone"],
  { bg: string; fg: string; outline: string; accent: string }
> = {
  purple: {
    bg: "#EEE9FF",
    fg: "#5B3DF5",
    outline: "#D8D0FF",
    accent: "#5B3DF5",
  },
  blue: {
    bg: "#EAF2FF",
    fg: "#2563EB",
    outline: "#C7DBFC",
    accent: "#2563EB",
  },
  orange: {
    bg: "#FFF1E6",
    fg: "#F97316",
    outline: "#FCD9B6",
    accent: "#F97316",
  },
  green: {
    bg: "#EAFBF1",
    fg: "#16A34A",
    outline: "#BBF0CF",
    accent: "#16A34A",
  },
};

type IconsaxComponent = ComponentType<IconsaxProps>;

const TONE_ICON: Record<Stat["tone"], IconsaxComponent> = {
  purple: Profile2User,
  blue:   ProfileAdd,
  orange: Timer1,
  green:  TickCircle,
};

function StatIcon({ tone, color }: { tone: Stat["tone"]; color: string }) {
  const Icon = TONE_ICON[tone];
  return (
    <Icon
      variant={tone === "green" ? "Bold" : "Bulk"}
      size={20}
      color={color}
    />
  );
}

const SPARKLINES: Record<Stat["tone"], number[]> = {
  purple: [14, 18, 16, 22, 20, 24, 28, 26, 32, 30, 36, 40],
  blue: [10, 12, 16, 14, 18, 22, 20, 24, 26, 30, 28, 32],
  orange: [28, 26, 24, 22, 20, 22, 20, 18, 20, 18, 16, 18],
  green: [4, 5, 6, 6, 8, 7, 9, 10, 11, 10, 12, 12],
};

function Sparkline({
  data,
  color,
  direction,
}: {
  data: number[];
  color: string;
  direction: "up" | "down";
}) {
  const w = 120;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = Math.max(1, max - min);
  const step = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const path = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const gradId = `spark-${color.replace("#", "")}-${direction}`;
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden
      className="block"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const tone = TONE[stat.tone];
  const up = stat.deltaDirection === "up";
  return (
    <Link
      href={hrefFor(stat.label)}
      className="group relative block overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 transition-all hover:-translate-y-[2px] hover:border-[color:var(--color-brand-200)] hover:shadow-[0_10px_28px_rgba(23,26,43,0.08)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${tone.accent}, ${tone.accent}55 60%, transparent)`,
        }}
      />

      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
          {stat.label}
        </p>
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-[12px]"
          style={{
            background: tone.bg,
            color: tone.fg,
            border: `1px solid ${tone.outline}`,
          }}
        >
          <StatIcon tone={stat.tone} color={tone.fg} />
        </span>
      </div>

      <p className="mt-3 text-[28px] font-bold leading-[36px] tracking-tight text-[color:var(--color-text)] sm:text-[30px]">
        {stat.value}
      </p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p
          className="inline-flex items-center gap-1 text-[12px] font-semibold"
          style={{ color: up ? "#16A34A" : "#EF4444" }}
        >
          {up ? (
            <ArrowUp size={14} color="currentColor" variant="Bold" />
          ) : (
            <ArrowDown size={14} color="currentColor" variant="Bold" />
          )}
          {stat.delta}
        </p>
        <div className="h-9 w-24 shrink-0 opacity-80 transition-opacity group-hover:opacity-100">
          <Sparkline
            data={SPARKLINES[stat.tone]}
            color={tone.accent}
            direction={stat.deltaDirection}
          />
        </div>
      </div>
    </Link>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}
