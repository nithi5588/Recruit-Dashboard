import type { ReactNode } from "react";
import {
  ClockIcon,
  InfoIcon,
  MoneyIcon,
  MonitorIcon,
  NoteLinesIcon,
  PinIcon,
  SuitcaseIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { ResolvedJob } from "@/lib/jobs-data";

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p className="mt-0.5 break-words text-[13px] font-semibold text-[color:var(--color-text)]">
          {children}
        </p>
      </div>
    </div>
  );
}

export function JobOverviewCard({ job }: { job: ResolvedJob }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
        >
          <NoteLinesIcon size={16} />
        </span>
        <h2 className="text-[16px] font-bold text-[color:var(--color-text)]">
          Overview
        </h2>
      </header>

      <p className="text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
        {job.description}
      </p>

      <hr className="my-5 border-[color:var(--color-border)]" />

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <DetailRow icon={<SuitcaseIcon size={18} />} label="Job Type">
          {job.jobType}
        </DetailRow>
        <DetailRow icon={<PinIcon size={18} />} label="Location">
          {job.location}
        </DetailRow>
        <DetailRow icon={<UsersIcon size={18} />} label="Department">
          {job.department}
        </DetailRow>
        <DetailRow icon={<ClockIcon size={18} />} label="Experience">
          {job.experience}
        </DetailRow>
        <DetailRow icon={<MoneyIcon size={18} />} label="Salary">
          {job.salary}
        </DetailRow>
        <DetailRow icon={<MonitorIcon size={18} />} label="Remote">
          {job.remote}
        </DetailRow>
      </dl>

      <aside
        className="mt-6 flex items-start gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] p-4"
        style={{
          background:
            "linear-gradient(180deg, #F2F3FD 0%, #FAFAFA 100%)",
        }}
      >
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--color-brand-600)]"
        >
          <InfoIcon size={16} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
            About the Source
          </p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
            This job is listed on {job.source}. Clicking the button above will
            take you to the original posting.
          </p>
        </div>
      </aside>
    </section>
  );
}
