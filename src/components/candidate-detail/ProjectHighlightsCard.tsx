import { CheckIcon } from "@/components/icons/AppIcons";

export function ProjectHighlightsCard({
  highlights,
}: {
  highlights: string[];
}) {
  if (highlights.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-3 text-[15px] font-semibold text-[color:var(--color-text)]">
        Project Highlights
      </h3>
      <ul className="space-y-3">
        {highlights.map((h) => (
          <li key={h} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E6E9FB] text-[#273DC0]"
            >
              <CheckIcon size={12} />
            </span>
            <p className="text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
              {h}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
