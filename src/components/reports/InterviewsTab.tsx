"use client";

import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  SolidStar,
  TrophyIcon,
  VideoIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { CircularProgress, MiniDonut } from "@/components/reports/charts";
import { InsightsPanel, StatCard, StatIconWrap } from "@/components/reports/shared";
import {
  avgTimePerStage,
  interviewAiInsights,
  interviewByJobRows,
  interviewOutcomes,
  interviewPassRate,
  interviewStatCards,
  interviewsByRound,
  scheduleHourRange,
  sparklines,
  todaySchedule,
  topInterviewers,
  upcomingInterviews,
} from "@/lib/reports-data";

// ─── Stat card icon ───────────────────────────────────────────────────────────

function StatIcon({ icon, color, bg }: { icon: string; color: string; bg: string }) {
  const cls = { size: 20, style: { color } };
  const n =
    icon === "calendar" ? <CalendarIcon {...cls} />
    : icon === "clock"    ? <ClockIcon {...cls} />
    : icon === "check"    ? <CheckIcon {...cls} />
    : icon === "x"        ? <XIcon {...cls} />
    : icon === "trophy"   ? <TrophyIcon {...cls} />
    : <CalendarIcon {...cls} />;
  return <StatIconWrap bg={bg}>{n}</StatIconWrap>;
}

// ─── Today's Schedule timeline ────────────────────────────────────────────────

const STAGE_STYLES: Record<string, { bg: string; fg: string; border: string }> = {
  Screening:  { bg: "#EEE9FF", fg: "#5B3DF5", border: "#D8D0FF" },
  Technical:  { bg: "#EAF2FF", fg: "#2563EB", border: "#BFDBFE" },
  HR:         { bg: "#EAFBF1", fg: "#16A34A", border: "#BBF7D0" },
  Managerial: { bg: "#FFF4DB", fg: "#B45309", border: "#FDE68A" },
  Final:      { bg: "#FDECEC", fg: "#DC2626", border: "#FECACA" },
};

