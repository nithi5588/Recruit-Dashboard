import type { ReactNode } from "react";

export type TrendDirection = "up" | "down" | "flat";

type ToneStyle = { bg: string; fg: string; ring: string; descFg: string };

// Light theme — clean B&W cards: pill shows a soft green/red tinted background
// with a stronger green/red foreground. Direction is the only color.
const TONE_LIGHT: Record<TrendDirection, ToneStyle> = {
  up: {
    bg: "rgba(22, 163, 74, 0.08)",
    fg: "#15803D",
    ring: "rgba(22, 163, 74, 0.18)",
    descFg: "var(--color-text-muted)",
  },
  down: {
    bg: "rgba(220, 38, 38, 0.08)",
    fg: "#B91C1C",
    ring: "rgba(220, 38, 38, 0.20)",
    descFg: "var(--color-text-muted)",
  },
  flat: {
    bg: "var(--color-surface-2)",
    fg: "var(--color-text-secondary)",
    ring: "var(--color-border)",
    descFg: "var(--color-text-muted)",
  },
};

// Dark anchor card (black bg) — bg has more brightness so the pill reads,
// description text needs to be lighter.
const TONE_INVERTED: Record<TrendDirection, ToneStyle> = {
  up: {
    bg: "rgba(74, 222, 128, 0.16)",
    fg: "#86EFAC",
    ring: "rgba(74, 222, 128, 0.24)",
    descFg: "rgba(255,255,255,0.55)",
  },
  down: {
    bg: "rgba(248, 113, 113, 0.18)",
    fg: "#FCA5A5",
    ring: "rgba(248, 113, 113, 0.26)",
    descFg: "rgba(255,255,255,0.55)",
  },
  flat: {
    bg: "rgba(255,255,255,0.08)",
    fg: "rgba(255,255,255,0.75)",
    ring: "rgba(255,255,255,0.14)",
    descFg: "rgba(255,255,255,0.55)",
  },
};

function TrendArrow({
  direction,
  size = 10,
}: {
  direction: TrendDirection;
  size?: number;
}) {
  if (direction === "flat") {
    return (
      <svg viewBox="0 0 12 12" width={size} height={size} fill="none" aria-hidden>
        <path d="M2.5 6h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      style={direction === "down" ? { transform: "scale(1, -1)" } : undefined}
    >
      <path
        d="M3 8.5 L8.5 3 M8.5 3 H4.7 M8.5 3 V6.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrendPill({
  direction,
  value,
  description,
  size = "sm",
  inverted = false,
  className = "",
}: {
  direction: TrendDirection;
  value: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md";
  /** Use the inverted (dark-card) palette so the chip reads on a black bg. */
  inverted?: boolean;
  className?: string;
}) {
  const tone = (inverted ? TONE_INVERTED : TONE_LIGHT)[direction];
  const isMd = size === "md";
  const padY = isMd ? "py-1" : "py-[3px]";
  const padX = isMd ? "px-2.5" : "px-2";
  const text = isMd ? "text-[12px]" : "text-[11px]";
  const arrowSize = isMd ? 11 : 10;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-1 rounded-full font-semibold tabular-nums ${padY} ${padX} ${text}`}
        style={{
          backgroundColor: tone.bg,
          color: tone.fg,
          boxShadow: `inset 0 0 0 1px ${tone.ring}`,
        }}
      >
        <TrendArrow direction={direction} size={arrowSize} />
        {value}
      </span>
      {description ? (
        <span
          className="truncate text-[11px] font-medium"
          style={{ color: tone.descFg }}
        >
          {description}
        </span>
      ) : null}
    </span>
  );
}
