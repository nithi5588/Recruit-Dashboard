"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  CheckIcon,
  ChevronDown,
  ClockIcon,
  DownloadIcon,
  MoreIcon,
  PaperPlaneIcon,
  PlusIcon,
} from "@/components/icons/AppIcons";
import {
  benchAging,
  benchAgingMax,
  benchAgingTicks,
  benchByVisa,
  benchConsultants,
  benchDangerLineAt,
  benchKpis,
  hotlist,
  type Visa,
} from "@/lib/bench-data";

/* ── Exact accent palette pulled from the design (red / amber / green / visa
   tints). Neutrals, surfaces and brand-purple come from the app's CSS tokens
   so the layout stays theme-consistent with the rest of the product. ──────── */
const RED = "#DC2626";
const RED_BG = "#FEE2E2";
const RED_SOFT = "#FEF2F2";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const GREEN = "#16A34A";
const GREEN_BG = "#EAFBF1";
const BRAND = "var(--color-brand-500)";

// Bench-aging bar palette — coral-red fading to gold as idle time drops.
const AGING_RED = "#F0503C";
const AGING_SALMON = "#F46A52";
const AGING_ORANGE = "#F59E0B";
const AGING_GOLD = "#FBBF24";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

// Visa chip tints — soft pills that stay scannable.
const VISA_STYLE: Record<Visa, { bg: string; fg: string }> = {
  H1B: { bg: AMBER_BG, fg: "#B45309" },
  GC: { bg: "#EEF2FF", fg: "#4F46E5" },
  OPT: { bg: "#F3E8FF", fg: "#7C3AED" },
};

/* ── Small inline icons not in the shared set ─────────────────────────────── */
function WarningTriangleIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5 21 19.5H3L12 4.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1" fill={color} />
    </svg>
  );
}
function IdleUserIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
      <path
        d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function DollarSignIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M15.5 7.5c0-1.7-1.6-2.8-3.6-2.8S8.3 5.8 8.3 7.5 9.9 10 12 10.3s3.7 1 3.7 2.8-1.6 2.9-3.7 2.9-3.7-1.2-3.7-2.9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SortArrowDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path
        d="M6 2.5v7M3.5 7 6 9.5 8.5 7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Color helpers ────────────────────────────────────────────────────────── */
// Days on bench: 18+ reads red (urgent), 15–17 amber, below that neutral.
function daysColor(days: number) {
  if (days >= 18) return RED;
  if (days >= 15) return AMBER;
  return "var(--color-text)";
}
function agingBarColor(days: number) {
  if (days >= 19) return AGING_RED;
  if (days >= 16) return AGING_SALMON;
  if (days >= 12) return AGING_ORANGE;
  return AGING_GOLD;
}

/* ── Filter select (display-only) ─────────────────────────────────────────── */
function FilterSelect({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[0]);
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap text-[12.5px] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 text-[12.5px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          {value}
          <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div
            className="absolute right-0 z-20 mt-1 w-[130px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
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
  valueColor,
  note,
  noteColor,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor: string;
  note: string;
  noteColor: string;
}) {
  return (
    <div className={`${CARD} flex items-center gap-4 p-[22px]`}>
      <span
        className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-[color:var(--color-text-secondary)]">{label}</p>
        <p
          className="mt-1 text-[30px] font-extrabold leading-none tracking-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>
        <p className="mt-2 text-[12.5px] font-medium" style={{ color: noteColor }}>
          {note}
        </p>
      </div>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total Bench Cost"
        value={benchKpis.totalBenchCost.value}
        valueColor={RED}
        note={benchKpis.totalBenchCost.note}
        noteColor={RED}
        iconBg={RED_BG}
        icon={<WarningTriangleIcon color={RED} />}
      />
      <KpiCard
        label="Consultants Idle"
        value={benchKpis.consultantsIdle.value}
        valueColor="var(--color-text)"
        note={benchKpis.consultantsIdle.note}
        noteColor={AMBER}
        iconBg={AMBER_BG}
        icon={<IdleUserIcon color={AMBER} />}
      />
      <KpiCard
        label="Avg Days on Bench"
        value={benchKpis.avgDaysOnBench.value}
        valueColor="var(--color-text)"
        note={benchKpis.avgDaysOnBench.note}
        noteColor="var(--color-text-secondary)"
        iconBg={AMBER_BG}
        icon={<ClockIcon size={24} style={{ color: AMBER }} />}
      />
      <KpiCard
        label="Projected Monthly Cost"
        value={benchKpis.projectedMonthlyCost.value}
        valueColor={RED}
        note={benchKpis.projectedMonthlyCost.note}
        noteColor={RED}
        iconBg={RED_BG}
        icon={<DollarSignIcon color={RED} />}
      />
    </div>
  );
}

/* ── Benched Consultants table ────────────────────────────────────────────── */
function VisaChip({ visa }: { visa: Visa }) {
  const s = VISA_STYLE[visa];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {visa}
    </span>
  );
}

