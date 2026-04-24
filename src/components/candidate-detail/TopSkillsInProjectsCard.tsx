import Link from "next/link";

type Row = { name: string; percent: number };

function SkillBar({ skill }: { skill: Row }) {
  const width = Math.max(0, Math.min(100, skill.percent));
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-medium text-[color:var(--color-text)]">
            {skill.name}
          </p>
          <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
            {width}%
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={width}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} share of projects`}
          className="mt-1.5 h-1.5 overflow-hidden rounded-[999px] bg-[color:var(--color-surface-2)]"
        >
          <span
            className="block h-full rounded-[999px] bg-[color:var(--color-brand-500)]"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </li>
  );
}

export function TopSkillsInProjectsCard({ skills }: { skills: Row[] }) {
  if (skills.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Top Skills in Projects
      </h3>
      <ul className="space-y-3">
        {skills.map((s) => (
          <SkillBar key={s.name} skill={s} />
        ))}
      </ul>
      <Link
        href={`#`}
        className="link-brand mt-4 inline-block text-[12px]"
      >
        View all skills
      </Link>
    </section>
  );
}
