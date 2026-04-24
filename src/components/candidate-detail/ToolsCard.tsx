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
          <li key={tool.label}>
            <span
              title={tool.label}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[11px] font-bold"
              style={{ background: tool.bg, color: tool.fg }}
              aria-label={tool.label}
            >
              {tool.abbr}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
