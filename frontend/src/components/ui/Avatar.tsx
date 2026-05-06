// Muted, cohesive avatar palette — flat neutral tones so a list of avatars
// reads as one calm set.
const GRADIENTS = [
  "#A3A3A3",
  "#737373",
  "#8E726B",
  "#A3A3A3",
  "#737373",
  "#A3A3A3",
  "#737373",
  "#737373",
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
