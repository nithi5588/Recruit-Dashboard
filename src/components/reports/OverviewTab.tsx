"use client";

import { useState } from "react";
import {
  Briefcase,
  Calendar,
  Chart,
  Cup,
  Profile2User,
  Send,
  TickCircle,
  TrendUp,
} from "iconsax-reactjs";
import { CircularProgress, MiniDonut } from "@/components/reports/charts";
import { StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  activityData,
  followUpsData,
  funnelData,
  interviewStageData,
  recentActivities,
  recruitmentPulse,
  reportStatCards,
  sourceData,
  sparklines,
  topJobsData,
} from "@/lib/reports-data";

// ─── Stat icon mapping ────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const props = { size: 20, color, variant: "Bulk" as const };
  const n =
    icon === "briefcase" ? <Briefcase {...props} />
    : icon === "users"     ? <Profile2User {...props} />
    : icon === "plane"     ? <Send {...props} />
    : icon === "calendar"  ? <Calendar {...props} />
    : icon === "check"     ? <TickCircle {...props} variant="Bold" />
    : <Cup {...props} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Activity type icon for feed ──────────────────────────────────────────────

function ActivityTypeIcon({ type }: { type: string }) {
  const configs: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    interview:   { bg: "#F5F3FF", color: "#8B5CF6", icon: <Calendar size={14} variant="Bulk" color="#8B5CF6" /> },
    application: { bg: "#ECFEFF", color: "#06B6D4", icon: <Send size={14} variant="Bulk" color="#06B6D4" /> },
    followup:    { bg: "#FFFBEB", color: "#F59E0B", icon: <Chart size={14} variant="Bulk" color="#F59E0B" /> },
    offer:       { bg: "#ECFDF5", color: "#10B981", icon: <TickCircle size={14} variant="Bold" color="#10B981" /> },
  };
  const c = configs[type] ?? configs.interview;
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
      style={{ backgroundColor: c.bg }}
    >
      {c.icon}
    </div>
  );
}

// ─── Tapered Funnel SVG (muted monochromatic) ─────────────────────────────────

