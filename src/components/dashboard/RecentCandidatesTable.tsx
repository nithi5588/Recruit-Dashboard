import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScoreRing } from "@/components/ui/ScoreRing";
import {
  ChevronLeft,
  ChevronRight,
  FilterIcon,
  MoreIcon,
  PinIcon,
  SortIcon,
} from "@/components/icons/AppIcons";
import { candidates } from "@/lib/sample-data";

const rows = candidates.slice(0, 5);

export function RecentCandidatesTable() {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h3 className="text-[16px] font-semibold text-[color:var(--color-text)]">
          Recent Candidates
        </h3>
        <div className="flex items-center gap-2">
          <Link
            href="/candidates"
            className="link-brand text-[13px] font-semibold"
          >
            View all candidates
          </Link>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <FilterIcon size={16} />
            Filter
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <SortIcon size={16} />
            Recently Updated
            <svg
              aria-hidden
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[color:var(--color-text-secondary)]">
              <th className="w-10 px-5 py-3">
                <Checkbox aria-label="Select all candidates" />
              </th>
              <th className="py-3 pr-4">Candidate</th>
              <th className="hidden py-3 pr-4 md:table-cell">Title / Skills</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Experience</th>
              <th className="hidden py-3 pr-4 lg:table-cell">Location</th>
              <th className="py-3 pr-4">Status</th>
              <th className="hidden py-3 pr-4 sm:table-cell">Match Score</th>
              <th className="hidden py-3 pr-4 xl:table-cell">Updated</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[color:var(--color-border)] last:border-b-0 transition-colors hover:bg-[color:var(--color-surface-2)]/50"
              >
                <td className="px-5 py-4 align-middle">
                  <Checkbox aria-label={`Select ${c.name}`} />
                </td>
                <td className="py-4 pr-4 align-middle">
                  <Link
                    href={`/candidates/${c.id}`}
                    className="flex items-center gap-3 transition-colors hover:text-[color:var(--color-brand-600)]"
                  >
                    <Avatar name={c.name} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                        {c.name}
                      </p>
                      <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                        {c.role}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="hidden py-4 pr-4 align-middle md:table-cell">
                  <p className="text-[13px] text-[color:var(--color-text)]">
                    {c.skills.slice(0, 3).join(", ")}
                  </p>
                  {c.skills.length > 3 ? (
                    <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                      {c.skills.slice(3).join(", ")}
                    </p>
                  ) : null}
                </td>
                <td className="hidden py-4 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] xl:table-cell">
                  {c.experience}
                </td>
                <td className="hidden py-4 pr-4 align-middle lg:table-cell">
                  <p className="inline-flex items-center gap-1 text-[13px] text-[color:var(--color-text-secondary)]">
                    <PinIcon size={14} />
                    {c.location}
                  </p>
                </td>
                <td className="py-4 pr-4 align-middle">
                  <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                </td>
                <td className="hidden py-4 pr-4 align-middle sm:table-cell">
                  <ScoreRing value={c.score} size={40} stroke={4} />
                </td>
                <td className="hidden py-4 pr-4 align-middle text-[13px] text-[color:var(--color-text-secondary)] xl:table-cell">
                  {c.updated}
                </td>
                <td className="px-4 py-4 align-middle">
                  <button
                    type="button"
                    aria-label={`Actions for ${c.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
                  >
                    <MoreIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-[13px] text-[color:var(--color-text-secondary)]">
          Showing 1 to 5 of 126 candidates
        </p>
        <nav
          aria-label="Pagination"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              aria-current={n === 1 ? "page" : undefined}
              className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] px-2 text-[13px] font-semibold transition-colors ${
                n === 1
                  ? "bg-[color:var(--color-brand-500)] text-white"
                  : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="px-2 text-[color:var(--color-text-muted)]">…</span>
          <button
            type="button"
            className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] border border-[color:var(--color-border)] px-2 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            16
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      </footer>
    </section>
  );
}
