// Mock data for the Clients screen — client companies and relationships.
// Figures mirror the approved design mock; swap these for live API data when
// the backend is wired.

export type ClientStatus = "Active" | "Prospect" | "At-Risk";
export type ClientType = "Direct" | "Vendor";

export type Client = {
  id: string;
  company: string;
  /** Domain hint for the logo lookup; falls back to a colored letter tile. */
  domain?: string;
  /** Letter-tile background when the remote logo is unavailable. */
  logoBg: string;
  industry: string;
  status: ClientStatus;
  type: ClientType;
  /** Small "Vendor" tag shown next to vendor/prime company names. */
  tag?: string;
  contactName: string;
  contactTitle: string;
  openRoles: number;
  activePlacements: number;
  /** Revenue this month, in whole dollars. */
  revenue: number;
  accountManager: string;
  /** Profile photo for the account manager; falls back to initials. */
  accountManagerImage: string;
  lastActivity: string;
  /** Flags the row as stale (no new job 90+ days) for amber treatment. */
  atRisk?: boolean;
};

export const clientKpis = {
  activeClients: { value: "18", note: "2 this month" },
  revenueThisMonth: { value: "$172,000", note: "14%" },
  openRoles: { value: "42", note: "across all clients" },
  atRiskClients: { value: "3", note: "no new job 90+ days" },
};

export const clients: Client[] = [
  {
    id: "techcorp",
    company: "TechCorp",
    domain: "techcorp.com",
    logoBg: "#2563EB",
    industry: "SaaS",
    status: "Active",
    type: "Direct",
    contactName: "Mark Lee",
    contactTitle: "VP Eng",
    openRoles: 6,
    activePlacements: 4,
    revenue: 52000,
    accountManager: "Sarah Khan",
    accountManagerImage: "https://randomuser.me/api/portraits/women/44.jpg",
    lastActivity: "2d ago",
  },
  {
    id: "finserve",
    company: "FinServe Inc.",
    domain: "finserve.com",
    logoBg: "#0EA5E9",
    industry: "Fintech",
    status: "Active",
    type: "Direct",
    contactName: "Dana White",
    contactTitle: "HR Lead",
    openRoles: 5,
    activePlacements: 3,
    revenue: 38000,
    accountManager: "Alex Morgan",
    accountManagerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    lastActivity: "1d ago",
  },
  {
    id: "walmart-global-tech",
    company: "Walmart Global Tech",
    domain: "walmart.com",
    logoBg: "#0071CE",
    industry: "Retail",
    status: "Active",
    type: "Direct",
    contactName: "Raj Patel",
    contactTitle: "Director, Talent",
    openRoles: 8,
    activePlacements: 5,
    revenue: 29000,
    accountManager: "Sarah Khan",
    accountManagerImage: "https://randomuser.me/api/portraits/women/44.jpg",
    lastActivity: "4h ago",
  },
  {
    id: "jpmorgan",
    company: "JPMorgan",
    domain: "jpmorganchase.com",
    logoBg: "#1E293B",
    industry: "Banking",
    status: "Active",
    type: "Direct",
    contactName: "Lisa Cho",
    contactTitle: "Vice President",
    openRoles: 4,
    activePlacements: 2,
    revenue: 21000,
    accountManager: "Jason Brown",
    accountManagerImage: "https://randomuser.me/api/portraits/men/52.jpg",
    lastActivity: "3d ago",
  },
  {
    id: "healthtech-solutions",
    company: "HealthTech Solutions",
    domain: "healthtech.com",
    logoBg: "#0D9488",
    industry: "Healthcare",
    status: "Prospect",
    type: "Direct",
    contactName: "Sam Reed",
    contactTitle: "Head of HR",
    openRoles: 2,
    activePlacements: 0,
    revenue: 0,
    accountManager: "Lisa Patel",
    accountManagerImage: "https://randomuser.me/api/portraits/women/68.jpg",
    lastActivity: "1w ago",
  },
  {
    id: "innovatex",
    company: "InnovateX",
    domain: "innovatex.com",
    logoBg: "#F97316",
    industry: "Startup",
    status: "At-Risk",
    type: "Direct",
    contactName: "Tom Hardy",
    contactTitle: "CEO",
    openRoles: 1,
    activePlacements: 1,
    revenue: 8000,
    accountManager: "Alex Morgan",
    accountManagerImage: "https://randomuser.me/api/portraits/men/32.jpg",
    lastActivity: "92d ago",
    atRisk: true,
  },
  {
    id: "dataprime",
    company: "DataPrime LLC",
    domain: "dataprime.com",
    logoBg: "#7C3AED",
    industry: "Vendor/Prime",
    status: "Active",
    type: "Vendor",
    tag: "Vendor",
    contactName: "Neha Rao",
    contactTitle: "Delivery Manager",
    openRoles: 6,
    activePlacements: 4,
    revenue: 24000,
    accountManager: "Sarah Khan",
    accountManagerImage: "https://randomuser.me/api/portraits/women/44.jpg",
    lastActivity: "5h ago",
  },
];

