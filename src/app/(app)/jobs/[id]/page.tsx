import { notFound } from "next/navigation";
import { JobDetailHeader } from "@/components/jobs/JobDetailHeader";
import { JobDetailTopBar } from "@/components/jobs/JobDetailTopBar";
import { JobOverviewCard } from "@/components/jobs/JobOverviewCard";
import { JobSummaryCard } from "@/components/jobs/JobSummaryCard";
import { ShareJobCard } from "@/components/jobs/ShareJobCard";
import { getJob, resolveJob } from "@/lib/jobs-data";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const resolved = resolveJob(job);
  const shareUrl = `https://recruit.app/jobs/${job.id}`;

  return (
    <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <div className="space-y-5">
        <JobDetailTopBar shareUrl={shareUrl} title={job.title} />

        <JobDetailHeader job={resolved} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <JobOverviewCard job={resolved} />
          <div className="space-y-5">
            <JobSummaryCard job={resolved} />
            <ShareJobCard shareUrl={shareUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}
