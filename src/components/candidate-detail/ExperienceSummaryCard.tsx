import { CalendarIcon, ClockIcon, SuitcaseIcon } from "@/components/icons/AppIcons";
import type { ExperienceEntry } from "@/lib/candidate-detail";
import type { Candidate } from "@/lib/sample-data";

type Tile = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

function Stat({ tile }: { tile: Tile }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
      >
        {tile.icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[16px] font-bold leading-[22px] text-[color:var(--color-text)]">
          {tile.value}
        </p>
        <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
          {tile.label}
        </p>
      </div>
    </div>
  );
}

export function ExperienceSummaryCard({
  experience,
  candidate,
}: {
  experience: ExperienceEntry[];
  candidate: Candidate;
}) {
  const totalRoles = experience.length;
  const companies = new Set(experience.map((e) => e.company)).size;
  const current = experience.find((e) => e.current);
  const currentRange = current
    ? current.period.split("–")[0]?.trim().split(" ").slice(-1)[0] + " - Present"
    : "—";

  const tiles: Tile[] = [
    {
      icon: <CalendarIcon size={16} />,
      value: candidate.experience.replace(" years", "").replace("+", "+"),
      label: "Total Experience",
    },
    {
      icon: <SuitcaseIcon size={16} />,
      value: String(totalRoles),
      label: "Total Roles",
    },
    {
      icon: <CalendarIcon size={16} />,
      value: String(companies),
      label: "Companies Worked",
    },
    {
      icon: <ClockIcon size={16} />,
      value: currentRange,
      label: "Current Role",
    },
  ];

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Experience Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <Stat key={t.label} tile={t} />
        ))}
      </div>
    </section>
  );
}
