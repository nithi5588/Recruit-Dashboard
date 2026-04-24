import { Avatar } from "@/components/ui/Avatar";
import { Badge, statusTone } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import {
  EditIcon,
  MoreIcon,
  PinIcon,
  ShareIcon,
  SolidStar,
  SuitcaseIcon,
} from "@/components/icons/AppIcons";
import type { Candidate } from "@/lib/sample-data";

export function ProfileHeader({ candidate }: { candidate: Candidate }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start">
        <div className="relative mx-auto md:mx-0">
          <Avatar name={candidate.name} size={120} className="shadow-[var(--shadow-card)]" />
          <button
            type="button"
            aria-label="Change profile photo"
            className="absolute bottom-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[color:var(--color-text-secondary)] shadow-[var(--shadow-card)] transition-colors hover:text-[color:var(--color-brand-600)]"
          >
            <EditIcon size={14} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[24px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[28px] sm:leading-[36px]">
                  {candidate.name}
                </h1>
                {candidate.priority === "High" ? (
                  <span
                    aria-label="High priority"
                    className="text-[#F59E0B]"
                    title="High priority"
                  >
                    <SolidStar size={18} />
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
                {candidate.role}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-label="More actions"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
              >
                <MoreIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
              >
                <ShareIcon size={16} />
                Share Profile
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(91,61,245,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
              >
                <EditIcon size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[color:var(--color-text-secondary)]">
            <div className="inline-flex items-center gap-1.5">
              <PinIcon size={14} />
              <dt className="sr-only">Location</dt>
              <dd>{candidate.location}</dd>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <SuitcaseIcon size={14} />
              <dt className="sr-only">Experience</dt>
              <dd>{candidate.experience}</dd>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-[#22C55E]"
              />
              <dt className="sr-only">Availability</dt>
              <dd>{candidate.availability}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <ScoreRing value={candidate.score} size={38} stroke={4} />
              <span className="text-[13px] text-[color:var(--color-text-secondary)]">
                Match Score
              </span>
            </div>
            <span className="hidden h-6 w-px bg-[color:var(--color-border)] sm:block" aria-hidden />
            <div className="flex items-center gap-2">
              <Badge tone={statusTone(candidate.status)}>{candidate.status}</Badge>
              <span className="text-[13px] text-[color:var(--color-text-secondary)]">
                Status
              </span>
            </div>
            <span className="hidden h-6 w-px bg-[color:var(--color-border)] sm:block" aria-hidden />
            <p className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text-secondary)]">
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full bg-[#22C55E]"
              />
              <span className="font-semibold text-[color:var(--color-text)]">
                {candidate.availability}
              </span>
              <span>Availability</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
