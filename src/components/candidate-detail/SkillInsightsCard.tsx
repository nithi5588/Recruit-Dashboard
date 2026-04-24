import { ChevronRight, StarOutlineIcon } from "@/components/icons/AppIcons";

export function SkillInsightsCard({
  insight,
}: {
  insight: { headline: string; body: string } | null;
}) {
  if (!insight) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-brand-200)] p-5"
      style={{
        background: "linear-gradient(180deg, #F4F1FF 0%, #F9F7FF 100%)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
          Skill Insights
        </h3>
        <span
          aria-hidden
          className="text-[color:var(--color-brand-500)]"
          title="Strength highlight"
        >
          <StarOutlineIcon size={16} />
        </span>
      </header>

      <p className="text-[13px] leading-[20px] text-[color:var(--color-text)]">
        <span className="font-semibold">{insight.headline}</span> {insight.body}
      </p>

      <a
        href="#"
        className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
      >
        View skill gap analysis
        <ChevronRight size={12} />
      </a>
    </section>
  );
}
