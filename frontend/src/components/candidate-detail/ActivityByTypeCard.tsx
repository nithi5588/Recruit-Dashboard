import { DonutChart } from "@/components/ui/DonutChart";
import type { ActivityByType } from "@/lib/candidate-detail";

export function ActivityByTypeCard({
  byType,
}: {
  byType: ActivityByType[];
}) {
  if (byType.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Activity by Type
      </h3>

      <div className="flex flex-wrap items-center gap-5">
        <DonutChart
          segments={byType.map((b) => ({
            name: b.name,
            value: b.count,
            color: b.color,
          }))}
          ariaLabel="Activity breakdown by type"
          size={130}
          stroke={22}
        />
        <ul className="flex-1 space-y-2.5">
          {byType.map((b) => (
            <li key={b.name} className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text)]">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: b.color }}
                />
                {b.name}
              </span>
              <span className="shrink-0 text-[12px] text-[color:var(--color-text-secondary)]">
                <span className="font-semibold text-[color:var(--color-text)]">
                  {b.count}
                </span>{" "}
                ({b.percent}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
