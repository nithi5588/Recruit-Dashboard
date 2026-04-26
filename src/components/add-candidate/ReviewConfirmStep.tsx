import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  BuildingsIcon,
  CalendarIcon,
  ClockIcon,
  CodeBracketsIcon,
  DocumentIcon,
  GraduationCapIcon,
  NoteLinesIcon,
  PhoneCircleIcon,
  PinIcon,
  SuitcaseIcon,
} from "@/components/icons/AppIcons";
import { MailIcon, UserIcon } from "@/components/icons/Icons";
import type { BasicDetails } from "@/components/add-candidate/BasicDetailsStep";
import {
  availabilityLabel,
  type AdditionalDetails,
} from "@/components/add-candidate/AdditionalDetailsStep";

const EXPERIENCE_LABELS: Record<string, string> = {
  "0-1": "0–1 year",
  "1-3": "1–3 years",
  "3-5": "3–5 years",
  "5-10": "5–10 years",
  "10+": "10+ years",
};

function InfoRow({
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
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#FCE9DD] text-[color:var(--color-brand-600)]"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">
          {label}
        </p>
        <p className="mt-0.5 break-words text-[13px] font-semibold text-[color:var(--color-text)]">
          {children}
        </p>
      </div>
    </div>
  );
}

function formatSalary(min: string, max: string) {
  if (!min && !max) return "Not specified";
  if (min && max) return `$${min} – $${max}`;
  return `$${min || max}`;
}

export function ReviewConfirmStep({
  basic,
  additional,
  resumeFile,
}: {
  basic: BasicDetails;
  additional: AdditionalDetails;
  resumeFile: File | null;
}) {
  const fullName = basic.fullName || "Savannah Nguyen";
  const email = basic.email || "savannah.nguyen@email.com";
  const phone = basic.phone
    ? `${basic.dialCode} ${basic.phone}`
    : "+1 (555) 987-6543";
  const jobTitle = basic.jobTitle || "Senior Product Designer";
  const company = basic.company || "DesignHub";
  const experienceLabel = basic.experience
    ? (EXPERIENCE_LABELS[basic.experience] ?? basic.experience)
    : "5+ years";

  const skills =
    "Figma, Adobe XD, Sketch, UI/UX Design, Prototyping, User Research";
  const education = "B.F.A in Design, University of Texas";
  const location =
    additional.preferredLocations.length > 0
      ? additional.preferredLocations.join(", ")
      : "Austin, TX (Open to Remote)";
  const noticePeriod = additional.availability
    ? availabilityLabel(additional.availability)
    : "2 Weeks";
  const resumeName = resumeFile?.name ?? "Savannah_Nguyen_Resume.pdf";
  const salaryText = formatSalary(additional.salaryMin, additional.salaryMax);

  return (
    <div className="space-y-4">
      <section
        className="rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
            Extracted Information
          </h3>
          <Badge tone="green">AI Confidence: High</Badge>
        </header>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <InfoRow icon={<UserIcon size={16} />} label="Full Name">
            {fullName}
          </InfoRow>
          <InfoRow icon={<GraduationCapIcon size={16} />} label="Education">
            {education}
          </InfoRow>

          <InfoRow icon={<MailIcon size={16} />} label="Email">
            {email}
          </InfoRow>
          <InfoRow icon={<CodeBracketsIcon size={16} />} label="Skills">
            {skills}
          </InfoRow>

          <InfoRow icon={<PhoneCircleIcon size={16} />} label="Phone">
            {phone}
          </InfoRow>
          <InfoRow icon={<PinIcon size={16} />} label="Location">
            {location}
          </InfoRow>

          <InfoRow icon={<SuitcaseIcon size={16} />} label="Current Title">
            {jobTitle}
          </InfoRow>
          <InfoRow icon={<CalendarIcon size={16} />} label="Notice Period">
            {noticePeriod}
          </InfoRow>

          <InfoRow icon={<BuildingsIcon size={16} />} label="Current Company">
            {company}
          </InfoRow>
          <InfoRow icon={<DocumentIcon size={16} />} label="Resume">
            <span className="inline-flex flex-wrap items-center gap-2">
              <span className="truncate">{resumeName}</span>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="link-brand text-[12px] font-semibold"
              >
                View
              </a>
            </span>
          </InfoRow>

          <InfoRow icon={<ClockIcon size={16} />} label="Years of Experience">
            {experienceLabel}
          </InfoRow>
          {additional.jobType ? (
            <InfoRow icon={<SuitcaseIcon size={16} />} label="Job Type">
              {additional.jobType}
              {salaryText !== "Not specified" ? (
                <span className="ml-1 font-normal text-[color:var(--color-text-secondary)]">
                  · {salaryText}
                </span>
              ) : null}
            </InfoRow>
          ) : null}
        </div>
      </section>

      <aside
        className="flex items-start gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] p-4"
        style={{
          background:
            "linear-gradient(180deg, #FFF6EE 0%, #FAFAF7 100%)",
        }}
      >
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-[color:var(--color-brand-600)] shadow-[var(--shadow-card)]"
        >
          <NoteLinesIcon size={18} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
            Looks good?
          </p>
          <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
            You can edit any details after the candidate profile is created.
          </p>
        </div>
      </aside>
    </div>
  );
}
