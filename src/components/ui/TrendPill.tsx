import type { ReactNode } from "react";

export type TrendDirection = "up" | "down" | "flat";

type ToneStyle = { bg: string; fg: string; ring: string };

const TONE: Record<TrendDirection, ToneStyle> = {
  up: {
    bg: "var(--color-success-light)",
    fg: "var(--color-success)",
    ring: "color-mix(in srgb, var(--color-success) 22%, transparent)",
  },
  down: {
    bg: "var(--color-error-light)",
    fg: "var(--color-error)",
    ring: "color-mix(in srgb, var(--color-error) 26%, transparent)",
  },
  flat: {
    bg: "var(--color-surface-2)",
    fg: "var(--color-text-secondary)",
    ring: "var(--color-border)",
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
      <svg
        viewBox="0 0 12 12"
        width={size}
        height={size}
        fill="none"
        aria-hidden
      >
        <path
          d="M2.5 6h7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
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
  className = "",
}: {
  direction: TrendDirection;
  value: ReactNode;
  description?: ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  const tone = TONE[direction];
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
        <span className="truncate text-[11px] font-medium text-[color:var(--color-text-muted)]">
          {description}
        </span>
      ) : null}
    </span>
  );
}
