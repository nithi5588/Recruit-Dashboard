import type { ExperienceSkill } from "@/lib/candidate-detail";

function SkillBar({ skill }: { skill: ExperienceSkill }) {
  const width = Math.max(0, Math.min(100, skill.percent));
  const yrs =
    Number.isInteger(skill.years) ? `${skill.years} yrs` : `${skill.years} yrs`;

  return (
    <li className="grid grid-cols-[120px_minmax(0,1fr)_auto] items-center gap-3 sm:grid-cols-[140px_minmax(0,1fr)_auto]">
      <p className="truncate text-[13px] font-medium text-[color:var(--color-text)]">
        {skill.name}
      </p>
      <div
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
        className="h-2 overflow-hidden rounded-[999px] bg-[color:var(--color-surface-2)]"
      >
        <span
          className="block h-full rounded-[999px] bg-[color:var(--color-brand-500)]"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-[12px] text-[color:var(--color-text-secondary)]">
        {yrs}
      </span>
    </li>
  );
}

export function TopSkillsFromExperienceCard({
  skills,
}: {
  skills: ExperienceSkill[];
}) {
  if (skills.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Top Skills from Experience
      </h3>
      <ul className="space-y-3.5">
        {skills.map((s) => (
          <SkillBar key={s.name} skill={s} />
        ))}
      </ul>
    </section>
  );
}
