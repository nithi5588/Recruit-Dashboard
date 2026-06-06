import { ScoreRing } from "@/components/ui/ScoreRing";
import type { Candidate } from "@/lib/sample-data";

type MatchingJob = {
  title: string;
  company: string;
  score: number;
  tags: string[];
};

/**
 * Derive a short list of open roles this candidate fits, ranked by match.
 * The top match is anchored on the candidate's own score; the rest taper off so
 * the list reads as a ranked shortlist. Tags are pulled from the candidate's
 * skills so each row reflects what actually matched.
 */
function matchingJobsFor(candidate: Candidate): MatchingJob[] {
  const skills = candidate.skills;
  const role = candidate.role;
  const top = Math.max(60, Math.min(99, candidate.score));

  const seeds: Array<{ title: string; company: string }> = [
    { title: `Senior ${role}`, company: "TechCorp" },
    { title: role, company: "FinServe Inc." },
    { title: `${role} (Product)`, company: "Walmart Global Tech" },
    { title: `Lead ${role}`, company: "InnovateX" },
  ];

  const steps = [0, 8, 14, 21];
  return seeds.map((s, i) => ({
    title: s.title,
    company: s.company,
    score: Math.max(55, top - steps[i]),
    tags: skills.slice(i, i + 2).length ? skills.slice(i, i + 2) : skills.slice(0, 2),
  }));
}

export function BestMatchingJobs({ candidate }: { candidate: Candidate }) {
  const jobs = matchingJobsFor(candidate);

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-1">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Best Matching Jobs
        </h3>
        <p className="text-[12px] text-[color:var(--color-text-secondary)]">
          Open roles this candidate fits, ranked by match
        </p>
      </header>

      <ul className="mt-2 divide-y divide-[color:var(--color-border)]">
        {jobs.map((job) => (
          <li
            key={`${job.title}-${job.company}`}
            className="flex items-center gap-3 py-3"
          >
            <ScoreRing value={job.score} size={42} stroke={4} suffix="%" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                {job.title}
              </p>
              <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                {job.company}
              </p>
            </div>
            <div className="hidden flex-wrap justify-end gap-1 sm:flex">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
