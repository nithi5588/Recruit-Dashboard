import { ClientsIcon } from "@/components/icons/AppIcons";

export default function ClientsPage() {
  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[color:var(--color-brand-100)]">
          <ClientsIcon size={36} className="text-[color:var(--color-brand-500)]" />
        </div>

        {/* Badge */}
        <span className="mb-4 inline-flex items-center rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-100)] px-3 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]">
          Coming Soon
        </span>

        {/* Heading */}
        <h1 className="mb-3 text-[28px] font-bold tracking-tight text-[color:var(--color-text)]">
          Client Management
        </h1>

        {/* Description */}
        <p className="mb-8 text-[15px] leading-[24px] text-[color:var(--color-text-secondary)]">
          A dedicated workspace to manage client relationships, track accounts,
          and coordinate placements — all in one place.
        </p>

        {/* Feature teaser cards */}
        <div className="mb-8 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          {[
            { icon: "🏢", title: "Client Profiles", desc: "Centralized account info, contacts & history" },
            { icon: "📋", title: "Active Requirements", desc: "Track open JDs and hiring priorities" },
            { icon: "📊", title: "Placement Tracking", desc: "Monitor submissions and outcomes per client" },
            { icon: "🤝", title: "Relationship Insights", desc: "Account health scores and engagement data" },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)]"
            >
              <div className="mb-2 text-2xl">{icon}</div>
              <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{title}</p>
              <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Notify CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <div className="flex flex-1 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-11 flex-1 bg-transparent px-4 text-[13px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] outline-none"
            />
            <button
              type="button"
              className="h-11 rounded-r-[11px] bg-[color:var(--color-brand-500)] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
            >
              Notify me
            </button>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-[color:var(--color-text-muted)]">
          We&apos;ll let you know when Client Management launches. No spam, ever.
        </p>
      </div>
    </div>
  );
}
