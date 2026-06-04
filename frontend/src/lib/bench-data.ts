// Mock data for the Bench screen — idle consultants and re-placement.
// Figures mirror the approved design mock; swap these for live API data when
// the backend is wired.

export type Visa = "H1B" | "GC" | "OPT";

export type BenchConsultant = {
  name: string;
  skill: string;
  visa: Visa;
  employment: string;
  daysOnBench: number;
  costAccrued: string;
  payRate: string;
  owner: string;
  marketing: { label: string; status: "marketed" | "not-marketed" };
  /** Profile photo — deterministic per person; falls back to initials. */
  image: string;
};

export const benchKpis = {
  totalBenchCost: { value: "$32,000", note: "bleeding this month" },
  consultantsIdle: { value: "4", note: "needing placement" },
  avgDaysOnBench: { value: "18", note: "days" },
  projectedMonthlyCost: { value: "$52,000", note: "if not placed" },
};

export const benchConsultants: BenchConsultant[] = [
  {
    name: "Vikram Reddy",
    skill: "Java / Spring Boot",
    visa: "H1B",
    employment: "W2",
    daysOnBench: 22,
    costAccrued: "$8,800",
    payRate: "$50/hr",
    owner: "Sarah Khan",
    marketing: { label: "Sent to 3 vendors", status: "marketed" },
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya Sharma",
    skill: "DevOps / AWS",
    visa: "H1B",
    employment: "W2",
    daysOnBench: 19,
    costAccrued: "$7,600",
    payRate: "$48/hr",
    owner: "Alex Morgan",
    marketing: { label: "Sent to 2 vendors", status: "marketed" },
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Arjun Mehta",
    skill: "React / Node.js",
    visa: "H1B",
    employment: "W2",
    daysOnBench: 18,
    costAccrued: "$7,200",
    payRate: "$47/hr",
    owner: "Sarah Khan",
    marketing: { label: "Not marketed", status: "not-marketed" },
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Michael Johnson",
    skill: "Data Engineer",
    visa: "GC",
    employment: "W2",
    daysOnBench: 15,
    costAccrued: "$8,400",
    payRate: "$70/hr",
    owner: "Jason Brown",
    marketing: { label: "Sent to 5 vendors", status: "marketed" },
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Neha Gupta",
    skill: "QA Automation",
    visa: "OPT",
    employment: "W2",
    daysOnBench: 9,
    costAccrued: "$3,600",
    payRate: "$40/hr",
    owner: "Lisa Patel",
    marketing: { label: "Not marketed", status: "not-marketed" },
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

// Bench Aging — longest idle first. Danger zone begins at 21+ days.
export const benchAging = benchConsultants
  .map((c) => ({ name: c.name, days: c.daysOnBench }))
  .sort((a, b) => b.days - a.days);

export const benchAgingMax = 30;
export const benchAgingTicks = [0, 5, 10, 15, 20, 25, 30];
export const benchDangerZone = 21;
// Where the danger-zone marker line is drawn on the aging axis. The mock places
// it to the right of every bar (~26) rather than at the literal 21-day
// threshold, so the visual position is kept separate from `benchDangerZone`.
export const benchDangerLineAt = 26;

export type VisaBreakdown = { visa: Visa; count: number };

export const benchByVisa: VisaBreakdown[] = [
  { visa: "H1B", count: 3 },
  { visa: "GC", count: 1 },
  { visa: "OPT", count: 1 },
];

export const hotlist = {
  count: 3,
  preview: [
    "Hi Team,",
    "Please find our available consultants ready to interview.",
    "Reply with suitable requirements.",
    "Thanks,",
    "Recruit Team",
  ],
  consultants: [
    { name: "Vikram Reddy", skill: "Java / Spring Boot", days: 22, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Sharma", skill: "DevOps / AWS", days: 19, image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Arjun Mehta", skill: "React / Node.js", days: 18, image: "https://randomuser.me/api/portraits/men/45.jpg" },
  ],
  vendors: [
    { name: "Vantage Systems", state: "done" as const, when: "2h ago" },
    { name: "Tekwissen", state: "done" as const, when: "3h ago" },
    { name: "Motion Recruitment", state: "done" as const, when: "4h ago" },
    { name: "KForce", state: "pending" as const, when: "Pending" },
    { name: "Apex Systems", state: "pending" as const, when: "Pending" },
  ],
};
