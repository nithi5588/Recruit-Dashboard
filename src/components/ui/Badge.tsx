import type { ReactNode } from "react";

export type BadgeTone =
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "gray"
  | "amber";

// Muted badge palette — backgrounds desaturated and borders dropped where
// possible so a row of mixed badges reads as one cohesive band of color.
const TONE: Record<BadgeTone, { bg: string; fg: string; border?: string }> = {
  purple: { bg: "#EFEBFA", fg: "#5B4BAE", border: "#DCD4F2" },
  blue:   { bg: "#EAF0F8", fg: "#3B5887", border: "#CFDCEC" },
  green:  { bg: "#E8F2EC", fg: "#2F6B4A", border: "#CCDFD2" },
  orange: { bg: "#F5EDE3", fg: "#8A5635", border: "#E0D3C2" },
  red:    { bg: "#F2E5E5", fg: "#8C4B4B", border: "#DCC9C9" },
  amber:  { bg: "#F4ECDC", fg: "#7A5B26", border: "#DFD1B0" },
  gray:   { bg: "#F0F1F5", fg: "#5A6478", border: "#E0E3EC" },
};

export function Badge({
  tone = "gray",
  children,
  icon,
  size = "sm",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
  size?: "sm" | "md";
}) {
  const t = TONE[tone];
  const pad = size === "md" ? "6px 12px" : "3px 10px";
  const fs = size === "md" ? 13 : 12;
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[999px] font-semibold"
      style={{
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border ?? "transparent"}`,
        padding: pad,
        fontSize: fs,
        lineHeight: 1,
      }}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  switch (status.toLowerCase()) {
    // Active / pipeline stages — use brand purple as the dominant color so
    // most rows in a list share one tone.
    case "open":
    case "open for opportunities":
    case "available":
    case "shortlisted":
    case "submitted":
    case "resume submitted":
    case "offered":
      return "purple";
    case "interview":
    case "interviewing":
      return "amber";
    case "placed":
      return "green";
    case "rejected":
      return "red";
    case "on hold":
      return "gray";
    default:
      return "gray";
  }
}

export function priorityTone(priority: string): BadgeTone {
  switch (priority.toLowerCase()) {
    case "high":
      return "red";
    case "medium":
      return "amber";
    case "low":
      return "gray";
    default:
      return "gray";
  }
}
