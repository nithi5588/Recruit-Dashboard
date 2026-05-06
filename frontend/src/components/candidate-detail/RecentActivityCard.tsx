import Link from "next/link";
import { ChevronRight } from "@/components/icons/AppIcons";
import type { ActivityEntry } from "@/lib/candidate-detail";
import { activityTheme } from "@/components/candidate-detail/activity-shared";

export function RecentActivityCard({
  activity,
  candidateId,
  title = "Recent Activity",
  showViewAll = true,
}: {
  activity: ActivityEntry[];
  candidateId: string;
  title?: string;
  showViewAll?: boolean;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          {title}
        </h3>
        {showViewAll ? (
          <Link
            href={`/candidates/${candidateId}/activity`}
            className="link-brand inline-flex items-center gap-1 text-[12px]"
          >
            View all
            <ChevronRight size={12} />
          </Link>
        ) : null}
      </header>

      {activity.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-6 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No activity yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {activity.map((a) => {
            const theme = activityTheme(a.kind, 14);
            return (
              <li key={a.id} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
                  style={{ background: theme.bg, color: theme.fg }}
                >
                  {theme.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                      {a.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-[color:var(--color-text-muted)]">
                      {a.time}
                    </span>
                  </div>
                  <p className="text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
                    By {a.author}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showViewAll && activity.length > 0 ? (
        <Link
          href={`/candidates/${candidateId}/activity`}
          className="link-brand mt-4 inline-flex items-center gap-1 text-[12px]"
        >
          View all activities
          <ChevronRight size={12} />
        </Link>
      ) : null}
    </section>
  );
}
