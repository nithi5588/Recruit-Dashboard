import { DonutChart } from "@/components/ui/DonutChart";
import type { SkillCategory } from "@/lib/candidate-detail";

// Muted palette aligned with the rest of the app — slate / plum / sage / clay
// at matched luminance so the donut reads as a calm gradient.
const MUTED_PALETTE = [
  "#7C82A6", // dusty slate-violet (brand-aligned)
  "#7E8A8A", // muted teal-sage
  "#8E7E94", // muted plum
  "#9A8A78", // warm clay
  "#7E8E76", // sage olive
  "#88869B", // cool slate
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
