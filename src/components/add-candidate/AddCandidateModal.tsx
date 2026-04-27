"use client";

import { useId, useRef, useState, type FormEvent } from "react";
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
import {
  UploadResumeStep,
  type ResumeAnalysisStatus,
} from "@/components/add-candidate/UploadResumeStep";
import { ArrowLeft2, ArrowRight2, CloseCircle } from "iconsax-reactjs";
import { CheckIcon, ShieldIcon, SparklesIcon } from "@/components/icons/AppIcons";

const STEPS: WizardStep[] = [
  { label: "Upload Resume" },
  { label: "Basic Details" },
  { label: "Additional Details" },
  { label: "Review & Confirm" },
];

const EXTRACTED_BASIC: BasicDetails = {
  fullName: "Savannah Nguyen",
  email: "savannah.nguyen@email.com",
  dialCode: "+1",
  phone: "(555) 987-6543",
  jobTitle: "Senior Product Designer",
  company: "DesignHub",
  experience: "5-10",
};

const EXTRACTED_ADDITIONAL: AdditionalDetails = {
  preferredLocations: ["Austin, TX", "Remote - US"],
  jobType: "Full-time",
  salaryMin: "120,000",
  salaryMax: "150,000",
  availability: "2w",
};

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
            "linear-gradient(180deg, #F2F3FD 0%, #E6E9FB 100%)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
          <circle cx="13" cy="13" r="5" stroke="#2E47E0" strokeWidth="1.8" />
          <path
            d="M5 28a8 8 0 0 1 16 0"
            stroke="#2E47E0"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M25 11h14M25 16h10M25 21h14"
            stroke="#2E47E0"
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
            "linear-gradient(135deg, #2E47E0 0%, #273DC0 100%)",
          boxShadow: "0 6px 16px rgba(46, 71, 224, 0.3)",
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

