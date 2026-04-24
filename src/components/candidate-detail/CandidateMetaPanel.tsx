import { Avatar } from "@/components/ui/Avatar";
import { Badge, priorityTone } from "@/components/ui/Badge";
import type { CandidateDetail } from "@/lib/candidate-detail";
import type { Candidate } from "@/lib/sample-data";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <span className="text-[13px] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
        {children}
      </span>
    </div>
  );
}

export function CandidateMetaPanel({
  candidate,
  detail,
}: {
  candidate: Candidate;
  detail: CandidateDetail;
}) {
  return (
    <section
      aria-label="Candidate metadata"
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="divide-y divide-[color:var(--color-border)]">
        <Row label="Priority">
          <Badge tone={priorityTone(candidate.priority)}>{candidate.priority}</Badge>
        </Row>
        <Row label="Source">{detail.snapshot.source}</Row>
        <Row label="Added On">{detail.snapshot.addedOn}</Row>
        <Row label="Owner">
          <span className="inline-flex items-center gap-1.5">
            <Avatar name={detail.snapshot.owner} size={22} />
            {detail.snapshot.owner}
          </span>
        </Row>
      </div>
    </section>
  );
}
