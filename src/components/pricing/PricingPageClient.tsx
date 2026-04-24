"use client";

import Link from "next/link";
import { Fragment, useState, type ReactNode } from "react";
import {
  CheckIcon,
  ChevronRight,
  PhoneIcon,
  SparklesIcon,
  VerifiedBadgeIcon,
  XIcon,
} from "@/components/icons/AppIcons";

type BillingCycle = "monthly" | "yearly";

type Plan = {
  id: "team" | "growth" | "enterprise";
  name: string;
  tagline: string;
  priceLabel: (c: BillingCycle) => { amount: string; period: string };
  seatLabel: string;
  cta: { label: string; href: string };
  highlight?: boolean;
  accent: string;
  features: Array<{ label: string; included?: boolean }>;
  tag?: string;
};

const PLANS: Plan[] = [
  {
    id: "team",
    name: "Team",
    tagline: "Perfect for small, focused recruiting teams getting started.",
    priceLabel: (c) => ({
      amount: c === "monthly" ? "$100" : "$80",
      period: "/ month",
    }),
    seatLabel: "Team of up to 5",
    cta: { label: "Start with Team", href: "#" },
    accent: "#3B82F6",
    features: [
      { label: "Up to 5 recruiter seats", included: true },
      { label: "Unlimited candidates", included: true },
      { label: "AI job ↔ candidate matching", included: true },
      { label: "Resume parsing & enrichment", included: true },
      { label: "500 reveal credits / month", included: true },
      { label: "Email & in-app support", included: true },
      { label: "Team analytics", included: false },
      { label: "SSO & audit logs", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For scaling teams that need more seats, volume, and insights.",
    priceLabel: (c) => ({
      amount: c === "monthly" ? "$200" : "$160",
      period: "/ month",
    }),
    seatLabel: "Team of up to 20",
    cta: { label: "Upgrade to Growth", href: "#" },
    highlight: true,
    tag: "Most popular",
    accent: "#5B3DF5",
    features: [
      { label: "Up to 20 recruiter seats", included: true },
      { label: "Everything in Team, plus:", included: true },
      { label: "2,000 reveal credits / month", included: true },
      { label: "Advanced AI matching & suggestions", included: true },
      { label: "Team analytics & performance reports", included: true },
      { label: "Shared saved searches & playbooks", included: true },
      { label: "Priority support (24h response)", included: true },
      { label: "SSO & audit logs", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom-built for organizations with advanced compliance needs.",
    priceLabel: () => ({ amount: "Custom", period: "contact sales" }),
    seatLabel: "Unlimited seats",
    cta: { label: "Contact sales", href: "mailto:sales@recruit.app" },
    accent: "#171A2B",
    features: [
      { label: "Unlimited seats & workspaces", included: true },
      { label: "Everything in Growth, plus:", included: true },
      { label: "Custom reveal credit plans", included: true },
      { label: "SSO (SAML / OIDC) & SCIM", included: true },
      { label: "Audit logs & data residency", included: true },
      { label: "Dedicated success manager", included: true },
      { label: "Custom SLAs & integrations", included: true },
      { label: "Onboarding & white-glove rollout", included: true },
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
];

export function PricingPageClient() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="mx-auto min-h-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10 xl:px-8 xl:py-12">
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative mb-8 overflow-hidden rounded-[24px] border border-[color:var(--color-brand-200)] px-5 py-8 text-center sm:mb-10 sm:px-10 sm:py-12"
        style={{
          background:
            "radial-gradient(1200px 320px at 50% 0%, rgba(91,61,245,0.18), transparent 60%), radial-gradient(900px 240px at 100% 100%, rgba(59,130,246,0.10), transparent 55%), linear-gradient(180deg, #FBFAFF 0%, #FFFFFF 70%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(91,61,245,0.35), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -left-16 -bottom-20 h-48 w-48 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.35), transparent 70%)",
          }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[color:var(--color-brand-200)] bg-white px-3 py-1 text-[12px] font-semibold text-[color:var(--color-brand-600)]">
            <SparklesIcon size={12} />
            Simple, transparent pricing
          </span>
          <h1 className="mx-auto mt-4 max-w-[760px] text-[28px] font-bold leading-[36px] tracking-tight text-[color:var(--color-text)] sm:text-[40px] sm:leading-[48px]">
            A plan for every recruiting team
          </h1>
          <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-[22px] text-[color:var(--color-text-secondary)] sm:text-[15px]">
            Pick the plan that matches your team size. Every plan includes the
            full recruiting workspace — only seats and volume change.
          </p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-[14px] border border-[color:var(--color-border)] bg-white p-1 shadow-[var(--shadow-card)]">
            {(["monthly", "yearly"] as const).map((c) => {
              const on = cycle === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  className={`relative inline-flex h-9 items-center gap-2 rounded-[10px] px-3.5 text-[13px] font-semibold transition-colors ${
                    on
                      ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_4px_12px_rgba(91,61,245,0.25)]"
                      : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {c === "monthly" ? "Monthly" : "Yearly"}
                  {c === "yearly" ? (
                    <span
                      className={`inline-flex items-center rounded-[999px] px-1.5 py-0.5 text-[10px] font-bold ${
                        on ? "bg-white/20 text-white" : "bg-[#EAFBF1] text-[#16A34A]"
                      }`}
                    >
                      Save 20%
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Plan cards ─────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </section>

      {/* ── Trust strip ────────────────────────────────── */}
      <section className="mt-8 grid grid-cols-1 gap-4 rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:p-6">
        <TrustItem
          accent="#5B3DF5"
          title="14-day free trial"
          body="Try every feature of any plan risk-free. No credit card required."
        />
        <TrustItem
          accent="#16A34A"
          title="Cancel any time"
          body="Monthly plans cancel with one click. Yearly plans are refundable in 30 days."
        />
        <TrustItem
          accent="#F59E0B"
          title="Secure by default"
          body="SOC 2 Type II, GDPR compliant, and encrypted at rest and in transit."
        />
      </section>

      {/* ── Compare features ──────────────────────────── */}
      <section className="mt-10">
        <div className="mb-4 text-center">
          <h2 className="text-[20px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[24px]">
            Compare features
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
            The full breakdown across all three plans.
          </p>
        </div>
        <CompareTable />
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="mb-4 text-center">
          <h2 className="text-[20px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[24px]">
            Frequently asked
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────── */}
      <section
        className="relative mt-10 overflow-hidden rounded-[20px] border border-[color:var(--color-brand-200)] p-5 sm:p-8"
        style={{
          background:
            "radial-gradient(900px 200px at 100% 0%, rgba(91,61,245,0.15), transparent 60%), linear-gradient(180deg, #F4F1FF 0%, #FFFFFF 80%)",
        }}
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[22px]">
              Need something custom?
            </h3>
            <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px]">
              Enterprise rollouts, custom integrations, or tailored support —
              we&apos;d love to chat.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="mailto:sales@recruit.app"
              className="inline-flex h-11 items-center gap-1.5 rounded-[12px] border border-[color:var(--color-border)] bg-white px-4 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            >
              <PhoneIcon size={14} />
              Book a call
            </Link>
            <Link
              href="mailto:sales@recruit.app"
              className="inline-flex h-11 items-center gap-1.5 rounded-[12px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(91,61,245,0.28)] transition-colors hover:bg-[color:var(--color-brand-600)]"
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

// ─── Plan card ───────────────────────────────────────────────────────────────

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const price = plan.priceLabel(cycle);
  const isEnterprise = plan.id === "enterprise";
  const highlight = plan.highlight;

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[20px] border bg-[color:var(--color-surface)] p-5 transition-transform sm:p-6 ${
        highlight
          ? "border-[color:var(--color-brand-300)] shadow-[0_16px_40px_rgba(91,61,245,0.16)] lg:-translate-y-2"
          : "border-[color:var(--color-border)] shadow-[var(--shadow-card)]"
      }`}
      style={
        highlight
          ? {
              background:
                "linear-gradient(180deg, #FBFAFF 0%, #FFFFFF 60%)",
            }
          : undefined
      }
    >
      {highlight ? (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #5B3DF5 50%, transparent)",
          }}
        />
      ) : null}

      {plan.tag ? (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-[999px] bg-[color:var(--color-brand-500)] px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_4px_10px_rgba(91,61,245,0.30)]">
          <SparklesIcon size={11} />
          {plan.tag}
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        <h3 className="text-[18px] font-bold tracking-tight text-[color:var(--color-text)]">
          {plan.name}
        </h3>
      </div>
      <p className="mt-1 min-h-[40px] text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
        {plan.tagline}
      </p>

      <div className="mt-5 flex items-end gap-1.5">
        <span
          className="text-[36px] font-bold leading-none tracking-tight text-[color:var(--color-text)] sm:text-[40px]"
          style={highlight ? { color: plan.accent } : undefined}
        >
          {price.amount}
        </span>
        <span className="pb-1.5 text-[13px] font-medium text-[color:var(--color-text-secondary)]">
          {price.period}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[12px] text-[color:var(--color-text-muted)]">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: plan.accent }}
        />
        {plan.seatLabel}
        {cycle === "yearly" && !isEnterprise ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-[999px] bg-[#EAFBF1] px-1.5 py-0.5 text-[10px] font-bold text-[#16A34A]">
            Billed annually
          </span>
        ) : null}
      </div>

      <Link
        href={plan.cta.href}
        className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[12px] px-4 text-[13px] font-semibold transition-all ${
          highlight
            ? "bg-[color:var(--color-brand-500)] text-white shadow-[0_8px_20px_rgba(91,61,245,0.30)] hover:bg-[color:var(--color-brand-600)]"
            : isEnterprise
              ? "bg-[color:var(--color-text)] text-white hover:brightness-110"
              : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
        }`}
      >
        {plan.cta.label}
        <ChevronRight size={14} />
      </Link>

      <div className="mt-5 border-t border-[color:var(--color-border)] pt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)]">
          What&apos;s included
        </p>
        <ul className="space-y-2.5">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  f.included
                    ? "bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                    : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
                }`}
                style={
                  f.included
                    ? {
                        background: `${plan.accent}18`,
                        color: plan.accent,
                      }
                    : undefined
                }
              >
                {f.included ? <CheckIcon size={10} /> : <XIcon size={9} />}
              </span>
              <span
                className={`text-[13px] leading-[20px] ${
                  f.included
                    ? "text-[color:var(--color-text)]"
                    : "text-[color:var(--color-text-muted)] line-through"
                }`}
              >
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// ─── Trust item ──────────────────────────────────────────────────────────────

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
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
        style={{ background: `${accent}18`, color: accent }}
      >
        <VerifiedBadgeIcon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-[18px] text-[color:var(--color-text-secondary)]">
          {body}
        </p>
      </div>
    </div>
  );
}

// ─── Compare table ───────────────────────────────────────────────────────────

type CompareValue = ReactNode;
type Row = { label: string; team: CompareValue; growth: CompareValue; enterprise: CompareValue };

const GROUPS: Array<{ title: string; rows: Row[] }> = [
  {
    title: "Workspace",
    rows: [
      { label: "Recruiter seats", team: "Up to 5", growth: "Up to 20", enterprise: "Unlimited" },
      { label: "Candidates", team: "Unlimited", growth: "Unlimited", enterprise: "Unlimited" },
      { label: "Active jobs", team: "25", growth: "Unlimited", enterprise: "Unlimited" },
    ],
  },
  {
    title: "AI & enrichment",
    rows: [
      { label: "AI matching", team: true, growth: true, enterprise: true },
      { label: "Resume parsing", team: true, growth: true, enterprise: true },
      { label: "Reveal credits / month", team: "500", growth: "2,000", enterprise: "Custom" },
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
    title: "Security & support",
    rows: [
      { label: "Email support", team: true, growth: true, enterprise: true },
      { label: "Priority 24h response", team: false, growth: true, enterprise: true },
      { label: "SSO (SAML / OIDC)", team: false, growth: false, enterprise: true },
      { label: "Audit logs", team: false, growth: false, enterprise: true },
      { label: "Dedicated success manager", team: false, growth: false, enterprise: true },
    ],
  },
];

function CompareCell({ value, accent }: { value: CompareValue; accent?: string }) {
  if (value === true) {
    return (
      <span
        aria-label="Included"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{
          background: `${accent ?? "#5B3DF5"}18`,
          color: accent ?? "#5B3DF5",
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
    <div className="overflow-hidden rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)] sm:px-5">
                Feature
              </th>
              <th className="px-4 py-3 text-center sm:px-5">
                <p className="text-[13px] font-bold text-[color:var(--color-text)]">
                  Team
                </p>
                <p className="text-[11px] text-[color:var(--color-text-muted)]">
                  $100 / mo
                </p>
              </th>
              <th className="px-4 py-3 text-center sm:px-5">
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
              <th className="px-4 py-3 text-center sm:px-5">
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
                <tr className="bg-[color:var(--color-surface-2)]/20">
                  <td
                    colSpan={4}
                    className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-muted)] sm:px-5"
                  >
                    {g.title}
                  </td>
                </tr>
                {g.rows.map((row, i) => (
                  <tr
                    key={`${g.title}-${i}`}
                    className="border-t border-[color:var(--color-border)]"
                  >
                    <td className="px-4 py-3 text-[13px] text-[color:var(--color-text)] sm:px-5">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-center sm:px-5">
                      <CompareCell value={row.team} accent="#3B82F6" />
                    </td>
                    <td className="bg-[color:var(--color-brand-50)]/40 px-4 py-3 text-center sm:px-5">
                      <CompareCell value={row.growth} accent="#5B3DF5" />
                    </td>
                    <td className="px-4 py-3 text-center sm:px-5">
                      <CompareCell value={row.enterprise} accent="#171A2B" />
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

// ─── FAQ item ────────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className={`group rounded-[14px] border bg-[color:var(--color-surface)] p-4 text-left transition-all ${
        open
          ? "border-[color:var(--color-brand-300)] shadow-[var(--shadow-card)]"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-[color:var(--color-text)]">
          {q}
        </p>
        <span
          aria-hidden
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
            open
              ? "rotate-45 bg-[color:var(--color-brand-500)] text-white"
              : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
          }`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" stroke="currentColor" />
          </svg>
        </span>
      </div>
      {open ? (
        <p className="mt-2 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)]">
          {a}
        </p>
      ) : null}
    </button>
  );
}
