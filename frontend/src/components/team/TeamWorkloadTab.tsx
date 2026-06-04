"use client";

import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronRight,
  InfoIcon,
  MoreIcon,
  PaperPlaneIcon,
  TargetIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { MemberDetail } from "@/lib/team-data";
import {
  getMemberWorkload,
  type ConsultantStatus,
  type ConsultantVisa,
  type MemberWorkload,
  type PipelineStageKind,
  type WorkloadStatusTone,
} from "@/lib/team-workload-data";

/* ── Accent palette — mirrors the design exactly; neutrals/brand come from the
   app's CSS tokens so it stays theme-consistent. ──────────────────────────── */
const GREEN = "#16A34A";
const GREEN_BG = "#EAFBF1";
const BLUE = "#2563EB";
const BLUE_BG = "#EAF2FF";
const VIOLET = "#5B3DF5";
const VIOLET_BG = "#ECEAFE";
const ORANGE = "#B45309";
const ORANGE_SOLID = "#F59E0B";
const ORANGE_BG = "#FEF3C7";
const RED = "#DC2626";
const RED_BG = "#FDECEC";
const BRAND = "var(--color-brand-500)";
const BRAND_600 = "var(--color-brand-600)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* ── Small inline arrow for the inline "View all →" links ──────────────────── */
function ArrowRightSm({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InlineLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-500)]"
    >
      {children}
      <ArrowRightSm />
    </button>
  );
}

