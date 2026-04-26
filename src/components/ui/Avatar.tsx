// Muted, cohesive avatar palette — slate / plum / sage / clay tones at
// matched luminance (~50%) and saturation (~22%) so a list of avatars reads
// as one calm set instead of a rainbow.
const GRADIENTS = [
  "linear-gradient(135deg,#9A9183,#9A9183)",  // dusty blue-slate
  "linear-gradient(135deg,#9A9183,#857B6C)",  // muted lavender-gray
  "linear-gradient(135deg,#9A9183,#857B6C)",  // soft teal-sage
  "linear-gradient(135deg,#B8AE9F,#8E726B)",  // warm clay
  "linear-gradient(135deg,#9A9183,#857B6C)",  // muted ochre
  "linear-gradient(135deg,#9A9183,#9A9183)",  // cool slate
  "linear-gradient(135deg,#9A9183,#857B6C)",  // mauve
  "linear-gradient(135deg,#9A9183,#857B6C)",  // sage olive
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