export const clientIndustries = Array.from(
  new Set(clients.map((c) => c.industry)),
).sort();

export const clientAccountManagers = Array.from(
  new Set(clients.map((c) => c.accountManager)),
).sort();

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

// ─── Client detail ────────────────────────────────────────────────────────────

/** Contact role categories drive the colored chip on each contact card. */
export type ContactRole =
  | "Decision Maker"
  | "Hiring Manager"
  | "Finance (invoices)"
  | "HR"
  | "Technical"
  | "Other";

export type ClientContact = {
  name: string;
  title: string;
  email: string;
  phone?: string;
  /** Categorical role chip; defaults to "Other" when omitted. */
  role?: ContactRole;
  /** Human-friendly relative time since last touch, e.g. "2 days ago". */
  lastContacted?: string;
  primary?: boolean;
  image: string;
};

export type ClientCommPrefs = {
  channel: string;
  timezone: string;
};

export type ClientActivityKind =
  | "role"
  | "submission"
  | "call"
  | "placement"
  | "invoice"
  | "document";

export type ClientActivity = {
  kind: ClientActivityKind;
  title: string;
  /** Optional secondary description (shown in the Overview preview). */
  meta?: string;
  when: string;
  /** Person who logged the activity; shown with an avatar in the timeline. */
  author?: string;
  /** Avatar photo for the author; omit (e.g. "System") for no avatar. */
  authorImage?: string;
};

/** A billed invoice, surfaced in the Activity tab's Invoices & Payments card. */
export type ClientInvoice = {
  number: string;
  amount: number;
  /** Short issue date, e.g. "Jun 10". */
  date: string;
  status: "Paid" | "Pending" | "Overdue";
};

/** A free-form relationship note shown in the Activity tab's Notes card. */
export type ClientNote = {
  body: string;
  author: string;
  authorImage?: string;
  /** Long date, e.g. "Jun 10, 2025". */
  date: string;
};

export type RateCardRow = {
  role: string;
  level: string;
  rate: string;
  notes: string;
};

export type ClientAgreement = {
  // Fee Structure
  placementFee: string;
  contractMarkup: string;
  guaranteePeriod: string;
  paymentTerms: string;
  // Contract / MSA
  msaStatus: "Signed" | "Pending" | "Expired";
  msaState: "Active" | "Expiring" | "Lapsed";
  signedDate: string;
  expiryDate: string;
  contractFile: string;
  // Rate card
  rateCard: RateCardRow[];
  // Engagement
  directClient: boolean;
  engagementNote: string;
  // Billing contact
  billingContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
};

export type VisaType = "H1B" | "GC" | "OPT" | "USC" | "L2-EAD";
export type PlacementStatus = "Active" | "Ended";

