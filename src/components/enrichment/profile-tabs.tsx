"use client";

import type { ReactNode } from "react";
import {
  AtIcon,
  BuildingsIcon,
  CheckIcon,
  ChatIcon,
  ClockIcon,
  DocumentIcon,
  GlobeIcon,
  GraduationCapIcon,
  PhoneIcon,
  PinIcon,
  ShareIcon,
  ShieldIcon,
  SparklesIcon,
  SuitcaseIcon,
  TagIcon,
  UsersIcon,
  VerifiedBadgeIcon,
} from "@/components/icons/AppIcons";
import type {
  Recruiter,
} from "@/components/enrichment/enrichment-data";

export type ProfileTab =
  | "overview"
  | "experience"
  | "education"
  | "skills"
  | "activity"
  | "about";

export const TAB_DEFS: { id: ProfileTab; label: string; count?: (r: Recruiter) => number }[] = [
  { id: "overview", label: "Overview" },
  {
    id: "experience",
    label: "Experience",
    count: (r) => r.experience.length,
  },
  {
    id: "education",
    label: "Education",
    count: (r) => r.educationEntries.length,
  },
  {
    id: "skills",
    label: "Skills",
    count: (r) =>
      r.skillsCategorized.reduce((sum, c) => sum + c.skills.length, 0),
  },
  {
    id: "activity",
    label: "Activity",
    count: (r) => r.activity.length,
  },
  { id: "about", label: "About" },
];

// ─── Tab strip ───────────────────────────────────────────────────────────────

