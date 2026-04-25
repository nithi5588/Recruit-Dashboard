"use client";

import { useState } from "react";
import {
  Briefcase,
  Cup,
  Eye,
  Mouse,
  PercentageSquare,
  type IconProps as IconsaxProps,
} from "iconsax-reactjs";
import type { ComponentType } from "react";
import { MiniDonut } from "@/components/reports/charts";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  applicationsOverTime,
  jobPerformanceRows,
  jobPipelineFlow,
  jobsAiInsights,
  jobsApplicationsBySource,
  jobsByDepartment,
  jobsByStatus,
  jobsStatCards,
  pipelineStageLabels,
  sparklines,
  timeToFill,
  topJobSpotlight,
  type JobStatus,
} from "@/lib/reports-data";

// ─── Local icons for views/cursor/percent ─────────────────────────────────────

function makeIconsaxIcon(Icon: ComponentType<IconsaxProps>) {
  return function IconsaxLocal({ size = 20, color }: { size?: number; color?: string }) {
    return <Icon size={size} color={color ?? "currentColor"} variant="Linear" />;
  };
}
const EyeIcon = makeIconsaxIcon(Eye);
const CursorIcon = makeIconsaxIcon(Mouse);
const PercentIcon = makeIconsaxIcon(PercentageSquare);

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const props = { size: 20, color, variant: "Bulk" as const };
  const n =
    icon === "briefcase"   ? <Briefcase {...props} />
    : icon === "eye"       ? <EyeIcon size={20} color={color} />
    : icon === "cursor"    ? <CursorIcon size={20} color={color} />
    : icon === "trophy"    ? <Cup {...props} />
    : icon === "percent"   ? <PercentIcon size={20} color={color} />
    : <Briefcase {...props} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Applications Over Time (enhanced with gradient fill) ─────────────────────

function ApplicationsChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 195;
  const P = { l: 40, r: 10, t: 14, b: 28 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 100, yTicks = [0, 25, 50, 75, 100];
  const n = applicationsOverTime.labels.length;

  const gx = (i: number) => P.l + (i / (n - 1)) * pw;
  const gy = (v: number) => P.t + (1 - v / yMax) * ph;

  const pathD = applicationsOverTime.values.map((v, i) => {
    const x = gx(i), y = gy(v);
    if (i === 0) return `M ${x} ${y}`;
    const px = gx(i - 1), py = gy(applicationsOverTime.values[i - 1]);
    const cp = (x - px) / 3;
    return `C ${px + cp} ${py} ${x - cp} ${y} ${x} ${y}`;
  }).join(" ");

  const areaD = `${pathD} L ${gx(n - 1)} ${P.t + ph} L ${gx(0)} ${P.t + ph} Z`;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * VW - P.l;
    const idx = Math.max(0, Math.min(n - 1, Math.round((sx / pw) * (n - 1))));
    setHovIdx(idx);
  };

  return (
    <div className="relative">
      {hovIdx !== null && (
        <div
          className="pointer-events-none absolute z-20 min-w-[128px] rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-dropdown)]"
          style={{
            left: `${((gx(hovIdx) - 10) / VW) * 100}%`,
            top: "6px",
            transform: hovIdx > n / 2 ? "translateX(-110%)" : "translateX(8px)",
          }}
        >
          <p className="mb-1.5 text-[11px] font-semibold text-[color:var(--color-text)]">{applicationsOverTime.labels[hovIdx]}, 2024</p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#5B3DF5" }} />
              <span className="text-[10px] text-[color:var(--color-text-secondary)]">Applications</span>
            </div>
            <span className="text-[10px] font-bold text-[color:var(--color-text)]">{applicationsOverTime.values[hovIdx]}</span>
          </div>
        </div>
      )}

      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: "195px" }}
        onMouseMove={handleMove} onMouseLeave={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="appAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5B3DF5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5B3DF5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} y1={gy(t)} x2={P.l + pw} y2={gy(t)} style={{ stroke: "var(--color-border)" }} strokeWidth={0.8} />
            <text x={P.l - 6} y={gy(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{t}</text>
          </g>
        ))}
        {applicationsOverTime.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        <path d={areaD} fill="url(#appAreaFill)" />
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph} style={{ stroke: "var(--color-border-strong)" }} strokeWidth={1} strokeDasharray="4 2" />
        )}
        <path d={pathD} fill="none" stroke="#5B3DF5" strokeWidth={2.5} strokeLinecap="round" />
        {applicationsOverTime.values.map((v, i) => (
          <circle key={i} cx={gx(i)} cy={gy(v)} r={hovIdx === i ? 4.5 : 2.5}
            fill={hovIdx === i ? "#5B3DF5" : "white"} stroke="#5B3DF5" strokeWidth={1.5} />
        ))}
      </svg>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<JobStatus, { bg: string; fg: string }> = {
  "Active":  { bg: "#EAFBF1", fg: "#16A34A" },
  "Draft":   { bg: "#F3F4F8", fg: "#667085" },
  "On Hold": { bg: "#FFF4DB", fg: "#B45309" },
  "Closed":  { bg: "#EAF2FF", fg: "#5B3DF5" },
  "Expired": { bg: "#FDECEC", fg: "#DC2626" },
};

