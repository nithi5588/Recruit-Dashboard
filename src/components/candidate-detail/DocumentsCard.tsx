import Link from "next/link";
import type { DocumentEntry } from "@/lib/candidate-detail";
import { PdfFileIcon } from "@/components/candidate-detail/PdfFileIcon";
import { ChevronRight, UploadIcon } from "@/components/icons/AppIcons";

export function DocumentsCard({ documents }: { documents: DocumentEntry[] }) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-[color:var(--color-text)]">
          Documents
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="link-brand inline-flex items-center gap-1 text-[12px]"
          >
            View all
            <ChevronRight size={12} />
          </Link>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-border-strong)]"
          >
            <UploadIcon size={16} />
            Upload
          </button>
        </div>
      </header>

      {documents.length === 0 ? (
        <p className="rounded-[12px] border border-dashed border-[color:var(--color-border)] px-4 py-6 text-center text-[13px] text-[color:var(--color-text-secondary)]">
          No documents uploaded yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <li key={doc.name}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 text-left transition-colors hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-surface-2)]"
              >
                <PdfFileIcon size={40} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                    {doc.name}
                  </p>
                  <p className="truncate text-[12px] text-[color:var(--color-text-secondary)]">
                    {doc.size} · {doc.uploadedAgo}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
