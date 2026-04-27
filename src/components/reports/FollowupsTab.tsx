"use client";

import { useState } from "react";
import {
  Call,
  Category2,
  Clock,
  Element4,
  Link2,
  Notification,
  Refresh,
  Send2,
  Sms,
  TickCircle,
} from "iconsax-reactjs";
import { CircularProgress, MiniDonut } from "@/components/reports/charts";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  type FollowupChannel,
  type FollowupPriority,
  followupAiInsights,
  followupByChannel,
  followupPriority,
  followupStatCards,
  followupStatusDonut,
  followupTrend,
  responseTimeByChannel,
  upcomingFollowups,
} from "@/lib/reports-data";

// ─── Stat icon mapping ────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const props = { size: 20, color, variant: "Bulk" as const };
  const n =
    icon === "list"   ? <Category2 {...props} />
    : icon === "check" ? <TickCircle {...props} variant="Bold" />
    : icon === "clock" ? <Clock {...props} />
    : icon === "alert" ? <Notification {...props} />
    : icon === "bolt"  ? <Refresh {...props} />
    : <Element4 {...props} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Trend line (completed vs pending) ────────────────────────────────────────

const TREND_SERIES = [
  { key: "completed" as const, label: "Completed", color: "#273DC0" },
  { key: "pending"   as const, label: "Pending",   color: "#5C6FE7" },
];

function FollowupTrendChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 180;
  const P = { l: 36, r: 10, t: 14, b: 26 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 15, yTicks = [0, 3, 6, 9, 12, 15];
  const n = followupTrend.labels.length;

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

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * VW - P.l;
    const idx = Math.max(0, Math.min(n - 1, Math.round((sx / pw) * (n - 1))));
    setHovIdx(idx);
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {TREND_SERIES.map((s) => (
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
          <p className="mb-2 text-[11px] font-semibold text-[color:var(--color-text)]">
            {followupTrend.labels[hovIdx]}, 2024
          </p>
          {TREND_SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[color:var(--color-text-secondary)]">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--color-text)]">
                {followupTrend[s.key][hovIdx]}
              </span>
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: "180px" }}
        onMouseMove={handleMove} onMouseLeave={() => setHovIdx(null)}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} y1={gy(t)} x2={P.l + pw} y2={gy(t)} style={{ stroke: "var(--color-border)" }} strokeWidth={0.8} />
            <text x={P.l - 6} y={gy(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{t}</text>
          </g>
        ))}
        {followupTrend.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph}
            style={{ stroke: "var(--color-border-strong)" }} strokeWidth={1} strokeDasharray="4 2" />
        )}
        {TREND_SERIES.map((s) => (
          <path key={s.key} d={path(followupTrend[s.key])} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" />
        ))}
        {TREND_SERIES.map((s) =>
          followupTrend[s.key].map((v, i) => (
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

// ─── Priority stacked bar ─────────────────────────────────────────────────────

function PriorityBar() {
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {followupPriority.map((p) => (
          <div
            key={p.label}
            title={`${p.label}: ${p.count} (${p.pct}%)`}
            style={{ width: `${p.pct}%`, backgroundColor: p.color }}
          />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {followupPriority.map((p) => (
          <div key={p.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[12px] text-[color:var(--color-text-secondary)]">{p.label} Priority</span>
            </div>
            <span className="text-[12px] font-semibold text-[color:var(--color-text)]">
              {p.count} <span className="font-normal text-[color:var(--color-text-muted)]">({p.pct}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Priority chip + channel icon ─────────────────────────────────────────────

const PRIORITY_STYLES: Record<FollowupPriority, { bg: string; fg: string }> = {
  High:   { bg: "#C4CBF6", fg: "#20319C" },
  Medium: { bg: "#F2F3FD", fg: "#273DC0" },
  Low:    { bg: "#E6E9FB", fg: "#273DC0" },
};

function PriorityChip({ p }: { p: FollowupPriority }) {
  const s = PRIORITY_STYLES[p];
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: s.bg, color: s.fg }}>
      {p}
    </span>
  );
}

function ChannelIcon({ c }: { c: FollowupChannel }) {
  const size = 13;
  const props = { size, variant: "Bulk" as const, color: "currentColor" };
  if (c === "Call")     return <Call {...props} />;
  if (c === "Email")    return <Send2 {...props} />;
  if (c === "LinkedIn") return <Link2 {...props} />;
  return <Sms {...props} />;
}

// ─── Main Follow-ups Tab ──────────────────────────────────────────────────────

export function FollowupsTab() {
  const total = followupStatusDonut.reduce((a, s) => a + s.count, 0);
  const completed = followupStatusDonut.find((s) => s.label === "Completed")!.count;
  const completionRate = Math.round((completed / total) * 100);

  const channelMax = Math.max(...followupByChannel.map((c) => c.count));
  const respMax = Math.max(...responseTimeByChannel.map((r) => r.hours));

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {followupStatCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            positive={card.positive}
          />
        ))}
      </div>

      {/* Row 2: Completion ring (hero) | Trend chart | Status donut */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[3fr_4fr_3fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-gradient-to-br from-[#E6E9FB] via-white to-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Completion Rate</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-success)] shadow-[var(--shadow-card)]">
              ▲ 9 pts
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <CircularProgress value={completionRate} label="Completed" size={168} color="#273DC0" />
            <div className="grid w-full grid-cols-3 gap-2">
              {followupStatusDonut.map((s) => (
                <div key={s.label} className="rounded-[10px] bg-white px-2 py-2 text-center shadow-[var(--shadow-card)]">
                  <p className="text-[10px] text-[color:var(--color-text-muted)]">{s.label}</p>
                  <p className="mt-0.5 text-[16px] font-extrabold" style={{ color: s.color }}>{s.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Completion Trend</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Daily ▾</button>
          </div>
          <FollowupTrendChart />
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Priority Mix</h3>
          <PriorityBar />
        </div>
      </div>

      {/* Row 3: By Channel | Response Time | Status Donut */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Follow-ups by Channel</h3>
          <ul className="space-y-3">
            {followupByChannel.map((c) => (
              <li key={c.label} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-[12px] text-[color:var(--color-text-secondary)]">{c.label}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(c.count / channelMax) * 100}%`, backgroundColor: c.color }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-[12px] font-bold text-[color:var(--color-text)]">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Avg. Response Time</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">hours</span>
          </div>
          <ul className="space-y-3.5">
            {responseTimeByChannel.map((r) => (
              <li key={r.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] text-[color:var(--color-text-secondary)]">{r.label}</span>
                  <span className="text-[12px] font-bold text-[color:var(--color-text)]">
                    {r.hours}
                    <span className="ml-0.5 font-normal text-[color:var(--color-text-muted)]">h</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(r.hours / respMax) * 100}%`, backgroundColor: r.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-[12px] bg-[color:var(--color-success-light)] p-3">
            <p className="text-[11px] font-semibold text-[color:var(--color-success)]">Fastest: Phone calls at 1.2h avg</p>
            <p className="mt-0.5 text-[11px] text-[color:var(--color-text-secondary)]">Prefer calls for high-priority outreach.</p>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Status Breakdown</h3>
          <div className="flex flex-col items-center gap-4">
            <MiniDonut
              segments={followupStatusDonut.map((s) => ({ value: s.count, color: s.color }))}
              total={total}
              line1={String(total)}
              line2="Total"
              size={130}
            />
            <div className="w-full space-y-2">
              {followupStatusDonut.map((s) => (
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
      </div>

      {/* Row 4: Upcoming follow-ups list | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Upcoming Follow-ups</h3>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">Sorted by due date · overdue highlighted</p>
            </div>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="py-2 pr-3">Candidate</th>
                  <th className="px-2 py-2">Role</th>
                  <th className="px-2 py-2">Channel</th>
                  <th className="px-2 py-2">Priority</th>
                  <th className="px-2 py-2">Due</th>
                  <th className="px-2 py-2">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {upcomingFollowups.map((f) => (
                  <tr key={f.candidate}
                    className={`border-b border-[color:var(--color-border)] last:border-0 text-[12px] ${f.overdue ? "bg-[#C4CBF6]/30" : ""}`}>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: f.color }}>
                          {f.initials}
                        </div>
                        <span className="font-medium text-[color:var(--color-text)]">{f.candidate}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-[color:var(--color-text-secondary)]">{f.role}</td>
                    <td className="px-2 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[color:var(--color-text-secondary)]">
                        <ChannelIcon c={f.channel} />
                        {f.channel}
                      </span>
                    </td>
                    <td className="px-2 py-3"><PriorityChip p={f.priority} /></td>
                    <td className="px-2 py-3">
                      <span className={f.overdue ? "font-semibold text-[color:var(--color-error)]" : "text-[color:var(--color-text-secondary)]"}>
                        {f.overdue ? "⚠ " : ""}{f.due}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[color:var(--color-text-secondary)]">{f.assigned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InsightsPanel insights={followupAiInsights} />
      </div>
    </div>
  );
}
