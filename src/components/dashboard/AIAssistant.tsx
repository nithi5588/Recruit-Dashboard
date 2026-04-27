"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ExpandIcon,
  ImageIcon,
  PaperclipIcon,
  PaperPlaneIcon,
  RefreshIcon,
  SparklesIcon,
  TemplateIcon,
} from "@/components/icons/AppIcons";

const examples = [
  "Top 5 candidates for Senior React role in NYC",
  "UI/UX Designers with Figma & prototyping",
  "DevOps Engineers available to start in 2 weeks",
  "Python engineers with banking experience",
];

export function AIAssistant({
  userName = "Nithish",
  variant = "sidebar",
}: {
  userName?: string;
  variant?: "sidebar" | "hero";
}) {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    router.push(`/assistant?q=${encodeURIComponent(trimmed)}`);
    setPrompt("");
  }

  const hero = variant === "hero";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <section
      className={`ai-assistant relative overflow-hidden rounded-[var(--radius-card)] border ${
        hero ? "p-5 sm:p-6" : "p-5"
      }`}
    >
      <style jsx>{`
        .ai-assistant {
          border-color: var(--color-brand-200);
          background:
            radial-gradient(1200px 240px at 0% 0%, rgba(var(--accent-rgb, 91, 61, 245), 0.10), transparent 60%),
            linear-gradient(180deg, var(--color-brand-50) 0%, var(--color-surface) 100%);
          box-shadow: var(--shadow-card);
        }
        :global(html[data-theme="dark"]) .ai-assistant {
          border-color: rgba(var(--accent-rgb, 91, 61, 245), 0.30);
          background:
            radial-gradient(1200px 240px at 0% 0%, rgba(var(--accent-rgb, 91, 61, 245), 0.18), transparent 60%),
            linear-gradient(180deg, rgba(var(--accent-rgb, 91, 61, 245), 0.05) 0%, var(--color-surface) 100%);
        }

        /* sparkle header badge — gentle twinkle + soft halo */
        .sparkle-badge { position: relative; isolation: isolate; }
        .sparkle-badge::after {
          content: "";
          position: absolute; inset: -3px;
          border-radius: 14px;
          background: radial-gradient(circle, rgba(var(--accent-rgb, 46, 71, 224), 0.40), transparent 70%);
          opacity: 0; z-index: -1;
          animation: sp-halo 3.4s ease-in-out infinite;
        }
        .sparkle-badge :global(svg) {
          animation: sp-twinkle 3.4s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        .sparkle-badge:hover :global(svg) { animation-duration: 1.6s; }
        @keyframes sp-twinkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          45%      { transform: rotate(-7deg) scale(0.96); }
          55%      { transform: rotate(11deg) scale(1.10); }
        }
        @keyframes sp-halo {
          0%, 100% { opacity: 0; transform: scale(0.85); }
          55%      { opacity: 1; transform: scale(1.25); }
        }

        /* generic icon-button springy press + per-icon hover effects */
        .icn :global(svg) {
          transition: transform 240ms cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
        }
        .icn:active :global(svg) { transform: scale(0.82); }

        .icn-refresh:hover :global(svg) { transform: rotate(180deg); }
        .icn-expand:hover  :global(svg) { transform: scale(1.18); }
        .icn-clip:hover    :global(svg) { transform: rotate(-18deg) translateY(-1px); }
        .icn-image:hover   :global(svg) { transform: rotate(6deg) scale(1.10); }
        .icn-template:hover :global(svg) { transform: translateY(-2px) scale(1.06); }

        /* send button — paper plane "takes off" */
        .icn-send :global(svg) { transition: transform 280ms cubic-bezier(.34,1.56,.64,1); }
        .icn-send:hover :global(svg) {
          transform: translate(3px, -3px) rotate(20deg) scale(1.06);
        }
        .icn-send[data-active="true"] :global(svg) {
          animation: sp-ready 1.6s ease-in-out infinite;
        }
        .icn-send[data-active="true"]:hover :global(svg) { animation: none; }
        @keyframes sp-ready {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50%      { transform: translate(1px, -1px) rotate(7deg); }
        }

        /* "Ready to help" status dot — ping ring */
        .ping-dot { position: relative; isolation: isolate; }
        .ping-dot::before {
          content: "";
          position: absolute; inset: 0;
          border-radius: 999px;
          background: var(--color-success);
          z-index: -1;
          animation: sp-ping 1.9s cubic-bezier(0,0,.2,1) infinite;
        }
        @keyframes sp-ping {
          0%        { transform: scale(0.8); opacity: 0.55; }
          80%, 100% { transform: scale(2.4); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sparkle-badge :global(svg),
          .sparkle-badge::after,
          .icn-send[data-active="true"] :global(svg),
          .ping-dot::before { animation: none !important; }
          .icn :global(svg), .icn-send :global(svg) { transition: none !important; }
        }
      `}</style>
      {hero && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "rgba(var(--accent-rgb, 91, 61, 245), 0.18)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "rgba(82,82,82,0.12)" }}
          />
        </>
      )}

      <div
        className={`relative ${
          hero
            ? "grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-8"
            : ""
        }`}
      >
        {/* ── Intro / greeting ──────────────────────────────── */}
        <div>
          <header className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`sparkle-badge inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[color:var(--color-surface)] text-[color:var(--color-brand-600)] shadow-[0_2px_8px_rgba(46,71,224,0.15)] ${
                  hero ? "h-9 w-9" : "h-8 w-8"
                }`}
              >
                <SparklesIcon size={hero ? 18 : 16} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold text-[color:var(--color-text)] ${
                      hero ? "text-[16px] sm:text-[17px]" : "text-[15px]"
                    }`}
                  >
                    AI Assistant
                  </h3>
                  <span className="inline-flex items-center rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-brand-100)] px-2 py-[1px] text-[10px] font-semibold text-[color:var(--color-brand-600)]">
                    Beta
                  </span>
                </div>
                {hero ? (
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]">
                    <span className="ping-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]" />
                    Ready to help
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[color:var(--color-text-muted)]">
              <button
                type="button"
                aria-label="Reset conversation"
                title="Clear prompt"
                onClick={() => setPrompt("")}
                className="icn icn-refresh inline-flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-secondary)]"
              >
                <RefreshIcon size={14} />
              </button>
              <Link
                href="/assistant"
                aria-label="Open full assistant"
                title="Open full assistant"
                className="icn icn-expand inline-flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-secondary)]"
              >
                <ExpandIcon size={14} />
              </Link>
            </div>
          </header>

          <p
            className={`font-semibold text-[color:var(--color-text)] ${
              hero
                ? "text-[20px] leading-[28px] tracking-tight sm:text-[22px] sm:leading-[30px]"
                : "mb-1 text-[13px]"
            }`}
          >
            {hero ? `${greeting}, ${userName}.` : `Hi ${userName}! `}
            {!hero && <span aria-hidden>👋</span>}
          </p>
          <p
            className={`text-[color:var(--color-text-secondary)] ${
              hero
                ? "mt-1.5 text-[13px] leading-[20px] sm:text-[14px] sm:leading-[22px]"
                : "mb-4 text-[12px] leading-[18px]"
            }`}
          >
            {hero
              ? "Describe a role or paste a job description — I'll surface the best-fit candidates from your pool, with match reasons."
              : "I can help you find the best candidates for any job. Paste a job description, LinkedIn link, or ask me anything about your talent pool."}
          </p>
        </div>

        {/* ── Input + examples ──────────────────────────────── */}
        <div className={hero ? "space-y-3" : ""}>
          <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-2 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-[0_2px_10px_rgba(31,27,23,0.04)] ${
              hero ? "sm:p-2.5" : ""
            }`}
          >
            <div className="flex items-center gap-1 text-[color:var(--color-text-muted)]">
              <button
                type="button"
                aria-label="Attach file"
                className="icn icn-clip inline-flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)]"
              >
                <PaperclipIcon size={16} />
              </button>
              <button
                type="button"
                aria-label="Attach screenshot"
                className="icn icn-image hidden h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)] sm:inline-flex"
              >
                <ImageIcon size={16} />
              </button>
              <button
                type="button"
                aria-label="Use template"
                className="icn icn-template hidden h-8 w-8 items-center justify-center rounded-[8px] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text-secondary)] sm:inline-flex"
              >
                <TemplateIcon size={16} />
              </button>
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                hero
                  ? "Paste a JD, LinkedIn link, or ask for candidates…"
                  : "Paste job description or ask anything..."
              }
              aria-label="Ask the AI assistant"
              className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[color:var(--color-text-muted)] ${
                hero ? "text-[13px] sm:text-[14px]" : "text-[13px]"
              }`}
            />
            <button
              type="submit"
              aria-label="Send prompt"
              data-active={prompt.trim().length > 0}
              className={`icn icn-send inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-[color:var(--color-brand-500)] font-semibold text-white shadow-[0_4px_12px_rgba(46,71,224,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)] ${
                hero ? "h-9 px-3 text-[13px]" : "h-8 w-8"
              }`}
            >
              <PaperPlaneIcon size={14} />
              {hero && <span className="hidden sm:inline">Ask</span>}
            </button>
          </form>

          <div className={hero ? "" : "mt-4"}>
            <p
              className={`text-[color:var(--color-text-secondary)] ${
                hero
                  ? "mb-2 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]"
                  : "mb-2 text-[12px] font-semibold"
              }`}
            >
              {hero ? "Try asking" : "Try these examples:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {(hero ? examples : examples.slice(0, 3)).map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setPrompt(ex)}
                  className="rounded-[999px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-[12px] text-[color:var(--color-text-secondary)] transition-all hover:-translate-y-[1px] hover:border-[color:var(--color-brand-300)] hover:text-[color:var(--color-brand-600)] hover:shadow-[0_4px_12px_rgba(46,71,224,0.10)]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
