"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ArrowDown2 } from "iconsax-reactjs";
import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  MoreIcon,
  PinIcon,
  SortIcon,
} from "@/components/icons/AppIcons";
import { candidates, type CandidateStatus } from "@/lib/sample-data";

const PAGE_SIZE = 5;
const STATUSES: CandidateStatus[] = [
  "Open", "Shortlisted", "Interview", "Submitted", "Offered", "Placed", "Rejected",
];

type SortKey = "updated" | "score-desc" | "score-asc" | "name" | "experience";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "updated",     label: "Recently Updated" },
  { key: "score-desc",  label: "Match Score (high → low)" },
  { key: "score-asc",   label: "Match Score (low → high)" },
  { key: "name",        label: "Name (A → Z)" },
  { key: "experience",  label: "Most Experienced" },
];

function parseExperience(s: string): number {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

function parseUpdated(s: string): number {
  // returns minutes since update — lower = more recent
  const m = s.match(/(\d+)\s*(m|min|h|hour|d|day|w|week)/i);
  if (!m) return 99999;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("m")) return n;
  if (unit.startsWith("h")) return n * 60;
  if (unit.startsWith("d")) return n * 60 * 24;
  return n * 60 * 24 * 7;
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onClose, active]);
}

export function RecentCandidatesTable() {
  const [filterStatuses, setFilterStatuses] = useState<Set<CandidateStatus>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const rowMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(filterRef, () => setFilterOpen(false), filterOpen);
  useClickOutside(sortRef, () => setSortOpen(false), sortOpen);
  useClickOutside(rowMenuRef, () => setOpenRowMenu(null), !!openRowMenu);

  // Filter + sort
  const processed = useMemo(() => {
    let arr = [...candidates];
    if (filterStatuses.size > 0) {
      arr = arr.filter((c) => filterStatuses.has(c.status));
    }
    arr.sort((a, b) => {
      switch (sortKey) {
        case "updated":    return parseUpdated(a.updated) - parseUpdated(b.updated);
        case "score-desc": return b.score - a.score;
        case "score-asc":  return a.score - b.score;
        case "name":       return a.name.localeCompare(b.name);
        case "experience": return parseExperience(b.experience) - parseExperience(a.experience);
      }
    });
    return arr;
  }, [filterStatuses, sortKey]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const rows = processed.slice(startIdx, startIdx + PAGE_SIZE);

  // Reset page when filter/sort change
  useEffect(() => { setPage(1); }, [filterStatuses, sortKey]);

  function toggleFilter(s: CandidateStatus) {
    setFilterStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (rows.every((r) => selected.has(r.id))) {
      // Unselect all visible rows
      setSelected((prev) => {
        const next = new Set(prev);
        rows.forEach((r) => next.delete(r.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        rows.forEach((r) => next.add(r.id));
        return next;
      });
    }
  }

  const allVisibleSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const sortLabel = SORT_OPTIONS.find((s) => s.key === sortKey)?.label ?? "Sort";

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold text-[color:var(--color-text)]">
            Recent Candidates
          </h3>
          {selected.size > 0 && (
            <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[11px] font-bold text-[color:var(--color-brand-600)]">
              {selected.size} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/candidates"
            className="link-brand text-[13px] font-semibold"
          >
            View all candidates
          </Link>

          {/* Filter */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => { setFilterOpen((v) => !v); setSortOpen(false); }}
              aria-haspopup="menu"
              aria-expanded={filterOpen}
              className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            >
              <FilterIcon size={16} />
              Filter
              {filterStatuses.size > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1.5 text-[10px] font-bold text-white">
                  {filterStatuses.size}
                </span>
              )}
              <ChevronIcon />
            </button>
            {filterOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+6px)] z-30 w-[200px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              >
                <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                    Filter by status
                  </p>
                  {filterStatuses.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilterStatuses(new Set())}
                      className="text-[11px] font-semibold text-[color:var(--color-brand-600)] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-[260px] overflow-y-auto py-1">
                  {STATUSES.map((s) => {
                    const checked = filterStatuses.has(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        role="menuitemcheckbox"
                        aria-checked={checked}
                        onClick={() => toggleFilter(s)}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12.5px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
                      >
                        <span>{s}</span>
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                            checked
                              ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-500)] text-white"
                              : "border-[color:var(--color-border-strong)] bg-transparent"
                          }`}
                        >
                          {checked && <CheckIcon size={11} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sort */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => { setSortOpen((v) => !v); setFilterOpen(false); }}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
            >
              <SortIcon size={16} />
              {sortLabel}
              <ChevronIcon />
            </button>
            {sortOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+6px)] z-30 w-[220px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              >
                <p className="border-b border-[color:var(--color-border)] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">
                  Sort by
                </p>
                <div className="py-1">
                  {SORT_OPTIONS.map((opt) => {
                    const active = opt.key === sortKey;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                        className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12.5px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
                      >
                        <span>{opt.label}</span>
                        {active && <CheckIcon size={12} className="text-[color:var(--color-brand-500)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-text-secondary)]">
              <th className="w-10 px-5 py-3">
                <Checkbox
                  aria-label="Select all candidates"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-3 pr-4">Candidate</th>
              <th className="hidden py-3 pr-4 md:table-cell">Title / Skills</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Experience</th>
              <th className="hidden py-3 pr-4 lg:table-cell">Location</th>
              <th className="py-3 pr-4">Status</th>
              <th className="hidden py-3 pr-4 sm:table-cell">Match Score</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Updated</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-12 text-center">
                  <p className="text-[13px] font-semibold text-[color:var(--color-text-secondary)]">
                    No candidates match your filters
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilterStatuses(new Set())}
                    className="mt-2 text-[12px] font-semibold text-[color:var(--color-brand-600)] hover:underline"
                  >
                    Clear filters
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b border-[color:var(--color-border)] last:border-b-0 transition-colors ${
                    selected.has(c.id)
                      ? "bg-[color:var(--color-brand-50)]/40"
                      : "hover:bg-[color:var(--color-surface-2)]/50"
                  }`}
                >
                  <td className="px-5 py-4 align-middle">
                    <Checkbox
                      aria-label={`Select ${c.name}`}
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </td>
                  <td className="py-4 pr-4 align-middle">
                    <Link
                      href={`/candidates/${c.id}`}
                      className="flex items-center gap-3 transition-colors hover:text-[color:var(--color-brand-600)]"
                    >
                      <Avatar name={c.name} size={36} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                          {c.name}
                        </p>
                        <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                          {c.role}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden py-4 pr-4 align-middle md:table-cell">
                    <p className="text-[13px] text-[color:var(--color-text)]">
                      {c.skills.slice(0, 3).join(", ")}
                    </p>
                    {c.skills.length > 3 ? (
                      <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                        {c.skills.slice(3).join(", ")}
                      </p>
                    ) : null}
                  </td>
                  <td className="hidden py-4 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] xl:table-cell">
                    {c.experience}
                  </td>
                  <td className="hidden py-4 pr-4 align-middle lg:table-cell">
                    <p className="inline-flex items-center gap-1 text-[13px] text-[color:var(--color-text-secondary)]">
                      <PinIcon size={14} />
                      {c.location}
                    </p>
                  </td>
                  <td className="py-4 pr-4 align-middle">
                    <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  </td>
                  <td className="hidden py-4 pr-4 align-middle sm:table-cell">
                    <ScoreRing value={c.score} size={40} stroke={4} />
                  </td>
                  <td className="hidden py-4 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] xl:table-cell">
                    {c.updated}
                  </td>
                  <td className="relative px-4 py-4 align-middle">
                    <button
                      type="button"
                      aria-label={`Actions for ${c.name}`}
                      onClick={() => setOpenRowMenu(openRowMenu === c.id ? null : c.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                    >
                      <MoreIcon />
                    </button>
                    {openRowMenu === c.id && (
                      <div
                        ref={rowMenuRef}
                        role="menu"
                        className="absolute right-2 top-[calc(100%-6px)] z-30 w-[180px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
                      >
                        <Link
                          href={`/candidates/${c.id}`}
                          onClick={() => setOpenRowMenu(null)}
                          className="block px-3 py-2 text-[12.5px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
                        >
                          View profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => setOpenRowMenu(null)}
                          className="block w-full px-3 py-2 text-left text-[12.5px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
                        >
                          Match to a job
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpenRowMenu(null)}
                          className="block w-full px-3 py-2 text-left text-[12.5px] font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
                        >
                          Add note
                        </button>
                        <div className="border-t border-[color:var(--color-border)]" />
                        <button
                          type="button"
                          onClick={() => setOpenRowMenu(null)}
                          className="block w-full px-3 py-2 text-left text-[12.5px] font-medium text-[color:var(--color-error)] hover:bg-[color:var(--color-error-light)]"
                        >
                          Reject candidate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-[13px] text-[color:var(--color-text-secondary)]">
          Showing {processed.length === 0 ? 0 : startIdx + 1} to {Math.min(startIdx + PAGE_SIZE, processed.length)} of {processed.length} candidates
          {filterStatuses.size > 0 && (
            <span className="ml-2 text-[12px] text-[color:var(--color-text-muted)]">(filtered)</span>
          )}
        </p>
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--color-border)] disabled:hover:text-[color:var(--color-text-secondary)]"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            return (
              <button
                key={n}
                type="button"
                aria-current={n === safePage ? "page" : undefined}
                onClick={() => setPage(n)}
                className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] px-2 text-[13px] font-semibold transition-colors ${
                  n === safePage
                    ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_rgba(234,104,20,0.22)]"
                    : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {n}
              </button>
            );
          })}
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[color:var(--color-border)] disabled:hover:text-[color:var(--color-text-secondary)]"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </footer>
    </section>
  );
}

function ChevronIcon() {
  return <ArrowDown2 aria-hidden size={12} color="currentColor" variant="Linear" />;
}
