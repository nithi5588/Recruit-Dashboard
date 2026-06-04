"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  EditIcon,
  IdCardIcon,
  InboxIcon,
  LockIcon,
  MoneyIcon,
  MonitorIcon,
  ProfileIcon,
  ShieldIcon,
  TargetIcon,
  TrashIcon,
  TrendUpIcon,
  UploadIcon,
  UserPlusIcon,
  UserRemoveIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { MemberDetail, TeamRole } from "@/lib/team-data";
import {
  getMemberSettings,
  teamRoleOptions,
  type PermissionItem,
  type PermissionKey,
} from "@/lib/team-settings-data";

/* ── Accent palette — mirrors the design exactly; neutrals/brand come from the
   app's CSS tokens so it stays theme-consistent. ──────────────────────────── */
const GREEN = "#16A34A";
const GREEN_SOLID = "#22C55E";
const GREEN_BG = "#EAFBF1";
const VIOLET = "#7C3AED";
const VIOLET_BG = "#F3E8FF";
const RED = "#DC2626";
const RED_SOLID = "#EF4444";
const RED_BORDER = "#F3C9C9";
const RED_BG = "#FEF5F5";

const CARD =
  "rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-card)]";

/* Per-permission icon — soft brand tile to match the mock. */
const PERMISSION_ICON: Record<PermissionKey, React.ReactNode> = {
  "view-financials": <MoneyIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "view-all-candidates": <UsersIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "view-other-recruiters": <ProfileIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "edit-clients": <EditIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "export-data": <UploadIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "reassign-consultants": <TrendUpIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "manage-team": <UsersIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "invite-members": <UserPlusIcon size={16} className="text-[color:var(--color-brand-600)]" />,
  "edit-targets": <TargetIcon size={16} className="text-[color:var(--color-brand-600)]" />,
};

/* ── Toggle switch ────────────────────────────────────────────────────────── */
function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className="relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full transition-colors"
      style={{ background: on ? GREEN_SOLID : "var(--color-border-strong)" }}
    >
      <span
        className="inline-block h-[20px] w-[20px] rounded-full bg-white shadow-[0_1px_3px_rgba(23,26,43,0.25)] transition-transform"
        style={{ transform: on ? "translateX(23px)" : "translateX(3px)" }}
      />
    </button>
  );
}

