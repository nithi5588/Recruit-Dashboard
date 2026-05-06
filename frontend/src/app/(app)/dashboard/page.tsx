import Link from "next/link";
import {
  BriefcaseIcon,
  CalendarIcon,
  ChevronRight,
  MatchIcon,
  PlusIcon,
  SparklesIcon,
  TasksIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { RecentCandidatesTable } from "@/components/dashboard/RecentCandidatesTable";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule";
import { TopPriorityCandidates } from "@/components/dashboard/TopPriorityCandidates";
import { candidates, tasks, todaysSchedule } from "@/lib/sample-data";

const userName = "Nithish";

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDateParts(d: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d);
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
  return { weekday, month, day: d.getDate() };
}

type StatPillProps = {
  value: number;
  label: string;
  href: string;
  tone: "brand" | "amber" | "rose";
  icon: React.ReactNode;
};

function StatPill({ value, label, href, tone, icon }: StatPillProps) {
  const toneClass =
    tone === "brand"
      ? "dash-pill-brand"
      : tone === "amber"
        ? "dash-pill-amber"
        : "dash-pill-rose";
  return (
    <Link href={href} className={`dash-stat-pill ${toneClass}`}>
      <span className="dash-stat-pill-icon" aria-hidden>{icon}</span>
      <span className="dash-stat-pill-value">{value}</span>
      <span className="dash-stat-pill-label">{label}</span>
    </Link>
  );
}

type HeroActionProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant: "primary" | "ghost";
};

