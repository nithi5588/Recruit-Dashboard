// Targets & Activity tab data for the per-member detail workspace. Kept in its
// own module so the figures mirror the approved Sarah Khan mock exactly; other
// members carry plausible, internally-consistent numbers derived from the table.

export type TargetTone = "good" | "warn" | "bad";
export type TargetKind = "placements" | "submittals" | "interviews" | "margin";

export type MonthlyTarget = {
  kind: TargetKind;
  label: string;
  done: string; // display value, e.g. "8" or "$18,600"
  goal: string; // display value, e.g. "10" or "$20,000"
  percent: number;
  tone: TargetTone;
};

export type TargetsActivityKind =
  | "placed"
  | "interview"
  | "submitted"
  | "added"
  | "moved"
  | "joined";
export type TargetsActivityItem = {
  kind: TargetsActivityKind;
  text: string;
  time: string;
};

export type AdminNote = { lines: string[]; author: string; date: string };

export type MemberTargets = {
  targets: MonthlyTarget[];
  quarterly: { done: number; goal: number; percent: number; remaining: string };
  streak: { months: number; note: string };
  attainment: { percent: number; delta: string };
  activity: TargetsActivityItem[];
  notes: AdminNote[];
};

// Sarah Khan — the approved design mock, reproduced exactly.
const sarahTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "8", goal: "10", percent: 80, tone: "good" },
    { kind: "submittals", label: "Submittals", done: "48", goal: "50", percent: 96, tone: "good" },
    { kind: "interviews", label: "Interviews", done: "22", goal: "25", percent: 88, tone: "good" },
    { kind: "margin", label: "Margin", done: "$18,600", goal: "$20,000", percent: 93, tone: "good" },
  ],
  quarterly: { done: 24, goal: 30, percent: 80, remaining: "6 more to go" },
  streak: { months: 3, note: "Great momentum! Keep it up." },
  attainment: { percent: 92, delta: "4%" },
  activity: [
    { kind: "placed", text: "Placed Vikram Reddy at TechCorp", time: "2h ago" },
    { kind: "interview", text: "Scheduled interview with Priya Sharma", time: "Yesterday" },
    { kind: "submitted", text: "Submitted Arjun Mehta to Walmart", time: "2 days ago" },
    { kind: "added", text: "Added Neha Verma to pipeline for JPMorgan role", time: "3 days ago" },
    { kind: "moved", text: "Moved Rohit Patel to Offer stage for Google role", time: "4 days ago" },
    { kind: "joined", text: "Consultant joined project at Amazon", time: "5 days ago" },
    { kind: "submitted", text: "Submitted Kavya Nair to Deloitte", time: "6 days ago" },
  ],
  notes: [
    {
      lines: ["Strong on cloud roles.", "Coach on closing speed for offer stage."],
      author: "Nithish",
      date: "May 2",
    },
    {
      lines: ["Excellent consultant utilization.", "Consider assigning 2 additional roles."],
      author: "Nithish",
      date: "Apr 21",
    },
  ],
};

const alexTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "6", goal: "8", percent: 75, tone: "good" },
    { kind: "submittals", label: "Submittals", done: "37", goal: "45", percent: 82, tone: "good" },
    { kind: "interviews", label: "Interviews", done: "19", goal: "24", percent: 79, tone: "good" },
    { kind: "margin", label: "Margin", done: "$13,200", goal: "$16,000", percent: 83, tone: "good" },
  ],
  quarterly: { done: 18, goal: 26, percent: 69, remaining: "8 more to go" },
  streak: { months: 2, note: "Building a solid streak." },
  attainment: { percent: 84, delta: "3%" },
  activity: [
    { kind: "submitted", text: "Submitted Karthik Rao to Stripe", time: "1h ago" },
    { kind: "interview", text: "Scheduled interview with Meera Iyer", time: "Yesterday" },
    { kind: "placed", text: "Placed Ananya Singh at Adobe", time: "2 days ago" },
    { kind: "added", text: "Added Sam Carter to pipeline for Nike role", time: "3 days ago" },
    { kind: "moved", text: "Moved Dev Sharma to Interview stage for Meta role", time: "5 days ago" },
    { kind: "joined", text: "Consultant joined project at Nike", time: "6 days ago" },
    { kind: "submitted", text: "Submitted Tara Bose to ByteScale", time: "1 week ago" },
  ],
  notes: [
    {
      lines: ["Great with frontend roles.", "Push for more enterprise submittals."],
      author: "Nithish",
      date: "May 1",
    },
    {
      lines: ["Responsive to client feedback.", "Keep nurturing the React bench."],
      author: "Sarah Khan",
      date: "Apr 18",
    },
  ],
};

const jasonTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "4", goal: "8", percent: 50, tone: "warn" },
    { kind: "submittals", label: "Submittals", done: "28", goal: "40", percent: 70, tone: "good" },
    { kind: "interviews", label: "Interviews", done: "14", goal: "22", percent: 64, tone: "warn" },
    { kind: "margin", label: "Margin", done: "$8,900", goal: "$14,000", percent: 64, tone: "warn" },
  ],
  quarterly: { done: 12, goal: 24, percent: 50, remaining: "12 more to go" },
  streak: { months: 1, note: "Find your rhythm this month." },
  attainment: { percent: 62, delta: "2%" },
  activity: [
    { kind: "added", text: "Added Lena Park to pipeline for Oracle role", time: "3h ago" },
    { kind: "submitted", text: "Submitted Ravi Kumar to Salesforce", time: "Yesterday" },
    { kind: "interview", text: "Scheduled interview with Tom Hughes", time: "2 days ago" },
    { kind: "placed", text: "Placed Maya Joshi at IBM", time: "4 days ago" },
    { kind: "moved", text: "Moved Omar Ali to Offer stage for Cisco role", time: "6 days ago" },
    { kind: "joined", text: "Consultant joined project at IBM", time: "1 week ago" },
    { kind: "submitted", text: "Submitted Lena Park to Oracle", time: "1 week ago" },
  ],
  notes: [
    {
      lines: ["Solid sourcing fundamentals.", "Focus on moving offers to placements."],
      author: "Sarah Khan",
      date: "Apr 28",
    },
    {
      lines: ["Improving week over week.", "Schedule a closing-skills 1:1."],
      author: "Nithish",
      date: "Apr 14",
    },
  ],
};

const priyaTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "5", goal: "8", percent: 63, tone: "warn" },
    { kind: "submittals", label: "Submittals", done: "41", goal: "45", percent: 91, tone: "good" },
    { kind: "interviews", label: "Interviews", done: "17", goal: "22", percent: 77, tone: "good" },
    { kind: "margin", label: "Margin", done: "$11,400", goal: "$15,000", percent: 76, tone: "good" },
  ],
  quarterly: { done: 15, goal: 24, percent: 63, remaining: "9 more to go" },
  streak: { months: 2, note: "Consistent bench movement." },
  attainment: { percent: 78, delta: "3%" },
  activity: [
    { kind: "submitted", text: "Submitted bench consultant to Deloitte", time: "45m ago" },
    { kind: "added", text: "Added 3 consultants to the .NET bench pool", time: "Yesterday" },
    { kind: "interview", text: "Scheduled interview with Hari Menon", time: "2 days ago" },
    { kind: "placed", text: "Placed Sana Khan at Accenture", time: "3 days ago" },
    { kind: "moved", text: "Moved Vivek Rao to Offer stage for Infosys role", time: "5 days ago" },
    { kind: "joined", text: "Consultant joined project at Accenture", time: "6 days ago" },
    { kind: "submitted", text: "Submitted Naveen Das to Cognizant", time: "1 week ago" },
  ],
  notes: [
    {
      lines: ["Excellent bench utilization.", "Watch capacity — nearing the limit."],
      author: "Nithish",
      date: "Apr 30",
    },
    {
      lines: ["Strong client relationships.", "Delegate sourcing to free up time."],
      author: "Nithish",
      date: "Apr 16",
    },
  ],
};

const lisaTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "2", goal: "8", percent: 25, tone: "bad" },
    { kind: "submittals", label: "Submittals", done: "19", goal: "40", percent: 48, tone: "bad" },
    { kind: "interviews", label: "Interviews", done: "9", goal: "20", percent: 45, tone: "bad" },
    { kind: "margin", label: "Margin", done: "$3,500", goal: "$12,000", percent: 29, tone: "bad" },
  ],
  quarterly: { done: 6, goal: 22, percent: 27, remaining: "16 more to go" },
  streak: { months: 0, note: "Let’s get the first win on the board." },
  attainment: { percent: 34, delta: "6%" },
  activity: [
    { kind: "added", text: "Added Grace Lin to pipeline for Airbnb role", time: "5h ago" },
    { kind: "submitted", text: "Submitted Noah Reed to Uber", time: "Yesterday" },
    { kind: "interview", text: "Scheduled interview with Aria Bose", time: "3 days ago" },
    { kind: "placed", text: "Placed Ian Cole at Dropbox", time: "6 days ago" },
    { kind: "moved", text: "Moved Zoe Tan to Interview stage for Lyft role", time: "1 week ago" },
    { kind: "joined", text: "Consultant joined project at Dropbox", time: "1 week ago" },
    { kind: "submitted", text: "Submitted Aria Bose to Uber", time: "2 weeks ago" },
  ],
  notes: [
    {
      lines: ["Ramping up — new to the team.", "Pair with Sarah on her next 3 submittals."],
      author: "Nithish",
      date: "May 3",
    },
    {
      lines: ["Eager and coachable.", "Set a weekly submittal floor of 8."],
      author: "Sarah Khan",
      date: "Apr 22",
    },
  ],
};

const mikeTargets: MemberTargets = {
  targets: [
    { kind: "placements", label: "Placements", done: "0", goal: "8", percent: 0, tone: "bad" },
    { kind: "submittals", label: "Submittals", done: "0", goal: "40", percent: 0, tone: "bad" },
    { kind: "interviews", label: "Interviews", done: "0", goal: "20", percent: 0, tone: "bad" },
    { kind: "margin", label: "Margin", done: "$0", goal: "$12,000", percent: 0, tone: "bad" },
  ],
  quarterly: { done: 0, goal: 22, percent: 0, remaining: "22 more to go" },
  streak: { months: 0, note: "Targets begin once the invite is accepted." },
  attainment: { percent: 0, delta: "0%" },
  activity: [
    { kind: "added", text: "Invitation sent to mike@agency.com", time: "2 days ago" },
  ],
  notes: [
    {
      lines: ["Invite pending acceptance.", "Onboarding scheduled for next week."],
      author: "Nithish",
      date: "May 2",
    },
  ],
};

const memberTargets: Record<string, MemberTargets> = {
  "sarah-khan": sarahTargets,
  "alex-morgan": alexTargets,
  "jason-brown": jasonTargets,
  "priya-nair": priyaTargets,
  "lisa-patel": lisaTargets,
  "mike-chen": mikeTargets,
};

export function getMemberTargets(slug: string): MemberTargets {
  return memberTargets[slug] ?? sarahTargets;
}
