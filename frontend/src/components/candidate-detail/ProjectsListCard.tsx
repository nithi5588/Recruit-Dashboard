import { Badge } from "@/components/ui/Badge";
import {
  BarChartMiniIcon,
  CartIcon,
  FilterIcon,
  LayersIcon,
  MobileIcon,
  MonitorIcon,
  MoreIcon,
  PlusIcon,
  ReportsIcon,
  UsersIcon,
  WatchIcon,
} from "@/components/icons/AppIcons";
import type { Project, ProjectIconKind } from "@/lib/candidate-detail";

function ProjectIcon({ kind }: { kind: ProjectIconKind }) {
  const iconProps = { size: 20 };
  const content =
    kind === "chart" ? (
      <ReportsIcon {...iconProps} />
    ) : kind === "phone" ? (
      <MobileIcon {...iconProps} />
    ) : kind === "cart" ? (
      <CartIcon {...iconProps} />
    ) : kind === "watch" ? (
      <WatchIcon {...iconProps} />
    ) : kind === "layers" ? (
      <LayersIcon {...iconProps} />
    ) : (
      <MonitorIcon {...iconProps} />
    );
  return (
    <span
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
    >
      {content}
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[8px] bg-[color:var(--color-surface-2)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--color-text-secondary)]">
      {label}
    </span>
  );
}

function ImpactValue({ impact }: { impact?: number }) {
  if (typeof impact !== "number")
    return (
      <span className="text-[13px] font-semibold text-[color:var(--color-text-muted)]">
        —
      </span>
    );
  return (
    <span className="text-[13px] font-semibold text-[#273DC0]">
      {impact}%
    </span>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-4">
      <ProjectIcon kind={project.icon} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[color:var(--color-text)]">
            {project.title}
          </h3>
          {project.featured ? <Badge tone="purple">Featured</Badge> : null}
        </div>

        <p className="mt-0.5 text-[12px] text-[color:var(--color-text-secondary)]">
          <span className="font-semibold text-[color:var(--color-brand-600)]">
            {project.role}
          </span>
          <span className="mx-1.5 text-[color:var(--color-text-muted)]">·</span>
          <span>{project.company}</span>
          <span className="mx-1.5 text-[color:var(--color-text-muted)]">·</span>
          <span>{project.period}</span>
        </p>

        <p className="mt-2 max-w-2xl text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 sm:flex-col sm:items-end sm:gap-3 sm:pl-2">
        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <p className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
            <BarChartMiniIcon size={14} />
            Impact
            <ImpactValue impact={project.impact} />
          </p>
          <p className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
            <UsersIcon size={14} />
            Team Size
            <span className="font-semibold text-[color:var(--color-text)]">
              {project.teamSize}
            </span>
          </p>
        </div>
        <button
          type="button"
          aria-label={`Actions for ${project.title}`}
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)] sm:ml-0"
        >
          <MoreIcon />
        </button>
      </div>
    </article>
  );
}

export function ProjectsListCard({ projects }: { projects: Project[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-semibold text-[color:var(--color-text)]">
            Projects{" "}
            <span className="text-[color:var(--color-text-muted)]">
              ({projects.length})
            </span>
          </h2>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Projects and key contributions from candidate&apos;s experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            <PlusIcon size={14} />
            Add Project
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text)]"
          >
            <FilterIcon size={16} />
            Filter
          </button>
        </div>
      </header>

      {projects.length === 0 ? (
        <p className="mt-4 rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-8 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No projects added yet.
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--color-border)]">
          {projects.map((p) => (
            <li key={p.id}>
              <ProjectRow project={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