function formatTime(hour: number) {
  const h24 = Math.floor(hour);
  const mins = Math.round((hour % 1) * 60);
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(mins).padStart(2, "0")} ${ampm}`;
}

function packRows(slots: typeof todaySchedule) {
  const sorted = [...slots].sort((a, b) => a.hourStart - b.hourStart);
  const rowEnds: number[] = []; // tracks the end-hour of last slot per row
  const rowOf = new Map<string, number>();
  for (const s of sorted) {
    const end = s.hourStart + s.duration / 60;
    let assigned = -1;
    for (let r = 0; r < rowEnds.length; r++) {
      if (s.hourStart >= rowEnds[r] - 0.001) {
        assigned = r;
        rowEnds[r] = end;
        break;
      }
    }
    if (assigned === -1) {
      rowEnds.push(end);
      assigned = rowEnds.length - 1;
    }
    rowOf.set(s.id, assigned);
  }
  return { rowOf, rowCount: rowEnds.length };
}

function TodaySchedule() {
  const { start, end } = scheduleHourRange;
  const span = end - start;
  const pctFor = (hour: number) => ((hour - start) / span) * 100;
  const hours: number[] = [];
  for (let h = start; h <= end; h++) hours.push(h);
  const nowHour = 11.5; // visual "now" marker

  const { rowOf, rowCount } = packRows(todaySchedule);
  const BLOCK_H = 56;
  const ROW_GAP = 8;
  const TOP_PAD = 10;
  const contentH = rowCount * BLOCK_H + (rowCount - 1) * ROW_GAP + TOP_PAD * 2;

  return (
    <div>
      {/* Scroll container so narrow screens get horizontal pan */}
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* Hour rail — aligned with grid below */}
          <div className="relative mb-1.5 h-4">
            {hours.map((h) => (
              <span
                key={h}
                className="absolute top-0 -translate-x-1/2 text-[9px] font-medium text-[color:var(--color-text-muted)]"
                style={{ left: `${pctFor(h)}%` }}
              >
                {h === 12 ? "12p" : h > 12 ? `${h - 12}p` : `${h}a`}
              </span>
            ))}
          </div>

          <div
            className="relative rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40"
            style={{ height: contentH }}
          >
            {/* Vertical grid lines */}
            {hours.map((h, i) => (
              <div
                key={h}
                className={`absolute top-0 bottom-0 ${i === 0 || i === hours.length - 1 ? "border-l border-[color:var(--color-border)]" : "border-l border-dashed border-[color:var(--color-border)]"}`}
                style={{ left: `${pctFor(h)}%` }}
              />
            ))}

            {/* "Now" marker */}
            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${pctFor(nowHour)}%` }}>
              <div className="h-full w-[2px] bg-[color:var(--color-brand-500)]" />
              <span className="absolute top-1.5 -translate-x-1/2 rounded-full bg-[color:var(--color-brand-500)] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-[var(--shadow-card)]">
                Now
              </span>
              <span className="absolute bottom-0 left-[-3px] h-2 w-2 rounded-full bg-[color:var(--color-brand-500)]" />
            </div>

            {/* Interview blocks */}
            {todaySchedule.map((slot) => {
              const row = rowOf.get(slot.id) ?? 0;
              const left = pctFor(slot.hourStart);
              const width = Math.max((slot.duration / 60 / span) * 100, 10);
              const s = STAGE_STYLES[slot.stage];
              return (
                <div
                  key={slot.id}
                  className="absolute rounded-[10px] border shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-panel)]"
                  style={{
                    left: `calc(${left}% + 2px)`,
                    width: `calc(${width}% - 4px)`,
                    top: TOP_PAD + row * (BLOCK_H + ROW_GAP),
                    height: BLOCK_H,
                    backgroundColor: s.bg,
                    borderColor: s.border,
                  }}
                  title={`${slot.candidate.name} · ${slot.role} · ${slot.stage} · ${slot.duration}m`}
                >
                  <div className="flex h-full flex-col justify-center gap-0.5 overflow-hidden px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                        style={{ backgroundColor: slot.candidate.color }}
                      >
                        {slot.candidate.initials}
                      </div>
                      <span className="truncate text-[11px] font-bold" style={{ color: s.fg }}>
                        {slot.candidate.name}
                      </span>
                    </div>
                    <p className="truncate text-[10px] font-medium" style={{ color: s.fg, opacity: 0.85 }}>
                      {slot.stage} · {formatTime(slot.hourStart)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-[color:var(--color-text-muted)]">
        <span className="font-semibold text-[color:var(--color-text-secondary)]">Stages:</span>
        {(Object.keys(STAGE_STYLES) as Array<keyof typeof STAGE_STYLES>).map((k) => (
          <span key={k} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STAGE_STYLES[k].fg }} />
            {k}
          </span>
        ))}
        <span className="ml-auto font-medium text-[color:var(--color-text)]">{todaySchedule.length} interviews today</span>
      </div>
    </div>
  );
}

// ─── Main Interviews Tab ──────────────────────────────────────────────────────

export function InterviewsTab() {
  const stageMax = Math.max(...avgTimePerStage.map((s) => s.days));
  const outcomeTotal = interviewOutcomes.reduce((a, s) => a + s.count, 0);
  const roundTotal = interviewsByRound.reduce((a, s) => a + s.count, 0);

  return (
    <div className="space-y-5">
      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {interviewStatCards.map((card, i) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={card.value}
            icon={<StatIcon icon={card.icon} color={card.iconColor} bg={card.iconBg} />}
            change={card.change}
            positive={card.positive}
            spark={{ values: sparklines.interviews[i], color: card.iconColor }}
          />
        ))}
      </div>

      {/* Row 2: Today's Schedule | Pass Rate ring */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_4fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Today&rsquo;s Schedule</h3>
              <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">May 18, 2024 · 9:00 AM – 6:00 PM</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="flex items-center gap-1 rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[11px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">
                <VideoIcon size={12} /> Join Next
              </button>
              <button type="button" className="rounded-[8px] border border-[color:var(--color-border)] px-3 py-1 text-[11px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]">
                Full calendar ▾
              </button>
            </div>
          </div>
          <TodaySchedule />
        </div>

        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] shadow-[var(--shadow-card)]">
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #0F766E 0%, #22C55E 50%, #86EFAC 100%)" }}
          />
          <div
            className="absolute -right-14 -top-14 h-48 w-48 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, #FDE68A 0%, transparent 60%)" }}
          />
          <div className="relative flex h-full flex-col p-5 text-white">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                <TrophyIcon size={12} /> Pass Rate
              </span>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium backdrop-blur">▲ {interviewPassRate.delta} pts</span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center">
              <div className="relative">
                <CircularProgress
                  value={interviewPassRate.value}
                  size={172}
                  color="#FFFFFF"
                  trackColor="rgba(255,255,255,0.2)"
                  stroke={14}
                  showLabel={false}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[34px] font-extrabold leading-none text-white">{interviewPassRate.value}%</p>
                    <p className="mt-1 text-[10px] text-white/80">Passed this period</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-2">
                <div className="rounded-[10px] bg-white/15 p-2 text-center backdrop-blur">
                  <p className="text-[9px] opacity-80">Passed</p>
                  <p className="text-[16px] font-extrabold">{interviewPassRate.passed}</p>
                </div>
                <div className="rounded-[10px] bg-white/15 p-2 text-center backdrop-blur">
                  <p className="text-[9px] opacity-80">Total</p>
                  <p className="text-[16px] font-extrabold">{interviewPassRate.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: By Round | Outcomes | Top Interviewers */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Interviews by Round</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={interviewsByRound.map((s) => ({ value: s.count, color: s.color }))}
                total={roundTotal} line1={String(roundTotal)} line2="Total" size={120}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {interviewsByRound.map((s) => (
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
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Interview Outcomes</h3>
          <div className="flex items-center gap-4">
            <div className="shrink-0">
              <MiniDonut
                segments={interviewOutcomes.map((s) => ({ value: s.count, color: s.color }))}
                total={outcomeTotal} line1={String(outcomeTotal)} line2="Total" size={130}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              {interviewOutcomes.map((s) => (
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
          <h3 className="mb-4 text-[14px] font-semibold text-[color:var(--color-text)]">Top Interviewers</h3>
          <ul className="space-y-3">
            {topInterviewers.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: p.color }}>
                    {p.initials}
                  </div>
                  <span className="truncate text-[12px] font-medium text-[color:var(--color-text)]">{p.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="text-[12px] font-bold text-[color:var(--color-text)]">
                    {p.interviews}
                    <span className="ml-1 font-normal text-[color:var(--color-text-muted)]">ints</span>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-warning)]">
                    <SolidStar size={12} />
                    {p.rating.toFixed(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 4: Avg Time per Stage | Upcoming Interviews */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Avg. Time per Stage</h3>
            <span className="text-[10px] text-[color:var(--color-text-muted)]">days between transitions</span>
          </div>
          <ul className="space-y-3">
            {avgTimePerStage.map((s) => (
              <li key={s.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] text-[color:var(--color-text-secondary)]">{s.label}</span>
                  <span className="text-[12px] font-bold text-[color:var(--color-text)]">
                    {s.days}<span className="ml-0.5 font-normal text-[color:var(--color-text-muted)]">days</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(s.days / stageMax) * 100}%`, backgroundColor: s.color }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Upcoming Interviews</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">Calendar</button>
          </div>
          <ul className="space-y-2.5">
            {upcomingInterviews.map((u) => (
              <li key={u.name} className="flex items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: u.color }}>
                  {u.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">{u.name}</p>
                  <p className="truncate text-[11px] text-[color:var(--color-text-muted)]">{u.role} · {u.stage}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-[color:var(--color-text-secondary)]">{u.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Row 5: Performance by Job table | AI Insights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[color:var(--color-text)]">Interview Performance by Job</h3>
            <button type="button" className="text-[12px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]">View all jobs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="py-2 pr-3">Job Title</th>
                  <th className="px-2 py-2 text-right">Scheduled</th>
                  <th className="px-2 py-2 text-right">Completed</th>
                  <th className="px-2 py-2 text-right">Passed</th>
                  <th className="px-2 py-2 text-right">Offers</th>
                  <th className="px-2 py-2 text-right">Offer Rate</th>
                </tr>
              </thead>
              <tbody>
                {interviewByJobRows.map((row) => (
                  <tr key={row.title} className="border-b border-[color:var(--color-border)] last:border-0 text-[12px]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]">{row.icon}</span>
                        <span className="font-medium text-[color:var(--color-text)]">{row.title}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{row.scheduled}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{row.completed}</td>
                    <td className="px-2 py-3 text-right text-[color:var(--color-text-secondary)]">{row.passed}</td>
                    <td className="px-2 py-3 text-right font-semibold text-[color:var(--color-text)]">{row.offers}</td>
                    <td className="px-2 py-3 text-right">
                      <span className="inline-flex items-center rounded-full bg-[color:var(--color-success-light)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-success)]">
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <InsightsPanel insights={interviewAiInsights} />
      </div>
    </div>
  );
}
