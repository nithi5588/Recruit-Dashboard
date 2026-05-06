export type CandidateStatus =
  | "Open"
  | "Shortlisted"
  | "Interview"
  | "Submitted"
  | "Offered"
  | "Placed"
  | "Rejected";

export type Candidate = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: string;
  location: string;
  status: CandidateStatus;
  priority: "High" | "Medium" | "Low";
  score: number;
  updated: string;
  /** Clean availability value used in the candidates table. */
  availability: string;
};

export const candidates: Candidate[] = [
  {
    id: "savannah-nguyen",
    name: "Savannah Nguyen",
    role: "Senior Product Designer",
    skills: ["UI/UX", "Figma", "React Design System"],
    experience: "3+ years",
    location: "Toronto, Canada",
    status: "Open",
    priority: "High",
    score: 85,
    updated: "2h ago",
    availability: "Full-time",
  },
  {
    id: "marvin-mckinney",
    name: "Marvin McKinney",
    role: "Full Stack Developer",
    skills: ["Python", "Django", "AWS", "PostgreSQL"],
    experience: "5+ years",
    location: "New York, USA",
    status: "Shortlisted",
    priority: "High",
    score: 92,
    updated: "4h ago",
    availability: "Available in 15 days",
  },
  {
    id: "kathryn-murphy",
    name: "Kathryn Murphy",
    role: "Data Scientist",
    skills: ["Python", "TensorFlow", "SQL", "Power BI"],
    experience: "4+ years",
    location: "Austin, USA",
    status: "Interview",
    priority: "High",
    score: 75,
    updated: "6h ago",
    availability: "Available in 7 days",
  },
  {
    id: "robert-fox",
    name: "Robert Fox",
    role: "DevOps Engineer",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    experience: "6+ years",
    location: "Dallas, USA",
    status: "Submitted",
    priority: "High",
    score: 70,
    updated: "1d ago",
    availability: "Full-time",
  },
  {
    id: "jane-cooper",
    name: "Jane Cooper",
    role: "Product Manager",
    skills: ["Agile", "Jira", "Confluence", "Roadmapping"],
    experience: "3+ years",
    location: "Vancouver, Canada",
    status: "Open",
    priority: "High",
    score: 85,
    updated: "1d ago",
    availability: "Full-time",
  },
  {
    id: "ralph-edwards",
    name: "Ralph Edwards",
    role: "Backend Developer",
    skills: ["Java", "Spring Boot", "MySQL", "Kafka"],
    experience: "4+ years",
    location: "Seattle, USA",
    status: "Shortlisted",
    priority: "Medium",
    score: 88,
    updated: "2d ago",
    availability: "Available in 30 days",
  },
  {
    id: "arlene-mccoy",
    name: "Arlene McCoy",
    role: "UX Designer",
    skills: ["Figma", "Sketch", "Adobe XD"],
    experience: "2+ years",
    location: "London, UK",
    status: "Open",
    priority: "Medium",
    score: 85,
    updated: "2d ago",
    availability: "Full-time",
  },
  {
    id: "cody-fisher",
    name: "Cody Fisher",
    role: "Machine Learning Engineer",
    skills: ["Python", "PyTorch", "ML", "Deep Learning"],
    experience: "5+ years",
    location: "Boston, USA",
    status: "Interview",
    priority: "Medium",
    score: 90,
    updated: "3d ago",
    availability: "Available in 20 days",
  },
];

/** Resolves the human-facing status + availability text shown on priority cards. */
export function candidateStatusText(c: Candidate): string {
  switch (c.status) {
    case "Open":
      return "Open for opportunities";
    case "Shortlisted":
      return c.availability.startsWith("Available") ? c.availability : "Shortlisted";
    case "Interview":
      return "Interviewing";
    case "Submitted":
      return "Resume Submitted";
    case "Offered":
      return "Offer in progress";
    case "Placed":
      return "Placed";
    case "Rejected":
      return "Rejected";
    default:
      return c.availability;
  }
}

export type Stat = {
  label: string;
  value: string;
  delta: string;
  deltaDirection: "up" | "down";
  tone: "purple" | "blue" | "orange" | "green";
};

export const stats: Stat[] = [
  {
    label: "Total Candidates",
    value: "126",
    delta: "12 this week",
    deltaDirection: "up",
    tone: "purple",
  },
  {
    label: "New This Month",
    value: "32",
    delta: "8 from last month",
    deltaDirection: "up",
    tone: "blue",
  },
  {
    label: "In Process",
    value: "18",
    delta: "2 from last week",
    deltaDirection: "down",
    tone: "orange",
  },
  {
    label: "Placements",
    value: "12",
    delta: "4 this month",
    deltaDirection: "up",
    tone: "green",
  },
];

export type ScheduleItem = {
  time: string;
  title: string;
  subtitle: string;
  action: { label: string; tone: "purple" | "orange" | "blue" };
};

export const todaysSchedule: ScheduleItem[] = [
  {
    time: "10:30 AM",
    title: "Client Call - TechCorp",
    subtitle: "John Smith",
    action: { label: "Call", tone: "purple" },
  },
  {
    time: "01:00 PM",
    title: "Interview - Marvin McKinney",
    subtitle: "Senior Developer Role",
    action: { label: "Interview", tone: "orange" },
  },
  {
    time: "03:30 PM",
    title: "Follow up - 3 Candidates",
    subtitle: "Review resumes",
    action: { label: "Task", tone: "blue" },
  },
];

export type Task = { title: string; due: string };
export const tasks: Task[] = [
  { title: "Follow up with 5 candidates", due: "Due in 2h" },
  { title: "Review 3 resumes", due: "Due in 5h" },
  { title: "Client call with TechCorp", due: "Due tomorrow" },
  { title: "Interview feedback", due: "Due in 2d" },
];

export const pipelineCounts = {
  allCandidates: 126,
  newProfiles: 18,
  shortlisted: 24,
  submitted: 12,
  interview: 8,
  offered: 5,
  placed: 7,
  rejected: 15,
};

export type SavedFilter = { id: string; label: string; count: number };

export const savedFilters: SavedFilter[] = [
  { id: "immediate-joiners", label: "Immediate Joiners", count: 24 },
  { id: "python-developers", label: "Python Developers", count: 18 },
  { id: "us-candidates", label: "US Candidates", count: 32 },
];
