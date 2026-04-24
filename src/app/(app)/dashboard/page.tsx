import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { RecentCandidatesTable } from "@/components/dashboard/RecentCandidatesTable";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TasksWidget } from "@/components/dashboard/TasksWidget";
import { TodaysSchedule } from "@/components/dashboard/TodaysSchedule";
import { TopPriorityCandidates } from "@/components/dashboard/TopPriorityCandidates";

const userName = "Nithish";

function formatToday(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export default function DashboardPage() {
  const today = formatToday();

  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:px-8 xl:py-8">
      <div className="min-w-0 space-y-6">
        <header className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-brand-600)]">
            {today}
          </p>
          <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[28px] sm:leading-[36px]">
            Let&apos;s place some talent today.
          </h1>
          <p className="text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px] sm:leading-[22px]">
            Here&apos;s what&apos;s happening with your recruitment pipeline.
          </p>
        </header>

        <StatsGrid />
        <TopPriorityCandidates />
        <RecentCandidatesTable />
      </div>

      <aside className="space-y-5 xl:sticky xl:top-[88px] xl:self-start">
        <AIAssistant userName={userName} />
        <TodaysSchedule />
        <TasksWidget />
      </aside>
    </div>
  );
}
