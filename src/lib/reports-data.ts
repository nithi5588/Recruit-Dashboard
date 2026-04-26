export const reportStatCards = [
  { label: "Jobs Added",        value: 24,  change: 20, icon: "briefcase", iconBg: "#FFF6EE", iconColor: "#EA6814" },
  { label: "New Candidates",   value: 126, change: 18, icon: "users",     iconBg: "#FCE9DD", iconColor: "#EA6814" },
  { label: "Applications Sent",value: 56,  change: 25, icon: "plane",     iconBg: "#F4F2EE", iconColor: "#F2B187" },
  { label: "Interviews",       value: 18,  change: 12, icon: "calendar",  iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Offers",           value: 7,   change: 16, icon: "check",     iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Placements",       value: 4,   change: 33, icon: "trophy",    iconBg: "#FFF6EE", iconColor: "#ED8E55" },
];

export const activityData = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  applications: [22, 35, 48, 32, 55, 28, 38],
  interviews:   [8,  12,  6,  8,  10,  5,  4],
  followUps:    [14, 18, 12, 14,  16, 10,  8],
  offers:       [2,   3,  1,  2,   2,  1,  1],
};

export const sourceData = [
  { label: "LinkedIn",        count: 24, pct: 42.9, color: "#EA6814" },
  { label: "Company Careers", count: 12, pct: 21.4, color: "#C75510" },
  { label: "Referral",        count:  8, pct: 14.3, color: "#F2B187" },
  { label: "Naukri",          count:  6, pct: 10.7, color: "#ED8E55" },
  { label: "Indeed",          count:  4, pct:  7.1, color: "#F8D5BD" },
  { label: "Others",          count:  2, pct:  3.6, color: "#9A9183" },
];

export const funnelData = [
  { label: "Profiles Added",    count: 126, color: "#ED8E55" },
  { label: "Applications Sent", count:  56, color: "#ED8E55" },
  { label: "Interviews",        count:  18, color: "#F2B187" },
  { label: "Offers",            count:   7, color: "#C75510" },
  { label: "Placements",        count:   4, color: "#ED8E55" },
];

export const interviewStageData = [
  { label: "Screening Call",    count: 7, pct: 38.9, color: "#ED8E55" },
  { label: "Technical Round",   count: 5, pct: 27.8, color: "#F2B187" },
  { label: "HR Round",          count: 3, pct: 16.7, color: "#C75510" },
  { label: "Managerial Round",  count: 2, pct: 11.1, color: "#ED8E55" },
  { label: "Final Round",       count: 1, pct:  5.5, color: "#F8D5BD" },
];

export const topJobsData = [
  { title: "Product Designer",   applications: 12, color: "#ED8E55", icon: "🎨" },
  { title: "Frontend Developer", applications:  9, color: "#F2B187", icon: "💻" },
  { title: "UX Researcher",      applications:  7, color: "#C75510", icon: "🔍" },
  { title: "Marketing Manager",  applications:  6, color: "#ED8E55", icon: "📢" },
  { title: "Data Analyst",       applications:  5, color: "#F8D5BD", icon: "📊" },
];

export const followUpsData = [
  { label: "Completed", count: 16, pct: 57.1, color: "#C75510" },
  { label: "Pending",   count:  9, pct: 32.1, color: "#ED8E55" },
  { label: "Overdue",   count:  3, pct: 10.8, color: "#9F430D" },
];

export const recentActivities = [
  { name: "Savannah Nguyen",    action: "Interview scheduled", role: "Product Designer",  time: "10:30 AM",     type: "interview",   initials: "SN", color: "#ED8E55" },
  { name: "Ralph Edwards",      action: "Application submitted",role: "Frontend Developer",time: "9:15 AM",     type: "application", initials: "RE", color: "#F2B187" },
  { name: "Dianne Russell",     action: "Follow-up pending",   role: "Marketing Manager", time: "Yesterday",    type: "followup",    initials: "DR", color: "#9A9183" },
  { name: "Cameron Williamson", action: "Offer accepted",      role: "Product Manager",   time: "Yesterday",    type: "offer",       initials: "CW", color: "#C75510" },
  { name: "Esther Howard",      action: "Interview completed", role: "UX Researcher",     time: "May 15, 2024", type: "interview",   initials: "EH", color: "#ED8E55" },
];

export const REPORT_TABS = [
  "Overview", "Jobs", "Candidates", "Interviews",
  "Activities", "Follow-ups", "Team Performance",
] as const;

// ─── Jobs Analytics ───────────────────────────────────────────────────────────

export const jobsStatCards = [
  { label: "Total Jobs",              value: "24",    change: 20, icon: "briefcase", iconBg: "#FCE9DD", iconColor: "#EA6814" },
  { label: "Total Views",             value: "1,348", change: 18, icon: "eye",       iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Total Applications",      value: "256",   change: 25, icon: "cursor",    iconBg: "#F4F2EE", iconColor: "#F2B187" },
  { label: "Avg. Applications / Job", value: "10.7",  change: 12, icon: "trophy",    iconBg: "#FFF6EE", iconColor: "#ED8E55" },
  { label: "Jobs Conversion Rate",    value: "21.4%", change: 14, icon: "percent",   iconBg: "#F8D5BD", iconColor: "#9F430D" },
];

export const applicationsOverTime = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  values: [38, 52, 62, 56, 72, 65, 78],
};

