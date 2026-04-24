"use client";

import { useState } from "react";
import {
  SolidStar,
  SparklesIcon,
  TargetIcon,
  TrophyIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import { MiniDonut } from "@/components/reports/charts";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  availabilityDistribution,
  candidateAiInsights,
  candidateGrowthData,
  candidateSpotlight,
  candidateStatCards,
  candidatesByLocation,
  candidatesByStage,
  experienceDistribution,
  recruiterPerformance,
  skillsCloud,
  sparklines,
} from "@/lib/reports-data";

// ─── Stat card icon ───────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const cls = { size: 20, style: { color } };
  const n =
    icon === "users"     ? <UsersIcon {...cls} />
    : icon === "user-plus" ? <UserPlusIcon {...cls} />
    : icon === "target"  ? <TargetIcon {...cls} />
    : icon === "trophy"  ? <TrophyIcon {...cls} />
    : icon === "star"    ? <SolidStar {...cls} />
    : <UsersIcon {...cls} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Growth chart (two series) ────────────────────────────────────────────────

const GROWTH_SERIES = [
  { key: "newCandidates"   as const, label: "New Candidates",   color: "#5B3DF5" },
  { key: "updatedProfiles" as const, label: "Updated Profiles", color: "#22C55E" },
];

function GrowthChart() {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const VW = 540, VH = 195;
  const P = { l: 40, r: 10, t: 14, b: 28 };
  const pw = VW - P.l - P.r, ph = VH - P.t - P.b;
  const yMax = 15, yTicks = [0, 3, 6, 9, 12, 15];
  const n = candidateGrowthData.labels.length;

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
        {GROWTH_SERIES.map((s) => (
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
          <p className="mb-2 text-[11px] font-semibold text-[color:var(--color-text)]">{candidateGrowthData.labels[hovIdx]}, 2024</p>
          {GROWTH_SERIES.map((s) => (
            <div key={s.key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] text-[color:var(--color-text-secondary)]">{s.label}</span>
              </div>
              <span className="text-[10px] font-bold text-[color:var(--color-text)]">{candidateGrowthData[s.key][hovIdx]}</span>
            </div>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ height: "195px" }}
        onMouseMove={handleMove} onMouseLeave={() => setHovIdx(null)}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={P.l} y1={gy(t)} x2={P.l + pw} y2={gy(t)} style={{ stroke: "var(--color-border)" }} strokeWidth={0.8} />
            <text x={P.l - 6} y={gy(t)} textAnchor="end" dominantBaseline="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{t}</text>
          </g>
        ))}
        {candidateGrowthData.labels.map((lbl, i) => (
          <text key={i} x={gx(i)} y={VH - 6} textAnchor="middle" fontSize={9} style={{ fill: "var(--color-text-muted)" }}>{lbl}</text>
        ))}
        {hovIdx !== null && (
          <line x1={gx(hovIdx)} y1={P.t} x2={gx(hovIdx)} y2={P.t + ph} style={{ stroke: "var(--color-border-strong)" }} strokeWidth={1} strokeDasharray="4 2" />
        )}
        {GROWTH_SERIES.map((s) => (
          <path key={s.key} d={bezier(candidateGrowthData[s.key])} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" />
        ))}
        {GROWTH_SERIES.map((s) =>
          candidateGrowthData[s.key].map((v, i) => (
            <circle key={`${s.key}-${i}`} cx={gx(i)} cy={gy(v)} r={hovIdx === i ? 4 : 2.5}
              fill={hovIdx === i ? s.color : "white"} stroke={s.color} strokeWidth={1.5} />
          ))
        )}
      </svg>
    </div>
  );
}

// ─── Experience Distribution (vertical bars) ──────────────────────────────────

