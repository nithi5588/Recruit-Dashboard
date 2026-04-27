"use client";

import { useState, useEffect, useRef } from "react";
import {
  CheckIcon,
  ChevronDown,
  SearchIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import type { Seniority, WorkMode } from "@/lib/matches/types";

const SENIORITY_OPTIONS: Seniority[] = ["Junior", "Mid", "Senior", "Lead", "Principal"];
const WORK_MODE_OPTIONS: WorkMode[] = ["Remote", "Hybrid", "On-site"];

export type FilterState = {
  roles: string[];
  seniority: Seniority[];
  locations: string[];
  workModes: WorkMode[];
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  scoreMin: number;
  scoreMax: number;
};

export const SALARY_HARD_MIN = 50_000;
export const SALARY_HARD_MAX = 300_000;

export const initialFilters = (): FilterState => ({
  roles: [],
  seniority: [],
  locations: [],
  workModes: [],
  salaryMin: SALARY_HARD_MIN,
  salaryMax: SALARY_HARD_MAX,
  skills: [],
  scoreMin: 0,
  scoreMax: 100,
});

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  active,
  defaultOpen = true,
  children,
}: {
  title: string;
  active?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[color:var(--color-border)] py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--color-text)]">
          {title}
          {active && active > 0 ? (
            <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1 text-[10px] font-bold text-white">
              {active}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={14}
          className={`text-[color:var(--color-text-muted)] transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </div>
  );
}

// ─── Multi-select with search ─────────────────────────────────────────────────

function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Search…",
  showSearch = true,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  showSearch?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-left text-[12.5px] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-500)]"
      >
        <span className="truncate">
          {value.length === 0
            ? <span className="text-[color:var(--color-text-muted)]">All {label.toLowerCase()}</span>
            : <span className="font-medium text-[color:var(--color-text)]">{value.length} selected</span>}
        </span>
        <ChevronDown size={13} className="text-[color:var(--color-text-muted)]" />
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full max-w-[240px] overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-lg">
          {showSearch && (
            <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] px-3 py-2">
              <SearchIcon size={13} className="text-[color:var(--color-text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-[12.5px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
              />
            </div>
          )}
          <div className="max-h-[220px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-center text-[12px] text-[color:var(--color-text-muted)]">No results</p>
            ) : (
              filtered.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(opt)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-[12.5px] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-base)]"
                  >
                    <span className="truncate">{opt}</span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-500)] text-white"
                          : "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]"
                      }`}
                    >
                      {checked && <CheckIcon size={10} />}
                    </span>
                  </button>
                );
              })
            )}
          </div>
          {value.length > 0 && (
            <div className="border-t border-[color:var(--color-border)] px-3 py-2">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] font-semibold text-[color:var(--color-brand-600)] hover:text-[color:var(--color-brand-700)]"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dual-handle range slider ─────────────────────────────────────────────────

function DualRange({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
  format: (n: number) => string;
}) {
  const range = max - min;
  const pctLo = ((valueMin - min) / range) * 100;
  const pctHi = ((valueMax - min) / range) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold tabular-nums text-[color:var(--color-text)]">
        <span>{format(valueMin)}</span>
        <span className="text-[color:var(--color-text-muted)]">—</span>
        <span>{format(valueMax)}</span>
      </div>
      <div className="relative h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[color:var(--color-border)]" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[color:var(--color-brand-500)]"
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
        />
        <input
          type="range"
          aria-label="Minimum"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const lo = Math.min(parseInt(e.target.value, 10), valueMax - step);
            onChange(lo, valueMax);
          }}
          className="dual-range pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent"
          style={{ zIndex: pctLo > 50 ? 4 : 3 }}
        />
        <input
          type="range"
          aria-label="Maximum"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const hi = Math.max(parseInt(e.target.value, 10), valueMin + step);
            onChange(valueMin, hi);
          }}
          className="dual-range pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent"
          style={{ zIndex: 4 }}
        />
      </div>
      <style jsx>{`
        .dual-range::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #273DC0;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
          cursor: pointer;
        }
        .dual-range::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: white;
          border: 2px solid #273DC0;
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.18);
          cursor: pointer;
        }
        .dual-range::-webkit-slider-runnable-track,
        .dual-range::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

// ─── Segmented control (multi-select for work mode) ───────────────────────────

function Segmented({
  options,
  value,
  onChange,
}: {
  options: WorkMode[];
  value: WorkMode[];
  onChange: (v: WorkMode[]) => void;
}) {
  return (
    <div className="flex w-full overflow-hidden rounded-md border border-[color:var(--color-border)]">
      {options.map((opt, i) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() =>
              onChange(active ? value.filter((v) => v !== opt) : [...value, opt])
            }
            className={`flex-1 px-2 py-1.5 text-[11.5px] font-semibold transition-colors ${
              i > 0 ? "border-l border-[color:var(--color-border)]" : ""
            } ${
              active
                ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-700)]"
                : "bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-base)]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── Checkbox group ───────────────────────────────────────────────────────────

