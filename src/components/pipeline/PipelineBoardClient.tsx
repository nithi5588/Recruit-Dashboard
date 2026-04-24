"use client";

import { useMemo, useState } from "react";
import {
  ChevronRight,
  ClockIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  SortIcon,
  TargetIcon,
  TrendUpIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import {
  PIPELINE_STAGES,
  pipelineCards,
  pipelineOwners,
  type PipelineCard,
  type PipelinePriority,
  type PipelineStage,
  type PipelineStageId,
} from "@/lib/pipeline-data";

// ─── Priority chip ────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<PipelinePriority, { bg: string; fg: string; dot: string }> = {
  High:   { bg: "#FDECEC", fg: "#DC2626", dot: "#EF4444" },
  Medium: { bg: "#FFF4DB", fg: "#B45309", dot: "#F59E0B" },
  Low:    { bg: "#EAFBF1", fg: "#16A34A", dot: "#22C55E" },
};

function PriorityChip({ p }: { p: PipelinePriority }) {
  const s = PRIORITY_STYLES[p];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {p}
    </span>
  );
}

// ─── Score mini-bar ───────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-12 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-bold text-[color:var(--color-text)]">{value}</span>
    </div>
  );
}

// ─── Candidate card ───────────────────────────────────────────────────────────

function CandidateCard({ card, stage }: { card: PipelineCard; stage: PipelineStage }) {
  return (
    <article
      className="group relative cursor-grab rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[0_1px_2px_rgba(23,26,43,0.04)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:shadow-[var(--shadow-card)] active:cursor-grabbing"
    >
      {/* Left color accent */}
      <span
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-[3px]"
        style={{ background: stage.color }}
      />

      {/* Header row */}
      <div className="mb-2 flex items-start gap-2.5 pl-1.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: card.avatarColor }}
        >
          {card.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
            {card.name}
          </p>
          <p className="truncate text-[11px] text-[color:var(--color-text-secondary)]">
            {card.role}
          </p>
        </div>
        <button
          type="button"
          aria-label="Card actions"
          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-[color:var(--color-text)]"
        >
          <MoreIcon size={14} />
        </button>
      </div>

      {/* Meta row — priority + score */}
      <div className="mb-2 flex items-center justify-between gap-2 pl-1.5">
        <PriorityChip p={card.priority} />
        <ScoreBar value={card.score} color={stage.color} />
      </div>

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 pl-1.5">
          {card.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-md bg-[color:var(--color-surface-2)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--color-text-secondary)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Next step banner */}
      <div
        className="mb-2 rounded-[8px] px-2 py-1.5 pl-3"
        style={{ background: `${stage.color}0F`, borderLeft: `2px solid ${stage.color}` }}
      >
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: stage.color }}>
          Next step
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-[color:var(--color-text)]">
          {card.nextStep}
        </p>
      </div>

      {/* Footer — owner + time */}
      <div className="flex items-center justify-between gap-2 pl-1.5 text-[10px] text-[color:var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
            style={{ background: card.owner.color }}
            title={`Owner: ${card.owner.name}`}
          >
            {card.owner.initials}
          </span>
          <span className="text-[10px] font-medium text-[color:var(--color-text-secondary)]">
            {card.owner.name.split(" ")[0]}
          </span>
        </div>
        <span className="inline-flex items-center gap-1">
          <ClockIcon size={10} />
          {card.ageInStage} in stage
        </span>
      </div>
    </article>
  );
}

// ─── Column header ────────────────────────────────────────────────────────────

function ColumnHeader({ stage, count }: { stage: PipelineStage; count: number }) {
  return (
    <div className="mb-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: stage.color }}
          />
          <span className="truncate text-[12px] font-bold text-[color:var(--color-text)]">
            {stage.label}
          </span>
          <span
            className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums"
            style={{ background: stage.soft, color: stage.color }}
          >
            {count}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={`Add candidate to ${stage.label}`}
            className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-brand-500)]"
          >
            <PlusIcon size={13} />
          </button>
          <button
            type="button"
            aria-label={`${stage.label} options`}
            className="flex h-6 w-6 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <MoreIcon size={13} />
          </button>
        </div>
      </div>
      <p className="mt-1 truncate text-[10px] text-[color:var(--color-text-muted)]">
        {stage.description}
      </p>
    </div>
  );
}

// ─── Stage summary pill (top metric row) ──────────────────────────────────────

