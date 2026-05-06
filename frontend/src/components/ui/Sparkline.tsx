export function Sparkline({
  values,
  color,
  width = 80,
  height = 28,
  fill = true,
  showDot = true,
  className = "",
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  showDot?: boolean;
  className?: string;
}) {
  if (values.length < 2) return null;
  const stroke = color ?? "var(--color-brand-500)";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const xStep = (width - pad * 2) / (values.length - 1);

  const pts = values.map((v, i) => {
    const x = pad + i * xStep;
    const y =
      pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const linePath = pts
    .map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`))
    .join(" ");
  const areaPath = fill
    ? `${linePath} L ${pts[pts.length - 1][0]} ${height - pad} L ${pts[0][0]} ${height - pad} Z`
    : "";
  const gradId = `spark-${Math.abs(
    values.reduce((a, b) => a + b, 0) + width + height,
  )}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden
      className={className}
    >
      {fill ? (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.24" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
        </>
      ) : null}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showDot ? (
        <circle
          cx={pts[pts.length - 1][0]}
          cy={pts[pts.length - 1][1]}
          r="2.2"
          fill={stroke}
        />
      ) : null}
    </svg>
  );
}
