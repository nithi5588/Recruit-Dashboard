"use client";

import { useId, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  AdditionalDetailsStep,
  emptyAdditionalDetails,
  type AdditionalDetails,
} from "@/components/add-candidate/AdditionalDetailsStep";
import {
  BasicDetailsStep,
  emptyBasicDetails,
  type BasicDetails,
  type BasicDetailsErrors,
} from "@/components/add-candidate/BasicDetailsStep";
import { ReviewConfirmStep } from "@/components/add-candidate/ReviewConfirmStep";
import {
  StepIndicator,
  type WizardStep,
} from "@/components/add-candidate/StepIndicator";
import { UploadResumeStep } from "@/components/add-candidate/UploadResumeStep";
import { CheckIcon, ShieldIcon } from "@/components/icons/AppIcons";

const STEPS: WizardStep[] = [
  { label: "Basic Details" },
  { label: "Additional Details" },
  { label: "Upload Resume" },
  { label: "Review & Confirm" },
];

function ProfileIllustration() {
  return (
    <div
      aria-hidden
      className="relative mx-auto mb-4 h-[92px] w-[120px]"
    >
      <span
        className="absolute inset-x-3 inset-y-3 flex items-center justify-center rounded-[14px] border border-[color:var(--color-brand-200)]"
        style={{
          background:
            "linear-gradient(180deg, #F4F1FF 0%, #E9E3FF 100%)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
          <circle cx="13" cy="13" r="5" stroke="#5B3DF5" strokeWidth="1.8" />
          <path
            d="M5 28a8 8 0 0 1 16 0"
            stroke="#5B3DF5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M25 11h14M25 16h10M25 21h14"
            stroke="#5B3DF5"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </span>

      <span
        className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-white"
        style={{
          background:
            "linear-gradient(135deg, #5B3DF5 0%, #4B32D4 100%)",
          boxShadow: "0 6px 16px rgba(91, 61, 245, 0.3)",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>

      <span className="absolute left-0 top-2 text-[color:var(--color-brand-400)]">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="absolute right-0 top-0 text-[color:var(--color-brand-300)]">
        <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="absolute -left-2 bottom-3 text-[color:var(--color-brand-300)]">
        <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
  );
}

export function AddCandidateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const [step, setStep] = useState(1);
  const [basic, setBasic] = useState<BasicDetails>(emptyBasicDetails);
  const [basicErrors, setBasicErrors] = useState<BasicDetailsErrors>({});
  const [additional, setAdditional] = useState<AdditionalDetails>(
    emptyAdditionalDetails,
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function updateBasic<K extends keyof BasicDetails>(
    key: K,
    value: BasicDetails[K],
  ) {
    setBasic((prev) => ({ ...prev, [key]: value }));
    if (basicErrors[key])
      setBasicErrors((e) => ({ ...e, [key]: undefined }));
  }

  function updateAdditional<K extends keyof AdditionalDetails>(
    key: K,
    value: AdditionalDetails[K],
  ) {
    setAdditional((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setStep(1);
    setBasic(emptyBasicDetails);
    setBasicErrors({});
    setAdditional(emptyAdditionalDetails);
    setResumeFile(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Accept whatever the user entered and advance — backend will validate
    // and reconcile the data once wired up.
    if (step < STEPS.length) {
      setStep(step + 1);
      return;
    }
    // Final step: would submit to API
    handleClose();
  }

  const isFinal = step === STEPS.length;
  const showIllustration = step === 1;

  const heading =
    step === 1
      ? "Let's start with the basics"
      : step === 2
        ? "A few more details (optional)"
        : step === 3
          ? "Upload Resume"
          : "Review & Confirm";

  const subHeading =
    step === 1
      ? "Add the key details we'll use to create this candidate's profile."
      : step === 2
        ? "This helps us better understand the candidate."
        : step === 3
          ? "Upload the candidate's resume and our AI will extract the key information to auto-fill their profile."
          : "We've extracted the information below from the resume. Please review and confirm.";

  return (
    <Modal open={open} onClose={handleClose} labelledBy={titleId}>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <h2
          id={titleId}
          className="text-[20px] font-bold text-[color:var(--color-text)]"
        >
          Add Candidate
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={handleClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="px-6 pt-4 sm:px-10">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-6"
      >
        <div
          className={`mb-5 ${
            showIllustration ? "text-center" : "text-left"
          }`}
        >
          {showIllustration ? <ProfileIllustration /> : null}
          <h3
            className={`text-[20px] font-bold text-[color:var(--color-text)] ${
              showIllustration ? "" : "sm:text-[22px]"
            }`}
          >
            {heading}
          </h3>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">
            {subHeading}
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {step === 1 ? (
            <BasicDetailsStep
              values={basic}
              errors={basicErrors}
              onChange={updateBasic}
            />
          ) : step === 2 ? (
            <AdditionalDetailsStep
              values={additional}
              onChange={updateAdditional}
            />
          ) : step === 3 ? (
            <UploadResumeStep
              file={resumeFile}
              onFileChange={setResumeFile}
            />
          ) : (
            <ReviewConfirmStep
              basic={basic}
              additional={additional}
              resumeFile={resumeFile}
            />
          )}
        </div>

        <footer className="mt-6 flex flex-col-reverse gap-3 border-t border-[color:var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          {step === 1 ? (
            <p className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--color-text-secondary)]">
              <ShieldIcon size={14} />
              Your data is secure and will never be shared.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          )}
          <div className="flex items-center gap-2">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-10 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(91,61,245,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
            >
              {isFinal ? "Create Candidate" : "Next"}
              {isFinal ? (
                <CheckIcon size={14} />
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