export const jobsByStatus = [
  { label: "Active",  count: 12, pct: 50.0, color: "#EA6814" },
  { label: "Draft",   count:  5, pct: 20.8, color: "#C75510" },
  { label: "On Hold", count:  3, pct: 12.5, color: "#ED8E55" },
  { label: "Closed",  count:  3, pct: 12.5, color: "#F2B187" },
  { label: "Expired", count:  1, pct:  4.2, color: "#9A9183" },
];

export const topPerformingJobs = [
  { title: "Frontend Developer", icon: "💻", applications: 45, conversion: 32.4 },
  { title: "Product Designer",   icon: "🎨", applications: 38, conversion: 28.1 },
  { title: "UX Researcher",      icon: "🔍", applications: 28, conversion: 24.6 },
  { title: "Marketing Manager",  icon: "📢", applications: 22, conversion: 20.7 },
  { title: "Data Analyst",       icon: "📊", applications: 18, conversion: 18.9 },
];

export const jobsApplicationsBySource = [
  { label: "LinkedIn",        count: 96, pct: 37.5, color: "#EA6814" },
  { label: "Company Careers", count: 64, pct: 25.0, color: "#C75510" },
  { label: "Referral",        count: 48, pct: 18.8, color: "#ED8E55" },
  { label: "Naukri",          count: 24, pct:  9.4, color: "#F2B187" },
  { label: "Indeed",          count: 16, pct:  6.3, color: "#9A9183" },
  { label: "Others",          count:  8, pct:  3.1, color: "#9A9183" },
];

export const jobsByDepartment = [
  { label: "Engineering", count: 12, pct: 50.0, color: "#EA6814" },
  { label: "Design",      count:  5, pct: 20.8, color: "#F2B187" },
  { label: "Marketing",   count:  3, pct: 12.5, color: "#ED8E55" },
  { label: "Product",     count:  2, pct:  8.3, color: "#C75510" },
  { label: "Data",        count:  2, pct:  8.3, color: "#9A9183" },
];

export const timeToFill = {
  average: { days: 24, change: -12 },
  median:  { days: 18, change: -18 },
  fastest: { job: "Frontend Developer", days: 12 },
  slowest: { job: "Marketing Manager",  days: 35 },
};

export type JobStatus = "Active" | "Draft" | "On Hold" | "Closed" | "Expired";

export const jobPerformanceRows: Array<{
  title: string; icon: string; views: number; applications: number;
  shortlisted: number; interviews: number; offers: number; hired: number;
  conversion: number; status: JobStatus;
}> = [
  { title: "Frontend Developer", icon: "💻", views: 512, applications: 45, shortlisted: 18, interviews: 8, offers: 3, hired: 2, conversion: 32.4, status: "Active"  },
  { title: "Product Designer",   icon: "🎨", views: 398, applications: 38, shortlisted: 16, interviews: 7, offers: 2, hired: 1, conversion: 28.1, status: "Active"  },
  { title: "UX Researcher",      icon: "🔍", views: 276, applications: 28, shortlisted: 12, interviews: 5, offers: 2, hired: 1, conversion: 24.6, status: "Active"  },
  { title: "Marketing Manager",  icon: "📢", views: 224, applications: 22, shortlisted:  9, interviews: 4, offers: 1, hired: 0, conversion: 20.7, status: "On Hold" },
  { title: "Data Analyst",       icon: "📊", views: 186, applications: 18, shortlisted:  7, interviews: 3, offers: 1, hired: 0, conversion: 18.9, status: "Active"  },
];

export const jobsAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "Frontend Developer jobs are getting 35% more applications",      body: "than your other roles. Consider opening more positions." },
  { tone: "warning",  title: "Marketing Manager has the highest time to fill (35 days).",      body: "Review job description or expand your sourcing." },
  { tone: "info",     title: "LinkedIn is your top source with 37.5% of applications.",        body: "Keep optimizing your LinkedIn job posts." },
  { tone: "positive", title: "Your job conversion rate improved by 14%",                       body: "compared to last week. Great job!" },
];

// ─── Candidates Analytics ─────────────────────────────────────────────────────

export const candidateStatCards = [
  { label: "Total Candidates", value: "126", change: 18, icon: "users",     iconBg: "#FCE9DD", iconColor: "#EA6814" },
  { label: "New This Week",    value: "24",  change: 30, icon: "user-plus", iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Active Candidates",value: "98",  change: 12, icon: "target",    iconBg: "#F4F2EE", iconColor: "#F2B187" },
  { label: "Avg. Match Score", value: "78%", change:  5, icon: "trophy",    iconBg: "#FFF6EE", iconColor: "#ED8E55" },
  { label: "High Priority",    value: "14",  change:  8, icon: "star",      iconBg: "#F8D5BD", iconColor: "#9F430D" },
];

export const candidateGrowthData = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  newCandidates:   [4, 3, 5, 2, 6, 3, 1],
  updatedProfiles: [8, 6, 9, 5, 12, 7, 4],
};

export const candidatesByStage = [
  { label: "New Profiles", count: 18, pct: 19.8, color: "#ED8E55" },
  { label: "Shortlisted",  count: 24, pct: 26.4, color: "#EA6814" },
  { label: "Submitted",    count: 12, pct: 13.2, color: "#F2B187" },
  { label: "Interview",    count:  8, pct:  8.8, color: "#ED8E55" },
  { label: "Offered",      count:  5, pct:  5.5, color: "#9A9183" },
  { label: "Placed",       count:  7, pct:  7.7, color: "#C75510" },
  { label: "Rejected",     count: 15, pct: 16.5, color: "#9A9183" },
];

