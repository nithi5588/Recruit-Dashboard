import { CheckIcon } from "@/components/icons/AppIcons";

export type WizardStep = { label: string };

export function StepIndicator({
  steps,
  current,
}: {
  steps: WizardStep[];
  current: number;
}) {
  const currentStep = steps[current - 1];

  return (
    <div>
      <p className="mb-2 flex items-center justify-between gap-2 text-[12px] font-semibold text-[color:var(--color-text-secondary)] sm:hidden">
        <span>
          Step {current} of {steps.length}
        </span>
        <span className="text-[color:var(--color-brand-600)]">
          {currentStep?.label}
        </span>
      </p>
      <ol
        className="relative flex items-start justify-between gap-1 sm:gap-2"
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
                  className={`absolute top-3 left-[calc(50%+14px)] right-[calc(-50%+14px)] h-[2px] rounded-full sm:top-4 sm:left-[calc(50%+18px)] sm:right-[calc(-50%+18px)] ${
                    isCompleted
                      ? "bg-[color:var(--color-brand-500)]"
                      : "bg-[color:var(--color-border)]"
                  }`}
                />
              ) : null}

              <span
                aria-current={isCurrent ? "step" : undefined}
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors sm:h-8 sm:w-8 sm:text-[12px] ${
                  isCurrent
                    ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_0_0_4px_rgba(46,71,224,0.15)]"
                    : isCompleted
                      ? "bg-[color:var(--color-brand-500)] text-white"
                      : "border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]"
                }`}
              >
                {isCompleted ? <CheckIcon size={14} /> : number}
              </span>

              <span
                className={`mt-2 hidden w-full truncate text-center text-[12px] font-medium sm:block ${
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
    </div>
  );
}
