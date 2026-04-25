// Muted, cohesive avatar palette — slate / plum / sage / clay tones at
// matched luminance (~50%) and saturation (~22%) so a list of avatars reads
// as one calm set instead of a rainbow.
const GRADIENTS = [
  "linear-gradient(135deg,#94A0BF,#6E7AA0)",  // dusty blue-slate
  "linear-gradient(135deg,#A199B6,#7E748F)",  // muted lavender-gray
  "linear-gradient(135deg,#8DA8A4,#6E8A86)",  // soft teal-sage
  "linear-gradient(135deg,#B49891,#8E726B)",  // warm clay
  "linear-gradient(135deg,#A89B82,#857968)",  // muted ochre
  "linear-gradient(135deg,#9099B5,#6E7794)",  // cool slate
  "linear-gradient(135deg,#A59CB5,#82798F)",  // mauve
  "linear-gradient(135deg,#9DA48A,#7B826A)",  // sage olive
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
