import { CompanyLogo } from "@/components/ui/CompanyLogo";
import type { ToolEntry } from "@/lib/candidate-detail";

export function ToolsCard({ tools }: { tools: ToolEntry[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
        Tools &amp; Technologies
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {tools.map((tool) => (
          <li key={tool.label} title={tool.label}>
            <CompanyLogo
              company={tool.label}
              size={40}
              fallbackBg={tool.bg}
              fallbackFg={tool.fg}
              fallbackText={tool.abbr}
              rounded="rounded-[10px]"
              padding={5}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
