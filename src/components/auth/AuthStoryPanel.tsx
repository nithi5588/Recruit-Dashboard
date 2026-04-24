import { DashboardIllustration } from "@/components/brand/DashboardIllustration";
import { Wordmark } from "@/components/brand/Wordmark";

type Highlight = {
  title: string;
  description: string;
  icon: "users" | "spark" | "check";
};

const highlights: Highlight[] = [
  {
    icon: "users",
    title: "Manage Candidates",
    description: "All your candidates in one central place",
  },
  {
    icon: "spark",
    title: "AI Matching",
    description: "Find the best candidates for any job",
  },
  {
    icon: "check",
    title: "Track & Collaborate",
    description: "Stay on top of tasks and client updates",
  },
];

function HighlightIcon({ kind }: { kind: Highlight["icon"] }) {
  const common =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]";
  if (kind === "users") {
    return (
      <span className={common} aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M16 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Zm-8 0c-.29 0-.62.02-.97.05C5.8 16.54 3 17.57 3 20v2h3v-2c0-1.53.9-2.74 2.12-3.61A8.48 8.48 0 0 0 8 16Z"
            fill="currentColor"
          />
        </svg>
      </span>
    );
  }
  if (kind === "spark") {
    return (
      <span className={common} aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3Zm7 9l.9 2.3 2.1.7-2.1.7L19 18l-.9-2.3-2.1-.7 2.1-.7.9-2.3ZM5 14l.7 1.8 1.8.7-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7L5 14Z"
            fill="currentColor"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className={common} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 12.5l2.2 2.2L15.8 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

export function AuthStoryPanel({
  heading,
  emoji,
  subheading,
}: {
  heading: string;
  emoji?: string;
  subheading: string;
}) {
  return (
    <div className="flex h-full flex-col gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
      <Wordmark />

      <div className="space-y-3">
        <h1 className="text-[30px] font-bold leading-[38px] tracking-tight text-[color:var(--color-text)] sm:text-[34px] sm:leading-[42px]">
          {heading}
          {emoji ? (
            <span className="ml-2 inline-block" aria-hidden>
              {emoji}
            </span>
          ) : null}
        </h1>
        <p className="max-w-sm text-[14px] leading-[22px] text-[color:var(--color-text-secondary)]">
          {subheading}
        </p>
      </div>

      <DashboardIllustration />

      <ul className="space-y-4">
        {highlights.map((h) => (
          <li key={h.title} className="flex items-start gap-3">
            <HighlightIcon kind={h.icon} />
            <div>
              <p className="text-[14px] font-semibold leading-5 text-[color:var(--color-text)]">
                {h.title}
              </p>
              <p className="text-[13px] leading-5 text-[color:var(--color-text-secondary)]">
                {h.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-auto text-[12px] text-[color:var(--color-text-muted)]">
        © {new Date().getFullYear()} Recruit. All rights reserved.
      </p>
    </div>
  );
}
