import Link from "next/link";
import { BookmarkIcon, ChevronRight } from "@/components/icons/AppIcons";
import type { NoteEntry } from "@/lib/candidate-detail";

export function NotesCard({
  notes,
  candidateId,
}: {
  notes: NoteEntry[];
  candidateId: string;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Notes
        </h3>
        <Link
          href={`/candidates/${candidateId}/notes`}
          className="link-brand inline-flex items-center gap-1 text-[12px]"
        >
          View all
          <ChevronRight size={12} />
        </Link>
      </header>

      {notes.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-6 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No notes yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="relative rounded-[12px] bg-[color:var(--color-surface-2)] p-4"
            >
              {note.pinned ? (
                <span
                  aria-label="Pinned note"
                  className="absolute right-3 top-3 text-[#ED8E55]"
                >
                  <BookmarkIcon size={14} />
                </span>
              ) : null}
              <p className="pr-5 text-[13px] font-semibold leading-[20px] text-[color:var(--color-text)]">
                {note.title}
              </p>
              <p className="mt-1 pr-5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
                {note.body}
              </p>
              <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">
                <span className="font-semibold text-[color:var(--color-text-secondary)]">
                  {note.author}
                </span>{" "}
                · {note.date}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