/* ── Initials chip — soft pastel tint hashed off the name ──────────────────── */
const AVATAR_TINTS: Array<{ bg: string; fg: string }> = [
  { bg: BRAND_SOFT, fg: BRAND_600 },
  { bg: BLUE_BG, fg: BLUE },
  { bg: GREEN_BG, fg: GREEN },
  { bg: "#FFF1F2", fg: "#E11D48" },
  { bg: ORANGE_BG, fg: ORANGE },
  { bg: VIOLET_BG, fg: VIOLET },
];
function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_TINTS[Math.abs(h) % AVATAR_TINTS.length];
}
function InitialChip({ name, size = 32 }: { name: string; size?: number }) {
  const t = tintFor(name);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: t.bg,
        color: t.fg,
        fontSize: Math.max(11, Math.round(size * 0.36)),
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* ── Pill badge ────────────────────────────────────────────────────────────── */
function Pill({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

const VISA_STYLE: Record<ConsultantVisa, { bg: string; fg: string }> = {
  H1B: { bg: ORANGE_BG, fg: ORANGE },
  GC: { bg: VIOLET_BG, fg: VIOLET },
  USC: { bg: BLUE_BG, fg: BLUE },
  OPT: { bg: GREEN_BG, fg: GREEN },
};
const STATUS_STYLE: Record<ConsultantStatus, { bg: string; fg: string }> = {
  "On Bench": { bg: RED_BG, fg: RED },
  "On Project": { bg: GREEN_BG, fg: GREEN },
};
const TONE_STYLE: Record<WorkloadStatusTone, { fg: string; iconBg: string }> = {
  good: { fg: GREEN, iconBg: GREEN_BG },
  warn: { fg: ORANGE_SOLID, iconBg: ORANGE_BG },
  bad: { fg: RED, iconBg: RED_BG },
};

/* ── Top KPI strip ─────────────────────────────────────────────────────────── */
function TopStat({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  small,
  footer,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
  footer: React.ReactNode;
}) {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
            {label}
          </p>
          <p
            className={`mt-1 font-extrabold leading-none tracking-tight ${
              small ? "text-[20px]" : "text-[26px]"
            }`}
            style={{ color: valueColor ?? "var(--color-text)" }}
          >
            {value}
          </p>
        </div>
      </div>
      <div className="mt-3">{footer}</div>
    </div>
  );
}

function TopStrip({ member, w }: { member: MemberDetail; w: MemberWorkload }) {
  const tone = TONE_STYLE[w.status.tone];
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <TopStat
        label="Consultants Managed"
        value={String(w.consultantsTotal)}
        iconBg={BRAND_SOFT}
        icon={<UsersIcon size={20} className="text-[color:var(--color-brand-600)]" />}
        footer={<InlineLink>View all consultants</InlineLink>}
      />
      <TopStat
        label="Open Jobs Assigned"
        value={String(w.jobsTotal)}
        iconBg={BRAND_SOFT}
        icon={<CalendarIcon size={20} className="text-[color:var(--color-brand-600)]" />}
        footer={<InlineLink>View all jobs</InlineLink>}
      />
      <TopStat
        label="Active Submissions"
        value={String(w.activeSubmissions)}
        iconBg={BRAND_SOFT}
        icon={<PaperPlaneIcon size={20} className="text-[color:var(--color-brand-600)]" />}
        footer={<InlineLink>View submissions</InlineLink>}
      />
      <TopStat
        label="Workload Status"
        value={w.status.label}
        valueColor={tone.fg}
        small
        iconBg={tone.iconBg}
        icon={<UsersIcon size={20} style={{ color: tone.fg }} />}
        footer={
          <p className="text-[12.5px] text-[color:var(--color-text-muted)]">{w.status.note}</p>
        }
      />
    </div>
  );
}

/* ── Consultants Managed table ─────────────────────────────────────────────── */
const TH =
  "pb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-text-muted)]";

function ConsultantsCard({ w }: { w: MemberWorkload }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
        Consultants Managed ({w.consultantsTotal})
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="text-left">
              <th className={TH}>Consultant</th>
              <th className={TH}>Skill / Tech</th>
              <th className={TH}>Visa</th>
              <th className={TH}>Status</th>
              <th className={TH}>Client</th>
              <th className={TH}>Bill Rate</th>
              <th className={`${TH} text-right`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {w.consultants.map((c) => {
              const v = VISA_STYLE[c.visa];
              const s = STATUS_STYLE[c.status];
              return (
                <tr key={c.name} className="border-t border-[color:var(--color-border)]">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2.5">
                      <InitialChip name={c.name} />
                      <span className="text-[13.5px] font-semibold text-[color:var(--color-text)]">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">
                    {c.skill}
                  </td>
                  <td className="py-3 pr-3">
                    <Pill bg={v.bg} fg={v.fg}>
                      {c.visa}
                    </Pill>
                  </td>
                  <td className="py-3 pr-3">
                    <Pill bg={s.bg} fg={s.fg}>
                      {c.status}
                    </Pill>
                  </td>
                  <td className="py-3 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">
                    {c.client ?? <span className="text-[color:var(--color-text-muted)]">—</span>}
                  </td>
                  <td className="py-3 pr-3 text-[13px] font-semibold text-[color:var(--color-text)]">
                    {c.rate}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-500)]"
                      >
                        Reassign
                      </button>
                      <button
                        type="button"
                        aria-label="More actions"
                        className="flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
                      >
                        <MoreIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
        <p className="text-[12.5px] text-[color:var(--color-text-muted)]">
          Showing {w.consultants.length} of {w.consultantsTotal} consultants
        </p>
        <InlineLink>View all</InlineLink>
      </div>
    </div>
  );
}

/* ── Open Jobs table ───────────────────────────────────────────────────────── */
function OpenJobsCard({ w }: { w: MemberWorkload }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
        Open Jobs ({w.jobsTotal})
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse">
          <thead>
            <tr className="text-left">
              <th className={TH}>Job Title</th>
              <th className={TH}>Client</th>
              <th className={TH}>Days Open</th>
              <th className={TH}>Submitted</th>
              <th className={TH}>Status</th>
            </tr>
          </thead>
          <tbody>
            {w.jobs.map((j) => (
              <tr key={j.title} className="border-t border-[color:var(--color-border)]">
                <td className="py-3 pr-3 text-[13.5px] font-semibold text-[color:var(--color-text)]">
                  {j.title}
                </td>
                <td className="py-3 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">
                  {j.client}
                </td>
                <td className="py-3 pr-3">
                  <span
                    className="text-[13px] font-bold"
                    style={{
                      color: j.daysOpen > 20 ? ORANGE_SOLID : "var(--color-text)",
                    }}
                  >
                    {j.daysOpen}
                  </span>
                </td>
                <td className="py-3 pr-3 text-[13px] font-semibold text-[color:var(--color-text)]">
                  {j.submitted}
                </td>
                <td className="py-3">
                  <Pill bg={BLUE_BG} fg={BLUE}>
                    {j.status}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 border-t border-[color:var(--color-border)] pt-4">
        <InlineLink>View all jobs</InlineLink>
      </div>
    </div>
  );
}

/* ── Active Pipeline ───────────────────────────────────────────────────────── */
const PIPELINE_ICON: Record<PipelineStageKind, React.ReactNode> = {
  submitted: <UsersIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  interview: <TargetIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  offered: <BriefcaseIcon size={16} className="text-[color:var(--color-brand-600)]" />,
};

function PipelineCard({ w }: { w: MemberWorkload }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Active Pipeline</h3>
      <div className="mt-4 flex items-stretch gap-1.5">
        {w.pipeline.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 items-center gap-1.5">
            <div className="flex-1 rounded-[16px] bg-[color:var(--color-surface-2)] p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)]">
                  {PIPELINE_ICON[stage.kind]}
                </span>
                <span className="text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
                  {stage.label}
                </span>
              </div>
              <p className="mt-2.5 text-[26px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
                {stage.count}
              </p>
              <ul className="mt-2.5 space-y-1">
                {stage.names.map((n) => (
                  <li
                    key={n}
                    className="truncate text-[12.5px] text-[color:var(--color-text-secondary)]"
                  >
                    {n}
                  </li>
                ))}
                {stage.more ? (
                  <li className="text-[12px] text-[color:var(--color-text-muted)]">
                    +{stage.more} more
                  </li>
                ) : null}
              </ul>
            </div>
            {i < w.pipeline.length - 1 ? (
              <ChevronRight
                size={16}
                className="shrink-0 self-center text-[color:var(--color-text-muted)]"
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Capacity & Distribution ───────────────────────────────────────────────── */
function CapacityCard({ w }: { w: MemberWorkload }) {
  const c = w.capacity;
  const barColor = c.percent >= 100 ? RED : BRAND;
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
        Capacity &amp; Distribution
      </h3>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Consultant load */}
        <div className="shrink-0 lg:w-[170px]">
          <p className="text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
            Consultant Load
          </p>
          <p className="mt-1.5 text-[26px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {c.load}{" "}
            <span className="text-[16px] font-semibold text-[color:var(--color-text-muted)]">
              of {c.recommended}
            </span>
          </p>
          <p className="mt-1.5 text-[12px] text-[color:var(--color-text-muted)]">
            Recommended capacity
          </p>
        </div>

        {/* Load bar */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min(c.percent, 100)}%`, background: barColor }}
              />
            </div>
            <span
              className="shrink-0 text-[18px] font-extrabold tracking-tight"
              style={{ color: barColor }}
            >
              {c.percent}%
            </span>
          </div>
          <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">{c.untilLimit}</p>
        </div>

        {/* Bench exposure */}
        <div className="shrink-0 lg:w-[200px] lg:border-l lg:border-[color:var(--color-border)] lg:pl-6">
          <p className="text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
            Bench Exposure
          </p>
          <p className="mt-1.5 text-[14px] font-bold" style={{ color: c.benchIdle > 0 ? RED : GREEN }}>
            {c.benchIdle} consultant{c.benchIdle === 1 ? "" : "s"} idle
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-text)]">
            {c.benchAccrued} accrued
            <InfoIcon size={13} className="text-[color:var(--color-text-muted)]" />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Workload tab body ─────────────────────────────────────────────────────── */
export function WorkloadTab({ member }: { member: MemberDetail }) {
  const w = getMemberWorkload(member.slug);
  return (
    <div className="space-y-5">
      <TopStrip member={member} w={w} />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {/* Left column */}
        <div className="space-y-5">
          <ConsultantsCard w={w} />
          <CapacityCard w={w} />
        </div>
        {/* Right column */}
        <div className="space-y-5">
          <OpenJobsCard w={w} />
          <PipelineCard w={w} />
        </div>
      </div>
    </div>
  );
}
