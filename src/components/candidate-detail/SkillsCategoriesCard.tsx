import { DonutChart } from "@/components/ui/DonutChart";
import type { SkillCategory } from "@/lib/candidate-detail";

export function SkillsCategoriesCard({
  categories,
}: {
  categories: SkillCategory[];
}) {
  if (categories.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Skills Categories
        </h3>
        <p className="text-[12px] text-[color:var(--color-text-secondary)]">
          Breakdown by category
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-5">
        <DonutChart
          segments={categories.map((c) => ({
            name: c.name,
            value: c.count,
            color: c.color,
          }))}
          ariaLabel="Skills categories breakdown"
        />
        <ul className="flex-1 space-y-3">
          {categories.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between gap-3"
            >
              <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text)]">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c.color }}
                />
                {c.name}
              </span>
              <span className="text-[12px] text-[color:var(--color-text-secondary)]">
                {c.count} skills
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
