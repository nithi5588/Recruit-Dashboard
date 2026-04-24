"use client";

import { useEffect, useMemo, useState } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import {
  JobFiltersDrawer,
  JobFiltersPanel,
} from "@/components/jobs/JobFiltersPanel";
import {
  BookmarkIcon,
  DownloadIcon,
  FilterIcon,
  GridViewIcon,
  LinkChainIcon,
  ListViewIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { exportToExcel, type ExcelColumn } from "@/lib/export-utils";
import { ChevronDownIcon } from "@/components/icons/Icons";
import {
  activeFilterChips,
  countActiveFilters,
  emptyJobFilters,
  jobMatchesExperience,
  type Job,
  type JobFilters,
  type SavedSearch,
} from "@/lib/jobs-data";

type TabKey = "all" | "saved";
type ViewKey = "list" | "grid";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
  { value: "company", label: "Company" },
];

const PAGE_SIZE = 6;

function postedAgeDays(job: Job): number {
  const s = job.postedAgo;
  const m = s.match(/^(\d+)\s+(day|days|week|weeks|month|months)/i);
  if (!m) return 999;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("week")) return n * 7;
  if (unit.startsWith("month")) return n * 30;
  return n;
}

function applyFilters(jobs: Job[], filters: JobFilters): Job[] {
  const keyword = filters.keywords.trim().toLowerCase();
  return jobs.filter((job) => {
    if (keyword) {
      const haystack = [job.title, job.company, job.category, job.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    if (filters.jobType !== "All job types" && job.jobType !== filters.jobType)
      return false;
    if (filters.category !== "All categories" && job.category !== filters.category)
      return false;
    if (filters.source !== "All sources" && job.source !== filters.source)
      return false;
    if (!jobMatchesExperience(job, filters.experience)) return false;
    if (filters.location !== "All locations") {
      if (filters.location === "Remote") {
        if (!/remote/i.test(job.location)) return false;
      } else if (filters.location === "United States") {
        if (!/\bUS\b|USA|United States/i.test(job.location)) return false;
      } else if (filters.location === "Canada") {
        if (!/Canada/i.test(job.location)) return false;
      } else if (
        !job.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }
    }
    if (filters.postedWithin !== "Any time") {
      const age = postedAgeDays(job);
      if (filters.postedWithin === "Last 24 hours" && age > 1) return false;
      if (filters.postedWithin === "Last 3 days" && age > 3) return false;
      if (filters.postedWithin === "Last week" && age > 7) return false;
      if (filters.postedWithin === "Last month" && age > 30) return false;
    }
    return true;
  });
}

function applySort(jobs: Job[], sort: string): Job[] {
  const sorted = [...jobs];
  if (sort === "newest") sorted.sort((a, b) => postedAgeDays(a) - postedAgeDays(b));
  else if (sort === "oldest") sorted.sort((a, b) => postedAgeDays(b) - postedAgeDays(a));
  else if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "company") sorted.sort((a, b) => a.company.localeCompare(b.company));
  return sorted;
}

function filtersEqual(a: JobFilters, b: JobFilters): boolean {
  return (
    a.keywords === b.keywords &&
    a.location === b.location &&
    a.jobType === b.jobType &&
    a.experience === b.experience &&
    a.category === b.category &&
    a.postedWithin === b.postedWithin &&
    a.source === b.source
  );
}

export function JobsPageClient({ jobs }: { jobs: Job[] }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<ViewKey>("list");
  const [filters, setFilters] = useState<JobFilters>(emptyJobFilters);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [page, setPage] = useState(1);
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);

  function updateFilter<K extends keyof JobFilters>(key: K, value: JobFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilter(key: keyof JobFilters) {
    updateFilter(key, emptyJobFilters[key]);
  }

  function clearAllFilters() {
    setFilters(emptyJobFilters);
    setSearch("");
  }

  function saveCurrentSearch(name: string) {
    const id = `ss_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    setSavedSearches((prev) => [
      { id, name, filters: { ...filters }, createdAt: Date.now() },
      ...prev,
    ]);
  }

  function applySavedSearch(id: string) {
    const match = savedSearches.find((s) => s.id === id);
    if (match) setFilters(match.filters);
  }

  function deleteSavedSearch(id: string) {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  }

  const activeSavedSearchId =
    savedSearches.find((s) => filtersEqual(s.filters, filters))?.id ?? null;

  const filtered = useMemo(() => {
    let list = applyFilters(jobs, filters);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((j) =>
        [j.title, j.company, j.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    if (tab === "saved") {
      list = list.filter((j) => savedIds.has(j.id));
    }
    return applySort(list, sort);
  }, [jobs, filters, search, sort, tab, savedIds]);

  // Reset to page 1 whenever filter/search/tab/sort changes
  useEffect(() => {
    setPage(1);
  }, [filters, search, tab, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filtered.length);
  const pageItems = filtered.slice(pageStart, pageEnd);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Newest";
  const chips = activeFilterChips(filters);
  const activeCount = countActiveFilters(filters);
  const savedJobsCount = savedIds.size;

  const handleExportJobs = () => {
    if (filtered.length === 0) return;
    const cols: ExcelColumn<Job>[] = [
      { header: "Title", key: "title", width: 32 },
      { header: "Company", key: "company", width: 22 },
      { header: "Location", key: "location", width: 22 },
      { header: "Job Type", key: "jobType", width: 14 },
      { header: "Category", key: "category", width: 18 },
      { header: "Experience", key: (j) => j.experience ?? "", width: 14 },
      { header: "Salary", key: (j) => j.salary ?? "", width: 22 },
      { header: "Remote", key: (j) => j.remote ?? "", width: 16 },
      {
        header: "Tags",
        key: (j) => j.tags.join(", "),
        width: 36,
      },
      { header: "Source", key: "source", width: 22 },
      { header: "Source URL", key: "sourceUrl", width: 36 },
      { header: "Posted", key: "postedAgo", width: 14 },
      { header: "Status", key: (j) => j.status ?? "", width: 12 },
      { header: "Job ID", key: "id", width: 22 },
    ];
    exportToExcel({
      filename: "jobs",
      sheetName: "Jobs",
      columns: cols,
      rows: filtered,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-5 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:px-8 xl:py-8">
      <div className="min-w-0 space-y-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[26px] sm:leading-[34px]">
              Jobs
            </h1>
            <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px] sm:leading-[22px]">
              Find and track job openings from external platforms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJobs}
              disabled={filtered.length === 0}
              title={`Export ${filtered.length} job${filtered.length === 1 ? "" : "s"} to Excel`}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <DownloadIcon size={16} />
              <span className="hidden sm:inline">
                Export{filtered.length !== jobs.length ? ` (${filtered.length})` : ""}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
            >
              <LinkChainIcon size={16} />
              Add Job Link
            </button>
          </div>
        </header>

        <nav
          aria-label="Jobs sections"
          className="flex items-center gap-1 border-b border-[color:var(--color-border)]"
        >
          {(
            [
              { key: "all" as TabKey, label: "All Jobs", count: jobs.length },
              { key: "saved" as TabKey, label: "Saved Jobs", count: savedJobsCount },
            ]
          ).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`relative -mb-px inline-flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[13px] font-semibold transition-colors ${
                  active
                    ? "text-[color:var(--color-brand-600)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {t.label}
                <span
                  className={`inline-flex h-5 min-w-[22px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                    active
                      ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                      : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  {t.count}
                </span>
                {active ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-[3px] rounded-t-full bg-[color:var(--color-brand-500)]"
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-2.5">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Search jobs</span>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
              <SearchIcon size={16} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs by title, company or keyword..."
              className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-3 text-[13px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersDrawerOpen(true)}
              className="relative inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] xl:hidden"
            >
              <FilterIcon size={16} />
              Filters
              {activeCount > 0 ? (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1.5 text-[11px] font-semibold text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort jobs"
                className="h-10 appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-3 pr-9 text-[13px] font-medium text-[color:var(--color-text-secondary)] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
              />
            </div>

            <span className="sr-only" aria-live="polite">
              Sort by {sortLabel}
            </span>

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
                    : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
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
                    : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                }`}
              >
                <GridViewIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {chips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              Active:
            </span>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => clearFilter(c.key)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)] py-1 pl-2.5 pr-1.5 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-400)] hover:bg-[color:var(--color-brand-100)]"
              >
                {c.label}
                <span
                  aria-hidden
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[color:var(--color-brand-600)] transition-colors group-hover:bg-[color:var(--color-brand-200)]"
                >
                  <XIcon size={10} />
                </span>
                <span className="sr-only">Remove {c.label} filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-1 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {/* Results bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-y border-[color:var(--color-border)] py-2.5">
          <p className="text-[12px] text-[color:var(--color-text-secondary)]">
            {filtered.length === 0 ? (
              <span>No jobs match</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-[color:var(--color-text)]">
                  {pageStart + 1}–{pageEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[color:var(--color-text)]">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "job" : "jobs"}
                {activeCount > 0 ? (
                  <span className="text-[color:var(--color-text-muted)]">
                    {" "}
                    · {activeCount} filter{activeCount === 1 ? "" : "s"} applied
                  </span>
                ) : null}
              </>
            )}
          </p>
          {totalPages > 1 ? (
            <p className="text-[12px] text-[color:var(--color-text-muted)]">
              Page {currentPage} of {totalPages}
            </p>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-14 text-center">
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
            >
              <BookmarkIcon size={20} />
            </span>
            <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
              {tab === "saved"
                ? "No saved jobs yet"
                : "No jobs match these filters"}
            </p>
            <p className="max-w-md text-[12px] text-[color:var(--color-text-secondary)]">
              {tab === "saved"
                ? "Bookmark jobs from the list to build a shortlist you can revisit."
                : "Try clearing a filter or broadening your keywords."}
            </p>
            {tab !== "saved" && activeCount > 0 ? (
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-1 inline-flex h-9 items-center rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <ul
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3"
                  : "space-y-2.5"
              }
            >
              {pageItems.map((job) => (
                <li key={job.id} className={view === "grid" ? "h-full" : ""}>
                  <JobCard
                    job={job}
                    saved={savedIds.has(job.id)}
                    onToggleSaved={() =>
                      setSavedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(job.id)) next.delete(job.id);
                        else next.add(job.id);
                        return next;
                      })
                    }
                    variant={view}
                  />
                </li>
              ))}
            </ul>

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-center gap-1 pt-1"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 items-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const active = p === currentPage;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[8px] px-2 text-[12px] font-semibold transition-colors ${
                        active
                          ? "bg-[color:var(--color-brand-500)] text-white"
                          : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 items-center rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            ) : null}
          </>
        )}
      </div>

      <JobFiltersPanel
        filters={filters}
        onChange={updateFilter}
        savedSearches={savedSearches}
        activeSavedSearchId={activeSavedSearchId}
        onApplySavedSearch={applySavedSearch}
        onDeleteSavedSearch={deleteSavedSearch}
        onSaveCurrentSearch={saveCurrentSearch}
      />

      <JobFiltersDrawer
        open={filtersDrawerOpen}
        onClose={() => setFiltersDrawerOpen(false)}
        resultsCount={filtered.length}
        filters={filters}
        onChange={updateFilter}
        savedSearches={savedSearches}
        activeSavedSearchId={activeSavedSearchId}
        onApplySavedSearch={applySavedSearch}
        onDeleteSavedSearch={deleteSavedSearch}
        onSaveCurrentSearch={saveCurrentSearch}
      />
    </div>
  );
}
