"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element labelling the modal (usually the title) */
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const fallbackLabelId = `${autoId}-title`;

  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog
    const timer = window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={handleBackdrop}
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/40 px-0 py-0 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-6"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy ?? fallbackLabelId}
        className={`relative flex max-h-[95vh] w-full max-w-[900px] flex-col overflow-hidden rounded-t-[20px] bg-[color:var(--color-surface)] shadow-[var(--shadow-panel)] sm:max-h-[calc(100vh-3rem)] sm:rounded-[20px] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
