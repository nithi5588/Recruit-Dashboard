import { ScoreRing } from "@/components/ui/ScoreRing";
import { NodesIcon, TargetIcon, WrenchIcon } from "@/components/icons/AppIcons";
import type { SkillsBlock } from "@/lib/candidate-detail";

type Tile = {
  icon: React.ReactNode;
  value: string;
  label: string;
  tint: { bg: string; fg: string };
};

function Stat({ tile }: { tile: Tile }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: tile.tint.bg, color: tile.tint.fg }}
      >
        {tile.icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[20px] font-bold leading-[24px] text-[color:var(--color-text)]">
          {tile.value}
        </p>
        <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
          {tile.label}
        </p>
      </div>
    </div>
  );
}

export function SkillsOverviewCard({ block }: { block: SkillsBlock }) {
  const tiles: Tile[] = [
    {
      icon: <NodesIcon size={18} />,
      value: String(block.totalSkills),
      label: "Total Skills",
      tint: { bg: "#EEE9FF", fg: "#5B3DF5" },
    },
    {
      icon: <TargetIcon size={18} />,
      value: String(block.coreSkillsCount),
      label: "Core Skills",
      tint: { bg: "#DBEAFE", fg: "#1D4ED8" },
    },
    {
      icon: <WrenchIcon size={18} />,
      value: String(block.toolsCount),
      label: "Tools & Technologies",
      tint: { bg: "#FFEDD5", fg: "#C2410C" },
    },
  ];

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-5">
        <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
          Skills Overview
        </h2>
        <p className="text-[13px] text-[color:var(--color-text-secondary)]">
          Key skills and proficiencies
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.1fr)]">
        {tiles.map((t) => (
          <Stat key={t.label} tile={t} />
        ))}

        <div className="flex items-center gap-4 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <ScoreRing value={block.overallMatch} size={80} stroke={7} suffix="%" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
              Overall Match
            </p>
            <p className="text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
              Excellent match for{" "}
              <a
                href="#"
                className="link-brand whitespace-nowrap"
              >
                {block.matchedRole} role
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
