import { PlusIcon } from "@/components/icons/AppIcons";
import type { OtherSkill } from "@/lib/candidate-detail";
import {
  levelBadgeTone,
  levelBarColor,
} from "@/components/candidate-detail/skills-shared";

const TONE_HEX: Record<ReturnType<typeof levelBadgeTone>, string> = {
  purple: "#5B4BAE",
  blue: "#3B5887",
  green: "#2F6B4A",
  orange: "#8A5635",
  red: "#8C4B4B",
  amber: "#7A5B26",
  gray: "#5A6478",
};

function SkillTile({ skill }: { skill: OtherSkill }) {
  const tone = levelBadgeTone(skill.level);
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 transition-all hover:border-[color:var(--color-brand-200)] hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--color-brand-100)] text-[11px] font-bold text-[color:var(--color-brand-600)]"
        >
          {skill.abbr}
        </span>
        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]" title={skill.name}>
          {skill.name}
        </p>
      </div>
      <p
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
        style={{ color: TONE_HEX[tone] }}
      >
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: levelBarColor(skill.level) }}
        />
        {skill.level}
      </p>
    </div>
  );
}

function AddSkillTile() {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-[14px] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-3.5 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]"
    >
      <PlusIcon size={14} />
      Add Skill
    </button>
  );
}

export function OtherSkillsCard({ skills }: { skills: OtherSkill[] }) {
  if (skills.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Other Skills
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Additional skills and competencies
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
        >
          <PlusIcon size={14} />
          Add Skill
        </button>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {skills.map((s) => (
          <SkillTile key={s.name} skill={s} />
        ))}
        <AddSkillTile />
      </div>
    </section>
  );
}