export type Placement = {
  name: string;
  image: string;
  role: string;
  visa: VisaType;
  /** Bill rate to the client, per hour (whole dollars). */
  billRate: number;
  /** Pay rate to the consultant, per hour (whole dollars). */
  payRate: number;
  startDate: string;
  /** End date; omit for active placements (shown as "—"). */
  endDate?: string;
  status: PlacementStatus;
  recruiter: string;
  recruiterImage: string;
};

/** A role/requisition opened by the client. Drives the Jobs tab table. */
export type ClientJobStatus = "Open" | "Filled" | "Closed";
export type VisaRequirement =
  | "H1B OK"
  | "Any"
  | "GC/Citizen"
  | "Citizen only"
  | "None";
/** Accent icon key for the role tile; mapped to an inline SVG in the UI. */
export type ClientJobIcon =
  | "code"
  | "cloud"
  | "database"
  | "shield"
  | "cloudUpload"
  | "monitor";

export type ClientJob = {
  id: string;
  title: string;
  icon: ClientJobIcon;
  status: ClientJobStatus;
  /** Display string, e.g. "$105/hr". */
  billRate: string;
  visa: VisaRequirement;
  /** Candidates submitted against this role. */
  submitted: number;
  recruiter: string;
  recruiterImage: string;
  /** Compact "opened" label, e.g. "2d". */
  dateOpenedShort: string;
  /** Whole days the role has been open; amber when 25+. */
  daysOpen: number;
  /** Pipeline progress, filled dots out of 4 (1–4). */
  stage: number;
};

export type ClientDetail = {
  companySize: string;
  website: string;
  hqLocation: string;
  hqLocationShort: string;
  founded: string;
  about: string;
  clientSince: string;
  totalPlacements: number;
  totalRevenue: number;
  avgTimeToFill: string;
  healthStatus: "Healthy" | "At Risk" | "Watch";
  lastContact: string;
  marginRate: string;
  revenueThisQuarter: number;
  revenueQuarterDelta: string;
  avgBillRate: string;
  rolesJobCount: number;
  placementsRoleCount: number;
  contacts: ClientContact[];
  commPrefs: ClientCommPrefs;
  activity: ClientActivity[];
  invoices: ClientInvoice[];
  /** Sum of unpaid (Pending/Overdue) invoices, in whole dollars. */
  totalOutstanding: number;
  notes: ClientNote[];
  agreement: ClientAgreement;
  jobs: ClientJob[];
  placements: Placement[];
};

