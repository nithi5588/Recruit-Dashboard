"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft2,
  ArrowRight2,
  Calendar,
  CloseCircle,
} from "iconsax-reactjs";

export type DateRange = { start: Date; end: Date };

type Preset = {
  key: string;
  label: string;
  compute: (today: Date) => DateRange;
};

// ─── Date helpers ────────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const PRESETS: Preset[] = [
  {
    key: "today",
    label: "Today",
    compute: (t) => ({ start: startOfDay(t), end: endOfDay(t) }),
  },
  {
    key: "yesterday",
    label: "Yesterday",
    compute: (t) => {
      const y = addDays(t, -1);
      return { start: startOfDay(y), end: endOfDay(y) };
    },
  },
  {
    key: "7d",
    label: "Last 7 days",
    compute: (t) => ({ start: startOfDay(addDays(t, -6)), end: endOfDay(t) }),
  },
  {
    key: "14d",
    label: "Last 14 days",
    compute: (t) => ({ start: startOfDay(addDays(t, -13)), end: endOfDay(t) }),
  },
  {
    key: "30d",
    label: "Last 30 days",
    compute: (t) => ({ start: startOfDay(addDays(t, -29)), end: endOfDay(t) }),
  },
  {
    key: "thisMonth",
    label: "This month",
    compute: (t) => ({
      start: new Date(t.getFullYear(), t.getMonth(), 1),
      end: endOfDay(t),
    }),
  },
  {
    key: "lastMonth",
    label: "Last month",
    compute: (t) => {
      const first = new Date(t.getFullYear(), t.getMonth() - 1, 1);
      const last = new Date(t.getFullYear(), t.getMonth(), 0);
      return { start: first, end: endOfDay(last) };
    },
  },
  {
    key: "qtd",
    label: "Quarter to date",
    compute: (t) => {
      const qStart = new Date(t.getFullYear(), Math.floor(t.getMonth() / 3) * 3, 1);
      return { start: qStart, end: endOfDay(t) };
    },
  },
  {
    key: "ytd",
    label: "Year to date",
    compute: (t) => ({
      start: new Date(t.getFullYear(), 0, 1),
      end: endOfDay(t),
    }),
  },
];

// ─── Public helpers ──────────────────────────────────────────────────────────

export function previousPeriod(range: DateRange): DateRange {
  const ms = range.end.getTime() - range.start.getTime() + 1;
  const endMs = range.start.getTime() - 1;
  return {
    start: startOfDay(new Date(endMs - ms + 1)),
    end: endOfDay(new Date(endMs)),
  };
}

export function formatRange(
  r: DateRange,
  opts: { short?: boolean } = {},
): string {
  const s = r.start;
  const e = r.end;
  const sameYear = s.getFullYear() === e.getFullYear();
  const sameMonth = sameYear && s.getMonth() === e.getMonth();
  const sm = s.toLocaleDateString(undefined, { month: "short" });
  const em = e.toLocaleDateString(undefined, { month: "short" });
  const sd = s.getDate();
  const ed = e.getDate();

  if (opts.short) {
    if (sameMonth) return `${sm} ${sd}–${ed}`;
    if (sameYear) return `${sm} ${sd} – ${em} ${ed}`;
    return `${sm} ${sd}, ${s.getFullYear()} – ${em} ${ed}, ${e.getFullYear()}`;
  }
  if (sameYear)
    return `${sm} ${sd} – ${em} ${ed}, ${e.getFullYear()}`;
  return `${sm} ${sd}, ${s.getFullYear()} – ${em} ${ed}, ${e.getFullYear()}`;
}

export function rangeFromPreset(key: string, today: Date = new Date()): DateRange | null {
  const p = PRESETS.find((x) => x.key === key);
  return p ? p.compute(today) : null;
}

// ─── Calendar component ──────────────────────────────────────────────────────

