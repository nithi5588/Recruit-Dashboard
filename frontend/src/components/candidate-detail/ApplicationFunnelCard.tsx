type FunnelStep = { name: string; count: number; color: string };

function Row({ step, max }: { step: FunnelStep; max: number }) {
  const width = max === 0 ? 0 : Math.round((step.count / max) * 100);
  return (
    <li className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3">
      <span className="text-[13px] text-[color:var(--color-text-secondary)]">
        {step.name}
      </span>
      <div
        role="progressbar"
        aria-valuenow={step.count}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${step.name} funnel`}
        className="h-1.5 overflow-hidden rounded-[999px] bg-[color:var(--color-surface-2)]"
      >
        <span
          className="block h-full rounded-[999px]"
          style={{ width: `${width}%`, background: step.color }}
        />
      </div>
      <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
        {step.count}
      </span>
    </li>
  );
}

export function ApplicationFunnelCard({
  funnel,
}: {
  funnel: FunnelStep[];
}) {
  if (funnel.length === 0) return null;
  const max = funnel.reduce((m, s) => (s.count > m ? s.count : m), 0);
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h3 className="mb-4 text-[15px] font-semibold text-[color:var(--color-text)]">
        Application Funnel
      </h3>
      <ul className="space-y-3.5">
        {funnel.map((step) => (
          <Row key={step.name} step={step} max={max} />
        ))}
      </ul>
    </section>
  );
}
