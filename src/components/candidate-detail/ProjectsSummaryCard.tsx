import { Buildings } from "iconsax-reactjs";
import {
  ClockIcon,
  StarOutlineIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { ProjectsBlock } from "@/lib/candidate-detail";

type Tile = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: { bg: string; fg: string };
};

function BuildingsSmall() {
  return <Buildings size={18} color="currentColor" variant="Linear" />;
}

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

export function ProjectsSummaryCard({ block }: { block: ProjectsBlock }) {
  const tiles: Tile[] = [
    {
      icon: <StarOutlineIcon size={16} />,
      value: String(block.totalProjects),
      label: "Total Projects",
      tint: { bg: "#EEE9FF", fg: "#5B3DF5" },
    },
    {
      icon: <UsersIcon size={16} />,
      value: String(block.featuredCount),
      label: "Featured Projects",
      tint: { bg: "#DBEAFE", fg: "#1D4ED8" },
    },
    {
      icon: <BuildingsSmall />,
      value: String(block.companiesCount),
      label: "Companies",
      tint: { bg: "#EAFBF1", fg: "#16A34A" },
    },
    {
      icon: <ClockIcon size={16} />,
      value: block.totalExperience,
      label: "Total Project Experience",
      tint: { bg: "#FFEDD5", fg: "#C2410C" },
    },
  ];

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Projects Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Stat key={t.label} tile={t} />
        ))}
      </div>
    </section>
  );
}
