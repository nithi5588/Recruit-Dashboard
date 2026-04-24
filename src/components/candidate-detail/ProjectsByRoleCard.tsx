import { DonutChart } from "@/components/ui/DonutChart";

type Row = { name: string; count: number; color: string };

export function ProjectsByRoleCard({ roles }: { roles: Row[] }) {
  if (roles.length === 0) return null;
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Projects by Role
      </h3>

      <div className="flex flex-wrap items-center gap-5">
        <DonutChart
          segments={roles.map((r) => ({
            name: r.name,
            value: r.count,
            color: r.color,
          }))}
          ariaLabel="Projects by role"
          size={120}
          stroke={20}
        />
        <ul className="flex-1 space-y-3">
          {roles.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text)]">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: r.color }}
                />
                {r.name}
              </span>
              <span className="text-[12px] text-[color:var(--color-text-secondary)]">
                {r.count} {r.count === 1 ? "project" : "projects"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
