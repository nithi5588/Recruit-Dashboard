import { PlusIcon } from "@/components/icons/AppIcons";
import type { OtherSkill } from "@/lib/candidate-detail";
import {
  levelBadgeTone,
  levelBarColor,
} from "@/components/candidate-detail/skills-shared";

const TONE_HEX: Record<ReturnType<typeof levelBadgeTone>, string> = {
  purple: "#4B32D4",
  blue: "#1D4ED8",
  green: "#15803D",
  orange: "#C2410C",
  red: "#B91C1C",
  amber: "#92400E",
  gray: "#475467",
};

function SkillTile({ skill }: { skill: OtherSkill }) {
  const tone = levelBadgeTone(skill.level);
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold"
          style={{ background: skill.bg, color: skill.fg }}
        >
          {skill.abbr}
        </span>
        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
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
