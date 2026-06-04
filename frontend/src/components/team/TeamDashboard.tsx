"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart } from "@/components/ui/DonutChart";
import {
  BriefcaseIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import {
  leaderboard,
  pendingInvites,
  permissionColumns,
  rolePermissions,
  targets,
  teamComposition,
  teamKpis,
  memberSlug,
  teamMembers,
  teamMembersMeta,
  topPerformer,
  workload,
  workloadAlert,
  workloadMax,
  workloadTicks,
  type MemberStatus,
  type Perm,
  type TeamRole,
} from "@/lib/team-data";

/* ── Exact accent palette pulled from the design (green / amber / red / blue /
   violet). Neutrals, surfaces and brand-purple come from the app's CSS tokens
   so the layout stays theme-consistent with the rest of the product. ──────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const GREEN_BG = "#EAFBF1";
const ORANGE = "#F59E0B";
const ORANGE_BG = "#FEF3C7";
const RED = "#DC2626";
const RED_SOFT = "#FEF2F2";
const BLUE = "#2563EB";
const BLUE_BG = "#EAF2FF";
const VIOLET = "#7C3AED";
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* ── Role chip tints — soft pills that stay scannable. ────────────────────── */
const ROLE_STYLE: Record<TeamRole, { bg: string; fg: string }> = {
  "Team Lead": { bg: BRAND_SOFT, fg: "var(--color-brand-600)" },
  Recruiter: { bg: BLUE_BG, fg: BLUE },
  "Bench Sales": { bg: GREEN_BG, fg: GREEN },
  Admin: { bg: "#F3E8FF", fg: VIOLET },
};

/* ── Small inline icons not in the shared set ─────────────────────────────── */
function ActivityIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12h3.5l2-6 3.5 12 2.5-7 1.5 1h5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
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
function CheckMark({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LockIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="7" width="10" height="6.5" rx="1.6" stroke={color} strokeWidth="1.5" />
      <path d="M5.2 7V5.3a2.8 2.8 0 0 1 5.6 0V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function WarningTriangleIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1" fill={color} />
    </svg>
  );
}

/* ── Filter / period select (display-only) ────────────────────────────────── */
function FilterSelect({
  label,
  options,
  width = 130,
}: {
  label?: string;
  options: string[];
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[0]);
  return (
    <div className="flex items-center gap-2">
      {label ? (
        <span className="whitespace-nowrap text-[12.5px] text-[color:var(--color-text-secondary)]">
          {label}
        </span>
      ) : null}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-8 items-center justify-between gap-1.5 rounded-[9px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 text-[12.5px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
          style={{ minWidth: width }}
        >
          {value}
          <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div
            className="absolute right-0 z-20 mt-1 overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
            style={{ width: Math.max(width, 130) }}
            onMouseLeave={() => setOpen(false)}
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  setValue(o);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-[12.5px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
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
    </div>
  );
}

/* ── KPI cards ────────────────────────────────────────────────────────────── */
function KpiCard({
  icon,
  iconBg,
  label,
  value,
  delta,
  note,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  delta: string;
  note: string;
}) {
  return (
    <div className={`${CARD} p-[22px]`}>
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">{label}</p>
          <p className="mt-1 text-[30px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-[12.5px]">
        <span className="inline-flex items-center gap-1 font-bold" style={{ color: GREEN }}>
          <ArrowUp color={GREEN} />
          {delta}
        </span>
        <span className="text-[color:var(--color-text-muted)]">{note}</span>
      </p>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Team Members"
        value={teamKpis.teamMembers.value}
        delta={teamKpis.teamMembers.delta}
        note={teamKpis.teamMembers.note}
        iconBg={BRAND_SOFT}
        icon={<UsersIcon size={22} className="text-[color:var(--color-brand-600)]" />}
      />
      <KpiCard
        label="Active This Week"
        value={teamKpis.activeThisWeek.value}
        delta={teamKpis.activeThisWeek.delta}
        note={teamKpis.activeThisWeek.note}
        iconBg={GREEN_BG}
        icon={<ActivityIcon size={22} color={GREEN} />}
      />
      <KpiCard
        label="Total Placements"
        value={teamKpis.totalPlacements.value}
        delta={teamKpis.totalPlacements.delta}
        note={teamKpis.totalPlacements.note}
        iconBg={GREEN_BG}
        icon={<BriefcaseIcon size={22} style={{ color: GREEN }} />}
      />
      <KpiCard
        label="Pending Invites"
        value={teamKpis.pendingInvites.value}
        delta={teamKpis.pendingInvites.delta}
        note={teamKpis.pendingInvites.note}
        iconBg={ORANGE_BG}
        icon={<UserPlusIcon size={22} style={{ color: ORANGE }} />}
      />
    </div>
  );
}

/* ── Team Members table ───────────────────────────────────────────────────── */
function RoleChip({ role }: { role: TeamRole }) {
  const s = ROLE_STYLE[role];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {role}
    </span>
  );
}

function StatusCell({ status }: { status: MemberStatus }) {
  const active = status === "Active";
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: active ? GREEN_SOLID : "var(--color-text-muted)" }}
      />
      <span style={{ color: active ? GREEN : "var(--color-text-muted)" }}>{status}</span>
    </span>
  );
}