function HeroAction({ href, icon, label, variant }: HeroActionProps) {
  return (
    <Link
      href={href}
      className={
        variant === "primary"
          ? "dash-action dash-action-primary"
          : "dash-action dash-action-ghost"
      }
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function SectionLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-0.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.10em] text-[color:var(--color-text-muted)]">
        {children}
      </span>
      {hint && (
        <span className="text-[11px] text-[color:var(--color-text-muted)]">{hint}</span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const now = new Date();
  const greeting = greetingFor(now.getHours());
  const { weekday, month, day } = formatDateParts(now);

  const interviewsToday = todaysSchedule.length;
  const openTasks = tasks.length;
  const highPriority = candidates.filter((c) => c.priority === "High").length;

  return (
    <>
      <style>{`
        /* ── Hero card ─────────────────────────────────────────────── */
        .dash-hero {
          position: relative;
          isolation: isolate;
          border-radius: 22px;
          padding: 24px;
          color: var(--color-text);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .dash-hero { padding: 28px 30px; }
        }
        .dash-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: var(--color-surface);
        }
        html[data-theme="dark"] .dash-hero::before {
          background: var(--color-surface);
        }

        .dash-date-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.02em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        html[data-theme="dark"] .dash-date-pill {
          background: rgba(255,255,255,0.04);
        }
        .dash-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 999px;
          background: var(--color-success-light, #EAFBF1);
          color: var(--color-success, #15803D);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .dash-status-pill::before {
          content: "";
          display: inline-block;
          width: 6px; height: 6px; border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 18%, transparent);
        }

        .dash-hero-title {
          margin: 14px 0 6px;
          font-size: 26px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: var(--color-text);
        }
        @media (min-width: 640px) {
          .dash-hero-title { font-size: 30px; }
        }
        .dash-hero-title .wave {
          display: inline-block;
          transform-origin: 70% 70%;
          animation: dash-wave 2.4s ease-in-out 0.6s 2;
        }
        .dash-hero-sub {
          font-size: 14px;
          line-height: 1.55;
          color: var(--color-text-secondary);
          max-width: 60ch;
        }
        .dash-hero-sub strong {
          font-weight: 700;
          color: var(--color-text);
        }

        /* ── Stat pills (inline summary) ───────────────────────────── */
        .dash-stat-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }
        .dash-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text);
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          box-shadow: 0 1px 0 rgba(23,26,43,0.02);
        }
        .dash-stat-pill:hover {
          transform: translateY(-2px);
          border-color: var(--color-brand-300);
          box-shadow: 0 8px 22px rgba(var(--accent-rgb,46,71,224),0.10);
        }
        .dash-stat-pill-icon {
          display: inline-flex;
          width: 26px; height: 26px;
          align-items: center; justify-content: center;
          border-radius: 8px;
        }
        .dash-pill-brand .dash-stat-pill-icon { background: var(--color-brand-100); color: var(--color-brand-600); }
        .dash-pill-amber .dash-stat-pill-icon { background: #FFF4DB; color: #B45309; }
        .dash-pill-rose  .dash-stat-pill-icon { background: #FFE4E6; color: #BE123C; }
        html[data-theme="dark"] .dash-pill-amber .dash-stat-pill-icon {
          background: rgba(245,158,11,0.15); color: #F59E0B;
        }
        html[data-theme="dark"] .dash-pill-rose .dash-stat-pill-icon {
          background: rgba(244,63,94,0.15); color: #FB7185;
        }
        .dash-stat-pill-value {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--color-text);
          font-variant-numeric: tabular-nums;
        }
        .dash-stat-pill-label {
          font-size: 12px;
          color: var(--color-text-secondary);
        }

        /* ── Hero quick actions ────────────────────────────────────── */
        .dash-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }
        .dash-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 16px;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 140ms ease, box-shadow 160ms ease, background 140ms ease;
        }
        .dash-action:active { transform: translateY(1px); }
        .dash-action-primary {
          background: var(--color-brand-500);
          color: #fff;
          box-shadow: 0 4px 14px rgba(var(--accent-rgb,46,71,224),0.30);
        }
        .dash-action-primary:hover { box-shadow: 0 6px 20px rgba(var(--accent-rgb,46,71,224),0.38); }
        .dash-action-ghost {
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--color-border);
          color: var(--color-text);
        }
        .dash-action-ghost:hover {
          background: var(--color-surface);
          border-color: var(--color-brand-300);
          color: var(--color-brand-600);
        }
        html[data-theme="dark"] .dash-action-ghost {
          background: rgba(255,255,255,0.04);
        }

        /* ── Entrance choreography (CSS-only, GPU-cheap) ───────────── */
        .dash-rise > * {
          opacity: 0;
          transform: translateY(10px);
          animation: dash-rise-kf 480ms cubic-bezier(.2,.7,.2,1) forwards;
        }
        .dash-rise > *:nth-child(1) { animation-delay: 30ms; }
        .dash-rise > *:nth-child(2) { animation-delay: 110ms; }
        .dash-rise > *:nth-child(3) { animation-delay: 190ms; }
        .dash-rise > *:nth-child(4) { animation-delay: 270ms; }
        .dash-rise > *:nth-child(5) { animation-delay: 340ms; }

        @keyframes dash-rise-kf {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dash-wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          15%           { transform: rotate(14deg); }
          30%           { transform: rotate(-8deg); }
          45%           { transform: rotate(10deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-rise > * {
            opacity: 1;
            transform: none;
            animation: none;
          }
          .dash-hero-title .wave { animation: none; }
        }
      `}</style>

      <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:px-8 xl:py-8">
        <div className="dash-rise min-w-0 space-y-6">
          {/* ─── Hero ────────────────────────────────────────────── */}
          <header className="dash-hero">
            <div className="flex flex-wrap items-center gap-2">
              <span className="dash-date-pill">
                <CalendarIcon size={12} />
                {weekday}, {month} {day}
              </span>
              <span className="dash-status-pill" aria-label="System status">
                Pipeline healthy
              </span>
            </div>

            <h1 className="dash-hero-title">
              {greeting}, {userName}.{" "}
              <span className="wave" aria-hidden>👋</span>
            </h1>
            <p className="dash-hero-sub">
              You have <strong>{interviewsToday} interview{interviewsToday === 1 ? "" : "s"}</strong>{" "}
              and <strong>{openTasks} task{openTasks === 1 ? "" : "s"}</strong> on your plate today —
              let&apos;s place some talent.
            </p>

            <div className="dash-stat-pills">
              <StatPill
                value={interviewsToday}
                label="interviews today"
                href="/calendar"
                tone="brand"
                icon={<CalendarIcon size={14} />}
              />
              <StatPill
                value={openTasks}
                label="tasks pending"
                href="/tasks"
                tone="amber"
                icon={<TasksIcon size={14} />}
              />
              <StatPill
                value={highPriority}
                label="high priority"
                href="/candidates?priority=high"
                tone="rose"
                icon={<UsersIcon size={14} />}
              />
            </div>

            <div className="dash-actions">
              <HeroAction
                href="/candidates/new"
                icon={<PlusIcon size={14} />}
                label="Add candidate"
                variant="primary"
              />
              <HeroAction
                href="/assistant"
                icon={<MatchIcon size={14} />}
                label="Run AI match"
                variant="ghost"
              />
              <HeroAction
                href="/pipeline"
                icon={<BriefcaseIcon size={14} />}
                label="View pipeline"
                variant="ghost"
              />
            </div>
          </header>

          {/* ─── Pipeline overview ──────────────────────────────── */}
          <section aria-labelledby="dash-overview-label" className="space-y-3">
            <SectionLabel
              hint={
                <Link href="/reports" className="link-brand inline-flex items-center gap-1">
                  See full report <ChevronRight size={11} />
                </Link>
              }
            >
              <span id="dash-overview-label">Pipeline overview</span>
            </SectionLabel>
            <StatsGrid />
          </section>

          {/* ─── Top priority ───────────────────────────────────── */}
          <TopPriorityCandidates />

          {/* ─── Recent candidates ──────────────────────────────── */}
          <RecentCandidatesTable />
        </div>

        {/* ─── Right rail ───────────────────────────────────────── */}
        <aside className="dash-rise space-y-5 xl:sticky xl:top-[88px] xl:self-start">
          <div className="hidden xl:flex items-center gap-2 px-0.5">
            <SparklesIcon size={12} style={{ color: "var(--color-brand-500)" }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.10em] text-[color:var(--color-text-muted)]">
              Your day
            </span>
          </div>
          <AIAssistant userName={userName} />
          <TodaysSchedule />
          <TasksWidget />
        </aside>
      </div>
    </>
  );
}
