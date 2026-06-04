"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  BriefcaseIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  SortIcon,
  UploadIcon,
} from "@/components/icons/AppIcons";
import {
  clientAccountManagers,
  clientIndustries,
  clientKpis,
  clients as ALL_CLIENTS,
  type Client,
  type ClientStatus,
  type ClientType,
} from "@/lib/clients-data";
import { AddClientModal } from "@/components/clients/AddClientModal";

/* ── Accent palette pulled from the design. Neutrals, surfaces and brand
   purple come from the app's CSS tokens so the layout stays theme-consistent
   with the rest of the product. ─────────────────────────────────────────── */
const BLUE = "#2563EB";
const BLUE_BG = "#E5EDFF";
const GREEN = "#16A34A";
const GREEN_BG = "#EAFBF1";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const AMBER_SOFT = "#FFFBEB";
const PURPLE = "var(--color-brand-500)";
const PURPLE_BG = "var(--color-brand-100)";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

const SORT_OPTIONS = [
  "Company A-Z",
  "Company Z-A",
  "Revenue (high)",
  "Open Roles",
  "Recent Activity",
] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const PAGE_SIZE_OPTIONS = [20, 50, 100];

const STATUS_STYLE: Record<ClientStatus, { bg: string; fg: string }> = {
  Active: { bg: GREEN_BG, fg: GREEN },
  Prospect: { bg: "#EAF2FF", fg: "#2563EB" },
  "At-Risk": { bg: AMBER_BG, fg: AMBER },
};

/* ── Small inline icons not in the shared set ─────────────────────────────── */
function WarningTriangleIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5 21 19.5H3L12 4.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1" fill={color} />
    </svg>
  );
}
function UsersIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke={color} strokeWidth="1.8" />
      <path
        d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 5.2A3 3 0 0 1 16 11M17 19c0-2.3-.9-4-2.4-5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function DollarSignIcon({ size = 24, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M15.5 7.5c0-1.7-1.6-2.8-3.6-2.8S8.3 5.8 8.3 7.5 9.9 10 12 10.3s3.7 1 3.7 2.8-1.6 2.9-3.7 2.9-3.7-1.2-3.7-2.9"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrendUpArrow({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden className="shrink-0">
      <path
        d="M2.5 8.5 5 6l2 2 2.5-2.5M9.5 5.5v2.5M9.5 5.5H7"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* ── KPI cards ────────────────────────────────────────────────────────────── */
function KpiCard({
  icon,
  iconBg,
  label,
  value,
  valueColor,
  note,
  noteColor,
  noteIcon,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor: string;
  note: string;
  noteColor: string;
  noteIcon?: React.ReactNode;
}) {
  return (
    <div className={`${CARD} flex items-start gap-4 p-[22px]`}>
      <span
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px]"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
          {label}
        </p>
        <p
          className="mt-1.5 text-[30px] font-extrabold leading-none tracking-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>
        <p
          className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium"
          style={{ color: noteColor }}
        >
          {noteIcon}
          {note}
        </p>
      </div>
    </div>
  );
}

function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Active Clients"
        value={clientKpis.activeClients.value}
        valueColor={BLUE}
        note={clientKpis.activeClients.note}
        noteColor={GREEN}
        noteIcon={<TrendUpArrow color={GREEN} />}
        iconBg={BLUE_BG}
        icon={<UsersIcon color={BLUE} />}
      />
      <KpiCard
        label="Revenue This Month"
        value={clientKpis.revenueThisMonth.value}
        valueColor={GREEN}
        note={clientKpis.revenueThisMonth.note}
        noteColor={GREEN}
        noteIcon={<TrendUpArrow color={GREEN} />}
        iconBg={GREEN_BG}
        icon={<DollarSignIcon color={GREEN} />}
      />
      <KpiCard
        label="Open Roles"
        value={clientKpis.openRoles.value}
        valueColor="var(--color-brand-600)"
        note={clientKpis.openRoles.note}
        noteColor="var(--color-text-secondary)"
        iconBg={PURPLE_BG}
        icon={<BriefcaseIcon size={24} style={{ color: "var(--color-brand-500)" }} />}
      />
      <KpiCard
        label="At-Risk Clients"
        value={clientKpis.atRiskClients.value}
        valueColor={AMBER}
        note={clientKpis.atRiskClients.note}
        noteColor="var(--color-text-secondary)"
        iconBg={AMBER_BG}
        icon={<WarningTriangleIcon color={AMBER} />}
      />
    </div>
  );
}