function PrefilledBanner() {
  return (
    <div
      className="mb-5 flex items-start gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] p-3 sm:p-4"
      style={{
        background: "linear-gradient(180deg, #F2F3FD 0%, #FAFAFA 100%)",
      }}
    >
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-[color:var(--color-brand-600)] shadow-[var(--shadow-card)]"
      >
        <SparklesIcon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[color:var(--color-brand-600)]">
          Pre-filled from resume
        </p>
        <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
          Review the details below and edit anything that needs adjustment.
        </p>
      </div>
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
  const [analysisStatus, setAnalysisStatus] =
    useState<ResumeAnalysisStatus>("idle");
  const [extracted, setExtracted] = useState(false);
  const analysisTimer = useRef<number | null>(null);

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

  function clearAnalysisTimer() {
    if (analysisTimer.current !== null) {
      window.clearTimeout(analysisTimer.current);
      analysisTimer.current = null;
    }
  }

  function handleResumeChange(file: File | null) {
    clearAnalysisTimer();
    setResumeFile(file);
    if (!file) {
      setAnalysisStatus("idle");
      return;
    }
    setAnalysisStatus("analyzing");
    analysisTimer.current = window.setTimeout(() => {
      setBasic(EXTRACTED_BASIC);
      setAdditional(EXTRACTED_ADDITIONAL);
      setBasicErrors({});
      setExtracted(true);
      setAnalysisStatus("done");
      analysisTimer.current = null;
    }, 1800);
  }

  function handleSkipUpload() {
    clearAnalysisTimer();
    setResumeFile(null);
    setAnalysisStatus("idle");
    setExtracted(false);
    setStep(2);
  }

  function reset() {
    clearAnalysisTimer();
    setStep(1);
    setBasic(emptyBasicDetails);
    setBasicErrors({});
    setAdditional(emptyAdditionalDetails);
    setResumeFile(null);
    setAnalysisStatus("idle");
    setExtracted(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < STEPS.length) {
      setStep(step + 1);
      return;
    }
    handleClose();
  }

  const isFinal = step === STEPS.length;
  const showIllustration = step === 2 && !extracted;
  const isAnalyzing = analysisStatus === "analyzing";

  const heading =
    step === 1
      ? "Upload Resume"
      : step === 2
        ? extracted
          ? "Review the basics"
          : "Let's start with the basics"
        : step === 3
          ? extracted
            ? "Review additional details"
            : "A few more details (optional)"
          : "Review & Confirm";

  const subHeading =
    step === 1
      ? "Upload the candidate's resume and our AI will extract the key details automatically."
      : step === 2
        ? extracted
          ? "We've pre-filled these from the resume. Edit anything that needs adjustment."
          : "Add the key details we'll use to create this candidate's profile."
        : step === 3
          ? extracted
            ? "These were extracted from the resume — change them if needed."
            : "This helps us better understand the candidate."
          : "Please review everything before creating the candidate profile.";

  const nextLabel = isFinal
    ? "Create Candidate"
    : step === 1
      ? resumeFile
        ? isAnalyzing
          ? "Analyzing…"
          : "Continue"
        : "Skip & Continue"
      : "Next";

  const nextDisabled = isAnalyzing;

  return (
    <Modal open={open} onClose={handleClose} labelledBy={titleId}>
      <header className="flex shrink-0 items-start justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-8">
        <h2
          id={titleId}
          className="text-[18px] font-bold text-[color:var(--color-text)] sm:text-[20px]"
        >
          Add Candidate
        </h2>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={handleClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
        >
          <CloseCircle size={18} color="currentColor" variant="Linear" />
        </button>
      </header>

      <div className="shrink-0 px-4 pt-3 sm:px-10 sm:pt-4">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-5 sm:px-8 sm:pb-8 sm:pt-6"
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-0 sm:pr-1">
          <div
            className={`mb-5 ${
              showIllustration ? "text-center" : "text-left"
            }`}
          >
            {showIllustration ? <ProfileIllustration /> : null}
            <h3
              className={`text-[18px] font-bold text-[color:var(--color-text)] sm:text-[20px] ${
                showIllustration ? "" : "sm:text-[22px]"
              }`}
            >
              {heading}
            </h3>
            <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">
              {subHeading}
            </p>
          </div>

          {extracted && (step === 2 || step === 3) ? (
            <PrefilledBanner />
          ) : null}

          {step === 1 ? (
            <UploadResumeStep
              file={resumeFile}
              onFileChange={handleResumeChange}
              status={analysisStatus}
              onSkip={handleSkipUpload}
            />
          ) : step === 2 ? (
            <BasicDetailsStep
              values={basic}
              errors={basicErrors}
              onChange={updateBasic}
            />
          ) : step === 3 ? (
            <AdditionalDetailsStep
              values={additional}
              onChange={updateAdditional}
            />
          ) : (
            <ReviewConfirmStep
              basic={basic}
              additional={additional}
              resumeFile={resumeFile}
            />
          )}
        </div>

        <footer className="mt-5 flex shrink-0 flex-col-reverse gap-3 border-t border-[color:var(--color-border)] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          {step === 1 ? (
            <p className="inline-flex items-center justify-center gap-1.5 text-center text-[12px] text-[color:var(--color-text-secondary)] sm:justify-start sm:text-left">
              <ShieldIcon size={14} />
              Your data is secure and will never be shared.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] sm:h-10 sm:w-auto"
            >
              <ArrowLeft2 size={14} color="currentColor" variant="Linear" />
              Back
            </button>
          )}
          <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] sm:h-10"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              disabled={nextDisabled}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(46,71,224,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:h-10"
            >
              {isAnalyzing ? (
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
              ) : null}
              {nextLabel}
              {isFinal ? (
                <CheckIcon size={14} />
              ) : isAnalyzing ? null : (
                <ArrowRight2 size={14} color="currentColor" variant="Linear" />
              )}
            </button>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