function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: Seniority[];
  value: Seniority[];
  onChange: (v: Seniority[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => {
        const checked = value.includes(opt);
        return (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-[12.5px] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-base)]"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(checked ? value.filter((v) => v !== opt) : [...value, opt])
              }
              className="h-3.5 w-3.5 rounded border-[color:var(--color-border-strong)] text-[color:var(--color-brand-600)] accent-[color:var(--color-brand-500)]"
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Main rail ────────────────────────────────────────────────────────────────

function fmtSalary(n: number): string {
  return `$${(n / 1000).toFixed(0)}K`;
}

export function MatchFilterRail({
  filters,
  onChange,
  roles,
  locations,
  skills,
  activeCount,
  onClearAll,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  roles: string[];
  locations: string[];
  skills: string[];
  activeCount: number;
  onClearAll: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-[color:var(--color-text)]">Filters</h2>
        {activeCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-brand-700)]">
            {activeCount} active
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <Section title="Role" active={filters.roles.length}>
          <MultiSelect
            label="Roles"
            options={roles}
            value={filters.roles}
            onChange={(v) => onChange({ ...filters, roles: v })}
            placeholder="Search roles…"
          />
        </Section>

        <Section title="Seniority" active={filters.seniority.length}>
          <CheckboxGroup
            options={SENIORITY_OPTIONS}
            value={filters.seniority}
            onChange={(v) => onChange({ ...filters, seniority: v })}
          />
        </Section>

        <Section title="Location" active={filters.locations.length}>
          <MultiSelect
            label="Locations"
            options={locations}
            value={filters.locations}
            onChange={(v) => onChange({ ...filters, locations: v })}
            placeholder="Search locations…"
          />
        </Section>

        <Section title="Work mode" active={filters.workModes.length}>
          <Segmented
            options={WORK_MODE_OPTIONS}
            value={filters.workModes}
            onChange={(v) => onChange({ ...filters, workModes: v })}
          />
        </Section>

        <Section
          title="Salary range"
          active={
            filters.salaryMin !== SALARY_HARD_MIN || filters.salaryMax !== SALARY_HARD_MAX
              ? 1
              : 0
          }
        >
          <DualRange
            min={SALARY_HARD_MIN}
            max={SALARY_HARD_MAX}
            step={5_000}
            valueMin={filters.salaryMin}
            valueMax={filters.salaryMax}
            onChange={(lo, hi) => onChange({ ...filters, salaryMin: lo, salaryMax: hi })}
            format={fmtSalary}
          />
        </Section>

        <Section title="Skills" active={filters.skills.length}>
          <MultiSelect
            label="Skills"
            options={skills}
            value={filters.skills}
            onChange={(v) => onChange({ ...filters, skills: v })}
            placeholder="Search skills…"
          />
        </Section>

        <Section
          title="Match score"
          active={filters.scoreMin !== 0 || filters.scoreMax !== 100 ? 1 : 0}
        >
          <DualRange
            min={0}
            max={100}
            step={5}
            valueMin={filters.scoreMin}
            valueMax={filters.scoreMax}
            onChange={(lo, hi) => onChange({ ...filters, scoreMin: lo, scoreMax: hi })}
            format={(n) => `${n}`}
          />
        </Section>
      </div>

      {activeCount > 0 && (
        <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-base)] px-4 py-3">
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[color:var(--color-brand-600)] hover:text-[color:var(--color-brand-700)]"
          >
            <XIcon size={12} />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
