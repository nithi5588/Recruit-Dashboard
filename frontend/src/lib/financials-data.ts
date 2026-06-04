// Mock data for the Owner Financials screen. Figures mirror the approved
// design mock; swap these for live API data when the backend is wired.

export const financialsKpis = {
  totalRevenue: { value: "$172,000", delta: "14%", deltaNote: "vs last month" },
  totalMargin: { value: "$48,200", delta: "12%", deltaNote: "vs last month" },
  marginRate: { value: "28%", percent: 28, delta: "2%", deltaNote: "vs last month" },
  avgMarginPerPlacement: { value: "$1,506" },
};

// Revenue & Margin trend — ~13 points across May. Values in $K; chart max 200K.
export const revenueMarginTrend = {
  revenue: [52, 68, 75, 90, 102, 115, 128, 140, 152, 163, 172, 181, 190],
  margin: [15, 19, 21, 25, 28, 32, 36, 39, 43, 46, 48, 51, 55],
  max: 200,
  xLabels: ["May 1", "May 8", "May 15", "May 22", "May 31"],
  yLabels: ["$200K", "$150K", "$100K", "$50K", "$0"],
};

export type MarginPlacement = {
  consultant: string;
  image: string;
  client: string;
  recruiter: string;
  billRate: string;
  payRate: string;
  marginHr: string;
  hours: string;
  monthlyMargin: string;
  type: "Contract" | "Permanent";
};

export const marginPerPlacement: MarginPlacement[] = [
  { consultant: "Vikram Reddy", image: "https://randomuser.me/api/portraits/men/32.jpg", client: "TechCorp", recruiter: "Sarah Khan", billRate: "$100/hr", payRate: "$75/hr", marginHr: "$25/hr", hours: "160", monthlyMargin: "$4,000", type: "Contract" },
  { consultant: "Priya Sharma", image: "https://randomuser.me/api/portraits/women/65.jpg", client: "FinServe", recruiter: "Alex Morgan", billRate: "$110/hr", payRate: "$80/hr", marginHr: "$30/hr", hours: "160", monthlyMargin: "$4,800", type: "Contract" },
  { consultant: "Arjun Mehta", image: "https://randomuser.me/api/portraits/men/45.jpg", client: "Walmart", recruiter: "Sarah Khan", billRate: "$95/hr", payRate: "$72/hr", marginHr: "$23/hr", hours: "168", monthlyMargin: "$3,864", type: "Contract" },
  { consultant: "Neha Verma", image: "https://randomuser.me/api/portraits/women/24.jpg", client: "JPMorgan", recruiter: "Jason Brown", billRate: "$120/hr", payRate: "$85/hr", marginHr: "$35/hr", hours: "160", monthlyMargin: "$5,600", type: "Contract" },
  { consultant: "Sneha Iyer", image: "https://randomuser.me/api/portraits/women/57.jpg", client: "Microsoft", recruiter: "Lisa Patel", billRate: "—", payRate: "—", marginHr: "—", hours: "—", monthlyMargin: "$18,000", type: "Permanent" },
  { consultant: "Karan Singh", image: "https://randomuser.me/api/portraits/men/36.jpg", client: "Deloitte", recruiter: "Jason Brown", billRate: "—", payRate: "—", marginHr: "—", hours: "—", monthlyMargin: "$15,000", type: "Permanent" },
];

export const contractVsPermanent = { contract: 70, permanent: 30 };

export const directVsVendor = {
  direct: 60,
  vendor: 40,
  note: "Vendor split reduces margin.",
};

export type ClientRevenue = { name: string; value: string; amount: number };

export const topClientsByRevenue: ClientRevenue[] = [
  { name: "TechCorp", value: "$52k", amount: 52 },
  { name: "FinServe", value: "$38k", amount: 38 },
  { name: "Walmart", value: "$29k", amount: 29 },
  { name: "JPMorgan", value: "$21k", amount: 21 },
];

export type RecruiterRevenue = { name: string; value: string; amount: number };

export const revenuePerRecruiter: RecruiterRevenue[] = [
  { name: "Sarah Khan", value: "$18,600", amount: 18600 },
  { name: "Alex Morgan", value: "$13,200", amount: 13200 },
  { name: "Jason Brown", value: "$8,900", amount: 8900 },
  { name: "Lisa Patel", value: "$3,500", amount: 3500 },
];

export const forecast = {
  expected: "$18k",
  fromCount: 5,
  stage: "Offered",
  actual: { label: "$172k", amount: 172 },
  next: { label: "$18k", amount: 18 },
  total: "$190k",
};

export type Invoice = {
  client: string;
  amount: string;
  dueDate: string;
  status: "Pending" | "Overdue";
};

export const outstandingInvoices: Invoice[] = [
  { client: "TechCorp", amount: "$24,000", dueDate: "Jun 10, 2025", status: "Pending" },
  { client: "FinServe", amount: "$18,500", dueDate: "May 28, 2025", status: "Overdue" },
  { client: "Walmart", amount: "$12,000", dueDate: "Jun 15, 2025", status: "Pending" },
];

export const totalOwed = { value: "$54,500", invoices: 3 };
