const GRADIENTS = [
  "linear-gradient(135deg,#FDBA74,#F97316)",
  "linear-gradient(135deg,#C4B5FD,#7C3AED)",
  "linear-gradient(135deg,#FCA5A5,#EF4444)",
  "linear-gradient(135deg,#6EE7B7,#10B981)",
  "linear-gradient(135deg,#93C5FD,#2563EB)",
  "linear-gradient(135deg,#FDE68A,#F59E0B)",
  "linear-gradient(135deg,#F9A8D4,#DB2777)",
  "linear-gradient(135deg,#A7F3D0,#059669)",
];

function hashIndex(seed: string, mod: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export function Avatar({
  name,
  size = 40,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const gradient = GRADIENTS[hashIndex(name, GRADIENTS.length)];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        fontSize: Math.max(11, Math.round(size * 0.38)),
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
