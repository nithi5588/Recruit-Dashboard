import { Teacher } from "iconsax-reactjs";
import type { EducationEntry } from "@/lib/candidate-detail";

export function EducationCard({ education }: { education: EducationEntry[] }) {
  if (education.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
        Education
      </h2>

      <ul className="mt-4 space-y-4">
        {education.map((e) => (
          <li key={e.degree + e.school} className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[color:var(--color-brand-600)]"
            >
              <Teacher size={20} color="currentColor" variant="Linear" />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
                {e.degree}
              </p>
              <p className="text-[13px] text-[color:var(--color-text-secondary)]">
                {e.school}
              </p>
              <p className="mt-0.5 text-[12px] text-[color:var(--color-text-muted)]">
                {e.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
