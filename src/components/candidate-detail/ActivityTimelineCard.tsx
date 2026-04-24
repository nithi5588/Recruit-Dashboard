import { ChevronDown, FilterIcon } from "@/components/icons/AppIcons";
import type { ActivityEntry } from "@/lib/candidate-detail";
import { activityTheme } from "@/components/candidate-detail/activity-shared";

function TimelineRow({
  entry,
  isLast,
}: {
  entry: ActivityEntry;
  isLast: boolean;
}) {
  const theme = activityTheme(entry.kind);
  return (
    <li className="relative flex gap-3 sm:gap-4">
      <div className="relative flex w-10 shrink-0 justify-center">
        <span
          aria-hidden
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-[12px]"
          style={{ background: theme.bg, color: theme.fg }}
        >
          {theme.icon}
        </span>
        {!isLast ? (
          <span
            aria-hidden
            className="absolute left-1/2 top-11 w-px -translate-x-1/2 bg-[color:var(--color-border)]"
            style={{ bottom: "-24px" }}
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold leading-[20px] text-[color:var(--color-text)]">
            {entry.title}
          </h3>
          <span className="shrink-0 text-[12px] text-[color:var(--color-text-muted)]">
            {entry.time}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
          {entry.description}
        </p>
        <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">
          By{" "}
          <span className="font-semibold text-[color:var(--color-text-secondary)]">
            {entry.author}
          </span>
        </p>
      </div>
    </li>
  );
}

export function ActivityTimelineCard({
  activities,
}: {
  activities: ActivityEntry[];
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Activity
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            A timeline of all actions and updates related to this candidate
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
        >
          <FilterIcon size={16} />
          Filter
        </button>
      </header>

      {activities.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-10 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No activity recorded for this candidate yet.
        </p>
      ) : (
        <>
          <ol>
            {activities.map((entry, idx) => (
              <TimelineRow
                key={entry.id}
                entry={entry}
                isLast={idx === activities.length - 1}
              />
            ))}
          </ol>

          <div className="mt-2 flex justify-center border-t border-[color:var(--color-border)] pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
            >
              <ChevronDown size={14} />
              Load more
            </button>
          </div>
        </>
      )}
    </section>
  );
}