export const topSkillsInDemand = [
  { skill: "React",      candidates: 42, color: "#EA6814" },
  { skill: "Python",     candidates: 38, color: "#F2B187" },
  { skill: "TypeScript", candidates: 32, color: "#C75510" },
  { skill: "Node.js",    candidates: 28, color: "#ED8E55" },
  { skill: "AWS",        candidates: 24, color: "#9A9183" },
];

export const experienceDistribution = [
  { bucket: "0–2 yrs",  count: 18, color: "#F8D5BD" },
  { bucket: "3–5 yrs",  count: 42, color: "#ED8E55" },
  { bucket: "6–8 yrs",  count: 31, color: "#EA6814" },
  { bucket: "9–12 yrs", count: 22, color: "#EA6814" },
  { bucket: "13+ yrs",  count: 13, color: "#C75510" },
];

export const candidatesByLocation = [
  { label: "New York",      count: 34, pct: 27.0, color: "#EA6814" },
  { label: "San Francisco", count: 28, pct: 22.2, color: "#F2B187" },
  { label: "Remote",        count: 24, pct: 19.1, color: "#C75510" },
  { label: "Austin",        count: 18, pct: 14.3, color: "#ED8E55" },
  { label: "Chicago",       count: 12, pct:  9.5, color: "#9A9183" },
  { label: "Others",        count: 10, pct:  7.9, color: "#9A9183" },
];

export const availabilityDistribution = [
  { label: "Immediate",   count: 38, pct: 30.2, color: "#C75510" },
  { label: "2 Weeks",     count: 42, pct: 33.3, color: "#EA6814" },
  { label: "1 Month",     count: 28, pct: 22.2, color: "#ED8E55" },
  { label: "2+ Months",   count: 18, pct: 14.3, color: "#9A9183" },
];

export const recruiterPerformance = [
  { name: "Emma Rodriguez", initials: "ER", color: "#ED8E55", candidates: 32, submissions: 18, interviews: 8, placements: 3, conversion:  9.4 },
  { name: "Liam Chen",      initials: "LC", color: "#F2B187", candidates: 28, submissions: 15, interviews: 6, placements: 2, conversion:  7.1 },
  { name: "Sophia Patel",   initials: "SP", color: "#C75510", candidates: 26, submissions: 14, interviews: 7, placements: 4, conversion: 15.4 },
  { name: "Noah Kim",       initials: "NK", color: "#ED8E55", candidates: 22, submissions: 12, interviews: 5, placements: 1, conversion:  4.5 },
  { name: "Olivia Brown",   initials: "OB", color: "#9A9183", candidates: 18, submissions: 10, interviews: 4, placements: 2, conversion: 11.1 },
];

export const candidateAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "React candidates show 42% higher match rates",                 body: "than other skill groups. Prioritize React-focused JDs this week." },
  { tone: "warning",  title: "14 high-priority candidates haven't been contacted in 7+ days.", body: "Assign recruiter follow-ups to prevent drop-off." },
  { tone: "info",     title: "Sophia Patel leads with a 15.4% placement rate.",              body: "Share her submission playbook with the team." },
  { tone: "positive", title: "Your candidate pool grew 18% this week",                       body: "— strong sourcing momentum. Keep the pace." },
];

// ─── Interviews Analytics ─────────────────────────────────────────────────────

export const interviewStatCards = [
  { label: "Total Interviews",      value: "42",  change:  18, icon: "calendar", iconBg: "#FCE9DD", iconColor: "#EA6814", positive: true  },
  { label: "Scheduled",             value: "18",  change:  12, icon: "clock",    iconBg: "#F4F2EE", iconColor: "#F2B187", positive: true  },
  { label: "Completed",             value: "22",  change:  25, icon: "check",    iconBg: "#FCE9DD", iconColor: "#C75510", positive: true  },
  { label: "No-Shows",              value: "2",   change: -50, icon: "x",        iconBg: "#F8D5BD", iconColor: "#9F430D", positive: true  },
  { label: "Interview → Offer Rate",value: "28%", change:   8, icon: "trophy",   iconBg: "#FFF6EE", iconColor: "#ED8E55", positive: true  },
];

export const interviewsOverTime = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  scheduled: [6, 8, 4, 7, 5, 3, 9],
  completed: [4, 6, 5, 5, 8, 4, 6],
};

export const interviewsByRound = [
  { label: "Screening Call",    count: 14, pct: 33.3, color: "#ED8E55" },
  { label: "Technical Round",   count: 12, pct: 28.6, color: "#EA6814" },
  { label: "HR Round",          count:  8, pct: 19.0, color: "#F2B187" },
  { label: "Managerial Round",  count:  5, pct: 11.9, color: "#ED8E55" },
  { label: "Final Round",       count:  3, pct:  7.1, color: "#C75510" },
];

export const topInterviewers = [
  { name: "Priya Shah",      initials: "PS", color: "#ED8E55", interviews: 12, rating: 4.8 },
  { name: "Marcus Johnson",  initials: "MJ", color: "#F2B187", interviews: 10, rating: 4.6 },
  { name: "Aisha Khan",      initials: "AK", color: "#C75510", interviews:  8, rating: 4.7 },
  { name: "Daniel Martinez", initials: "DM", color: "#ED8E55", interviews:  7, rating: 4.5 },
  { name: "Rachel O'Brien",  initials: "RO", color: "#9A9183", interviews:  5, rating: 4.9 },
];

export const interviewOutcomes = [
  { label: "Passed",      count: 16, pct: 38.1, color: "#C75510" },
  { label: "Failed",      count:  6, pct: 14.3, color: "#9F430D" },
  { label: "No-Show",     count:  2, pct:  4.8, color: "#9A9183" },
  { label: "Rescheduled", count:  4, pct:  9.5, color: "#ED8E55" },
  { label: "Pending",     count: 14, pct: 33.3, color: "#F2B187" },
];

