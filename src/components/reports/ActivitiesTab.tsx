"use client";

import { useState } from "react";
import {
  Activity,
  Calendar,
  Call,
  Clock,
  Cup,
  Notification,
  Note1,
  Profile2User,
  Send2,
  TickCircle,
} from "iconsax-reactjs";
import { MiniDonut } from "@/components/reports/charts";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  type ActivityFeedItem,
  activitiesByRecruiter,
  activityAiInsights,
  activityFeed,
  activityHeatmap,
  activityStatCards,
  activityTypeBreakdown,
  activityVolumeOverTime,
  peakHours,
} from "@/lib/reports-data";

// ─── Stat icon mapping ────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const props = { size: 20, color, variant: "Bulk" as const };
  const n =
    icon === "activity"   ? <Activity {...props} />
    : icon === "calendar" ? <Calendar {...props} />
    : icon === "check"    ? <TickCircle {...props} variant="Bold" />
    : icon === "users"    ? <Profile2User {...props} />
    : icon === "clock"    ? <Clock {...props} />
    : <Notification {...props} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Activity Heatmap (7 days × 24 hours) ─────────────────────────────────────

const HEAT_COLORS = ["#F4F2EE", "#F8D5BD", "#F2B187", "#ED8E55", "#C75510", "#C75510"];

