import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CompanyLogo as RealCompanyLogo } from "@/components/ui/CompanyLogo";
import {
  ExternalLinkIcon,
  InboxIcon,
  MoreIcon,
  PlusIcon,
} from "@/components/icons/AppIcons";
import type { ApplicationEntry } from "@/lib/candidate-detail";
import {
  applicationStatusTone,
  stageDotColor,
} from "@/components/candidate-detail/applications-shared";

function CompanyLogo({
  logo,
  company,
}: {
  logo: ApplicationEntry["logo"];
  company: string;
}) {
  return (
    <RealCompanyLogo
      company={company}
      size={40}
      fallbackBg={logo.bg}
      fallbackFg={logo.fg}
      fallbackText={logo.abbr}
      rounded="rounded-[10px]"
      padding={5}
    />
  );
}

export function ApplicationsTableCard({
  applications,
}: {
  applications: ApplicationEntry[];
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Applications{" "}
            <span className="text-[color:var(--color-text-muted)]">
              ({applications.length})
            </span>
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Jobs this candidate has been applied to
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] px-3 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-100)]"
        >
          <PlusIcon size={14} />
          Add Application
        </button>
      </header>

      {applications.length === 0 ? (
        <div className="m-5 sm:m-6">
          <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-10 text-center">
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
            >
              <InboxIcon size={20} />
            </span>
            <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
              No applications yet
            </p>
            <p className="max-w-md text-[12px] text-[color:var(--color-text-secondary)]">
              When this candidate is applied to a role, it will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-text-secondary)]">
                  <th className="px-5 py-3 sm:px-6">Job</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="hidden py-3 pr-4 md:table-cell">Stage</th>
                  <th className="hidden py-3 pr-4 lg:table-cell">Applied On</th>
                  <th className="hidden py-3 pr-4 lg:table-cell">Recruiter</th>
                  <th className="py-3 pr-5 text-right sm:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[color:var(--color-border)] last:border-b-0 transition-colors hover:bg-[color:var(--color-surface-2)]/50"
                  >
                    <td className="px-5 py-4 align-middle sm:px-6">
                      <div className="flex items-center gap-3">
                        <CompanyLogo logo={app.logo} company={app.company} />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                            {app.jobTitle}
                          </p>
                          <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                            {app.company}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 align-middle">
                      <Badge tone={applicationStatusTone(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="hidden py-4 pr-4 align-middle md:table-cell">
                      <p className="inline-flex items-start gap-2 text-[13px] text-[color:var(--color-text)]">
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: stageDotColor(app.stage.dot) }}
                        />
                        <span className="leading-[18px]">{app.stage.label}</span>
                      </p>
                    </td>
                    <td className="hidden py-4 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] lg:table-cell">
                      {app.appliedOn}
                    </td>
                    <td className="hidden py-4 pr-4 align-middle lg:table-cell">
                      <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text)]">
                        <Avatar name={app.recruiter} size={26} />
                        {app.recruiter}
                      </span>
                    </td>
                    <td className="py-4 pr-5 text-right align-middle sm:pr-6">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-border-strong)]"
                        >
                          View
                          <ExternalLinkIcon size={12} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Actions for ${app.jobTitle} at ${app.company}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                        >
                          <MoreIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] px-5 py-8 text-center sm:px-6">
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
            >
              <InboxIcon size={22} />
            </span>
            <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
              No more applications
            </p>
            <p className="max-w-md text-[12px] text-[color:var(--color-text-secondary)]">
              This is all the applications for this candidate.
            </p>
          </footer>
        </>
      )}
    </section>
  );
}
