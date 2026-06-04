"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart } from "@/components/ui/DonutChart";
import {
  CalendarIcon,
  ChevronDown,
  ClockIcon,
  DocumentIcon,
  MoneyIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import {
  agencyPipeline,
  benchAlert,
  needsAttention,
  ownerKpis,
  revenue,
  teamPerformance,
  thisWeek,
  visaUtilization,
  type AttentionItem,
} from "@/lib/owner-dashboard-data";

/* ── Exact accent palette pulled from the design (green / red / amber).
   Neutrals, surfaces and brand-purple come from the app's CSS tokens so the
   layout stays theme-consistent. ─────────────────────────────────────────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const RED = "#DC2626";
const RED_BG = "#FEE2E2";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* ── Small inline icons not in the shared set ─────────────────────────────── */
function WarningTriangle({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2 22 20H2L12 3.2Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.6" fill={color} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}
function LineChartIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l4-4 3 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8h2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PersonIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.4" stroke={color} strokeWidth="1.7" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function ArrowLink({ children, href }: { children: React.ReactNode; href: string; }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/* ── Period selector (display-only) ───────────────────────────────────────── */
function PeriodSelect() {
  const options = ["This Month", "Last Month", "This Quarter"];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[0]);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
      >
        <CalendarIcon size={14} />
        {value}
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          className="absolute right-0 z-20 mt-1 w-[150px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
          onMouseLeave={() => setOpen(false)}
        >
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => { setValue(o); setOpen(false); }}
              className={`block w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                o === value ? "font-semibold text-[color:var(--color-brand-600)]" : "text-[color:var(--color-text-secondary)]"
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

/* ── KPI cards ────────────────────────────────────────────────────────────── */
function PositiveDelta({ value, note }: { value: string; note: string }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[12.5px]">
      <span className="inline-flex items-center gap-0.5 font-bold" style={{ color: GREEN }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M6 2.5 10 8.5H2L6 2.5Z" fill={GREEN} />
        </svg>
        {value}
      </span>
      <span className="text-[color:var(--color-text-muted)]">{note}</span>
    </p>
  );
}

function KpiCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${CARD} flex min-h-[152px] flex-col justify-between p-[22px]`}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <span className="text-[15px] font-semibold text-[color:var(--color-text-secondary)]">
          {label}
        </span>
      </div>
      <div className="mt-4">
        <p
          className="text-[32px] font-extrabold leading-none tracking-tight"
          style={{ color: valueColor ?? "var(--color-text)" }}
        >
          {value}
        </p>
        {children}
      </div>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Margin This Month"
        value={ownerKpis.marginThisMonth.value}
        iconBg={GREEN_SOLID}
        icon={<MoneyIcon size={24} className="text-white" />}
      >
        <PositiveDelta value={ownerKpis.marginThisMonth.delta} note={ownerKpis.marginThisMonth.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Active Placements"
        value={ownerKpis.activePlacements.value}
        iconBg={BRAND_SOFT}
        icon={<UsersIcon size={24} className="text-[color:var(--color-brand-600)]" />}
      >
        <PositiveDelta value={ownerKpis.activePlacements.delta} note={ownerKpis.activePlacements.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Utilization"
        value={ownerKpis.utilization.value}
        iconBg={BRAND_SOFT}
        icon={<LineChartIcon size={24} color="var(--color-brand-600)" />}
      >
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${ownerKpis.utilization.percent}%`, background: BRAND }}
          />
        </div>
        <PositiveDelta value={ownerKpis.utilization.delta} note={ownerKpis.utilization.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Bench Cost"
        value={ownerKpis.benchCost.value}
        valueColor={RED}
        iconBg={RED_BG}
        icon={<WarningTriangle size={24} color={RED} />}
      >
        <p className="mt-2.5 text-[13px] font-semibold" style={{ color: RED }}>
          {ownerKpis.benchCost.note}
        </p>
      </KpiCard>
    </div>
  );
}

/* ── Revenue & Profitability ──────────────────────────────────────────────── */
function RevenueLineChart() {
  const w = 380;
  const h = 156;
  const padL = 30;
  const padB = 22;
  const padT = 6;
  const padR = 6;
  const data = revenue.trend;
  const max = revenue.trendMax;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const stepX = innerW / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (v / max) * innerH;
    return [x, y] as const;
  });
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${(padT + innerH).toFixed(1)} L${padL},${(padT + innerH).toFixed(1)} Z`;
  const gridYs = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[156px] w-full" role="img" aria-label="Revenue trend for the month">
      <defs>
        <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map((g, i) => {
        const y = padT + innerH * g;
        return (
          <g key={g}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--color-border)" strokeWidth="1" />
            <text x={0} y={y + 3} fontSize="9" fill="var(--color-text-muted)">
              {revenue.yLabels[i]}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#revArea)" />
      <path d={linePath} fill="none" stroke="var(--color-brand-500)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.filter((_, i) => i % 3 === 0 || i === pts.length - 1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="var(--color-surface)" stroke="var(--color-brand-500)" strokeWidth="1.6" />
      ))}
      {revenue.xLabels.map((lbl, i) => {
        const x = padL + (innerW / (revenue.xLabels.length - 1)) * i;
        return (
          <text key={lbl} x={x} y={h - 6} fontSize="9" fill="var(--color-text-muted)" textAnchor={i === 0 ? "start" : i === revenue.xLabels.length - 1 ? "end" : "middle"}>
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

function RevenueCard() {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Revenue &amp; Profitability</h3>
        <PeriodSelect />
      </div>

      <div className="mt-5 grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.6fr)] lg:gap-0 lg:divide-x lg:divide-[color:var(--color-border)]">
        {/* Total revenue */}
        <div className="lg:pr-7">
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">Total Revenue This Month</p>
          <p className="mt-1.5 text-[30px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">{revenue.total}</p>
          <p className="mt-2.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Margin: {revenue.margin} · {revenue.marginRate}
          </p>
          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[13px] font-semibold"
            style={{ background: "#EAFBF1", color: GREEN }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 2.5 10 8.5H2L6 2.5Z" fill={GREEN} />
            </svg>
            {revenue.marginDelta} {revenue.marginDeltaNote}
          </span>
        </div>

        {/* Revenue mix */}
        <div className="lg:px-7">
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">Revenue Mix</p>
          <div className="mt-8 flex items-center justify-between text-[22px] font-bold leading-none text-[color:var(--color-text)]">
            <span>{revenue.mix.contract}%</span>
            <span>{revenue.mix.permanent}%</span>
          </div>
          <div className="mt-2.5 flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: BRAND_SOFT }}>
            <div style={{ width: `${revenue.mix.contract}%`, background: BRAND }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[13px] text-[color:var(--color-text-secondary)]">
            <span>Contract</span>
            <span>Permanent</span>
          </div>
        </div>

        {/* Forecast */}
        <div className="lg:px-7">
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">Forecast</p>
          <p className="mt-8 text-[22px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">{revenue.forecast.amount}</p>
          <p className="mt-2.5 text-[13px] leading-[21px] text-[color:var(--color-text-secondary)]">
            from {revenue.forecast.fromCount} consultants<br />
            in <span className="font-semibold text-[color:var(--color-brand-600)]">{revenue.forecast.stage}</span> stage
          </p>
        </div>

        {/* Chart */}
        <div className="min-w-0 lg:pl-7">
          <RevenueLineChart />
        </div>
      </div>
    </div>
  );
}

/* ── Bench Alert ──────────────────────────────────────────────────────────── */
function BenchAlertCard() {
  return (
    <div
      className="rounded-[18px] border p-5 shadow-[var(--shadow-card)]"
      style={{ borderColor: "#FECACA", background: "#FEF6F6" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px]" style={{ background: RED_BG }}>
            <WarningTriangle size={18} color={RED} />
          </span>
          <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Bench Alert</h3>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[11px] font-bold"
          style={{ borderColor: "#FBCFCF", background: "#FFFFFF", color: RED }}
        >
          High Priority
        </span>
      </div>

      <p className="mt-3 text-[15px] font-semibold text-[color:var(--color-text)]">
        <span className="text-[19px] font-extrabold" style={{ color: RED }}>{benchAlert.amount}</span>{" "}
        <span style={{ color: RED }}>bleeding</span>{" "}
        <span className="text-[color:var(--color-text-secondary)]">· {benchAlert.idle} consultants idle</span>
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr className="text-[11px] font-medium text-[color:var(--color-text-muted)]">
              <th className="pb-2 text-left font-medium">Consultant</th>
              <th className="pb-2 text-left font-medium">Skill</th>
              <th className="pb-2 text-left font-medium">Visa</th>
              <th className="pb-2 text-left font-medium">Days</th>
              <th className="pb-2 text-right font-medium">Cost Accrued</th>
            </tr>
          </thead>
          <tbody>
            {benchAlert.consultants.map((c) => (
              <tr key={c.name} className="border-t border-[#F3D6D6]">
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.name} size={26} image={c.image} />
                    <span className="text-[13px] font-semibold text-[color:var(--color-text)]">{c.name}</span>
                  </div>
                </td>
                <td className="py-2.5">
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)]"
                    style={{ borderColor: "#EFDDDD", background: "#FFFFFF" }}
                  >
                    {c.skill}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="inline-flex items-center rounded-full px-2 py-[3px] text-[11px] font-bold" style={{ background: RED_BG, color: RED }}>
                    {c.visa}
                  </span>
                </td>
                <td className="py-2.5 text-[12.5px] text-[color:var(--color-text-secondary)]">{c.days}</td>
                <td className="py-2.5 text-right text-[13px] font-bold" style={{ color: RED }}>{c.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3">
        <Link href="/bench" className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: RED }}>
          View all bench
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ── Agency Pipeline ──────────────────────────────────────────────────────── */
/* Progressive funnel shades — lightest (Submitted) → darkest (Placed). */
const PIPE_SHADES = [
  "var(--color-brand-50)",
  "var(--color-brand-100)",
  "var(--color-brand-200)",
  "var(--color-brand-300)",
];

function PipelineCard() {
  const last = agencyPipeline.length - 1;
  return (
    <div className={`${CARD} flex flex-col p-5`}>
      <style>{`
        .pipe-funnel { display:flex; flex-direction:column; gap:10px; }
        .pipe-seg {
          flex:1; min-width:0;
          background: var(--seg-bg);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .pipe-arrow { display:none; }
        @media (min-width: 768px) {
          .pipe-funnel { flex-direction:row; align-items:stretch; gap:0; }
          .pipe-seg {
            border-radius:0;
            padding:18px 14px 18px 28px;
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%);
          }
          .pipe-seg.is-first {
            padding-left:20px;
            border-top-left-radius:14px; border-bottom-left-radius:14px;
            clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%);
          }
          .pipe-arrow {
            display:flex; align-items:center; justify-content:center;
            flex:0 0 auto; width:18px;
            color: var(--color-brand-400);
          }
        }
      `}</style>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">
          Agency Pipeline <span className="text-[13px] font-medium text-[color:var(--color-text-muted)]">(All Recruiters)</span>
        </h3>
        <ArrowLink href="/pipeline">View full pipeline</ArrowLink>
      </div>

      <div className="flex flex-1 items-center">
        <div className="pipe-funnel mt-4 w-full md:mt-0">
          {agencyPipeline.map((s, i) => (
            <Fragment key={s.label}>
              <div
                className={`pipe-seg${i === 0 ? " is-first" : ""}`}
                style={{ "--seg-bg": PIPE_SHADES[i] ?? PIPE_SHADES[PIPE_SHADES.length - 1] } as React.CSSProperties}
              >
                <p className="text-[12.5px] font-semibold text-[color:var(--color-text-secondary)]">{s.label}</p>
                <p className="mt-1 text-[24px] font-extrabold leading-none text-[color:var(--color-brand-700)]">{s.value}</p>
                {s.conversion ? (
                  <p className="mt-1.5 text-[11px] font-medium text-[color:var(--color-brand-600)]">{s.conversion}</p>
                ) : (
                  <p className="mt-1.5 text-[11px]">&nbsp;</p>
                )}
              </div>
              {i < last ? (
                <span className="pipe-arrow" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Team Performance ─────────────────────────────────────────────────────── */
function TeamCard() {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Team Performance</h3>
        <ArrowLink href="/reports">View full report</ArrowLink>
      </div>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr className="text-[12px] font-medium text-[color:var(--color-text-muted)]">
            <th className="pb-2.5 text-left font-medium">Recruiter</th>
            <th className="pb-2.5 text-right font-medium">Placements</th>
            <th className="pb-2.5 text-right font-medium">Margin</th>
          </tr>
        </thead>
        <tbody>
          {teamPerformance.map((m) => (
            <tr key={m.name} className="border-t border-[color:var(--color-border)]">
              <td className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <Avatar name={m.name} size={26} color={m.avatarColor} />
                  <span className="text-[13px] font-semibold text-[color:var(--color-text)]">{m.name}</span>
                </div>
              </td>
              <td className="py-2.5 text-right text-[13px] font-semibold text-[color:var(--color-text)]">{m.placements}</td>
              <td className="py-2.5 text-right text-[13px] font-bold" style={{ color: GREEN }}>{m.margin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── This Week ────────────────────────────────────────────────────────────── */
function ThisWeekCard() {
  const iconFor = (kind: string) => {
    if (kind === "calendar") return <CalendarIcon size={18} className="text-[color:var(--color-brand-600)]" />;
    if (kind === "offer") return <PersonIcon size={18} color={AMBER} />;
    return <DocumentIcon size={18} style={{ color: GREEN }} />;
  };
  const bgFor = (kind: string) => (kind === "calendar" ? BRAND_SOFT : kind === "offer" ? AMBER_BG : "#EAFBF1");
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">This Week</h3>
        <ArrowLink href="/calendar">View all</ArrowLink>
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-[color:var(--color-border)]">
        {thisWeek.map((t) => (
          <div key={t.label} className="flex flex-col items-center px-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: bgFor(t.icon) }}>
              {iconFor(t.icon)}
            </span>
            <p className="mt-2.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{t.value}</p>
            <p className="mt-1.5 text-[11.5px] leading-[15px] text-[color:var(--color-text-secondary)]">{t.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Visa & Utilization ───────────────────────────────────────────────────── */
function VisaCard() {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Visa &amp; Utilization</h3>
        <ArrowLink href="/reports">View breakdown</ArrowLink>
      </div>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative shrink-0">
          <DonutChart
            size={104}
            stroke={16}
            rounded
            ariaLabel={`${visaUtilization.utilization}% utilization`}
            segments={[
              { name: "Billing", value: visaUtilization.utilization, color: "var(--color-brand-500)", gradient: ["#8B73FF", "#5B3DF5"] },
              { name: "Available", value: 100 - visaUtilization.utilization, color: "var(--color-brand-100)" },
            ]}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[18px] font-extrabold text-[color:var(--color-text)]">{visaUtilization.utilization}%</span>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">Utilization</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] text-[color:var(--color-text-secondary)]">
            <span className="text-[19px] font-extrabold text-[color:var(--color-text)]">{visaUtilization.available}</span>{" "}
            <span className="font-medium">consultants available</span>
          </p>
          <p className="mt-1 text-[12px] text-[color:var(--color-text-secondary)]">
            {visaUtilization.breakdown.map((b, i) => (
              <span key={b.label}>
                {i > 0 ? " · " : ""}
                <span className="font-semibold text-[color:var(--color-text)]">{b.count}</span> {b.label}
              </span>
            ))}
          </p>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-[color:var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
              {visaUtilization.billing} Billing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND_SOFT }} />
              {visaUtilization.benched} Benched
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Needs Attention ──────────────────────────────────────────────────────── */
function AttentionTile({ item }: { item: AttentionItem }) {
  const tone =
    item.tone === "amber"
      ? { bg: AMBER_BG, fg: AMBER }
      : item.tone === "red"
        ? { bg: RED_BG, fg: RED }
        : item.tone === "purple"
          ? { bg: "var(--color-brand-100)", fg: "var(--color-brand-600)" }
          : { bg: "var(--color-surface-2)", fg: "var(--color-text-secondary)" };
  const icon =
    item.icon === "visa" ? <WarningTriangle size={18} color={tone.fg} />
    : item.icon === "contract" ? <CalendarIcon size={18} style={{ color: tone.fg }} />
    : item.icon === "followup" ? <ClockIcon size={18} style={{ color: tone.fg }} />
    : <UsersIcon size={18} style={{ color: tone.fg }} />;
  const ctaColor = item.tone === "red" ? RED : item.tone === "amber" ? AMBER : "var(--color-brand-600)";
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: tone.bg }}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold leading-[18px] text-[color:var(--color-text)]">{item.title}</p>
        {item.subtitle ? (
          <p className="text-[12px] text-[color:var(--color-text-secondary)]">{item.subtitle}</p>
        ) : null}
        <Link href="#" className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: ctaColor }}>
          {item.cta}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function NeedsAttentionCard() {
  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Needs Attention</h3>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {needsAttention.map((item) => (
          <AttentionTile key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function OwnerDashboard() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-7">
      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)]">Dashboard</h1>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">Your agency at a glance</p>
        </div>
        <PeriodSelect />
      </div>

      <KpiRow />
      <RevenueCard />

      <div className="grid gap-5 lg:grid-cols-[5fr_7fr]">
        <BenchAlertCard />
        <PipelineCard />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <TeamCard />
        <ThisWeekCard />
        <VisaCard />
      </div>

      <NeedsAttentionCard />
    </div>
  );
}
