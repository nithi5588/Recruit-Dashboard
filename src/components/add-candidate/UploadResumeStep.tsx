"use client";

import { useRef, useState, type DragEvent } from "react";
import { PdfFileIcon } from "@/components/candidate-detail/PdfFileIcon";
import { SparklesIcon } from "@/components/icons/AppIcons";

export function UploadResumeStep({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileChange(f);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
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

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-[16px] border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-100)]"
            : "border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-50)]"
        }`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <PdfFileIcon size={56} activeDot />
            <div>
              <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
                {file.name}
              </p>
              <p className="text-[12px] text-[color:var(--color-text-secondary)]">
                {humanSize(file.size)} · Ready to extract
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex h-9 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
              >
                Replace file
              </button>
              <button
                type="button"
                onClick={() => onFileChange(null)}
                className="inline-flex h-9 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-error)] transition-colors hover:bg-[color:var(--color-error-light)]"
              >
                Remove
              </button>
            </div>
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

      <div
        className="flex items-start gap-3 rounded-[14px] border border-[color:var(--color-brand-200)] p-4"
        style={{
          background:
            "linear-gradient(180deg, #FFF6EE 0%, #FAFAF7 100%)",
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
            We&apos;ll analyze the resume and extract details like skills,
            experience, education, work history and more.
          </p>
        </div>
      </div>
    </div>
  );
}
