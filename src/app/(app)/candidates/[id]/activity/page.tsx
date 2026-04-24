import Link from "next/link";
import { notFound } from "next/navigation";
import { ActivityByTypeCard } from "@/components/candidate-detail/ActivityByTypeCard";
import { ActivitySummaryCard } from "@/components/candidate-detail/ActivitySummaryCard";
import { ActivityTimelineCard } from "@/components/candidate-detail/ActivityTimelineCard";
import { CandidateMetaPanel } from "@/components/candidate-detail/CandidateMetaPanel";
import { ProfileHeader } from "@/components/candidate-detail/ProfileHeader";
import { ProfileTabs } from "@/components/candidate-detail/ProfileTabs";
import { RecentActivityCard } from "@/components/candidate-detail/RecentActivityCard";
import { ChevronRight } from "@/components/icons/AppIcons";
import { getCandidateDetail } from "@/lib/candidate-detail";
import { candidates } from "@/lib/sample-data";

export default async function CandidateActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = candidates.find((c) => c.id === id);
  const detail = getCandidateDetail(id);
  if (!candidate || !detail) notFound();

  const { activityBlock } = detail;

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
          Activity
        </span>
      </nav>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <ProfileHeader candidate={candidate} />
          <CandidateMetaPanel candidate={candidate} detail={detail} />
        </div>

        <ProfileTabs candidateId={candidate.id} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <ActivityTimelineCard activities={activityBlock.activities} />
          <div className="space-y-5">
            <ActivitySummaryCard summary={activityBlock.summary} />
            <ActivityByTypeCard byType={activityBlock.byType} />
            <RecentActivityCard
              activity={activityBlock.activities.slice(0, 3)}
              candidateId={candidate.id}
              title="Recent Activities"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
