import { JobsPageClient } from "@/components/jobs/JobsPageClient";
import { jobs } from "@/lib/jobs-data";

export default function JobsPage() {
  return <JobsPageClient jobs={jobs} />;
}