function TaperedFunnel() {
  const VW = 760;
  const leftCol = 150;  // label column
  const rightCol = 58;  // conversion pill column
  const rowH = 42;
  const gap = 4;
  const funnelX = leftCol;
  const funnelW = VW - leftCol - rightCol;
  const funnelCx = funnelX + funnelW / 2;
  const max = funnelData[0].count;
  const widthFor = (n: number) => Math.max((n / max) * funnelW, 28);

  const stages = funnelData.map((d, i) => ({
    ...d,
    topW:    widthFor(d.count),
    bottomW: widthFor(funnelData[i + 1]?.count ?? d.count * 0.85),
    y: i * (rowH + gap),
  }));

  const VH = funnelData.length * (rowH + gap) - gap + 2;

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxWidth: "100%" }} role="img" aria-label="Recruitment funnel">
      {/* Trapezoids + centered count labels.
          Each stage carries its own color from the data — gives the funnel
          a graceful indigo gradient instead of a single flat fill. */}
      {stages.map((s, i) => {
        const tL = funnelCx - s.topW / 2, tR = funnelCx + s.topW / 2;
        const bL = funnelCx - s.bottomW / 2, bR = funnelCx + s.bottomW / 2;
        const cy = s.y + rowH / 2;
        const isLight = i < 2; // first two shades are pale → use dark text
        return (
          <g key={`trap-${i}`}>
            <path
              d={`M ${tL} ${s.y} L ${tR} ${s.y} L ${bR} ${s.y + rowH} L ${bL} ${s.y + rowH} Z`}
              fill={s.color}
            />
            <text
              x={funnelCx}
              y={cy + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={isLight ? "#3730A3" : "white"}
            >
              {s.count}
            </text>
          </g>
        );
      })}

      {/* Left-side stage labels (muted, no colored dots) */}
      {stages.map((s, i) => {
        const cy = s.y + rowH / 2;
        return (
          <text
            key={`lbl-${i}`}
            x={12}
            y={cy + 4}
            fontSize="11"
            fontWeight="500"
            style={{ fill: "var(--color-text-secondary)" }}
          >
            {s.label}
          </text>
        );
      })}

      {/* Right-side conversion pills between stages */}
      {stages.slice(1).map((s, i) => {
        const fromCount = funnelData[i].count;
        const pct = ((s.count / fromCount) * 100).toFixed(1);
        const cy = i * (rowH + gap) + rowH + gap / 2;
        const pillW = 48, pillH = 18;
        const px = VW - rightCol + 2;
        return (
          <g key={`pill-${i}`}>
            <rect
              x={px} y={cy - pillH / 2}
              width={pillW} height={pillH}
              rx={9}
              style={{ fill: "var(--color-surface-2)" }}
            />
            <text
              x={px + pillW / 2} y={cy + 4}
              fontSize="10" fontWeight="700" textAnchor="middle"
              style={{ fill: "var(--color-text-secondary)" }}
            >
              {pct}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Activity line chart ──────────────────────────────────────────────────────

const CHART_SERIES = [
  { key: "applications" as const, label: "Applications", color: "#6366F1" }, // indigo
  { key: "interviews"   as const, label: "Interviews",   color: "#8B5CF6" }, // violet
  { key: "followUps"    as const, label: "Follow-ups",   color: "#F59E0B" }, // amber
  { key: "offers"       as const, label: "Offers",       color: "#10B981" }, // emerald
];

function ActivityChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 195;
  const P = { l: 40, r: 6, t: 14, b: 28 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 60, yTicks = [0, 15, 30, 45, 60];
  const n = activityData.labels.length;

  const gx = (i: number) => P.l + (i / (n - 1)) * pw;
  const gy = (v: number) => P.t + (1 - v / yMax) * ph;

  const bezier = (vals: number[]) =>
    vals.map((v, i) => {
      const x = gx(i), y = gy(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = gx(i - 1), py = gy(vals[i - 1]);
      const cp = (x - px) / 3;
      return `C ${px + cp} ${py} ${x - cp} ${y} ${x} ${y}`;
    }).join(" ");

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * VW - P.l;
    const idx = Math.max(0, Math.min(n - 1, Math.round((sx / pw) * (n - 1))));
    setHovIdx(idx);
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {CHART_SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 rounded-full" style={{ backgroundColor: s.color, display: "inline-block" }} />
            <span className="text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
          </div>
        ))}
      </div>
      {hovIdx !== null && (
        <div
          className="pointer-events-none absolute z-20 min-w-[148px] rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-dropdown)]"
          style={{
            left: `${((gx(hovIdx) - 10) / VW) * 100}%`,
            top: "32px",
            transform: hovIdx > n / 2 ? "translateX(-110%)" : "translateX(8px)",
          }}
        >
          <p className="mb-2 text-[11px] font-semibold text-[color:var(--color-text)]">{activityData.labels[hovIdx]}, 2024</p>
          {CHART_SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[color:var(--color-text-secondary)]">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--color-text)]">{activityData[s.key][hovIdx]}</span>
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: "195px" }}
        onMouseMove={handleMove} onMouseLeave={() => setHovIdx(null)}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} y1={gy(t)} x2={P.l + pw} y2={gy(t)} strokeWidth={0.8} style={{ stroke: "var(--color-border)" }} />
            <text x={P.l - 6} y={gy(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{t}</text>
          </g>
        ))}
        {activityData.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph} strokeWidth={1} strokeDasharray="4 2" style={{ stroke: "var(--color-border-strong)" }} />
        )}
        {CHART_SERIES.map((s) => (
          <path key={s.key} d={bezier(activityData[s.key])} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" />
        ))}
        {CHART_SERIES.map((s) =>
          activityData[s.key].map((v, i) => (
            <circle key={`${s.key}-${i}`} cx={gx(i)} cy={gy(v)} r={hovIdx === i ? 4 : 2.5}
              fill={hovIdx === i ? s.color : "white"} stroke={s.color} strokeWidth={1.5} />
          ))
        )}
      </svg>
    </div>
  );
}

// ─── Main Overview Tab ────────────────────────────────────────────────────────

