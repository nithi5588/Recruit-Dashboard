import Link from "next/link";
import type { MatchSkill } from "@/lib/candidate-detail";

function Row({ skill }: { skill: MatchSkill }) {
  const width = Math.max(0, Math.min(100, skill.percent));
  // Single-tone bar shaded by match strength so a list of bars reads as one
  // gradient instead of varying colors.
  const opacity = width >= 90 ? 1 : width >= 75 ? 0.85 : 0.65;
  return (
    <li className="grid grid-cols-[28px_1fr_auto] items-center gap-3">
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[color:var(--color-brand-100)] text-[10px] font-bold text-[color:var(--color-brand-600)]"
      >
        {skill.abbr}
      </span>
      <div className="min-w-0">
        <p className="mb-1.5 truncate text-[13px] font-medium text-[color:var(--color-text)]">
          {skill.name}
        </p>
        <div
          role="progressbar"
          aria-valuenow={width}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} match`}
          className="h-1.5 overflow-hidden rounded-[999px] bg-[color:var(--color-surface-2)]"
        >
          <span
            className="block h-full rounded-[999px] transition-[width] duration-500"
            style={{ width: `${width}%`, background: "var(--color-brand-500)", opacity }}
          />
        </div>
      </div>
      <span className="text-[12px] font-semibold tabular-nums text-[color:var(--color-text)]">
        {width}%
      </span>
    </li>
  );
}

export function TopSkillsByMatchCard({
  skills,
}: {
  skills: MatchSkill[];
}) {
  if (skills.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Top Skills by Match
        </h3>
        <p className="text-[12px] text-[color:var(--color-text-secondary)]">
          Based on job requirements
        </p>
      </header>

      <ul className="space-y-3">
        {skills.map((s) => (
          <Row key={s.name} skill={s} />
        ))}
      </ul>

      <Link
        href="#"
        className="link-brand mt-4 inline-block text-[12px]"
      >
        View all
      </Link>
    </section>
  );
}
