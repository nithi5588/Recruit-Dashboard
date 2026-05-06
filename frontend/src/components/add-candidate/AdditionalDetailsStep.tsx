"use client";

import { useId, type ReactNode } from "react";
import { MultiSelect } from "@/components/ui/MultiSelect";
import {
  CalendarIcon,
  ClockIcon,
  GlobeIcon,
} from "@/components/icons/AppIcons";
import { ChevronDownIcon } from "@/components/icons/Icons";

export type JobType = "Full-time" | "Part-time" | "Contract";

export type AdditionalDetails = {
  preferredLocations: string[];
  jobType: JobType | "";
  salaryMin: string;
  salaryMax: string;
  availability: string;
};

export const emptyAdditionalDetails: AdditionalDetails = {
  preferredLocations: [],
  jobType: "Full-time",
  salaryMin: "",
  salaryMax: "",
  availability: "",
};

const LOCATION_OPTIONS = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Toronto, Canada",
  "London, UK",
  "Remote - US",
  "Remote - Global",
];

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately" },
  { value: "1w", label: "Within 1 week" },
  { value: "2w", label: "Within 2 weeks" },
  { value: "1m", label: "Within 1 month" },
  { value: "3m", label: "Within 3 months" },
  { value: "passive", label: "Passive / Exploring" },
];

const JOB_TYPES: { value: JobType; icon: ReactNode }[] = [
  { value: "Full-time", icon: <CalendarIcon size={16} /> },
  { value: "Part-time", icon: <ClockIcon size={16} /> },
  { value: "Contract", icon: <GlobeIcon size={16} /> },
];

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text)]"
    >
      {children}
    </label>
  );
}

function JobTypeCard({
  type,
  icon,
  selected,
  onSelect,
}: {
  type: JobType;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-[12px] border bg-[color:var(--color-surface)] p-3 transition-colors ${
        selected
          ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-50)]"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      <input
        type="radio"
        name="job-type"
        value={type}
        checked={selected}
        onChange={onSelect}
        className="h-4 w-4 shrink-0 accent-[color:var(--color-brand-500)]"
      />
      <span
        aria-hidden
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
          selected
            ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
            : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-[13px] font-semibold ${
          selected
            ? "text-[color:var(--color-brand-600)]"
            : "text-[color:var(--color-text)]"
        }`}
      >
        {type}
      </span>
    </label>
  );
}

export function AdditionalDetailsStep({
  values,
  onChange,
}: {
  values: AdditionalDetails;
  onChange: <K extends keyof AdditionalDetails>(
    key: K,
    value: AdditionalDetails[K],
  ) => void;
}) {
  const minId = useId();
  const maxId = useId();
  const availabilityId = useId();

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Preferred Locations</FieldLabel>
        <MultiSelect
          placeholder="Select preferred locations"
          options={LOCATION_OPTIONS}
          values={values.preferredLocations}
          onChange={(v) => onChange("preferredLocations", v)}
        />
        <p className="mt-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
          You can select multiple locations
        </p>
      </div>

      <div>
        <FieldLabel>Job Types</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {JOB_TYPES.map((t) => (
            <JobTypeCard
              key={t.value}
              type={t.value}
              icon={t.icon}
              selected={values.jobType === t.value}
              onSelect={() => onChange("jobType", t.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Expected Salary (USD)</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor={minId}
              className="mb-1.5 block text-[12px] font-medium text-[color:var(--color-text-secondary)]"
            >
              Minimum (Optional)
            </label>
            <input
              id={minId}
              type="text"
              inputMode="numeric"
              value={values.salaryMin}
              onChange={(e) => onChange("salaryMin", e.target.value)}
              placeholder="e.g. 80,000"
              className="h-11 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[14px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </div>
          <div>
            <label
              htmlFor={maxId}
              className="mb-1.5 block text-[12px] font-medium text-[color:var(--color-text-secondary)]"
            >
              Maximum (Optional)
            </label>
            <input
              id={maxId}
              type="text"
              inputMode="numeric"
              value={values.salaryMax}
              onChange={(e) => onChange("salaryMax", e.target.value)}
              placeholder="e.g. 120,000"
              className="h-11 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[14px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor={availabilityId}>Availability</FieldLabel>
        <div className="relative">
          <select
            id={availabilityId}
            value={values.availability}
            onChange={(e) => onChange("availability", e.target.value)}
            className="h-11 w-full appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 pr-9 text-[14px] text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
          >
            <option value="" disabled>
              Select availability
            </option>
            {AVAILABILITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
        </div>
      </div>
    </div>
  );
}

export function availabilityLabel(value: string): string {
  return AVAILABILITY_OPTIONS.find((o) => o.value === value)?.label ?? "—";
}
