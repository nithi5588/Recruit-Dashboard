import { SuitcaseIcon } from "@/components/icons/AppIcons";
import type { ResolvedJob } from "@/lib/jobs-data";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[13px] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
        {children}
      </span>
    </div>
  );
}

export function JobSummaryCard({ job }: { job: ResolvedJob }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
        >
          <SuitcaseIcon size={16} />
        </span>
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Job Summary
        </h3>
      </header>

      <div className="divide-y divide-[color:var(--color-border)]">
        <Row label="Source">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-brand"
          >
            {job.source}
          </a>
        </Row>
        <Row label="Posted">{job.postedAgo}</Row>
        <Row label="Job ID">{job.jobId}</Row>
        <Row label="Industries">{job.industries.join(", ")}</Row>
        <Row label="Employment Type">{job.jobType}</Row>
      </div>
    </section>
  );
}
