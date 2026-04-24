"use client";

import { useEffect, useId, useState } from "react";
import {
  BookmarkIcon,
  CheckIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { ChevronDownIcon } from "@/components/icons/Icons";
import {
  CATEGORY_OPTIONS,
  EXPERIENCE_OPTIONS,
  JOB_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  POSTED_WITHIN_OPTIONS,
  SOURCE_OPTIONS,
  countActiveFilters,
  emptyJobFilters,
  type JobFilters,
  type SavedSearch,
} from "@/lib/jobs-data";

type FiltersSharedProps = {
  filters: JobFilters;
  onChange: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  savedSearches: SavedSearch[];
  activeSavedSearchId: string | null;
  onApplySavedSearch: (id: string) => void;
  onDeleteSavedSearch: (id: string) => void;
  onSaveCurrentSearch: (name: string) => void;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]"
    >
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 pr-9 text-[13px] text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
        />
      </div>
    </div>
  );
}

function SavedSearchRow({
  search,
  active,
  onApply,
  onDelete,
}: {
  search: SavedSearch;
  active: boolean;
  onApply: () => void;
  onDelete: () => void;
}) {
  const count = countActiveFilters(search.filters);
  return (
    <div
      className={`group flex items-center gap-2 rounded-[10px] border px-2.5 py-2 transition-colors ${
        active
          ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)]"
          : "border-transparent hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-2)]"
      }`}
    >
      <button
        type="button"
        onClick={onApply}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
        aria-pressed={active}
      >
        <span
          aria-hidden
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] ${
            active
              ? "bg-[color:var(--color-brand-500)] text-white"
              : "bg-[color:var(--color-surface)] text-[color:var(--color-brand-600)]"
          }`}
        >
          <BookmarkIcon size={13} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-[color:var(--color-text)]">
            {search.name}
          </span>
          <span className="block truncate text-[11px] text-[color:var(--color-text-muted)]">
            {count} {count === 1 ? "filter" : "filters"}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete saved search ${search.name}`}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] opacity-60 transition-opacity hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-error)] group-hover:opacity-100 sm:opacity-0"
      >
        <XIcon size={13} />
      </button>
    </div>
  );
}

/**
 * Shared content — no outer wrapper. Rendered inside both the desktop
 * sidebar and the mobile/tablet drawer.
 */