export const avgTimePerStage = [
  { label: "Screening → Technical", days: 3.2, color: "#EA6814" },
  { label: "Technical → HR",        days: 4.5, color: "#F2B187" },
  { label: "HR → Managerial",       days: 2.8, color: "#C75510" },
  { label: "Managerial → Final",    days: 3.5, color: "#ED8E55" },
  { label: "Final → Offer",         days: 2.1, color: "#9A9183" },
];

export const upcomingInterviews = [
  { name: "Savannah Nguyen",    role: "Product Designer",   stage: "Technical",  time: "Today, 2:30 PM",  color: "#ED8E55", initials: "SN" },
  { name: "Ralph Edwards",      role: "Frontend Dev",       stage: "Screening",  time: "Today, 4:00 PM",  color: "#F2B187", initials: "RE" },
  { name: "Dianne Russell",     role: "Marketing Manager",  stage: "Final",      time: "Tomorrow, 10 AM", color: "#9A9183", initials: "DR" },
  { name: "Cameron Williamson", role: "Product Manager",    stage: "HR",         time: "Tomorrow, 3 PM",  color: "#C75510", initials: "CW" },
  { name: "Esther Howard",      role: "UX Researcher",      stage: "Managerial", time: "May 20, 11 AM",   color: "#ED8E55", initials: "EH" },
];

export const interviewByJobRows = [
  { title: "Frontend Developer", icon: "💻", scheduled: 12, completed: 10, passed: 7, offers: 3, rate: 25.0 },
  { title: "Product Designer",   icon: "🎨", scheduled:  9, completed:  8, passed: 5, offers: 2, rate: 22.2 },
  { title: "UX Researcher",      icon: "🔍", scheduled:  7, completed:  6, passed: 4, offers: 2, rate: 28.6 },
  { title: "Marketing Manager",  icon: "📢", scheduled:  5, completed:  4, passed: 2, offers: 1, rate: 20.0 },
  { title: "Data Analyst",       icon: "📊", scheduled:  4, completed:  3, passed: 2, offers: 1, rate: 25.0 },
];

export const interviewAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "Technical rounds have 82% pass rate",             body: "up 14% vs last month. Your screening calls are well-calibrated." },
  { tone: "warning",  title: "Marketing Manager saw 2 no-shows this week",      body: "Consider sending reminder calls 24 hours before interviews." },
  { tone: "info",     title: "Priya Shah is your top interviewer (4.8 rating)", body: "Consider scheduling her for key roles more often." },
  { tone: "positive", title: "Interview → offer rate improved to 28%",          body: "from 20% last period — the team is making better fit decisions." },
];

// ─── Activities Analytics ─────────────────────────────────────────────────────

export const activityStatCards = [
  { label: "Total Activities",  value: "342",  change: 22,  icon: "activity", iconBg: "#FCE9DD", iconColor: "#EA6814" },
  { label: "Daily Average",     value: "49",   change: 18,  icon: "calendar", iconBg: "#F4F2EE", iconColor: "#F2B187" },
  { label: "Response Rate",     value: "87%",  change:  5,  icon: "check",    iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Active Recruiters", value: "6",    change:  0,  icon: "users",    iconBg: "#FFF6EE", iconColor: "#ED8E55" },
  { label: "Peak Hour",         value: "2 PM", change: null, icon: "clock",    iconBg: "#F8D5BD", iconColor: "#9F430D", subtitle: "Most activity logged" },
] as const;

// 7 rows (Mon–Sun) × 24 hours — values 0–5 (intensity buckets)
export const activityHeatmap: {
  days: readonly string[];
  hours: readonly string[];
  grid: number[][];
} = {
  days:  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  hours: ["12a","1","2","3","4","5","6","7","8","9","10","11","12p","1","2","3","4","5","6","7","8","9","10","11"],
  grid: [
    [0,0,0,0,0,0,1,2,3,4,4,4,3,4,5,5,4,3,2,1,1,0,0,0], // Mon
    [0,0,0,0,0,0,1,2,4,4,5,5,4,5,5,4,4,3,2,1,0,0,0,0], // Tue
    [0,0,0,0,0,0,1,2,3,4,5,5,4,5,5,5,4,3,2,1,1,0,0,0], // Wed
    [0,0,0,0,0,0,1,3,4,5,5,5,4,5,5,5,4,4,3,2,1,0,0,0], // Thu (busiest)
    [0,0,0,0,0,0,0,1,2,3,4,4,3,4,4,3,3,2,2,1,1,0,0,0], // Fri
    [0,0,0,0,0,0,0,0,1,1,2,2,1,2,1,1,1,0,0,0,0,0,0,0], // Sat
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0], // Sun
  ],
};

export const activityTypeBreakdown = [
  { label: "Emails",       count: 98, pct: 28.7, color: "#EA6814" },
  { label: "Calls",        count: 82, pct: 24.0, color: "#F2B187" },
  { label: "Applications", count: 56, pct: 16.4, color: "#C75510" },
  { label: "Interviews",   count: 42, pct: 12.3, color: "#ED8E55" },
  { label: "Notes",        count: 38, pct: 11.1, color: "#9A9183" },
  { label: "Follow-ups",   count: 26, pct:  7.6, color: "#9A9183" },
];

export const activityVolumeOverTime = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  total:     [48, 55, 42, 68, 52, 38, 39],
  responses: [32, 40, 28, 54, 42, 28, 26],
};

