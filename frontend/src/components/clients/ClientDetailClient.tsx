"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  ArrowLeftIcon,
  AtIcon,
  BriefcaseIcon,
  ChevronRight,
  DocumentIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  GlobeIcon,
  IdCardIcon,
  MoreIcon,
  NoteLinesIcon,
  PlusIcon,
  SortIcon,
  UploadIcon,
  UserPlusIcon,
} from "@/components/icons/AppIcons";
import {
  type Client,
  type ClientActivity,
  type ClientAgreement,
  type ClientContact,
  type ClientDetail,
  type ClientInvoice,
  type ClientJob,
  type ClientJobIcon,
  type ClientJobStatus,
  type ClientNote,
  type Placement,
  type VisaRequirement,
  type VisaType,
} from "@/lib/clients-data";

/* ── Accent palette — neutrals/surfaces/brand come from CSS tokens. ───────── */
const GREEN = "#16A34A";
const GREEN_BG = "#EAFBF1";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const PURPLE = "var(--color-brand-500)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

const TABS = [
  "Overview",
  "Contacts",
  "Agreement & Terms",
  "Jobs",
  "Placements",
  "Activity",
] as const;
type TabName = (typeof TABS)[number];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* ── Inline icons not in the shared set ───────────────────────────────────── */
function PinIconSm({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function UsersIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth="1.8" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 5.2A3 3 0 0 1 16 11M17 19c0-2.3-.9-4-2.4-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DollarCircleIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.7" />
      <path d="M12 7v10" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M14.3 9.3c0-1-1-1.7-2.3-1.7s-2.3.7-2.3 1.7.9 1.5 2.3 1.7 2.3.7 2.3 1.7-1 1.7-2.3 1.7-2.3-.7-2.3-1.7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrendUpMiniIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 16 9 11l3 3 7-7M19 7v4M19 7h-4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CalendarMiniIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.6 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockMiniIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChatMiniIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-4 3.5V16H6.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChartMiniIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20V4M4 20h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 16v-3M12 16V8M16 16v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function PhoneMiniIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.1 2A15.5 15.5 0 0 1 4.5 6.1 2 2 0 0 1 6.5 4Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Header KPI card (small icon-left tile) ───────────────────────────────── */
function HeaderKpi({
  icon,
  iconBg,
  iconFg,
  label,
  value,
  valueColor = "var(--color-text)",
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: iconBg, color: iconFg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            {label}
          </p>
          <p className="mt-0.5 text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: valueColor }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Overview KPI card (icon-left, with sub-note) ─────────────────────────── */
function NoteKpi({
  icon,
  iconBg,
  iconFg,
  label,
  value,
  valueColor = "var(--color-text)",
  note,
  noteColor = "var(--color-text-muted)",
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  label: string;
  value: string;
  valueColor?: string;
  note: string;
  noteColor?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: iconBg, color: iconFg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            {label}
          </p>
          <p className="mt-0.5 text-[24px] font-extrabold leading-tight tracking-tight" style={{ color: valueColor }}>
            {value}
          </p>
          <p className="text-[12px] font-medium" style={{ color: noteColor }}>
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Info / summary row ───────────────────────────────────────────────────── */
function InfoRow({
  icon,
  label,
  children,
  align = "center",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <div className={`flex gap-3 ${align === "start" ? "items-start" : "items-center"}`}>
      <span
        className={`flex w-[150px] shrink-0 items-center gap-2 text-[13px] text-[color:var(--color-text-secondary)] ${
          align === "start" ? "pt-0.5" : ""
        }`}
      >
        <span className="text-[color:var(--color-text-muted)]">{icon}</span>
        {label}
      </span>
      <div className="min-w-0 flex-1 text-[13.5px] font-medium text-[color:var(--color-text)]">
        {children}
      </div>
    </div>
  );
}

/* ── Activity icon tile ───────────────────────────────────────────────────── */
// Per-kind glyph + soft tint, mirroring the activity timeline mock.
const ACTIVITY_ICON: Record<
  ClientActivity["kind"],
  { bg: string; fg: string; icon: (size: number) => React.ReactNode }
> = {
  role: {
    bg: "var(--color-brand-100)",
    fg: "var(--color-brand-600)",
    icon: (s) => <BriefcaseIcon size={s} />,
  },
  submission: {
    bg: "var(--color-brand-100)",
    fg: "var(--color-brand-600)",
    icon: (s) => <UserPlusIcon size={s} />,
  },
  call: {
    bg: "#EAF2FF",
    fg: "#2563EB",
    icon: (s) => <PhoneMiniIcon size={s} color="currentColor" />,
  },
  placement: {
    bg: GREEN_BG,
    fg: GREEN,
    icon: (s) => <UsersIcon size={s} color="currentColor" />,
  },
  invoice: {
    bg: AMBER_BG,
    fg: AMBER,
    icon: (s) => <DocumentIcon size={s} />,
  },
  document: {
    bg: "var(--color-surface-2)",
    fg: "var(--color-text-secondary)",
    icon: (s) => <DocumentIcon size={s} />,
  },
};

function ActivityIcon({ kind }: { kind: ClientActivity["kind"] }) {
  const meta = ACTIVITY_ICON[kind];
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ background: meta.bg, color: meta.fg }}
    >
      {meta.icon(16)}
    </span>
  );
}

/* ── Contacts list ────────────────────────────────────────────────────────── */
function ContactRow({ contact, last }: { contact: ClientContact; last: boolean }) {
  return (
    <div className={`flex items-center gap-3 py-3 ${last ? "" : "border-b border-[color:var(--color-border)]"}`}>
      <Avatar name={contact.name} image={contact.image} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold text-[color:var(--color-text)]">{contact.name}</p>
          {contact.primary ? (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
            >
              Primary
            </span>
          ) : null}
        </div>
        <p className="text-[12.5px] text-[color:var(--color-text-secondary)]">{contact.title}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-text-muted)]">
          <AtIcon size={13} />
          {contact.email}
        </p>
      </div>
    </div>
  );
}

/* ── Contacts tab ─────────────────────────────────────────────────────────── */

// Categorical role chip palette — soft tint background + matching text.
const ROLE_CHIP: Record<NonNullable<ClientContact["role"]>, { bg: string; fg: string }> = {
  "Decision Maker": { bg: GREEN_BG, fg: GREEN },
  "Hiring Manager": { bg: "#EAF2FF", fg: "#2563EB" },
  "Finance (invoices)": { bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  HR: { bg: AMBER_BG, fg: AMBER },
  Technical: { bg: "#E0F2FE", fg: "#0369A1" },
  Other: { bg: "var(--color-surface-2)", fg: "var(--color-text-secondary)" },
};

function SlidersIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 8h10M19 8h0M9 16h10M5 16h0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="17" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="7" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

// Outlined action button used on each contact card (Email / Call / Edit).
function ContactAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-full items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
    >
      <span className="text-[color:var(--color-text-muted)]">{icon}</span>
      {label}
    </button>
  );
}

