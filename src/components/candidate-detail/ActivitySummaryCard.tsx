import {
  CalendarIcon,
  InboxIcon,
  NoteLinesIcon,
} from "@/components/icons/AppIcons";
import { UserIcon } from "@/components/icons/Icons";
import type { ActivityBlock } from "@/lib/candidate-detail";

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

export function ActivitySummaryCard({
  summary,
}: {
  summary: ActivityBlock["summary"];
}) {
  const tiles: Tile[] = [
    {
      icon: <NoteLinesIcon size={16} />,
      value: String(summary.total),
      label: "Total Activities",
      tint: { bg: "#EEE9FF", fg: "#5B3DF5" },
    },
    {
      icon: <UserIcon size={16} />,
      value: String(summary.updatesByYou),
      label: "Updates by You",
      tint: { bg: "#EAFBF1", fg: "#16A34A" },
    },
    {
      icon: <InboxIcon size={16} />,
      value: String(summary.interviewsScheduled),
      label: "Interviews Scheduled",
      tint: { bg: "#FCE7F3", fg: "#BE185D" },
    },
    {
      icon: <CalendarIcon size={16} />,
      value: String(summary.notesAdded),
      label: "Notes Added",
      tint: { bg: "#FFF4DB", fg: "#92400E" },
    },
  ];

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Activity Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Stat key={t.label} tile={t} />
        ))}
      </div>
    </section>
  );
}
