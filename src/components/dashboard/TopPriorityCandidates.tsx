import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, priorityTone } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ChevronRight, PinIcon } from "@/components/icons/AppIcons";
import {
  candidateStatusText,
  candidates,
  type Candidate,
} from "@/lib/sample-data";

function statusColor(text: string): string {
  if (/open|available/i.test(text)) return "#C75510";
  if (/interview/i.test(text)) return "#F97316";
  if (/submitted|shortlisted/i.test(text)) return "#6B6358";
  return "#6B6358";
}

function PriorityCard({ candidate }: { candidate: Candidate }) {
  const statusText = candidateStatusText(candidate);

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="group flex h-full min-w-0 flex-col rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 transition-all hover:-translate-y-[2px] hover:border-[color:var(--color-brand-200)] hover:shadow-[0_10px_24px_rgba(234,104,20,0.10)]"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <Avatar name={candidate.name} size={42} />
        <Badge tone={priorityTone(candidate.priority)}>
          {candidate.priority}
        </Badge>
      </div>

      <p className="truncate text-[13px] font-semibold leading-[18px] text-[color:var(--color-text)] group-hover:text-[color:var(--color-brand-600)]">
        {candidate.name}
      </p>
      <p className="mt-0.5 truncate text-[11px] leading-[16px] text-[color:var(--color-text-secondary)]">
        {candidate.role}
      </p>

      <div className="my-3 flex justify-center">
        <ScoreRing value={candidate.score} size={52} stroke={4} />
      </div>

      <p
        className="truncate text-center text-[12px] font-semibold leading-[18px]"
        style={{ color: statusColor(statusText) }}
      >
        {statusText}
      </p>

      <p className="mt-1.5 flex items-center justify-center gap-1 text-[11px] text-[color:var(--color-text-muted)]">
        <PinIcon size={11} />
        <span className="truncate">{candidate.location}</span>
      </p>
    </Link>
  );
}

export function TopPriorityCandidates() {
  const top = candidates.slice(0, 4);
  const highPriorityTotal = candidates.filter((c) => c.priority === "High").length;

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold text-[color:var(--color-text)]">
            Top Priority Candidates
          </h3>
          <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-brand-50)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-brand-600)]">
            {highPriorityTotal} high priority
          </span>
        </div>
        <Link
          href="/candidates?priority=high"
          className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
        >
          View all
          <ChevronRight size={14} />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {top.map((c) => (
          <PriorityCard key={c.id} candidate={c} />
        ))}
      </div>
    </section>
  );
}
