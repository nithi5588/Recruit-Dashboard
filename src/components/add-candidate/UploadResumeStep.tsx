"use client";

import { useRef, useState, type DragEvent } from "react";
import { TickCircle } from "iconsax-reactjs";
import { PdfFileIcon } from "@/components/candidate-detail/PdfFileIcon";
import { SparklesIcon } from "@/components/icons/AppIcons";

export type ResumeAnalysisStatus = "idle" | "analyzing" | "done";

const EXTRACTED_FIELDS = [
  "Full name",
  "Email",
  "Phone",
  "Current title",
  "Company",
  "Experience",
  "Skills",
  "Location",
];

export function UploadResumeStep({
  file,
  onFileChange,
  status,
  onSkip,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
  status: ResumeAnalysisStatus;
  onSkip: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    if (status === "analyzing") return;
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (status === "analyzing") return;
    if (!dragActive) setDragActive(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  function humanSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  const isAnalyzing = status === "analyzing";
  const isDone = status === "done";

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-[16px] border-2 border-dashed p-5 text-center transition-colors sm:p-8 ${
          dragActive
            ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-100)]"
            : isDone
              ? "border-[color:var(--color-success)]/40 bg-[color:var(--color-success-light)]"
              : "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)]"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <PdfFileIcon size={56} activeDot={isDone} />
              {isAnalyzing ? (
                <span
                  aria-hidden
                  className="absolute -right-2 -bottom-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-[var(--shadow-card)]"
                >
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[color:var(--color-brand-200)] border-t-[color:var(--color-brand-500)]" />
                </span>
              ) : null}
            </div>
            <div className="min-w-0 max-w-full">
              <p className="break-words text-[14px] font-semibold text-[color:var(--color-text)]">
                {file.name}
              </p>
              <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                {humanSize(file.size)}
                {isAnalyzing
                  ? " · Analyzing…"
                  : isDone
                    ? " · Information extracted"
                    : " · Ready to extract"}
              </p>
            </div>

            {isAnalyzing ? (
              <div className="w-full max-w-[320px]">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-brand-100)]">
                  <span
                    aria-hidden
                    className="resume-progress-bar block h-full w-1/3 rounded-full bg-[color:var(--color-brand-500)]"
                  />
                </div>
                <p className="mt-2 text-[12px] text-[color:var(--color-text-secondary)]">
                  Reading skills, experience and contact info…
                </p>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)] sm:h-9 sm:w-auto"
                >
                  Replace file
                </button>
                <button
                  type="button"
                  onClick={() => onFileChange(null)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-error)] transition-colors hover:bg-[color:var(--color-error-light)] sm:h-9 sm:w-auto"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <PdfFileIcon size={56} />
            <p className="text-[15px] font-semibold text-[color:var(--color-text)]">
              Drag and drop resume here
            </p>
            <p className="text-[13px] text-[color:var(--color-text-secondary)]">
              or
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-10 items-center rounded-[10px] border border-[color:var(--color-brand-300)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:border-[color:var(--color-brand-500)] hover:bg-[color:var(--color-brand-50)]"
            >
              Browse Files
            </button>
            <p className="mt-1 text-[12px] text-[color:var(--color-text-secondary)]">
              Supports PDF, DOC, DOCX (Max 10MB)
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileChange(f);
            e.target.value = "";
          }}
        />
      </div>

      {isDone ? (
        <div
          className="rounded-[14px] border border-[color:var(--color-success)]/30 p-4"
          style={{
            background:
              "linear-gradient(180deg, #EAFBF1 0%, #F7FCF9 100%)",
          }}
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-[color:var(--color-success)] shadow-[var(--shadow-card)]"
            >
              <TickCircle size={18} color="currentColor" variant="Bold" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                Resume analyzed successfully
              </p>
              <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
                We&apos;ve pre-filled the next steps with what we found. You
                can review and edit any field before saving.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EXTRACTED_FIELDS.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-success)] shadow-[var(--shadow-card)]"
              >
                <TickCircle size={11} color="currentColor" variant="Bold" />
                {label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex items-start gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] p-4"
          style={{
            background:
              "linear-gradient(180deg, #F2F3FD 0%, #FAFAFA 100%)",
          }}
        >
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white text-[color:var(--color-brand-600)] shadow-[var(--shadow-card)]"
          >
            <SparklesIcon size={18} />
          </span>
          <div>
            <p className="text-[13px] font-semibold text-[color:var(--color-brand-600)]">
              AI-Powered Extraction
            </p>
            <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
              We&apos;ll analyze the resume and pre-fill the candidate&apos;s
              profile. You&apos;ll be able to review and edit every detail in
              the next step.
            </p>
          </div>
        </div>
      )}

      {!file && !isAnalyzing ? (
        <div className="flex items-center justify-center gap-2 pt-1 text-[12px] text-[color:var(--color-text-secondary)]">
          <span>Don&apos;t have a resume on hand?</span>
          <button
            type="button"
            onClick={onSkip}
            className="font-semibold text-[color:var(--color-brand-600)] underline-offset-2 hover:underline"
          >
            Skip and enter manually
          </button>
        </div>
      ) : null}
    </div>
  );
}
