import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, PhoneIcon } from "@/components/icons/AppIcons";
import { todaysSchedule, type ScheduleItem } from "@/lib/sample-data";

function ActionPill({ action }: { action: ScheduleItem["action"] }) {
  if (action.tone === "purple") {
    return (
      <button
        type="button"
        className="inline-flex h-7 items-center gap-1 rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-100)] px-2.5 text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-200)]"
      >
        <PhoneIcon size={12} />
        {action.label}
      </button>
    );
  }
  return (
    <Badge tone={action.tone === "orange" ? "orange" : "blue"}>
      {action.label}
    </Badge>
  );
}

export function TodaysSchedule() {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Today&apos;s Schedule
        </h3>
        <Link
          href="/calendar"
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View calendar
          <ChevronRight size={12} />
        </Link>
      </header>

      <ul className="space-y-4">
        {todaysSchedule.map((item) => (
          <li
            key={item.time + item.title}
            className="flex items-start justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                {item.time}
              </p>
              <p className="mt-0.5 truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                {item.title}
              </p>
              <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                {item.subtitle}
              </p>
            </div>
            <ActionPill action={item.action} />
          </li>
        ))}
      </ul>
    </section>
  );
}