function MarketingStatus({
  label,
  status,
}: {
  label: string;
  status: "marketed" | "not-marketed";
}) {
  const marketed = status === "marketed";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{
        background: marketed ? GREEN_BG : AMBER_BG,
        color: marketed ? GREEN : AMBER,
      }}
    >
      {label}
    </span>
  );
}

function BenchedConsultantsCard() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const allChecked = benchConsultants.every((c) => selected[c.name]);
  const toggleAll = () =>
    setSelected(allChecked ? {} : Object.fromEntries(benchConsultants.map((c) => [c.name, true])));

  const headers = [
    "Consultant",
    "Skill / Tech",
    "Visa",
    "Employment",
    "Days on Bench",
    "Cost Accrued",
    "Pay Rate",
    "Owner",
    "Marketing Status",
    "Actions",
  ];

  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Benched Consultants</h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <FilterSelect label="Filter by Visa" options={["All", "H1B", "GC", "OPT"]} />
          <FilterSelect
            label="Filter by Skill"
            options={["All", "Java", "DevOps", "React", "Data", "QA"]}
          />
          <FilterSelect
            label="Filter by Recruiter"
            options={["All", "Sarah Khan", "Alex Morgan", "Jason Brown", "Lisa Patel"]}
          />
          <FilterSelect label="Filter by Days" options={["All", "21+", "15+", "7+"]} />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse">
          <thead>
            <tr>
              <th className="pb-3 pl-1 pr-3 text-left align-middle">
                <input
                  type="checkbox"
                  className="app-checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label="Select all consultants"
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
                    {h === "Days on Bench" ? <SortArrowDown /> : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benchConsultants.map((c) => (
              <tr key={c.name} className="border-t border-[color:var(--color-border)]">
                <td className="py-3.5 pl-1 pr-3 align-middle">
                  <input
                    type="checkbox"
                    className="app-checkbox"
                    checked={Boolean(selected[c.name])}
                    onChange={() =>
                      setSelected((s) => ({ ...s, [c.name]: !s[c.name] }))
                    }
                    aria-label={`Select ${c.name}`}
                  />
                </td>
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} image={c.image} size={30} />
                    <span className="whitespace-nowrap text-[13.5px] font-semibold text-[color:var(--color-text)]">
                      {c.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text-secondary)]">
                  {c.skill}
                </td>
                <td className="py-3.5 pr-3">
                  <VisaChip visa={c.visa} />
                </td>
                <td className="py-3.5 pr-3 text-[13px] text-[color:var(--color-text-secondary)]">
                  {c.employment}
                </td>
                <td
                  className="py-3.5 pr-3 whitespace-nowrap text-[13px] font-semibold"
                  style={{ color: daysColor(c.daysOnBench) }}
                >
                  {c.daysOnBench} days
                </td>
                <td className="py-3.5 pr-3">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[12.5px] font-bold"
                    style={{ background: RED_BG, color: RED }}
                  >
                    {c.costAccrued}
                  </span>
                </td>
                <td className="py-3.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text)]">
                  {c.payRate}
                </td>
                <td className="py-3.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text-secondary)]">
                  {c.owner}
                </td>
                <td className="py-3.5 pr-3">
                  <MarketingStatus label={c.marketing.label} status={c.marketing.status} />
                </td>
                <td className="py-3.5 pr-1">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      className="inline-flex h-8 items-center rounded-[9px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12.5px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-surface-2)]"
                    >
                      Market Out
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
                      aria-label={`More actions for ${c.name}`}
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
    </div>
  );
}

