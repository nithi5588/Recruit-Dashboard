"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { label: string; slug: string; enabled: boolean };

const TABS: Tab[] = [
  { label: "Overview", slug: "", enabled: true },
  { label: "Resumes", slug: "resumes", enabled: true },
  { label: "Experience", slug: "experience", enabled: true },
  { label: "Skills", slug: "skills", enabled: true },
  { label: "Projects", slug: "projects", enabled: true },
  { label: "Notes", slug: "notes", enabled: true },
  { label: "Applications", slug: "applications", enabled: true },
  { label: "Activity", slug: "activity", enabled: true },
];

export function ProfileTabs({ candidateId }: { candidateId: string }) {
  const pathname = usePathname() ?? "";
  const base = `/candidates/${candidateId}`;

  function isActive(slug: string) {
    if (slug === "") return pathname === base;
    return pathname === `${base}/${slug}`;
  }

  return (
    <div className="border-b border-[color:var(--color-border)]">
      <nav
        aria-label="Candidate sections"
        className="-mb-px flex items-center gap-1 overflow-x-auto"
      >
        {TABS.map((tab) => {
          const href = tab.slug ? `${base}/${tab.slug}` : base;
          const active = isActive(tab.slug);

          if (!tab.enabled) {
            return (
              <button
                key={tab.label}
                type="button"
                disabled
                title="Coming soon"
                aria-label={`${tab.label} — coming soon`}
                className="relative cursor-not-allowed whitespace-nowrap px-4 py-3 text-[13px] font-semibold text-[color:var(--color-text-muted)]"
              >
                {tab.label}
              </button>
            );
          }

          return (
            <Link
              key={tab.label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative whitespace-nowrap px-4 py-3 text-[13px] font-semibold transition-colors focus-visible:outline-none ${
                active
                  ? "text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {tab.label}
              {active ? (
                <span
                  aria-hidden
                  className="absolute inset-x-3 -bottom-px h-[3px] rounded-t-full bg-[color:var(--color-brand-500)]"
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