function StageMetric({
  stage,
  count,
  active,
  onClick,
}: {
  stage: PipelineStage;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-2 text-left transition-all ${
        active
          ? "border-transparent bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-2)]"
      }`}
      style={active ? { boxShadow: `0 0 0 1.5px ${stage.color}, var(--shadow-card)` } : undefined}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: stage.color }} />
      <span className={`text-[12px] font-semibold ${active ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)]"}`}>
        {stage.label}
      </span>
      <span
        className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums"
        style={{ background: stage.soft, color: stage.color }}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Empty column placeholder ─────────────────────────────────────────────────

function EmptyColumn() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-4 py-8 text-center">
      <UsersIcon size={20} className="text-[color:var(--color-text-muted)]" />
      <p className="mt-2 text-[11px] font-semibold text-[color:var(--color-text-secondary)]">No candidates yet</p>
      <p className="mt-0.5 text-[10px] text-[color:var(--color-text-muted)]">Drag a card here or add one</p>
    </div>
  );
}

// ─── Main Pipeline Board ──────────────────────────────────────────────────────

export function PipelineBoardClient() {
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState<PipelineStageId | "all">("all");
  const [view, setView] = useState<"board" | "list">("board");

  // Group cards by stage
  const grouped = useMemo(() => {
    const by: Record<PipelineStageId, PipelineCard[]> = {
      new: [], shortlisted: [], submitted: [], interview: [], offered: [], placed: [], rejected: [],
    };
    const q = query.trim().toLowerCase();
    for (const c of pipelineCards) {
      if (q && !`${c.name} ${c.role} ${c.tags.join(" ")}`.toLowerCase().includes(q)) continue;
      by[c.stage].push(c);
    }
    return by;
  }, [query]);

  const totalCount = pipelineCards.length;
  const visibleStages = focus === "all"
    ? PIPELINE_STAGES
    : PIPELINE_STAGES.filter((s) => s.id === focus);

  // Metrics
  const activeCount = pipelineCards.filter(
    (c) => c.stage !== "placed" && c.stage !== "rejected",
  ).length;
  const highPriorityCount = pipelineCards.filter((c) => c.priority === "High").length;
  const placedCount = pipelineCards.filter((c) => c.stage === "placed").length;
  const conversionPct = totalCount === 0 ? 0 : Math.round((placedCount / totalCount) * 100);

  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
              Pipeline
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-600)]">
              <SparklesIcon size={10} /> Live
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Move candidates through stages — from new profile to placement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex h-9 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-0.5 shadow-[var(--shadow-card)]">
            <button
              type="button"
              aria-pressed={view === "board"}
              onClick={() => setView("board")}
              className={`flex h-full items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold transition-colors ${
                view === "board"
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <GridViewIcon size={13} /> Board
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`flex h-full items-center gap-1.5 rounded-[8px] px-2.5 text-[12px] font-semibold transition-colors ${
                view === "list"
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <ListViewIcon size={13} /> List
            </button>
          </div>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <SortIcon size={13} />
            <span className="hidden sm:inline">Sort</span>
          </button>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <FilterIcon size={13} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Top metric summary row */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EEE9FF" }}>
              <UsersIcon size={16} style={{ color: "#5B3DF5" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Total in Pipeline</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{totalCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 12%
            <span className="font-normal text-[color:var(--color-text-muted)]">vs last week</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EAF2FF" }}>
              <TargetIcon size={16} style={{ color: "#3B82F6" }} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Active Candidates</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{activeCount}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-info)]">
            <span className="font-normal text-[color:var(--color-text-muted)]">In motion right now</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#FDECEC" }}>
              <span aria-hidden className="text-[15px]">🔥</span>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">High Priority</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{highPriorityCount}</p>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] font-semibold text-[color:var(--color-error)]">
            <span className="font-normal text-[color:var(--color-text-muted)]">Need attention today</span>
          </div>
        </div>

        <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "#EAFBF1" }}>
              <span aria-hidden className="text-[15px]">🏆</span>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Placement Rate</p>
              <p className="mt-0.5 text-[22px] font-extrabold leading-none text-[color:var(--color-text)]">{conversionPct}%</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-[color:var(--color-success)]">
            <TrendUpIcon size={11} /> 4%
            <span className="font-normal text-[color:var(--color-text-muted)]">conversion</span>
          </div>
        </div>
      </div>

      {/* Stage filter pills */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFocus("all")}
          aria-pressed={focus === "all"}
          className={`flex shrink-0 items-center gap-2.5 rounded-full border px-3 py-2 text-left transition-all ${
            focus === "all"
              ? "border-transparent bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]"
              : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-2)]"
          }`}
          style={focus === "all" ? { boxShadow: "0 0 0 1.5px var(--color-brand-500), var(--shadow-card)" } : undefined}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--color-brand-500)]" />
          <span className={`text-[12px] font-semibold ${focus === "all" ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-secondary)]"}`}>
            All Stages
          </span>
          <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-[color:var(--color-brand-100)] px-1.5 text-[11px] font-bold tabular-nums text-[color:var(--color-brand-600)]">
            {totalCount}
          </span>
        </button>
        {PIPELINE_STAGES.map((stage) => (
          <StageMetric
            key={stage.id}
            stage={stage}
            count={grouped[stage.id].length}
            active={focus === stage.id}
            onClick={() => setFocus(focus === stage.id ? "all" : stage.id)}
          />
        ))}
      </div>

      {/* Search + context row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex h-9 flex-1 min-w-[220px] items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 shadow-[var(--shadow-card)]">
          <SearchIcon size={14} className="text-[color:var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search candidates, roles, skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-[11px] font-semibold text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-[color:var(--color-text-muted)] md:inline">Owners:</span>
          <div className="flex -space-x-1.5">
            {pipelineOwners.slice(0, 5).map((o) => (
              <span
                key={o.initials}
                title={`${o.name} · ${o.candidates} candidates`}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[color:var(--color-surface)] text-[10px] font-bold text-white"
                style={{ background: o.color }}
              >
                {o.initials}
              </span>
            ))}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-surface-2)] text-[10px] font-semibold text-[color:var(--color-text-secondary)]">
              +{pipelineOwners.length - 5}
            </span>
          </div>
        </div>
      </div>

      {/* Board */}
      {view === "board" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-fit">
            {visibleStages.map((stage) => {
              const cards = grouped[stage.id];
              return (
                <section
                  key={stage.id}
                  aria-label={stage.label}
                  className="flex w-[280px] shrink-0 flex-col"
                >
                  <ColumnHeader stage={stage} count={cards.length} />

                  <div className="flex flex-col gap-2.5">
                    {cards.length === 0 ? (
                      <EmptyColumn />
                    ) : (
                      cards.map((c) => (
                        <CandidateCard key={c.id} card={c} stage={stage} />
                      ))
                    )}

                    <button
                      type="button"
                      className="group flex items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-[color:var(--color-border)] bg-transparent px-3 py-2 text-[11px] font-semibold text-[color:var(--color-text-muted)] transition-all hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
                    >
                      <PlusIcon size={12} /> Add card
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        // List view — compact table
        <div className="overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead>
                <tr className="border-b border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Stage</th>
                  <th className="px-3 py-3">Priority</th>
                  <th className="px-3 py-3 text-right">Score</th>
                  <th className="px-3 py-3">Next Step</th>
                  <th className="px-3 py-3">Owner</th>
                  <th className="px-3 py-3 text-right">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleStages.flatMap((stage) =>
                  grouped[stage.id].map((c) => (
                    <tr key={c.id} className="border-b border-[color:var(--color-border)] last:border-0 text-[12px] hover:bg-[color:var(--color-surface-2)]/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: c.avatarColor }}
                          >
                            {c.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[color:var(--color-text)]">{c.name}</p>
                            <p className="truncate text-[10px] text-[color:var(--color-text-muted)]">{c.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-[color:var(--color-text-secondary)]">{c.role}</td>
                      <td className="px-3 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{ background: stage.soft, color: stage.color }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: stage.color }} />
                          {stage.label}
                        </span>
                      </td>
                      <td className="px-3 py-3"><PriorityChip p={c.priority} /></td>
                      <td className="px-3 py-3 text-right">
                        <ScoreBar value={c.score} color={stage.color} />
                      </td>
                      <td className="px-3 py-3 text-[color:var(--color-text-secondary)]">{c.nextStep}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: c.owner.color }}
                          >
                            {c.owner.initials}
                          </span>
                          <span className="text-[color:var(--color-text-secondary)]">{c.owner.name.split(" ")[0]}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right text-[color:var(--color-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon size={10} /> {c.updated}
                        </span>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
          {pipelineCards.length === 0 && (
            <div className="flex flex-col items-center py-12">
              <UsersIcon size={32} className="text-[color:var(--color-text-muted)]" />
              <p className="mt-2 text-[13px] font-semibold text-[color:var(--color-text-secondary)]">No candidates match your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Footer tip */}
      <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-3 py-2 text-[11px] text-[color:var(--color-text-muted)]">
        <SparklesIcon size={12} className="text-[color:var(--color-brand-500)]" />
        <span>
          <span className="font-semibold text-[color:var(--color-text-secondary)]">Tip:</span>{" "}
          Drag a card between columns to move a candidate through stages. Click a card to open their profile.
        </span>
        <ChevronRight size={12} className="ml-auto text-[color:var(--color-text-muted)]" />
      </div>
    </div>
  );
}
