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

const TONE: Record<Stat["tone"], { bg: string; fg: string; outline: string }> = {
  purple: { bg: "#FCE9DD", fg: "#EA6814", outline: "#F8D5BD" },
  blue:   { bg: "#F4F2EE", fg: "#6B6358", outline: "#E8E4DC" },
  orange: { bg: "#FFF6EE", fg: "#F97316", outline: "#F8D5BD" },
  green:  { bg: "#FCE9DD", fg: "#C75510", outline: "#F8D5BD" },
};

type IconsaxComponent = ComponentType<IconsaxProps>;

const TONE_ICON: Record<Stat["tone"], IconsaxComponent> = {
  purple: Profile2User,
  blue:   ProfileAdd,
  orange: Timer1,
  green:  TickCircle,
};

function Card({ stat }: { stat: Stat }) {
  const tone = TONE[stat.tone];
  const Icon = TONE_ICON[stat.tone];
  const up = stat.deltaDirection === "up";
  return (
    <div
      className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
        style={{
          background: tone.bg,
          color: tone.fg,
          border: `1px solid ${tone.outline}`,
        }}
      >
        <Icon
          variant={stat.tone === "green" ? "Bold" : "Bulk"}
          size={22}
          color={tone.fg}
        />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[color:var(--color-text-secondary)]">
          {stat.label}
        </p>
        <p className="text-[22px] font-bold leading-[28px] tracking-tight text-[color:var(--color-text)]">
          {stat.value}
        </p>
        <p
          className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: up ? "#C75510" : "#9F430D" }}
        >
          {up ? (
            <ArrowUp size={12} color="currentColor" variant="Bold" />
          ) : (
            <ArrowDown size={12} color="currentColor" variant="Bold" />
          )}
          {stat.delta}
        </p>
      </div>
    </div>
  );
}

export function CandidatesStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} stat={s} />
      ))}
    </div>
  );
}
