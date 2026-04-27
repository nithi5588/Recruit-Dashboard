"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ChevronRight,
  SparklesIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";

const SUGGESTIONS = [
  "Find top React engineers available now",
  "Summarise my pipeline for this week",
  "Which candidates need a follow-up today?",
  "Match candidates to my latest job",
  "Show interviews scheduled tomorrow",
];

export function AskAIPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setValue("");
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
  }, [open]);

  // Outside click + ESC
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent | globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey as EventListener);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey as EventListener);
    };
  }, [open]);

  // ⌘/Ctrl + J to open
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const isMac =
        typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function submit(prompt: string) {
    const q = prompt.trim();
    if (!q) return;
    close();
    router.push(`/assistant?q=${encodeURIComponent(q)}`);
  }

  function onTextareaKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Ask Recruit AI"
        onClick={() => setOpen((o) => !o)}
        data-state={open ? "open" : "closed"}
        className="group relative inline-flex h-10 items-center gap-1.5 px-2 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)] data-[state=open]:text-[color:var(--color-text)]"
      >
        <SparklesIcon size={15} className="text-[color:var(--color-brand-500)]" />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Ask Recruit AI"
          className="absolute right-0 top-full z-50 mt-2 w-[min(94vw,420px)] overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
        >
          <header className="relative px-4 pb-3 pt-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] text-white"
                  style={{ background: "var(--color-brand-500)" }}
                >
                  <SparklesIcon size={14} />
                </span>
                <div className="leading-tight">
                  <p className="text-[14px] font-bold text-[color:var(--color-text)]">
                    Ask Recruit AI
                  </p>
                  <p className="text-[11px] text-[color:var(--color-text-secondary)]">
                    Anything about candidates, jobs or your pipeline
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
              >
                <XIcon size={13} />
              </button>
            </div>
          </header>

          <div className="px-4 pb-3">
            <div className="relative rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] focus-within:border-[color:var(--color-brand-500)] focus-within:shadow-[var(--shadow-ring-brand)]">
              <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onTextareaKeyDown}
                rows={2}
                placeholder="Ask anything…"
                className="block w-full resize-none rounded-[12px] bg-transparent px-3 py-2.5 pr-10 text-[13.5px] leading-[20px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)]"
              />
              <button
                type="button"
                onClick={() => submit(value)}
                disabled={!value.trim()}
                aria-label="Submit question"
                className="absolute right-1.5 bottom-1.5 inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[color:var(--color-brand-500)] text-white transition-all hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:bg-[color:var(--color-surface-2)] disabled:text-[color:var(--color-text-muted)]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10.5px] text-[color:var(--color-text-muted)]">
              <span>
                Press{" "}
                <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-1 py-0.5 font-medium">
                  Enter
                </kbd>{" "}
                to send,{" "}
                <kbd className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-1 py-0.5 font-medium">
                  Shift+Enter
                </kbd>{" "}
                for newline
              </span>
            </div>
          </div>

          <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-4 py-3">
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-wider text-[color:var(--color-text-muted)]">
              Try asking
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => submit(s)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11.5px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
                  >
                    <SparklesIcon size={10} />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <footer className="flex items-center justify-between gap-2 border-t border-[color:var(--color-border)] px-4 py-2.5">
            <p className="inline-flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
              <UsersIcon size={11} />
              Answers use your team&apos;s candidate &amp; job data
            </p>
            <button
              type="button"
              onClick={() => {
                close();
                router.push("/assistant");
              }}
              className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
            >
              Open full assistant
              <ChevronRight size={11} />
            </button>
          </footer>
        </div>
      ) : null}
    </div>
  );
}
