import type { ReactNode } from "react";
import type { CandidateDetail } from "@/lib/candidate-detail";
import type { Candidate } from "@/lib/sample-data";
import {
  AtIcon,
  BuildingsIcon,
  ClockIcon,
  MoneyIcon,
  PhoneCircleIcon,
  PinIcon,
  PlaneIcon,
  ShieldIcon,
  SuitcaseIcon,
} from "@/components/icons/AppIcons";

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
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p className="mt-0.5 break-words text-[13px] font-medium text-[color:var(--color-text)]">
          {children}
        </p>
      </div>
    </div>
  );
}

export function AboutCard({
  detail,
  candidate,
}: {
  detail: CandidateDetail;
  candidate: Candidate;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
        About
      </h2>
      <p className="mt-3 text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
        {detail.bio}
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <DetailRow icon={<PhoneCircleIcon size={16} />} label="Phone">
          {detail.phone}
        </DetailRow>
        <DetailRow icon={<SuitcaseIcon size={16} />} label="Experience">
          {candidate.experience}
        </DetailRow>
        <DetailRow icon={<AtIcon size={16} />} label="Email">
          {detail.email}
        </DetailRow>
        <DetailRow icon={<MoneyIcon size={16} />} label="Current Salary">
          {detail.currentSalary}
        </DetailRow>
        <DetailRow icon={<PinIcon size={16} />} label="Current Location">
          {detail.currentLocation}
        </DetailRow>
        <DetailRow icon={<MoneyIcon size={16} />} label="Expected Salary">
          {detail.expectedSalary}
        </DetailRow>
        <DetailRow icon={<ShieldIcon size={16} />} label="Work Authorization">
          {detail.workAuthorization}
        </DetailRow>
        <DetailRow icon={<BuildingsIcon size={16} />} label="Industry Preference">
          {detail.industryPreference}
        </DetailRow>
        <DetailRow icon={<ClockIcon size={16} />} label="Notice Period">
          {detail.noticePeriod}
        </DetailRow>
        <DetailRow icon={<PlaneIcon size={16} />} label="Relocation">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-[#EA6814]"
            />
            {detail.relocation}
          </span>
        </DetailRow>
      </dl>
    </section>
  );
}
