"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import {
  ArrowLeftIcon,
  AtIcon,
  BriefcaseIcon,
  BuildingsIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  ChevronDown,
  ChevronRight,
  ClockIcon,
  EditIcon,
  IdCardIcon,
  MoneyIcon,
  MoreIcon,
  PaperPlaneIcon,
  PhoneIcon,
  PinIcon,
  ProfileIcon,
  SparklesIcon,
  TargetIcon,
  TasksIcon,
  TrendUpIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { WorkloadTab } from "@/components/team/TeamWorkloadTab";
import { TargetsActivityTab } from "@/components/team/TeamTargetsActivityTab";
import { SettingsTab } from "@/components/team/TeamSettingsTab";
import {
  memberDetailTabs,
  type ActivityKind,
  type DetailStat,
  type MemberDetail,
  type MemberOverview,
  type TeamRole,
} from "@/lib/team-data";

/* ── Exact accent palette pulled from the design. Neutrals / surfaces / brand
   purple come from the app's CSS tokens so it stays theme-consistent. ──────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const GREEN_BG = "#EAFBF1";
const BLUE = "#2563EB";
const BLUE_BG = "#EAF2FF";
const VIOLET = "#7C3AED";
const ORANGE = "#F59E0B";
const ORANGE_BG = "#FEF3C7";
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

const ROLE_STYLE: Record<TeamRole, { bg: string; fg: string }> = {
  "Team Lead": { bg: BRAND_SOFT, fg: "var(--color-brand-600)" },
  Recruiter: { bg: BLUE_BG, fg: BLUE },
  "Bench Sales": { bg: GREEN_BG, fg: GREEN },
  Admin: { bg: "#F3E8FF", fg: VIOLET },
};

/* ── Small inline glyph for the delta chevron ─────────────────────────────── */
function ArrowUp({ size = 12, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path
        d="M6 9.5v-7M3 5.5 6 2.5l3 3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Header action buttons ────────────────────────────────────────────────── */
function HeaderActions() {
  const [roleOpen, setRoleOpen] = useState(false);
  const btn =
    "inline-flex h-10 items-center gap-2 rounded-[11px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 text-[13px] font-semibold transition-colors hover:bg-[color:var(--color-surface-2)]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={`${btn} text-[color:var(--color-brand-600)]`}>
        <ChatIcon size={16} />
        Message
      </button>
      <button type="button" className={`${btn} text-[color:var(--color-text)]`}>
        <EditIcon size={16} />
        Edit
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setRoleOpen((o) => !o)}
          className={`${btn} text-[color:var(--color-text)]`}
        >
          Change Role
          <ChevronDown size={14} className={`transition-transform ${roleOpen ? "rotate-180" : ""}`} />
        </button>
        {roleOpen ? (
          <div
            className="absolute right-0 z-20 mt-1 w-[150px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
            onMouseLeave={() => setRoleOpen(false)}
          >
            {(["Admin", "Team Lead", "Recruiter", "Bench Sales"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleOpen(false)}
                className="block w-full px-3 py-2 text-left text-[12.5px] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)]"
              >
                {r}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="More actions"
        className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
      >
        <MoreIcon size={18} />
      </button>
    </div>
  );
}

/* ── Header KPI mini-cards ────────────────────────────────────────────────── */
function HeaderStat({
  icon,
  iconBg,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3.5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <span className="text-[12px] font-medium text-[color:var(--color-text-secondary)]">
          {label}
        </span>
      </div>
      <p
        className="mt-2 text-[22px] font-extrabold leading-none tracking-tight"
        style={{ color: valueColor ?? "var(--color-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function ProfileHeader({ member }: { member: MemberDetail }) {
  const role = ROLE_STYLE[member.role];
  const active = member.status === "Active";
  return (
    <section className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Identity */}
        <div className="flex items-start gap-4 sm:gap-5">
          <Avatar name={member.name} image={member.image} size={92} />
          <div className="min-w-0">
            <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[color:var(--color-text)] sm:text-[28px]">
              {member.name}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13.5px] text-[color:var(--color-text-secondary)]">
              <span>{member.email}</span>
              <span className="text-[color:var(--color-text-muted)]">•</span>
              <span>{member.phone}</span>
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
                style={{ background: role.bg, color: role.fg }}
              >
                {member.role}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: active ? GREEN_SOLID : "var(--color-text-muted)" }}
                />
                <span style={{ color: active ? GREEN : "var(--color-text-muted)" }}>
                  {member.status}
                </span>
              </span>
            </div>
            <p className="mt-2.5 text-[12.5px] text-[color:var(--color-text-muted)]">
              {member.joined}
              <span className="mx-1.5">•</span>
              {member.lastActive}
            </p>
          </div>
        </div>

        {/* Actions + KPI strip */}
        <div className="flex flex-col gap-4 xl:items-end">
          <HeaderActions />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeaderStat
              label="Consultants"
              value={String(member.header.consultants)}
              iconBg={BRAND_SOFT}
              icon={<UsersIcon size={16} className="text-[color:var(--color-brand-600)]" />}
            />
            <HeaderStat
              label="Open Jobs"
              value={String(member.header.openJobs)}
              iconBg={BRAND_SOFT}
              icon={<CalendarIcon size={16} className="text-[color:var(--color-brand-600)]" />}
            />
            <HeaderStat
              label="Placements (mo)"
              value={String(member.header.placements)}
              iconBg={GREEN_BG}
              icon={<BriefcaseIcon size={16} style={{ color: GREEN }} />}
            />
            <HeaderStat
              label="Margin"
              value={member.header.margin}
              valueColor={GREEN}
              iconBg={GREEN_BG}
              icon={<MoneyIcon size={16} style={{ color: GREEN }} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Tabs ─────────────────────────────────────────────────────────────────── */
function Tabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="border-b border-[color:var(--color-border)]">
      <div className="flex flex-wrap gap-x-7 gap-y-1">
        {memberDetailTabs.map((tab) => {
          const on = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={`relative -mb-px border-b-2 pb-3 pt-1 text-[14px] font-semibold transition-colors ${
                on
                  ? "border-[color:var(--color-brand-500)] text-[color:var(--color-brand-600)]"
                  : "border-transparent text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Placements & Margin line chart ───────────────────────────────────────── */
function PlacementsMarginChart({ chart }: { chart: MemberDetail["chart"] }) {
  const W = 600;
  const H = 250;
  const padL = 30;
  const padR = 46;
  const padT = 14;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = chart.months.length;

  const x = (i: number) => padL + (plotW * i) / (n - 1);
  const yL = (v: number) => padT + plotH * (1 - v / chart.placementsMax);
  const yR = (v: number) => padT + plotH * (1 - v / chart.marginMax);

  const placePts = chart.placements.map((v, i) => [x(i), yL(v)] as const);
  const marginPts = chart.margin.map((v, i) => [x(i), yR(v)] as const);
  const line = (pts: ReadonlyArray<readonly [number, number]>) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area =
    line(marginPts) +
    ` L${x(n - 1).toFixed(1)} ${(padT + plotH).toFixed(1)} L${padL.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;
  const placeArea =
    line(placePts) +
    ` L${x(n - 1).toFixed(1)} ${(padT + plotH).toFixed(1)} L${padL.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const gridFracs = [0, 0.25, 0.5, 0.75, 1];
  const leftLabels = [12, 9, 6, 3, 0];
  const rightLabels = ["$20K", "$15K", "$10K", "$5K", "$0"];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-[250px] w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label="Placements and margin over time"
    >
      <defs>
        <linearGradient id="marginFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GREEN_SOLID} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GREEN_SOLID} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="placeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines + axis labels */}
      {gridFracs.map((f, i) => {
        const gy = padT + plotH * f;
        return (
          <g key={f}>
            <line
              x1={padL}
              y1={gy}
              x2={W - padR}
              y2={gy}
              stroke="var(--color-border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={padL - 6}
              y={gy + 3}
              textAnchor="end"
              fontSize="10"
              fill="var(--color-text-muted)"
            >
              {leftLabels[i]}
            </text>
            <text
              x={W - padR + 6}
              y={gy + 3}
              textAnchor="start"
              fontSize="10"
              fill="var(--color-text-muted)"
            >
              {rightLabels[i]}
            </text>
          </g>
        );
      })}

      {/* Placements area (purple) */}
      <path d={placeArea} fill="url(#placeFill)" stroke="none" />
      {/* Margin area + line (green) */}
      <path d={area} fill="url(#marginFill)" stroke="none" />
      <path
        d={line(marginPts)}
        fill="none"
        stroke={GREEN_SOLID}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Placements line (purple) */}
      <path
        d={line(placePts)}
        fill="none"
        stroke="var(--color-brand-500)"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Data points */}
      {marginPts.map((p, i) => (
        <circle
          key={`m${i}`}
          cx={p[0]}
          cy={p[1]}
          r="3.5"
          fill={GREEN_SOLID}
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {placePts.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p[0]}
          cy={p[1]}
          r="3.5"
          fill="var(--color-brand-500)"
          stroke="none"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* X axis labels */}
      {chart.months.map((m, i) => (
        <text
          key={m}
          x={x(i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-muted)"
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

function ChartCard({ member }: { member: MemberDetail }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">
          Placements &amp; Margin Over Time
        </h3>
        <div className="flex items-center gap-4 text-[12.5px] text-[color:var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
            Placements
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN_SOLID }} />
            Margin
          </span>
        </div>
      </div>
      <div className="mt-5">
        <PlacementsMarginChart chart={member.chart} />
      </div>
    </div>
  );
}

/* ── Ranking & Stats ──────────────────────────────────────────────────────── */
function RankingRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-3.5 py-3">
      <span className="inline-flex items-center gap-2.5 text-[13px] text-[color:var(--color-text-secondary)]">
        <span className="text-[color:var(--color-text-muted)]">{icon}</span>
        {label}
      </span>
      <span
        className="text-[13px] font-bold"
        style={{ color: valueColor ?? "var(--color-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

function RankingCard({ member }: { member: MemberDetail }) {
  const r = member.ranking;
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Ranking &amp; Stats</h3>
        <div className="text-right">
          <p className="text-[34px] font-extrabold leading-none tracking-tight text-[color:var(--color-brand-600)]">
            #{r.rank}
          </p>
          <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">
            of {r.of} recruiters
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        <RankingRow
          icon={<ClockIcon size={16} />}
          label="Avg time-to-fill"
          value={r.avgTimeToFill}
        />
        <RankingRow
          icon={<UsersIcon size={16} />}
          label="Active pipeline"
          value={r.activePipeline}
        />
        <RankingRow
          icon={<MoneyIcon size={16} />}
          label="Margin this quarter"
          value={r.marginQuarter}
          valueColor={GREEN}
        />
      </div>
    </div>
  );
}

/* ── Headline metric cards ────────────────────────────────────────────────── */
function MetricCard({
  icon,
  iconBg,
  label,
  stat,
  progress,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  stat: DetailStat;
  progress?: number;
}) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
            {label}
          </p>
          <p className="mt-0.5 text-[28px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {stat.value}
          </p>
        </div>
      </div>
      {progress !== undefined ? (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: BRAND }}
          />
        </div>
      ) : null}
      <p className="mt-3.5 flex items-center gap-1.5 text-[12.5px]">
        <span className="inline-flex items-center gap-1 font-bold" style={{ color: GREEN }}>
          <ArrowUp color={GREEN} />
          {stat.delta}
        </span>
        <span className="text-[color:var(--color-text-muted)]">{stat.note}</span>
      </p>
    </div>
  );
}

function MetricRow({ member }: { member: MemberDetail }) {
  const m = member.metrics;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Submittals"
        stat={m.submittals}
        iconBg={BRAND_SOFT}
        icon={<PaperPlaneIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <MetricCard
        label="Interviews"
        stat={m.interviews}
        iconBg={BRAND_SOFT}
        icon={<UsersIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <MetricCard
        label="Placements"
        stat={m.placements}
        iconBg={GREEN_BG}
        icon={<BriefcaseIcon size={22} style={{ color: GREEN }} />}
      />
      <MetricCard
        label="Conversion Rate"
        stat={m.conversion}
        progress={m.conversion.percent}
        iconBg={BRAND_SOFT}
        icon={<TargetIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
    </div>
  );
}

/* ── Conversion funnel ────────────────────────────────────────────────────── */
function ConversionMetricsCard({ member }: { member: MemberDetail }) {
  return (
    <div className={`${CARD} flex h-full flex-col p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Conversion Metrics</h3>
      <div className="flex flex-1 flex-col justify-center">
        <div className="mt-5 flex items-stretch gap-1.5">
          {member.funnel.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-1.5">
              <div className="flex-1 rounded-[14px] bg-[color:var(--color-surface-2)] px-2 py-4 text-center">
                <p className="text-[26px] font-extrabold leading-none tracking-tight text-[color:var(--color-brand-600)]">
                  {step.value}
                </p>
                <p className="mt-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
                  {step.label}
                </p>
              </div>
              {i < member.funnel.length - 1 ? (
                <ChevronRight size={16} className="shrink-0 text-[color:var(--color-text-muted)]" />
              ) : null}
            </div>
          ))}
        </div>
        {/* Step conversion percentages, aligned under steps 2-4 */}
        <div className="mt-2.5 flex items-stretch gap-1.5">
          {member.funnel.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-1.5">
              <div className="flex-1 text-center text-[12.5px] font-semibold text-[color:var(--color-text-secondary)]">
                {step.conv ?? ""}
              </div>
              {i < member.funnel.length - 1 ? <span className="w-4 shrink-0" /> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Recent activity ──────────────────────────────────────────────────────── */
const ACTIVITY_STYLE: Record<
  ActivityKind,
  { bg: string; fg: string; icon: React.ReactNode }
> = {
  placed: { bg: GREEN_BG, fg: GREEN, icon: <CheckIcon size={15} /> },
  interview: { bg: BRAND_SOFT, fg: "var(--color-brand-600)", icon: <CalendarIcon size={15} /> },
  submitted: { bg: BRAND_SOFT, fg: "var(--color-brand-600)", icon: <PaperPlaneIcon size={15} /> },
  added: { bg: ORANGE_BG, fg: ORANGE, icon: <UserPlusIcon size={15} /> },
  moved: { bg: GREEN_BG, fg: GREEN, icon: <CheckIcon size={15} /> },
};

function RecentActivityCard({ member }: { member: MemberDetail }) {
  return (
    <div className={`${CARD} flex h-full flex-col p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Recent Activity</h3>
      <ul className="mt-5 flex flex-1 flex-col justify-between gap-2.5">
        {member.activity.map((a, i) => {
          const s = ACTIVITY_STYLE[a.kind];
          return (
            <li key={i} className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ background: s.bg, color: s.fg }}
              >
                {s.icon}
              </span>
              <p className="min-w-0 flex-1 truncate text-[13px] text-[color:var(--color-text)]">
                {a.text}
              </p>
              <span className="shrink-0 whitespace-nowrap text-[12px] text-[color:var(--color-text-muted)]">
                {a.time}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Overview: top-performer banner ───────────────────────────────────────── */
function TriangleUp({ size = 9, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 9" fill="none" aria-hidden className="shrink-0">
      <path d="M5 0.5 9.33 8H0.67L5 0.5Z" fill={color} />
    </svg>
  );
}

function OverviewBanner({ member }: { member: MemberDetail }) {
  const o = member.overview;
  return (
    <section
      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[16px] px-5 py-4 sm:px-6"
      style={{ background: "var(--color-brand-100)" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--color-brand-500)" }}
      >
        <SparklesIcon size={20} className="text-white" />
      </span>
      <span className="text-[16px] font-bold text-[color:var(--color-text)]">{o.headline}</span>
      <span className="h-5 w-px bg-[color:var(--color-brand-200)]" aria-hidden />
      <span className="text-[14px] font-semibold text-[color:var(--color-brand-600)]">
        #{member.ranking.rank} of {member.ranking.of} recruiters
      </span>
      <span className="h-5 w-px bg-[color:var(--color-brand-200)]" aria-hidden />
      <span className="text-[14px] font-semibold text-[color:var(--color-brand-600)]">
        {o.status.target.percent}% to target
      </span>
    </section>
  );
}

/* ── Overview: KPI cards ──────────────────────────────────────────────────── */
function KpiCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  delta,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
  delta: string;
}) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">
            {label}
          </p>
          <p
            className="mt-1 text-[28px] font-extrabold leading-none tracking-tight"
            style={{ color: valueColor ?? "var(--color-text)" }}
          >
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3.5 flex items-center gap-1.5 text-[12.5px]">
        <span className="inline-flex items-center gap-1 font-bold" style={{ color: GREEN }}>
          <TriangleUp color={GREEN} />
          {delta}
        </span>
        <span className="text-[color:var(--color-text-muted)]">vs last month</span>
      </p>
    </div>
  );
}

function KpiRow({ member }: { member: MemberDetail }) {
  const m = member.metrics;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="This Month Placements"
        value={String(member.header.placements)}
        delta={m.placements.delta}
        iconBg={BRAND_SOFT}
        icon={<BriefcaseIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <KpiCard
        label="Submittals"
        value={m.submittals.value}
        delta={m.submittals.delta}
        iconBg={BRAND_SOFT}
        icon={<PaperPlaneIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <KpiCard
        label="Interviews"
        value={m.interviews.value}
        delta={m.interviews.delta}
        iconBg={BRAND_SOFT}
        icon={<UsersIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <KpiCard
        label="Margin Generated"
        value={member.header.margin}
        valueColor={GREEN}
        delta={member.overview.marginDelta}
        iconBg={GREEN_BG}
        icon={<MoneyIcon size={22} style={{ color: GREEN }} />}
      />
    </div>
  );
}

/* ── Overview: Profile Details ────────────────────────────────────────────── */
function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[color:var(--color-text-muted)]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[12px] text-[color:var(--color-text-muted)]">{label}</p>
        <p className="mt-0.5 text-[14px] font-semibold text-[color:var(--color-text)]">{value}</p>
      </div>
    </div>
  );
}

function ProfileDetailsCard({ member }: { member: MemberDetail }) {
  const p = member.overview.profile;
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Profile Details</h3>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <ProfileField
          icon={<ProfileIcon size={17} />}
          label="Full Name"
          value={member.name}
        />
        <ProfileField icon={<BriefcaseIcon size={17} />} label="Role" value={member.role} />
        <ProfileField icon={<AtIcon size={17} />} label="Email" value={member.email} />
        <ProfileField
          icon={<UsersIcon size={17} />}
          label="Department / Team"
          value={p.department}
        />
        <ProfileField icon={<PhoneIcon size={17} />} label="Phone" value={member.phone} />
        <ProfileField icon={<PinIcon size={17} />} label="Location" value={p.location} />
        <ProfileField
          icon={<IdCardIcon size={17} />}
          label="Employee ID"
          value={p.employeeId}
        />
        <ProfileField
          icon={<ProfileIcon size={17} />}
          label="Reports to"
          value={p.reportsTo}
        />
      </div>
      <div className="my-5 h-px bg-[color:var(--color-border)]" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div>
          <p className="text-[12px] text-[color:var(--color-text-muted)]">Specialization</p>
          <p className="mt-0.5 text-[14px] font-semibold text-[color:var(--color-text)]">
            {p.specialization}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-[color:var(--color-text-muted)]">Languages</p>
          <p className="mt-0.5 text-[14px] font-semibold text-[color:var(--color-text)]">
            {p.languages}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Overview: Current Status ─────────────────────────────────────────────── */
function StatusRow({
  icon,
  iconBg,
  iconColor,
  label,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <span className="text-[13px] text-[color:var(--color-text-muted)]">{label}</span>
      <div className="ml-auto flex min-w-0 items-center gap-3">{children}</div>
    </div>
  );
}

function CurrentStatusCard({ member }: { member: MemberDetail }) {
  const s = member.overview.status;
  const active = member.status === "Active";
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Current Status</h3>
      <div className="mt-5 space-y-5">
        {/* Status — stacked label + value */}
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: active ? GREEN_BG : "var(--color-surface-2)" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: active ? GREEN_SOLID : "var(--color-text-muted)" }}
            />
          </span>
          <div>
            <p className="text-[12px] text-[color:var(--color-text-muted)]">Status</p>
            <p
              className="text-[14px] font-semibold"
              style={{ color: active ? GREEN : "var(--color-text-muted)" }}
            >
              {member.status}
            </p>
          </div>
        </div>

        <StatusRow
          icon={<TargetIcon size={17} />}
          iconBg={BRAND_SOFT}
          iconColor="var(--color-brand-600)"
          label="Target Progress"
        >
          <div className="h-2 w-28 overflow-hidden rounded-full bg-[color:var(--color-surface-2)] sm:w-40">
            <div
              className="h-full rounded-full"
              style={{ width: `${s.target.percent}%`, background: BRAND }}
            />
          </div>
          <span className="whitespace-nowrap text-[13px] font-semibold text-[color:var(--color-text)]">
            {s.target.done} / {s.target.goal} placements ({s.target.percent}%)
          </span>
        </StatusRow>

        <StatusRow
          icon={<TrendUpIcon size={17} />}
          iconBg={BRAND_SOFT}
          iconColor="var(--color-brand-600)"
          label="Avg Utilization of Consultants"
        >
          <span className="text-[13px] font-bold text-[color:var(--color-text)]">
            {s.utilization}%
          </span>
        </StatusRow>

        <StatusRow
          icon={<UsersIcon size={17} />}
          iconBg={BRAND_SOFT}
          iconColor="var(--color-brand-600)"
          label="Consultants on Bench"
        >
          <span className="text-[13px] font-bold text-[color:var(--color-text)]">{s.bench}</span>
        </StatusRow>

        <StatusRow
          icon={<ClockIcon size={17} />}
          iconBg={BRAND_SOFT}
          iconColor="var(--color-brand-600)"
          label="Last Login"
        >
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {s.lastLogin}
          </span>
        </StatusRow>
      </div>
    </div>
  );
}

/* ── Overview: Quick Snapshot ─────────────────────────────────────────────── */
function SnapshotItem({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[color:var(--color-brand-100)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">{label}</p>
        <p className="mt-0.5 text-[24px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
          {value}
        </p>
        <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">{unit}</p>
      </div>
    </div>
  );
}

function QuickSnapshotCard({ snapshot }: { snapshot: MemberOverview["snapshot"] }) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Quick Snapshot</h3>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotItem
          icon={<UsersIcon size={22} className="text-[color:var(--color-brand-600)]" />}
          label="Active Pipeline"
          value={snapshot.activePipeline}
          unit="candidates"
        />
        <SnapshotItem
          icon={<BriefcaseIcon size={22} className="text-[color:var(--color-brand-600)]" />}
          label="Open Jobs"
          value={snapshot.openJobs}
          unit="jobs"
        />
        <SnapshotItem
          icon={<CalendarIcon size={22} className="text-[color:var(--color-brand-600)]" />}
          label="This Week"
          value={snapshot.thisWeekInterviews}
          unit="interviews"
        />
        <SnapshotItem
          icon={<TasksIcon size={22} className="text-[color:var(--color-brand-600)]" />}
          label="Pending Follow-ups"
          value={snapshot.pendingFollowups}
          unit="tasks"
        />
      </div>
    </div>
  );
}

/* ── Overview tab body ────────────────────────────────────────────────────── */
function OverviewTab({ member }: { member: MemberDetail }) {
  return (
    <div className="space-y-5">
      <OverviewBanner member={member} />
      <KpiRow member={member} />
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <ProfileDetailsCard member={member} />
        <CurrentStatusCard member={member} />
      </div>
      <QuickSnapshotCard snapshot={member.overview.snapshot} />
    </div>
  );
}

/* ── Performance tab body ─────────────────────────────────────────────────── */
function PerformanceTab({ member }: { member: MemberDetail }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <ChartCard member={member} />
        <RankingCard member={member} />
      </div>

      <MetricRow member={member} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        <ConversionMetricsCard member={member} />
        <RecentActivityCard member={member} />
      </div>
    </div>
  );
}

/* ── Placeholder body for the non-Performance tabs ────────────────────────── */
function PlaceholderTab({ tab, member }: { tab: string; member: MemberDetail }) {
  return (
    <div className={`${CARD} flex flex-col items-center justify-center gap-2 px-6 py-16 text-center`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-brand-600)]">
        <UsersIcon size={22} />
      </span>
      <p className="text-[15px] font-bold text-[color:var(--color-text)]">{tab}</p>
      <p className="max-w-[360px] text-[13px] text-[color:var(--color-text-secondary)]">
        {member.name}&rsquo;s {tab.toLowerCase()} view will appear here. Switch to the Performance
        tab to review live metrics.
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function TeamMemberDetail({ member }: { member: MemberDetail }) {
  const [tab, setTab] = useState<string>("Overview");
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-7">
      {/* Breadcrumb / back */}
      <div className="flex items-center gap-2 text-[14px]">
        <Link
          href="/team"
          className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          aria-label="Back to Team"
        >
          <ArrowLeftIcon size={16} />
        </Link>
        <Link
          href="/team"
          className="font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
        >
          Team
        </Link>
        <span className="text-[color:var(--color-text-muted)]">/</span>
        <span className="font-semibold text-[color:var(--color-text)]">{member.name}</span>
      </div>

      <ProfileHeader member={member} />

      <Tabs active={tab} onChange={setTab} />

      {tab === "Overview" ? (
        <OverviewTab member={member} />
      ) : tab === "Performance" ? (
        <PerformanceTab member={member} />
      ) : tab === "Workload" ? (
        <WorkloadTab member={member} />
      ) : tab === "Targets & Activity" ? (
        <TargetsActivityTab member={member} />
      ) : tab === "Settings & Permissions" ? (
        <SettingsTab member={member} />
      ) : (
        <PlaceholderTab tab={tab} member={member} />
      )}
    </div>
  );
}