// Per-client overrides; TechCorp mirrors the approved design mock exactly.
const CLIENT_DETAILS: Record<string, ClientDetail> = {
  techcorp: {
    companySize: "5,000+ employees",
    website: "techcorp.com",
    hqLocation: "San Francisco, CA, USA",
    hqLocationShort: "San Francisco, CA",
    founded: "2010",
    about:
      "TechCorp builds cloud software that helps teams collaborate and ship faster. Trusted by thousands of companies worldwide.",
    clientSince: "Jan 2024",
    totalPlacements: 12,
    totalRevenue: 312000,
    avgTimeToFill: "14 days",
    healthStatus: "Healthy",
    lastContact: "2 days ago",
    marginRate: "27%",
    revenueThisQuarter: 94000,
    revenueQuarterDelta: "+18% vs last quarter",
    avgBillRate: "$102/hr",
    rolesJobCount: 5,
    placementsRoleCount: 3,
    contacts: [
      {
        name: "Mark Lee",
        title: "VP Engineering",
        email: "mark@techcorp.com",
        phone: "(415) 555-0100",
        role: "Decision Maker",
        lastContacted: "2 days ago",
        primary: true,
        image: "https://randomuser.me/api/portraits/men/45.jpg",
      },
      {
        name: "Dana Kim",
        title: "Recruiting Manager",
        email: "dana@techcorp.com",
        phone: "(415) 555-0101",
        role: "Hiring Manager",
        lastContacted: "1 week ago",
        image: "https://randomuser.me/api/portraits/women/63.jpg",
      },
      {
        name: "Paul Roy",
        title: "Finance Director",
        email: "paul@techcorp.com",
        phone: "(415) 555-0102",
        role: "Finance (invoices)",
        lastContacted: "3 weeks ago",
        image: "https://randomuser.me/api/portraits/men/76.jpg",
      },
      {
        name: "Anita Shah",
        title: "HR Coordinator",
        email: "anita@techcorp.com",
        phone: "(415) 555-0103",
        role: "HR",
        lastContacted: "1 month ago",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ],
    commPrefs: {
      channel: "Email",
      timezone: "PST (Pacific Standard Time)",
    },
    activity: [
      {
        kind: "role",
        title: "New role added: Senior Java Developer",
        when: "2d ago",
        author: "Sarah Khan",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        kind: "submission",
        title: "Submitted Vikram Reddy for Java role",
        when: "3d ago",
        author: "Sarah Khan",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        kind: "call",
        title: "Call with Mark Lee – discussed Q3 needs",
        when: "5d ago",
        author: "Sarah Khan",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        kind: "placement",
        title: "Placed Lena Park as Data Engineer",
        when: "1w ago",
        author: "Alex Morgan",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        kind: "invoice",
        title: "Invoice #1042 sent ($24,000)",
        when: "1w ago",
        author: "System",
      },
      {
        kind: "document",
        title: "MSA renewed",
        when: "2w ago",
        author: "Sarah Khan",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    invoices: [
      { number: "1042", amount: 24000, date: "Jun 10", status: "Pending" },
      { number: "1038", amount: 18000, date: "May 20", status: "Paid" },
      { number: "1031", amount: 21000, date: "Apr 28", status: "Paid" },
    ],
    totalOutstanding: 24000,
    notes: [
      {
        body: "Strong account, expanding team in Q3 — Sarah",
        author: "Sarah Khan",
        authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "Jun 10, 2025",
      },
      {
        body: "Planning to open 3–4 more roles in Q3 (Data, DevOps, QA).",
        author: "Alex Morgan",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "May 20, 2025",
      },
    ],
    agreement: {
      placementFee: "20% of first-year salary",
      contractMarkup: "35%",
      guaranteePeriod: "90 days",
      paymentTerms: "Net 30",
      msaStatus: "Signed",
      msaState: "Active",
      signedDate: "Jan 12, 2024",
      expiryDate: "Jan 12, 2026",
      contractFile: "TechCorp_MSA.pdf",
      rateCard: [
        { role: "Java Developer", level: "Senior", rate: "$100 – 110 /hr", notes: "Standard business hours" },
        { role: "DevOps Engineer", level: "Mid", rate: "$90 /hr", notes: "Includes CI/CD experience" },
        { role: "Data Engineer", level: "Senior", rate: "$115 /hr", notes: "Cloud / Big Data" },
        { role: "QA", level: "Mid", rate: "$75 /hr", notes: "Manual & Automation" },
      ],
      directClient: true,
      engagementNote: "We bill TechCorp directly. No vendor markup applied.",
      billingContact: {
        name: "Paul Roy",
        title: "Finance",
        email: "paul@techcorp.com",
        phone: "+1 (512) 555-0198",
      },
    },
    jobs: [
      {
        id: "techcorp-sr-java-developer",
        title: "Senior Java Developer",
        icon: "code",
        status: "Open",
        billRate: "$105/hr",
        visa: "H1B OK",
        submitted: 4,
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
        dateOpenedShort: "2d",
        daysOpen: 2,
        stage: 2,
      },
      {
        id: "techcorp-devops-engineer",
        title: "DevOps Engineer",
        icon: "cloud",
        status: "Open",
        billRate: "$95/hr",
        visa: "Any",
        submitted: 3,
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
        dateOpenedShort: "8d",
        daysOpen: 8,
        stage: 2,
      },
      {
        id: "techcorp-data-engineer",
        title: "Data Engineer",
        icon: "database",
        status: "Filled",
        billRate: "$115/hr",
        visa: "GC/Citizen",
        submitted: 5,
        recruiter: "Alex Morgan",
        recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
        dateOpenedShort: "20d",
        daysOpen: 20,
        stage: 4,
      },
      {
        id: "techcorp-qa-automation",
        title: "QA Automation",
        icon: "shield",
        status: "Open",
        billRate: "$75/hr",
        visa: "Any",
        submitted: 2,
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
        dateOpenedShort: "25d",
        daysOpen: 25,
        stage: 1,
      },
      {
        id: "techcorp-cloud-architect",
        title: "Cloud Architect",
        icon: "cloudUpload",
        status: "Open",
        billRate: "$130/hr",
        visa: "Citizen only",
        submitted: 1,
        recruiter: "Jason Brown",
        recruiterImage: "https://randomuser.me/api/portraits/men/52.jpg",
        dateOpenedShort: "5d",
        daysOpen: 5,
        stage: 1,
      },
      {
        id: "techcorp-frontend-developer",
        title: "Frontend Developer",
        icon: "monitor",
        status: "Closed",
        billRate: "$90/hr",
        visa: "None",
        submitted: 6,
        recruiter: "Alex Morgan",
        recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
        dateOpenedShort: "40d",
        daysOpen: 40,
        stage: 3,
      },
    ],
    placements: [
      {
        name: "Vikram Reddy",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        role: "Java Dev",
        visa: "H1B",
        billRate: 105,
        payRate: 78,
        startDate: "Jan 2025",
        status: "Active",
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Lena Park",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
        role: "Data Engineer",
        visa: "GC",
        billRate: 115,
        payRate: 85,
        startDate: "Feb 2025",
        status: "Active",
        recruiter: "Alex Morgan",
        recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Sam Wu",
        image: "https://randomuser.me/api/portraits/men/65.jpg",
        role: "DevOps",
        visa: "H1B",
        billRate: 95,
        payRate: 70,
        startDate: "Mar 2025",
        status: "Active",
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Priya N.",
        image: "https://randomuser.me/api/portraits/women/57.jpg",
        role: "QA",
        visa: "OPT",
        billRate: 75,
        payRate: 55,
        startDate: "Nov 2024",
        endDate: "Apr 2025",
        status: "Ended",
        recruiter: "Sarah Khan",
        recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Michael Johnson",
        image: "https://randomuser.me/api/portraits/men/41.jpg",
        role: "Business Analyst",
        visa: "H1B",
        billRate: 85,
        payRate: 60,
        startDate: "Aug 2024",
        endDate: "Feb 2025",
        status: "Ended",
        recruiter: "Alex Morgan",
        recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Emily Davis",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
        role: "UI/UX Designer",
        visa: "GC",
        billRate: 80,
        payRate: 58,
        startDate: "Jun 2024",
        endDate: "Dec 2024",
        status: "Ended",
        recruiter: "Jason Brown",
        recruiterImage: "https://randomuser.me/api/portraits/men/52.jpg",
      },
    ],
  },
};

const HEALTH_BY_STATUS: Record<ClientStatus, ClientDetail["healthStatus"]> = {
  Active: "Healthy",
  Prospect: "Watch",
  "At-Risk": "At Risk",
};

// Returns the rich detail for a client, falling back to values derived from the
// base record so every client opens a complete profile.
// Roster used to synthesize placements for clients without a hand-authored
// override; sliced to the client's placement counts below.
const PLACEMENT_ROSTER: Omit<Placement, "status" | "endDate">[] = [
  {
    name: "Arjun Mehta",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    role: "Java Developer",
    visa: "H1B",
    billRate: 105,
    payRate: 78,
    startDate: "Jan 2025",
    recruiter: "Sarah Khan",
    recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Nina Alvarez",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    role: "Data Engineer",
    visa: "GC",
    billRate: 115,
    payRate: 85,
    startDate: "Feb 2025",
    recruiter: "Alex Morgan",
    recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Kevin Tan",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    role: "DevOps Engineer",
    visa: "H1B",
    billRate: 95,
    payRate: 70,
    startDate: "Mar 2025",
    recruiter: "Sarah Khan",
    recruiterImage: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Rina Shah",
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    role: "QA Analyst",
    visa: "OPT",
    billRate: 75,
    payRate: 55,
    startDate: "Nov 2024",
    recruiter: "Jason Brown",
    recruiterImage: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    name: "Daniel Cruz",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    role: "Business Analyst",
    visa: "GC",
    billRate: 85,
    payRate: 60,
    startDate: "Aug 2024",
    recruiter: "Alex Morgan",
    recruiterImage: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

// Builds a placement list: `active` ongoing rows followed by `ended` past rows,
// drawn from the shared roster so every client opens with a populated table.
function buildPlacements(client: Client): Placement[] {
  const active = Math.max(0, client.activePlacements);
  const ended = Math.max(0, client.activePlacements * 3 - active);
  const rows: Placement[] = [];
  for (let i = 0; i < active; i++) {
    const base = PLACEMENT_ROSTER[i % PLACEMENT_ROSTER.length];
    rows.push({ ...base, status: "Active" });
  }
  for (let i = 0; i < ended; i++) {
    const base = PLACEMENT_ROSTER[(active + i) % PLACEMENT_ROSTER.length];
    rows.push({ ...base, status: "Ended", startDate: "Jun 2024", endDate: "Dec 2024" });
  }
  return rows;
}

// Template roles used to synthesize a jobs board for clients without a
// hand-authored override; sliced to the client's open-role count below.
const JOB_ROSTER: Omit<
  ClientJob,
  "id" | "status" | "recruiter" | "recruiterImage"
>[] = [
  {
    title: "Senior Java Developer",
    icon: "code",
    billRate: "$105/hr",
    visa: "H1B OK",
    submitted: 4,
    dateOpenedShort: "2d",
    daysOpen: 2,
    stage: 2,
  },
  {
    title: "DevOps Engineer",
    icon: "cloud",
    billRate: "$95/hr",
    visa: "Any",
    submitted: 3,
    dateOpenedShort: "8d",
    daysOpen: 8,
    stage: 2,
  },
  {
    title: "Data Engineer",
    icon: "database",
    billRate: "$115/hr",
    visa: "GC/Citizen",
    submitted: 5,
    dateOpenedShort: "20d",
    daysOpen: 20,
    stage: 3,
  },
  {
    title: "QA Automation",
    icon: "shield",
    billRate: "$75/hr",
    visa: "Any",
    submitted: 2,
    dateOpenedShort: "25d",
    daysOpen: 25,
    stage: 1,
  },
  {
    title: "Cloud Architect",
    icon: "cloudUpload",
    billRate: "$130/hr",
    visa: "Citizen only",
    submitted: 1,
    dateOpenedShort: "5d",
    daysOpen: 5,
    stage: 1,
  },
  {
    title: "Frontend Developer",
    icon: "monitor",
    billRate: "$90/hr",
    visa: "None",
    submitted: 6,
    dateOpenedShort: "12d",
    daysOpen: 12,
    stage: 2,
  },
];

// Builds the client's jobs board: `openRoles` open requisitions drawn from the
// shared roster, with the last role marked Filled so the status filter has
// something to show.
function buildJobs(client: Client): ClientJob[] {
  const count = Math.max(0, client.openRoles);
  return Array.from({ length: count }, (_, i) => {
    const base = JOB_ROSTER[i % JOB_ROSTER.length];
    const filled = i === count - 1 && count > 1;
    return {
      ...base,
      id: `${client.id}-${base.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${i}`,
      status: filled ? "Filled" : "Open",
      stage: filled ? 4 : base.stage,
      recruiter: client.accountManager,
      recruiterImage: client.accountManagerImage,
    };
  });
}

export function getClientDetail(client: Client): ClientDetail {
  const override = CLIENT_DETAILS[client.id];
  if (override) return override;

  return {
    companySize: "1,000+ employees",
    website: client.domain ?? `${client.id}.com`,
    hqLocation: "United States",
    hqLocationShort: "United States",
    founded: "—",
    about: `${client.company} is a ${client.industry.toLowerCase()} client managed by ${client.accountManager}.`,
    clientSince: "2024",
    totalPlacements: client.activePlacements * 3,
    totalRevenue: client.revenue * 6,
    avgTimeToFill: "18 days",
    healthStatus: HEALTH_BY_STATUS[client.status],
    lastContact: client.lastActivity,
    marginRate: "24%",
    revenueThisQuarter: client.revenue * 2,
    revenueQuarterDelta: "vs last quarter",
    avgBillRate: "$95/hr",
    rolesJobCount: Math.max(1, client.openRoles - 1),
    placementsRoleCount: Math.max(1, client.activePlacements - 1),
    contacts: [
      {
        name: client.contactName,
        title: client.contactTitle,
        email: `${client.contactName.split(" ")[0]?.toLowerCase()}@${client.domain ?? `${client.id}.com`}`,
        phone: "(555) 555-0100",
        role: "Decision Maker",
        lastContacted: client.lastActivity,
        primary: true,
        image: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
    commPrefs: {
      channel: "Email",
      timezone: "EST (Eastern Standard Time)",
    },
    activity: [
      {
        kind: "call",
        title: `Last contact with ${client.contactName}`,
        when: client.lastActivity,
        author: client.accountManager,
        authorImage: client.accountManagerImage,
      },
      {
        kind: "invoice",
        title: `Invoice sent (${"$" + client.revenue.toLocaleString("en-US")})`,
        when: "1w ago",
        author: "System",
      },
    ],
    invoices:
      client.revenue > 0
        ? [
            { number: "—", amount: client.revenue, date: "This month", status: "Pending" },
            { number: "—", amount: Math.round(client.revenue * 0.8), date: "Last month", status: "Paid" },
          ]
        : [],
    totalOutstanding: client.revenue,
    notes: [
      {
        body: `${client.company} managed by ${client.accountManager}. ${
          client.status === "At-Risk"
            ? "Needs re-engagement — no new role in 90+ days."
            : "Relationship active and healthy."
        }`,
        author: client.accountManager,
        authorImage: client.accountManagerImage,
        date: "Recent",
      },
    ],
    agreement: {
      placementFee: client.type === "Vendor" ? "18% of first-year salary" : "20% of first-year salary",
      contractMarkup: client.type === "Vendor" ? "28%" : "32%",
      guaranteePeriod: "90 days",
      paymentTerms: "Net 30",
      msaStatus: client.status === "Prospect" ? "Pending" : "Signed",
      msaState: client.status === "Prospect" ? "Expiring" : "Active",
      signedDate: client.status === "Prospect" ? "—" : "2024",
      expiryDate: client.status === "Prospect" ? "—" : "2026",
      contractFile: `${client.company.replace(/[^A-Za-z0-9]/g, "_")}_MSA.pdf`,
      rateCard: [
        { role: "Senior Engineer", level: "Senior", rate: "$110 /hr", notes: "Standard business hours" },
        { role: "Mid Engineer", level: "Mid", rate: "$90 /hr", notes: "Full-stack" },
        { role: "QA", level: "Mid", rate: "$75 /hr", notes: "Manual & Automation" },
      ],
      directClient: client.type === "Direct",
      engagementNote:
        client.type === "Direct"
          ? `We bill ${client.company} directly. No vendor markup applied.`
          : `${client.company} is a vendor/prime. Markup applies on pass-through rates.`,
      billingContact: {
        name: client.contactName,
        title: client.contactTitle,
        email: `${client.contactName.split(" ")[0]?.toLowerCase()}@${client.domain ?? `${client.id}.com`}`,
        phone: "+1 (555) 555-0100",
      },
    },
    jobs: buildJobs(client),
    placements: buildPlacements(client),
  };
}
