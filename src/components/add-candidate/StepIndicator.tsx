import { CheckIcon } from "@/components/icons/AppIcons";

export type WizardStep = { label: string };

export function StepIndicator({
  steps,
  current,
}: {
  steps: WizardStep[];
  current: number;
}) {
  return (
    <ol
      className="relative flex items-start justify-between gap-2"
      aria-label="Wizard progress"
    >
      {steps.map((step, idx) => {
        const number = idx + 1;
        const isCompleted = number < current;
        const isCurrent = number === current;
        const isLast = idx === steps.length - 1;

        return (
          <li
            key={step.label}
            className="relative flex min-w-0 flex-1 flex-col items-center"
          >
            {!isLast ? (
              <span
                aria-hidden
                className={`absolute top-4 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] rounded-full ${
                  isCompleted
                    ? "bg-[color:var(--color-brand-500)]"
                    : "bg-[color:var(--color-border)]"
                }`}
              />
            ) : null}

            <span
              aria-current={isCurrent ? "step" : undefined}
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                isCurrent
                  ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_0_0_4px_rgba(234,104,20,0.15)]"
                  : isCompleted
                    ? "bg-[color:var(--color-brand-500)] text-white"
                    : "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]"
              }`}
            >
              {isCompleted ? <CheckIcon size={14} /> : number}
            </span>

            <span
              className={`mt-2 text-center text-[12px] font-medium ${
                isCurrent
                  ? "text-[color:var(--color-brand-600)]"
                  : isCompleted
                    ? "text-[color:var(--color-text)]"
                    : "text-[color:var(--color-text-muted)]"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
