import Link from "next/link";
import { tasks } from "@/lib/sample-data";
import { ChevronRight } from "@/components/icons/AppIcons";

export function TasksWidget() {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Tasks
        </h3>
        <Link
          href="/tasks"
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </header>

      <ul className="space-y-3.5">
        {tasks.map((task) => (
          <li
            key={task.title}
            className="flex items-center justify-between gap-3"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3">
              <input
                type="checkbox"
                className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded-full border border-[color:var(--color-border-strong)] accent-[color:var(--color-brand-500)]"
                aria-label={`Mark complete: ${task.title}`}
              />
              <span className="truncate text-[13px] font-medium text-[color:var(--color-text)]">
                {task.title}
              </span>
            </label>
            <span className="shrink-0 text-[12px] text-[color:var(--color-text-secondary)]">
              {task.due}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
