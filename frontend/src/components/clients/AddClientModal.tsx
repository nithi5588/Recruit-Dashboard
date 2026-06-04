"use client";

import { useEffect, useRef, useState } from "react";
import {
  AtIcon,
  BuildingsIcon,
  ChevronDown,
  DocumentIcon,
  GlobeIcon,
  IdCardIcon,
  PhoneIcon,
  PinIcon,
  ProfileIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { clientAccountManagers, type ClientType } from "@/lib/clients-data";

const PURPLE = "var(--color-brand-500)";

const INDUSTRY_OPTIONS = [
  "SaaS",
  "Fintech",
  "Banking",
  "Healthcare",
  "Retail",
  "Startup",
  "Manufacturing",
  "Consulting",
  "Vendor/Prime",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "501–1,000 employees",
  "1,000–5,000 employees",
  "5,000+ employees",
];

export type NewClientDraft = {
  company: string;
  website: string;
  industry: string;
  companySize: string;
  location: string;
  type: ClientType;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  accountManager: string;
  permanentFee: string;
  contractMarkup: string;
};

const EMPTY_DRAFT: NewClientDraft = {
  company: "",
  website: "",
  industry: "",
  companySize: "",
  location: "",
  type: "Direct",
  contactName: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  accountManager: "",
  permanentFee: "",
  contractMarkup: "",
};

/* ── Reusable field label ─────────────────────────────────────────────────── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-[12.5px] font-medium text-[color:var(--color-text)]">
      {children}
      {required ? <span className="ml-0.5 text-[color:var(--color-error,#EF4444)]">*</span> : null}
    </label>
  );
}

const INPUT_CLASS =
  "h-11 w-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[13.5px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]";

/* ── Text input with optional leading icon ────────────────────────────────── */
function TextField({
  icon,
  ...props
}: { icon?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
          {icon}
        </span>
      ) : null}
      <input {...props} className={`${INPUT_CLASS} ${icon ? "pl-9 pr-3" : "px-3"}`} />
    </div>
  );
}

/* ── Custom select dropdown ───────────────────────────────────────────────── */
function SelectField({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${INPUT_CLASS} flex items-center justify-between px-3 text-left`}
      >
        <span className={value ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-muted)]"}>
          {value || placeholder}
        </span>
        <ChevronDown size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 z-30 mt-1 max-h-56 overflow-y-auto rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-1 shadow-[var(--shadow-dropdown)]">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-[13.5px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                o === value
                  ? "font-semibold text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)]"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Section heading with icon ────────────────────────────────────────────── */
function SectionHeading({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[color:var(--color-brand-600)]">{icon}</span>
      <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">{title}</h3>
      {hint ? (
        <span className="text-[12.5px] font-normal text-[color:var(--color-text-muted)]">{hint}</span>
      ) : null}
    </div>
  );
}

/* ── Add Client modal ─────────────────────────────────────────────────────── */
export function AddClientModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate?: (draft: NewClientDraft) => void;
}) {
  const [draft, setDraft] = useState<NewClientDraft>(EMPTY_DRAFT);

  // Reset the form each time the modal is opened.
  useEffect(() => {
    if (open) setDraft(EMPTY_DRAFT);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof NewClientDraft>(key: K, val: NewClientDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  const canSubmit =
    draft.company.trim() &&
    draft.location.trim() &&
    draft.contactName.trim() &&
    draft.contactTitle.trim() &&
    draft.accountManager.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate?.(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(23,26,43,0.45)] px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add New Client"
    >
      <div
        className="relative w-full max-w-[560px] rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-panel)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-6 py-5">
          <h2 className="text-[18px] font-bold text-[color:var(--color-text)]">Add New Client</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Company */}
          <section className="space-y-4">
            <SectionHeading icon={<BuildingsIcon size={18} />} title="Company" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Company name</FieldLabel>
                <TextField
                  icon={<BuildingsIcon size={16} />}
                  placeholder="Enter company name"
                  value={draft.company}
                  onChange={(e) => set("company", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Website</FieldLabel>
                <TextField
                  icon={<GlobeIcon size={16} />}
                  placeholder="https://company.com"
                  value={draft.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Industry</FieldLabel>
                <SelectField
                  value={draft.industry}
                  placeholder="Select industry"
                  options={INDUSTRY_OPTIONS}
                  onChange={(v) => set("industry", v)}
                />
              </div>
              <div>
                <FieldLabel>Company size</FieldLabel>
                <SelectField
                  value={draft.companySize}
                  placeholder="Select company size"
                  options={COMPANY_SIZE_OPTIONS}
                  onChange={(v) => set("companySize", v)}
                />
              </div>
            </div>
            <div>
              <FieldLabel required>Location</FieldLabel>
              <TextField
                icon={<PinIcon size={16} />}
                placeholder="City, State, Country"
                value={draft.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </section>

          {/* Type */}
          <section className="space-y-3">
            <SectionHeading icon={<IdCardIcon size={18} />} title="Type" />
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "Direct" as ClientType, label: "Direct Client", icon: <ProfileIcon size={16} /> },
                  { value: "Vendor" as ClientType, label: "Vendor-Prime", icon: <BuildingsIcon size={16} /> },
                ]
              ).map((opt) => {
                const active = draft.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("type", opt.value)}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-[12px] border text-[13.5px] font-semibold transition-colors ${
                      active
                        ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Primary Contact */}
          <section className="space-y-4">
            <SectionHeading icon={<ProfileIcon size={18} />} title="Primary Contact" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Name</FieldLabel>
                <TextField
                  icon={<ProfileIcon size={16} />}
                  placeholder="Full name"
                  value={draft.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel required>Title</FieldLabel>
                <TextField
                  icon={<IdCardIcon size={16} />}
                  placeholder="e.g., Director of Engineering"
                  value={draft.contactTitle}
                  onChange={(e) => set("contactTitle", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <TextField
                  icon={<AtIcon size={16} />}
                  type="email"
                  placeholder="name@company.com"
                  value={draft.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Phone</FieldLabel>
                <TextField
                  icon={<PhoneIcon size={16} />}
                  placeholder="(415) 555-0100"
                  value={draft.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Account Manager */}
          <section className="space-y-3">
            <SectionHeading icon={<UsersIcon size={18} />} title="Account Manager" />
            <div>
              <FieldLabel required>Account Manager</FieldLabel>
              <SelectField
                value={draft.accountManager}
                placeholder="Select account manager"
                options={clientAccountManagers}
                onChange={(v) => set("accountManager", v)}
              />
            </div>
          </section>

          {/* Initial Terms */}
          <section className="space-y-3">
            <SectionHeading icon={<DocumentIcon size={18} />} title="Initial Terms" hint="(optional)" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Permanent fee %</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g., 20"
                    value={draft.permanentFee}
                    onChange={(e) => set("permanentFee", e.target.value)}
                    className={`${INPUT_CLASS} px-3 pr-9`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[color:var(--color-text-muted)]">
                    %
                  </span>
                </div>
              </div>
              <div>
                <FieldLabel>Contract markup %</FieldLabel>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g., 15"
                    value={draft.contractMarkup}
                    onChange={(e) => set("contractMarkup", e.target.value)}
                    className={`${INPUT_CLASS} px-3 pr-9`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[13px] font-medium text-[color:var(--color-text-muted)]">
                    %
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 text-[13.5px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex h-11 items-center rounded-[12px] px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: PURPLE }}
          >
            Add Client
          </button>
        </div>
      </div>
    </div>
  );
}
