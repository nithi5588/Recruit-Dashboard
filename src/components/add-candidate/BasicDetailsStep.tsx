"use client";

import { useId, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons/Icons";

export type BasicDetails = {
  fullName: string;
  email: string;
  dialCode: string;
  phone: string;
  jobTitle: string;
  company: string;
  experience: string;
};

export type BasicDetailsErrors = Partial<Record<keyof BasicDetails, string>>;

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  required?: boolean;
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

function TextField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[14px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)] aria-[invalid=true]:border-[color:var(--color-error)] aria-[invalid=true]:shadow-[0_0_0_4px_rgba(159,67,13,0.12)]"
      />
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-[12px] text-[color:var(--color-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PhoneField({
  label,
  required,
  dialCode,
  phone,
  onDialChange,
  onPhoneChange,
  error,
}: {
  label: string;
  required?: boolean;
  dialCode: string;
  phone: string;
  onDialChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div className="flex">
        <label className="relative">
          <span className="sr-only">Country dial code</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[16px]">
            🇺🇸
          </span>
          <select
            value={dialCode}
            onChange={(e) => onDialChange(e.target.value)}
            className="h-11 appearance-none rounded-l-[10px] border border-r-0 border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] pl-9 pr-8 text-[13px] font-semibold text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
          >
            <option value="+1">+1</option>
            <option value="+44">+44</option>
            <option value="+91">+91</option>
            <option value="+61">+61</option>
            <option value="+971">+971</option>
          </select>
          <ChevronDownIcon
            size={12}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
        </label>
        <input
          id={id}
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(555) 123-4567"
          autoComplete="tel-national"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-11 w-full rounded-r-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[14px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)] aria-[invalid=true]:border-[color:var(--color-error)] aria-[invalid=true]:shadow-[0_0_0_4px_rgba(159,67,13,0.12)]"
        />
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-[12px] text-[color:var(--color-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0–1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "10+ years" },
];

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 pr-9 text-[14px] text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
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
  );
}

export function BasicDetailsStep({
  values,
  errors,
  onChange,
}: {
  values: BasicDetails;
  errors: BasicDetailsErrors;
  onChange: <K extends keyof BasicDetails>(key: K, value: BasicDetails[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Full Name"
        required
        value={values.fullName}
        onChange={(v) => onChange("fullName", v)}
        placeholder="e.g. John Doe"
        autoComplete="name"
        error={errors.fullName}
      />
      <TextField
        label="Email"
        required
        type="email"
        value={values.email}
        onChange={(v) => onChange("email", v)}
        placeholder="e.g. john.doe@example.com"
        autoComplete="email"
        error={errors.email}
      />

      <PhoneField
        label="Phone Number"
        required
        dialCode={values.dialCode}
        phone={values.phone}
        onDialChange={(v) => onChange("dialCode", v)}
        onPhoneChange={(v) => onChange("phone", v)}
        error={errors.phone}
      />
      <TextField
        label="Current Job Title"
        value={values.jobTitle}
        onChange={(v) => onChange("jobTitle", v)}
        placeholder="e.g. Senior Software Engineer"
        autoComplete="organization-title"
      />

      <TextField
        label="Current Company"
        value={values.company}
        onChange={(v) => onChange("company", v)}
        placeholder="e.g. Acme Inc."
        autoComplete="organization"
      />
      <SelectField
        label="Years of Experience"
        value={values.experience}
        onChange={(v) => onChange("experience", v)}
        placeholder="Select experience"
        options={EXPERIENCE_OPTIONS}
      />
    </div>
  );
}

export function validateBasicDetails(v: BasicDetails): BasicDetailsErrors {
  const errs: BasicDetailsErrors = {};
  if (!v.fullName.trim()) errs.fullName = "Enter the candidate's full name";
  if (!v.email.trim()) errs.email = "Enter an email address";
  else if (!/^\S+@\S+\.\S+$/.test(v.email))
    errs.email = "Enter a valid email address";
  if (!v.phone.trim()) errs.phone = "Enter a phone number";
  return errs;
}

export const emptyBasicDetails: BasicDetails = {
  fullName: "",
  email: "",
  dialCode: "+1",
  phone: "",
  jobTitle: "",
  company: "",
  experience: "",
};
