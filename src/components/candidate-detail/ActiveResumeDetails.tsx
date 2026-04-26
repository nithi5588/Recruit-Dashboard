import { Badge } from "@/components/ui/Badge";
import { PdfFileIcon } from "@/components/candidate-detail/PdfFileIcon";
import {
  DownloadIcon,
  MoreIcon,
  RefreshIcon,
} from "@/components/icons/AppIcons";
import { EyeIcon } from "@/components/icons/Icons";
import type { Resume } from "@/lib/candidate-detail";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-baseline sm:gap-4">
      <dt className="text-[12px] text-[color:var(--color-text-secondary)]">
        {label}
      </dt>
      <dd className="text-[13px] font-medium text-[color:var(--color-text)]">
        {children}
      </dd>
    </div>
  );
}

function TagChip({ label, add = false }: { label: string; add?: boolean }) {
  if (add) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-[10px] border border-dashed border-[color:var(--color-brand-300)] px-2.5 py-1.5 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
      >
        <span aria-hidden>+</span>
        {label}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[10px] bg-[color:var(--color-surface-2)] px-2.5 py-1.5 text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <section
      className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center"
    >
      <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
        Select a resume to view details
      </p>
      <p className="text-[13px] text-[color:var(--color-text-secondary)]">
        Choose any resume from the list to preview metadata, tags, and usage.
      </p>
    </section>
  );
}

export function ActiveResumeDetails({ resume }: { resume: Resume | null }) {
  if (!resume) return <EmptyState />;

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex flex-wrap items-center gap-3">
        <PdfFileIcon size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[color:var(--color-text)]">
            {resume.name}
          </p>
          <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
            Uploaded on {resume.uploadedOn} · {resume.size}
          </p>
        </div>
        <Badge tone={resume.status === "Active" ? "green" : "gray"}>
          {resume.status}
        </Badge>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(234,104,20,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)] sm:flex-initial"
        >
          <EyeIcon size={16} />
          Preview
        </button>
        <button
          type="button"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] sm:flex-initial"
        >
          <DownloadIcon size={16} />
          Download
        </button>
        <button
          type="button"
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] sm:flex-initial"
        >
          <RefreshIcon size={16} />
          Replace
        </button>
        <button
          type="button"
          aria-label="More actions"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
        >
          <MoreIcon />
        </button>
      </div>

      <div className="mt-6 border-t border-[color:var(--color-border)] pt-4">
        <h3 className="mb-2 text-[14px] font-semibold text-[color:var(--color-text)]">
          Resume Details
        </h3>
        <dl className="divide-y divide-[color:var(--color-border)]">
          <Row label="Resume Name">{resume.name}</Row>
          {resume.type ? (
            <Row label="Resume Type">
              <Badge tone="purple">{resume.type}</Badge>
            </Row>
          ) : null}
          {resume.bestForRoles && resume.bestForRoles.length > 0 ? (
            <Row label="Best For Roles">
              {resume.bestForRoles.join(", ")}
            </Row>
          ) : null}
          {resume.lastUsedDate ? (
            <Row label="Last Used">
              {resume.lastUsedDate}
              {resume.lastUsedRole && resume.lastUsedCompany ? (
                <>
                  {" "}in {resume.lastUsedRole} role at{" "}
                  <a
                    href="#"
                    className="link-brand underline-offset-2 hover:underline"
                  >
                    {resume.lastUsedCompany}
                  </a>
                </>
              ) : null}
            </Row>
          ) : null}
          {typeof resume.usedInApplications === "number" ? (
            <Row label="Used In Applications">{resume.usedInApplications}</Row>
          ) : null}
          {resume.notes ? <Row label="Notes">{resume.notes}</Row> : null}
        </dl>
      </div>

      {resume.tags && resume.tags.length > 0 ? (
        <div className="mt-6 border-t border-[color:var(--color-border)] pt-4">
          <h3 className="mb-3 text-[14px] font-semibold text-[color:var(--color-text)]">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.tags.map((t) => (
              <TagChip key={t} label={t} />
            ))}
            <TagChip label="Add Tag" add />
          </div>
        </div>
      ) : null}
    </section>
  );
}