function ContactCard({ contact }: { contact: ClientContact }) {
  const chip = ROLE_CHIP[contact.role ?? "Other"];
  return (
    <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Identity */}
        <div className="flex min-w-0 flex-1 items-start gap-3.5">
          <Avatar name={contact.name} image={contact.image} size={48} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[15px] font-semibold text-[color:var(--color-text)]">{contact.name}</p>
              {contact.primary ? (
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
                >
                  Primary
                </span>
              ) : null}
            </div>
            <p className="text-[13px] text-[color:var(--color-text-secondary)]">{contact.title}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-text-muted)]">
              <AtIcon size={14} />
              {contact.email}
            </p>
            {contact.phone ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-text-muted)]">
                <PhoneMiniIcon size={14} />
                {contact.phone}
              </p>
            ) : null}
          </div>
        </div>

        {/* Role + last contacted */}
        <div className="flex shrink-0 flex-col gap-2 lg:w-[180px]">
          <span
            className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ background: chip.bg, color: chip.fg }}
          >
            {contact.role ?? "Other"}
          </span>
          {contact.lastContacted ? (
            <div className="mt-1">
              <p className="text-[12px] text-[color:var(--color-text-muted)]">Last contacted</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-text-secondary)]">
                <CalendarMiniIcon size={14} />
                {contact.lastContacted}
              </p>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex w-full shrink-0 flex-col gap-2 lg:w-[150px]">
          <ContactAction icon={<AtIcon size={15} />} label="Email" />
          <ContactAction icon={<PhoneMiniIcon size={15} />} label="Call" />
          <div className="flex items-center gap-2">
            <ContactAction icon={<EditIcon size={15} />} label="Edit" />
            <button
              type="button"
              aria-label="More actions"
              className="flex h-9 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              <MoreIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ detail }: { detail: ClientDetail }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
          Contacts <span className="text-[color:var(--color-text-muted)]">({detail.contacts.length})</span>
        </h3>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
          style={{ background: PURPLE }}
        >
          <PlusIcon size={16} />
          Add Contact
        </button>
      </div>

      <div className="mt-5 space-y-3.5">
        {detail.contacts.map((c) => (
          <ContactCard key={c.email} contact={c} />
        ))}
      </div>

      {/* Communication preferences */}
      <div className="mt-5 flex justify-end">
        <div className="w-full rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4 lg:w-[360px]">
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
            >
              <SlidersIcon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[color:var(--color-text)]">Communication preferences</p>
              <div className="mt-3 space-y-2.5">
                <div>
                  <p className="text-[12px] text-[color:var(--color-text-muted)]">Preferred channel</p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-text)]">
                    <AtIcon size={14} className="text-[color:var(--color-text-muted)]" />
                    {detail.commPrefs.channel}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[color:var(--color-text-muted)]">Timezone</p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-text)]">
                    <ClockMiniIcon size={14} />
                    {detail.commPrefs.timezone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
function Tabs({ active, onChange }: { active: TabName; onChange: (t: TabName) => void }) {
  return (
    <div className="border-b border-[color:var(--color-border)]">
      <nav aria-label="Client sections" className="-mb-px flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              aria-current={isActive ? "page" : undefined}
              className={`relative whitespace-nowrap px-4 py-3 text-[13px] font-semibold transition-colors focus-visible:outline-none ${
                isActive
                  ? "text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {tab}
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-[3px] rounded-t-full bg-[color:var(--color-brand-500)]"
                />
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function ClientDetailClient({
  client,
  detail,
}: {
  client: Client;
  detail: ClientDetail;
}) {
  const [tab, setTab] = useState<TabName>("Overview");

  return (
    <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="space-y-5">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px]">
          <Link
            href="/clients"
            className="inline-flex items-center text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
            aria-label="Back to Clients"
          >
            <ArrowLeftIcon size={16} />
          </Link>
          <Link
            href="/clients"
            className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
          >
            Clients
          </Link>
          <ChevronRight size={14} className="text-[color:var(--color-text-muted)]" />
          <span className="font-semibold text-[color:var(--color-text)]">{client.company}</span>
        </nav>

        {/* ── Header card ──────────────────────────────── */}
        <div className={`${CARD} p-5 sm:p-6`}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <CompanyLogo
                company={client.company}
                domain={client.domain}
                size={68}
                padding={8}
                rounded="rounded-[16px]"
                fallbackBg={client.logoBg}
                fallbackFg="#FFFFFF"
              />
              <div className="min-w-0">
                <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[color:var(--color-text)]">
                  {client.company}
                </h1>
                <p className="mt-0.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
                  {client.industry} · {detail.companySize}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
                  <a
                    href={`https://${detail.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
                  >
                    <GlobeIcon size={15} className="text-[color:var(--color-text-muted)]" />
                    {detail.website}
                  </a>
                  <span className="inline-flex items-center gap-1.5">
                    <PinIconSm size={15} />
                    {detail.hqLocationShort}
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: GREEN }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />
                    {client.status === "At-Risk" ? "At-Risk" : client.status}
                  </span>
                  <span className="text-[color:var(--color-text-secondary)]">
                    Client since {detail.clientSince}
                  </span>
                  <span className="inline-flex items-center gap-2 text-[color:var(--color-text-secondary)]">
                    <Avatar name={client.accountManager} image={client.accountManagerImage} size={22} />
                    {client.accountManager} (Account Manager)
                  </span>
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
                style={{ background: PURPLE }}
              >
                <PlusIcon size={16} />
                Add Job
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <EditIcon size={16} />
                Edit
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <CalendarMiniIcon size={16} />
                Log Activity
              </button>
              <button
                type="button"
                aria-label="More actions"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <MoreIcon size={18} />
              </button>
            </div>
          </div>

          {/* Header KPIs */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <HeaderKpi
              icon={<BriefcaseIcon size={18} />}
              iconBg="var(--color-brand-100)"
              iconFg="var(--color-brand-600)"
              label="Open Roles"
              value={String(client.openRoles)}
            />
            <HeaderKpi
              icon={<UsersIcon size={18} />}
              iconBg={GREEN_BG}
              iconFg={GREEN}
              label="Active Placements"
              value={String(client.activePlacements)}
            />
            <HeaderKpi
              icon={<DollarCircleIcon size={18} />}
              iconBg={GREEN_BG}
              iconFg={GREEN}
              label="Total Revenue"
              value={usd(detail.totalRevenue)}
              valueColor={GREEN}
            />
            <HeaderKpi
              icon={<TrendUpMiniIcon size={18} />}
              iconBg={AMBER_BG}
              iconFg={AMBER}
              label="Margin Rate"
              value={detail.marginRate}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs active={tab} onChange={setTab} />

        {/* ── Tab content ──────────────────────────────── */}
        {tab === "Overview" ? (
          <OverviewTab client={client} detail={detail} />
        ) : tab === "Contacts" ? (
          <ContactsTab detail={detail} />
        ) : tab === "Activity" ? (
          <ActivityTab detail={detail} />
        ) : tab === "Agreement & Terms" ? (
          <AgreementTab agreement={detail.agreement} />
        ) : tab === "Jobs" ? (
          <JobsTab client={client} detail={detail} />
        ) : (
          <PlacementsTab client={client} detail={detail} />
        )}
      </div>
    </div>
  );
}

/* ── Overview tab ─────────────────────────────────────────────────────────── */
function OverviewTab({ client, detail }: { client: Client; detail: ClientDetail }) {
  const healthStyle =
    detail.healthStatus === "Healthy"
      ? { bg: GREEN_BG, fg: GREEN }
      : detail.healthStatus === "At Risk"
        ? { bg: AMBER_BG, fg: AMBER }
        : { bg: "#EAF2FF", fg: "#2563EB" };

  return (
    <div className="space-y-5">
      {/* Company Information + Relationship Summary */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-5 sm:p-6`}>
          <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Company Information</h3>
          <div className="mt-4 space-y-3.5">
            <InfoRow icon={<ChartMiniIcon />} label="Industry">{client.industry}</InfoRow>
            <InfoRow icon={<UsersIcon size={16} />} label="Company size">{detail.companySize}</InfoRow>
            <InfoRow icon={<GlobeIcon size={16} />} label="Website">
              <a
                href={`https://${detail.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
              >
                {detail.website}
                <ExternalLinkIcon size={13} />
              </a>
            </InfoRow>
            <InfoRow icon={<PinIconSm />} label="HQ location">{detail.hqLocation}</InfoRow>
            <InfoRow icon={<CalendarMiniIcon />} label="Founded">{detail.founded}</InfoRow>
            <InfoRow icon={<ChatMiniIcon />} label="About" align="start">
              <span className="font-normal leading-[22px] text-[color:var(--color-text-secondary)]">
                {detail.about}
              </span>
            </InfoRow>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-[color:var(--color-border)] pt-4">
            <span className="text-[13px] text-[color:var(--color-text-secondary)]">Engagement type</span>
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ background: GREEN_BG, color: GREEN }}
            >
              {client.type}
            </span>
          </div>
        </div>

        <div className={`${CARD} p-5 sm:p-6`}>
          <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Relationship Summary</h3>
          <div className="mt-4 space-y-3.5">
            <InfoRow icon={<CalendarMiniIcon />} label="Client since">{detail.clientSince}</InfoRow>
            <InfoRow icon={<UsersIcon size={16} />} label="Total placements">{detail.totalPlacements}</InfoRow>
            <InfoRow icon={<DollarCircleIcon size={16} />} label="Total revenue">{usd(detail.totalRevenue)}</InfoRow>
            <InfoRow icon={<ClockMiniIcon />} label="Avg time-to-fill">{detail.avgTimeToFill}</InfoRow>
            <InfoRow icon={<HeartIcon />} label="Health status">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
                style={{ background: healthStyle.bg, color: healthStyle.fg }}
              >
                {detail.healthStatus}
              </span>
            </InfoRow>
            <InfoRow icon={<ChatMiniIcon />} label="Last contact">{detail.lastContact}</InfoRow>
          </div>
        </div>
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <NoteKpi
          icon={<BriefcaseIcon size={20} />}
          iconBg="var(--color-brand-100)"
          iconFg="var(--color-brand-600)"
          label="Open Roles"
          value={String(client.openRoles)}
          note={`across ${detail.rolesJobCount} jobs`}
        />
        <NoteKpi
          icon={<UsersIcon size={20} />}
          iconBg={GREEN_BG}
          iconFg={GREEN}
          label="Active Placements"
          value={String(client.activePlacements)}
          note={`across ${detail.placementsRoleCount} roles`}
        />
        <NoteKpi
          icon={<DollarCircleIcon size={20} />}
          iconBg={GREEN_BG}
          iconFg={GREEN}
          label="Revenue This Quarter"
          value={usd(detail.revenueThisQuarter)}
          valueColor={GREEN}
          note={detail.revenueQuarterDelta}
          noteColor={GREEN}
        />
        <NoteKpi
          icon={<DollarCircleIcon size={20} />}
          iconBg={AMBER_BG}
          iconFg={AMBER}
          label="Avg Bill Rate"
          value={detail.avgBillRate}
          note="across placements"
        />
      </div>

      {/* Key Contacts + Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-5 sm:p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Key Contacts</h3>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="mt-2">
            {detail.contacts.map((c, i) => (
              <ContactRow key={c.email} contact={c} last={i === detail.contacts.length - 1} />
            ))}
          </div>
        </div>

        <div className={`${CARD} p-5 sm:p-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
              Recent Activity{" "}
              <span className="text-[13px] font-medium text-[color:var(--color-text-muted)]">(preview)</span>
            </h3>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>
          <ActivityTimeline activity={detail.activity} className="mt-4" />
        </div>
      </div>
    </div>
  );
}

/* ── Placements tab ───────────────────────────────────────────────────────── */

/* Role tile icons — small inline glyphs keyed by ClientJob.icon. */
function RoleCodeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RoleCloudIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.2A3.5 3.5 0 0 1 17 18H7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RoleDatabaseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function RoleShieldIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RoleCloudUploadIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.2A3.5 3.5 0 0 1 17 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 21v-7m0 0-2.2 2.2M12 14l2.2 2.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RoleMonitorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="4.5" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 19.5h6M12 15.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// Role tile glyph + soft tint, keyed by the job's icon.
const ROLE_ICON: Record<
  ClientJobIcon,
  { node: React.ReactNode; bg: string; fg: string }
> = {
  code: { node: <RoleCodeIcon />, bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  cloud: { node: <RoleCloudIcon />, bg: "#EAF2FF", fg: "#2563EB" },
  database: { node: <RoleDatabaseIcon />, bg: "#E0F2FE", fg: "#0369A1" },
  shield: { node: <RoleShieldIcon />, bg: GREEN_BG, fg: GREEN },
  cloudUpload: { node: <RoleCloudUploadIcon />, bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  monitor: { node: <RoleMonitorIcon />, bg: "#EAF2FF", fg: "#2563EB" },
};

// Status chip palette for client job rows.
const JOB_STATUS_CHIP: Record<ClientJobStatus, { bg: string; fg: string }> = {
  Open: { bg: GREEN_BG, fg: GREEN },
  Filled: { bg: "#EAF2FF", fg: "#2563EB" },
  Closed: { bg: "var(--color-surface-2)", fg: "var(--color-text-secondary)" },
};

// Visa-requirement chip palette ("None" renders as a muted dash, no chip).
const JOB_VISA_CHIP: Record<
  Exclude<VisaRequirement, "None">,
  { bg: string; fg: string }
> = {
  "H1B OK": { bg: GREEN_BG, fg: GREEN },
  Any: { bg: "var(--color-surface-2)", fg: "var(--color-text-secondary)" },
  "GC/Citizen": { bg: "#EAF2FF", fg: "#2563EB" },
  "Citizen only": { bg: AMBER_BG, fg: AMBER },
};

const JOB_FILTERS = ["All", "Open", "Filled", "Closed"] as const;
type JobFilter = (typeof JOB_FILTERS)[number];

type JobSortKey = "title" | "dateOpened" | "daysOpen";
type JobSort = { key: JobSortKey; dir: "asc" | "desc" } | null;

// Mini pipeline-progress indicator: 4 dots, filled green up to `stage`.
function StageDots({ stage }: { stage: number }) {
  const total = 4;
  return (
    <div className="mt-1.5 flex items-center" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: i < stage ? GREEN : "var(--color-border-strong)" }}
          />
          {i < total - 1 ? (
            <span
              className="h-[2px] w-3.5"
              style={{ background: i < stage - 1 ? GREEN : "var(--color-border)" }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// Sortable / static column header cell for the jobs table.
function JobTh({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey?: JobSortKey;
  sort?: JobSort;
  onSort?: (key: JobSortKey) => void;
  align?: "left" | "center";
}) {
  const isActive = sortKey != null && sort?.key === sortKey;
  const base =
    "border-b border-[color:var(--color-border)] px-3 py-3 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]";
  if (!sortKey) {
    return <th className={`${base} ${align === "center" ? "text-center" : "text-left"}`}>{label}</th>;
  }
  return (
    <th className={`${base} text-left`}>
      <button
        type="button"
        onClick={() => onSort?.(sortKey)}
        className={`inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-secondary)] ${
          isActive ? "text-[color:var(--color-text-secondary)]" : ""
        }`}
      >
        {label}
        <SortIcon size={13} />
      </button>
    </th>
  );
}

function JobRow({ job }: { job: ClientJob }) {
  const tile = ROLE_ICON[job.icon];
  const status = JOB_STATUS_CHIP[job.status];
  const visa = job.visa === "None" ? null : JOB_VISA_CHIP[job.visa];
  const daysAmber = job.daysOpen >= 25;

  return (
    <tr className="transition-colors hover:bg-[color:var(--color-surface-2)]">
      {/* Role title + pipeline dots */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: tile.bg, color: tile.fg }}
          >
            {tile.node}
          </span>
          <div className="min-w-0">
            <button
              type="button"
              className="text-left text-[13.5px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)] hover:underline"
            >
              {job.title}
            </button>
            <StageDots stage={job.stage} />
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: status.bg, color: status.fg }}
        >
          {job.status}
        </span>
      </td>

      {/* Bill rate */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] font-medium text-[color:var(--color-text)]">
        {job.billRate}
      </td>

      {/* Visa requirement */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        {visa ? (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ background: visa.bg, color: visa.fg }}
          >
            {job.visa}
          </span>
        ) : (
          <span className="text-[13.5px] text-[color:var(--color-text-muted)]">—</span>
        )}
      </td>

      {/* Submitted */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-center text-[13.5px] font-medium text-[color:var(--color-text)]">
        {job.submitted}
      </td>

      {/* Assigned recruiter */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <div className="flex items-center gap-2">
          <Avatar name={job.recruiter} image={job.recruiterImage} size={28} />
          <span className="text-[13px] text-[color:var(--color-text-secondary)]">{job.recruiter}</span>
        </div>
      </td>

      {/* Date opened */}
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
        {job.dateOpenedShort}
      </td>

      {/* Days open */}
      <td
        className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] font-medium"
        style={{ color: daysAmber ? AMBER : "var(--color-text-secondary)" }}
      >
        {job.daysOpen} {job.daysOpen === 1 ? "day" : "days"}
      </td>
    </tr>
  );
}

function JobsTab({ client, detail }: { client: Client; detail: ClientDetail }) {
  const [filter, setFilter] = useState<JobFilter>("All");
  const [sort, setSort] = useState<JobSort>(null);

  const handleSort = (key: JobSortKey) =>
    setSort((s) =>
      s && s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );

  const filtered = detail.jobs.filter((j) => filter === "All" || j.status === filter);
  const rows = sort
    ? [...filtered].sort((a, b) => {
        const cmp =
          sort.key === "title" ? a.title.localeCompare(b.title) : a.daysOpen - b.daysOpen;
        return sort.dir === "asc" ? cmp : -cmp;
      })
    : filtered;

  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      {/* Header: title + Add Job */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
          Roles from {client.company}{" "}
          <span className="text-[color:var(--color-text-muted)]">({detail.jobs.length})</span>
        </h3>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
          style={{ background: PURPLE }}
        >
          <PlusIcon size={16} />
          Add Job
        </button>
      </div>

      {/* Status filter segmented control */}
      <div className="mt-4 flex justify-end">
        <div className="inline-flex items-center gap-1 rounded-[10px] bg-[color:var(--color-surface-2)] p-1">
          {JOB_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-[8px] px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-[color:var(--color-surface)] text-[color:var(--color-text)] shadow-[var(--shadow-card)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roles table */}
      {rows.length === 0 ? (
        <p className="mt-6 text-[13px] text-[color:var(--color-text-secondary)]">
          No {filter !== "All" ? filter.toLowerCase() : ""} roles for {client.company}.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-0">
            <thead>
              <tr>
                <JobTh label="Role Title" sortKey="title" sort={sort} onSort={handleSort} />
                <JobTh label="Status" />
                <JobTh label="Bill Rate" />
                <JobTh label="Visa Requirement" />
                <JobTh label="Submitted" align="center" />
                <JobTh label="Assigned Recruiter" />
                <JobTh label="Date Opened" sortKey="dateOpened" sort={sort} onSort={handleSort} />
                <JobTh label="Days Open" sortKey="daysOpen" sort={sort} onSort={handleSort} />
              </tr>
            </thead>
            <tbody>
              {rows.map((j) => (
                <JobRow key={j.id} job={j} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ── Placements tab ───────────────────────────────────────────────────────── */

// Visa chip palette — soft tint background + matching text.
const VISA_CHIP: Record<VisaType, { bg: string; fg: string }> = {
  H1B: { bg: GREEN_BG, fg: GREEN },
  GC: { bg: "#EAF2FF", fg: "#2563EB" },
  OPT: { bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  USC: { bg: "#E0F2FE", fg: "#0369A1" },
  "L2-EAD": { bg: AMBER_BG, fg: AMBER },
};

// Large icon-left KPI tile used in the Placements summary row.
function PlacementKpi({
  icon,
  iconBg,
  iconFg,
  label,
  value,
  valueColor = "var(--color-text)",
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconFg: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className={`${CARD} p-5`}>
      <span
        className="flex h-11 w-11 items-center justify-center rounded-[12px]"
        style={{ background: iconBg, color: iconFg }}
      >
        {icon}
      </span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight" style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

const rate = (n: number) => `$${n}`;

function PlacementsTab({ client, detail }: { client: Client; detail: ClientDetail }) {
  const placements = detail.placements;
  const activeCount = placements.filter((p) => p.status === "Active").length;

  return (
    <div className="space-y-5">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <PlacementKpi
          icon={<UsersIcon size={20} color="currentColor" />}
          iconBg={GREEN_BG}
          iconFg={GREEN}
          label="Active Placements"
          value={String(activeCount)}
        />
        <PlacementKpi
          icon={<BriefcaseIcon size={20} />}
          iconBg="var(--color-brand-100)"
          iconFg="var(--color-brand-600)"
          label="Total Placed (All-Time)"
          value={String(detail.totalPlacements)}
        />
        <PlacementKpi
          icon={<DollarCircleIcon size={20} color="currentColor" />}
          iconBg={GREEN_BG}
          iconFg={GREEN}
          label="Revenue Generated"
          value={usd(detail.totalRevenue)}
          valueColor={GREEN}
        />
      </div>

      {/* Consultants table */}
      <div className={`${CARD} p-5 sm:p-6`}>
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
          Consultants Placed at {client.company}
        </h3>

        {placements.length === 0 ? (
          <p className="mt-6 text-[13px] text-[color:var(--color-text-secondary)]">
            No placements recorded for {client.company} yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0">
              <thead>
                <tr>
                  {[
                    "Consultant",
                    "Role",
                    "Visa",
                    "Bill Rate",
                    "Pay Rate",
                    "Margin/hr",
                    "Start Date",
                    "End Date",
                    "Status",
                    "Recruiter",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border-b border-[color:var(--color-border)] px-3 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {placements.map((p, i) => (
                  <PlacementRow key={`${p.name}-${i}`} placement={p} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PlacementRow({ placement: p }: { placement: Placement }) {
  const visa = VISA_CHIP[p.visa];
  const margin = p.billRate - p.payRate;
  const isActive = p.status === "Active";

  return (
    <tr className="transition-colors hover:bg-[color:var(--color-surface-2)]">
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={p.name} image={p.image} size={36} />
          <span className="text-[13.5px] font-semibold text-[color:var(--color-text)]">{p.name}</span>
        </div>
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
        {p.role}
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: visa.bg, color: visa.fg }}
        >
          {p.visa}
        </span>
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] font-medium text-[color:var(--color-text)]">
        {rate(p.billRate)}
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] font-medium text-[color:var(--color-text)]">
        {rate(p.payRate)}
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] font-semibold" style={{ color: GREEN }}>
        {rate(margin)}/hr
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
        {p.startDate}
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
        {p.endDate ?? "—"}
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={
            isActive
              ? { background: GREEN_BG, color: GREEN }
              : { background: "var(--color-surface-2)", color: "var(--color-text-secondary)" }
          }
        >
          {p.status}
        </span>
      </td>
      <td className="border-b border-[color:var(--color-border)] px-3 py-3.5">
        <div className="flex items-center gap-2">
          <Avatar name={p.recruiter} image={p.recruiterImage} size={28} />
          <span className="text-[13px] text-[color:var(--color-text-secondary)]">{p.recruiter}</span>
        </div>
      </td>
    </tr>
  );
}

/* ── Agreement & Terms tab ────────────────────────────────────────────────── */

/* Card section header: tinted icon tile + title (+ optional right slot). */
function SectionHead({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold leading-tight text-[color:var(--color-text)]">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-[12.5px] text-[color:var(--color-text-secondary)]">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {right}
    </div>
  );
}

/* Label-left / value-right term row with a soft divider between items. */
function TermRow({
  label,
  value,
  valueColor = "var(--color-text)",
  first = false,
}: {
  label: string;
  value: string;
  valueColor?: string;
  first?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-3.5 ${
        first ? "" : "border-t border-[color:var(--color-border)]"
      }`}
    >
      <span className="text-[13.5px] text-[color:var(--color-text-secondary)]">{label}</span>
      <span className="text-[14px] font-semibold" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function AgreementTab({ agreement }: { agreement: ClientAgreement }) {
  const stateStyle =
    agreement.msaState === "Active"
      ? { bg: GREEN_BG, fg: GREEN }
      : agreement.msaState === "Expiring"
        ? { bg: AMBER_BG, fg: AMBER }
        : { bg: "#FDECEC", fg: "#DC2626" };
  const msaStatusColor = agreement.msaStatus === "Signed" ? GREEN : agreement.msaStatus === "Pending" ? AMBER : "#DC2626";

  return (
    <div className="space-y-5">
      {/* Edit Terms */}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
          style={{ background: PURPLE }}
        >
          <EditIcon size={16} />
          Edit Terms
        </button>
      </div>

      {/* Fee Structure + Contract / MSA */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-5 sm:p-6`}>
          <SectionHead icon={<DocumentIcon size={18} />} title="Fee Structure" />
          <div className="mt-4">
            <TermRow first label="Permanent placement fee" value={agreement.placementFee} />
            <TermRow label="Contract markup" value={agreement.contractMarkup} />
            <TermRow label="Guarantee period" value={agreement.guaranteePeriod} />
            <TermRow label="Payment terms" value={agreement.paymentTerms} />
          </div>
        </div>

        <div className={`${CARD} p-5 sm:p-6`}>
          <SectionHead
            icon={<DocumentIcon size={18} />}
            title="Contract / MSA"
            right={
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
                style={{ background: stateStyle.bg, color: stateStyle.fg }}
              >
                {agreement.msaState}
              </span>
            }
          />
          <div className="mt-4">
            <TermRow first label="MSA status" value={agreement.msaStatus} valueColor={msaStatusColor} />
            <TermRow label="Signed date" value={agreement.signedDate} />
            <TermRow label="Expiry date" value={agreement.expiryDate} />
          </div>

          {/* File chip */}
          <div className="mt-4 flex items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3.5 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px]"
              style={{ background: "#FDECEC", color: "#DC2626" }}
            >
              <DocumentIcon size={16} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-[color:var(--color-text)]">
              {agreement.contractFile}
            </span>
            <button
              type="button"
              aria-label={`Download ${agreement.contractFile}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              <DownloadIcon size={16} />
            </button>
          </div>

          <button
            type="button"
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-surface)] text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
          >
            <UploadIcon size={16} />
            Renew / Upload
          </button>
        </div>
      </div>

      {/* Rate Card */}
      <div className={`${CARD} p-5 sm:p-6`}>
        <SectionHead
          icon={<DocumentIcon size={18} />}
          title="Rate Card"
          subtitle="Agreed bill rates by role / level"
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                {["Role", "Level", "Agreed Bill Rate (USD)", "Notes"].map((h) => (
                  <th
                    key={h}
                    className="rounded-t-[10px] bg-[color:var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-secondary)] first:rounded-l-[10px] last:rounded-r-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agreement.rateCard.map((row, i) => (
                <tr key={`${row.role}-${i}`}>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-3.5 text-[13.5px] font-semibold text-[color:var(--color-text)]">
                    {row.role}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
                    {row.level}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-3.5 text-[13.5px] font-semibold text-[color:var(--color-text)]">
                    {row.rate}
                  </td>
                  <td className="border-b border-[color:var(--color-border)] px-4 py-3.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Type + Billing Contact */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-5 sm:p-6`}>
          <SectionHead icon={<UsersIcon size={18} color="currentColor" />} title="Engagement Type" />
          <div className="mt-5 flex items-center gap-3">
            <span
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                agreement.directClient ? "" : "bg-[color:var(--color-border-strong)]"
              }`}
              style={agreement.directClient ? { background: PURPLE } : undefined}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                  agreement.directClient ? "translate-x-[22px]" : "translate-x-0.5"
                }`}
              />
            </span>
            <span className="text-[14px] font-semibold text-[color:var(--color-text)]">
              {agreement.directClient ? "Direct Client (not vendor)" : "Vendor / Prime"}
            </span>
          </div>
          <p className="mt-3 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
            {agreement.engagementNote}
          </p>
        </div>

        <div className={`${CARD} p-5 sm:p-6`}>
          <SectionHead icon={<IdCardIcon size={18} />} title="Billing Contact" />
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={agreement.billingContact.name} size={44} />
            <div className="min-w-0">
              <p className="text-[14.5px] font-semibold text-[color:var(--color-text)]">
                {agreement.billingContact.name}
              </p>
              <p className="text-[12.5px] text-[color:var(--color-text-secondary)]">
                {agreement.billingContact.title}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2.5 text-[13.5px] text-[color:var(--color-text-secondary)]">
              <AtIcon size={15} />
              <span className="text-[color:var(--color-text)]">{agreement.billingContact.email}</span>
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
              >
                Invoicing email
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[13.5px] text-[color:var(--color-text)]">
              <PhoneMiniIcon size={15} />
              {agreement.billingContact.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Activity tab ─────────────────────────────────────────────────────────── */

// Soft "Log Activity" / "Add Note" purple button used in the Activity tab heads.
function PurpleSmallButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
      style={{ background: PURPLE }}
    >
      {icon}
      {label}
    </button>
  );
}

const INVOICE_STATUS: Record<ClientInvoice["status"], { bg: string; fg: string }> = {
  Paid: { bg: GREEN_BG, fg: GREEN },
  Pending: { bg: AMBER_BG, fg: AMBER },
  Overdue: { bg: "#FDECEC", fg: "#DC2626" },
};

function InvoiceRow({ invoice, last }: { invoice: ClientInvoice; last: boolean }) {
  const s = INVOICE_STATUS[invoice.status];
  return (
    <div className={`flex items-center justify-between gap-3 py-3.5 ${last ? "" : "border-b border-[color:var(--color-border)]"}`}>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-[color:var(--color-text)]">
          Invoice #{invoice.number}
        </p>
        <p className="mt-0.5 text-[12.5px] text-[color:var(--color-text-muted)]">{invoice.date}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[14px] font-bold text-[color:var(--color-text)]">{usd(invoice.amount)}</span>
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: s.bg, color: s.fg }}
        >
          {invoice.status}
        </span>
      </div>
    </div>
  );
}

function NoteCard({ note }: { note: ClientNote }) {
  return (
    <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-3.5">
      <p className="text-[13.5px] leading-[20px] text-[color:var(--color-text)]">{note.body}</p>
      <div className="mt-2.5 flex items-center gap-2 text-[12px] text-[color:var(--color-text-muted)]">
        {note.authorImage ? <Avatar name={note.author} image={note.authorImage} size={20} /> : null}
        <span className="font-medium text-[color:var(--color-text-secondary)]">{note.author}</span>
        <span aria-hidden>·</span>
        <span>{note.date}</span>
      </div>
    </div>
  );
}

function ActivityTab({ detail }: { detail: ClientDetail }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
      {/* Activity Timeline */}
      <div className={`${CARD} p-5 sm:p-6`}>
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Activity Timeline</h3>
          <PurpleSmallButton icon={<CalendarMiniIcon size={15} />} label="Log Activity" />
        </div>
        {detail.activity.length === 0 ? (
          <p className="mt-6 text-[13px] text-[color:var(--color-text-secondary)]">
            No activity logged yet. Use “Log Activity” to record calls, submissions, and placements.
          </p>
        ) : (
          <ActivityTimeline activity={detail.activity} className="mt-5" />
        )}
      </div>

      {/* Invoices + Notes */}
      <div className="space-y-5">
        {/* Invoices & Payments */}
        <div className={`${CARD} p-5 sm:p-6`}>
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
            >
              <DocumentIcon size={18} />
            </span>
            <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Invoices &amp; Payments</h3>
          </div>

          {detail.invoices.length === 0 ? (
            <p className="mt-5 text-[13px] text-[color:var(--color-text-secondary)]">
              No invoices issued for this client yet.
            </p>
          ) : (
            <>
              <div className="mt-3">
                {detail.invoices.map((inv, i) => (
                  <InvoiceRow key={`${inv.number}-${i}`} invoice={inv} last={i === detail.invoices.length - 1} />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
                <span className="text-[13.5px] font-medium text-[color:var(--color-text-secondary)]">
                  Total outstanding
                </span>
                <span
                  className="text-[16px] font-extrabold"
                  style={{ color: detail.totalOutstanding > 0 ? AMBER : GREEN }}
                >
                  {usd(detail.totalOutstanding)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Notes */}
        <div className={`${CARD} p-5 sm:p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: "var(--color-brand-100)", color: "var(--color-brand-600)" }}
              >
                <NoteLinesIcon size={18} />
              </span>
              <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Notes</h3>
            </div>
            <PurpleSmallButton icon={<PlusIcon size={15} />} label="Add Note" />
          </div>

          {detail.notes.length === 0 ? (
            <p className="mt-5 text-[13px] text-[color:var(--color-text-secondary)]">
              No notes yet. Capture account context, expansion plans, and reminders here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {detail.notes.map((n, i) => (
                <NoteCard key={`${n.date}-${i}`} note={n} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Activity timeline ────────────────────────────────────────────────────── */
function ActivityTimeline({
  activity,
  className = "",
}: {
  activity: ClientActivity[];
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {activity.map((a, i) => (
        <div key={`${a.title}-${i}`} className="relative flex gap-3.5 pb-5 last:pb-0">
          {/* connector line */}
          {i < activity.length - 1 ? (
            <span
              aria-hidden
              className="absolute left-[18px] top-9 h-[calc(100%-20px)] w-px bg-[color:var(--color-border)]"
            />
          ) : null}
          <ActivityIcon kind={a.kind} />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[13.5px] font-semibold text-[color:var(--color-text)]">{a.title}</p>
              <span className="shrink-0 whitespace-nowrap text-[12px] text-[color:var(--color-text-muted)]">
                {a.when}
              </span>
            </div>
            {a.meta ? (
              <p className="mt-0.5 text-[12.5px] text-[color:var(--color-text-secondary)]">{a.meta}</p>
            ) : null}
            {a.author ? (
              <div className="mt-1.5 flex items-center gap-2">
                {a.authorImage ? (
                  <Avatar name={a.author} image={a.authorImage} size={20} />
                ) : null}
                <span className="text-[12.5px] text-[color:var(--color-text-secondary)]">{a.author}</span>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