/* ── Filter select (label + dropdown) ─────────────────────────────────────── */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-[color:var(--color-text-muted)]">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-10 min-w-[124px] items-center justify-between gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          {value}
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div
            className="absolute right-0 z-20 mt-1 min-w-full overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
            onMouseLeave={() => setOpen(false)}
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`block w-full whitespace-nowrap px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                  o === value
                    ? "font-semibold text-[color:var(--color-brand-600)]"
                    : "text-[color:var(--color-text-secondary)]"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ── Status chip ──────────────────────────────────────────────────────────── */
function StatusChip({ status }: { status: ClientStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ background: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export function ClientsPageClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [manager, setManager] = useState("All");
  const [sort, setSort] = useState<SortOption>("Company A-Z");
  const [typeTab, setTypeTab] = useState<ClientType>("Direct");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = ALL_CLIENTS.filter((c) => {
      if (c.type !== typeTab) return false;
      if (status !== "All" && c.status !== status) return false;
      if (industry !== "All" && c.industry !== industry) return false;
      if (manager !== "All" && c.accountManager !== manager) return false;
      if (
        q &&
        !c.company.toLowerCase().includes(q) &&
        !c.contactName.toLowerCase().includes(q) &&
        !c.industry.toLowerCase().includes(q)
      )
        return false;
      return true;
    });

    out.sort((a, b) => {
      switch (sort) {
        case "Company Z-A":
          return b.company.localeCompare(a.company);
        case "Revenue (high)":
          return b.revenue - a.revenue;
        case "Open Roles":
          return b.openRoles - a.openRoles;
        case "Recent Activity":
          return 0;
        case "Company A-Z":
        default:
          return a.company.localeCompare(b.company);
      }
    });
    return out;
  }, [search, status, industry, manager, sort, typeTab]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allChecked = pageItems.length > 0 && pageItems.every((c) => selected[c.id]);
  const toggleAll = () =>
    setSelected(allChecked ? {} : Object.fromEntries(pageItems.map((c) => [c.id, true])));

  const headers = [
    "Company",
    "Industry",
    "Status",
    "Primary Contact",
    "Open Roles",
    "Active Placements",
    "Revenue (this month)",
    "Account Manager",
    "Last Activity",
    "Actions",
  ];

  return (
    <div className="min-w-0 space-y-5 px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      {/* ── Header ───────────────────────────────────── */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold leading-[30px] tracking-tight text-[color:var(--color-text)] sm:text-[26px] sm:leading-[34px]">
            Clients
          </h1>
          <p className="mt-1 text-[13px] leading-[20px] text-[color:var(--color-text-secondary)] sm:text-[14px] sm:leading-[22px]">
            Manage your client companies and relationships.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <UploadIcon size={16} />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)]"
          >
            <DownloadIcon size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
            style={{ background: PURPLE }}
          >
            <PlusIcon size={16} />
            Add Client
          </button>
        </div>
      </header>

      <KpiRow />

      {/* ── Table card ───────────────────────────────── */}
      <div className={`${CARD} p-5 sm:p-6`}>
        {/* Control bar */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-1 flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-end">
            <div className="relative min-w-[200px] flex-1 self-end">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                <SearchIcon size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search clients..."
                className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-3 text-[13px] text-[color:var(--color-text)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
            </div>
            <FilterSelect
              label="Status"
              value={status}
              options={["All", "Active", "Prospect", "At-Risk"]}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            />
            <FilterSelect
              label="Industry"
              value={industry}
              options={["All", ...clientIndustries]}
              onChange={(v) => {
                setIndustry(v);
                setPage(1);
              }}
            />
            <FilterSelect
              label="Account Manager"
              value={manager}
              options={["All", ...clientAccountManagers]}
              onChange={(v) => {
                setManager(v);
                setPage(1);
              }}
            />
            <FilterSelect
              label="Sort"
              value={sort}
              options={[...SORT_OPTIONS]}
              onChange={(v) => setSort(v as SortOption)}
            />
            <button
              type="button"
              aria-label="Toggle sort direction"
              className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              <SortIcon size={16} />
            </button>
          </div>

          {/* Direct / Vendor toggle */}
          <div
            role="group"
            aria-label="Client type"
            className="inline-flex shrink-0 items-center self-end rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-1"
          >
            {(["Direct", "Vendor"] as ClientType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTypeTab(t);
                  setPage(1);
                }}
                className={`inline-flex h-8 items-center rounded-full px-4 text-[13px] font-semibold transition-colors ${
                  typeTab === t
                    ? "bg-[color:var(--color-surface)] text-[color:var(--color-brand-600)] shadow-[var(--shadow-card)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse">
            <thead>
              <tr>
                <th className="pb-3 pl-1 pr-3 text-left align-middle">
                  <input
                    type="checkbox"
                    className="app-checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Select all clients"
                  />
                </th>
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`pb-3 pr-3 ${i === headers.length - 1 ? "text-right" : "text-left"}`}
                  >
                    <span
                      className={`inline-flex items-center gap-1 text-[12px] font-semibold text-[color:var(--color-text-muted)] ${
                        i === headers.length - 1 ? "justify-end" : ""
                      }`}
                    >
                      {h}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((c) => (
                <ClientRow
                  key={c.id}
                  c={c}
                  checked={Boolean(selected[c.id])}
                  onToggle={() => setSelected((s) => ({ ...s, [c.id]: !s[c.id] }))}
                />
              ))}
            </tbody>
          </table>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-12 text-center text-[14px] text-[color:var(--color-text-secondary)]">
            No clients match your filters.
          </div>
        ) : null}

        {/* Pagination */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-4 sm:flex-row">
          <span className="text-[13px] text-[color:var(--color-text-secondary)]">
            Showing {total === 0 ? 0 : (safePage - 1) * pageSize + 1} to{" "}
            {Math.min(safePage * pageSize, total)} of {total} clients
          </span>

          <div className="flex items-center gap-2">
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-current={safePage === p ? "page" : undefined}
                  onClick={() => setPage(p)}
                  className={`inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] px-2 text-[13px] font-semibold transition-colors ${
                    safePage === p
                      ? "border border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                      : "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </nav>

            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 appearance-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-3 pr-8 text-[13px] font-semibold text-[color:var(--color-text)] outline-none transition-colors hover:border-[color:var(--color-border-strong)]"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]"
              />
            </div>
          </div>
        </div>
      </div>

      <AddClientModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

/* ── Client row ───────────────────────────────────────────────────────────── */
function ClientRow({
  c,
  checked,
  onToggle,
}: {
  c: Client;
  checked: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(`/clients/${c.id}`)}
      className="cursor-pointer border-t border-[color:var(--color-border)] transition-colors hover:bg-[color:var(--color-surface-2)]/50"
      style={c.atRisk ? { background: AMBER_SOFT } : undefined}
    >
      <td className="py-3.5 pl-1 pr-3 align-middle" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          className="app-checkbox"
          checked={checked}
          onChange={onToggle}
          aria-label={`Select ${c.company}`}
        />
      </td>
      {/* Company */}
      <td className="py-3.5 pr-3">
        <div className="flex items-center gap-3">
          <CompanyLogo
            company={c.company}
            domain={c.domain}
            size={34}
            rounded="rounded-[10px]"
            fallbackBg={c.logoBg}
            fallbackFg="#FFFFFF"
          />
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[13.5px] font-semibold text-[color:var(--color-text)]">
              {c.company}
            </span>
            {c.tag ? (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{ background: PURPLE_BG, color: "var(--color-brand-600)" }}
              >
                {c.tag}
              </span>
            ) : null}
          </div>
        </div>
      </td>
      {/* Industry */}
      <td className="py-3.5 pr-3 whitespace-nowrap text-[13px] text-[color:var(--color-text-secondary)]">
        {c.industry}
      </td>
      {/* Status */}
      <td className="py-3.5 pr-3">
        <StatusChip status={c.status} />
      </td>
      {/* Primary Contact */}
      <td className="py-3.5 pr-3">
        <p className="whitespace-nowrap text-[13px] font-semibold text-[color:var(--color-text)]">
          {c.contactName}
        </p>
        <p className="whitespace-nowrap text-[12px] text-[color:var(--color-text-muted)]">
          {c.contactTitle}
        </p>
      </td>
      {/* Open Roles */}
      <td className="py-3.5 pr-3 text-[13px] font-semibold text-[color:var(--color-text)]">
        {c.openRoles}
      </td>
      {/* Active Placements */}
      <td className="py-3.5 pr-3 text-[13px] font-semibold text-[color:var(--color-text)]">
        {c.activePlacements}
      </td>
      {/* Revenue */}
      <td className="py-3.5 pr-3 whitespace-nowrap text-[13px] font-bold" style={{ color: GREEN }}>
        {usd(c.revenue)}
      </td>
      {/* Account Manager */}
      <td className="py-3.5 pr-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={c.accountManager} image={c.accountManagerImage} size={28} />
          <span className="whitespace-nowrap text-[13px] text-[color:var(--color-text)]">
            {c.accountManager}
          </span>
        </div>
      </td>
      {/* Last Activity */}
      <td
        className="py-3.5 pr-3 whitespace-nowrap text-[13px] font-medium"
        style={{ color: c.atRisk ? AMBER : "var(--color-text-secondary)" }}
      >
        {c.lastActivity}
      </td>
      {/* Actions */}
      <td className="py-3.5 pr-1" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[9px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            aria-label={`More actions for ${c.company}`}
          >
            <MoreIcon size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}
