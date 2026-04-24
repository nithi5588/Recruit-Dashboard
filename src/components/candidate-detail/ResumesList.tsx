"use client";

import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { PdfFileIcon } from "@/components/candidate-detail/PdfFileIcon";
import { MoreIcon, UploadIcon } from "@/components/icons/AppIcons";
import type { Resume, ResumeStatus } from "@/lib/candidate-detail";

function statusBadgeTone(s: ResumeStatus): BadgeTone {
  if (s === "Active") return "green";
  return "gray";
}

function ResumeRow({
  resume,
  active,
  onSelect,
}: {
  resume: Resume;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={`flex w-full items-center gap-3 rounded-[14px] border p-3 text-left transition-colors ${
          active
            ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] ring-1 ring-[color:var(--color-brand-200)]"
            : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)]"
        }`}
      >
        <PdfFileIcon size={44} activeDot={resume.status === "Active"} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
            {resume.name}
          </p>
          <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
            Uploaded on {resume.uploadedOn} · {resume.size}
          </p>
        </div>
        <Badge tone={statusBadgeTone(resume.status)}>{resume.status}</Badge>
        <span
          role="presentation"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
        >
          <MoreIcon />
        </span>
      </button>
    </li>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 11v5M12 8v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ResumesList({
  resumes,
  activeId,
  onSelect,
}: {
  resumes: Resume[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Resumes{" "}
            <span className="text-[color:var(--color-text-muted)]">
              ({resumes.length})
            </span>
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Manage and track candidate resumes
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
        >
          <UploadIcon size={16} />
          Upload New Resume
        </button>
      </header>

      {resumes.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No resumes uploaded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {resumes.map((r) => (
            <ResumeRow
              key={r.id}
              resume={r}
              active={activeId === r.id}
              onSelect={() => onSelect(r.id)}
            />
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4">
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-info-light)] text-[color:var(--color-info)]"
        >
          <InfoIcon />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
            Active Resume
          </p>
          <p className="text-[12px] text-[color:var(--color-text-secondary)]">
            This resume will be used for job applications and submissions.
          </p>
        </div>
      </div>
    </section>
  );
}
