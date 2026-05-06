"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, ChevronRight, PhoneIcon } from "@/components/icons/AppIcons";
import { todaysSchedule, type ScheduleItem } from "@/lib/sample-data";

function ActionPill({
  action,
  done,
  onClick,
}: {
  action: ScheduleItem["action"];
  done: boolean;
  onClick: () => void;
}) {
  if (action.tone === "purple") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={done}
        className={`inline-flex h-7 items-center gap-1 rounded-[999px] border px-2.5 text-[12px] font-semibold transition-all ${
          done
            ? "border-[color:var(--color-success)] bg-[color:var(--color-success-light)] text-[color:var(--color-success)]"
            : "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-200)]"
        }`}
      >
        {done ? <CheckIcon size={12} /> : <PhoneIcon size={12} />}
        {done ? "Called" : action.label}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={done}
      className="inline-flex"
      title={done ? "Marked done" : "Mark as done"}
    >
      {done ? (
        <span className="inline-flex h-7 items-center gap-1 rounded-[999px] border border-[color:var(--color-success)] bg-[color:var(--color-success-light)] px-2.5 text-[12px] font-semibold text-[color:var(--color-success)]">
          <CheckIcon size={12} />
          Done
        </span>
      ) : (
        <Badge tone={action.tone === "orange" ? "orange" : "blue"}>
          {action.label}
        </Badge>
      )}
    </button>
  );
}

export function TodaysSchedule() {
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const completedCount = doneIds.size;

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
            Today&apos;s Schedule
          </h3>
          {completedCount > 0 && (
            <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-success-light)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-success)]">
              {completedCount} done
            </span>
          )}
        </div>
        <Link
          href="/calendar"
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View calendar
          <ChevronRight size={12} />
        </Link>
      </header>

      <ul className="space-y-4">
        {todaysSchedule.map((item) => {
          const id = item.time + item.title;
          const done = doneIds.has(id);
          return (
            <li
              key={id}
              className="flex items-start justify-between gap-3"
            >
              <div className={`min-w-0 flex-1 transition-opacity ${done ? "opacity-60" : ""}`}>
                <p className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                  {item.time}
                </p>
                <p
                  className={`mt-0.5 truncate text-[13px] font-semibold transition-all ${
                    done
                      ? "text-[color:var(--color-text-muted)] line-through"
                      : "text-[color:var(--color-text)]"
                  }`}
                >
                  {item.title}
                </p>
                <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                  {item.subtitle}
                </p>
              </div>
              <ActionPill action={item.action} done={done} onClick={() => toggle(id)} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
