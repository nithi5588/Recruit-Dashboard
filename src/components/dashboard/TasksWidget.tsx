"use client";

import { useState } from "react";
import Link from "next/link";
import { tasks } from "@/lib/sample-data";
import { ChevronRight } from "@/components/icons/AppIcons";

export function TasksWidget() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completedCount = Object.values(done).filter(Boolean).length;

  function toggle(title: string) {
    setDone((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
            Tasks
          </h3>
          {completedCount > 0 && (
            <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-success-light)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-success)]">
              {completedCount} done
            </span>
          )}
        </div>
        <Link
          href="/tasks"
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </header>

      <ul className="space-y-3.5">
        {tasks.map((task) => {
          const checked = !!done[task.title];
          return (
            <li
              key={task.title}
              className="flex items-center justify-between gap-3"
            >
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(task.title)}
                  className="h-[18px] w-[18px] shrink-0 cursor-pointer rounded-full border border-[color:var(--color-border-strong)] accent-[color:var(--color-brand-500)]"
                  aria-label={`Mark complete: ${task.title}`}
                />
                <span
                  className={`truncate text-[13px] font-medium transition-all ${
                    checked
                      ? "text-[color:var(--color-text-muted)] line-through"
                      : "text-[color:var(--color-text)]"
                  }`}
                >
                  {task.title}
                </span>
              </label>
              <span
                className={`shrink-0 text-[12px] transition-colors ${
                  checked
                    ? "text-[color:var(--color-text-muted)]"
                    : "text-[color:var(--color-text-secondary)]"
                }`}
              >
                {task.due}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
