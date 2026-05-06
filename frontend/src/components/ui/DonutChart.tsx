export type DonutSegment = { name: string; value: number; color: string };

export function DonutChart({
  segments,
  size = 140,
  stroke = 22,
  ariaLabel = "Donut chart",
}: {
  segments: DonutSegment[];
  size?: number;
  stroke?: number;
  ariaLabel?: string;
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
          stroke={seg.color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${gap}`}
          transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
        />
      ))}
    </svg>
  );
}
