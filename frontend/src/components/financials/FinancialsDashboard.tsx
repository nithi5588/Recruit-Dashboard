"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { DonutChart } from "@/components/ui/DonutChart";
import {
  CalendarIcon,
  ChevronDown,
  DocumentIcon,
  InfoIcon,
  MoneyIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import {
  contractVsPermanent,
  directVsVendor,
  financialsKpis,
  forecast,
  marginPerPlacement,
  outstandingInvoices,
  revenueMarginTrend,
  revenuePerRecruiter,
  topClientsByRevenue,
  totalOwed,
} from "@/lib/financials-data";

/* ── Exact accent palette pulled from the design (green / red / amber).
   Neutrals, surfaces and brand-purple come from the app's CSS tokens so the
   layout stays theme-consistent with the rest of the product. ────────────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const RED = "#DC2626";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const RED_BG = "#FEE2E2";
const BRAND = "var(--color-brand-500)";
const BRAND_SOFT = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* ── Small inline icons not in the shared set ─────────────────────────────── */
function LineChartIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16l4-4 3 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 8h2v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PieIcon({ size = 18, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3.4A9 9 0 0 1 20.6 10H14V3.4Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}
function SortGlyph() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path d="M6 2.5 8.4 5H3.6L6 2.5Z" fill="var(--color-text-muted)" />
      <path d="M6 9.5 3.6 7h4.8L6 9.5Z" fill="var(--color-text-muted)" />
    </svg>
  );
}
function UpTriangle({ color, size = 11 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M6 2.5 10 8.5H2L6 2.5Z" fill={color} />
    </svg>
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
function KpiCard({
  icon,
  iconBg,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`${CARD} flex min-h-[150px] flex-col p-[22px]`}>
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
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
      {children}
    </div>
  );
}

function PositiveDelta({ value, note }: { value: string; note: string }) {
  return (
    <p className="mt-auto flex items-center gap-1.5 pt-4 text-[12.5px]">
      <span className="inline-flex items-center gap-1 font-bold" style={{ color: GREEN }}>
        <UpTriangle color={GREEN} />
        {value}
      </span>
      <span className="text-[color:var(--color-text-muted)]">{note}</span>
    </p>
  );
}

function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total Revenue"
        value={financialsKpis.totalRevenue.value}
        iconBg="var(--color-surface-2)"
        icon={<MoneyIcon size={24} className="text-[color:var(--color-text-secondary)]" />}
      >
        <PositiveDelta value={financialsKpis.totalRevenue.delta} note={financialsKpis.totalRevenue.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Total Margin"
        value={financialsKpis.totalMargin.value}
        iconBg="#EAFBF1"
        icon={<LineChartIcon size={24} color={GREEN} />}
      >
        <PositiveDelta value={financialsKpis.totalMargin.delta} note={financialsKpis.totalMargin.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Margin Rate"
        value={financialsKpis.marginRate.value}
        iconBg={BRAND_SOFT}
        icon={<PieIcon size={24} color="var(--color-brand-600)" />}
      >
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
          <div
            className="h-full rounded-full"
            style={{ width: `${financialsKpis.marginRate.percent}%`, background: BRAND }}
          />
        </div>
        <PositiveDelta value={financialsKpis.marginRate.delta} note={financialsKpis.marginRate.deltaNote} />
      </KpiCard>

      <KpiCard
        label="Avg Margin / Placement"
        value={financialsKpis.avgMarginPerPlacement.value}
        iconBg="var(--color-surface-2)"
        icon={<UsersIcon size={24} className="text-[color:var(--color-text-secondary)]" />}
      />
    </div>
  );
}

/* ── Revenue & Margin Trend (dual line) ───────────────────────────────────── */
function RevenueMarginChart() {
  const w = 440;
  const h = 220;
  const padL = 40;
  const padB = 24;
  const padT = 8;
  const padR = 10;
  const { revenue, margin, max, xLabels, yLabels } = revenueMarginTrend;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;
  const stepX = innerW / (revenue.length - 1);
  const toPts = (data: number[]) =>
    data.map((v, i) => [padL + i * stepX, padT + innerH - (v / max) * innerH] as const);
  const revPts = toPts(revenue);
  const marPts = toPts(margin);
  const linePath = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const revLine = linePath(revPts);
  const revArea = `${revLine} L${revPts[revPts.length - 1][0].toFixed(1)},${(padT + innerH).toFixed(1)} L${padL},${(padT + innerH).toFixed(1)} Z`;
  const gridYs = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="block h-auto w-full" role="img" aria-label="Revenue and margin trend for the month">
      <defs>
        <linearGradient id="finRevArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map((g, i) => {
        const y = padT + innerH * g;
        return (
          <g key={g}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--color-border)" strokeWidth="1" />
            <text x={0} y={y + 3} fontSize="10" fill="var(--color-text-muted)">
              {yLabels[i]}
            </text>
          </g>
        );
      })}
      <path d={revArea} fill="url(#finRevArea)" />
      <path d={revLine} fill="none" stroke="var(--color-brand-500)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(marPts)} fill="none" stroke={GREEN_SOLID} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      {revPts.map(([x, y], i) => (
        <circle key={`r${i}`} cx={x} cy={y} r="3" fill="var(--color-surface)" stroke="var(--color-brand-500)" strokeWidth="1.8" />
      ))}
      {marPts.map(([x, y], i) => (
        <circle key={`m${i}`} cx={x} cy={y} r="3" fill="var(--color-surface)" stroke={GREEN_SOLID} strokeWidth="1.8" />
      ))}
      {xLabels.map((lbl, i) => {
        const x = padL + (innerW / (xLabels.length - 1)) * i;
        return (
          <text key={lbl} x={x} y={h - 6} fontSize="10" fill="var(--color-text-muted)" textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}>
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

function RevenueMarginCard() {
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Revenue &amp; Margin Trend</h3>
        <div className="flex items-center gap-4 text-[12.5px] text-[color:var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
            Revenue
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: GREEN_SOLID }} />
            Margin
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-1 items-center">
        <RevenueMarginChart />
      </div>
    </div>
  );
}

