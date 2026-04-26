import { Badge } from "@/components/ui/Badge";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  ClockIcon,
  ExternalLinkIcon,
  PinIcon,
  TagIcon,
  VerifiedBadgeIcon,
} from "@/components/icons/AppIcons";
import type { ResolvedJob } from "@/lib/jobs-data";

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-brand-600)]">
      {label}
    </span>
  );
}

function statusTone(status: ResolvedJob["status"]) {
  if (status === "Open") return "green" as const;
  if (status === "Paused") return "amber" as const;
  return "gray" as const;
}

export function JobDetailHeader({ job }: { job: ResolvedJob }) {
  const visibleTags = job.tags.slice(0, 4);
  const extraTags = job.tags.length - visibleTags.length;

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <CompanyLogo
          company={job.company}
          size={104}
          fallbackBg={job.logo.bg}
          fallbackFg={job.logo.fg}
          fallbackText={job.logo.abbr}
          rounded="rounded-[20px]"
          padding={14}
          className="self-start"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[24px] font-bold leading-[32px] tracking-tight text-[color:var(--color-text)] sm:text-[28px] sm:leading-[36px]">
              {job.title}
            </h1>
            <Badge tone={statusTone(job.status)}>{job.status}</Badge>
          </div>

          <div className="mt-1 flex items-center gap-1.5">
            <p className="text-[15px] font-semibold text-[color:var(--color-text)]">
              {job.company}
            </p>
            {job.companyVerified ? (
              <span
                aria-label={`${job.company} is verified`}
                title="Verified company"
                className="text-[color:var(--color-brand-500)]"
              >
                <VerifiedBadgeIcon size={16} />
              </span>
            ) : null}
          </div>

          <dl className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[color:var(--color-text-secondary)]">
            <div className="inline-flex items-center gap-1.5">
              <PinIcon size={15} />
              <dt className="sr-only">Location</dt>
              <dd>{job.location}</dd>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <ClockIcon size={15} />
              <dt className="sr-only">Job type</dt>
              <dd>{job.jobType}</dd>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <TagIcon size={15} />
              <dt className="sr-only">Category</dt>
              <dd>{job.category}</dd>
            </div>
          </dl>

          <p className="mt-2 text-[12px] text-[color:var(--color-text-secondary)]">
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-600)]"
            >
              via {job.source}
              <ExternalLinkIcon size={12} />
            </a>
            <span className="mx-1.5 text-[color:var(--color-text-muted)]">·</span>
            <span>Posted {job.postedAgo}</span>
          </p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((t) => (
              <li key={t}>
                <Tag label={t} />
              </li>
            ))}
            {extraTags > 0 ? (
              <li>
                <span
                  title={job.tags.slice(4).join(", ")}
                  className="inline-flex items-center rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-text-secondary)]"
                >
                  +{extraTags}
                </span>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="shrink-0 lg:w-[260px] lg:pl-2">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-brand-500)] px-4 text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(234,104,20,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <ExternalLinkIcon size={16} />
            View on {job.source}
          </a>
          <p className="mt-3 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)] lg:text-left">
            You will be redirected to the original job posting
          </p>
        </div>
      </div>
    </section>
  );
}
