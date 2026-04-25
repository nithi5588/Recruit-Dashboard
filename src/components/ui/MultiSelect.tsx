"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Add, TickCircle } from "iconsax-reactjs";
import { ChevronDownIcon } from "@/components/icons/Icons";

export function MultiSelect({
  placeholder,
  options,
  values,
  onChange,
  buttonLabel,
}: {
  placeholder: string;
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouse);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(option: string) {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else {
      onChange([...values, option]);
    }
  }

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? values[0]
        : `${values.length} selected`;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={buttonLabel ?? placeholder}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border bg-[color:var(--color-surface)] px-3 text-left text-[14px] outline-none transition-colors hover:border-[color:var(--color-border-strong)] focus-visible:shadow-[var(--shadow-ring-brand)] ${
          open
            ? "border-[color:var(--color-brand-500)]"
            : "border-[color:var(--color-border)]"
        }`}
      >
        <span
          className={
            values.length === 0
              ? "text-[color:var(--color-text-muted)]"
              : "text-[color:var(--color-text)]"
          }
        >
          {summary}
        </span>
        <ChevronDownIcon
          size={14}
          className="text-[color:var(--color-text-muted)]"
        />
      </button>

      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-[8px] bg-[color:var(--color-brand-100)] px-2 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]"
            >
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => toggle(v)}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-200)]"
              >
                <Add
                  size={12}
                  color="currentColor"
                  variant="Linear"
                  style={{ transform: "rotate(45deg)" }}
                />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {open ? (
        <ul
          role="listbox"
          aria-multiselectable
          aria-labelledby={triggerId}
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] py-1 shadow-[var(--shadow-dropdown)]"
        >
          {options.map((option) => {
            const selected = values.includes(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => toggle(option)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                    selected
                      ? "text-[color:var(--color-brand-600)]"
                      : "text-[color:var(--color-text)]"
                  }`}
                >
                  <span>{option}</span>
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      selected
                        ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-500)] text-white"
                        : "border-[color:var(--color-border-strong)] bg-transparent"
                    }`}
                  >
                    {selected ? (
                      <TickCircle size={11} color="currentColor" variant="Bold" />
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
