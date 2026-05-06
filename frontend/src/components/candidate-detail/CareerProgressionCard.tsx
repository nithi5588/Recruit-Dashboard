import type { ExperienceEntry } from "@/lib/candidate-detail";

export function CareerProgressionCard({
  experience,
}: {
  experience: ExperienceEntry[];
}) {
  if (experience.length === 0) return null;
  // Oldest first → newest at the bottom, matching the image.
  const ordered = [...experience].reverse();

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Career Progression
      </h3>

      <ol className="relative">
        {ordered.map((entry, idx) => {
          const isLast = idx === ordered.length - 1;
          const isCurrent = entry.current ?? false;
          return (
            <li
              key={`${entry.role}-${entry.company}`}
              className="relative flex gap-3 pb-5 last:pb-0"
            >
              <div className="relative flex w-3 shrink-0 justify-center">
                <span
                  aria-hidden
                  className={`relative z-10 mt-1.5 rounded-full ${
                    isCurrent
                      ? "h-3 w-3 bg-[color:var(--color-brand-500)] ring-4 ring-[color:var(--color-brand-100)]"
                      : "h-2.5 w-2.5 border-2 border-[color:var(--color-border-strong)] bg-white"
                  }`}
                />
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-5 w-px -translate-x-1/2 bg-[color:var(--color-border)]"
                    style={{ bottom: "-8px" }}
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`truncate text-[13px] font-semibold ${
                      isCurrent
                        ? "text-[color:var(--color-brand-600)]"
                        : "text-[color:var(--color-text)]"
                    }`}
                  >
                    {entry.role}
                  </p>
                  <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                    {entry.company}
                  </p>
                </div>
                <p className="shrink-0 text-[11px] text-[color:var(--color-text-muted)]">
                  {entry.period}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
