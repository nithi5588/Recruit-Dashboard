import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateMetaPanel } from "@/components/candidate-detail/CandidateMetaPanel";
import { NotesListCard } from "@/components/candidate-detail/NotesListCard";
import { NotesSummaryCard } from "@/components/candidate-detail/NotesSummaryCard";
import { ProfileHeader } from "@/components/candidate-detail/ProfileHeader";
import { ProfileTabs } from "@/components/candidate-detail/ProfileTabs";
import { RecentNotesCard } from "@/components/candidate-detail/RecentNotesCard";
import { ChevronRight } from "@/components/icons/AppIcons";
import { getCandidateDetail } from "@/lib/candidate-detail";
import { candidates } from "@/lib/sample-data";

export default async function CandidateNotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = candidates.find((c) => c.id === id);
  const detail = getCandidateDetail(id);
  if (!candidate || !detail) notFound();

  const { notesBlock } = detail;

  return (
    <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-1.5 text-[13px]"
      >
        <Link
          href="/candidates"
          className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
        >
          Candidates
        </Link>
        <ChevronRight size={14} className="text-[color:var(--color-text-muted)]" />
        <Link
          href={`/candidates/${candidate.id}`}
          className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
        >
          {candidate.name}
        </Link>
        <ChevronRight size={14} className="text-[color:var(--color-text-muted)]" />
        <span className="font-semibold text-[color:var(--color-text)]">
          Notes
        </span>
      </nav>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <ProfileHeader candidate={candidate} />
          <CandidateMetaPanel candidate={candidate} detail={detail} />
        </div>

        <ProfileTabs candidateId={candidate.id} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <NotesListCard notes={notesBlock.notes} />
          <div className="space-y-5">
            <NotesSummaryCard summary={notesBlock.summary} />
            <RecentNotesCard notes={notesBlock.notes} />
          </div>
        </div>
      </div>
    </div>
  );
}
