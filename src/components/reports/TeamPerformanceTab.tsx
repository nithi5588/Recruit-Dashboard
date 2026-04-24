"use client";

import { useState } from "react";
import {
  SolidStar,
  StarIcon,
  TargetIcon,
  TrendUpIcon,
  TrophyIcon,
  UsersIcon,
  WrenchIcon,
} from "@/components/icons/AppIcons";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  recruiterActivityMix,
  recruiterGoals,
  teamAiInsights,
  teamLeaderboard,
  teamMatrix,
  teamStatCards,
  teamTrend,
  topRecruiter,
} from "@/lib/reports-data";

// ─── Stat icon mapping ────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const cls = { size: 20, style: { color } };
  const n =
    icon === "team"   ? <UsersIcon {...cls} />
    : icon === "trophy" ? <TrophyIcon {...cls} />
    : icon === "target" ? <TargetIcon {...cls} />
    : icon === "bolt"   ? <WrenchIcon {...cls} />
    : icon === "star"   ? <SolidStar {...cls} />
    : <UsersIcon {...cls} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Team trend line chart (placements vs offers) ─────────────────────────────

const TEAM_SERIES = [
  { key: "offers"     as const, label: "Offers",     color: "#5B3DF5" },
  { key: "placements" as const, label: "Placements", color: "#22C55E" },
];

function TeamTrendChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 180;
  const P = { l: 36, r: 10, t: 14, b: 26 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 6, yTicks = [0, 2, 4, 6];
  const n = teamTrend.labels.length;

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
        {TEAM_SERIES.map((s) => (
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
          <p className="mb-2 text-[11px] font-semibold text-[color:var(--color-text)]">{teamTrend.labels[hovIdx]}, 2024</p>
          {TEAM_SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[color:var(--color-text-secondary)]">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--color-text)]">{teamTrend[s.key][hovIdx]}</span>
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
        {teamTrend.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph}
            style={{ stroke: "var(--color-border-strong)" }} strokeWidth={1} strokeDasharray="4 2" />
        )}
        {TEAM_SERIES.map((s) => (
          <path key={s.key} d={path(teamTrend[s.key])} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" />
        ))}
        {TEAM_SERIES.map((s) =>
          teamTrend[s.key].map((v, i) => (
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

// ─── Leaderboard rank badge ───────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-[16px]">🥇</span>;
  if (rank === 2) return <span className="text-[16px]">🥈</span>;
  if (rank === 3) return <span className="text-[16px]">🥉</span>;
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[11px] font-bold text-[color:var(--color-text-secondary)]">
      {rank}
    </span>
  );
}

function RankTrend({ trend }: { trend: number }) {
  if (trend > 0) return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[color:var(--color-success)]">
      <TrendUpIcon size={10} /> {trend}
    </span>
  );
  if (trend < 0) return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[color:var(--color-error)]">
      <TrendUpIcon size={10} style={{ transform: "rotate(180deg)" }} /> {Math.abs(trend)}
    </span>
  );
  return <span className="text-[10px] font-semibold text-[color:var(--color-text-muted)]">–</span>;
}

// ─── Trend arrow for table ────────────────────────────────────────────────────

function TrendArrow({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")   return <TrendUpIcon size={12} className="text-[color:var(--color-success)]" />;
  if (trend === "down") return <TrendUpIcon size={12} className="text-[color:var(--color-error)]" style={{ transform: "rotate(180deg)" }} />;
  return <span className="text-[color:var(--color-text-muted)]">–</span>;
}

// ─── Main Team Performance Tab ────────────────────────────────────────────────

export function TeamPerformanceTab() {
  const activityMax = Math.max(...recruiterActivityMix.map((r) => r.calls + r.emails + r.meetings));

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {teamStatCards.map((card) => (
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

      {/* Row 2: Spotlight (hero) | Leaderboard */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[4fr_5fr]">
        {/* Top Recruiter Spotlight */}
        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] shadow-[var(--shadow-card)]">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #5B3DF5 0%, #8B5CF6 55%, #C4B5FD 100%)",
            }}
          />
          <div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #FDE68A 0%, transparent 60%)" }}
          />
          <div className="relative p-5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                <TrophyIcon size={12} /> Top Performer
              </span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">This Period</span>
            </div>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-[18px] font-extrabold backdrop-blur"
              >
                {topRecruiter.initials}
              </div>
              <div className="min-w-0">
                <p className="text-[18px] font-extrabold">{topRecruiter.name}</p>
                <p className="text-[12px] opacity-80">{topRecruiter.role} · {topRecruiter.tenure}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Placements</p>
                <p className="text-[18px] font-extrabold leading-none">{topRecruiter.placements}</p>
              </div>
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Conversion</p>
                <p className="text-[18px] font-extrabold leading-none">{topRecruiter.conversion}%</p>
              </div>
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Activities</p>
                <p className="text-[18px] font-extrabold leading-none">{topRecruiter.activities}</p>
              </div>
              <div className="rounded-[12px] bg-white/15 p-2.5 backdrop-blur">
                <p className="text-[10px] opacity-80">Rating</p>
                <p className="flex items-center gap-1 text-[18px] font-extrabold leading-none">
                  {topRecruiter.rating}
                  <StarIcon size={12} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Leaderboard</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Score ▾</button>
          </div>
          <ul className="space-y-2">
            {teamLeaderboard.map((r) => (
              <li
                key={r.rank}
                className={`flex items-center gap-3 rounded-[12px] p-2.5 ${r.rank <= 3 ? "bg-[color:var(--color-surface-2)]" : ""}`}
              >
                <div className="flex w-6 shrink-0 items-center justify-center">
                  <RankBadge rank={r.rank} />
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: r.color }}>
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">{r.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: r.color }} />
                    </div>
                    <span className="text-[10px] font-semibold text-[color:var(--color-text-secondary)]">{r.score}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-[12px] font-bold text-[color:var(--color-text)]">{r.placements}</span>
                  <RankTrend trend={r.trend} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 3: Team trend | Goals progress | Activity mix */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Team Outcomes</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Daily ▾</button>
          </div>
          <TeamTrendChart />
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Goal Progress</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">Submissions · target vs actual</span>
          </div>
          <ul className="space-y-4">
            {recruiterGoals.map((g) => {
              const pct = Math.round((g.actual / g.target) * 100);
              const complete = pct >= 100;
              return (
                <li key={g.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: g.color }}>
                        {g.initials}
                      </div>
                      <span className="text-[12px] font-medium text-[color:var(--color-text)]">{g.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[color:var(--color-text)]">
                      {g.actual}/{g.target}{" "}
                      <span className={`ml-1 font-semibold ${complete ? "text-[color:var(--color-success)]" : "text-[color:var(--color-text-muted)]"}`}>
                        {pct}%
                      </span>
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Activity Mix</h3>
            <div className="flex items-center gap-3 text-[10px] text-[color:var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#5B3DF5]" /> Calls</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#3B82F6]" /> Emails</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Meetings</span>
            </div>
          </div>
          <ul className="space-y-3">
            {recruiterActivityMix.map((r) => {
              const total = r.calls + r.emails + r.meetings;
              const w = (total / activityMax) * 100;
              return (
                <li key={r.name}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="truncate font-medium text-[color:var(--color-text)]">{r.name}</span>
                    <span className="shrink-0 font-bold text-[color:var(--color-text)]">{total}</span>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]" style={{ width: `${w}%` }}>
                    <div style={{ width: `${(r.calls / total) * 100}%`, backgroundColor: "#5B3DF5" }} />
                    <div style={{ width: `${(r.emails / total) * 100}%`, backgroundColor: "#3B82F6" }} />
                    <div style={{ width: `${(r.meetings / total) * 100}%`, backgroundColor: "#22C55E" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Row 4: Team matrix table | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Team Performance Matrix</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="py-2 pr-3">Recruiter</th>
                  <th className="px-2 py-2 text-right">Candidates</th>
                  <th className="px-2 py-2 text-right">Submissions</th>
                  <th className="px-2 py-2 text-right">Interviews</th>
                  <th className="px-2 py-2 text-right">Offers</th>
                  <th className="px-2 py-2 text-right">Placements</th>
                  <th className="px-2 py-2 text-right">Conversion</th>
                  <th className="px-2 py-2 text-right">Rating</th>
                  <th className="px-2 py-2 text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {teamMatrix.map((r) => (
                  <tr key={r.name} className="border-b border-[color:var(--color-border)] last:border-0 text-[12px]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: r.color }}>
                          {r.initials}
                        </div>
                        <span className="font-medium text-[color:var(--color-text)]">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{r.candidates}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{r.submissions}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{r.interviews}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{r.offers}</td>
                    <td className="px-2 py-3 text-right font-semibold text-[color:var(--color-text)]">{r.placements}</td>
                    <td className="px-2 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--color-success-light)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
                        {r.conversion}%
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[color:var(--color-warning)]">
                        <SolidStar size={11} />
                        <span className="font-semibold text-[color:var(--color-text)]">{r.rating}</span>
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center"><TrendArrow trend={r.trend} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InsightsPanel insights={teamAiInsights} />
      </div>
    </div>
  );
}