/* ── Margin per Placement (table) ─────────────────────────────────────────── */
function MarginPerPlacementCard() {
  const headers = [
    "Consultant",
    "Client",
    "Recruiter",
    "Bill Rate",
    "Pay Rate",
    "Margin/hr",
    "Hours/mo",
    "Monthly Margin",
    "Type",
  ];
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Margin per Placement</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {headers.map((hLabel, i) => (
                <th key={hLabel} className={`pb-2.5 ${i === 0 ? "text-left" : "text-left"}`}>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[color:var(--color-text-muted)]">
                    {hLabel}
                    <SortGlyph />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marginPerPlacement.map((r) => (
              <tr key={r.consultant} className="border-t border-[color:var(--color-border)]">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.consultant} size={26} />
                    <span className="whitespace-nowrap text-[13px] font-semibold text-[color:var(--color-text)]">{r.consultant}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">{r.client}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text-secondary)]">{r.recruiter}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text)]">{r.billRate}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text)]">{r.payRate}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap text-[13px] font-semibold" style={{ color: r.marginHr === "—" ? "var(--color-text-muted)" : GREEN }}>{r.marginHr}</td>
                <td className="py-2.5 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">{r.hours}</td>
                <td className="py-2.5 pr-3 whitespace-nowrap text-[13px] font-bold" style={{ color: GREEN }}>{r.monthlyMargin}</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]" style={{ background: BRAND_SOFT }}>
                    {r.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Contract vs Permanent (donut) ────────────────────────────────────────── */
function ContractVsPermanentCard() {
  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Contract vs Permanent</h3>
      <div className="mt-4 flex items-center gap-6">
        <div className="shrink-0">
          <DonutChart
            size={120}
            stroke={20}
            rounded
            ariaLabel={`${contractVsPermanent.contract}% contract, ${contractVsPermanent.permanent}% permanent`}
            segments={[
              { name: "Contract", value: contractVsPermanent.contract, color: "var(--color-brand-500)", gradient: ["#8B73FF", "#5B3DF5"] },
              { name: "Permanent", value: contractVsPermanent.permanent, color: "var(--color-brand-100)" },
            ]}
          />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
              <span className="text-[22px] font-bold leading-none text-[color:var(--color-text)]">{contractVsPermanent.contract}%</span>
            </div>
            <p className="mt-1.5 pl-[18px] text-[13px] text-[color:var(--color-text-secondary)]">Contract</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND_SOFT }} />
              <span className="text-[22px] font-bold leading-none text-[color:var(--color-text)]">{contractVsPermanent.permanent}%</span>
            </div>
            <p className="mt-1.5 pl-[18px] text-[13px] text-[color:var(--color-text-secondary)]">Permanent</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Direct vs Through-Vendor ─────────────────────────────────────────────── */
function DirectVsVendorCard() {
  return (
    <div className={`${CARD} flex flex-col p-5`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Direct vs Through-Vendor</h3>
      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full" style={{ background: BRAND_SOFT }}>
        <div style={{ width: `${directVsVendor.direct}%`, background: BRAND }} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold leading-none text-[color:var(--color-text)]">{directVsVendor.direct}%</span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
            Direct
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[22px] font-bold leading-none text-[color:var(--color-text)]">{directVsVendor.vendor}%</span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND_SOFT }} />
            Vendor
          </span>
        </div>
      </div>
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-[12.5px] text-[color:var(--color-text-muted)]">
        <InfoIcon size={14} />
        {directVsVendor.note}
      </p>
    </div>
  );
}

/* ── Top Clients by Revenue ───────────────────────────────────────────────── */
function TopClientsCard() {
  const maxAmount = Math.max(...topClientsByRevenue.map((c) => c.amount));
  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Top Clients by Revenue</h3>
      <div className="mt-5 space-y-3.5">
        {topClientsByRevenue.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="w-[68px] shrink-0 text-[13px] font-medium text-[color:var(--color-text)]">{c.name}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
              <div className="h-full rounded-full" style={{ width: `${(c.amount / maxAmount) * 100}%`, background: BRAND }} />
            </div>
            <span className="w-[42px] shrink-0 text-right text-[13px] font-semibold text-[color:var(--color-text)]">{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Revenue per Recruiter ────────────────────────────────────────────────── */
function RevenuePerRecruiterCard() {
  const maxAmount = Math.max(...revenuePerRecruiter.map((r) => r.amount));
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Revenue per Recruiter</h3>
      <div className="mt-5 space-y-4">
        {revenuePerRecruiter.map((r, i) => (
          <div key={r.name} className="flex items-center gap-3">
            <span className="w-4 shrink-0 text-[13px] font-medium text-[color:var(--color-text-muted)]">{i + 1}</span>
            <span className="w-[92px] shrink-0 text-[13px] font-medium text-[color:var(--color-text)]">{r.name}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
              <div className="h-full rounded-full" style={{ width: `${(r.amount / maxAmount) * 100}%`, background: BRAND }} />
            </div>
            <span className="w-[58px] shrink-0 text-right text-[13px] font-semibold text-[color:var(--color-text)]">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Forecast ─────────────────────────────────────────────────────────────── */
function ForecastCard() {
  const total = forecast.actual.amount + forecast.next.amount;
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Forecast</h3>
      <p className="mt-3 text-[15px] text-[color:var(--color-text)]">
        <span className="text-[20px] font-extrabold tracking-tight">{forecast.expected}</span>{" "}
        <span className="text-[color:var(--color-text-secondary)]">
          expected from {forecast.fromCount} consultants in{" "}
          <span className="font-semibold text-[color:var(--color-brand-600)]">{forecast.stage}</span> stage
        </span>
      </p>
      <div className="mt-4 flex h-7 w-full overflow-hidden rounded-[8px]">
        <div
          className="flex items-center justify-center text-[12px] font-bold text-white"
          style={{ width: `${(forecast.actual.amount / total) * 100}%`, background: BRAND }}
        >
          {forecast.actual.label}
        </div>
        <div
          className="flex items-center justify-center text-[12px] font-bold text-[color:var(--color-brand-700)]"
          style={{ width: `${(forecast.next.amount / total) * 100}%`, background: BRAND_SOFT }}
        >
          {forecast.next.label}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[12.5px] text-[color:var(--color-text-secondary)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND }} />
            Actual (This Month)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BRAND_SOFT }} />
            Forecast (Next Month)
          </span>
        </div>
        <span className="text-[12.5px] font-semibold text-[color:var(--color-text-secondary)]">{forecast.total}</span>
      </div>
    </div>
  );
}

/* ── Outstanding Invoices ─────────────────────────────────────────────────── */
function StatusChip({ status }: { status: "Pending" | "Overdue" }) {
  const isOverdue = status === "Overdue";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{
        background: isOverdue ? RED_BG : AMBER_BG,
        color: isOverdue ? RED : AMBER,
      }}
    >
      {status}
    </span>
  );
}

function OutstandingInvoicesCard() {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Outstanding Invoices</h3>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-0 lg:divide-x lg:divide-[color:var(--color-border)]">
        {/* Invoices table */}
        <div className="min-w-0 overflow-x-auto lg:pr-7">
          <table className="w-full min-w-[480px] border-collapse">
            <thead>
              <tr className="text-[12px] font-medium text-[color:var(--color-text-muted)]">
                <th className="pb-2.5 text-left font-medium">Client</th>
                <th className="pb-2.5 text-left font-medium">Amount</th>
                <th className="pb-2.5 text-left font-medium">Due Date</th>
                <th className="pb-2.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {outstandingInvoices.map((inv) => (
                <tr key={inv.client} className="border-t border-[color:var(--color-border)]">
                  <td className="py-3 text-[13px] font-semibold text-[color:var(--color-text)]">{inv.client}</td>
                  <td className="py-3 text-[13px] text-[color:var(--color-text)]">{inv.amount}</td>
                  <td className="py-3 text-[13px] text-[color:var(--color-text-secondary)]">{inv.dueDate}</td>
                  <td className="py-3"><StatusChip status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total owed */}
        <div className="flex items-center justify-between gap-4 lg:pl-7">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-text-secondary)]">
              Total Owed
              <InfoIcon size={13} className="text-[color:var(--color-text-muted)]" />
            </p>
            <p className="mt-1.5 text-[30px] font-extrabold leading-none tracking-tight text-[color:var(--color-text)]">{totalOwed.value}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-text-secondary)]">
              <DocumentIcon size={14} className="text-[color:var(--color-text-muted)]" />
              {totalOwed.invoices} invoices
            </p>
          </div>
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] transition-colors hover:opacity-90"
            style={{ background: BRAND_SOFT }}
            aria-label="View invoices"
          >
            <DocumentIcon size={22} className="text-[color:var(--color-brand-600)]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function FinancialsDashboard() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-7">
      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)]">Financials</h1>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">Revenue, margin and cash flow.</p>
        </div>
        <PeriodSelect />
      </div>

      <KpiRow />

      <div className="grid gap-5 lg:grid-cols-[5fr_7fr]">
        <RevenueMarginCard />
        <MarginPerPlacementCard />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ContractVsPermanentCard />
        <DirectVsVendorCard />
        <TopClientsCard />
      </div>

      <div className="grid gap-5 lg:grid-cols-[5fr_7fr]">
        <RevenuePerRecruiterCard />
        <ForecastCard />
      </div>

      <OutstandingInvoicesCard />
    </div>
  );
}
