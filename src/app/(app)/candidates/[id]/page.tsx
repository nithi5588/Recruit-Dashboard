import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutCard } from "@/components/candidate-detail/AboutCard";
import { ApplicationsCard } from "@/components/candidate-detail/ApplicationsCard";
import { CandidateSnapshot } from "@/components/candidate-detail/CandidateSnapshot";
import { DocumentsCard } from "@/components/candidate-detail/DocumentsCard";
import { EducationCard } from "@/components/candidate-detail/EducationCard";
import { ExperienceCard } from "@/components/candidate-detail/ExperienceCard";
import { NotesCard } from "@/components/candidate-detail/NotesCard";
import { ProfileHeader } from "@/components/candidate-detail/ProfileHeader";
import { ProfileTabs } from "@/components/candidate-detail/ProfileTabs";
import { RecentActivityCard } from "@/components/candidate-detail/RecentActivityCard";
import { SkillsCard } from "@/components/candidate-detail/SkillsCard";
import { ToolsCard } from "@/components/candidate-detail/ToolsCard";
import { ChevronRight } from "@/components/icons/AppIcons";
import { getCandidateDetail } from "@/lib/candidate-detail";
import { candidates } from "@/lib/sample-data";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = candidates.find((c) => c.id === id);
  const detail = getCandidateDetail(id);
  if (!candidate || !detail) notFound();

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
        <span className="font-semibold text-[color:var(--color-text)]">
          {candidate.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <ProfileHeader candidate={candidate} />
          <ProfileTabs candidateId={candidate.id} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <AboutCard detail={detail} candidate={candidate} />
              <SkillsCard skills={detail.topSkills} />
              <ToolsCard tools={detail.tools} />
            </div>
            <div className="space-y-5">
              <ExperienceCard experience={detail.experience} candidateId={candidate.id} />
              <EducationCard education={detail.education} />
            </div>
          </div>

          <DocumentsCard documents={detail.documents} />
        </div>

        <aside className="space-y-5 xl:sticky xl:top-[88px] xl:self-start">
          <CandidateSnapshot candidate={candidate} detail={detail} />
          <ApplicationsCard
            applications={detail.applicationsBlock.applications.slice(0, 3)}
            totalCount={detail.applicationsBlock.summary.total}
            candidateId={candidate.id}
          />
          <NotesCard
            notes={detail.notesBlock.notes.filter((n) => n.pinned)}
            candidateId={candidate.id}
          />
          <RecentActivityCard
            activity={detail.activityBlock.activities.slice(0, 3)}
            candidateId={candidate.id}
          />
        </aside>
      </div>
    </div>
  );
}
