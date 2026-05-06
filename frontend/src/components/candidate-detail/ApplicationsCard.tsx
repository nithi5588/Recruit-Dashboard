import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, MoreIcon } from "@/components/icons/AppIcons";
import type { ApplicationEntry } from "@/lib/candidate-detail";
import { applicationStatusTone } from "@/components/candidate-detail/applications-shared";

export function ApplicationsCard({
  applications,
  candidateId,
  totalCount,
}: {
  applications: ApplicationEntry[];
  candidateId: string;
  totalCount?: number;
}) {
  const count = totalCount ?? applications.length;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Applications{" "}
          <span className="text-[color:var(--color-text-muted)]">
            ({count})
          </span>
        </h3>
        <Link
          href={`/candidates/${candidateId}/applications`}
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </header>

      {applications.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-6 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No applications yet.
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--color-border)]">
          {applications.map((app) => (
            <li
              key={app.id}
              className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                  {app.jobTitle}
                </p>
                <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                  {app.company}
                </p>
                <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">
                  {app.appliedOn}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge tone={applicationStatusTone(app.status)}>
                  {app.status}
                </Badge>
                <button
                  type="button"
                  aria-label={`Actions for ${app.jobTitle}`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                >
                  <MoreIcon size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
