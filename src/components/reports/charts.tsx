function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function Sparkline({
  values,
  color = "#EA6814",
  width = 60,
  height = 22,
  fill = true,
}: {
  values: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const xStep = (width - pad * 2) / (values.length - 1);

  const pts = values.map((v, i) => {
    const x = pad + i * xStep;
    const y = pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const linePath = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  const areaPath = fill
    ? `${linePath} L ${pts[pts.length - 1][0]} ${height - pad} L ${pts[0][0]} ${height - pad} Z`
    : "";
  const gradId = `spark-${color.replace("#", "")}-${values.length}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradId})`} />
        </>
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2} fill={color} />
    </svg>
  );
}

export function CircularProgress({
  value,
  label,
  size = 180,
  stroke = 14,
  color = "#EA6814",
  trackColor,
  showLabel = true,
}: {
  value: number;
  label?: string;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const cx = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={trackColor ?? "var(--color-surface-2)"}
        strokeWidth={stroke}
      />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cx})`}
      />
      {showLabel && (
        <>
          <text
            x={cx} y={cx - 2} textAnchor="middle"
            fontSize={size * 0.2} fontWeight="800"
            style={{ fill: "var(--color-text)" }}
          >
            {pct}%
          </text>
          {label && (
            <text
              x={cx} y={cx + 18} textAnchor="middle"
              fontSize={size * 0.075}
              style={{ fill: "var(--color-text-secondary)" }}
            >
              {label}
            </text>
          )}
        </>
      )}
    </svg>
  );
}

export function MiniDonut({
  segments,
  total,
  line1,
  line2 = "Total",
  size = 130,
}: {
  segments: Array<{ value: number; color: string }>;
  total: number;
  line1: string | number;
  line2?: string;
  size?: number;
}) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.39, IR = size * 0.27;
  const GAP = 3;
  let deg = 0;

  const arcs = segments.map((s) => {
    const span = (s.value / total) * 360 - GAP;
    const from = polarToXY(cx, cy, R, deg);
    const to   = polarToXY(cx, cy, R, deg + span);
    const iFrom = polarToXY(cx, cy, IR, deg);
    const iTo   = polarToXY(cx, cy, IR, deg + span);
    const large = span > 180 ? 1 : 0;
    const d = `M ${from.x} ${from.y} A ${R} ${R} 0 ${large} 1 ${to.x} ${to.y} L ${iTo.x} ${iTo.y} A ${IR} ${IR} 0 ${large} 0 ${iFrom.x} ${iFrom.y} Z`;
    deg += span + GAP;
    return { d, color: s.color };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize={size * 0.175} fontWeight="700" style={{ fill: "var(--color-text)" }}>{line1}</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fontSize={size * 0.085} style={{ fill: "var(--color-text-secondary)" }}>{line2}</text>
    </svg>
  );
}