function ActivityHeatmap() {
  const [hov, setHov] = useState<{ d: number; h: number } | null>(null);
  const max = 5;
  const MARKER_HOURS = [0, 6, 12, 18, 23];

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour rail — absolute-positioned markers so labels never clip */}
          <div className="flex gap-2">
            <div className="w-10 shrink-0" />
            <div className="relative h-4 flex-1">
              {MARKER_HOURS.map((h, i) => {
                const pos = (h / 23) * 100;
                const transform = i === 0 ? "translateX(0)" : i === MARKER_HOURS.length - 1 ? "translateX(-100%)" : "translateX(-50%)";
                return (
                  <span
                    key={h}
                    className="absolute top-0 text-[10px] font-medium text-[color:var(--color-text-muted)]"
                    style={{ left: `${pos}%`, transform }}
                  >
                    {h === 0 ? "12a" : h === 12 ? "12p" : h < 12 ? `${h}a` : `${h - 12}p`}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-1 space-y-[3px]">
            {activityHeatmap.days.map((day, d) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-10 shrink-0 text-[10px] font-semibold text-[color:var(--color-text-secondary)]">{day}</span>
                <div className="grid flex-1 grid-cols-[repeat(24,minmax(0,1fr))] gap-[3px]">
                  {activityHeatmap.grid[d].map((v, h) => {
                    const isHov = hov?.d === d && hov?.h === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        onMouseEnter={() => setHov({ d, h })}
                        onMouseLeave={() => setHov(null)}
                        aria-label={`${day} ${activityHeatmap.hours[h]} — intensity ${v} of ${max}`}
                        className="h-6 rounded-[4px] transition-transform"
                        style={{
                          backgroundColor: HEAT_COLORS[v],
                          outline: isHov ? "2px solid #EA6814" : "none",
                          outlineOffset: 1,
                          transform: isHov ? "scale(1.2)" : "scale(1)",
                          zIndex: isHov ? 10 : 0,
                          position: "relative",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-[color:var(--color-text-muted)]">
          {hov
            ? `${activityHeatmap.days[hov.d]} · ${activityHeatmap.hours[hov.h]} — intensity ${activityHeatmap.grid[hov.d][hov.h]}/${max}`
            : "Hover a cell to inspect"}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-[color:var(--color-text-muted)]">
          <span>Less</span>
          {HEAT_COLORS.map((c, i) => (
            <span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// ─── Activity volume area chart (total vs responses) ──────────────────────────

const VOL_SERIES = [
  { key: "total"     as const, label: "Total Activities", color: "#EA6814" },
  { key: "responses" as const, label: "Responses",        color: "#C75510" },
];

function VolumeChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 180;
  const P = { l: 36, r: 10, t: 14, b: 26 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 80, yTicks = [0, 20, 40, 60, 80];
  const n = activityVolumeOverTime.labels.length;

  const gx = (i: number) => P.l + (i / (n - 1)) * pw;
  const gy = (v: number) => P.t + (1 - v / yMax) * ph;

  const path = (vals: number[]) =>
    vals.map((v, i) => {
      const x = gx(i), y = gy(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = gx(i - 1), py = gy(vals[i - 1]);
      const cp = (x - px) / 3;
      return `C ${px + cp} ${py} ${x - cp} ${y} ${x} ${y}`;
    }).join(" ");

  const areaPath = (vals: number[]) => `${path(vals)} L ${gx(n - 1)} ${P.t + ph} L ${gx(0)} ${P.t + ph} Z`;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * VW - P.l;
    const idx = Math.max(0, Math.min(n - 1, Math.round((sx / pw) * (n - 1))));
    setHovIdx(idx);
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {VOL_SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="h-[2px] w-4 rounded-full" style={{ backgroundColor: s.color, display: "inline-block" }} />
            <span className="text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
          </div>
        ))}
      </div>
      {hovIdx !== null && (
        <div
          className="pointer-events-none absolute z-20 min-w-[160px] rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-dropdown)]"
          style={{
            left: `${((gx(hovIdx) - 10) / VW) * 100}%`,
            top: "32px",
            transform: hovIdx > n / 2 ? "translateX(-110%)" : "translateX(8px)",
          }}
        >
          <p className="mb-2 text-[11px] font-semibold text-[color:var(--color-text)]">
            {activityVolumeOverTime.labels[hovIdx]}, 2024
          </p>
          {VOL_SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[color:var(--color-text-secondary)]">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--color-text)]">
                {activityVolumeOverTime[s.key][hovIdx]}
              </span>
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: "180px" }}
        onMouseMove={handleMove} onMouseLeave={() => setHovIdx(null)}>
        <defs>
          <linearGradient id="volAreaP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EA6814" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#EA6814" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="volAreaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C75510" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#C75510" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} y1={gy(t)} x2={P.l + pw} y2={gy(t)} style={{ stroke: "var(--color-border)" }} strokeWidth={0.8} />
            <text x={P.l - 6} y={gy(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{t}</text>
          </g>
        ))}
        {activityVolumeOverTime.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        <path d={areaPath(activityVolumeOverTime.total)}     fill="url(#volAreaP)" />
        <path d={areaPath(activityVolumeOverTime.responses)} fill="url(#volAreaG)" />
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph}
            style={{ stroke: "var(--color-border-strong)" }} strokeWidth={1} strokeDasharray="4 2" />
        )}
        {VOL_SERIES.map((s) => (
          <path key={s.key} d={path(activityVolumeOverTime[s.key])} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" />
        ))}
        {VOL_SERIES.map((s) =>
          activityVolumeOverTime[s.key].map((v, i) => (
            <circle key={`${s.key}-${i}`} cx={gx(i)} cy={gy(v)}
              r={hovIdx === i ? 4 : 2.5}
              fill={hovIdx === i ? s.color : "white"}
              stroke={s.color} strokeWidth={1.5} />
          ))
        )}
      </svg>
    </div>
  );
}

// ─── Peak-hour vertical bar chart (24 bars) ───────────────────────────────────

function PeakHoursChart() {
  const max = Math.max(...peakHours);
  const H = 120;
  return (
    <div>
      <div className="flex h-[120px] items-end gap-[3px]">
        {peakHours.map((v, i) => {
          const h = Math.max((v / max) * H, 2);
          const isPeak = v === max;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-[3px] transition-all"
              title={`${i % 12 === 0 ? 12 : i % 12}${i < 12 ? "a" : "p"} — ${v}`}
              style={{
                height: h,
                backgroundColor: isPeak ? "#EA6814" : "#F8D5BD",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[9px] text-[color:var(--color-text-muted)]">
        <span>12a</span>
        <span>6a</span>
        <span>12p</span>
        <span>6p</span>
        <span>12a</span>
      </div>
    </div>
  );
}

// ─── Feed icon ────────────────────────────────────────────────────────────────

function FeedIcon({ type }: { type: ActivityFeedItem["type"] }) {
  const configs = {
    call:        { bg: "#FCE9DD", fg: "#EA6814", icon: <Call size={14} variant="Bulk" color="#EA6814" /> },
    email:       { bg: "#F4F2EE", fg: "#ED8E55", icon: <Send2 size={14} variant="Bulk" color="#ED8E55" /> },
    interview:   { bg: "#FFF6EE", fg: "#ED8E55", icon: <Calendar size={14} variant="Bulk" color="#ED8E55" /> },
    application: { bg: "#FCE9DD", fg: "#C75510", icon: <TickCircle size={14} variant="Bold" color="#C75510" /> },
    note:        { bg: "#F8D5BD", fg: "#9A9183", icon: <Note1 size={14} variant="Bulk" color="#9A9183" /> },
    followup:    { bg: "#FFF6EE", fg: "#C75510", icon: <Clock size={14} variant="Bulk" color="#C75510" /> },
    offer:       { bg: "#FCE9DD", fg: "#C75510", icon: <Cup size={14} variant="Bulk" color="#C75510" /> },
  } as const;
  const c = configs[type];
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {c.icon}
    </div>
  );
}

// ─── Main Activities Tab ──────────────────────────────────────────────────────

export function ActivitiesTab() {
  const recMax = Math.max(...activitiesByRecruiter.map((r) => r.count));
  const typeTotal = activityTypeBreakdown.reduce((a, s) => a + s.count, 0);

  const groups: ActivityFeedItem["group"][] = ["Today", "Yesterday", "Earlier This Week"];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {activityStatCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            subtitle={"subtitle" in card ? card.subtitle : undefined}
          />
        ))}
      </div>

      {/* Row 2: Heatmap (hero) | Type breakdown */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_4fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Activity Heatmap</h3>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">When your team is most active — last 7 days</p>
            </div>
            <button
              type="button"
              className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
            >
              All types ▾
            </button>
          </div>
          <ActivityHeatmap />
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Activity Types</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={activityTypeBreakdown.map((s) => ({ value: s.count, color: s.color }))}
                total={typeTotal}
                line1={String(typeTotal)}
                line2="Total"
                size={140}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {activityTypeBreakdown.map((s) => (
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
      </div>

      {/* Row 3: Volume chart | Recruiter leaderboard | Peak hours */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Activity Volume</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Daily ▾</button>
          </div>
          <VolumeChart />
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Activities by Recruiter</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <ul className="space-y-3">
            {activitiesByRecruiter.map((r) => (
              <li key={r.name} className="flex items-center gap-3">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: r.color }}
                >
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="truncate text-[12px] font-medium text-[color:var(--color-text)]">{r.name}</span>
                    <span className="text-[12px] font-bold text-[color:var(--color-text)]">{r.count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(r.count / recMax) * 100}%`, backgroundColor: r.color }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Peak Activity Hours</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">24h</span>
          </div>
          <PeakHoursChart />
          <div className="mt-4 rounded-[12px] bg-[color:var(--color-brand-100)]/40 p-3">
            <p className="text-[11px] font-semibold text-[color:var(--color-text)]">Peak window: 2 – 4 PM</p>
            <p className="mt-0.5 text-[11px] text-[color:var(--color-text-secondary)]">44% of daily activity happens here.</p>
          </div>
        </div>
      </div>

      {/* Row 4: Feed | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Recent Activity</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <div className="space-y-5">
            {groups.map((g) => {
              const items = activityFeed.filter((a) => a.group === g);
              if (items.length === 0) return null;
              return (
                <section key={g}>
                  <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">{g}</h4>
                  <ol className="relative space-y-3 border-l border-[color:var(--color-border)] pl-5">
                    {items.map((a) => (
                      <li key={a.id} className="relative">
                        <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[color:var(--color-brand-500)]" />
                        <div className="flex items-center gap-3">
                          <FeedIcon type={a.type} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">{a.title}</p>
                              <span className="shrink-0 text-[11px] text-[color:var(--color-text-muted)]">{a.time}</span>
                            </div>
                            <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
                              {a.subject}{" "}
                              <span className="text-[color:var(--color-text-muted)]">· by {a.actor.name}</span>
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        </div>

        <InsightsPanel insights={activityAiInsights} />
      </div>
    </div>
  );
}
