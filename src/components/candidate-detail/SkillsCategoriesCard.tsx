import { DonutChart } from "@/components/ui/DonutChart";
import type { SkillCategory } from "@/lib/candidate-detail";

// Muted palette aligned with the rest of the app — slate / plum / sage / clay
// at matched luminance so the donut reads as a calm gradient.
const MUTED_PALETTE = [
  "#9A9183", // dusty slate-violet (brand-aligned)
  "#9A9183", // muted teal-sage
  "#9A9183", // muted plum
  "#9A9183", // warm clay
  "#857B6C", // sage olive
  "#9A9183", // cool slate
];

function muteColor(_original: string, idx: number): string {
  return MUTED_PALETTE[idx % MUTED_PALETTE.length];
}

export function SkillsCategoriesCard({
  categories,
}: {
  categories: SkillCategory[];
}) {
  if (categories.length === 0) return null;

  const muted = categories.map((c, i) => ({
    ...c,
    color: muteColor(c.color, i),
  }));

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
          segments={muted.map((c) => ({
            name: c.name,
            value: c.count,
            color: c.color,
          }))}
          ariaLabel="Skills categories breakdown"
        />
        <ul className="flex-1 space-y-3">
          {muted.map((c) => (
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
