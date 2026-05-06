"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  CheckIcon,
  ClockIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import type {
  EnrichmentStatus,
  Recruiter,
} from "@/components/enrichment/enrichment-data";

type StatusFilter = "all" | EnrichmentStatus;

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Success", label: "Success" },
  { id: "Failed", label: "Failed" },
  { id: "In Progress", label: "Pending" },
];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function bucketFor(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < DAY) return "Today";
  if (diff < 2 * DAY) return "Yesterday";
  if (diff < 7 * DAY) return "This week";
  if (diff < 30 * DAY) return "This month";
  return "Earlier";
}

function StatusDot({ status }: { status: EnrichmentStatus }) {
  const map: Record<EnrichmentStatus, { bg: string; ring: string }> = {
    Success: {
      bg: "var(--color-success)",
      ring: "color-mix(in srgb, var(--color-success) 30%, transparent)",
    },
    Failed: {
      bg: "var(--color-error)",
      ring: "color-mix(in srgb, var(--color-error) 30%, transparent)",
    },
    "In Progress": {
      bg: "var(--color-text-muted)",
      ring: "color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
    },
  };
  const c = map[status];
  return (
    <span
      aria-hidden
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ background: c.bg, boxShadow: `0 0 0 3px ${c.ring}` }}
    />
  );
}

export function HistorySidebar({
  recruiters,
  activeId,
  onSelect,
}: {
  recruiters: Recruiter[];
  activeId: string;
  onSelect: (r: Recruiter) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recruiters
      .filter((r) => filter === "all" || r.status === filter)
      .filter((r) => {
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
        );
      })
      .slice()
      .sort((a, b) => b.enrichedAtMs - a.enrichedAtMs);
  }, [recruiters, filter, query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Recruiter[]>();
    for (const r of filtered) {
      const b = bucketFor(r.enrichedAtMs);
      if (!groups.has(b)) groups.set(b, []);
      groups.get(b)!.push(r);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  const total = recruiters.length;
  const matchCount = filtered.length;

  return (
    <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
      <header className="border-b border-[color:var(--color-border)] px-4 pb-3 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">
              Enrichment history
            </h3>
            <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">
              {matchCount === total
                ? `${total} profile${total === 1 ? "" : "s"} enriched`
                : `${matchCount} of ${total} match`}
            </p>
          </div>
        </div>

        <div className="relative mt-3">
          <SearchIcon
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, location"
            className="h-9 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-7 pr-7 text-[12.5px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
            >
              <XIcon size={11} />
            </button>
          ) : null}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => {
            const isActive = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold transition-colors ${
                  isActive
                    ? "bg-[color:var(--color-brand-500)] text-white"
                    : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-[12.5px] font-semibold text-[color:var(--color-text-secondary)]">
            No matches
          </p>
          <p className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">
            Try a different search or clear the filter.
          </p>
        </div>
      ) : (
        <div className="max-h-[520px] overflow-y-auto lg:max-h-[640px]">
          {grouped.map(([bucket, items]) => (
            <div key={bucket}>
              <p className="sticky top-0 z-[1] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)] backdrop-blur-sm">
                {bucket} · {items.length}
              </p>
              <ul>
                {items.map((r) => {
                  const isActive = r.id === activeId;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(r)}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition-colors ${
                          isActive
                            ? "bg-[color:var(--color-brand-50)]"
                            : "hover:bg-[color:var(--color-surface-2)]/60"
                        }`}
                      >
                        <span className="relative shrink-0">
                          <Avatar name={r.name} size={32} />
                          <span
                            className="absolute -right-0.5 -bottom-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[color:var(--color-surface)]"
                            aria-hidden
                          >
                            <StatusDot status={r.status} />
                          </span>
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[12.5px] font-semibold text-[color:var(--color-text)]">
                              {r.name}
                            </p>
                            <span className="shrink-0 text-[10.5px] tabular-nums text-[color:var(--color-text-muted)]">
                              {shortTime(r.enrichedAtMs)}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-[color:var(--color-text-secondary)]">
                            {r.title} · {r.company}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10.5px] text-[color:var(--color-text-muted)]">
                            <span className="inline-flex items-center gap-1">
                              <ClockIcon size={9} />
                              {bucket === "Today" || bucket === "Yesterday"
                                ? r.enrichedAt.replace(/^[^,]+,\s*/, "")
                                : r.enrichedAt}
                            </span>
                            {r.status === "Success" ? (
                              <span className="inline-flex items-center gap-1 text-[color:var(--color-success)]">
                                <CheckIcon size={9} />
                                {r.dataQuality}% quality
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function shortTime(ms: number): string {
  const diff = Date.now() - ms;
  const minutes = Math.round(diff / (60 * 1000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.round(days / 7);
  return `${weeks}w`;
}
