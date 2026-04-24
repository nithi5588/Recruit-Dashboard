import { Badge } from "@/components/ui/Badge";
import { PlusIcon } from "@/components/icons/AppIcons";
import type { CoreSkill } from "@/lib/candidate-detail";
import {
  levelBadgeTone,
  levelBarColor,
  levelPercent,
} from "@/components/candidate-detail/skills-shared";

function SkillTile({ skill }: { skill: CoreSkill }) {
  const percent = levelPercent(skill.level);
  const color = levelBarColor(skill.level);
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
          {skill.name}
        </p>
        <Badge tone={levelBadgeTone(skill.level)}>{skill.level}</Badge>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
        className="h-1.5 overflow-hidden rounded-[999px] bg-[color:var(--color-surface-2)]"
      >
        <span
          className="block h-full rounded-[999px]"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
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

export function CoreSkillsCard({ skills }: { skills: CoreSkill[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Core Skills
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Primary skills relevant to the candidate&apos;s role
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
        >
          <PlusIcon size={14} />
          Add Core Skill
        </button>
      </header>

      {skills.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No core skills added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((s) => (
            <SkillTile key={s.name} skill={s} />
          ))}
          <AddSkillTile />
        </div>
      )}
    </section>
  );
}