export const activitiesByRecruiter = [
  { name: "Sophia Patel",    initials: "SP", color: "#ED8E55", count: 72 },
  { name: "Emma Rodriguez",  initials: "ER", color: "#F2B187", count: 65 },
  { name: "Liam Chen",       initials: "LC", color: "#C75510", count: 58 },
  { name: "Olivia Brown",    initials: "OB", color: "#ED8E55", count: 54 },
  { name: "Noah Kim",        initials: "NK", color: "#9A9183", count: 48 },
  { name: "Aarav Mehta",     initials: "AM", color: "#F8D5BD", count: 45 },
];

// 24 hours of day — relative activity volume
export const peakHours = [
  2, 1, 0, 0, 0, 0, 2, 6, 12, 22, 34, 38, 24, 32, 42, 40, 34, 22, 14, 8, 6, 4, 3, 2,
];

export type ActivityFeedItem = {
  id: string;
  group: "Today" | "Yesterday" | "Earlier This Week";
  type: "call" | "email" | "interview" | "application" | "note" | "followup" | "offer";
  actor: { name: string; initials: string; color: string };
  title: string;
  subject: string;
  time: string;
};

export const activityFeed: ActivityFeedItem[] = [
  { id: "1",  group: "Today",     type: "call",        actor: { name: "Sophia Patel",   initials: "SP", color: "#ED8E55" }, title: "Called Savannah Nguyen", subject: "Product Designer role · 12 min", time: "2:30 PM" },
  { id: "2",  group: "Today",     type: "interview",   actor: { name: "Priya Shah",     initials: "PS", color: "#EA6814" }, title: "Technical round scheduled", subject: "Ralph Edwards · Frontend Developer", time: "1:12 PM" },
  { id: "3",  group: "Today",     type: "email",       actor: { name: "Emma Rodriguez", initials: "ER", color: "#F2B187" }, title: "Sent offer letter",    subject: "Cameron Williamson · Product Manager", time: "11:40 AM" },
  { id: "4",  group: "Today",     type: "application", actor: { name: "Liam Chen",      initials: "LC", color: "#C75510" }, title: "Submitted profile",    subject: "Dianne Russell → Acme Corp", time: "9:58 AM" },
  { id: "5",  group: "Yesterday", type: "followup",    actor: { name: "Olivia Brown",   initials: "OB", color: "#ED8E55" }, title: "Follow-up logged",     subject: "Esther Howard · UX Researcher", time: "5:20 PM" },
  { id: "6",  group: "Yesterday", type: "note",        actor: { name: "Sophia Patel",   initials: "SP", color: "#ED8E55" }, title: "Added candidate note", subject: "Priority flagged: ‘Strong React fit’", time: "3:04 PM" },
  { id: "7",  group: "Yesterday", type: "offer",       actor: { name: "Emma Rodriguez", initials: "ER", color: "#F2B187" }, title: "Offer accepted",       subject: "Cameron Williamson · Product Manager", time: "10:11 AM" },
  { id: "8",  group: "Earlier This Week", type: "call",      actor: { name: "Noah Kim",     initials: "NK", color: "#9A9183" }, title: "Screening call completed", subject: "Ralph Edwards · 22 min", time: "May 16, 4:45 PM" },
  { id: "9",  group: "Earlier This Week", type: "interview", actor: { name: "Aisha Khan",   initials: "AK", color: "#C75510" }, title: "HR round completed",       subject: "Savannah Nguyen · Product Designer", time: "May 16, 2:30 PM" },
  { id: "10", group: "Earlier This Week", type: "email",     actor: { name: "Aarav Mehta",  initials: "AM", color: "#F8D5BD" }, title: "Nurture campaign sent",    subject: "12 candidates · React pool", time: "May 15, 9:00 AM" },
];

export const activityAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "Thursday is your highest-activity day",     body: "With 68 activities logged. Consider reserving it for key interviews." },
  { tone: "info",     title: "2–4 PM is your team's peak window",          body: "44% of daily activity happens here. Schedule important calls in this slot." },
  { tone: "warning",  title: "Weekend activity is near zero",              body: "If you run weekend drives, reach out Mon morning to maximize response." },
  { tone: "positive", title: "Response rate improved to 87%",              body: "from 82% last week — your outreach cadence is working." },
];

// ─── Follow-ups Analytics ─────────────────────────────────────────────────────

export const followupStatCards = [
  { label: "Total Follow-ups",    value: "86",   change:  14, icon: "list",   iconBg: "#FCE9DD", iconColor: "#EA6814", positive: true  },
  { label: "Completed",           value: "58",   change:  22, icon: "check",  iconBg: "#FCE9DD", iconColor: "#C75510", positive: true  },
  { label: "Pending",             value: "21",   change:  -8, icon: "clock",  iconBg: "#F4F2EE", iconColor: "#F2B187", positive: true  },
  { label: "Overdue",             value: "7",    change: -30, icon: "alert",  iconBg: "#F8D5BD", iconColor: "#9F430D", positive: true  },
  { label: "Avg. Response Time",  value: "4.2h", change: -18, icon: "bolt",   iconBg: "#FFF6EE", iconColor: "#ED8E55", positive: true  },
];

export const followupTrend = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  completed: [6, 9, 7, 12, 10, 8, 6],
  pending:   [4, 3, 5, 2, 3, 2, 2],
};

export const followupStatusDonut = [
  { label: "Completed", count: 58, pct: 67.4, color: "#C75510" },
  { label: "Pending",   count: 21, pct: 24.4, color: "#ED8E55" },
  { label: "Overdue",   count:  7, pct:  8.2, color: "#9F430D" },
];