function num(v: number | null) {
  return v === null ? "—" : String(v);
}

function TeamMembersCard() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allChecked = teamMembers.every((m) => selected[m.name]);
  const toggleAll = () =>
    setSelected(allChecked ? {} : Object.fromEntries(teamMembers.map((m) => [m.name, true])));

  const headers = [
    "Member",
    "Role",
    "Status",
    "Consultants",
    "Open Jobs",
    "Placements (mo)",
    "Margin Generated",
    "Actions",
  ];

  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Team Members</h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <FilterSelect
            label="Filter by Role"
            options={["All Roles", "Team Lead", "Recruiter", "Bench Sales", "Admin"]}
            width={120}
          />
          <FilterSelect
            label="Filter by Status"
            options={["All Statuses", "Active", "Invited"]}
            width={120}
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="pb-3 pl-1 pr-3 text-left align-middle">
                <input
                  type="checkbox"
                  className="app-checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label="Select all members"
                />
              </th>
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={`pb-3 pr-3 ${i === headers.length - 1 ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-text-muted)] ${
                      i === headers.length - 1 ? "justify-end" : ""
                    }`}
                  >
                    {h}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => (
              <tr key={m.name} className="border-t border-[color:var(--color-border)]">
                <td className="py-3.5 pl-1 pr-3 align-middle">
                  <input
                    type="checkbox"
                    className="app-checkbox"
                    checked={Boolean(selected[m.name])}
                    onChange={() => setSelected((s) => ({ ...s, [m.name]: !s[m.name] }))}
                    aria-label={`Select ${m.name}`}
                  />
                </td>
                <td className="py-3.5 pr-3">
                  <Link
                    href={`/team/${memberSlug(m.name)}`}
                    className="group flex items-center gap-2.5"
                  >
                    <Avatar name={m.name} image={m.image} size={34} />
                    <div className="min-w-0">
                      <p className="whitespace-nowrap text-[13px] font-semibold text-[color:var(--color-text)] transition-colors group-hover:text-[color:var(--color-brand-600)]">
                        {m.name}
                      </p>
                      <p className="whitespace-nowrap text-[11.5px] text-[color:var(--color-text-muted)]">
                        {m.email}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-3.5 pr-3">
                  <RoleChip role={m.role} />
                </td>
                <td className="py-3.5 pr-3">
                  <StatusCell status={m.status} />
                </td>
                <td className="py-3.5 pr-3 text-[13px] text-[color:var(--color-text)]">
                  {num(m.consultants)}
                </td>
                <td className="py-3.5 pr-3 text-[13px] text-[color:var(--color-text)]">
                  {num(m.openJobs)}
                </td>
                <td className="py-3.5 pr-3 text-[13px] text-[color:var(--color-text)]">
                  {num(m.placements)}
                </td>
                <td
                  className="py-3.5 pr-3 whitespace-nowrap text-[13px] font-bold"
                  style={{ color: m.margin ? GREEN : "var(--color-text-muted)" }}
                >
                  {m.margin ?? "—"}
                </td>
                <td className="py-3.5 pr-1">
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
                      aria-label={`More actions for ${m.name}`}
                    >
                      <MoreIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
        <p className="text-[12.5px] text-[color:var(--color-text-secondary)]">
          Showing {teamMembersMeta.from} to {teamMembersMeta.to} of {teamMembersMeta.total} members
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[color:var(--color-border)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: teamMembersMeta.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-[9px] text-[12.5px] font-semibold transition-colors ${
                p === 1
                  ? "text-[color:var(--color-brand-600)]"
                  : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
              }`}
              style={p === 1 ? { background: BRAND_SOFT } : undefined}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[color:var(--color-border)] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Team Insights rail ───────────────────────────────────────────────────── */
function TopPerformerCard() {
  return (
    <div className={`${CARD} p-5`}>
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
        Top Performer
      </p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={topPerformer.name} image={topPerformer.image} size={40} />
          <div>
            <p className="text-[14px] font-bold text-[color:var(--color-text)]">{topPerformer.name}</p>
            <p className="text-[12.5px] text-[color:var(--color-text-secondary)]">{topPerformer.role}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-extrabold leading-none tracking-tight" style={{ color: GREEN }}>
            {topPerformer.margin}
          </p>
          <p className="mt-1 text-[12px] text-[color:var(--color-text-muted)]">{topPerformer.marginNote}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[color:var(--color-border)] pt-4">
        <div>
          <p className="text-[18px] font-bold leading-none text-[color:var(--color-text)]">
            {topPerformer.placements}
          </p>
          <p className="mt-1.5 text-[12px] text-[color:var(--color-text-secondary)]">Placements</p>
        </div>
        <div>
          <p className="text-[18px] font-bold leading-none text-[color:var(--color-text)]">
            {topPerformer.conversion}
          </p>
          <p className="mt-1.5 text-[12px] text-[color:var(--color-text-secondary)]">Conversion</p>
        </div>
      </div>
    </div>
  );
}

function TeamCompositionCard() {
  const total = teamComposition.reduce((sum, s) => sum + s.count, 0);
  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-[15px] font-bold text-[color:var(--color-text)]">Team Composition</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="shrink-0">
          <DonutChart
            size={108}
            stroke={18}
            rounded
            ariaLabel={`Team of ${total} across ${teamComposition.length} role groups`}
            segments={teamComposition.map((s) => ({
              name: s.label,
              value: s.count,
              color: s.color,
            }))}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {teamComposition.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 text-[12.5px] text-[color:var(--color-text-secondary)]">
                {s.label}
              </span>
              <span className="text-[12.5px] font-bold text-[color:var(--color-text)]">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PendingInvitesCard() {
  const chipStyle = (chip: "gray" | "green") =>
    chip === "green"
      ? { bg: GREEN_BG, fg: GREEN }
      : { bg: "var(--color-surface-2)", fg: "var(--color-text-secondary)" };
  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-[15px] font-bold text-[color:var(--color-text)]">Pending Invites</h3>
      <div className="mt-4 space-y-3.5">
        {pendingInvites.map((inv) => {
          const s = chipStyle(inv.chip);
          return (
            <div key={inv.name} className="flex items-center gap-2.5">
              <Avatar name={inv.name} image={inv.image} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                  {inv.name}
                </p>
                <p className="truncate text-[12px] text-[color:var(--color-text-muted)]">{inv.email}</p>
              </div>
              <span
                className="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                style={{ background: s.bg, color: s.fg }}
              >
                {inv.role}
              </span>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
      >
        View all invites
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function TeamInsights() {
  return (
    <div className="space-y-5">
      <h2 className="text-[17px] font-bold text-[color:var(--color-text)]">Team Insights</h2>
      <TopPerformerCard />
      <TeamCompositionCard />
      <PendingInvitesCard />
    </div>
  );
}

/* ── Performance Leaderboard ──────────────────────────────────────────────── */
const RANK_COLOR: Record<number, string> = {
  1: BRAND,
  2: "#A78BFA",
  3: "#FB7185",
};

function LeaderboardCard() {
  const max = Math.max(...leaderboard.map((r) => r.amount));
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Performance Leaderboard</h3>
        <FilterSelect options={["This Month", "Last Month", "This Quarter"]} width={120} />
      </div>
      <div className="mt-5 space-y-4">
        {leaderboard.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: RANK_COLOR[r.rank] }}
            >
              {r.rank}
            </span>
            <span className="w-[92px] shrink-0 text-[13px] font-medium text-[color:var(--color-text)]">
              {r.name}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${(r.amount / max) * 100}%`, background: BRAND }}
              />
            </div>
            <span className="w-[58px] shrink-0 text-right text-[13px] font-semibold text-[color:var(--color-text)]">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Targets & Quotas ─────────────────────────────────────────────────────── */
