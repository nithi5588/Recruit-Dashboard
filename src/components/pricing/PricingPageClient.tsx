"use client";

import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import { Add } from "iconsax-reactjs";
import {
  CheckIcon,
  ChevronRight,
  PhoneIcon,
  ShieldIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";

type BillingCycle = "monthly" | "yearly";

type Plan = {
  id: "team" | "growth" | "enterprise";
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  seatLabel: string;
  cta: { label: string; href: string };
  highlight?: boolean;
  accent: string;
  Icon: typeof UsersIcon;
  features: Array<{ label: string; included?: boolean; bold?: boolean }>;
  tag?: string;
};

const PLANS: Plan[] = [
  {
    id: "team",
    name: "Team",
    tagline: "Perfect for small recruiting teams getting started.",
    monthly: 100,
    yearly: 80,
    seatLabel: "Up to 5 seats",
    cta: { label: "Start free trial", href: "#" },
    accent: "#6B6358",
    Icon: UsersIcon,
    features: [
      { label: "Up to 5 recruiter seats", included: true },
      { label: "Unlimited candidates", included: true },
      { label: "AI job ↔ candidate matching", included: true },
      { label: "Resume parsing & enrichment", included: true },
      { label: "500 reveal credits / month", included: true },
      { label: "CSV import & export", included: true },
      { label: "Email support", included: true },
      { label: "Team analytics", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For scaling teams that need more volume and insights.",
    monthly: 200,
    yearly: 160,
    seatLabel: "Up to 20 seats",
    cta: { label: "Start free trial", href: "#" },
    highlight: true,
    tag: "Most popular",
    accent: "#EA6814",
    Icon: TrophyIcon,
    features: [
      { label: "Everything in Team, plus:", included: true, bold: true },
      { label: "Up to 20 recruiter seats", included: true },
      { label: "2,000 reveal credits / month", included: true },
      { label: "Advanced AI matching & suggestions", included: true },
      { label: "Team analytics & performance reports", included: true },
      { label: "Shared playbooks & saved searches", included: true },
      { label: "Slack & email notifications", included: true },
      { label: "Priority support · 24h response", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Tailored for larger organizations and custom needs.",
    monthly: null,
    yearly: null,
    seatLabel: "Unlimited seats",
    cta: { label: "Contact sales", href: "mailto:sales@recruit.app" },
    accent: "#1F1B17",
    Icon: ShieldIcon,
    features: [
      { label: "Everything in Growth, plus:", included: true, bold: true },
      { label: "Unlimited seats & workspaces", included: true },
      { label: "Custom reveal credit plans", included: true },
      { label: "API access & webhooks", included: true },
      { label: "Custom roles & permissions", included: true },
      { label: "Custom integrations", included: true },
      { label: "Dedicated onboarding & training", included: true },
      { label: "Priority support with SLA", included: true },
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Can I change plans later?",
    a: "Yes — upgrade, downgrade, or cancel at any time. Changes take effect on your next billing cycle, and we'll prorate the difference.",
  },
  {
    q: "What counts as a reveal credit?",
    a: "A reveal credit is spent each time you unmask a recruiter's email or phone. Unused credits roll over for one full billing cycle.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Every plan includes a 14-day free trial with full access. No credit card required to get started.",
  },
  {
    q: "How does annual billing work?",
    a: "Switch to annual billing to save 20% off monthly pricing. You're billed upfront for 12 months and keep the discount as long as you stay on the plan.",
  },
  {
    q: "Which payment methods do you support?",
    a: "All major credit cards via Stripe. Annual Enterprise plans can also be paid by bank transfer or invoice.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is encrypted in transit (HTTPS / TLS 1.2+) and at rest. You can export or delete your workspace data at any time.",
  },
];

export function PricingPageClient() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="relative mx-auto min-h-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10 xl:px-8 xl:py-12">
      <style jsx>{`
        @keyframes pp-orb-a {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(20px, -10px) scale(1.05); }
        }
        @keyframes pp-orb-b {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-18px, 12px) scale(1.08); }
        }
        @keyframes pp-shine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        .pp-orb-a { animation: pp-orb-a 9s ease-in-out infinite; }
        .pp-orb-b { animation: pp-orb-b 11s ease-in-out infinite; }

        /* Hero background (light + dark) */
        .pp-hero {
          background:
            radial-gradient(1200px 360px at 50% -10%, rgba(var(--accent-rgb), 0.20), transparent 60%),
            radial-gradient(900px 280px at 0% 100%, rgba(0,0,0,0.05), transparent 55%),
            linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-surface) 75%);
        }
        :global(html[data-theme="dark"]) .pp-hero {
          background:
            radial-gradient(1200px 360px at 50% -10%, rgba(var(--accent-rgb), 0.28), transparent 60%),
            radial-gradient(900px 280px at 0% 100%, rgba(255,255,255,0.04), transparent 55%),
            linear-gradient(180deg, #0E0E0E 0%, var(--color-surface) 80%);
        }

        /* CTA strip background */
        .pp-cta {
          background:
            radial-gradient(900px 240px at 100% 0%, rgba(var(--accent-rgb), 0.20), transparent 60%),
            radial-gradient(700px 200px at 0% 100%, rgba(0,0,0,0.06), transparent 60%),
            linear-gradient(180deg, var(--color-surface) 0%, var(--color-surface) 80%);
        }
        :global(html[data-theme="dark"]) .pp-cta {
          background:
            radial-gradient(900px 240px at 100% 0%, rgba(var(--accent-rgb), 0.28), transparent 60%),
            radial-gradient(700px 200px at 0% 100%, rgba(255,255,255,0.04), transparent 60%),
            linear-gradient(180deg, #161616 0%, var(--color-surface) 80%);
        }

        /* Subtle dot grid — invisible on dark unless we lift it */
        .pp-dot-grid {
          background-image: radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px);
          background-size: 22px 22px;
        }
        :global(html[data-theme="dark"]) .pp-dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
        }

        /* Drifting orbs */
        .pp-orb-warm {
          background: radial-gradient(circle, rgba(var(--accent-rgb), 0.42), transparent 70%);
        }
        .pp-orb-neutral {
          background: radial-gradient(circle, rgba(0,0,0,0.18), transparent 70%);
        }
        :global(html[data-theme="dark"]) .pp-orb-warm {
          background: radial-gradient(circle, rgba(var(--accent-rgb), 0.50), transparent 70%);
        }
        :global(html[data-theme="dark"]) .pp-orb-neutral {
          background: radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%);
        }

        /* Plan card hover */
        .pp-card { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease, border-color .2s ease; }
        .pp-card:hover { transform: translateY(-4px); box-shadow: 0 20px 44px rgba(0,0,0,.10); }
        :global(html[data-theme="dark"]) .pp-card:hover { box-shadow: 0 20px 44px rgba(0,0,0,.55); }

        .pp-card.is-hl { transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease; }
        .pp-card.is-hl:hover { transform: translateY(-6px); box-shadow: 0 26px 60px rgba(var(--accent-rgb),.22); }
        :global(html[data-theme="dark"]) .pp-card.is-hl:hover { box-shadow: 0 26px 60px rgba(var(--accent-rgb),.32); }

        /* Highlighted plan card inner surface */
        .pp-hl-surface {
          background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.06) 0%, var(--color-surface) 60%);
          box-shadow: 0 16px 40px rgba(var(--accent-rgb), 0.16);
        }
        :global(html[data-theme="dark"]) .pp-hl-surface {
          background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.10) 0%, var(--color-surface) 60%);
          box-shadow: 0 16px 40px rgba(var(--accent-rgb), 0.28);
        }

        /* Highlighted card glossy sheen */
        .pp-hl-shine {
          position: absolute; top: 0; left: 0;
          width: 60%; height: 100%;
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.55) 50%, transparent 70%);
          mix-blend-mode: overlay; pointer-events: none;
          animation: pp-shine 5.5s ease-in-out infinite;
        }
        :global(html[data-theme="dark"]) .pp-hl-shine {
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.16) 50%, transparent 70%);
          mix-blend-mode: screen;
        }

        /* Compare table — Growth column tint */
        .pp-growth-col-head {
          background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.10) 0%, rgba(var(--accent-rgb), 0.04) 100%);
        }
        :global(html[data-theme="dark"]) .pp-growth-col-head {
          background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.18) 0%, rgba(var(--accent-rgb), 0.06) 100%);
        }
        .pp-growth-col { background: rgba(var(--accent-rgb), 0.05); }
        :global(html[data-theme="dark"]) .pp-growth-col { background: rgba(var(--accent-rgb), 0.10); }

        /* Enterprise plan icon — flip in dark since #1F1B17 is invisible */
        :global(html[data-theme="dark"]) .pp-icon-enterprise {
          background: rgba(255,255,255,0.06) !important;
          color: var(--color-text) !important;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12) !important;
        }
        /* Same for Enterprise CTA button */
        :global(html[data-theme="dark"]) .pp-cta-enterprise {
          background: var(--color-surface-2) !important;
          color: var(--color-text) !important;
          box-shadow: inset 0 0 0 1px var(--color-border-strong);
        }
        :global(html[data-theme="dark"]) .pp-cta-enterprise:hover {
          background: var(--color-border-strong) !important;
          filter: none !important;
        }

        .pp-toggle-thumb { transition: left .28s cubic-bezier(.34,1.56,.64,1); }

        @media (prefers-reduced-motion: reduce) {
          .pp-orb-a, .pp-orb-b, .pp-hl-shine { animation: none !important; }
          .pp-card { transition: none !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="pp-hero relative mb-10 overflow-hidden rounded-[28px] border border-[color:var(--color-brand-200)] px-5 py-10 text-center sm:mb-12 sm:px-10 sm:py-14">
        <span
          aria-hidden
          className="pp-dot-grid pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
        <span
          aria-hidden
          className="pp-orb-a pp-orb-warm pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-60 blur-3xl"
        />
        <span
          aria-hidden
          className="pp-orb-b pp-orb-neutral pointer-events-none absolute -left-20 -bottom-24 h-56 w-56 rounded-full opacity-50 blur-3xl"
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-surface)]/85 px-3 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)] shadow-[0_2px_10px_rgba(234,104,20,0.10)] backdrop-blur">
            <SparklesIcon size={12} />
            Simple, transparent pricing
          </span>

          <h1 className="mx-auto mt-5 max-w-[820px] text-[30px] font-bold leading-[38px] tracking-tight text-[color:var(--color-text)] sm:text-[44px] sm:leading-[52px]">
            A plan for every recruiting{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(95deg, #EA6814 0%, #C75510 100%)",
              }}
            >
              team
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-[600px] text-[14px] leading-[22px] text-[color:var(--color-text-secondary)] sm:text-[15.5px] sm:leading-[24px]">
            Start free for 14 days. Pick the plan that matches your team
            size — every plan includes the full recruiting workspace, only
            seats and volume change.
          </p>

          <div className="relative mt-7 inline-flex items-center gap-1 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-1 shadow-[0_8px_24px_rgba(31,27,23,0.06)]">
            <span
              aria-hidden
              className="pp-toggle-thumb absolute top-1 bottom-1 rounded-[10px] bg-[color:var(--color-brand-500)] shadow-[0_4px_14px_rgba(234,104,20,0.32)]"
              style={{
                left: cycle === "monthly" ? "4px" : "calc(50%)",
                width: "calc(50% - 4px)",
              }}
            />
            {(["monthly", "yearly"] as const).map((c) => {
              const on = cycle === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={`relative z-10 inline-flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold transition-colors ${
                    on
                      ? "text-white"
                      : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {c === "monthly" ? "Monthly" : "Yearly"}
                  {c === "yearly" ? (
                    <span
                      className={`inline-flex items-center rounded-[999px] px-1.5 py-0.5 text-[10px] font-bold ${
                        on
                          ? "bg-white/25 text-white"
                          : "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                      }`}
                    >
                      −20%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <ul className="relative mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-[color:var(--color-text-secondary)] sm:text-[13px]">
            {[
              "14-day free trial",
              "No credit card required",
              "Cancel anytime",
              "Unlimited candidates",
            ].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]">
                  <CheckIcon size={10} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Plan cards */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </section>

      {/* Trust strip */}
      <section className="mt-10 grid grid-cols-1 gap-5 rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:p-6">
        <TrustItem
          accent="#EA6814"
          title="Free 14-day trial"
          body="Try every feature on any plan. No credit card needed."
        />
        <TrustItem
          accent="#C75510"
          title="Cancel anytime"
          body="Monthly plans cancel in one click. Yearly plans are refundable within 30 days."
        />
        <TrustItem
          accent="#6B6358"
          title="Encrypted by default"
          body="Your data is encrypted in transit and at rest. Export or delete it whenever you want."
        />
      </section>

      {/* Compare features */}
      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
            Compare features
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
            The full breakdown across all three plans.
          </p>
        </div>
        <CompareTable />
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
            Frequently asked
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
            Can&apos;t find your answer?{" "}
            <Link
              href="mailto:sales@recruit.app"
              className="font-semibold text-[color:var(--color-brand-600)] hover:underline"
            >
              Drop us a line
            </Link>
            .
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="pp-cta relative mt-12 overflow-hidden rounded-[24px] border border-[color:var(--color-brand-200)] p-6 sm:p-10">
        <span
          aria-hidden
          className="pp-orb-warm pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-60 blur-3xl"
        />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[color:var(--color-brand-200)] bg-[color:var(--color-surface)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-brand-600)]">
              <SparklesIcon size={11} />
              For larger teams
            </span>
            <h3 className="mt-2 text-[20px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
              Need something custom?
            </h3>
            <p className="mt-1 max-w-[520px] text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14.5px] sm:leading-[22px]">
              Custom rollouts, integrations, or volume pricing — we&apos;d
              love to set you up. A real person will reply within 1 business
              day.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="mailto:sales@recruit.app"
              className="inline-flex h-11 items-center gap-1.5 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            >
              <PhoneIcon size={14} />
              Book a call
            </Link>
            <Link
              href="mailto:sales@recruit.app"
              className="inline-flex h-11 items-center gap-1.5 rounded-[12px] bg-[color:var(--color-brand-500)] px-5 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(234,104,20,0.32)] transition-colors hover:bg-[color:var(--color-brand-600)]"
            >
              Contact sales
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const isEnterprise = plan.id === "enterprise";
  const highlight = !!plan.highlight;
  const Icon = plan.Icon;

  const monthly = plan.monthly;
  const yearly = plan.yearly;
  const amountNum = cycle === "monthly" ? monthly : yearly;
  const isCustom = amountNum === null;
  const annualSavings =
    monthly !== null && yearly !== null ? (monthly - yearly) * 12 : 0;

  return (
    <article
      className={`pp-card relative isolate flex h-full flex-col overflow-hidden rounded-[22px] p-[1.5px] ${
        highlight ? "is-hl lg:-translate-y-2" : ""
      }`}
      style={
        highlight
          ? {
              background:
                "linear-gradient(160deg, rgba(var(--accent-rgb), 0.85) 0%, rgba(var(--accent-rgb), 0.55) 35%, rgba(var(--accent-rgb), 0.10) 70%, rgba(var(--accent-rgb), 0) 100%)",
            }
          : undefined
      }
    >
      <div
        className={`relative flex h-full flex-col rounded-[20px] bg-[color:var(--color-surface)] p-6 ${
          highlight
            ? "pp-hl-surface"
            : "border border-[color:var(--color-border)] shadow-[var(--shadow-card)]"
        }`}
      >
        {highlight ? <span aria-hidden className="pp-hl-shine" /> : null}

        {plan.tag ? (
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-[999px] bg-[color:var(--color-brand-500)] px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_rgba(234,104,20,0.30)]">
            <SparklesIcon size={11} />
            {plan.tag}
          </span>
        ) : null}

        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${
              isEnterprise ? "pp-icon-enterprise" : ""
            }`}
            style={{
              background: `${plan.accent}1A`,
              color: plan.accent,
              boxShadow: highlight
                ? `inset 0 0 0 1px ${plan.accent}33`
                : undefined,
            }}
          >
            <Icon size={18} />
          </span>
          <h3 className="text-[19px] font-bold tracking-tight text-[color:var(--color-text)]">
            {plan.name}
          </h3>
        </div>
        <p className="mt-2 min-h-[42px] text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
          {plan.tagline}
        </p>

        <div className="mt-5 flex items-end gap-1.5">
          {isCustom ? (
            <span
              className="text-[36px] font-bold leading-none tracking-tight text-[color:var(--color-text)] sm:text-[40px]"
              style={highlight ? { color: plan.accent } : undefined}
            >
              Custom
            </span>
          ) : (
            <>
              <span
                className="self-start pt-2 text-[18px] font-semibold text-[color:var(--color-text-secondary)]"
                style={highlight ? { color: plan.accent } : undefined}
              >
                $
              </span>
              <span
                className="text-[44px] font-bold leading-none tracking-tight text-[color:var(--color-text)] sm:text-[48px]"
                style={highlight ? { color: plan.accent } : undefined}
              >
                {amountNum}
              </span>
              <span className="pb-2 text-[13px] font-medium text-[color:var(--color-text-secondary)]">
                / month
              </span>
            </>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-[color:var(--color-text-muted)]">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: plan.accent }}
          />
          {plan.seatLabel}
          {!isCustom && cycle === "yearly" ? (
            <span className="ml-auto inline-flex items-center gap-1 rounded-[999px] bg-[color:var(--color-brand-100)] px-2 py-0.5 text-[10px] font-bold text-[color:var(--color-brand-600)]">
              Save ${annualSavings}/yr
            </span>
          ) : null}
          {isCustom ? (
            <span className="ml-auto text-[color:var(--color-text-secondary)]">
              Talk to sales
            </span>
          ) : null}
        </div>

        <Link
          href={plan.cta.href}
          className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[12px] px-4 text-[13px] font-semibold transition-all ${
            highlight
              ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_10px_24px_rgba(234,104,20,0.32)] hover:bg-[color:var(--color-brand-600)]"
              : isEnterprise
                ? "pp-cta-enterprise bg-[color:var(--color-text)] text-white hover:brightness-110"
                : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-surface-2)]"
          }`}
        >
          {plan.cta.label}
          <ChevronRight size={14} />
        </Link>

        <div className="mt-6 border-t border-[color:var(--color-border)] pt-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
            What&apos;s included
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={
                    f.included
                      ? {
                          background: `${plan.accent}1F`,
                          color: plan.accent,
                        }
                      : {
                          background: "var(--color-surface-2)",
                          color: "var(--color-text-muted)",
                        }
                  }
                >
                  {f.included ? <CheckIcon size={10} /> : <XIcon size={9} />}
                </span>
                <span
                  className={`text-[13px] leading-[20px] ${
                    f.included
                      ? f.bold
                        ? "font-semibold text-[color:var(--color-text)]"
                        : "text-[color:var(--color-text)]"
                      : "text-[color:var(--color-text-muted)] line-through"
                  }`}
                >
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function TrustItem({
  accent,
  title,
  body,
}: {
  accent: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
        style={{
          background: `${accent}1A`,
          color: accent,
          boxShadow: `inset 0 0 0 1px ${accent}26`,
        }}
      >
        <CheckIcon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-[color:var(--color-text)]">
          {title}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-[18px] text-[color:var(--color-text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}

type CompareValue = ReactNode;
type Row = {
  label: string;
  team: CompareValue;
  growth: CompareValue;
  enterprise: CompareValue;
};

const GROUPS: Array<{ title: string; rows: Row[] }> = [
  {
    title: "Workspace",
    rows: [
      { label: "Recruiter seats", team: "Up to 5", growth: "Up to 20", enterprise: "Unlimited" },
      { label: "Candidates", team: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
      { label: "Active jobs", team: "25", growth: "Unlimited", enterprise: "Unlimited" },
      { label: "CSV import & export", team: true, growth: true, enterprise: true },
    ],
  },
  {
    title: "AI & enrichment",
    rows: [
      { label: "AI matching", team: true, growth: true, enterprise: true },
      { label: "Resume parsing", team: true, growth: true, enterprise: true },
      { label: "Reveal credits / month", team: "500", growth: "2,000", enterprise: "Custom" },
      { label: "Advanced AI suggestions", team: false, growth: true, enterprise: true },
    ],
  },
  {
    title: "Analytics",
    rows: [
      { label: "Pipeline reports", team: true, growth: true, enterprise: true },
      { label: "Team performance reports", team: false, growth: true, enterprise: true },
      { label: "Custom dashboards", team: false, growth: false, enterprise: true },
    ],
  },
  {
    title: "Collaboration & support",
    rows: [
      { label: "Email support", team: true, growth: true, enterprise: true },
      { label: "Slack & email notifications", team: false, growth: true, enterprise: true },
      { label: "Priority 24h response", team: false, growth: true, enterprise: true },
      { label: "API access & webhooks", team: false, growth: false, enterprise: true },
      { label: "Custom roles & permissions", team: false, growth: false, enterprise: true },
      { label: "Dedicated onboarding", team: false, growth: false, enterprise: true },
    ],
  },
];

function CompareCell({
  value,
  accent,
}: {
  value: CompareValue;
  accent?: string;
}) {
  if (value === true) {
    return (
      <span
        aria-label="Included"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          background: `${accent ?? "#EA6814"}1F`,
          color: accent ?? "#EA6814",
        }}
      >
        <CheckIcon size={12} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span
        aria-label="Not included"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
      >
        <XIcon size={11} />
      </span>
    );
  }
  return (
    <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
      {value}
    </span>
  );
}

function CompareTable() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/50">
              <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)] sm:px-6">
                Feature
              </th>
              <th className="px-4 py-4 text-center sm:px-6">
                <p className="text-[13px] font-bold text-[color:var(--color-text)]">
                  Team
                </p>
                <p className="text-[11px] text-[color:var(--color-text-muted)]">
                  $100 / mo
                </p>
              </th>
              <th className="pp-growth-col-head relative px-4 py-4 text-center sm:px-6">
                <p className="inline-flex items-center gap-1 text-[13px] font-bold text-[color:var(--color-brand-600)]">
                  Growth
                  <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-brand-500)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    Popular
                  </span>
                </p>
                <p className="text-[11px] text-[color:var(--color-text-muted)]">
                  $200 / mo
                </p>
              </th>
              <th className="px-4 py-4 text-center sm:px-6">
                <p className="text-[13px] font-bold text-[color:var(--color-text)]">
                  Enterprise
                </p>
                <p className="text-[11px] text-[color:var(--color-text-muted)]">
                  Custom
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <Fragment key={g.title}>
                <tr className="bg-[color:var(--color-surface-2)]/30">
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)] sm:px-6"
                  >
                    {g.title}
                  </td>
                </tr>
                {g.rows.map((row, i) => (
                  <tr
                    key={`${g.title}-${i}`}
                    className="border-t border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-2)]/30"
                  >
                    <td className="px-4 py-3 text-[13px] text-[color:var(--color-text)] sm:px-6">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-center sm:px-6">
                      <CompareCell value={row.team} accent="#6B6358" />
                    </td>
                    <td className="pp-growth-col px-4 py-3 text-center sm:px-6">
                      <CompareCell value={row.growth} accent="#EA6814" />
                    </td>
                    <td className="px-4 py-3 text-center sm:px-6">
                      <CompareCell value={row.enterprise} accent="#1F1B17" />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={`group rounded-[16px] border bg-[color:var(--color-surface)] p-5 text-left transition-all ${
        open
          ? "border-[color:var(--color-brand-300)] shadow-[0_10px_28px_rgba(234,104,20,0.10)]"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-brand-200)] hover:shadow-[var(--shadow-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
          {q}
        </p>
        <span
          aria-hidden
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            open
              ? "rotate-45 bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_rgba(234,104,20,0.30)]"
              : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)] group-hover:bg-[color:var(--color-brand-100)] group-hover:text-[color:var(--color-brand-600)]"
          }`}
        >
          <Add size={14} color="currentColor" variant="Linear" />
        </span>
      </div>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 text-[13px] leading-[21px] text-[color:var(--color-text-secondary)]">
            {a}
          </p>
        </div>
      </div>
    </button>
  );
}
