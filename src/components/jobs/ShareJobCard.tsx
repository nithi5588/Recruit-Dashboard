"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, ShareIcon } from "@/components/icons/AppIcons";

export function ShareJobCard({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select the input so the user can copy manually
      const input = document.getElementById(
        "share-job-url",
      ) as HTMLInputElement | null;
      input?.select();
    }
  }

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
        >
          <ShareIcon size={16} />
        </span>
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Share Job
        </h3>
      </header>

      <p className="mb-2 text-[12px] text-[color:var(--color-text-secondary)]">
        Copy link to share this job
      </p>

      <div className="flex items-center gap-2">
        <input
          id="share-job-url"
          readOnly
          value={shareUrl}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Shareable job link"
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 text-[13px] text-[color:var(--color-text-secondary)] outline-none focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
        />
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
        >
          {copied ? (
            <span className="text-[color:var(--color-success)]">
              <CheckIcon size={16} />
            </span>
          ) : (
            <CopyIcon size={16} />
          )}
        </button>
      </div>
      {copied ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-2 text-[12px] font-semibold text-[color:var(--color-success)]"
        >
          Link copied to clipboard
        </p>
      ) : null}
    </section>
  );
}