function TargetsCard() {
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Targets &amp; Quotas</h3>
        <FilterSelect options={["This Month", "Last Month", "This Quarter"]} width={120} />
      </div>
      <div className="mt-5 space-y-4">
        {targets.map((t) => (
          <div key={t.name} className="flex items-center gap-3">
            <span className="w-[80px] shrink-0 text-[13px] font-medium text-[color:var(--color-text)]">
              {t.name}
            </span>
            <span className="w-[42px] shrink-0 text-[12.5px] font-semibold text-[color:var(--color-text-secondary)]">
              {t.done} / {t.goal}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${t.percent}%`, background: t.color }}
              />
            </div>
            <span className="w-[38px] shrink-0 text-right text-[13px] font-semibold text-[color:var(--color-text)]">
              {t.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Workload Distribution ────────────────────────────────────────────────── */
function WorkloadCard() {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Workload Distribution</h3>
        <div className="flex items-center gap-4 text-[12.5px] text-[color:var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
            Consultants
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND_SOFT }} />
            Open Jobs
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Bars */}
        <div className="min-w-0">
          <div className="space-y-3.5">
            {workload.map((w) => (
              <div key={w.name} className="flex items-center gap-3">
                <span className="w-[80px] shrink-0 truncate text-[12.5px] font-medium text-[color:var(--color-text)]">
                  {w.name}
                </span>
                <div className="flex h-3.5 flex-1 items-center">
                  {w.consultants > 0 ? (
                    <div
                      className="flex h-full items-center justify-end rounded-l-full pr-1.5"
                      style={{
                        width: `${(w.consultants / workloadMax) * 100}%`,
                        background: BRAND,
                        borderTopRightRadius: w.openJobs > 0 ? 0 : 999,
                        borderBottomRightRadius: w.openJobs > 0 ? 0 : 999,
                      }}
                    >
                      <span className="text-[10.5px] font-bold leading-none text-white">
                        {w.consultants}
                      </span>
                    </div>
                  ) : null}
                  {w.openJobs > 0 ? (
                    <div
                      className="flex h-full items-center justify-end rounded-r-full pr-1.5"
                      style={{
                        width: `${(w.openJobs / workloadMax) * 100}%`,
                        background: BRAND_SOFT,
                        borderTopLeftRadius: w.consultants > 0 ? 0 : 999,
                        borderBottomLeftRadius: w.consultants > 0 ? 0 : 999,
                      }}
                    >
                      <span className="text-[10.5px] font-bold leading-none text-[color:var(--color-brand-600)]">
                        {w.openJobs}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* X axis ticks */}
          <div className="mt-3 flex items-center gap-3">
            <span className="w-[80px] shrink-0" />
            <div className="relative flex-1">
              <div className="flex justify-between text-[11px] text-[color:var(--color-text-muted)]">
                {workloadTicks.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overload alert */}
        <div className="flex items-center">
          <div
            className="flex w-full items-start gap-2.5 rounded-[12px] px-4 py-3.5"
            style={{ background: RED_SOFT }}
          >
            <WarningTriangleIcon size={20} color={RED} />
            <div>
              <p className="text-[13px] font-semibold" style={{ color: RED }}>
                {workloadAlert.name} is overloaded
              </p>
              <p className="mt-0.5 text-[12px] leading-[18px]" style={{ color: RED }}>
                {workloadAlert.detail}
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold"
                style={{ color: RED }}
              >
                View workload
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Roles & Permissions ──────────────────────────────────────────────────── */
function PermCell({ perm }: { perm: Perm }) {
  if (perm === "yes") return <CheckMark size={17} color={GREEN_SOLID} />;
  if (perm === "locked") return <LockIcon size={16} color="var(--color-text-muted)" />;
  return <span className="text-[14px] text-[color:var(--color-text-muted)]">—</span>;
}

function RolesPermissionsCard() {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Roles &amp; Permissions</h3>
        <FilterSelect options={["All Roles", "Admin", "Team Lead", "Recruiter", "Bench Sales"]} width={110} />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr>
              <th className="pb-3 pr-3 text-left">
                <span className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">Role</span>
              </th>
              {permissionColumns.map((c) => (
                <th key={c} className="pb-3 px-3 text-center">
                  <span className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">{c}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rolePermissions.map((r) => (
              <tr key={r.role} className="border-t border-[color:var(--color-border)]">
                <td className="py-3.5 pr-3">
                  <span className="text-[13px] font-semibold text-[color:var(--color-text)]">{r.role}</span>
                </td>
                {r.perms.map((p, i) => (
                  <td key={i} className="py-3.5 px-3">
                    <div className="flex justify-center">
                      <PermCell perm={p} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function TeamDashboard() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-7">
      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)]">Team</h1>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Manage your recruiters, roles and performance.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] px-5 text-[14px] font-semibold text-white transition-colors"
          style={{ background: BRAND }}
        >
          <UserPlusIcon size={18} className="text-white" />
          Invite Member
        </button>
      </div>

      <KpiRow />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <TeamMembersCard />
        <TeamInsights />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LeaderboardCard />
        <TargetsCard />
      </div>

      <WorkloadCard />

      <RolesPermissionsCard />
    </div>
  );
}
