// Mock data for the Team screen — recruiters, roles, workload and performance.
// Figures mirror the approved design mock; swap these for live API data when
// the backend is wired.

export type TeamRole = "Team Lead" | "Recruiter" | "Bench Sales" | "Admin";
export type MemberStatus = "Active" | "Invited";

export type TeamMember = {
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  consultants: number | null;
  openJobs: number | null;
  placements: number | null;
  margin: string | null;
  image: string;
};

// Stable URL slug for a member — used for /team/[memberId] detail routing.
export function memberSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const teamKpis = {
  teamMembers: { value: "8", delta: "14%", note: "vs last month" },
  activeThisWeek: { value: "6", delta: "20%", note: "vs last week" },
  totalPlacements: { value: "25", delta: "18%", note: "vs last month" },
  pendingInvites: { value: "2", delta: "2", note: "vs last week" },
};

export const teamMembers: TeamMember[] = [
  {
    name: "Sarah Khan",
    email: "sarah@agency.com",
    role: "Team Lead",
    status: "Active",
    consultants: 14,
    openJobs: 6,
    placements: 8,
    margin: "$18,600",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Alex Morgan",
    email: "alex@agency.com",
    role: "Recruiter",
    status: "Active",
    consultants: 11,
    openJobs: 5,
    placements: 6,
    margin: "$13,200",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jason Brown",
    email: "jason@agency.com",
    role: "Recruiter",
    status: "Active",
    consultants: 9,
    openJobs: 4,
    placements: 4,
    margin: "$8,900",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Priya Nair",
    email: "priya@agency.com",
    role: "Bench Sales",
    status: "Active",
    consultants: 18,
    openJobs: null,
    placements: 5,
    margin: "$11,400",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Lisa Patel",
    email: "lisa@agency.com",
    role: "Recruiter",
    status: "Active",
    consultants: 7,
    openJobs: 3,
    placements: 2,
    margin: "$3,500",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Mike Chen",
    email: "mike@agency.com",
    role: "Recruiter",
    status: "Invited",
    consultants: null,
    openJobs: null,
    placements: null,
    margin: null,
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

export const teamMembersMeta = { from: 1, to: 6, total: 8, pages: 2 };

// Top performer — surfaced in the Team Insights rail.
export const topPerformer = {
  name: "Sarah Khan",
  role: "Team Lead",
  margin: "$18,600",
  marginNote: "Margin (mo)",
  placements: "8",
  conversion: "36%",
  image: "https://randomuser.me/api/portraits/women/44.jpg",
};

// Team Composition donut — one slice per role bucket.
export type CompositionSlice = { label: string; count: number; color: string };
export const teamComposition: CompositionSlice[] = [
  { label: "Recruiters", count: 5, color: "var(--color-brand-500)" },
  { label: "Bench Sales", count: 1, color: "#22C55E" },
  { label: "Leads", count: 1, color: "#F59E0B" },
  { label: "Admin", count: 1, color: "#7C3AED" },
];

// Pending invites — awaiting acceptance.
export type PendingInvite = {
  name: string;
  email: string;
  role: TeamRole;
  chip: "gray" | "green";
  image: string;
};
export const pendingInvites: PendingInvite[] = [
  {
    name: "David Lee",
    email: "david@agency.com",
    role: "Recruiter",
    chip: "gray",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Jessica Wilson",
    email: "jessica@agency.com",
    role: "Bench Sales",
    chip: "green",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

// Performance leaderboard — ranked by margin generated this month.
export const leaderboard = [
  { rank: 1, name: "Sarah Khan", value: "$18,600", amount: 18600 },
  { rank: 2, name: "Alex Morgan", value: "$13,200", amount: 13200 },
  { rank: 3, name: "Jason Brown", value: "$8,900", amount: 8900 },
];

// Targets & quotas — placements against monthly goal. Bar colour is stored so
// the on-track / at-risk / behind banding matches the design exactly.
export type Target = {
  name: string;
  done: number;
  goal: number;
  percent: number;
  color: string;
};
const TARGET_GREEN = "#22C55E";
const TARGET_AMBER = "#F59E0B";
const TARGET_RED = "#EF4444";
export const targets: Target[] = [
  { name: "Sarah Khan", done: 8, goal: 10, percent: 80, color: TARGET_GREEN },
  { name: "Alex Morgan", done: 6, goal: 8, percent: 75, color: TARGET_GREEN },
  { name: "Jason Brown", done: 4, goal: 8, percent: 50, color: TARGET_AMBER },
  { name: "Priya Nair", done: 3, goal: 10, percent: 30, color: TARGET_AMBER },
  { name: "Lisa Patel", done: 2, goal: 8, percent: 25, color: TARGET_RED },
];

// Workload distribution — consultants + open jobs per member (stacked).
export type Workload = { name: string; consultants: number; openJobs: number };
export const workload: Workload[] = [
  { name: "Priya Nair", consultants: 18, openJobs: 6 },
  { name: "Sarah Khan", consultants: 14, openJobs: 6 },
  { name: "Alex Morgan", consultants: 11, openJobs: 5 },
  { name: "Jason Brown", consultants: 9, openJobs: 4 },
  { name: "Lisa Patel", consultants: 7, openJobs: 3 },
  { name: "Mike Chen", consultants: 0, openJobs: 0 },
];
export const workloadMax = 30;
export const workloadTicks = [0, 5, 10, 15, 20, 25, 30];
export const workloadRecommendedLimit = 15;
export const workloadAlert = {
  name: "Priya Nair",
  detail: "18 consultants exceeds the recommended limit of 15.",
};

// Roles & permissions matrix.
export type Perm = "yes" | "locked" | "na";
export type RolePermissions = { role: TeamRole | "Team Lead"; perms: Perm[] };
export const permissionColumns = [
  "View Financials",
  "Manage Team",
  "View All Candidates",
  "Edit Clients",
  "Export Data",
];
export const rolePermissions: RolePermissions[] = [
  { role: "Admin", perms: ["yes", "yes", "yes", "yes", "yes"] },
  { role: "Team Lead", perms: ["yes", "yes", "yes", "locked", "yes"] },
  { role: "Recruiter", perms: ["na", "yes", "yes", "locked", "locked"] },
  { role: "Bench Sales", perms: ["na", "yes", "na", "locked", "locked"] },
];

/* ──────────────────────────────────────────────────────────────────────────
   Member detail — the per-recruiter workspace opened from the Team table.
   Figures mirror the approved design mock (Sarah Khan); other members carry
   plausible, internally-consistent numbers derived from the table data.
   ────────────────────────────────────────────────────────────────────────── */

export type DetailStat = { value: string; delta: string; note: string };
export type FunnelStep = { label: string; value: number; conv: string | null };
export type ActivityKind = "placed" | "interview" | "submitted" | "added" | "moved";
export type MemberActivity = { kind: ActivityKind; text: string; time: string };

// Overview tab — profile, current status and a quick snapshot. Mirrors the
// approved Sarah Khan mock; other members carry consistent derived figures.
export type MemberOverview = {
  headline: string; // banner title, e.g. "Top performer this month"
  marginDelta: string; // delta on the Margin Generated KPI
  profile: {
    department: string;
    location: string;
    reportsTo: string;
    employeeId: string;
    specialization: string;
    languages: string;
  };
  status: {
    utilization: number; // avg consultant utilization, %
    bench: number; // consultants on bench
    lastLogin: string;
    target: { done: number; goal: number; percent: number };
  };
  snapshot: {
    activePipeline: number;
    openJobs: number;
    thisWeekInterviews: number;
    pendingFollowups: number;
  };
};

export type MemberDetail = {
  slug: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: MemberStatus;
  image: string;
  joined: string;
  lastActive: string;
  // Header KPI strip
  header: { consultants: number; openJobs: number; placements: number; margin: string };
  // Placements & Margin over time line chart
  chart: {
    months: string[];
    placements: number[]; // left axis, 0..placementsMax
    margin: number[]; // right axis, dollars, 0..marginMax
    placementsMax: number;
    marginMax: number;
  };
  // Ranking & Stats panel
  ranking: {
    rank: number;
    of: number;
    avgTimeToFill: string;
    activePipeline: string;
    marginQuarter: string;
  };
  // Four headline metric cards
  metrics: {
    submittals: DetailStat;
    interviews: DetailStat;
    placements: DetailStat;
    conversion: DetailStat & { percent: number };
  };
  // Conversion funnel
  funnel: FunnelStep[];
  // Recent activity feed
  activity: MemberActivity[];
  // Overview tab
  overview: MemberOverview;
};

const memberDetailList: MemberDetail[] = [
  {
    slug: memberSlug("Sarah Khan"),
    name: "Sarah Khan",
    email: "sarah@agency.com",
    phone: "(415) 555-0134",
    role: "Team Lead",
    status: "Active",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    joined: "Joined Jan 2025",
    lastActive: "Last active 2h ago",
    header: { consultants: 14, openJobs: 6, placements: 8, margin: "$18,600" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [1.5, 4, 5.5, 7.5, 10],
      margin: [2000, 4400, 6200, 9800, 14400],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 2,
      of: 8,
      avgTimeToFill: "12 days",
      activePipeline: "9 candidates",
      marginQuarter: "$52,400",
    },
    metrics: {
      submittals: { value: "48", delta: "26%", note: "vs team avg 32" },
      interviews: { value: "22", delta: "15%", note: "vs team avg 18" },
      placements: { value: "8", delta: "33%", note: "vs team avg 6" },
      conversion: { value: "36%", delta: "36%", note: "vs team avg 29%", percent: 36 },
    },
    funnel: [
      { label: "Submittals", value: 48, conv: null },
      { label: "Interviews", value: 22, conv: "46%" },
      { label: "Offers", value: 11, conv: "50%" },
      { label: "Placements", value: 8, conv: "73%" },
    ],
    activity: [
      { kind: "placed", text: "Placed Vikram Reddy at TechCorp", time: "2h ago" },
      { kind: "interview", text: "Scheduled interview with Priya Sharma", time: "Yesterday" },
      { kind: "submitted", text: "Submitted Arjun Mehta to Walmart", time: "2 days ago" },
      { kind: "added", text: "Added Neha Verma to pipeline for JPMorgan role", time: "3 days ago" },
      { kind: "moved", text: "Moved Rohit Patel to Offer stage for Google role", time: "4 days ago" },
    ],
    overview: {
      headline: "Top performer this month",
      marginDelta: "36%",
      profile: {
        department: "Recruiting",
        location: "Hyderabad, IN",
        reportsTo: "Nithish",
        employeeId: "EMP-1024",
        specialization: "Java / Cloud roles",
        languages: "English, Hindi",
      },
      status: {
        utilization: 86,
        bench: 1,
        lastLogin: "Today at 10:24 AM",
        target: { done: 8, goal: 10, percent: 80 },
      },
      snapshot: { activePipeline: 9, openJobs: 6, thisWeekInterviews: 3, pendingFollowups: 2 },
    },
  },
  {
    slug: memberSlug("Alex Morgan"),
    name: "Alex Morgan",
    email: "alex@agency.com",
    phone: "(415) 555-0188",
    role: "Recruiter",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    joined: "Joined Mar 2025",
    lastActive: "Last active 35m ago",
    header: { consultants: 11, openJobs: 5, placements: 6, margin: "$13,200" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [1, 2.5, 4, 5, 7],
      margin: [1500, 3200, 5000, 7600, 10600],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 3,
      of: 8,
      avgTimeToFill: "15 days",
      activePipeline: "7 candidates",
      marginQuarter: "$38,900",
    },
    metrics: {
      submittals: { value: "37", delta: "9%", note: "vs team avg 32" },
      interviews: { value: "19", delta: "6%", note: "vs team avg 18" },
      placements: { value: "6", delta: "0%", note: "vs team avg 6" },
      conversion: { value: "32%", delta: "10%", note: "vs team avg 29%", percent: 32 },
    },
    funnel: [
      { label: "Submittals", value: 37, conv: null },
      { label: "Interviews", value: 19, conv: "51%" },
      { label: "Offers", value: 8, conv: "42%" },
      { label: "Placements", value: 6, conv: "75%" },
    ],
    activity: [
      { kind: "submitted", text: "Submitted Karthik Rao to Stripe", time: "1h ago" },
      { kind: "interview", text: "Scheduled interview with Meera Iyer", time: "Yesterday" },
      { kind: "placed", text: "Placed Ananya Singh at Adobe", time: "2 days ago" },
      { kind: "added", text: "Added Sam Carter to pipeline for Nike role", time: "3 days ago" },
      { kind: "moved", text: "Moved Dev Sharma to Interview stage for Meta role", time: "5 days ago" },
    ],
    overview: {
      headline: "Strong performer this month",
      marginDelta: "22%",
      profile: {
        department: "Recruiting",
        location: "Austin, TX",
        reportsTo: "Sarah Khan",
        employeeId: "EMP-1042",
        specialization: "Frontend / React roles",
        languages: "English, Spanish",
      },
      status: {
        utilization: 79,
        bench: 0,
        lastLogin: "Today at 9:12 AM",
        target: { done: 6, goal: 8, percent: 75 },
      },
      snapshot: { activePipeline: 7, openJobs: 5, thisWeekInterviews: 2, pendingFollowups: 3 },
    },
  },
  {
    slug: memberSlug("Jason Brown"),
    name: "Jason Brown",
    email: "jason@agency.com",
    phone: "(415) 555-0202",
    role: "Recruiter",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    joined: "Joined Apr 2025",
    lastActive: "Last active 1h ago",
    header: { consultants: 9, openJobs: 4, placements: 4, margin: "$8,900" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [0.5, 1.5, 2.5, 3.5, 5],
      margin: [800, 2000, 3400, 5200, 7400],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 5,
      of: 8,
      avgTimeToFill: "18 days",
      activePipeline: "5 candidates",
      marginQuarter: "$26,300",
    },
    metrics: {
      submittals: { value: "28", delta: "12%", note: "vs team avg 32" },
      interviews: { value: "14", delta: "22%", note: "vs team avg 18" },
      placements: { value: "4", delta: "33%", note: "vs team avg 6" },
      conversion: { value: "29%", delta: "0%", note: "vs team avg 29%", percent: 29 },
    },
    funnel: [
      { label: "Submittals", value: 28, conv: null },
      { label: "Interviews", value: 14, conv: "50%" },
      { label: "Offers", value: 6, conv: "43%" },
      { label: "Placements", value: 4, conv: "67%" },
    ],
    activity: [
      { kind: "added", text: "Added Lena Park to pipeline for Oracle role", time: "3h ago" },
      { kind: "submitted", text: "Submitted Ravi Kumar to Salesforce", time: "Yesterday" },
      { kind: "interview", text: "Scheduled interview with Tom Hughes", time: "2 days ago" },
      { kind: "placed", text: "Placed Maya Joshi at IBM", time: "4 days ago" },
      { kind: "moved", text: "Moved Omar Ali to Offer stage for Cisco role", time: "6 days ago" },
    ],
    overview: {
      headline: "Steady performer this month",
      marginDelta: "14%",
      profile: {
        department: "Recruiting",
        location: "Dallas, TX",
        reportsTo: "Sarah Khan",
        employeeId: "EMP-1058",
        specialization: "Data / Analytics roles",
        languages: "English",
      },
      status: {
        utilization: 71,
        bench: 1,
        lastLogin: "Today at 8:40 AM",
        target: { done: 4, goal: 8, percent: 50 },
      },
      snapshot: { activePipeline: 5, openJobs: 4, thisWeekInterviews: 2, pendingFollowups: 4 },
    },
  },
  {
    slug: memberSlug("Priya Nair"),
    name: "Priya Nair",
    email: "priya@agency.com",
    phone: "(415) 555-0271",
    role: "Bench Sales",
    status: "Active",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    joined: "Joined Feb 2025",
    lastActive: "Last active 12m ago",
    header: { consultants: 18, openJobs: 0, placements: 5, margin: "$11,400" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [1, 2, 3, 4, 6],
      margin: [1200, 2800, 4200, 6800, 9200],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 4,
      of: 8,
      avgTimeToFill: "14 days",
      activePipeline: "11 candidates",
      marginQuarter: "$33,100",
    },
    metrics: {
      submittals: { value: "41", delta: "28%", note: "vs team avg 32" },
      interviews: { value: "17", delta: "6%", note: "vs team avg 18" },
      placements: { value: "5", delta: "17%", note: "vs team avg 6" },
      conversion: { value: "30%", delta: "3%", note: "vs team avg 29%", percent: 30 },
    },
    funnel: [
      { label: "Submittals", value: 41, conv: null },
      { label: "Interviews", value: 17, conv: "41%" },
      { label: "Offers", value: 7, conv: "41%" },
      { label: "Placements", value: 5, conv: "71%" },
    ],
    activity: [
      { kind: "submitted", text: "Submitted bench consultant to Deloitte", time: "45m ago" },
      { kind: "added", text: "Added 3 consultants to the .NET bench pool", time: "Yesterday" },
      { kind: "interview", text: "Scheduled interview with Hari Menon", time: "2 days ago" },
      { kind: "placed", text: "Placed Sana Khan at Accenture", time: "3 days ago" },
      { kind: "moved", text: "Moved Vivek Rao to Offer stage for Infosys role", time: "5 days ago" },
    ],
    overview: {
      headline: "Strong performer this month",
      marginDelta: "19%",
      profile: {
        department: "Bench Sales",
        location: "Hyderabad, IN",
        reportsTo: "Sarah Khan",
        employeeId: "EMP-1071",
        specialization: ".NET / Cloud roles",
        languages: "English, Hindi, Malayalam",
      },
      status: {
        utilization: 88,
        bench: 3,
        lastLogin: "Today at 10:48 AM",
        target: { done: 3, goal: 10, percent: 30 },
      },
      snapshot: { activePipeline: 11, openJobs: 0, thisWeekInterviews: 4, pendingFollowups: 2 },
    },
  },
  {
    slug: memberSlug("Lisa Patel"),
    name: "Lisa Patel",
    email: "lisa@agency.com",
    phone: "(415) 555-0319",
    role: "Recruiter",
    status: "Active",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    joined: "Joined May 2025",
    lastActive: "Last active 4h ago",
    header: { consultants: 7, openJobs: 3, placements: 2, margin: "$3,500" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [0, 0.5, 1, 1.5, 2.5],
      margin: [0, 600, 1200, 2200, 3500],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 7,
      of: 8,
      avgTimeToFill: "21 days",
      activePipeline: "4 candidates",
      marginQuarter: "$11,200",
    },
    metrics: {
      submittals: { value: "19", delta: "41%", note: "vs team avg 32" },
      interviews: { value: "9", delta: "50%", note: "vs team avg 18" },
      placements: { value: "2", delta: "67%", note: "vs team avg 6" },
      conversion: { value: "24%", delta: "17%", note: "vs team avg 29%", percent: 24 },
    },
    funnel: [
      { label: "Submittals", value: 19, conv: null },
      { label: "Interviews", value: 9, conv: "47%" },
      { label: "Offers", value: 3, conv: "33%" },
      { label: "Placements", value: 2, conv: "67%" },
    ],
    activity: [
      { kind: "added", text: "Added Grace Lin to pipeline for Airbnb role", time: "5h ago" },
      { kind: "submitted", text: "Submitted Noah Reed to Uber", time: "Yesterday" },
      { kind: "interview", text: "Scheduled interview with Aria Bose", time: "3 days ago" },
      { kind: "placed", text: "Placed Ian Cole at Dropbox", time: "6 days ago" },
      { kind: "moved", text: "Moved Zoe Tan to Interview stage for Lyft role", time: "1 week ago" },
    ],
    overview: {
      headline: "Building momentum this month",
      marginDelta: "28%",
      profile: {
        department: "Recruiting",
        location: "Phoenix, AZ",
        reportsTo: "Sarah Khan",
        employeeId: "EMP-1090",
        specialization: "QA / Automation roles",
        languages: "English, Gujarati",
      },
      status: {
        utilization: 64,
        bench: 0,
        lastLogin: "Today at 7:15 AM",
        target: { done: 2, goal: 8, percent: 25 },
      },
      snapshot: { activePipeline: 4, openJobs: 3, thisWeekInterviews: 1, pendingFollowups: 5 },
    },
  },
  {
    slug: memberSlug("Mike Chen"),
    name: "Mike Chen",
    email: "mike@agency.com",
    phone: "—",
    role: "Recruiter",
    status: "Invited",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    joined: "Invited May 2025",
    lastActive: "Invite pending",
    header: { consultants: 0, openJobs: 0, placements: 0, margin: "$0" },
    chart: {
      months: ["Jan", "Feb", "Mar", "Apr", "May"],
      placements: [0, 0, 0, 0, 0],
      margin: [0, 0, 0, 0, 0],
      placementsMax: 12,
      marginMax: 20000,
    },
    ranking: {
      rank: 8,
      of: 8,
      avgTimeToFill: "—",
      activePipeline: "0 candidates",
      marginQuarter: "$0",
    },
    metrics: {
      submittals: { value: "0", delta: "0%", note: "vs team avg 32" },
      interviews: { value: "0", delta: "0%", note: "vs team avg 18" },
      placements: { value: "0", delta: "0%", note: "vs team avg 6" },
      conversion: { value: "0%", delta: "0%", note: "vs team avg 29%", percent: 0 },
    },
    funnel: [
      { label: "Submittals", value: 0, conv: null },
      { label: "Interviews", value: 0, conv: "0%" },
      { label: "Offers", value: 0, conv: "0%" },
      { label: "Placements", value: 0, conv: "0%" },
    ],
    activity: [
      { kind: "added", text: "Invitation sent to mike@agency.com", time: "2 days ago" },
    ],
    overview: {
      headline: "Invitation pending",
      marginDelta: "0%",
      profile: {
        department: "Recruiting",
        location: "—",
        reportsTo: "Sarah Khan",
        employeeId: "EMP-1103",
        specialization: "—",
        languages: "English, Mandarin",
      },
      status: {
        utilization: 0,
        bench: 0,
        lastLogin: "Invite pending",
        target: { done: 0, goal: 8, percent: 0 },
      },
      snapshot: { activePipeline: 0, openJobs: 0, thisWeekInterviews: 0, pendingFollowups: 0 },
    },
  },
];

export const memberDetails: Record<string, MemberDetail> = Object.fromEntries(
  memberDetailList.map((m) => [m.slug, m]),
);

export function getMemberDetail(slug: string): MemberDetail | undefined {
  return memberDetails[slug];
}

export const memberDetailTabs = [
  "Overview",
  "Performance",
  "Workload",
  "Targets & Activity",
  "Settings & Permissions",
] as const;
