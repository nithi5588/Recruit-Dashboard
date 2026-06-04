// Workload tab data for the per-member detail workspace. Kept in its own module
// so the figures mirror the approved Sarah Khan mock exactly; other members
// carry plausible, internally-consistent numbers derived from the table data.

export type ConsultantVisa = "H1B" | "GC" | "USC" | "OPT";
export type ConsultantStatus = "On Bench" | "On Project";

export type WorkloadConsultant = {
  name: string;
  skill: string;
  visa: ConsultantVisa;
  status: ConsultantStatus;
  client: string | null;
  rate: string;
};

export type WorkloadJob = {
  title: string;
  client: string;
  daysOpen: number;
  submitted: number;
  status: "Open" | "On Hold" | "Filled";
};

export type PipelineStageKind = "submitted" | "interview" | "offered";
export type PipelineStage = {
  kind: PipelineStageKind;
  label: string;
  count: number;
  names: string[];
  more?: number;
};

export type WorkloadStatusTone = "good" | "warn" | "bad";

export type MemberWorkload = {
  activeSubmissions: number;
  status: { label: string; note: string; tone: WorkloadStatusTone };
  consultants: WorkloadConsultant[];
  consultantsTotal: number;
  jobs: WorkloadJob[];
  jobsTotal: number;
  pipeline: PipelineStage[];
  capacity: {
    load: number;
    recommended: number;
    percent: number;
    untilLimit: string;
    benchIdle: number;
    benchAccrued: string;
  };
};

// Sarah Khan — the approved design mock, reproduced exactly.
const sarahWorkload: MemberWorkload = {
  activeSubmissions: 9,
  status: { label: "Balanced", note: "On track with capacity", tone: "good" },
  consultantsTotal: 14,
  consultants: [
    { name: "Vikram Reddy", skill: "Java · Spring Boot", visa: "H1B", status: "On Bench", client: null, rate: "$85/hr" },
    { name: "Priya Sharma", skill: "DevOps · AWS", visa: "H1B", status: "On Project", client: "TechCorp", rate: "$100/hr" },
    { name: "Arjun Mehta", skill: "Python · Django", visa: "GC", status: "On Project", client: "DataSoft", rate: "$95/hr" },
    { name: "Neha Verma", skill: "React · Node.js", visa: "H1B", status: "On Bench", client: null, rate: "$80/hr" },
    { name: "Rohit Patel", skill: ".NET · C#", visa: "GC", status: "On Project", client: "InnovaTech", rate: "$90/hr" },
    { name: "Sneha Iyer", skill: "Salesforce · Apex", visa: "H1B", status: "On Bench", client: null, rate: "$75/hr" },
  ],
  jobsTotal: 6,
  jobs: [
    { title: "Senior Java Developer", client: "TechCorp", daysOpen: 24, submitted: 3, status: "Open" },
    { title: "DevOps Engineer", client: "CloudWave", daysOpen: 18, submitted: 2, status: "Open" },
    { title: "Full Stack Developer", client: "InnovaTech", daysOpen: 31, submitted: 1, status: "Open" },
    { title: "Data Engineer", client: "DataSoft", daysOpen: 12, submitted: 4, status: "Open" },
    { title: "Python Developer", client: "ByteScale", daysOpen: 9, submitted: 2, status: "Open" },
    { title: "QA Automation Engineer", client: "FinServ Inc.", daysOpen: 28, submitted: 0, status: "Open" },
  ],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 5, names: ["Arjun Mehta", "Neha Verma", "Sandeep Kumar"], more: 2 },
    { kind: "interview", label: "Interview", count: 3, names: ["Rohit Patel", "Kavya Nair", "Vishal Singh"] },
    { kind: "offered", label: "Offered", count: 1, names: ["Priya Sharma"] },
  ],
  capacity: {
    load: 14,
    recommended: 15,
    percent: 93,
    untilLimit: "1 more consultant until recommended limit",
    benchIdle: 1,
    benchAccrued: "$7,200",
  },
};

