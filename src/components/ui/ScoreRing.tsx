export function ScoreRing({
  value,
  size = 44,
  stroke = 4,
  suffix,
}: {
  value: number;
  size?: number;
  stroke?: number;
  suffix?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  // Muted scoring palette — high scores use brand (so they follow user accent),
  // mid uses a soft amber, low uses a soft rose. Less saturated than pure
  // green/orange/red to keep lists calm.
  const color =
    clamped >= 80
      ? "var(--color-brand-500)"
      : clamped >= 60
        ? "#C99431"
        : "#B26B6E";
  const track = "var(--color-surface-2)";
  const labelSuffix = suffix ? `${clamped}${suffix}` : `${clamped} out of 100`;

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${labelSuffix}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-bold"
        style={{
          color,
          fontSize: Math.max(11, Math.round(size * 0.28)),
        }}
      >
        {clamped}
        {suffix ? <span className="ml-0.5 text-[0.7em]">{suffix}</span> : null}
      </span>
    </span>
  );
}