function ExperienceChart() {
  const max = Math.max(...experienceDistribution.map((e) => e.count));
  const chartH = 120;
  return (
    <div>
      <div className="flex items-end gap-3 rounded-[12px] bg-[color:var(--color-surface-2)]/40 px-3 pt-4" style={{ height: chartH + 28 }}>
        {experienceDistribution.map((e) => {
          const h = (e.count / max) * chartH;
          return (
            <div key={e.bucket} className="group flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] font-semibold text-[color:var(--color-text)] opacity-0 transition-opacity group-hover:opacity-100">{e.count}</span>
              <div className="w-full rounded-t-[8px] transition-all duration-500" style={{ height: Math.max(h, 6), backgroundColor: e.color }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3 px-3">
        {experienceDistribution.map((e) => (
          <div key={e.bucket} className="flex-1 text-center">
            <p className="truncate text-[10px] text-[color:var(--color-text-muted)]">{e.bucket}</p>
            <p className="text-[11px] font-bold text-[color:var(--color-text)]">{e.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skills Cloud (tag cloud with varying sizes + colors) ─────────────────────

function SkillsCloud() {
  const shaded = [...skillsCloud]
    .sort((a, b) => b.size - a.size)
    .map((s) => {
      const hue = s.size > 0.85 ? "#4B32D4" : s.size > 0.65 ? "#5B3DF5" : s.size > 0.5 ? "#7C3AED" : s.size > 0.4 ? "#8B5CF6" : "#A78BFA";
      return { ...s, hue };
    });
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {shaded.map((s) => {
        const fontSize = 11 + s.size * 11;
        const padY = s.size > 0.7 ? 6 : 4;
        const padX = s.size > 0.7 ? 12 : 9;
        return (
          <span
            key={s.skill}
            className="inline-flex cursor-default items-center gap-1 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            style={{
              fontSize: `${fontSize}px`,
              padding: `${padY}px ${padX}px`,
              backgroundColor: `${s.hue}14`,
              color: s.hue,
              border: `1px solid ${s.hue}2E`,
              lineHeight: 1,
            }}
          >
            {s.skill}
            <span className="rounded-full bg-white/70 px-1 text-[10px] font-bold">{s.count}</span>
          </span>
        );
      })}
    </div>
  );
}

// ─── Main Candidates Tab ──────────────────────────────────────────────────────

export function CandidatesTab() {
  const locMax = Math.max(...candidatesByLocation.map((l) => l.count));
  const totalStage = candidatesByStage.reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-5">
      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {candidateStatCards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            spark={{ values: sparklines.candidates[i], color: card.iconColor }}
          />
        ))}
      </div>

      {/* Row 2: Candidate Spotlight | Growth chart */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[5fr_6fr]">
        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] shadow-[var(--shadow-card)]">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #0F172A 0%, #4338CA 50%, #7C3AED 100%)" }}
          />
          <div
            className="absolute -right-20 -top-16 h-60 w-60 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 60%)" }}
          />
          <div className="relative p-5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                <SparklesIcon size={12} /> Candidate Spotlight
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-80">Match score</span>
                <span className="rounded-full bg-[#FDE68A] px-2 py-0.5 text-[11px] font-extrabold text-[#78350F]">
                  {candidateSpotlight.matchScore}%
                </span>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-[18px] font-extrabold backdrop-blur">
                {candidateSpotlight.initials}
              </div>
              <div className="min-w-0">
                <p className="text-[18px] font-extrabold leading-tight">{candidateSpotlight.name}</p>
                <p className="text-[12px] opacity-80">{candidateSpotlight.role}</p>
                <p className="mt-0.5 text-[11px] opacity-70">
                  {candidateSpotlight.location} · {candidateSpotlight.experience} · {candidateSpotlight.rate}
                </p>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {candidateSpotlight.skills.map((sk) => (
                <span key={sk} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">{sk}</span>
              ))}
            </div>

            <ul className="space-y-1.5">
              {candidateSpotlight.highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-2 rounded-[10px] bg-white/10 px-2.5 py-1.5 backdrop-blur">
                  <span className="text-[13px]">{h.icon}</span>
                  <span className="text-[12px]">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Candidate Growth</h3>
            <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">Daily ▾</button>
          </div>
          <GrowthChart />
        </div>
      </div>

      {/* Row 3: Stage donut | Skills cloud | Experience */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Candidates by Stage</h3>
          <div className="flex flex-col items-center gap-3">
            <MiniDonut
              segments={candidatesByStage.map((s) => ({ value: s.count, color: s.color }))}
              total={totalStage} line1={String(totalStage)} line2="Total" size={120}
            />
            <div className="w-full space-y-1.5">
              {candidatesByStage.map((s) => (
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
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Skills in Pool</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">size = # of candidates</span>
          </div>
          <div className="flex min-h-[220px] items-center">
            <SkillsCloud />
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Experience Distribution</h3>
          <ExperienceChart />
        </div>
      </div>

      {/* Row 4: Location | Availability | Recruiter leaderboard */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Candidates by Location</h3>
          <ul className="space-y-3">
            {candidatesByLocation.map((l) => (
              <li key={l.label} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-[12px] text-[color:var(--color-text-secondary)]">{l.label}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(l.count / locMax) * 100}%`, backgroundColor: l.color }} />
                </div>
                <span className="w-20 shrink-0 text-right text-[12px] font-semibold text-[color:var(--color-text)]">
                  {l.count}{" "}
                  <span className="font-normal text-[color:var(--color-text-muted)]">({l.pct}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Availability</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={availabilityDistribution.map((s) => ({ value: s.count, color: s.color }))}
                total={availabilityDistribution.reduce((a, s) => a + s.count, 0)}
                line1="126" line2="Total" size={120}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2.5">
              {availabilityDistribution.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[11px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[color:var(--color-text)]">
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
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Top Recruiters</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">by placements</span>
          </div>
          <ul className="space-y-2.5">
            {recruiterPerformance.slice(0, 5).map((r, i) => (
              <li key={r.name} className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[13px]">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[10px] font-bold text-[color:var(--color-text-secondary)]">{i + 1}</span>
                  )}
                </span>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: r.color }}>
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-[color:var(--color-text)]">{r.name}</p>
                  <p className="text-[10px] text-[color:var(--color-text-muted)]">{r.candidates} candidates · {r.conversion}% conv</p>
                </div>
                <span className="shrink-0 text-[14px] font-extrabold text-[color:var(--color-text)]">{r.placements}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 5: Recruiter Performance table | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Recruiter Performance</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="py-2 pr-3">Recruiter</th>
                  <th className="px-2 py-2 text-right">Candidates</th>
                  <th className="px-2 py-2 text-right">Submissions</th>
                  <th className="px-2 py-2 text-right">Interviews</th>
                  <th className="px-2 py-2 text-right">Placements</th>
                  <th className="px-2 py-2 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {recruiterPerformance.map((r) => (
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
                    <td className="px-2 py-3 text-right font-semibold text-[color:var(--color-text)]">{r.placements}</td>
                    <td className="px-2 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--color-success-light)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
                        {r.conversion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InsightsPanel insights={candidateAiInsights} />
      </div>
    </div>
  );
}
