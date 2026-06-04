export type DonutSegment = {
  name: string;
  value: number;
  color: string;
  /** Optional [from, to] linear gradient; overrides the flat `color` fill. */
  gradient?: [string, string];
};

export function DonutChart({
  segments,
  size = 140,
  stroke = 22,
  ariaLabel = "Donut chart",
  rounded = false,
}: {
  segments: DonutSegment[];
  size?: number;
  stroke?: number;
  ariaLabel?: string;
  /** Round the arc end caps for a softer ring. */
  rounded?: boolean;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce<
    { seg: DonutSegment; dash: number; gap: number; rotate: number }[]
  >((acc, seg) => {
    const prevRotate = acc.length === 0 ? -90 : acc[acc.length - 1].rotate;
    const prevFraction =
      acc.length === 0 ? 0 : acc[acc.length - 1].seg.value / total;
    const rotate = prevRotate + prevFraction * 360;
    const fraction = seg.value / total;
    const dash = fraction * circumference;
    const gap = circumference - dash;
    acc.push({ seg, dash, gap, rotate });
    return acc;
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {arcs.map(({ seg }) =>
          seg.gradient ? (
            <linearGradient
              key={`grad-${seg.name}`}
              id={`donut-grad-${seg.name}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor={seg.gradient[0]} />
              <stop offset="100%" stopColor={seg.gradient[1]} />
            </linearGradient>
          ) : null,
        )}
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#F5F5F5"
        strokeWidth={stroke}
        fill="none"
      />
      {arcs.map(({ seg, dash, gap, rotate }) => (
        <circle
          key={seg.name}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={seg.gradient ? `url(#donut-grad-${seg.name})` : seg.color}
          strokeWidth={stroke}
          strokeLinecap={rounded ? "round" : "butt"}
          fill="none"
          strokeDasharray={`${dash} ${gap}`}
          transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
        />
      ))}
    </svg>
  );
}