const alexWorkload: MemberWorkload = {
  activeSubmissions: 7,
  status: { label: "Balanced", note: "On track with capacity", tone: "good" },
  consultantsTotal: 11,
  consultants: [
    { name: "Karthik Rao", skill: "Java · Microservices", visa: "H1B", status: "On Project", client: "Stripe", rate: "$98/hr" },
    { name: "Meera Iyer", skill: "QA · Selenium", visa: "GC", status: "On Project", client: "Adobe", rate: "$82/hr" },
    { name: "Ananya Singh", skill: "React · TypeScript", visa: "H1B", status: "On Bench", client: null, rate: "$88/hr" },
    { name: "Sam Carter", skill: "Go · Kubernetes", visa: "USC", status: "On Project", client: "Nike", rate: "$105/hr" },
    { name: "Dev Sharma", skill: "Python · ML", visa: "OPT", status: "On Bench", client: null, rate: "$78/hr" },
    { name: "Tara Bose", skill: "Angular · Node.js", visa: "H1B", status: "On Project", client: "Meta", rate: "$92/hr" },
  ],
  jobsTotal: 5,
  jobs: [
    { title: "Backend Engineer", client: "Stripe", daysOpen: 21, submitted: 2, status: "Open" },
    { title: "QA Lead", client: "Adobe", daysOpen: 14, submitted: 3, status: "Open" },
    { title: "Frontend Engineer", client: "Nike", daysOpen: 8, submitted: 1, status: "Open" },
    { title: "Platform Engineer", client: "Meta", daysOpen: 27, submitted: 0, status: "Open" },
    { title: "ML Engineer", client: "ByteScale", daysOpen: 11, submitted: 2, status: "Open" },
  ],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 4, names: ["Karthik Rao", "Dev Sharma", "Tara Bose"], more: 1 },
    { kind: "interview", label: "Interview", count: 2, names: ["Meera Iyer", "Sam Carter"] },
    { kind: "offered", label: "Offered", count: 1, names: ["Ananya Singh"] },
  ],
  capacity: {
    load: 11,
    recommended: 15,
    percent: 73,
    untilLimit: "4 more consultants until recommended limit",
    benchIdle: 2,
    benchAccrued: "$9,800",
  },
};

const jasonWorkload: MemberWorkload = {
  activeSubmissions: 5,
  status: { label: "Balanced", note: "On track with capacity", tone: "good" },
  consultantsTotal: 9,
  consultants: [
    { name: "Ravi Kumar", skill: "Salesforce · Apex", visa: "H1B", status: "On Project", client: "Salesforce", rate: "$96/hr" },
    { name: "Lena Park", skill: "Oracle · PL/SQL", visa: "GC", status: "On Bench", client: null, rate: "$84/hr" },
    { name: "Tom Hughes", skill: "Java · Spring", visa: "USC", status: "On Project", client: "Oracle", rate: "$100/hr" },
    { name: "Maya Joshi", skill: "Data · Snowflake", visa: "H1B", status: "On Project", client: "IBM", rate: "$90/hr" },
    { name: "Omar Ali", skill: ".NET · Azure", visa: "H1B", status: "On Bench", client: null, rate: "$83/hr" },
  ],
  jobsTotal: 4,
  jobs: [
    { title: "Salesforce Developer", client: "Salesforce", daysOpen: 19, submitted: 2, status: "Open" },
    { title: "Oracle DBA", client: "Oracle", daysOpen: 26, submitted: 1, status: "Open" },
    { title: "Data Engineer", client: "IBM", daysOpen: 10, submitted: 1, status: "Open" },
    { title: ".NET Developer", client: "Cisco", daysOpen: 7, submitted: 1, status: "Open" },
  ],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 3, names: ["Ravi Kumar", "Lena Park", "Omar Ali"] },
    { kind: "interview", label: "Interview", count: 2, names: ["Tom Hughes", "Maya Joshi"] },
    { kind: "offered", label: "Offered", count: 1, names: ["Maya Joshi"] },
  ],
  capacity: {
    load: 9,
    recommended: 15,
    percent: 60,
    untilLimit: "6 more consultants until recommended limit",
    benchIdle: 2,
    benchAccrued: "$8,400",
  },
};