export function TabStrip({
  current,
  onChange,
  recruiter,
}: {
  current: ProfileTab;
  onChange: (t: ProfileTab) => void;
  recruiter: Recruiter;
}) {
  return (
    <nav
      role="tablist"
      aria-label="Enriched profile sections"
      className="-mx-4 flex overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <ul className="flex min-w-max items-center gap-1 border-b border-[color:var(--color-border)]">
        {TAB_DEFS.map((tab) => {
          const isActive = tab.id === current;
          const count = tab.count?.(recruiter);
          return (
            <li key={tab.id} className="shrink-0">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={`-mb-px inline-flex h-10 items-center gap-1.5 border-b-2 px-3 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? "border-[color:var(--color-brand-500)] text-[color:var(--color-text)]"
                    : "border-transparent text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {tab.label}
                {typeof count === "number" && count > 0 ? (
                  <span
                    className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ${
                      isActive
                        ? "bg-[color:var(--color-brand-500)] text-white"
                        : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Section helpers ─────────────────────────────────────────────────────────

function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="min-w-0">
        <h4 className="text-[14px] font-bold text-[color:var(--color-text)]">
          {title}
        </h4>
        {hint ? (
          <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">
            {hint}
          </p>
        ) : null}
      </div>
      {action ?? null}
    </div>
  );
}

function CompanyMonogram({
  name,
  color,
  size = 36,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-[8px] font-bold text-white"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.round(size * 0.36),
      }}
    >
      {initials}
    </span>
  );
}

// ─── Overview tab ────────────────────────────────────────────────────────────

export function OverviewPanel({
  recruiter,
  contactSlot,
}: {
  recruiter: Recruiter;
  contactSlot: ReactNode;
}) {
  return (
    <div className="space-y-5">
      {/* Contact reveal cards */}
      {contactSlot}

      {/* Inline About preview */}
      <section>
        <SectionTitle title="About" />
        <p className="text-[13px] leading-[22px] text-[color:var(--color-text-secondary)]">
          {recruiter.about}
        </p>
      </section>

      {/* Profile facts */}
      <section>
        <SectionTitle title="Profile facts" />
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
          <DetailRow
            icon={<SuitcaseIcon size={14} />}
            label="Current Role"
            value={`${recruiter.title} at ${recruiter.company}`}
          />
          <DetailRow
            icon={<TagIcon size={14} />}
            label="Focus"
            value={recruiter.focus}
          />
          <DetailRow
            icon={<BuildingsIcon size={14} />}
            label="Industry"
            value={recruiter.industry}
          />
          <DetailRow
            icon={<UsersIcon size={14} />}
            label="Company Size"
            value={recruiter.companySize}
          />
          <DetailRow
            icon={<PinIcon size={14} />}
            label="Location"
            value={recruiter.location}
          />
          <DetailRow
            icon={<ClockIcon size={14} />}
            label="On LinkedIn since"
            value={recruiter.joinedLinkedIn}
          />
        </div>
      </section>

      {/* Source attribution */}
      <section>
        <SectionTitle
          title="Profile sources"
          hint="Where we pulled the data from"
        />
        <ul className="flex flex-wrap gap-1.5">
          {recruiter.source.map((s) => (
            <li key={s}>
              <span className="inline-flex items-center gap-1 rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">
                <ShieldIcon size={11} />
                {s}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ─── Experience tab ──────────────────────────────────────────────────────────

export function ExperiencePanel({ recruiter }: { recruiter: Recruiter }) {
  if (recruiter.experience.length === 0) {
    return <EmptyState title="No experience scraped" />;
  }
  return (
    <ol className="relative space-y-5 pl-7 before:absolute before:left-[14px] before:top-1 before:bottom-1 before:w-px before:bg-[color:var(--color-border)]">
      {recruiter.experience.map((e, i) => (
        <li key={`${e.company}-${i}`} className="relative">
          <span
            className="absolute -left-7 top-0 inline-flex h-7 w-7 items-center justify-center rounded-[8px] ring-2 ring-[color:var(--color-surface)]"
            style={{ background: e.companyColor }}
            aria-hidden
          >
            <CompanyMonogram
              name={e.company}
              color={e.companyColor}
              size={28}
            />
          </span>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[color:var(--color-text)]">
                  {e.title}
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
                  <span className="font-semibold text-[color:var(--color-text)]">
                    {e.company}
                  </span>
                  <span className="mx-1.5 text-[color:var(--color-border-strong)]">
                    ·
                  </span>
                  {e.employmentType}
                </p>
              </div>
              {e.current ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-50)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-brand-600)]">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-500)]"
                  />
                  Current
                </span>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[color:var(--color-text-secondary)]">
              <span className="inline-flex items-center gap-1">
                <ClockIcon size={11} />
                {e.dates}
              </span>
              <span className="text-[color:var(--color-text-muted)]">
                {e.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <PinIcon size={11} />
                {e.location}
              </span>
            </div>

            {e.description ? (
              <p className="mt-2.5 text-[12.5px] leading-[20px] text-[color:var(--color-text-secondary)]">
                {e.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── Education tab ───────────────────────────────────────────────────────────

export function EducationPanel({ recruiter }: { recruiter: Recruiter }) {
  if (recruiter.educationEntries.length === 0) {
    return <EmptyState title="No education scraped" />;
  }
  return (
    <ul className="space-y-3">
      {recruiter.educationEntries.map((e, i) => (
        <li
          key={`${e.school}-${i}`}
          className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]"
        >
          <div className="flex items-start gap-3">
            <CompanyMonogram
              name={e.school}
              color={e.schoolColor}
              size={40}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-[color:var(--color-text)]">
                {e.school}
              </p>
              <p className="mt-0.5 text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
                <GraduationCapIcon
                  size={12}
                  className="mr-1 inline-block align-[-2px] text-[color:var(--color-text-muted)]"
                />
                {e.degree}
                {e.field ? (
                  <>
                    <span className="mx-1.5 text-[color:var(--color-border-strong)]">
                      ·
                    </span>
                    {e.field}
                  </>
                ) : null}
              </p>
              <p className="mt-1 text-[11.5px] text-[color:var(--color-text-muted)]">
                {e.dates}
              </p>
              {e.activities ? (
                <p className="mt-2 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
                  <span className="font-semibold text-[color:var(--color-text)]">
                    Activities:
                  </span>{" "}
                  {e.activities}
                </p>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ─── Skills tab ──────────────────────────────────────────────────────────────

export function SkillsPanel({ recruiter }: { recruiter: Recruiter }) {
  if (recruiter.skillsCategorized.length === 0) {
    return <EmptyState title="No skills scraped" />;
  }

  const totalEndorsements = recruiter.skillsCategorized
    .flatMap((c) => c.skills.map((s) => s.endorsements))
    .reduce((a, b) => a + b, 0);
  const maxEndorsement = Math.max(
    ...recruiter.skillsCategorized.flatMap((c) =>
      c.skills.map((s) => s.endorsements),
    ),
    1,
  );

  return (
    <div className="space-y-5">
      <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-3.5 py-2.5 text-[12px] text-[color:var(--color-text-secondary)]">
        <span className="font-semibold text-[color:var(--color-text)]">
          {totalEndorsements.toLocaleString()}
        </span>{" "}
        total endorsements across{" "}
        <span className="font-semibold text-[color:var(--color-text)]">
          {recruiter.skillsCategorized.flatMap((c) => c.skills).length}
        </span>{" "}
        skills
      </div>

      {recruiter.skillsCategorized.map((cat) => (
        <section key={cat.category}>
          <SectionTitle title={cat.category} />
          <ul className="space-y-1.5">
            {cat.skills
              .slice()
              .sort((a, b) => b.endorsements - a.endorsements)
              .map((s) => {
                const pct = Math.round((s.endorsements / maxEndorsement) * 100);
                return (
                  <li
                    key={s.name}
                    className="group rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 transition-colors hover:border-[color:var(--color-border-strong)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
                        {s.name}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[color:var(--color-text-secondary)] tabular-nums">
                        {s.endorsements}
                        <span className="text-[color:var(--color-text-muted)]">
                          endorsements
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                      <span
                        aria-hidden
                        className="block h-full rounded-full bg-[color:var(--color-brand-500)] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ─── Activity tab ────────────────────────────────────────────────────────────

const ACTIVITY_META: Record<
  string,
  { label: string; icon: ReactNode; tone: string }
> = {
  post: {
    label: "Posted",
    icon: <DocumentIcon size={12} />,
    tone: "var(--color-brand-600)",
  },
  repost: {
    label: "Reposted",
    icon: <ShareIcon size={12} />,
    tone: "var(--color-text-secondary)",
  },
  like: {
    label: "Liked",
    icon: <SparklesIcon size={12} />,
    tone: "var(--color-text-muted)",
  },
  comment: {
    label: "Commented",
    icon: <ChatIcon size={12} />,
    tone: "var(--color-text-secondary)",
  },
  article: {
    label: "Wrote an article",
    icon: <DocumentIcon size={12} />,
    tone: "var(--color-brand-600)",
  },
};

export function ActivityPanel({ recruiter }: { recruiter: Recruiter }) {
  if (recruiter.activity.length === 0) {
    return <EmptyState title="No recent activity scraped" />;
  }
  return (
    <ul className="space-y-3">
      {recruiter.activity.map((a, i) => {
        const meta = ACTIVITY_META[a.type] ?? ACTIVITY_META.post;
        return (
          <li
            key={i}
            className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 shadow-[var(--shadow-card)]"
          >
            <header className="mb-2 flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
                style={{ color: meta.tone }}
              >
                {meta.icon}
                {meta.label}
              </span>
              <span className="text-[11px] text-[color:var(--color-text-muted)]">
                {a.when}
              </span>
            </header>
            {a.context ? (
              <p className="mb-1 text-[11.5px] italic text-[color:var(--color-text-muted)]">
                {a.context}
              </p>
            ) : null}
            <p className="text-[13px] leading-[20px] text-[color:var(--color-text)]">
              {a.text}
            </p>
            {(a.reactions || a.comments) ? (
              <div className="mt-2.5 flex items-center gap-3 text-[11px] text-[color:var(--color-text-secondary)]">
                {typeof a.reactions === "number" ? (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <SparklesIcon size={11} />
                    {a.reactions.toLocaleString()} reactions
                  </span>
                ) : null}
                {typeof a.comments === "number" ? (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <ChatIcon size={11} />
                    {a.comments.toLocaleString()} comments
                  </span>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// ─── About tab ───────────────────────────────────────────────────────────────

export function AboutPanel({ recruiter }: { recruiter: Recruiter }) {
  return (
    <div className="space-y-5">
      <section>
        <SectionTitle title="Summary" />
        <p className="whitespace-pre-line text-[13px] leading-[22px] text-[color:var(--color-text-secondary)]">
          {recruiter.about}
        </p>
      </section>

      <section>
        <SectionTitle title="Languages" />
        {recruiter.languages.length === 0 ? (
          <p className="text-[12px] text-[color:var(--color-text-muted)]">
            None scraped.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {recruiter.languages.map((l) => (
              <li
                key={l.name}
                className="flex items-center justify-between gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2"
              >
                <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[color:var(--color-text)]">
                  <GlobeIcon size={13} />
                  {l.name}
                </span>
                <span className="text-[11px] text-[color:var(--color-text-secondary)]">
                  {l.level}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionTitle title="Certifications" />
        {recruiter.certifications.length === 0 ? (
          <p className="text-[12px] text-[color:var(--color-text-muted)]">
            None scraped.
          </p>
        ) : (
          <ul className="space-y-2">
            {recruiter.certifications.map((c) => (
              <li
                key={c.name}
                className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2.5"
              >
                <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                  {c.name}
                </p>
                <p className="mt-0.5 text-[11.5px] text-[color:var(--color-text-secondary)]">
                  {c.issuer}
                  <span className="mx-1.5 text-[color:var(--color-border-strong)]">
                    ·
                  </span>
                  Issued {c.year}
                  {c.expiry ? ` · Expires ${c.expiry}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <SectionTitle title="Verification" />
        <ul className="space-y-2 text-[12.5px]">
          <VerifyRow
            icon={<AtIcon size={13} />}
            label="Work email matches company domain"
            verified
          />
          <VerifyRow
            icon={<PhoneIcon size={13} />}
            label="Phone number passed format checks"
            verified
          />
          <VerifyRow
            icon={<VerifiedBadgeIcon size={13} />}
            label="LinkedIn profile is publicly accessible"
            verified={!!recruiter.verified}
          />
          <VerifyRow
            icon={<ShieldIcon size={13} />}
            label="No bot/automation flags detected"
            verified
          />
        </ul>
      </section>
    </div>
  );
}

function VerifyRow({
  icon,
  label,
  verified,
}: {
  icon: ReactNode;
  label: string;
  verified: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2">
      <span className="inline-flex items-center gap-2 text-[color:var(--color-text)]">
        <span className="text-[color:var(--color-text-muted)]">{icon}</span>
        {label}
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide"
        style={
          verified
            ? {
                background: "var(--chip-success-bg)",
                color: "var(--chip-success-fg)",
              }
            : {
                background: "var(--chip-neutral-bg)",
                color: "var(--color-text-muted)",
              }
        }
      >
        {verified ? <CheckIcon size={9} /> : null}
        {verified ? "Verified" : "Pending"}
      </span>
    </li>
  );
}

// ─── Detail row + empty state ────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
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
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p className="mt-0.5 text-[13px] font-medium text-[color:var(--color-text)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-4 py-10 text-center">
      <p className="text-[13px] font-semibold text-[color:var(--color-text-secondary)]">
        {title}
      </p>
      <p className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">
        Try re-running enrichment to fill this section.
      </p>
    </div>
  );
}
