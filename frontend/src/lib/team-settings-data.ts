// Settings & Permissions tab data for the per-member detail workspace. Figures
// mirror the approved Sarah Khan mock exactly; other members carry plausible,
// internally-consistent values derived from their detail record.

import type { MemberDetail, TeamRole } from "@/lib/team-data";

export type PermissionKey =
  // Data Access
  | "view-financials"
  | "view-all-candidates"
  | "view-other-recruiters"
  // Actions
  | "edit-clients"
  | "export-data"
  | "reassign-consultants"
  | "manage-team"
  // Admin
  | "invite-members"
  | "edit-targets";

export type PermissionItem = { key: PermissionKey; label: string; on: boolean };
export type PermissionGroup = { title: string; items: PermissionItem[] };

export type MemberSettings = {
  role: TeamRole;
  active: boolean;
  reportsTo: string;
  inheritsFrom: TeamRole; // role the permissions are inherited from
  permissions: PermissionGroup[];
  security: {
    lastLoginRelative: string;
    lastLoginAbsolute: string;
    twoFactor: boolean;
    passwordChanged: string;
    activeSessions: number;
  };
  account: {
    employeeId: string;
    joinDate: string;
    email: string;
    assignedTeam: string;
    pay: string;
  };
};

// Per-role permission defaults — drives the inherited toggle state. Mirrors the
// Team Lead mock; other roles step down access in a sensible way.
const ROLE_PERMISSIONS: Record<TeamRole, Record<PermissionKey, boolean>> = {
  Admin: {
    "view-financials": true,
    "view-all-candidates": true,
    "view-other-recruiters": true,
    "edit-clients": true,
    "export-data": true,
    "reassign-consultants": true,
    "manage-team": true,
    "invite-members": true,
    "edit-targets": true,
  },
  "Team Lead": {
    "view-financials": false,
    "view-all-candidates": true,
    "view-other-recruiters": false,
    "edit-clients": true,
    "export-data": true,
    "reassign-consultants": true,
    "manage-team": false,
    "invite-members": false,
    "edit-targets": true,
  },
  Recruiter: {
    "view-financials": false,
    "view-all-candidates": true,
    "view-other-recruiters": false,
    "edit-clients": false,
    "export-data": true,
    "reassign-consultants": false,
    "manage-team": false,
    "invite-members": false,
    "edit-targets": false,
  },
  "Bench Sales": {
    "view-financials": false,
    "view-all-candidates": false,
    "view-other-recruiters": false,
    "edit-clients": true,
    "export-data": true,
    "reassign-consultants": true,
    "manage-team": false,
    "invite-members": false,
    "edit-targets": false,
  },
};

function buildGroups(role: TeamRole): PermissionGroup[] {
  const p = ROLE_PERMISSIONS[role];
  return [
    {
      title: "Data Access",
      items: [
        { key: "view-financials", label: "View Financials", on: p["view-financials"] },
        { key: "view-all-candidates", label: "View All Candidates", on: p["view-all-candidates"] },
        {
          key: "view-other-recruiters",
          label: "View Other Recruiters' Data",
          on: p["view-other-recruiters"],
        },
      ],
    },
    {
      title: "Actions",
      items: [
        { key: "edit-clients", label: "Edit Clients", on: p["edit-clients"] },
        { key: "export-data", label: "Export Data", on: p["export-data"] },
        { key: "reassign-consultants", label: "Reassign Consultants", on: p["reassign-consultants"] },
        { key: "manage-team", label: "Manage Team", on: p["manage-team"] },
      ],
    },
    {
      title: "Admin",
      items: [
        { key: "invite-members", label: "Invite Members", on: p["invite-members"] },
        { key: "edit-targets", label: "Edit Targets", on: p["edit-targets"] },
      ],
    },
  ];
}

// Per-member fixed account/security values, keyed by slug. Sarah matches the
// design mock exactly; others carry consistent, plausible figures.
const ACCOUNT: Record<
  string,
  {
    lastLoginAbsolute: string;
    twoFactor: boolean;
    passwordChanged: string;
    activeSessions: number;
    joinDate: string;
    assignedTeam: string;
    pay: string;
  }
> = {
  "sarah-khan": {
    lastLoginAbsolute: "May 6, 2025 at 10:24 AM",
    twoFactor: true,
    passwordChanged: "Last changed 45 days ago",
    activeSessions: 2,
    joinDate: "Jan 15, 2025",
    assignedTeam: "IT Staffing - West",
    pay: "Base: $60,000 • Commission: 12%",
  },
  "alex-morgan": {
    lastLoginAbsolute: "May 6, 2025 at 9:12 AM",
    twoFactor: true,
    passwordChanged: "Last changed 28 days ago",
    activeSessions: 1,
    joinDate: "Mar 3, 2025",
    assignedTeam: "IT Staffing - Central",
    pay: "Base: $52,000 • Commission: 10%",
  },
  "jason-brown": {
    lastLoginAbsolute: "May 6, 2025 at 8:40 AM",
    twoFactor: false,
    passwordChanged: "Last changed 62 days ago",
    activeSessions: 1,
    joinDate: "Apr 8, 2025",
    assignedTeam: "IT Staffing - Central",
    pay: "Base: $50,000 • Commission: 10%",
  },
  "priya-nair": {
    lastLoginAbsolute: "May 6, 2025 at 10:48 AM",
    twoFactor: true,
    passwordChanged: "Last changed 19 days ago",
    activeSessions: 3,
    joinDate: "Feb 11, 2025",
    assignedTeam: "Bench Sales - East",
    pay: "Base: $54,000 • Commission: 11%",
  },
  "lisa-patel": {
    lastLoginAbsolute: "May 6, 2025 at 7:15 AM",
    twoFactor: false,
    passwordChanged: "Last changed 73 days ago",
    activeSessions: 1,
    joinDate: "May 2, 2025",
    assignedTeam: "IT Staffing - West",
    pay: "Base: $48,000 • Commission: 9%",
  },
  "mike-chen": {
    lastLoginAbsolute: "Invite pending",
    twoFactor: false,
    passwordChanged: "Password not set",
    activeSessions: 0,
    joinDate: "Invited May 2025",
    assignedTeam: "IT Staffing - West",
    pay: "Base: $48,000 • Commission: 9%",
  },
};

const SARAH_ACCOUNT = ACCOUNT["sarah-khan"];

export function getMemberSettings(member: MemberDetail): MemberSettings {
  const a = ACCOUNT[member.slug] ?? SARAH_ACCOUNT;
  const lastLogin = member.overview.status.lastLogin;
  const lastLoginRelative = member.status === "Active" ? member.lastActive.replace("Last active ", "") : "—";
  return {
    role: member.role,
    active: member.status === "Active",
    reportsTo: member.overview.profile.reportsTo,
    inheritsFrom: member.role,
    permissions: buildGroups(member.role),
    security: {
      lastLoginRelative,
      lastLoginAbsolute: lastLogin === "Invite pending" ? "Invite pending" : a.lastLoginAbsolute,
      twoFactor: a.twoFactor,
      passwordChanged: a.passwordChanged,
      activeSessions: a.activeSessions,
    },
    account: {
      employeeId: member.overview.profile.employeeId,
      joinDate: a.joinDate,
      email: member.email,
      assignedTeam: a.assignedTeam,
      pay: a.pay,
    },
  };
}

export const teamRoleOptions: TeamRole[] = ["Admin", "Team Lead", "Recruiter", "Bench Sales"];
