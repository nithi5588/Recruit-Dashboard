"use client";

import Link from "next/link";
import {
  BookmarkIcon,
  ClockIcon,
  ExternalLinkIcon,
  MoreIcon,
  PinIcon,
  TagIcon,
} from "@/components/icons/AppIcons";
import { CompanyLogo as RealCompanyLogo } from "@/components/ui/CompanyLogo";
import type { Job } from "@/lib/jobs-data";

type Variant = "list" | "grid";

function CompanyLogo({ job, size = 44 }: { job: Job; size?: number }) {
  return (
    <RealCompanyLogo
      company={job.company}
      size={size}
      fallbackBg={job.logo.bg}
      fallbackFg={job.logo.fg}
      fallbackText={job.logo.abbr}
      rounded="rounded-[12px]"
      padding={size >= 44 ? 6 : 4}
    />
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] px-2 py-0.5 text-[11px] font-semibold leading-[16px] text-[color:var(--color-brand-600)]">
      {label}
    </span>
  );
}

function MetaDot({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
      {children}
    </span>
  );
}

function SaveButton({
  saved,
  onToggle,
}: {
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save job"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors ${
        saved
          ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
          : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
      }`}
    >
      <BookmarkIcon size={16} />
    </button>
  );
}

function MoreButton({ title }: { title: string }) {
  return (
    <button
      type="button"
      aria-label={`More actions for ${title}`}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
    >
      <MoreIcon size={16} />
    </button>
  );
}

export function JobCard({
  job,
  saved,
  onToggleSaved,
  variant = "list",
}: {
  job: Job;
  saved: boolean;
  onToggleSaved: () => void;
  variant?: Variant;
}) {
  if (variant === "grid") {
    return <JobCardGrid job={job} saved={saved} onToggleSaved={onToggleSaved} />;
  }
  return <JobCardList job={job} saved={saved} onToggleSaved={onToggleSaved} />;
}

function JobCardList({
  job,
  saved,
  onToggleSaved,
}: {
  job: Job;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const visibleTags = job.tags.slice(0, 4);
  const extraTags = job.tags.length - visibleTags.length;

  return (
    <article className="group relative rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3.5 transition-all hover:border-[color:var(--color-brand-300)] hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3.5">
        <CompanyLogo job={job} size={44} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <h3 className="truncate text-[15px] font-semibold leading-[20px] text-[color:var(--color-text)]">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="transition-colors hover:text-[color:var(--color-brand-600)]"
                  >
                    {job.title}
                  </Link>
                </h3>
                <span className="text-[13px] text-[color:var(--color-text-secondary)]">
                  · {job.company}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1">
                <MetaDot>
                  <PinIcon size={12} />
                  <span className="truncate max-w-[180px]">{job.location}</span>
                </MetaDot>
                <MetaDot>
                  <ClockIcon size={12} />
                  <span>{job.jobType}</span>
                </MetaDot>
                <MetaDot>
                  <TagIcon size={12} />
                  <span>{job.category}</span>
                </MetaDot>
                <span className="text-[11px] text-[color:var(--color-text-muted)]">
                  {job.postedAgo}
                </span>
              </div>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {visibleTags.map((t) => (
                  <li key={t}>
                    <Tag label={t} />
                  </li>
                ))}
                {extraTags > 0 ? (
                  <li>
                    <span
                      title={job.tags.slice(4).join(", ")}
                      className="inline-flex items-center rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-semibold leading-[16px] text-[color:var(--color-text-secondary)]"
                    >
                      +{extraTags}
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <SaveButton saved={saved} onToggle={onToggleSaved} />
                <MoreButton title={job.title} />
              </div>
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
              >
                via {job.source}
                <ExternalLinkIcon size={11} />
              </a>
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex h-8 items-center rounded-[8px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function JobCardGrid({
  job,
  saved,
  onToggleSaved,
}: {
  job: Job;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const visibleTags = job.tags.slice(0, 3);
  const extraTags = job.tags.length - visibleTags.length;

  return (
    <article className="group relative flex h-full flex-col rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition-all hover:border-[color:var(--color-brand-300)] hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-2">
        <CompanyLogo job={job} size={40} />
        <div className="flex items-center gap-0.5">
          <SaveButton saved={saved} onToggle={onToggleSaved} />
          <MoreButton title={job.title} />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-[14px] font-semibold leading-[20px] text-[color:var(--color-text)] line-clamp-2">
          <Link
            href={`/jobs/${job.id}`}
            className="transition-colors hover:text-[color:var(--color-brand-600)]"
          >
            {job.title}
          </Link>
        </h3>
        <p className="mt-0.5 truncate text-[12px] text-[color:var(--color-text-secondary)]">
          {job.company}
        </p>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <MetaDot>
          <PinIcon size={12} />
          <span className="truncate max-w-[130px]">{job.location}</span>
        </MetaDot>
        <MetaDot>
          <ClockIcon size={12} />
          <span>{job.jobType}</span>
        </MetaDot>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {visibleTags.map((t) => (
          <li key={t}>
            <Tag label={t} />
          </li>
        ))}
        {extraTags > 0 ? (
          <li>
            <span
              title={job.tags.slice(3).join(", ")}
              className="inline-flex items-center rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-semibold leading-[16px] text-[color:var(--color-text-secondary)]"
            >
              +{extraTags}
            </span>
          </li>
        ) : null}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <div className="min-w-0">
          <a
            href={job.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 truncate text-[11px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
          >
            via {job.source}
            <ExternalLinkIcon size={11} />
          </a>
          <p className="text-[11px] text-[color:var(--color-text-muted)]">
            {job.postedAgo}
          </p>
        </div>
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex h-8 items-center rounded-[8px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
        >
          View
        </Link>
      </div>
    </article>
  );
}
