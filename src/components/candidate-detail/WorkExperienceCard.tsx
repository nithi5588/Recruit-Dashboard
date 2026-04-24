import { Badge } from "@/components/ui/Badge";
import { MoreIcon, PlusIcon } from "@/components/icons/AppIcons";
import type { ExperienceEntry } from "@/lib/candidate-detail";

function CompanyLogo({ entry }: { entry: ExperienceEntry }) {
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[13px] font-bold"
      style={{ background: entry.logoBg, color: entry.logoFg }}
    >
      {entry.logoAbbr}
    </span>
  );
}

export function WorkExperienceCard({
  experience,
}: {
  experience: ExperienceEntry[];
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Work Experience
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Full career history and key achievements
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
        >
          <PlusIcon size={14} />
          Add Experience
        </button>
      </header>

      {experience.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No work experience added yet.
        </p>
      ) : (
        <ol className="space-y-6">
          {experience.map((entry, idx) => {
            const isLast = idx === experience.length - 1;
            const current = entry.current ?? false;
            return (
              <li
                key={`${entry.role}-${entry.company}`}
                className="relative flex gap-3 sm:gap-4"
              >
                <CompanyLogo entry={entry} />

                <div className="relative flex w-3 shrink-0 justify-center">
                  <span
                    aria-hidden
                    className={`relative z-10 mt-4 rounded-full ${
                      current
                        ? "h-3 w-3 bg-[color:var(--color-brand-500)] ring-4 ring-[color:var(--color-brand-100)]"
                        : "h-2 w-2 bg-[color:var(--color-text-muted)]"
                    }`}
                  />
                  {!isLast ? (
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-8 w-px -translate-x-1/2 bg-[color:var(--color-border)]"
                      style={{ bottom: "-24px" }}
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <header className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
                        {entry.role}
                      </h3>
                      <p className="text-[13px] font-semibold text-[color:var(--color-brand-600)]">
                        {entry.company}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">
                        {entry.period} · {entry.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {current ? <Badge tone="green">Current</Badge> : null}
                      <button
                        type="button"
                        aria-label={`Actions for ${entry.role}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                      >
                        <MoreIcon />
                      </button>
                    </div>
                  </header>

                  <ul className="mt-3 space-y-1.5">
                    {entry.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-text-muted)]"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
