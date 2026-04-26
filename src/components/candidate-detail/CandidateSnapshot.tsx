import { Avatar } from "@/components/ui/Avatar";
import { Badge, priorityTone, statusTone } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EditIcon } from "@/components/icons/AppIcons";
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
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-[13px] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
        {children}
      </span>
    </div>
  );
}

export function CandidateSnapshot({
  candidate,
  detail,
}: {
  candidate: Candidate;
  detail: CandidateDetail;
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Candidate Snapshot
        </h3>
        <button
          type="button"
          className="link-brand inline-flex items-center gap-1 text-[12px]"
          aria-label="Edit snapshot"
        >
          <EditIcon size={12} />
          Edit
        </button>
      </header>

      <div className="divide-y divide-[color:var(--color-border)]">
        <Row label="Match Score">
          <ScoreRing value={candidate.score} size={30} stroke={3} />
        </Row>
        <Row label="Status">
          <Badge tone={statusTone(candidate.status)}>{candidate.status}</Badge>
        </Row>
        <Row label="Availability">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-[#EA6814]"
            />
            {candidate.availability}
          </span>
        </Row>
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