/* ── Bench Aging (horizontal bars) ────────────────────────────────────────── */
// The plot region starts after a fixed name column; bars and their day labels
// flow from there, and every horizontal measure (bars, danger line, ticks) is
// expressed against the same 0–max scale so they line up.
const AGING_NAME_W = 124; // px — name column width
function BenchAgingCard() {
  const dangerLeft = `calc(${AGING_NAME_W}px + (100% - ${AGING_NAME_W}px) * ${
    benchDangerLineAt / benchAgingMax
  })`;
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">
          Bench Aging{" "}
          <span className="text-[13px] font-medium text-[color:var(--color-text-muted)]">
            — longest idle first
          </span>
        </h3>
        <span className="text-[12.5px] font-semibold" style={{ color: AGING_RED }}>
          Danger zone: 21+ days
        </span>
      </div>

      <div className="relative mt-7 flex-1">
        {/* Danger-zone dashed line — spans the bars, stops above the axis row */}
        <div
          className="pointer-events-none absolute bottom-[34px] top-0 border-l border-dashed"
          style={{ left: dangerLeft, borderColor: AGING_RED }}
          aria-hidden
        />

        <div className="space-y-[18px]">
          {benchAging.map((c) => (
            <div key={c.name} className="flex items-center">
              <span
                className="shrink-0 whitespace-nowrap pr-3 text-[12.5px] font-medium text-[color:var(--color-text)]"
                style={{ width: AGING_NAME_W }}
              >
                {c.name}
              </span>
              <div className="flex flex-1 items-center">
                <div
                  className="h-[7px] rounded-full"
                  style={{
                    width: `${(c.days / benchAgingMax) * 100}%`,
                    background: agingBarColor(c.days),
                  }}
                />
                <span className="ml-2.5 whitespace-nowrap text-[12.5px] font-medium text-[color:var(--color-text-secondary)]">
                  {c.days} days
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* X axis ticks */}
        <div className="mt-3 flex items-center">
          <span className="shrink-0" style={{ width: AGING_NAME_W }} />
          <div className="flex flex-1 justify-between text-[11px] text-[color:var(--color-text-muted)]">
            {benchAgingTicks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="mt-2 flex">
          <span className="shrink-0" style={{ width: AGING_NAME_W }} />
          <p className="flex-1 text-center text-[12px] text-[color:var(--color-text-muted)]">
            Days on Bench
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Bench by Visa Type ───────────────────────────────────────────────────── */
function BenchByVisaCard() {
  // Scale so the longest bar leaves a little room for its trailing count.
  const scale = Math.max(...benchByVisa.map((v) => v.count)) / 0.9;
  const barColor = (visa: Visa) => (visa === "H1B" ? AGING_RED : BRAND);
  return (
    <div className={`${CARD} flex flex-col p-5 sm:p-6`}>
      <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Bench by Visa Type</h3>

      <div className="mt-7 space-y-6">
        {benchByVisa.map((v) => (
          <div key={v.visa} className="flex items-center">
            <span className="w-12 shrink-0 text-[13px] font-semibold text-[color:var(--color-text)]">
              {v.visa}
            </span>
            <div className="flex flex-1 items-center">
              <div
                className="h-3 rounded-full"
                style={{ width: `${(v.count / scale) * 100}%`, background: barColor(v.visa) }}
              />
              <span className="ml-3 text-[13px] font-semibold text-[color:var(--color-text)]">
                {v.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-auto flex items-center gap-2.5 rounded-[12px] px-4 py-3"
        style={{ background: RED_SOFT }}
      >
        <WarningTriangleIcon size={18} color={RED} />
        <p className="text-[12.5px] font-medium" style={{ color: RED }}>
          H1B consultants are sponsored — re-place urgently.
        </p>
      </div>
    </div>
  );
}

/* ── Active Hotlist ───────────────────────────────────────────────────────── */
function ActiveHotlistCard() {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[17px] font-bold text-[color:var(--color-text)]">Active Hotlist</h3>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]"
            style={{ background: "var(--color-brand-100)" }}
          >
            {hotlist.count} consultants
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
          >
            <DownloadIcon size={16} />
            Export Hotlist
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors"
            style={{ background: BRAND }}
          >
            <PaperPlaneIcon size={16} />
            Send to Vendors
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Hotlist Preview */}
        <div className="min-w-0">
          <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Hotlist Preview
          </p>
          <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-4">
            {hotlist.preview.map((line, i) => (
              <p
                key={i}
                className={`text-[13px] leading-[22px] text-[color:var(--color-text-secondary)] ${
                  i === 0 ? "" : "mt-0"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Consultants in Hotlist */}
        <div className="min-w-0">
          <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Consultants in Hotlist
          </p>
          <div className="space-y-3.5">
            {hotlist.consultants.map((c) => (
              <div key={c.name} className="flex items-center gap-2.5">
                <Avatar name={c.name} image={c.image} size={30} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                    {c.name}
                  </p>
                </div>
                <span className="whitespace-nowrap text-[12.5px] text-[color:var(--color-text-secondary)]">
                  {c.skill}
                </span>
                <span className="w-[52px] shrink-0 text-right text-[12.5px] text-[color:var(--color-text-muted)]">
                  {c.days} days
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vendors Reached */}
        <div className="min-w-0">
          <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Vendors Reached
          </p>
          <div className="space-y-3">
            {hotlist.vendors.map((v) => (
              <div key={v.name} className="flex items-center gap-2.5">
                {v.state === "done" ? (
                  <CheckIcon size={18} style={{ color: GREEN }} />
                ) : (
                  <ClockIcon size={18} className="text-[color:var(--color-text-muted)]" />
                )}
                <span className="flex-1 text-[13px] font-medium text-[color:var(--color-text)]">
                  {v.name}
                </span>
                <span
                  className="whitespace-nowrap text-[12.5px]"
                  style={{
                    color:
                      v.state === "done" ? "var(--color-text-muted)" : AMBER,
                  }}
                >
                  {v.when}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function BenchDashboard() {
  return (
    <div className="space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-7">
      {/* Title row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)]">
            Bench
          </h1>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Idle consultants and re-placement.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] px-5 text-[14px] font-semibold text-white transition-colors"
          style={{ background: BRAND }}
        >
          <PlusIcon size={18} />
          Create Hotlist
        </button>
      </div>

      <KpiRow />

      <BenchedConsultantsCard />

      <div className="grid gap-5 lg:grid-cols-2">
        <BenchAgingCard />
        <BenchByVisaCard />
      </div>

      <ActiveHotlistCard />
    </div>
  );
}
