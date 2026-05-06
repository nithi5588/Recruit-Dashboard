import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MoreIcon, NoteLinesIcon, PlusIcon } from "@/components/icons/AppIcons";
import type { NoteEntry } from "@/lib/candidate-detail";
import { noteKindTone } from "@/components/candidate-detail/notes-shared";

function NoteRow({ note }: { note: NoteEntry }) {
  return (
    <article className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
      <Avatar name={note.author} size={40} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-[14px] font-semibold leading-[20px] text-[color:var(--color-text)]">
            {note.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={noteKindTone(note.kind)}>{note.kind}</Badge>
            <button
              type="button"
              aria-label={`Actions for ${note.title}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
            >
              <MoreIcon />
            </button>
          </div>
        </div>

        <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
          {note.body}
        </p>

        <p className="mt-3 text-[12px] text-[color:var(--color-text-muted)]">
          <span className="font-semibold text-[color:var(--color-text-secondary)]">
            {note.author}
          </span>
          <span className="mx-1.5">·</span>
          <span>{note.date}</span>
        </p>
      </div>
    </article>
  );
}

export function NotesListCard({ notes }: { notes: NoteEntry[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Notes
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Add and view notes about this candidate
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] px-3 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-100)]"
        >
          <PlusIcon size={14} />
          Add Note
        </button>
      </header>

      {notes.length === 0 ? (
        <p className="m-5 rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center text-[13px] text-[color:var(--color-text-secondary)] sm:m-6">
          No notes yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[color:var(--color-border)] border-t border-[color:var(--color-border)]">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteRow note={note} />
            </li>
          ))}
        </ul>
      )}

      {notes.length > 0 ? (
        <div className="flex items-center justify-center gap-2 border-t border-[color:var(--color-border)] py-4 text-[12px] text-[color:var(--color-text-muted)]">
          <NoteLinesIcon size={14} />
          No more notes
        </div>
      ) : null}
    </section>
  );
}