// Stacked horizontal bar — priority distribution
export const followupPriority = [
  { label: "High",   count: 18, pct: 20.9, color: "#9F430D" },
  { label: "Medium", count: 42, pct: 48.8, color: "#ED8E55" },
  { label: "Low",    count: 26, pct: 30.3, color: "#C75510" },
];

export const followupByChannel = [
  { label: "Phone Call", count: 32, color: "#EA6814" },
  { label: "Email",      count: 28, color: "#F2B187" },
  { label: "LinkedIn",   count: 15, color: "#C75510" },
  { label: "SMS",        count:  8, color: "#ED8E55" },
  { label: "In-person",  count:  3, color: "#9A9183" },
];

export const responseTimeByChannel = [
  { label: "Phone Call", hours: 1.2, color: "#C75510" },
  { label: "SMS",        hours: 2.4, color: "#EA6814" },
  { label: "Email",      hours: 6.8, color: "#F2B187" },
  { label: "LinkedIn",   hours: 8.5, color: "#ED8E55" },
];

export type FollowupPriority = "High" | "Medium" | "Low";
export type FollowupChannel = "Call" | "Email" | "LinkedIn" | "SMS";

export const upcomingFollowups: Array<{
  candidate: string; initials: string; color: string; role: string;
  due: string; priority: FollowupPriority; channel: FollowupChannel;
  assigned: string; overdue?: boolean;
}> = [
  { candidate: "Ralph Edwards",      initials: "RE", color: "#F2B187", role: "Frontend Developer", due: "Today, 3:00 PM",     priority: "High",   channel: "Call",     assigned: "Sophia P" },
  { candidate: "Dianne Russell",     initials: "DR", color: "#9A9183", role: "Marketing Manager",  due: "Today, 5:00 PM",     priority: "High",   channel: "Email",    assigned: "Emma R" },
  { candidate: "Savannah Nguyen",    initials: "SN", color: "#ED8E55", role: "Product Designer",   due: "Tomorrow, 10:00 AM", priority: "Medium", channel: "Call",     assigned: "Liam C" },
  { candidate: "Cameron Williamson", initials: "CW", color: "#C75510", role: "Product Manager",    due: "Tomorrow, 2:00 PM",  priority: "Medium", channel: "LinkedIn", assigned: "Olivia B" },
  { candidate: "Esther Howard",      initials: "EH", color: "#ED8E55", role: "UX Researcher",      due: "May 20, 11:00 AM",   priority: "Low",    channel: "Email",    assigned: "Noah K" },
  { candidate: "Marcus Lee",         initials: "ML", color: "#F8D5BD", role: "Data Analyst",       due: "Yesterday, 4:00 PM", priority: "High",   channel: "Call",     assigned: "Sophia P", overdue: true },
  { candidate: "Priya Sharma",       initials: "PS", color: "#EA6814", role: "DevOps Engineer",    due: "2 days ago",         priority: "Medium", channel: "SMS",      assigned: "Aarav M", overdue: true },
];

export const followupAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "Phone calls respond 5× faster than email", body: "Use calls for high-priority outreach — avg 1.2h response." },
  { tone: "warning",  title: "7 overdue follow-ups — 4 are high priority", body: "Assign them today to prevent candidate drop-off." },
  { tone: "info",     title: "Completion rate is trending up",              body: "67% completed this week — a 9pt lift vs last week." },
  { tone: "positive", title: "Avg. response time dropped to 4.2h",          body: "from 5.1h — the team is getting sharper." },
];

// ─── Team Performance Analytics ───────────────────────────────────────────────

export const teamStatCards = [
  { label: "Team Size",          value: "6",     change: null, icon: "team",   iconBg: "#FCE9DD", iconColor: "#EA6814", subtitle: "6 active recruiters" },
  { label: "Total Placements",   value: "12",    change:  20,  icon: "trophy", iconBg: "#FFF6EE", iconColor: "#ED8E55" },
  { label: "Avg. Conversion",    value: "12.4%", change:   8,  icon: "target", iconBg: "#F4F2EE", iconColor: "#F2B187" },
  { label: "Team Utilization",   value: "84%",   change:   6,  icon: "bolt",   iconBg: "#FCE9DD", iconColor: "#C75510" },
  { label: "Avg. Rating",        value: "4.7",   change: null, icon: "star",   iconBg: "#F8D5BD", iconColor: "#9F430D", subtitle: "Out of 5.0 across 42 reviews" },
] as const;

export const topRecruiter = {
  name: "Sophia Patel",
  initials: "SP",
  role: "Senior Recruiter",
  tenure: "3 yrs",
  color: "#ED8E55",
  placements: 4,
  conversion: 15.4,
  activities: 72,
  rating: 4.9,
};

export const teamLeaderboard = [
  { rank: 1, name: "Sophia Patel",    initials: "SP", color: "#ED8E55", placements: 4, score: 94, trend: 2  },
  { rank: 2, name: "Emma Rodriguez",  initials: "ER", color: "#F2B187", placements: 3, score: 88, trend: 0  },
  { rank: 3, name: "Liam Chen",       initials: "LC", color: "#C75510", placements: 2, score: 82, trend: 1  },
  { rank: 4, name: "Olivia Brown",    initials: "OB", color: "#ED8E55", placements: 2, score: 76, trend: -1 },
  { rank: 5, name: "Noah Kim",        initials: "NK", color: "#9A9183", placements: 1, score: 68, trend: 0  },
  { rank: 6, name: "Aarav Mehta",     initials: "AM", color: "#F8D5BD", placements: 0, score: 54, trend: 0  },
];

