"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CheckIcon,
  ShareIcon,
} from "@/components/icons/AppIcons";

export function JobDetailTopBar({
  shareUrl,
  title,
}: {
  shareUrl: string;
  title: string;
}) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  async function share() {
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    if (nav && "share" in nav) {
      try {
        await nav.share({ title, url: shareUrl });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    try {
      await nav?.clipboard?.writeText(shareUrl);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      /* ignored */
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-[14px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
      >
        <ArrowLeftIcon size={16} />
        Back to Jobs
      </Link>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from saved" : "Save job"}
          className={`inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] px-3 text-[13px] font-medium transition-colors ${
            saved
              ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
              : "bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          }`}
        >
          <BookmarkIcon size={16} />
          <span className="hidden sm:inline">
            {saved ? "Saved" : "Save"}
          </span>
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Share job"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
        >
          {shared ? (
            <>
              <span className="text-[color:var(--color-success)]">
                <CheckIcon size={16} />
              </span>
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <ShareIcon size={16} />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
