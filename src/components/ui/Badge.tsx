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
  purple: { bg: "#FCE9DD", fg: "#9F430D", border: "#F8D5BD" },
  blue:   { bg: "#F4F2EE", fg: "#6B6358", border: "#E8E4DC" },
  green:  { bg: "#FFF6EE", fg: "#9F430D", border: "#F8D5BD" },
  orange: { bg: "#F4F2EE", fg: "#C75510", border: "#E8E4DC" },
  red:    { bg: "#F8D5BD", fg: "#9F430D", border: "#F8D5BD" },
  amber:  { bg: "#F4F2EE", fg: "#9F430D", border: "#E8E4DC" },
  gray:   { bg: "#F4F2EE", fg: "#6B6358", border: "#E8E4DC" },
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
