export function SkillsCard({ skills }: { skills: string[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
        Top Skills
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="inline-flex items-center rounded-[10px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-brand-600)]"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
