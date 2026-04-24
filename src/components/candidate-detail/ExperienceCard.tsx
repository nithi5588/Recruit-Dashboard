import Link from "next/link";
import type { ExperienceEntry } from "@/lib/candidate-detail";
import { ChevronRight } from "@/components/icons/AppIcons";

export function ExperienceCard({
  experience,
  candidateId,
}: {
  experience: ExperienceEntry[];
  candidateId: string;
}) {
  if (experience.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
          Experience
        </h2>
        <Link
          href={`/candidates/${candidateId}/experience`}
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </header>

      <ol className="relative">
        {experience.map((entry, idx) => {
          const isLast = idx === experience.length - 1;
          return (
            <li key={`${entry.role}-${entry.company}`} className="relative pl-12">
              <span
                aria-hidden
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-[10px] text-[12px] font-bold"
                style={{ background: entry.logoBg, color: entry.logoFg }}
              >
                {entry.logoAbbr}
              </span>
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[17px] top-10 bottom-0 w-px bg-[color:var(--color-border)]"
                />
              ) : null}
              <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
                  {entry.role}
                </p>
                <p className="text-[13px] text-[color:var(--color-text-secondary)]">
                  {entry.company}
                </p>
                <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">
                  {entry.period} · {entry.duration}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {entry.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]"
                    >
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--color-text-muted)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
