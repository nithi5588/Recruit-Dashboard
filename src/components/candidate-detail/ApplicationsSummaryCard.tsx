import {
  InboxIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { UserIcon } from "@/components/icons/Icons";
import type { ApplicationsBlock } from "@/lib/candidate-detail";

type Tile = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: { bg: string; fg: string };
};

function Stat({ tile }: { tile: Tile }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: tile.tint.bg, color: tile.tint.fg }}
      >
        {tile.icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[18px] font-bold leading-[24px] text-[color:var(--color-text)]">
          {tile.value}
        </p>
        <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
          {tile.label}
        </p>
      </div>
    </div>
  );
}

export function ApplicationsSummaryCard({
  summary,
}: {
  summary: ApplicationsBlock["summary"];
}) {
  const tiles: Tile[] = [
    {
      icon: <InboxIcon size={16} />,
      value: String(summary.total),
      label: "Total Applications",
      tint: { bg: "#FCE9DD", fg: "#EA6814" },
    },
    {
      icon: <UserIcon size={16} />,
      value: String(summary.inProgress),
      label: "In Progress",
      tint: { bg: "#F4F2EE", fg: "#6B6358" },
    },
    {
      icon: <UsersIcon size={16} />,
      value: String(summary.underReview),
      label: "Under Review",
      tint: { bg: "#FFF6EE", fg: "#C75510" },
    },
    {
      icon: <UsersIcon size={16} />,
      value: String(summary.shortlisted),
      label: "Shortlisted",
      tint: { bg: "#FCE9DD", fg: "#C75510" },
    },
  ];

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Applications Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Stat key={t.label} tile={t} />
        ))}
      </div>
    </section>
  );
}