export function JobFiltersContent({
  filters,
  onChange,
  savedSearches,
  activeSavedSearchId,
  onApplySavedSearch,
  onDeleteSavedSearch,
  onSaveCurrentSearch,
}: FiltersSharedProps) {
  const keywordsId = useId();
  const [savePromptOpen, setSavePromptOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const activeCount = countActiveFilters(filters);
  const canSave = activeCount > 0;

  function handleSave() {
    const name = newName.trim();
    if (!name) return;
    onSaveCurrentSearch(name);
    setNewName("");
    setSavePromptOpen(false);
  }

  return (
    <>
      {/* Saved searches section */}
      <section className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-2.5">
        <div className="mb-2 flex items-center justify-between px-1">
          <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Saved Searches
          </h4>
          {!savePromptOpen ? (
            <button
              type="button"
              onClick={() => setSavePromptOpen(true)}
              disabled={!canSave}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--color-brand-600)] transition-colors enabled:hover:text-[color:var(--color-brand-700)] disabled:cursor-not-allowed disabled:text-[color:var(--color-text-muted)]"
            >
              <PlusIcon size={11} />
              Save current
            </button>
          ) : null}
        </div>

        {savePromptOpen ? (
          <div className="flex items-center gap-1.5 rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] p-1.5">
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setSavePromptOpen(false);
                  setNewName("");
                }
              }}
              placeholder="Name this search…"
              className="h-8 flex-1 rounded-[6px] border-0 bg-transparent px-2 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={!newName.trim()}
              aria-label="Save search"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[color:var(--color-brand-500)] text-white transition-colors enabled:hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:bg-[color:var(--color-border-strong)]"
            >
              <CheckIcon size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setSavePromptOpen(false);
                setNewName("");
              }}
              aria-label="Cancel"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            >
              <XIcon size={14} />
            </button>
          </div>
        ) : savedSearches.length === 0 ? (
          <p className="px-1 py-1 text-[12px] text-[color:var(--color-text-muted)]">
            Apply filters, then save them here for one-click reuse.
          </p>
        ) : (
          <div className="space-y-0.5">
            {savedSearches.map((s) => (
              <SavedSearchRow
                key={s.id}
                search={s}
                active={activeSavedSearchId === s.id}
                onApply={() => onApplySavedSearch(s.id)}
                onDelete={() => onDeleteSavedSearch(s.id)}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-4 space-y-3">
        <div>
          <FieldLabel htmlFor={keywordsId}>Keywords</FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
              <SearchIcon size={14} />
            </span>
            <input
              id={keywordsId}
              type="text"
              value={filters.keywords}
              onChange={(e) => onChange("keywords", e.target.value)}
              placeholder="Title, skills, company…"
              className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-3 text-[13px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border-strong)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <SelectField
            label="Location"
            value={filters.location}
            onChange={(v) => onChange("location", v)}
            options={LOCATION_OPTIONS}
          />
          <SelectField
            label="Job Type"
            value={filters.jobType}
            onChange={(v) => onChange("jobType", v)}
            options={JOB_TYPE_OPTIONS}
          />
          <SelectField
            label="Experience Level"
            value={filters.experience}
            onChange={(v) => onChange("experience", v)}
            options={EXPERIENCE_OPTIONS}
          />
          <SelectField
            label="Category"
            value={filters.category}
            onChange={(v) => onChange("category", v)}
            options={CATEGORY_OPTIONS}
          />
          <SelectField
            label="Posted Within"
            value={filters.postedWithin}
            onChange={(v) => onChange("postedWithin", v)}
            options={POSTED_WITHIN_OPTIONS}
          />
          <SelectField
            label="Source"
            value={filters.source}
            onChange={(v) => onChange("source", v)}
            options={SOURCE_OPTIONS}
          />
        </div>
      </div>
    </>
  );
}

/**
 * Desktop sidebar wrapper (visible on xl+).
 */
export function JobFiltersPanel(props: FiltersSharedProps) {
  const activeCount = countActiveFilters(props.filters);

  function clearAll() {
    (Object.keys(emptyJobFilters) as (keyof JobFilters)[]).forEach((k) =>
      props.onChange(k, emptyJobFilters[k]),
    );
  }

  return (
    <aside
      aria-label="Job filters"
      className="hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 xl:block"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-bold text-[color:var(--color-text)]">
            Filters
          </h3>
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={clearAll}
          disabled={activeCount === 0}
          className="text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors enabled:hover:text-[color:var(--color-brand-700)] disabled:cursor-not-allowed disabled:text-[color:var(--color-text-muted)]"
        >
          Clear all
        </button>
      </header>
      <div className="mt-4">
        <JobFiltersContent {...props} />
      </div>
    </aside>
  );
}

/**
 * Mobile / tablet drawer — bottom sheet on phones, right slide-over on tablets.
 */
export function JobFiltersDrawer({
  open,
  onClose,
  resultsCount,
  ...props
}: FiltersSharedProps & {
  open: boolean;
  onClose: () => void;
  resultsCount: number;
}) {
  const activeCount = countActiveFilters(props.filters);

  function clearAll() {
    (Object.keys(emptyJobFilters) as (keyof JobFilters)[]).forEach((k) =>
      props.onChange(k, emptyJobFilters[k]),
    );
  }

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 xl:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[rgba(23,26,43,0.45)] transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel: bottom sheet on phones, right slide-over on tablets */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Job filters"
        className={`absolute flex flex-col bg-[color:var(--color-surface)] shadow-[var(--shadow-panel)] transition-transform duration-250 ease-out
          inset-x-0 bottom-0 max-h-[90vh] rounded-t-[22px]
          sm:inset-y-0 sm:right-0 sm:left-auto sm:bottom-auto sm:h-full sm:max-h-none sm:w-[400px] sm:rounded-l-[22px] sm:rounded-tr-none
          ${
            open
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-y-0 sm:translate-x-full"
          }`}
      >
        {/* Grabber (mobile only) */}
        <div className="flex justify-center pt-2.5 sm:hidden">
          <span
            aria-hidden
            className="block h-1 w-10 rounded-full bg-[color:var(--color-border-strong)]"
          />
        </div>

        <header className="flex items-center justify-between gap-2 px-5 pb-3 pt-3 sm:pt-5">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[color:var(--color-text)]">
              Filters
            </h2>
            {activeCount > 0 ? (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1.5 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <XIcon size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <JobFiltersContent {...props} />
        </div>

        <footer className="flex items-center gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-3">
          <button
            type="button"
            onClick={clearAll}
            disabled={activeCount === 0}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors enabled:hover:border-[color:var(--color-border-strong)] enabled:hover:text-[color:var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-[2] items-center justify-center rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            Show {resultsCount} {resultsCount === 1 ? "job" : "jobs"}
          </button>
        </footer>
      </div>
    </div>
  );
}
