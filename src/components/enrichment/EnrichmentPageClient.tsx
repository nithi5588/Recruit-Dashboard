"use client";

import { useState } from "react";
import { UserSearch } from "iconsax-reactjs";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart } from "@/components/ui/DonutChart";
import { Sparkline } from "@/components/enrichment/Sparkline";
import {
  AtIcon,
  BuildingsIcon,
  CheckIcon,
  ClockIcon,
  CopyIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  MoreIcon,
  PhoneIcon,
  PinIcon,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
  SuitcaseIcon,
  TagIcon,
  UsersIcon,
  VerifiedBadgeIcon,
  XIcon,
} from "@/components/icons/AppIcons";

function UserSearchHeaderIcon() {
  return (
    <UserSearch
      size={20}
      color="var(--color-brand-500)"
      variant="Bulk"
    />
  );
}

// ─── Types & sample data ─────────────────────────────────────────────────────

type Recruiter = {
  id: string;
  name: string;
  title: string;
  company: string;
  companyColor: string;
  location: string;
  verified?: boolean;
  linkedin: string;
  email: string;
  phone: string;
  seniority: "Staff" | "Senior" | "Lead" | "Head";
  focus: string;
  tags: string[];
  experience: string;
  industry: string;
  companySize: string;
  education: string;
  enrichedAt: string;
  status: "Success" | "Failed" | "In Progress";
};

const RECRUITERS: Recruiter[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    title: "Senior Technical Recruiter",
    company: "Google",
    companyColor: "#4285F4",
    location: "Bengaluru, Karnataka, India",
    verified: true,
    linkedin: "linkedin.com/in/priyasharma",
    email: "priya.sharma@google.com",
    phone: "+91 98765 43210",
    seniority: "Senior",
    focus: "Engineering · Platform",
    tags: ["Recruiter", "Hiring for Engineering"],
    experience: "7+ years",
    industry: "Technology, Information & Internet",
    companySize: "10,001+ employees",
    education: "MBA — HR, Symbiosis International",
    enrichedAt: "May 18, 2024 at 10:30 AM",
    status: "Success",
  },
  {
    id: "rahul-kumar",
    name: "Rahul Kumar",
    title: "Talent Acquisition",
    company: "Microsoft",
    companyColor: "#00A4EF",
    location: "Hyderabad, India",
    verified: true,
    linkedin: "linkedin.com/in/rahulkumar",
    email: "rahul.k@microsoft.com",
    phone: "+91 98200 11223",
    seniority: "Senior",
    focus: "Engineering · Cloud",
    tags: ["Recruiter", "Cloud"],
    experience: "5+ years",
    industry: "Software Development",
    companySize: "10,001+ employees",
    education: "B.Tech — NIT Warangal",
    enrichedAt: "15 min ago",
    status: "Success",
  },
  {
    id: "ankit-singh",
    name: "Ankit Singh",
    title: "Recruiter",
    company: "Amazon",
    companyColor: "#FF9900",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/ankitsingh",
    email: "asingh@amazon.com",
    phone: "+91 98765 11100",
    seniority: "Staff",
    focus: "Operations",
    tags: ["Recruiter"],
    experience: "3+ years",
    industry: "Retail / Technology",
    companySize: "10,001+ employees",
    education: "BBA — Delhi University",
    enrichedAt: "32 min ago",
    status: "Failed",
  },
  {
    id: "neha-jain",
    name: "Neha Jain",
    title: "HR Recruiter",
    company: "Deloitte",
    companyColor: "#ED8E55",
    location: "Mumbai, India",
    verified: true,
    linkedin: "linkedin.com/in/nehajain",
    email: "njain@deloitte.com",
    phone: "+91 98333 45678",
    seniority: "Senior",
    focus: "Consulting · Tech",
    tags: ["Recruiter"],
    experience: "6+ years",
    industry: "Management Consulting",
    companySize: "10,001+ employees",
    education: "MBA — XLRI Jamshedpur",
    enrichedAt: "1 hr ago",
    status: "Success",
  },
  {
    id: "deepak-p",
    name: "Deepak P.",
    title: "Technical Recruiter",
    company: "Oracle",
    companyColor: "#F80000",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/deepakp",
    email: "deepak.p@oracle.com",
    phone: "+91 97010 55566",
    seniority: "Senior",
    focus: "Engineering · Database",
    tags: ["Recruiter", "Enterprise"],
    experience: "8+ years",
    industry: "Enterprise Software",
    companySize: "10,001+ employees",
    education: "M.Tech — IIT Madras",
    enrichedAt: "2 hr ago",
    status: "Success",
  },
];

