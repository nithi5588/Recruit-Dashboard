// Single source of truth for role-based access and views.
//
// Three roles map to three distinct workspaces:
//   • owner       — full operations view, every feature
//   • recruiter   — focused on their own candidates/pipeline work
//   • bench_sales — bench pool + hotlist marketing focus

export type Role = "owner" | "recruiter" | "bench_sales";

export type RoleDef = {
  id: Role;
  label: string;
  description: string;
  /** Nav hrefs this role is allowed to open. */
  nav: string[];
  /** Accent used by the role chip / switcher tile. */
  accent: "brand" | "green";
  /** Short framing line shown on the dashboard for this role. */
  dashboardHeadline: string;
  dashboardSubtitle: string;
};

const ALL_NAV = [
  "/dashboard",
  "/candidates",
  "/jobs",
  "/matches",
  "/pipeline",
  "/enrichment",
  "/clients",
  "/calendar",
  "/tasks",
  "/reports",
  "/assistant",
  "/settings",
];

// Owner / admin gets everything, plus the admin-only management areas.
const OWNER_NAV = [...ALL_NAV, "/bench", "/financials", "/team"];

export const ROLES: Record<Role, RoleDef> = {
  owner: {
    id: "owner",
    label: "Owner",
    description: "Full access to all features",
    nav: OWNER_NAV,
    accent: "brand",
    dashboardHeadline: "Full operations view",
    dashboardSubtitle:
      "Everything across the team — candidates, jobs, matches, reports and settings.",
  },
  recruiter: {
    id: "recruiter",
    label: "Recruiter",
    description: "Own work only",
    // Keeps every tab — same full nav as Owner.
    nav: ALL_NAV,
    accent: "brand",
    dashboardHeadline: "Your work today",
    dashboardSubtitle:
      "Your candidates, matches and follow-ups — everything you own in one place.",
  },
  bench_sales: {
    id: "bench_sales",
    label: "Bench Sales",
    description: "Bench & hotlist",
    // Marketing-focused: bench pool, matching to open roles, submissions.
    nav: [
      "/dashboard",
      "/candidates",
      "/bench",
      "/matches",
      "/jobs",
      "/pipeline",
      "/calendar",
      "/tasks",
      "/settings",
    ],
    accent: "green",
    dashboardHeadline: "Bench & hotlist",
    dashboardSubtitle:
      "Market your bench — surface available talent and push them to open roles.",
  },
};

export const ROLE_ORDER: Role[] = ["owner", "recruiter", "bench_sales"];

export const DEFAULT_ROLE: Role = "owner";

// Utility routes reachable by every role regardless of their nav (these
// aren't sidebar destinations but can be linked to from anywhere).
const ALWAYS_ALLOWED = ["/pricing"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLES;
}

/** Whether `href` is reachable for `role` (exact match or nested route). */
export function canAccess(role: Role, href: string): boolean {
  const allowedRoutes = [...ROLES[role].nav, ...ALWAYS_ALLOWED];
  return allowedRoutes.some(
    (allowed) => href === allowed || href.startsWith(allowed + "/"),
  );
}