function StatusBadge({ status }: { status: JobStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

// ─── Pipeline Flow visualization (per job — opacity-faded stage tiles) ────────

function PipelineFlow() {
  // Per-stage max across all jobs so opacity is comparable
  const stageMaxes = pipelineStageLabels.map((_, i) =>
    Math.max(...jobPipelineFlow.map((j) => j.stages[i]))
  );

  return (
    <div className="space-y-4">
      {/* Column header once for the whole stack */}
      <div className="hidden gap-1.5 pl-40 sm:flex">
        {pipelineStageLabels.map((l, i) => (
          <div key={l} className="flex flex-1 items-center justify-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <span>{l}</span>
            {i < pipelineStageLabels.length - 1 && <span className="text-[10px] text-[color:var(--color-text-muted)]/50">→</span>}
          </div>
        ))}
      </div>

      {jobPipelineFlow.map((job) => {
        const overallConv = ((job.stages[job.stages.length - 1] / job.stages[0]) * 100).toFixed(1);
        return (
          <div key={job.title} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {/* Job label */}
            <div className="flex items-center justify-between gap-2 sm:w-40 sm:shrink-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[16px]">{job.icon}</span>
                <span className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">{job.title}</span>
              </div>
              <span className="shrink-0 rounded-full bg-[color:var(--color-success-light)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-success)] sm:hidden">
                {overallConv}%
              </span>
            </div>

            {/* Stages */}
            <div className="flex flex-1 gap-1.5">
              {job.stages.map((v, i) => {
                const intensity = stageMaxes[i] === 0 ? 0 : v / stageMaxes[i];
                const opacity = 0.22 + intensity * 0.78;
                return (
                  <div key={i} className="flex-1">
                    <div
                      className="flex h-11 items-center justify-center rounded-[8px] text-[13px] font-extrabold text-white transition-transform hover:scale-[1.04]"
                      style={{ backgroundColor: job.color, opacity }}
                      title={`${pipelineStageLabels[i]}: ${v}`}
                    >
                      {v}
                    </div>
                    {/* Mobile stage label under the tile */}
                    <p className="mt-1 text-center text-[9px] font-medium uppercase tracking-wide text-[color:var(--color-text-muted)] sm:hidden">
                      {pipelineStageLabels[i]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Desktop: conversion chip at end */}
            <span className="hidden shrink-0 rounded-full bg-[color:var(--color-success-light)] px-2.5 py-1 text-[11px] font-bold text-[color:var(--color-success)] sm:inline-flex">
              {overallConv}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Jobs Tab ────────────────────────────────────────────────────────────

export function JobsTab() {
  const deptMax = Math.max(...jobsByDepartment.map((d) => d.count));

  return (
    <div className="space-y-5">
      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {jobsStatCards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            spark={{ values: sparklines.jobs[i], color: card.iconColor }}
          />
        ))}
      </div>

      {/* Row 2: Top Job Spotlight | Applications Over Time */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[5fr_6fr]">
        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] shadow-[var(--shadow-card)]">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #1E293B 0%, #5B3DF5 60%, #8B5CF6 100%)" }}
          />
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #22C55E 0%, transparent 60%)" }}
          />
          <div className="relative p-5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                <Cup size={12} variant="Bulk" color="currentColor" /> Top Performing Job
              </span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">Health {topJobSpotlight.healthScore}/100</span>
            </div>
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-white/15 text-[26px] backdrop-blur">
                {topJobSpotlight.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[18px] font-extrabold leading-tight">{topJobSpotlight.title}</p>
                <p className="text-[12px] opacity-80">
                  {topJobSpotlight.department} · {topJobSpotlight.location}
                </p>
                <p className="mt-0.5 text-[11px] opacity-70">Posted {topJobSpotlight.posted}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Applications</p>
                <p className="text-[18px] font-extrabold leading-none">{topJobSpotlight.applications}</p>
              </div>
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Interviews</p>
                <p className="text-[18px] font-extrabold leading-none">{topJobSpotlight.interviews}</p>
              </div>
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Conversion</p>
                <p className="text-[18px] font-extrabold leading-none">{topJobSpotlight.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Applications Over Time</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Daily ▾</button>
          </div>
          <ApplicationsChart />
        </div>
      </div>

      {/* Row 3: Status | Department | Time to Fill */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Jobs by Status</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={jobsByStatus.map((s) => ({ value: s.count, color: s.color }))}
                total={jobsByStatus.reduce((a, s) => a + s.count, 0)}
                line1="24" line2="Total" size={120}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {jobsByStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="truncate text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[color:var(--color-text)]">
                    {s.count}{" "}
                    <span className="font-normal text-[color:var(--color-text-muted)]">({s.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Jobs by Department</h3>
          <ul className="space-y-3">
            {jobsByDepartment.map((d) => (
              <li key={d.label} className="flex items-center gap-3">
                <span className="w-20 shrink-0 truncate text-[12px] text-[color:var(--color-text-secondary)]">{d.label}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(d.count / deptMax) * 100}%`, backgroundColor: d.color }} />
                </div>
                <span className="w-20 shrink-0 text-right text-[12px] font-semibold text-[color:var(--color-text)]">
                  {d.count}{" "}
                  <span className="font-normal text-[color:var(--color-text-muted)]">({d.pct}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Time to Fill</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">days</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-[color:var(--color-border)] p-3">
              <p className="text-[11px] text-[color:var(--color-text-secondary)]">Average</p>
              <p className="mt-1 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{timeToFill.average.days}</p>
              <p className="mt-2 text-[10px] font-semibold text-[color:var(--color-success)]">▼ {Math.abs(timeToFill.average.change)}%</p>
            </div>
            <div className="rounded-[14px] border border-[color:var(--color-border)] p-3">
              <p className="text-[11px] text-[color:var(--color-text-secondary)]">Median</p>
              <p className="mt-1 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{timeToFill.median.days}</p>
              <p className="mt-2 text-[10px] font-semibold text-[color:var(--color-success)]">▼ {Math.abs(timeToFill.median.change)}%</p>
            </div>
            <div className="col-span-2 rounded-[14px] bg-[color:var(--color-success-light)] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-success)]">Fastest</p>
              <p className="mt-0.5 truncate text-[12px] font-semibold text-[color:var(--color-text)]">{timeToFill.fastest.job}</p>
              <p className="text-[11px] text-[color:var(--color-text-secondary)]">{timeToFill.fastest.days} days</p>
            </div>
            <div className="col-span-2 rounded-[14px] bg-[#FDECEC]/60 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-error)]">Slowest</p>
              <p className="mt-0.5 truncate text-[12px] font-semibold text-[color:var(--color-text)]">{timeToFill.slowest.job}</p>
              <p className="text-[11px] text-[color:var(--color-text-secondary)]">{timeToFill.slowest.days} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Pipeline Flow (hero) | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Job Pipeline Flow</h3>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">How candidates move through each job's funnel</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[color:var(--color-text-muted)]">
              {pipelineStageLabels.map((l, i) => (
                <span key={l} className={i === 0 ? "" : "before:mr-1 before:content-['→']"}>{l}</span>
              ))}
            </div>
          </div>
          <PipelineFlow />
        </div>

        <InsightsPanel insights={jobsAiInsights} />
      </div>

      {/* Row 5: Applications by Source donut + Performance table */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Applications by Source</h3>
          <div className="flex flex-col items-center gap-4">
            <MiniDonut
              segments={jobsApplicationsBySource.map((s) => ({ value: s.count, color: s.color }))}
              total={jobsApplicationsBySource.reduce((a, s) => a + s.count, 0)}
              line1="256" line2="Total" size={140}
            />
            <div className="w-full space-y-2">
              {jobsApplicationsBySource.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="truncate text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-[color:var(--color-text)]">
                    {s.count}{" "}
                    <span className="font-normal text-[color:var(--color-text-muted)]">({s.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Job Performance Overview</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all jobs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="py-2 pr-3">Job Title</th>
                  <th className="px-2 py-2 text-right">Views</th>
                  <th className="px-2 py-2 text-right">Apps</th>
                  <th className="px-2 py-2 text-right">Interviews</th>
                  <th className="px-2 py-2 text-right">Hired</th>
                  <th className="px-2 py-2 text-right">Conv.</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobPerformanceRows.map((row) => (
                  <tr key={row.title} className="border-b border-[color:var(--color-border)] last:border-0 text-[12px]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]">{row.icon}</span>
                        <span className="font-medium text-[color:var(--color-text)]">{row.title}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{row.views}</td>
                    <td className="px-2 py-3 text-right font-semibold text-[color:var(--color-text)]">{row.applications}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{row.interviews}</td>
                    <td className="px-2 py-3 text-right font-semibold text-[color:var(--color-text)]">{row.hired}</td>
                    <td className="px-2 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--color-success-light)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
                        {row.conversion}%
                      </span>
                    </td>
                    <td className="px-2 py-3"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

