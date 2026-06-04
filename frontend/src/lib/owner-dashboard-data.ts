// Mock data for the Owner / agency dashboard. Figures mirror the approved
// design mock; swap these for live API data when the backend is wired.

export type KpiTone = "green" | "purple" | "red";

export const ownerKpis = {
  marginThisMonth: { value: "$48,200", delta: "12%", deltaNote: "vs last month" },
  activePlacements: { value: "32", delta: "16%", deltaNote: "vs last month" },
  utilization: { value: "80%", percent: 80, delta: "8%", deltaNote: "vs last month" },
  benchCost: { value: "$32,000", note: "4 consultants idle" },
};

export const revenue = {
  total: "$172,000",
  margin: "$48,200",
  marginRate: "28% margin rate",
  marginDelta: "2%",
  marginDeltaNote: "margin rate vs last month",
  mix: { contract: 70, permanent: 30 },
  forecast: {
    amount: "$18k potential",
    fromCount: 5,
    stage: "Offered",
  },
  // ~22 business days across May; rises from ~10K to ~72K.
  trend: [
    10, 13, 12, 16, 18, 22, 21, 26, 30, 33, 31, 38, 42, 45, 48, 52, 55, 59, 63,
    66, 70, 72,
  ],
  trendMax: 80,
  xLabels: ["May 1", "May 8", "May 15", "May 22", "May 31"],
  yLabels: ["80K", "60K", "40K", "20K", "0"],
};

export type BenchConsultant = {
  name: string;
  skill: string;
  visa: string;
  days: string;
  cost: string;
  /** Profile photo — deterministic per person; falls back to initials. */
  image?: string;
};

export const benchAlert = {
  amount: "$32,000",
  idle: 4,
  consultants: [
    { name: "Vikram Reddy", skill: "Java / Spring Boot", visa: "H1B", days: "22 days", cost: "$8,800", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Sharma", skill: "DevOps / AWS", visa: "H1B", days: "19 days", cost: "$7,600", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  ] satisfies BenchConsultant[],
};

/** The signed-in owner shown in the sidebar + top bar. */
export const currentUser = {
  name: "Nithish",
  role: "Owner",
  image: "https://randomuser.me/api/portraits/men/45.jpg",
};

export type PipelineStage = {
  label: string;
  value: number;
  conversion?: string;
};

export const agencyPipeline: PipelineStage[] = [
  { label: "Submitted", value: 128 },
  { label: "Interview", value: 64, conversion: "50% conversion" },
  { label: "Offered", value: 18, conversion: "28% conversion" },
  { label: "Placed", value: 32, conversion: "177% conversion" },
];

export type TeamMember = {
  name: string;
  initials: string;
  placements: number;
  margin: string;
  /** Avatar background, per the design mock. */
  avatarColor: string;
};

export const teamPerformance: TeamMember[] = [
  { name: "Sarah Khan", initials: "SK", placements: 8, margin: "$18,600", avatarColor: "#22C55E" },
  { name: "Alex Morgan", initials: "AM", placements: 6, margin: "$13,200", avatarColor: "#5B3DF5" },
  { name: "Jason Brown", initials: "JB", placements: 4, margin: "$8,900", avatarColor: "#3F3F46" },
];

export const thisWeek = [
  { value: 5, label: "Interviews", icon: "calendar" as const },
  { value: 2, label: "Offers Pending", icon: "offer" as const },
  { value: 2, label: "Contracts Ending Soon", icon: "contract" as const },
];

export const visaUtilization = {
  utilization: 80,
  available: 40,
  breakdown: [
    { label: "Citizen", count: 18 },
    { label: "GC", count: 10 },
    { label: "H1B", count: 8 },
    { label: "OPT", count: 4 },
  ],
  billing: 16,
  benched: 4,
};

export type AttentionItem = {
  icon: "visa" | "contract" | "followup" | "client";
  title: string;
  subtitle: string;
  cta: string;
  tone: "amber" | "purple" | "red" | "neutral";
};

export const needsAttention: AttentionItem[] = [
  {
    icon: "visa",
    title: "5 consultants with visa expiring in 60 days",
    subtitle: "",
    cta: "View consultants",
    tone: "amber",
  },
  {
    icon: "contract",
    title: "3 contracts ending next week",
    subtitle: "Re-engage for re-placement",
    cta: "View contracts",
    tone: "purple",
  },
  {
    icon: "followup",
    title: "3 overdue follow-ups",
    subtitle: "Candidates and clients",
    cta: "View follow-ups",
    tone: "red",
  },
  {
    icon: "client",
    title: "2 clients inactive 90+ days",
    subtitle: "No new jobs posted",
    cta: "View clients",
    tone: "neutral",
  },
];