export function OverviewTab() {
  return (
    <div className="space-y-5">
      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {reportStatCards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={String(card.value)}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            spark={{ values: sparklines.overview[i], color: card.iconColor }}
          />
        ))}
      </div>

      {/* Row 2: Pulse hero | Tapered funnel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[5fr_6fr]">
        {/* Pulse hero — muted, clean */}
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                Recruitment Pulse
              </p>
              <h2 className="mt-0.5 text-[15px] font-bold text-[color:var(--color-text)]">
                This week at a glance
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]"
              />
              Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Compact ring */}
            <div className="relative shrink-0">
              <CircularProgress
                value={recruitmentPulse.score}
                size={96}
                color="var(--color-brand-500)"
                trackColor="var(--color-surface-2)"
                stroke={8}
                showLabel={false}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[22px] font-bold leading-none text-[color:var(--color-text)]">
                  {recruitmentPulse.score}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-[color:var(--color-text-muted)]">
                  / 100
                </p>
              </div>
            </div>

            {/* Narrative rows */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-success-light)] px-1.5 py-0.5 text-[10px] font-bold text-[color:var(--color-success)]">
                  <TrendUp size={9} variant="Bold" color="currentColor" />▲ {recruitmentPulse.delta} pts
                </span>
                <span className="text-[10px] text-[color:var(--color-text-muted)]">
                  vs last week
                </span>
              </div>
              <ul className="divide-y divide-[color:var(--color-border)]">
                {recruitmentPulse.narrative.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-2 py-1.5"
                  >
                    <span className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                      {item.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[13px] font-bold text-[color:var(--color-text)]">
                        {item.value}
                      </span>
                      <span className="inline-flex w-[44px] items-center justify-end gap-0.5 text-[10px] font-semibold text-[color:var(--color-success)]">
                        ▲ {item.change}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tapered funnel — muted monochromatic */}
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">
              Recruitment Funnel
            </h3>
            <button
              type="button"
              className="rounded-[8px] border border-[color:var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
            >
              This Week ▾
            </button>
          </div>
          <p className="mb-3 text-[11px] text-[color:var(--color-text-muted)]">
            Candidate progression — conversion % between stages
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <TaperedFunnel />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                Overall conversion
              </p>
              <p className="text-[16px] font-bold text-[color:var(--color-text)]">
                {((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                Lift vs last week
              </p>
              <p className="text-[16px] font-bold text-[color:var(--color-success)]">
                ▲ 4.2%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Activity chart | Source donut | Top Jobs */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[5fr_3fr_3fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Activity Overview</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Weekly ▾</button>
          </div>
          <ActivityChart />
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Applications by Source</h3>
          <div className="flex flex-col items-center gap-4">
            <MiniDonut
              segments={sourceData.map((s) => ({ value: s.count, color: s.color }))}
              total={sourceData.reduce((a, s) => a + s.count, 0)}
              line1="56"
              line2="Total"
            />
            <div className="w-full space-y-2">
              {sourceData.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[color:var(--color-text)]">
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
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Top Jobs</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <div className="space-y-3">
            {topJobsData.map((job) => {
              const pct = Math.round((job.applications / topJobsData[0].applications) * 100);
              return (
                <div key={job.title}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px]">{job.icon}</span>
                      <span className="text-[12px] font-medium text-[color:var(--color-text)]">{job.title}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[color:var(--color-text)]">{job.applications}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: job.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Interviews donut | Follow-ups | Recent Activities */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Interviews by Stage</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={interviewStageData.map((s) => ({ value: s.count, color: s.color }))}
                total={interviewStageData.reduce((a, s) => a + s.count, 0)}
                line1="18"
                line2="Total"
                size={120}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {interviewStageData.map((s) => (
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
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Follow-ups Overview</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">This Week ▾</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={followUpsData.map((s) => ({ value: s.count, color: s.color }))}
                total={followUpsData.reduce((a, s) => a + s.count, 0)}
                line1="28"
                line2="Total"
                size={120}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              {followUpsData.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[12px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[color:var(--color-text)]">
                      {s.count}{" "}
                      <span className="font-normal text-[color:var(--color-text-muted)]">({s.pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Recent Activity</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <ol className="relative space-y-3 border-l border-[color:var(--color-border)] pl-5">
            {recentActivities.map((a) => (
              <li key={a.name} className="relative">
                <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: a.color }} />
                <div className="flex items-center gap-2.5">
                  <ActivityTypeIcon type={a.type} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">{a.name}</p>
                    <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
                      {a.action} · <span className="text-[color:var(--color-text-muted)]">{a.role}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-[color:var(--color-text-muted)]">{a.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