const ANALYTICS = {
  overview: {
    successful: 42,
    failed: 6,
    inProgress: 4,
  },
  accuracy: 95,
  accuracyPoints: [78, 82, 79, 85, 88, 90, 93, 91, 94, 95],
  accuracyDays: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "••••••••••••";
  const localMask =
    local.length <= 2
      ? "••"
      : `${local[0]}${"•".repeat(Math.max(3, local.length - 2))}${local.slice(-1)}`;
  return `${localMask}@••••.${domain.split(".").pop()}`;
}

function maskPhone(phone: string): string {
  return `${phone.slice(0, 6)} ••• ••••`;
}

function companyMonogram(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function EnrichmentPageClient() {
  const [url, setUrl] = useState("https://www.linkedin.com/in/priyasharma");
  const [active, setActive] = useState<Recruiter>(RECRUITERS[0]);
  const [isEnriching, setIsEnriching] = useState(false);
  const [revealed, setRevealed] = useState<
    Record<string, { email?: boolean; phone?: boolean }>
  >({});
  const [revealingField, setRevealingField] = useState<"email" | "phone" | null>(
    null,
  );
  const [copied, setCopied] = useState<string | null>(null);

  const activeRev = revealed[active.id] ?? {};

  function handleEnrich() {
    setIsEnriching(true);
    setTimeout(() => setIsEnriching(false), 800);
  }

  function revealField(field: "email" | "phone") {
    setRevealingField(field);
    setTimeout(() => {
      setRevealed((prev) => ({
        ...prev,
        [active.id]: { ...prev[active.id], [field]: true },
      }));
      setRevealingField(null);
    }, 650);
  }

  function copy(value: string, key: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1600);
  }

  const { successful, failed, inProgress } = ANALYTICS.overview;
  const overviewTotal = successful + failed + inProgress;

  return (
    <div className="min-h-full px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      {/* ── Page header ───────────────────────────────── */}
      <header className="mb-4 sm:mb-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[26px] sm:leading-[34px]">
            Enrichment
          </h1>
          <UserSearchHeaderIcon />
        </div>
        <p className="mt-1 max-w-[620px] text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
          Get verified email and phone number from a LinkedIn recruiter profile.
        </p>
      </header>

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          {/* LinkedIn URL hero */}
          <UrlHero
            url={url}
            onChange={setUrl}
            onEnrich={handleEnrich}
            isEnriching={isEnriching}
          />

          {/* Enriched profile */}
          <EnrichedProfile
            recruiter={active}
            revealed={activeRev}
            revealingField={revealingField}
            onReveal={revealField}
            onCopy={copy}
            copiedKey={copied}
            onReEnrich={handleEnrich}
          />
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-4 lg:space-y-5">
          <ActivityCard
            recruiters={RECRUITERS}
            activeId={active.id}
            onSelect={setActive}
          />
          <OverviewCard
            successful={successful}
            failed={failed}
            inProgress={inProgress}
            total={overviewTotal}
          />
          <AccuracyCard
            accuracy={ANALYTICS.accuracy}
            points={ANALYTICS.accuracyPoints}
          />
        </aside>
      </div>

      {/* Footer attribution */}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
        <ShieldIcon size={12} />
        We are committed to providing verified and accurate information.
      </p>
    </div>
  );
}

// ─── URL Hero ────────────────────────────────────────────────────────────────