function CalendarMonth({
  month,
  pendingStart,
  pendingEnd,
  hover,
  onHover,
  onSelect,
}: {
  month: Date;
  pendingStart: Date | null;
  pendingEnd: Date | null;
  hover: Date | null;
  onHover: (d: Date | null) => void;
  onSelect: (d: Date) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = first.getDay();
  const gridStart = addDays(first, -startOffset);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  // Range for preview highlighting
  let rangeStart = pendingStart;
  let rangeEnd = pendingEnd;
  if (rangeStart && !rangeEnd && hover) {
    if (hover >= rangeStart) {
      rangeEnd = hover;
    } else {
      rangeEnd = rangeStart;
      rangeStart = hover;
    }
  }

  return (
    <div>
      <div className="grid grid-cols-7">
        {dayLabels.map((l, i) => (
          <div
            key={i}
            className="flex h-7 items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]"
          >
            {l}
          </div>
        ))}
      </div>
      <div className="mt-0.5 grid grid-cols-7">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === month.getMonth();
          const isToday = isSameDay(d, today);
          const startDay = pendingStart ? isSameDay(d, pendingStart) : false;
          const endDay = pendingEnd ? isSameDay(d, pendingEnd) : false;
          const isEndpoint = startDay || endDay;
          const dayStart = startOfDay(d);
          const inRange =
            rangeStart &&
            rangeEnd &&
            dayStart >= startOfDay(rangeStart) &&
            dayStart <= startOfDay(rangeEnd);

          // Connect bar edges on range boundaries
          const showStartBar =
            inRange && rangeStart && !isSameDay(d, rangeStart);
          const showEndBar = inRange && rangeEnd && !isSameDay(d, rangeEnd);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(d)}
              onMouseEnter={() => onHover(d)}
              onMouseLeave={() => onHover(null)}
              aria-label={d.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              aria-pressed={isEndpoint}
              className="relative flex h-9 items-center justify-center"
            >
              {/* Range fill bar */}
              {inRange && !isEndpoint ? (
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 right-0 bg-[color:var(--color-brand-50)]"
                />
              ) : null}
              {/* Left half fill (continues from previous) */}
              {isEndpoint && inRange && showStartBar ? (
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 right-1/2 bg-[color:var(--color-brand-50)]"
                />
              ) : null}
              {/* Right half fill (continues to next) */}
              {isEndpoint && inRange && showEndBar ? (
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1/2 right-0 bg-[color:var(--color-brand-50)]"
                />
              ) : null}

              <span
                className={`relative z-[1] flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-medium transition-colors ${
                  isEndpoint
                    ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_10px_rgba(234,104,20,0.28)]"
                    : inRange
                    ? "text-[color:var(--color-brand-700)]"
                    : inMonth
                    ? "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
                    : "text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                }`}
                style={
                  isToday && !isEndpoint
                    ? {
                        boxShadow:
                          "inset 0 0 0 1.5px var(--color-brand-400)",
                      }
                    : undefined
                }
              >
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Date Range Picker ───────────────────────────────────────────────────────

export function DateRangePicker({
  value,
  onChange,
  variant = "primary",
  align = "right",
  showPresets = true,
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
  variant?: "primary" | "secondary";
  align?: "left" | "right";
  showPresets?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(
    new Date(value.start.getFullYear(), value.start.getMonth(), 1),
  );
  const [pendingStart, setPendingStart] = useState<Date | null>(value.start);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(value.end);
  const [hover, setHover] = useState<Date | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);

  // Close on outside click / escape + lock body scroll on mobile
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    // Body scroll lock while popup is open on mobile
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const prevOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function openPicker() {
    setPendingStart(value.start);
    setPendingEnd(value.end);
    setMonth(new Date(value.start.getFullYear(), value.start.getMonth(), 1));
    setHover(null);
    setOpen(true);
  }

  function handleSelect(d: Date) {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(startOfDay(d));
      setPendingEnd(null);
      setHover(null);
      return;
    }
    if (d < pendingStart) {
      setPendingEnd(endOfDay(pendingStart));
      setPendingStart(startOfDay(d));
    } else {
      setPendingEnd(endOfDay(d));
    }
  }

  function applyPreset(p: Preset) {
    const r = p.compute(today);
    setPendingStart(r.start);
    setPendingEnd(r.end);
    setMonth(new Date(r.start.getFullYear(), r.start.getMonth(), 1));
    // Auto-apply presets
    onChange(r);
    setOpen(false);
  }

  function apply() {
    if (pendingStart && pendingEnd) {
      onChange({ start: startOfDay(pendingStart), end: endOfDay(pendingEnd) });
      setOpen(false);
    }
  }

  function cancel() {
    setPendingStart(value.start);
    setPendingEnd(value.end);
    setOpen(false);
  }

  const activePresetKey = PRESETS.find((p) => {
    const r = p.compute(today);
    return isSameDay(r.start, value.start) && isSameDay(r.end, value.end);
  })?.key;

  const buttonClass =
    variant === "primary"
      ? "flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)]"
      : "flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-medium text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] transition-colors hover:bg-[color:var(--color-surface-2)]";

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={buttonClass}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Calendar
          size={13}
          variant="Bulk"
          color={
            variant === "primary"
              ? "var(--color-brand-500)"
              : "var(--color-text-muted)"
          }
        />
        <span className="hidden sm:inline">{formatRange(value)}</span>
        <span className="sm:hidden">{formatRange(value, { short: true })}</span>
        <span
          aria-hidden
          className={`text-[color:var(--color-text-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open ? (
        <>
          {/* Mobile backdrop */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-[rgba(31,27,23,0.5)] sm:hidden"
          />
          <div
            role="dialog"
            aria-label="Select date range"
            className={`fixed inset-x-0 bottom-0 z-[90] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[20px] border border-b-0 border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_-12px_32px_rgba(31,27,23,0.18)] sm:absolute sm:inset-x-auto sm:bottom-auto sm:top-full sm:mt-2 sm:max-h-none sm:rounded-[14px] sm:border-b sm:shadow-[var(--shadow-panel)] ${
              align === "right" ? "sm:right-0" : "sm:left-0"
            }`}
          >
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          {/* Mobile-only sheet header: grabber + title + close */}
          <div className="relative flex items-center gap-2 border-b border-[color:var(--color-border)] px-4 pb-2.5 pt-3 sm:hidden">
            <span
              aria-hidden
              className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-[color:var(--color-border-strong)]"
            />
            <h3 className="flex-1 text-[14px] font-bold text-[color:var(--color-text)]">
              Select date range
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              <CloseCircle size={14} variant="Bold" color="currentColor" />
            </button>
          </div>

          {/* Presets — wrapping pills on mobile, vertical column on desktop */}
          {showPresets ? (
            <div className="flex shrink-0 flex-wrap gap-1.5 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50 px-3 py-3 sm:flex-col sm:flex-nowrap sm:gap-0.5 sm:w-[148px] sm:border-b-0 sm:border-r sm:p-2">
              {PRESETS.map((p) => {
                const active = activePresetKey === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`whitespace-nowrap rounded-[999px] px-2.5 py-1 text-[12px] font-semibold transition-colors sm:rounded-[8px] sm:px-3 sm:py-1.5 sm:text-left sm:font-medium ${
                      active
                        ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_10px_rgba(234,104,20,0.25)]"
                        : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)] sm:border-0 sm:bg-transparent sm:hover:bg-[color:var(--color-surface)]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Calendar */}
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto p-3 sm:min-w-[290px] sm:flex-none sm:overflow-visible sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
                }
                aria-label="Previous month"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <ArrowLeft2 size={14} variant="Linear" color="currentColor" />
              </button>
              <div className="flex items-center gap-1">
                <select
                  aria-label="Month"
                  value={month.getMonth()}
                  onChange={(e) =>
                    setMonth(
                      new Date(month.getFullYear(), Number(e.target.value), 1),
                    )
                  }
                  className="appearance-none rounded-[6px] bg-transparent px-1.5 py-1 text-[13px] font-semibold text-[color:var(--color-text)] outline-none hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)]"
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((name, i) => (
                    <option key={name} value={i}>
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Year"
                  value={month.getFullYear()}
                  onChange={(e) =>
                    setMonth(
                      new Date(Number(e.target.value), month.getMonth(), 1),
                    )
                  }
                  className="appearance-none rounded-[6px] bg-transparent px-1 py-1 text-[13px] font-semibold text-[color:var(--color-text)] outline-none hover:bg-[color:var(--color-surface-2)] focus:bg-[color:var(--color-surface-2)]"
                >
                  {Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i).map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <button
                type="button"
                onClick={() =>
                  setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
                }
                aria-label="Next month"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              >
                <ArrowRight2 size={14} variant="Linear" color="currentColor" />
              </button>
            </div>

            <CalendarMonth
              month={month}
              pendingStart={pendingStart}
              pendingEnd={pendingEnd}
              hover={hover}
              onHover={setHover}
              onSelect={handleSelect}
            />
          </div>
          </div>

          {/* Footer — pinned at bottom on mobile, sits inline on desktop */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 sm:px-4">
            <span className="min-w-0 truncate text-[12px] text-[color:var(--color-text-secondary)]">
              {pendingStart ? (
                <>
                  <span className="font-semibold text-[color:var(--color-text)]">
                    {pendingStart.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="mx-1.5 text-[color:var(--color-text-muted)]">
                    →
                  </span>
                  {pendingEnd ? (
                    <span className="font-semibold text-[color:var(--color-text)]">
                      {pendingEnd.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="italic text-[color:var(--color-text-muted)]">
                      pick end date
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[color:var(--color-text-muted)]">
                  Select a start date
                </span>
              )}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={cancel}
                className="h-9 rounded-[8px] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)] sm:h-7 sm:rounded-[6px] sm:px-2.5 sm:text-[11px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!pendingStart || !pendingEnd}
                onClick={apply}
                className="h-9 rounded-[8px] bg-[color:var(--color-brand-500)] px-4 text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(234,104,20,0.25)] transition-all enabled:hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:h-7 sm:rounded-[6px] sm:px-3 sm:text-[11px]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        </>
      ) : null}
    </div>
  );
}