/* ── Role & Access ────────────────────────────────────────────────────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{children}</p>
  );
}

function FieldHelp({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-[12px] text-[color:var(--color-text-muted)]">{children}</p>
  );
}

function RoleAccessCard({
  role,
  setRole,
  reportsTo,
  active,
  setActive,
}: {
  role: TeamRole;
  setRole: (r: TeamRole) => void;
  reportsTo: string;
  active: boolean;
  setActive: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Role &amp; Access</h3>

      {/* Current Role */}
      <div className="mt-5">
        <FieldLabel>Current Role</FieldLabel>
        <div className="relative mt-2.5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 w-full items-center gap-2.5 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 text-left transition-colors hover:bg-[color:var(--color-surface-2)]"
          >
            <ProfileIcon size={17} className="shrink-0 text-[color:var(--color-brand-600)]" />
            <span className="flex-1 text-[14px] font-semibold text-[color:var(--color-text)]">
              {role}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-[color:var(--color-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open ? (
            <div
              className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-dropdown)]"
              onMouseLeave={() => setOpen(false)}
            >
              {teamRoleOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setOpen(false);
                  }}
                  className={`block w-full px-3.5 py-2.5 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)] ${
                    r === role
                      ? "font-semibold text-[color:var(--color-brand-600)]"
                      : "text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <FieldHelp>Set the primary role for this member.</FieldHelp>
      </div>

      {/* Account Status */}
      <div className="mt-5">
        <FieldLabel>Account Status</FieldLabel>
        <div className="mt-2.5 flex items-center gap-3">
          <Toggle on={active} onChange={() => setActive(!active)} label="Account status" />
          <span
            className="text-[14px] font-semibold"
            style={{ color: active ? GREEN : "var(--color-text-muted)" }}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>
        <FieldHelp>Active members can log in and access the system.</FieldHelp>
      </div>

      {/* Reports To */}
      <div className="mt-5">
        <FieldLabel>Reports To</FieldLabel>
        <button
          type="button"
          className="mt-2.5 flex h-11 w-full items-center gap-2.5 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-left transition-colors hover:bg-[color:var(--color-surface-2)]"
        >
          <Avatar name={reportsTo} size={24} />
          <span className="flex-1 text-[14px] font-semibold text-[color:var(--color-text)]">
            {reportsTo}
          </span>
          <ChevronDown size={16} className="shrink-0 text-[color:var(--color-text-muted)]" />
        </button>
        <FieldHelp>Select the manager this member reports to.</FieldHelp>
      </div>
    </div>
  );
}

/* ── Permissions ──────────────────────────────────────────────────────────── */
function PermissionRow({
  item,
  onToggle,
}: {
  item: PermissionItem;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)]">
        {PERMISSION_ICON[item.key]}
      </span>
      <span className="flex-1 text-[13.5px] font-medium text-[color:var(--color-text)]">
        {item.label}
      </span>
      <Toggle on={item.on} onChange={onToggle} label={item.label} />
    </div>
  );
}

function PermissionsCard({
  inheritsFrom,
  groups,
  onToggle,
}: {
  inheritsFrom: TeamRole;
  groups: { title: string; items: PermissionItem[] }[];
  onToggle: (key: PermissionKey) => void;
}) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Permissions</h3>
      <p className="mt-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
        Permissions inherited from {inheritsFrom} role — customize below.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3 lg:divide-x lg:divide-[color:var(--color-border)]">
        {groups.map((group) => (
          <div key={group.title} className="lg:[&:not(:first-child)]:pl-8">
            <p className="text-[13px] font-bold text-[color:var(--color-text-secondary)]">
              {group.title}
            </p>
            <div className="mt-4 space-y-4">
              {group.items.map((item) => (
                <PermissionRow key={item.key} item={item} onToggle={() => onToggle(item.key)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Security ─────────────────────────────────────────────────────────────── */
function SecurityRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]">
        {icon}
      </span>
      <span className="w-[150px] shrink-0 text-[13px] text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
    </div>
  );
}

function SecurityCard({
  security,
}: {
  security: ReturnType<typeof getMemberSettings>["security"];
}) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Security</h3>
      <div className="mt-5 space-y-5">
        <SecurityRow icon={<ClockIcon size={17} />} label="Last Login">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-surface-2)] px-2.5 py-1 text-[12px] font-semibold text-[color:var(--color-text)]">
            <ClockIcon size={13} className="text-[color:var(--color-text-muted)]" />
            {security.lastLoginRelative}
          </span>
          <span className="truncate text-[13px] text-[color:var(--color-text-secondary)]">
            {security.lastLoginAbsolute}
          </span>
        </SecurityRow>

        <SecurityRow icon={<ShieldIcon size={17} />} label="Two-Factor Authentication">
          {security.twoFactor ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
              style={{ background: GREEN_BG, color: GREEN }}
            >
              <CheckIcon size={13} />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[color:var(--color-surface-2)] px-2.5 py-1 text-[12px] font-semibold text-[color:var(--color-text-muted)]">
              Disabled
            </span>
          )}
          <span className="text-[13px] text-[color:var(--color-text-secondary)]">
            {security.twoFactor ? "Protects account with 2FA" : "Not enabled for this account"}
          </span>
        </SecurityRow>

        <SecurityRow icon={<LockIcon size={17} />} label="Password">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              className="inline-flex h-9 w-fit items-center rounded-[11px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-surface-2)]"
            >
              Reset password
            </button>
            <span className="text-[12px] text-[color:var(--color-text-muted)]">
              {security.passwordChanged}
            </span>
          </div>
        </SecurityRow>

        <SecurityRow icon={<MonitorIcon size={17} />} label="Active Sessions">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {security.activeSessions} device{security.activeSessions === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            className="text-[13px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-500)]"
          >
            Manage active sessions
          </button>
        </SecurityRow>
      </div>
    </div>
  );
}

/* ── Account Details ──────────────────────────────────────────────────────── */
function AccountRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-3 text-[13px] text-[color:var(--color-text-secondary)]">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]">
          {icon}
        </span>
        {label}
      </span>
      <div className="flex items-center gap-2.5 text-right">{children}</div>
    </div>
  );
}

function AccountDetailsCard({
  account,
}: {
  account: ReturnType<typeof getMemberSettings>["account"];
}) {
  return (
    <div className={`${CARD} p-5 sm:p-6`}>
      <h3 className="text-[16px] font-bold text-[color:var(--color-text)]">Account Details</h3>
      <div className="mt-5 space-y-5">
        <AccountRow icon={<IdCardIcon size={17} />} label="Employee ID">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.employeeId}
          </span>
        </AccountRow>
        <AccountRow icon={<CalendarIcon size={17} />} label="Join Date">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.joinDate}
          </span>
        </AccountRow>
        <AccountRow icon={<InboxIcon size={17} />} label="Email">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.email}
          </span>
        </AccountRow>
        <AccountRow icon={<UsersIcon size={17} />} label="Assigned Team">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.assignedTeam}
          </span>
        </AccountRow>
        <AccountRow icon={<MoneyIcon size={17} />} label="Pay / Commission Structure">
          <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.pay}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ background: VIOLET_BG, color: VIOLET }}
          >
            Admin only
          </span>
        </AccountRow>
      </div>
    </div>
  );
}

/* ── Danger Zone ──────────────────────────────────────────────────────────── */
function DangerZone() {
  return (
    <section
      className="flex flex-col gap-4 rounded-[18px] border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      style={{ borderColor: RED_BORDER, background: RED_BG }}
    >
      <div>
        <h3 className="text-[16px] font-bold" style={{ color: RED }}>
          Danger Zone
        </h3>
        <p className="mt-1 text-[13px] text-[color:var(--color-text-secondary)]">
          These actions are permanent and cannot be undone.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] border bg-[color:var(--color-surface)] px-4 text-[13px] font-semibold transition-colors hover:bg-[#FEECEC]"
          style={{ borderColor: RED_BORDER, color: RED }}
        >
          <UserRemoveIcon size={17} />
          Deactivate Member
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: RED_SOLID }}
        >
          <TrashIcon size={17} />
          Remove from Team
        </button>
      </div>
    </section>
  );
}

/* ── Settings & Permissions tab body ──────────────────────────────────────── */
export function SettingsTab({ member }: { member: MemberDetail }) {
  const settings = getMemberSettings(member);
  const [role, setRole] = useState<TeamRole>(settings.role);
  const [active, setActive] = useState(settings.active);
  const [groups, setGroups] = useState(settings.permissions);

  const toggle = (key: PermissionKey) =>
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((it) => (it.key === key ? { ...it, on: !it.on } : it)),
      })),
    );

  return (
    <div className="space-y-5">
      <div className="grid items-start gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <RoleAccessCard
          role={role}
          setRole={setRole}
          reportsTo={settings.reportsTo}
          active={active}
          setActive={setActive}
        />
        <PermissionsCard inheritsFrom={settings.inheritsFrom} groups={groups} onToggle={toggle} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <SecurityCard security={settings.security} />
        <AccountDetailsCard account={settings.account} />
      </div>

      <DangerZone />
    </div>
  );
}
