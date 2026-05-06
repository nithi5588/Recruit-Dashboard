import { Badge } from "@/components/ui/Badge";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import type { ApplicationsBlock } from "@/lib/candidate-detail";
import { applicationStatusTone } from "@/components/candidate-detail/applications-shared";

export function TopAppliedJobCard({
  top,
}: {
  top: ApplicationsBlock["topApplied"];
}) {
  if (!top) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Top Applied Job
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CompanyLogo
            company={top.company}
            size={44}
            fallbackBg={top.logo.bg}
            fallbackFg={top.logo.fg}
            fallbackText={top.logo.abbr}
            rounded="rounded-[12px]"
            padding={6}
          />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[color:var(--color-text)]">
              {top.jobTitle}
            </p>
            <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
              {top.company}
            </p>
          </div>
        </div>
        <Badge tone={applicationStatusTone(top.status)}>{top.status}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[color:var(--color-border)] pt-4">
        <div>
          <p className="text-[20px] font-bold leading-[24px] text-[color:var(--color-text)]">
            {top.applicationCount}
          </p>
          <p className="text-[11px] text-[color:var(--color-text-secondary)]">
            {top.applicationCount === 1 ? "Application" : "Applications"}
          </p>
        </div>
        <div>
          <p className="text-[20px] font-bold leading-[24px] text-[color:var(--color-brand-600)]">
            {top.percentOfTotal}%
          </p>
          <p className="text-[11px] text-[color:var(--color-text-secondary)]">
            Of total applications
          </p>
        </div>
      </div>
    </section>
  );
}
