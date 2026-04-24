import type { ReactNode } from "react";

export type BadgeTone =
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "gray"
  | "amber";

const TONE: Record<BadgeTone, { bg: string; fg: string; border?: string }> = {
  purple: { bg: "#EEE9FF", fg: "#4B32D4", border: "#D8D0FF" },
  blue: { bg: "#EAF2FF", fg: "#1D4ED8", border: "#C7DBFC" },
  green: { bg: "#EAFBF1", fg: "#15803D", border: "#BBF0CF" },
  orange: { bg: "#FFF1E6", fg: "#C2410C", border: "#FCD9B6" },
  red: { bg: "#FDECEC", fg: "#B91C1C", border: "#F5C6C6" },
  amber: { bg: "#FFF4DB", fg: "#92400E", border: "#FDE7A7" },
  gray: { bg: "#F3F4F8", fg: "#475467", border: "#E5E7EF" },
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
    case "open":
    case "open for opportunities":
    case "available":
      return "purple";
    case "shortlisted":
      return "blue";
    case "interview":
    case "interviewing":
      return "orange";
    case "submitted":
    case "resume submitted":
      return "blue";
    case "offered":
      return "purple";
    case "placed":
      return "green";
    case "rejected":
      return "red";
    case "on hold":
      return "amber";
    default:
      return "gray";
  }
}

export function priorityTone(priority: string): BadgeTone {
  switch (priority.toLowerCase()) {
    case "high":
      return "orange";
    case "medium":
      return "amber";
    case "low":
      return "gray";
    default:
      return "gray";
  }
}