function UrlHero({
  url,
  onChange,
  onEnrich,
  isEnriching,
}: {
  url: string;
  onChange: (v: string) => void;
  onEnrich: () => void;
  isEnriching: boolean;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5"
      style={{
        backgroundImage:
          "radial-gradient(900px 220px at 0% 0%, rgba(var(--accent-rgb,234,104,20),0.10), transparent 60%)",
      }}
    >
      <div className="relative">
        <label
          htmlFor="linkedin-url"
          className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--color-text)]"
        >
          LinkedIn Profile URL
          <span className="text-[color:var(--color-text-muted)]">
            — paste any public LinkedIn profile
          </span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative flex-1">
            {/* LinkedIn prefix tile */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[8px] bg-[#0A66C2] text-[13px] font-bold text-white"
            >
              in
            </span>
            <input
              id="linkedin-url"
              type="url"
              value={url}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://www.linkedin.com/in/johndoe"
              className="h-12 w-full rounded-[12px] border border-[color:var(--color-border)] bg-white pl-[52px] pr-10 text-[14px] text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)] sm:text-[15px]"
            />
            {url ? (
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Clear"
                className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
              >
                <XIcon size={14} />
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onEnrich}
            disabled={isEnriching || !url.trim()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-brand-500)] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(234,104,20,0.28)] transition-all hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[160px]"
          >
            {isEnriching ? (
              <>
                <Spinner />
                Enriching…
              </>
            ) : (
              <>
                <SparklesIcon size={15} />
                Enrich Profile
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-start gap-1.5 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2">
          <ShieldIcon
            size={13}
            className="mt-[1px] shrink-0 text-[color:var(--color-brand-500)]"
          />
          <p className="text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
            We use secure and ethical methods to find accurate contact
            information.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Enriched Profile ────────────────────────────────────────────────────────

function EnrichedProfile({
  recruiter,
  revealed,
  revealingField,
  onReveal,
  onCopy,
  copiedKey,
  onReEnrich,
}: {
  recruiter: Recruiter;
  revealed: { email?: boolean; phone?: boolean };
  revealingField: "email" | "phone" | null;
  onReveal: (field: "email" | "phone") => void;
  onCopy: (v: string, key: string) => void;
  copiedKey: string | null;
  onReEnrich: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
      {/* Section header */}
      <header className="flex items-center justify-between gap-2 border-b border-[color:var(--color-border)] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[color:var(--color-text)] sm:text-[16px]">
            Enriched Profile
          </h2>
          <StatusPill status={recruiter.status} />
        </div>
        <div className="flex items-center gap-1">
          <a
            href={`https://${recruiter.linkedin}`}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] sm:inline-flex"
          >
            View on LinkedIn
            <ExternalLinkIcon size={12} />
          </a>
          <button
            type="button"
            aria-label="More options"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
          >
            <MoreIcon size={15} />
          </button>
        </div>
      </header>

      {/* Identity */}
      <div
        className="relative overflow-hidden px-4 pb-4 pt-5 sm:px-5 sm:pt-6"
        style={{
          backgroundImage:
            "radial-gradient(600px 140px at 0% 0%, rgba(var(--accent-rgb,234,104,20),0.08), transparent 60%), linear-gradient(180deg, rgba(var(--accent-rgb,234,104,20),0.04) 0%, transparent 100%)",
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <div className="relative shrink-0">
            <Avatar name={recruiter.name} size={64} />
            {recruiter.verified ? (
              <span
                className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-success)] text-white shadow-[0_2px_8px_rgba(234,104,20,0.35)]"
                aria-label="Verified"
              >
                <CheckIcon size={12} />
              </span>
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h3 className="text-[18px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[20px]">
                {recruiter.name}
              </h3>
              {recruiter.verified ? (
                <VerifiedBadgeIcon
                  size={16}
                  className="text-[color:var(--color-brand-500)]"
                />
              ) : null}
            </div>
            <p className="mt-0.5 text-[13px] font-medium text-[color:var(--color-text-secondary)] sm:text-[14px]">
              {recruiter.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[color:var(--color-text-secondary)] sm:text-[13px]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] text-[8px] font-bold text-white"
                  style={{ background: recruiter.companyColor }}
                >
                  {companyMonogram(recruiter.company)}
                </span>
                <span className="font-semibold text-[color:var(--color-text)]">
                  {recruiter.company}
                </span>
              </span>
              <span className="text-[color:var(--color-border-strong)]">·</span>
              <span className="inline-flex items-center gap-1">
                <PinIcon
                  size={12}
                  className="text-[color:var(--color-text-muted)]"
                />
                {recruiter.location}
              </span>
            </div>

            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {recruiter.tags.map((t) => (
                <li key={t}>
                  <span className="inline-flex items-center rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-2.5 py-0.5 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reveal blocks */}
      <div className="grid grid-cols-1 gap-3 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 p-4 md:grid-cols-2 sm:p-5">
        <RevealCard
          label="Email Address"
          kind="email"
          accent="var(--color-brand-500)"
          tint="var(--chip-warning-bg)"
          icon={<AtIcon size={14} />}
          value={recruiter.email}
          mask={maskEmail(recruiter.email)}
          revealed={!!revealed.email}
          isRevealing={revealingField === "email"}
          onReveal={() => onReveal("email")}
          onCopy={() => onCopy(recruiter.email, `${recruiter.id}-email`)}
          copied={copiedKey === `${recruiter.id}-email`}
        />
        <RevealCard
          label="Phone Number"
          kind="phone"
          accent="var(--color-brand-600)"
          tint="var(--chip-brand-bg)"
          icon={<PhoneIcon size={14} />}
          value={recruiter.phone}
          mask={maskPhone(recruiter.phone)}
          revealed={!!revealed.phone}
          isRevealing={revealingField === "phone"}
          onReveal={() => onReveal("phone")}
          onCopy={() => onCopy(recruiter.phone, `${recruiter.id}-phone`)}
          copied={copiedKey === `${recruiter.id}-phone`}
        />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-3 border-t border-[color:var(--color-border)] px-4 py-4 sm:grid-cols-2 sm:px-5">
        <DetailRow
          icon={<SuitcaseIcon size={14} />}
          label="Experience"
          value={recruiter.experience}
        />
        <DetailRow
          icon={<BuildingsIcon size={14} />}
          label="Company"
          value={recruiter.company}
        />
        <DetailRow
          icon={<TagIcon size={14} />}
          label="Current Role"
          value={recruiter.title}
        />
        <DetailRow
          icon={<UsersIcon size={14} />}
          label="Company Size"
          value={recruiter.companySize}
        />
        <DetailRow
          icon={<BuildingsIcon size={14} />}
          label="Industry"
          value={recruiter.industry}
        />
        <DetailRow
          icon={<PinIcon size={14} />}
          label="Location"
          value={recruiter.location}
        />
        <DetailRow
          icon={<GraduationCapIcon size={14} />}
          label="Education"
          value={recruiter.education}
        />
        <DetailRow
          icon={<SparklesIcon size={14} />}
          label="Profile Source"
          value="LinkedIn, Web Sources"
        />
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/30 px-4 py-3 sm:px-5">
        <p className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)] sm:text-[12px]">
          <ClockIcon size={12} />
          Enriched on {recruiter.enrichedAt}
        </p>
        <button
          type="button"
          onClick={onReEnrich}
          className="inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
        >
          <RefreshIcon size={12} />
          Re-enrich
        </button>
      </footer>
    </section>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-[color:var(--color-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Recruiter["status"] }) {
  const map = {
    Success:       { fg: "var(--chip-success-fg)", bg: "var(--chip-success-bg)" },
    Failed:        { fg: "var(--chip-error-fg)",   bg: "var(--chip-error-bg)" },
    "In Progress": { fg: "var(--chip-neutral-fg)", bg: "var(--chip-neutral-bg)" },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[999px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ color: s.fg, background: s.bg }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: s.fg }}
      />
      {status}
    </span>
  );
}

// ─── Reveal Card ─────────────────────────────────────────────────────────────

function RevealCard({
  label,
  kind,
  icon,
  accent,
  tint,
  value,
  mask,
  revealed,
  isRevealing,
  onReveal,
  onCopy,
  copied,
}: {
  label: string;
  kind: "email" | "phone";
  icon: React.ReactNode;
  accent: string;
  tint: string;
  value: string;
  mask: string;
  revealed: boolean;
  isRevealing: boolean;
  onReveal: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="flex items-center justify-between gap-2 px-3.5 pt-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-[9px]"
            style={{ background: tint, color: accent }}
          >
            {icon}
          </span>
          <p className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
            {label}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-[999px] px-1.5 py-0.5 text-[10px] font-bold"
          style={
            revealed
              ? { background: "var(--chip-success-bg)", color: "var(--chip-success-fg)" }
              : { background: "var(--chip-neutral-bg)", color: "var(--color-text-muted)" }
          }
        >
          {revealed ? <CheckIcon size={9} /> : null}
          {revealed ? "Verified" : "Hidden"}
        </span>
      </div>

      <div
        className={`mx-3.5 mt-2.5 min-h-[40px] rounded-[8px] px-3 py-2 font-mono text-[13px] leading-[20px] ${
          revealed
            ? "bg-[color:var(--color-surface-2)] font-semibold text-[color:var(--color-text)]"
            : "bg-[color:var(--color-surface-2)]/60 tracking-[0.12em] text-[color:var(--color-text-muted)]"
        }`}
      >
        <span className="break-all">{revealed ? value : mask}</span>
      </div>

      <div className="p-3.5">
        {revealed ? (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] border text-[12px] font-semibold transition-all"
            style={
              copied
                ? {
                    background: "var(--chip-success-bg)",
                    color: "var(--chip-success-fg)",
                    borderColor: "var(--color-brand-200)",
                  }
                : {
                    background: "transparent",
                    color: "var(--color-text-secondary)",
                    borderColor: "var(--color-border)",
                  }
            }
          >
            {copied ? (
              <>
                <CheckIcon size={13} />
                Copied
              </>
            ) : (
              <>
                <CopyIcon size={13} />
                Copy {kind}
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onReveal}
            disabled={isRevealing}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] border px-3 text-[12px] font-semibold transition-all disabled:cursor-wait disabled:opacity-70"
            style={{
              background: tint,
              color: accent,
              borderColor: "var(--color-brand-200)",
            }}
          >
            {isRevealing ? (
              <>
                <Spinner />
                Revealing…
              </>
            ) : (
              <>
                Reveal {kind === "email" ? "Email" : "Phone Number"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Sidebar: Activity ───────────────────────────────────────────────────────

function ActivityCard({
  recruiters,
  activeId,
  onSelect,
}: {
  recruiters: Recruiter[];
  activeId: string;
  onSelect: (r: Recruiter) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
      <header className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">
          Enrichment Activity
        </h3>
        <button
          type="button"
          className="text-[11px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
        >
          View all
        </button>
      </header>
      <ul className="max-h-[320px] overflow-y-auto lg:max-h-none">
        {recruiters.map((r) => {
          const isActive = r.id === activeId;
          return (
            <li
              key={r.id}
              className="border-t border-[color:var(--color-border)] first:border-t"
            >
              <button
                type="button"
                onClick={() => onSelect(r)}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-[color:var(--color-brand-50)]"
                    : "hover:bg-[color:var(--color-surface-2)]/60"
                }`}
              >
                <Avatar name={r.name} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
                    {r.name}
                  </p>
                  <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
                    {r.title} at {r.company}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusPill status={r.status} />
                  <span className="text-[10px] text-[color:var(--color-text-muted)]">
                    {r.enrichedAt.includes("ago") ||
                    r.enrichedAt.includes("min") ||
                    r.enrichedAt.includes("hr")
                      ? r.enrichedAt
                      : "2 min ago"}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Sidebar: Overview (donut) ───────────────────────────────────────────────

function OverviewCard({
  successful,
  failed,
  inProgress,
  total,
}: {
  successful: number;
  failed: number;
  inProgress: number;
  total: number;
}) {
  const segments = [
    { name: "Successful", value: successful, color: "#EA6814" },
    { name: "Failed", value: failed, color: "#9F430D" },
    { name: "In Progress", value: inProgress, color: "#6B6358" },
  ];
  const pct = (n: number) =>
    `${Math.round((n / Math.max(1, total)) * 1000) / 10}%`;

  return (
    <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">
          Enrichment Overview
        </h3>
        <span className="inline-flex h-7 items-center gap-1 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">
          This Week
        </span>
      </header>

      <div className="flex items-center gap-4">
        <div className="relative flex shrink-0 items-center justify-center">
          <DonutChart segments={segments} size={110} stroke={14} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold leading-none tracking-tight text-[color:var(--color-text)]">
              {total}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
              Total
            </span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2">
          {segments.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-2 text-[12px]"
            >
              <span className="inline-flex items-center gap-1.5 truncate">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="truncate font-medium text-[color:var(--color-text-secondary)]">
                  {s.name}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-[color:var(--color-text)]">
                <span className="font-semibold">{s.value}</span>
                <span className="ml-1 text-[11px] text-[color:var(--color-text-muted)]">
                  ({pct(s.value)})
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── Sidebar: Accuracy chart ─────────────────────────────────────────────────

function AccuracyCard({
  accuracy,
  points,
}: {
  accuracy: number;
  points: number[];
}) {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">
          Accuracy Rate
        </h3>
        <span className="inline-flex h-7 items-center gap-1 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">
          This Week
        </span>
      </header>

      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[28px] font-bold leading-none tracking-tight text-[color:var(--color-success)]">
          {accuracy}%
        </span>
        <span className="text-[11px] font-semibold text-[color:var(--color-text-muted)]">
          High accuracy rate
        </span>
      </div>

      <div className="relative">
        {/* gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-px w-full bg-[color:var(--color-border)]/60"
            />
          ))}
        </div>
        <div className="relative">
          <Sparkline
            data={points}
            color="#EA6814"
            width={280}
            height={80}
            fill
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-[color:var(--color-text-muted)]">
        <span>May 12</span>
        <span>May 14</span>
        <span>May 16</span>
        <span>May 18</span>
      </div>
    </section>
  );
}