const priyaWorkload: MemberWorkload = {
  activeSubmissions: 11,
  status: { label: "At Capacity", note: "18 consultants exceed the limit of 15", tone: "warn" },
  consultantsTotal: 18,
  consultants: [
    { name: "Sana Khan", skill: "Java · Spring Boot", visa: "H1B", status: "On Project", client: "Accenture", rate: "$94/hr" },
    { name: "Vivek Rao", skill: "DevOps · GCP", visa: "GC", status: "On Project", client: "Infosys", rate: "$98/hr" },
    { name: "Hari Menon", skill: "Python · FastAPI", visa: "H1B", status: "On Bench", client: null, rate: "$86/hr" },
    { name: "Asha Pillai", skill: "React · Redux", visa: "OPT", status: "On Bench", client: null, rate: "$79/hr" },
    { name: "Naveen Das", skill: ".NET · C#", visa: "H1B", status: "On Project", client: "Cognizant", rate: "$91/hr" },
    { name: "Ritu Shah", skill: "QA · Cypress", visa: "GC", status: "On Bench", client: null, rate: "$77/hr" },
  ],
  jobsTotal: 4,
  jobs: [
    { title: "Java Consultant", client: "Accenture", daysOpen: 22, submitted: 3, status: "Open" },
    { title: "DevOps Consultant", client: "Infosys", daysOpen: 16, submitted: 2, status: "Open" },
    { title: "QA Engineer", client: "Cognizant", daysOpen: 29, submitted: 1, status: "Open" },
    { title: "Python Consultant", client: "Deloitte", daysOpen: 13, submitted: 2, status: "Open" },
  ],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 6, names: ["Hari Menon", "Asha Pillai", "Ritu Shah"], more: 3 },
    { kind: "interview", label: "Interview", count: 2, names: ["Sana Khan", "Vivek Rao"] },
    { kind: "offered", label: "Offered", count: 1, names: ["Naveen Das"] },
  ],
  capacity: {
    load: 18,
    recommended: 15,
    percent: 100,
    untilLimit: "3 consultants over the recommended limit",
    benchIdle: 3,
    benchAccrued: "$14,600",
  },
};

const lisaWorkload: MemberWorkload = {
  activeSubmissions: 3,
  status: { label: "Underutilized", note: "Capacity available for more consultants", tone: "warn" },
  consultantsTotal: 7,
  consultants: [
    { name: "Grace Lin", skill: "React · Next.js", visa: "H1B", status: "On Project", client: "Airbnb", rate: "$89/hr" },
    { name: "Noah Reed", skill: "Node.js · GraphQL", visa: "USC", status: "On Bench", client: null, rate: "$92/hr" },
    { name: "Aria Bose", skill: "Python · Django", visa: "GC", status: "On Project", client: "Uber", rate: "$87/hr" },
    { name: "Ian Cole", skill: "Java · Kafka", visa: "H1B", status: "On Project", client: "Dropbox", rate: "$95/hr" },
    { name: "Zoe Tan", skill: "QA · Playwright", visa: "OPT", status: "On Bench", client: null, rate: "$74/hr" },
  ],
  jobsTotal: 3,
  jobs: [
    { title: "Frontend Engineer", client: "Airbnb", daysOpen: 17, submitted: 1, status: "Open" },
    { title: "Backend Engineer", client: "Uber", daysOpen: 23, submitted: 1, status: "Open" },
    { title: "Java Engineer", client: "Lyft", daysOpen: 9, submitted: 1, status: "Open" },
  ],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 2, names: ["Noah Reed", "Zoe Tan"] },
    { kind: "interview", label: "Interview", count: 1, names: ["Aria Bose"] },
    { kind: "offered", label: "Offered", count: 0, names: [] },
  ],
  capacity: {
    load: 7,
    recommended: 15,
    percent: 47,
    untilLimit: "8 more consultants until recommended limit",
    benchIdle: 2,
    benchAccrued: "$6,100",
  },
};

const mikeWorkload: MemberWorkload = {
  activeSubmissions: 0,
  status: { label: "Not Started", note: "Invite pending — no workload yet", tone: "bad" },
  consultantsTotal: 0,
  consultants: [],
  jobsTotal: 0,
  jobs: [],
  pipeline: [
    { kind: "submitted", label: "Submitted", count: 0, names: [] },
    { kind: "interview", label: "Interview", count: 0, names: [] },
    { kind: "offered", label: "Offered", count: 0, names: [] },
  ],
  capacity: {
    load: 0,
    recommended: 15,
    percent: 0,
    untilLimit: "15 consultants until recommended limit",
    benchIdle: 0,
    benchAccrued: "$0",
  },
};

const memberWorkloads: Record<string, MemberWorkload> = {
  "sarah-khan": sarahWorkload,
  "alex-morgan": alexWorkload,
  "jason-brown": jasonWorkload,
  "priya-nair": priyaWorkload,
  "lisa-patel": lisaWorkload,
  "mike-chen": mikeWorkload,
};

export function getMemberWorkload(slug: string): MemberWorkload {
  return memberWorkloads[slug] ?? sarahWorkload;
}
