"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { CandidatesStats } from "@/components/candidates/CandidatesStats";
import {
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  FilterIcon,
  GridViewIcon,
  ListViewIcon,
  MoreIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  SortIcon,
  UploadIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import {
  candidates as ALL_CANDIDATES,
  type Candidate,
  type CandidateStatus,
} from "@/lib/sample-data";
import { exportToExcel, type ExcelColumn } from "@/lib/export-utils";

const CANDIDATE_EXPORT_COLUMNS: ExcelColumn<Candidate>[] = [
  { header: "Name", key: "name", width: 24 },
  { header: "Role", key: "role", width: 28 },
  { header: "Experience", key: "experience", width: 14 },
  { header: "Location", key: "location", width: 22 },
  { header: "Status", key: "status", width: 14 },
  { header: "Priority", key: "priority", width: 12 },
  { header: "Match Score", key: "score", type: "number", width: 12 },
  { header: "Availability", key: "availability", width: 24 },
  {
    header: "Skills",
    key: (c) => c.skills.join(", "),
    width: 38,
  },
  { header: "Last Updated", key: "updated", width: 16 },
  { header: "ID", key: "id", width: 22 },
];

// ─── Derived option lists ────────────────────────────────────────────────────

const ALL_STATUSES: CandidateStatus[] = [
  "Open",
  "Shortlisted",
  "Interview",
  "Submitted",
  "Offered",
  "Placed",
  "Rejected",
];

const ALL_LOCATIONS = Array.from(
  new Set(ALL_CANDIDATES.map((c) => c.location)),
).sort();
const ALL_SKILLS = Array.from(
  new Set(ALL_CANDIDATES.flatMap((c) => c.skills)),
).sort();
const ALL_AVAILABILITY = Array.from(
  new Set(ALL_CANDIDATES.map((c) => c.availability)),
).sort();
const ALL_PRIORITIES: Array<Candidate["priority"]> = ["High", "Medium", "Low"];
const EXPERIENCE_OPTIONS = ["0-2 years", "3-5 years", "6-9 years", "10+ years"];

const SORT_OPTIONS = [
  { id: "updated", label: "Recently Updated" },
  { id: "score-desc", label: "Highest Match Score" },
  { id: "score-asc", label: "Lowest Match Score" },
  { id: "name-asc", label: "Name (A–Z)" },
  { id: "name-desc", label: "Name (Z–A)" },
  { id: "priority", label: "Priority" },
] as const;
type SortId = (typeof SORT_OPTIONS)[number]["id"];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

type Filters = {
  search: string;
  status: CandidateStatus | "all";
  locations: string[];
  skills: string[];
  availability: string[];
  experience: string[];
  priorities: Array<Candidate["priority"]>;
};

const EMPTY_FILTERS: Filters = {
  search: "",
  status: "all",
  locations: [],
  skills: [],
  availability: [],
  experience: [],
  priorities: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusCount(status: CandidateStatus | "all"): number {
  if (status === "all") return ALL_CANDIDATES.length;
  return ALL_CANDIDATES.filter((c) => c.status === status).length;
}

function availabilityDotColor(text: string) {
  if (/available in/i.test(text)) return "#ED8E55";
  return "#EA6814";
}

function priorityBadgeTone(p: Candidate["priority"]): {
  bg: string;
  fg: string;
} {
  if (p === "High") return { bg: "#F8D5BD", fg: "#9F430D" };
  if (p === "Medium") return { bg: "#FFF6EE", fg: "#C75510" };
  return { bg: "#F4F2EE", fg: "#6B6358" };
}

function matchesExperience(e: string, buckets: string[]): boolean {
  if (buckets.length === 0) return true;
  const years = parseInt(e, 10);
  if (Number.isNaN(years)) return false;
  return buckets.some((b) => {
    if (b === "0-2 years") return years <= 2;
    if (b === "3-5 years") return years >= 3 && years <= 5;
    if (b === "6-9 years") return years >= 6 && years <= 9;
    if (b === "10+ years") return years >= 10;
    return false;
  });
}

// ─── SearchableSelect (single or multi) ──────────────────────────────────────

function SearchableSelect({
  label,
  placeholder,
  options,
  values,
  onChange,
  multi = true,
}: {
  label: string;
  placeholder: string;
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(o: string) {
    if (multi) {
      if (values.includes(o)) onChange(values.filter((v) => v !== o));
      else onChange([...values, o]);
    } else {
      onChange(values[0] === o ? [] : [o]);
      setOpen(false);
    }
  }

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? values[0]
        : `${values.length} selected`;

  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex h-10 w-full items-center justify-between gap-2 rounded-[10px] border bg-[color:var(--color-surface)] px-3 text-left text-[13px] outline-none transition-colors hover:border-[color:var(--color-border-strong)] ${
            open
              ? "border-[color:var(--color-brand-500)] shadow-[var(--shadow-ring-brand)]"
              : "border-[color:var(--color-border)]"
          }`}
        >
          <span
            className={`truncate ${
              values.length === 0
                ? "text-[color:var(--color-text-muted)]"
                : "font-medium text-[color:var(--color-text)]"
            }`}
          >
            {summary}
          </span>
          <ChevronDown
            size={14}
            className={`shrink-0 text-[color:var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
            <div className="relative border-b border-[color:var(--color-border)] p-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                <SearchIcon size={14} />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-8 w-full rounded-[8px] bg-[color:var(--color-surface-2)] pl-8 pr-3 text-[13px] outline-none placeholder:text-[color:var(--color-text-muted)]"
              />
            </div>
            <ul
              role="listbox"
              aria-multiselectable={multi || undefined}
              className="max-h-52 overflow-y-auto py-1"
            >
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-3 text-center text-[12px] text-[color:var(--color-text-muted)]">
                  No matches
                </li>
              ) : (
                filteredOptions.map((o) => {
                  const selected = values.includes(o);
                  return (
                    <li key={o}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => toggle(o)}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                          selected
                            ? "font-semibold text-[color:var(--color-brand-600)]"
                            : "text-[color:var(--color-text)]"
                        }`}
                      >
                        <span className="truncate">{o}</span>
                        {multi ? (
                          <span
                            aria-hidden
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-500)] text-white"
                                : "border-[color:var(--color-border-strong)] bg-transparent"
                            }`}
                          >
                            {selected ? <CheckIcon size={12} /> : null}
                          </span>
                        ) : selected ? (
                          <CheckIcon
                            size={14}
                            className="text-[color:var(--color-brand-600)]"
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Filter chip (active filter pill) ────────────────────────────────────────

function FilterChip({
  label,
  onRemove,
}: {
  label: ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] px-2.5 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]">
      {label}
      <button
        type="button"
        aria-label={`Remove ${typeof label === "string" ? label : "filter"}`}
        onClick={onRemove}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-[color:var(--color-brand-100)]"
      >
        <XIcon size={10} />
      </button>
    </span>
  );
}

// ─── Candidate card (grid view) ──────────────────────────────────────────────

function CandidateCard({
  c,
  selected,
  onToggleSelect,
}: {
  c: Candidate;
  selected: boolean;
  onToggleSelect: () => void;
}) {
  const pt = priorityBadgeTone(c.priority);
  return (
    <article className="group relative flex flex-col rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition-all hover:-translate-y-[2px] hover:border-[color:var(--color-brand-200)] hover:shadow-[0_10px_24px_rgba(234,104,20,0.10)]">
      <div className="absolute left-3 top-3">
        <Checkbox
          aria-label={`Select ${c.name}`}
          checked={selected}
          onChange={onToggleSelect}
        />
      </div>
      <Link
        href={`/candidates/${c.id}`}
        className="flex flex-col items-center gap-2 text-center"
      >
        <Avatar name={c.name} size={56} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[color:var(--color-text)] group-hover:text-[color:var(--color-brand-600)]">
            {c.name}
          </p>
          <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
            {c.role}
          </p>
        </div>
      </Link>

      <div className="my-3 flex justify-center">
        <ScoreRing value={c.score} size={52} stroke={4} />
      </div>

      <div className="flex items-center justify-center gap-1 text-[11px] text-[color:var(--color-text-muted)]">
        <PinIcon size={11} />
        <span className="truncate">{c.location}</span>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {c.skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]"
          >
            {s}
          </span>
        ))}
        {c.skills.length > 3 ? (
          <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-muted)]">
            +{c.skills.length - 3}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[color:var(--color-border)] pt-3">
        <Badge tone={statusTone(c.status)}>{c.status}</Badge>
        <span
          className="rounded-[999px] px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: pt.bg, color: pt.fg }}
        >
          {c.priority}
        </span>
      </div>
    </article>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function CandidatesPageClient() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SortId>("updated");
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const sortRef = useRef<HTMLDivElement>(null);

  // ── Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    function onPointer(e: PointerEvent) {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [sortOpen]);

  // ── Filtering + sorting
  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = ALL_CANDIDATES.filter((c) => {
      if (q) {
        const hay = [
          c.name,
          c.role,
          c.location,
          c.experience,
          c.availability,
          ...c.skills,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.status !== "all" && c.status !== filters.status) return false;
      if (filters.locations.length && !filters.locations.includes(c.location))
        return false;
      if (
        filters.skills.length &&
        !filters.skills.some((s) => c.skills.includes(s))
      )
        return false;
      if (
        filters.availability.length &&
        !filters.availability.includes(c.availability)
      )
        return false;
      if (!matchesExperience(c.experience, filters.experience)) return false;
      if (filters.priorities.length && !filters.priorities.includes(c.priority))
        return false;
      return true;
    });

    const sorted = [...list];
    const priorityRank: Record<Candidate["priority"], number> = {
      High: 0,
      Medium: 1,
      Low: 2,
    };
    const updatedWeight = (u: string): number => {
      const m = u.match(/(\d+)\s*([hd])/i);
      if (!m) return 1000;
      const n = parseInt(m[1], 10);
      return m[2].toLowerCase() === "h" ? n : n * 24;
    };
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.score - a.score;
        case "score-asc":
          return a.score - b.score;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "priority":
          return priorityRank[a.priority] - priorityRank[b.priority];
        case "updated":
        default:
          return updatedWeight(a.updated) - updatedWeight(b.updated);
      }
    });
    return sorted;
  }, [filters, sortBy]);

  // Reset page when filters/sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy, pageSize]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize],
  );

  const activeFilterCount =
    (filters.locations.length +
      filters.skills.length +
      filters.availability.length +
      filters.experience.length +
      filters.priorities.length) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.search ? 1 : 0);

  const patch = useCallback((p: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...p }));
  }, []);

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  // Selection
  const pageIds = pageItems.map((c) => c.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someOnPageSelected = pageIds.some((id) => selected.has(id));
  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const toggleSelectPage = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [allOnPageSelected, pageIds]);

  const exportRows = useCallback(
    (scope: "all" | "filtered" | "selected") => {
      const source =
        scope === "all"
          ? ALL_CANDIDATES
          : scope === "filtered"
            ? filtered
            : filtered.filter((c) => selected.has(c.id));
      if (source.length === 0) return;
      exportToExcel({
        filename: `candidates-${scope}`,
        sheetName: "Candidates",
        columns: CANDIDATE_EXPORT_COLUMNS,
        rows: source,
      });
    },
    [filtered, selected],
  );

  const handleExportClick = useCallback(() => {
    const scope =
      activeFilterCount > 0 || filters.search ? "filtered" : "all";
    exportRows(scope);
  }, [activeFilterCount, filters.search, exportRows]);

  return (
    <div className="min-w-0 space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      {/* ── Header ───────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[26px] sm:leading-[34px]">
            Candidates
          </h1>
          <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px] sm:leading-[22px]">
            {total === ALL_CANDIDATES.length
              ? `Manage and track all ${total} candidates in one place.`
              : `${total} of ${ALL_CANDIDATES.length} candidates match your filters.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <UploadIcon size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            title={
              activeFilterCount > 0 || filters.search
                ? `Export ${filtered.length} filtered candidates to Excel`
                : `Export all ${ALL_CANDIDATES.length} candidates to Excel`
            }
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
          >
            <DownloadIcon size={16} />
            <span className="hidden sm:inline">
              Export{filtered.length !== ALL_CANDIDATES.length ? ` (${filtered.length})` : ""}
            </span>
          </button>
        </div>
      </header>

      <CandidatesStats />

      {/* ── Control bar ──────────────────────────────── */}
      <div className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 sm:p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3">
          {/* Search + primary controls */}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => patch({ search: e.target.value })}
                placeholder="Search by name, role, skill, location…"
                className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-9 text-[13px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
              {filters.search ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => patch({ search: "" })}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                >
                  <XIcon size={14} />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                aria-expanded={filtersOpen}
                className={`inline-flex h-10 items-center gap-2 rounded-[10px] border px-3 text-[13px] font-semibold transition-colors ${
                  filtersOpen || activeFilterCount > 0
                    ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                <FilterIcon size={15} />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1 text-[11px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen((s) => !s)}
                  className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
                >
                  <SortIcon size={15} />
                  <span className="hidden sm:inline text-[color:var(--color-text-muted)] font-medium">
                    Sort:
                  </span>
                  <span className="text-[color:var(--color-brand-600)]">
                    {SORT_OPTIONS.find((o) => o.id === sortBy)?.label}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {sortOpen ? (
                  <div className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          setSortBy(o.id);
                          setSortOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                          sortBy === o.id
                            ? "font-semibold text-[color:var(--color-brand-600)]"
                            : "text-[color:var(--color-text)]"
                        }`}
                      >
                        {o.label}
                        {sortBy === o.id ? <CheckIcon size={14} /> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div
                role="group"
                aria-label="View mode"
                className="inline-flex h-10 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-0.5"
              >
                <button
                  type="button"
                  aria-pressed={view === "list"}
                  aria-label="List view"
                  onClick={() => setView("list")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors ${
                    view === "list"
                      ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                      : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  <ListViewIcon size={16} />
                </button>
                <button
                  type="button"
                  aria-pressed={view === "grid"}
                  aria-label="Grid view"
                  onClick={() => setView("grid")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors ${
                    view === "grid"
                      ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                      : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  <GridViewIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Status tabs */}
          <div
            role="tablist"
            aria-label="Filter by status"
            className="-mx-1 flex items-center gap-1 overflow-x-auto px-1"
          >
            <StatusTab
              active={filters.status === "all"}
              label="All"
              count={statusCount("all")}
              onClick={() => patch({ status: "all" })}
            />
            {ALL_STATUSES.map((s) => (
              <StatusTab
                key={s}
                active={filters.status === s}
                label={s}
                count={statusCount(s)}
                onClick={() => patch({ status: s })}
              />
            ))}
          </div>

          {/* Collapsible filter panel */}
          {filtersOpen ? (
            <div className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <SearchableSelect
                  label="Location"
                  placeholder="Any location"
                  options={ALL_LOCATIONS}
                  values={filters.locations}
                  onChange={(v) => patch({ locations: v })}
                />
                <SearchableSelect
                  label="Skills"
                  placeholder="Any skill"
                  options={ALL_SKILLS}
                  values={filters.skills}
                  onChange={(v) => patch({ skills: v })}
                />
                <SearchableSelect
                  label="Experience"
                  placeholder="Any experience"
                  options={EXPERIENCE_OPTIONS}
                  values={filters.experience}
                  onChange={(v) => patch({ experience: v })}
                />
                <SearchableSelect
                  label="Availability"
                  placeholder="Any availability"
                  options={ALL_AVAILABILITY}
                  values={filters.availability}
                  onChange={(v) => patch({ availability: v })}
                />
                <SearchableSelect
                  label="Priority"
                  placeholder="Any priority"
                  options={ALL_PRIORITIES}
                  values={filters.priorities}
                  onChange={(v) =>
                    patch({ priorities: v as Candidate["priority"][] })
                  }
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={activeFilterCount === 0}
                  className="inline-flex h-9 items-center rounded-[10px] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reset all
                </button>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="inline-flex h-9 items-center rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(234,104,20,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
                >
                  Done
                </button>
              </div>
            </div>
          ) : null}

          {/* Active filter chips */}
          {activeFilterCount > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">
                Active:
              </span>
              {filters.search ? (
                <FilterChip
                  label={
                    <>
                      Search: <span className="font-bold">{filters.search}</span>
                    </>
                  }
                  onRemove={() => patch({ search: "" })}
                />
              ) : null}
              {filters.status !== "all" ? (
                <FilterChip
                  label={`Status: ${filters.status}`}
                  onRemove={() => patch({ status: "all" })}
                />
              ) : null}
              {filters.locations.map((v) => (
                <FilterChip
                  key={`loc-${v}`}
                  label={v}
                  onRemove={() =>
                    patch({ locations: filters.locations.filter((x) => x !== v) })
                  }
                />
              ))}
              {filters.skills.map((v) => (
                <FilterChip
                  key={`sk-${v}`}
                  label={v}
                  onRemove={() =>
                    patch({ skills: filters.skills.filter((x) => x !== v) })
                  }
                />
              ))}
              {filters.experience.map((v) => (
                <FilterChip
                  key={`ex-${v}`}
                  label={v}
                  onRemove={() =>
                    patch({
                      experience: filters.experience.filter((x) => x !== v),
                    })
                  }
                />
              ))}
              {filters.availability.map((v) => (
                <FilterChip
                  key={`av-${v}`}
                  label={v}
                  onRemove={() =>
                    patch({
                      availability: filters.availability.filter((x) => x !== v),
                    })
                  }
                />
              ))}
              {filters.priorities.map((v) => (
                <FilterChip
                  key={`pr-${v}`}
                  label={`${v} priority`}
                  onRemove={() =>
                    patch({
                      priorities: filters.priorities.filter((x) => x !== v),
                    })
                  }
                />
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="ml-1 inline-flex items-center gap-1 rounded-[999px] px-2 py-1 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                Clear all
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Bulk selection bar ───────────────────────── */}
      {selected.size > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] px-4 py-3 shadow-[0_4px_14px_rgba(234,104,20,0.08)]">
          <p className="text-[13px] font-semibold text-[color:var(--color-brand-600)]">
            {selected.size} selected
          </p>
          <div className="flex items-center gap-2">
            <BulkAction
              label="Export"
              icon={<DownloadIcon size={14} />}
              onClick={() => exportRows("selected")}
            />
            <BulkAction label="Assign" icon={<PlusIcon size={14} />} />
            <BulkAction label="Archive" icon={<MoreIcon size={14} />} />
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex h-8 items-center rounded-[8px] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-white"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      {/* ── Results ──────────────────────────────────── */}
      {pageItems.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : view === "list" ? (
        <ListView
          rows={pageItems}
          selected={selected}
          onToggleRow={toggleSelect}
          onToggleAll={toggleSelectPage}
          allSelected={allOnPageSelected}
          someSelected={someOnPageSelected && !allOnPageSelected}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {pageItems.map((c) => (
            <CandidateCard
              key={c.id}
              c={c}
              selected={selected.has(c.id)}
              onToggleSelect={() => toggleSelect(c.id)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────── */}
      {pageItems.length > 0 ? (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3 text-[13px] text-[color:var(--color-text-secondary)]">
            <span>
              Showing {(safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, total)} of {total}
            </span>
            <label className="inline-flex items-center gap-2">
              <span className="sr-only">Rows per page</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-9 appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-3 pr-8 text-[13px] font-semibold text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)]"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
                />
              </div>
            </label>
          </div>

          <nav aria-label="Pagination" className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
              )
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span
                    key={`e-${i}`}
                    className="px-2 text-[13px] text-[color:var(--color-text-muted)]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    aria-current={safePage === p ? "page" : undefined}
                    onClick={() => setPage(p as number)}
                    className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] px-2 text-[13px] font-semibold transition-colors ${
                      safePage === p
                        ? "bg-[color:var(--color-brand-500)] text-white"
                        : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              type="button"
              aria-label="Next page"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusTab({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[999px] px-3 text-[12px] font-semibold transition-colors ${
        active
          ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_10px_rgba(234,104,20,0.25)]"
          : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]/80 hover:text-[color:var(--color-text)]"
      }`}
    >
      {label}
      <span
        className={`inline-flex items-center rounded-full px-1.5 text-[11px] font-bold ${
          active
            ? "bg-white/20 text-white"
            : "bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function BulkAction({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[color:var(--color-brand-200)] bg-white px-3 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
    >
      {icon}
      {label}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-surface-2)]">
        <SearchIcon size={22} />
      </div>
      <p className="text-[15px] font-semibold text-[color:var(--color-text)]">
        No candidates match your filters
      </p>
      <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">
        Try adjusting your search or clearing some filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex h-9 items-center rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
      >
        Reset filters
      </button>
    </div>
  );
}

function ListView({
  rows,
  selected,
  onToggleRow,
  onToggleAll,
  allSelected,
  someSelected,
}: {
  rows: Candidate[];
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
}) {
  const headerCheckRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckRef.current) {
      headerCheckRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <section
      className="overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 text-[11px] font-semibold uppercase tracking-[0.06em] text-[color:var(--color-text-secondary)]">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  ref={headerCheckRef}
                  aria-label="Select all candidates on this page"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </th>
              <th className="py-3 pr-4">Candidate</th>
              <th className="hidden py-3 pr-4 md:table-cell">Title / Skills</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Experience</th>
              <th className="hidden py-3 pr-4 lg:table-cell">Location</th>
              <th className="py-3 pr-4">Status</th>
              <th className="hidden py-3 pr-4 sm:table-cell">Match</th>
              <th className="hidden py-3 pr-4 lg:table-cell">Availability</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Updated</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const isSel = selected.has(c.id);
              const pt = priorityBadgeTone(c.priority);
              return (
                <tr
                  key={c.id}
                  className={`group border-b border-[color:var(--color-border)] last:border-b-0 transition-colors ${
                    isSel
                      ? "bg-[color:var(--color-brand-50)]/40"
                      : "hover:bg-[color:var(--color-surface-2)]/40"
                  }`}
                >
                  <td className="px-4 py-4 align-middle">
                    <Checkbox
                      aria-label={`Select ${c.name}`}
                      checked={isSel}
                      onChange={() => onToggleRow(c.id)}
                    />
                  </td>
                  <td className="py-3 pr-4 align-middle">
                    <Link
                      href={`/candidates/${c.id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar name={c.name} size={38} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)] group-hover:text-[color:var(--color-brand-600)]">
                            {c.name}
                          </p>
                          <span
                            className="rounded-[999px] px-1.5 py-[1px] text-[10px] font-bold"
                            style={{ background: pt.bg, color: pt.fg }}
                          >
                            {c.priority}
                          </span>
                        </div>
                        <p className="truncate text-[12px] text-[color:var(--color-text-secondary)] md:hidden">
                          {c.role}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden py-3 pr-4 align-middle md:table-cell">
                    <p className="truncate text-[13px] font-medium text-[color:var(--color-text)]">
                      {c.role}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]"
                        >
                          {s}
                        </span>
                      ))}
                      {c.skills.length > 3 ? (
                        <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--color-text-muted)]">
                          +{c.skills.length - 3}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="hidden py-3 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] xl:table-cell">
                    {c.experience}
                  </td>
                  <td className="hidden py-3 pr-4 align-middle lg:table-cell">
                    <p className="inline-flex items-center gap-1 text-[13px] text-[color:var(--color-text-secondary)]">
                      <PinIcon size={13} />
                      {c.location}
                    </p>
                  </td>
                  <td className="py-3 pr-4 align-middle">
                    <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  </td>
                  <td className="hidden py-3 pr-4 align-middle sm:table-cell">
                    <ScoreRing value={c.score} size={36} stroke={3.5} />
                  </td>
                  <td className="hidden py-3 pr-4 align-middle lg:table-cell">
                    <p className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text-secondary)]">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: availabilityDotColor(c.availability),
                        }}
                      />
                      {c.availability}
                    </p>
                  </td>
                  <td className="hidden py-3 pr-4 align-middle text-[13px] text-[color:var(--color-text-muted)] xl:table-cell">
                    {c.updated}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <button
                      type="button"
                      aria-label={`Actions for ${c.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                    >
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