export const teamTrend = {
  labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
  placements: [1, 0, 2, 1, 3, 2, 3],
  offers:     [2, 1, 3, 2, 4, 3, 4],
};

export const recruiterGoals = [
  { name: "Sophia Patel",   initials: "SP", color: "#ED8E55", target: 5, actual: 4 },
  { name: "Emma Rodriguez", initials: "ER", color: "#F2B187", target: 4, actual: 3 },
  { name: "Liam Chen",      initials: "LC", color: "#C75510", target: 4, actual: 2 },
  { name: "Olivia Brown",   initials: "OB", color: "#ED8E55", target: 3, actual: 2 },
  { name: "Noah Kim",       initials: "NK", color: "#9A9183", target: 3, actual: 1 },
];

// Activity mix per recruiter — stacked horizontal bars
export const recruiterActivityMix = [
  { name: "Sophia Patel",   initials: "SP", calls: 32, emails: 42, meetings: 18 },
  { name: "Emma Rodriguez", initials: "ER", calls: 28, emails: 38, meetings: 15 },
  { name: "Liam Chen",      initials: "LC", calls: 24, emails: 32, meetings: 12 },
  { name: "Olivia Brown",   initials: "OB", calls: 22, emails: 28, meetings: 10 },
  { name: "Noah Kim",       initials: "NK", calls: 18, emails: 24, meetings:  8 },
  { name: "Aarav Mehta",    initials: "AM", calls: 16, emails: 22, meetings:  7 },
];

export const teamMatrix: Array<{
  name: string; initials: string; color: string;
  candidates: number; submissions: number; interviews: number;
  offers: number; placements: number; conversion: number;
  rating: number; trend: "up" | "down" | "flat";
}> = [
  { name: "Sophia Patel",    initials: "SP", color: "#ED8E55", candidates: 26, submissions: 14, interviews: 7, offers: 5, placements: 4, conversion: 15.4, rating: 4.9, trend: "up"   },
  { name: "Emma Rodriguez",  initials: "ER", color: "#F2B187", candidates: 32, submissions: 18, interviews: 8, offers: 4, placements: 3, conversion:  9.4, rating: 4.7, trend: "up"   },
  { name: "Liam Chen",       initials: "LC", color: "#C75510", candidates: 28, submissions: 15, interviews: 6, offers: 3, placements: 2, conversion:  7.1, rating: 4.6, trend: "up"   },
  { name: "Olivia Brown",    initials: "OB", color: "#ED8E55", candidates: 18, submissions: 10, interviews: 4, offers: 3, placements: 2, conversion: 11.1, rating: 4.5, trend: "down" },
  { name: "Noah Kim",        initials: "NK", color: "#9A9183", candidates: 22, submissions: 12, interviews: 5, offers: 2, placements: 1, conversion:  4.5, rating: 4.4, trend: "flat" },
  { name: "Aarav Mehta",     initials: "AM", color: "#F8D5BD", candidates: 16, submissions:  8, interviews: 3, offers: 1, placements: 0, conversion:  0.0, rating: 4.3, trend: "flat" },
];

export const teamAiInsights: Array<{ tone: "positive" | "warning" | "info"; title: string; body: string }> = [
  { tone: "positive", title: "Sophia Patel leads with 15.4% conversion",    body: "nearly 2× the team average. Share her submission playbook in the next huddle." },
  { tone: "warning",  title: "Aarav Mehta has 0 placements this period",    body: "Pair with a senior recruiter for 2 weeks to accelerate ramp." },
  { tone: "info",     title: "Emma R. has the highest candidate volume",    body: "but a lower conversion. Consider quality-vs-quantity balance." },
  { tone: "positive", title: "Team placements up 20% vs last period",       body: "Strong momentum — celebrate in Friday's team review." },
];

// ─── Sparkline arrays (per KPI card, indexed by stat-card order) ──────────────

export const sparklines = {
  // Overview
  overview: [
    [3, 4, 3, 5, 4, 6, 5],            // Jobs Added
    [14, 18, 16, 22, 19, 24, 21],     // New Candidates
    [22, 35, 48, 32, 55, 28, 38],     // Applications
    [8, 12, 6, 8, 10, 5, 4],          // Interviews
    [2, 3, 1, 2, 2, 1, 1],            // Offers
    [0, 1, 0, 1, 1, 0, 1],            // Placements
  ],
  // Jobs: Total Jobs, Total Views, Apps, Avg/Job, Conv Rate
  jobs: [
    [18, 20, 21, 22, 23, 24, 24],
    [160, 180, 195, 210, 220, 240, 253],
    [22, 35, 48, 32, 55, 28, 38],
    [8.2, 8.8, 9.3, 9.8, 10.1, 10.5, 10.7],
    [18.2, 19.1, 19.8, 20.2, 20.8, 21.1, 21.4],
  ],
  // Candidates
  candidates: [
    [112, 115, 118, 120, 122, 124, 126],
    [14, 16, 18, 20, 22, 23, 24],
    [88, 90, 92, 94, 95, 97, 98],
    [72, 74, 75, 76, 77, 77, 78],
    [11, 12, 12, 13, 13, 14, 14],
  ],
  // Interviews
  interviews: [
    [28, 32, 35, 38, 40, 41, 42],
    [14, 15, 16, 17, 18, 18, 18],
    [12, 14, 16, 18, 20, 21, 22],
    [6, 5, 4, 4, 3, 2, 2],
    [22, 24, 25, 26, 27, 28, 28],
  ],
};

// ─── Overview — Recruitment Pulse ─────────────────────────────────────────────

