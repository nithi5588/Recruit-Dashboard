import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { NoteEntry } from "@/lib/candidate-detail";
import { noteKindTone } from "@/components/candidate-detail/notes-shared";

export function RecentNotesCard({ notes }: { notes: NoteEntry[] }) {
  if (notes.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Recent Notes
        </h3>
        <Link href="#" className="link-brand text-[12px]">
          View all
        </Link>
      </header>

      <ul className="space-y-3">
        {notes.map((note) => (
          <li key={note.id} className="flex items-start gap-3">
            <Avatar name={note.author} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                  {note.title}
                </p>
                <Badge tone={noteKindTone(note.kind)}>{note.kind}</Badge>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-[color:var(--color-text-secondary)]">
                <span className="font-semibold">{note.author}</span> ·{" "}
                {note.date.split(" at ")[0]}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
