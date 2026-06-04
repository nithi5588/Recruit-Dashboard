"use client";

import Link from "next/link";
import {
  BriefcaseIcon,
  CalendarIcon,
  MatchIcon,
  PlusIcon,
  TasksIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { useRole } from "@/components/role/RoleProvider";
import type { Role } from "@/lib/roles";

type HeroAction = {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "ghost";
};

// Each role lands on the same dashboard but with a different "what to do next".
const ROLE_ACTIONS: Record<Role, HeroAction[]> = {
  owner: [
    { href: "/candidates/new", icon: <PlusIcon size={14} />, label: "Add candidate", variant: "primary" },
    { href: "/assistant", icon: <MatchIcon size={14} />, label: "Run AI match", variant: "ghost" },
    { href: "/pipeline", icon: <BriefcaseIcon size={14} />, label: "View pipeline", variant: "ghost" },
  ],
  recruiter: [
    { href: "/candidates/new", icon: <PlusIcon size={14} />, label: "Add candidate", variant: "primary" },
    { href: "/assistant", icon: <MatchIcon size={14} />, label: "Run AI match", variant: "ghost" },
    { href: "/tasks", icon: <TasksIcon size={14} />, label: "My tasks", variant: "ghost" },
  ],
  bench_sales: [
    { href: "/candidates/new", icon: <PlusIcon size={14} />, label: "Add to bench", variant: "primary" },
    { href: "/matches", icon: <MatchIcon size={14} />, label: "Match to roles", variant: "ghost" },
    { href: "/pipeline", icon: <BriefcaseIcon size={14} />, label: "View pipeline", variant: "ghost" },
  ],
};

const ROLE_CHIP: Record<Role, { bg: string; fg: string }> = {
  owner: { bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  recruiter: { bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" },
  bench_sales: {
    bg: "var(--color-success-light, #EAFBF1)",
    fg: "var(--color-success, #16A34A)",
  },
};

export function DashboardHero({
  userName,
  greeting,
  weekday,
  month,
  day,
  interviewsToday,
  openTasks,
  highPriority,
}: {
  userName: string;
  greeting: string;
  weekday: string;
  month: string;
  day: number;
  interviewsToday: number;
  openTasks: number;
  highPriority: number;
}) {
  const { role, def } = useRole();
  const chip = ROLE_CHIP[role];
  const actions = ROLE_ACTIONS[role];

  return (
    <header className="dash-hero">
      <div className="flex flex-wrap items-center gap-2">
        <span className="dash-date-pill">
          <CalendarIcon size={12} />
          {weekday}, {month} {day}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[11px] font-bold tracking-[0.01em]"
          style={{ background: chip.bg, color: chip.fg }}
          aria-label={`Active role: ${def.label}`}
        >
          {def.label} · {def.dashboardHeadline}
        </span>
      </div>

      <h1 className="dash-hero-title">
        {greeting}, {userName}.{" "}
        <span className="wave" aria-hidden>
          👋
        </span>
      </h1>
      <p className="dash-hero-sub">
        {def.dashboardSubtitle} You have{" "}
        <strong>
          {interviewsToday} interview{interviewsToday === 1 ? "" : "s"}
        </strong>{" "}
        and{" "}
        <strong>
          {openTasks} task{openTasks === 1 ? "" : "s"}
        </strong>{" "}
        on your plate today.
      </p>

      <div className="dash-stat-pills">
        <Link href="/calendar" className="dash-stat-pill dash-pill-brand">
          <span className="dash-stat-pill-icon" aria-hidden>
            <CalendarIcon size={14} />
          </span>
          <span className="dash-stat-pill-value">{interviewsToday}</span>
          <span className="dash-stat-pill-label">interviews today</span>
        </Link>
        <Link href="/tasks" className="dash-stat-pill dash-pill-amber">
          <span className="dash-stat-pill-icon" aria-hidden>
            <TasksIcon size={14} />
          </span>
          <span className="dash-stat-pill-value">{openTasks}</span>
          <span className="dash-stat-pill-label">tasks pending</span>
        </Link>
        <Link
          href="/candidates?priority=high"
          className="dash-stat-pill dash-pill-rose"
        >
          <span className="dash-stat-pill-icon" aria-hidden>
            <UsersIcon size={14} />
          </span>
          <span className="dash-stat-pill-value">{highPriority}</span>
          <span className="dash-stat-pill-label">high priority</span>
        </Link>
      </div>

      <div className="dash-actions">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={
              a.variant === "primary"
                ? "dash-action dash-action-primary"
                : "dash-action dash-action-ghost"
            }
          >
            <span aria-hidden>{a.icon}</span>
            <span>{a.label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