export const recruitmentPulse = {
  score: 84,
  lastScore: 75,
  delta: 9,
  narrative: [
    { icon: "🚀", label: "Applications sent",    value: "56",  change: 25, color: "#EA6814" },
    { icon: "📅", label: "Interviews scheduled", value: "18",  change: 12, color: "#F2B187" },
    { icon: "🎯", label: "Offers accepted",      value: "7",   change: 16, color: "#ED8E55" },
    { icon: "🏆", label: "Placements made",      value: "4",   change: 33, color: "#C75510" },
  ],
  pulseTrend: [68, 72, 70, 75, 78, 82, 84],
};

// ─── Jobs — Top Job Spotlight + Pipeline Flow ─────────────────────────────────

export const topJobSpotlight = {
  title: "Frontend Developer",
  icon: "💻",
  department: "Engineering",
  location: "Remote · US",
  posted: "14 days ago",
  views: 512,
  applications: 45,
  shortlisted: 18,
  interviews: 8,
  offers: 3,
  hired: 2,
  conversionRate: 32.4,
  healthScore: 92,
};

export const jobPipelineFlow = [
  { title: "Frontend Developer", icon: "💻", stages: [512, 45, 18, 8, 3, 2], color: "#EA6814" },
  { title: "Product Designer",   icon: "🎨", stages: [398, 38, 16, 7, 2, 1], color: "#F2B187" },
  { title: "UX Researcher",      icon: "🔍", stages: [276, 28, 12, 5, 2, 1], color: "#C75510" },
  { title: "Marketing Manager",  icon: "📢", stages: [224, 22,  9, 4, 1, 0], color: "#ED8E55" },
  { title: "Data Analyst",       icon: "📊", stages: [186, 18,  7, 3, 1, 0], color: "#9A9183" },
];

export const pipelineStageLabels = ["Views", "Apps", "Shortlisted", "Interviews", "Offers", "Hired"] as const;

// ─── Candidates — Spotlight + Skills Cloud ────────────────────────────────────

export const candidateSpotlight = {
  name: "Savannah Nguyen",
  initials: "SN",
  role: "Senior Product Designer",
  location: "New York, NY",
  experience: "8 yrs",
  availability: "Immediate",
  rate: "$140k",
  matchScore: 94,
  skills: ["Figma", "Design Systems", "Prototyping", "User Research", "React"],
  highlights: [
    { icon: "⚡", text: "Top 1% match this week" },
    { icon: "✨", text: "3 active recruiters shortlisted" },
    { icon: "🎯", text: "Available immediately" },
  ],
};

export const skillsCloud = [
  { skill: "React",         count: 42, size: 1.0 },
  { skill: "Python",        count: 38, size: 0.92 },
  { skill: "TypeScript",    count: 32, size: 0.82 },
  { skill: "Node.js",       count: 28, size: 0.74 },
  { skill: "AWS",           count: 24, size: 0.68 },
  { skill: "SQL",           count: 22, size: 0.64 },
  { skill: "Figma",         count: 20, size: 0.60 },
  { skill: "Docker",        count: 18, size: 0.56 },
  { skill: "Go",            count: 14, size: 0.50 },
  { skill: "Kubernetes",    count: 12, size: 0.46 },
  { skill: "GraphQL",       count: 10, size: 0.44 },
  { skill: "Rust",          count:  8, size: 0.40 },
  { skill: "Swift",         count:  6, size: 0.36 },
  { skill: "ML",            count: 15, size: 0.52 },
  { skill: "Design Systems",count: 17, size: 0.54 },
];

// ─── Interviews — Today's Schedule ────────────────────────────────────────────

export type InterviewSlot = {
  id: string;
  hourStart: number;   // 0–24 decimal (e.g., 9.5 for 9:30 AM)
  duration: number;    // minutes
  candidate: { name: string; initials: string; color: string };
  role: string;
  stage: "Screening" | "Technical" | "HR" | "Managerial" | "Final";
  interviewer: string;
};

export const todaySchedule: InterviewSlot[] = [
  { id: "i1", hourStart:  9.5, duration: 45, candidate: { name: "Ralph Edwards",    initials: "RE", color: "#F2B187" }, role: "Frontend Developer", stage: "Screening",  interviewer: "Sophia P" },
  { id: "i2", hourStart: 10.5, duration: 60, candidate: { name: "Savannah Nguyen", initials: "SN", color: "#ED8E55" }, role: "Product Designer",   stage: "Technical",  interviewer: "Priya S"  },
  { id: "i3", hourStart: 13.0, duration: 45, candidate: { name: "Cameron Williamson", initials: "CW", color: "#C75510" }, role: "Product Manager",  stage: "HR",         interviewer: "Marcus J" },
  { id: "i4", hourStart: 14.0, duration: 60, candidate: { name: "Dianne Russell",  initials: "DR", color: "#9A9183" }, role: "Marketing Manager",  stage: "Final",      interviewer: "Aisha K"  },
  { id: "i5", hourStart: 15.5, duration: 45, candidate: { name: "Esther Howard",   initials: "EH", color: "#ED8E55" }, role: "UX Researcher",      stage: "Managerial", interviewer: "Rachel O" },
  { id: "i6", hourStart: 16.5, duration: 30, candidate: { name: "Marcus Lee",      initials: "ML", color: "#F8D5BD" }, role: "Data Analyst",       stage: "Screening",  interviewer: "Daniel M" },
];

export const scheduleHourRange = { start: 9, end: 18 }; // 9 AM – 6 PM
export const interviewPassRate = { value: 78, delta: 6, passed: 16, total: 22 };

