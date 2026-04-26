export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export type JobStatus = "Open" | "Closed" | "Paused";

export type JobLogo = { abbr: string; bg: string; fg: string };

export type Job = {
  id: string;
  title: string;
  company: string;
  logo: JobLogo;
  location: string;
  jobType: JobType;
  category: string;
  tags: string[];
  source: string;
  sourceUrl: string;
  postedAgo: string;
  saved?: boolean;
  status?: JobStatus;
  companyVerified?: boolean;
  description?: string;
  department?: string;
  experience?: string;
  salary?: string;
  remote?: string;
  jobId?: string;
  industries?: string[];
};

export const jobs: Job[] = [
  {
    id: "shopify-sr-product-designer",
    title: "Senior Product Designer",
    company: "Shopify",
    logo: { abbr: "S", bg: "#FCE9DD", fg: "#9F430D" },
    location: "Toronto, Canada",
    jobType: "Full-time",
    category: "Design",
    tags: [
      "Figma",
      "UI/UX",
      "Design Systems",
      "Prototyping",
      "Interaction Design",
      "Figma Libraries",
    ],
    source: "Shopify Careers",
    sourceUrl: "https://shopify.com/careers",
    postedAgo: "2 days ago",
    status: "Open",
    companyVerified: true,
    description:
      "We’re looking for a Senior Product Designer to craft intuitive and delightful experiences for millions of merchants worldwide. You’ll work closely with product managers, engineers, and fellow designers to solve complex problems and ship meaningful products.",
    department: "Design",
    experience: "5+ years",
    salary: "CAD 110K – 150K / year",
    remote: "Not specified",
    industries: ["E-commerce", "SaaS"],
  },
  {
    id: "linear-product-manager",
    title: "Product Manager",
    company: "Linear",
    logo: { abbr: "L", bg: "#2A241B", fg: "#FFFFFF" },
    location: "San Francisco, CA, US",
    jobType: "Full-time",
    category: "Product",
    tags: [
      "Product Strategy",
      "Roadmapping",
      "Analytics",
      "Agile",
      "Product Management",
      "Data-Driven",
    ],
    source: "LinkedIn Jobs",
    sourceUrl: "https://linkedin.com/jobs",
    postedAgo: "3 days ago",
  },
  {
    id: "google-ux-researcher",
    title: "UX Researcher",
    company: "Google",
    logo: { abbr: "G", bg: "#FFF6EE", fg: "#9F430D" },
    location: "New York, NY, US",
    jobType: "Full-time",
    category: "Research",
    tags: [
      "User Research",
      "Usability Testing",
      "Data Analysis",
      "Figma",
      "Interview Facilitation",
      "Prototyping",
    ],
    source: "Google Careers",
    sourceUrl: "https://careers.google.com",
    postedAgo: "5 days ago",
  },
  {
    id: "atlassian-frontend-dev",
    title: "Frontend Developer",
    company: "Atlassian",
    logo: { abbr: "A", bg: "#F4F2EE", fg: "#6B6358" },
    location: "Remote",
    jobType: "Full-time",
    category: "Engineering",
    tags: [
      "React",
      "TypeScript",
      "JavaScript",
      "CSS",
      "Webpack",
      "Redux",
    ],
    source: "LinkedIn Jobs",
    sourceUrl: "https://linkedin.com/jobs",
    postedAgo: "1 week ago",
  },
  {
    id: "notion-growth-marketing",
    title: "Growth Marketing Manager",
    company: "Notion",
    logo: { abbr: "N", bg: "#F4F2EE", fg: "#1F1B17" },
    location: "San Francisco, CA, US",
    jobType: "Full-time",
    category: "Marketing",
    tags: [
      "Growth Marketing",
      "SEO",
      "Analytics",
      "A/B Testing",
      "Marketing Automation",
      "Retention",
    ],
    source: "Notion Careers",
    sourceUrl: "https://notion.so/careers",
    postedAgo: "1 week ago",
  },
  {
    id: "figma-design-engineer",
    title: "Design Engineer",
    company: "Figma",
    logo: { abbr: "F", bg: "#FCE9DD", fg: "#9F430D" },
    location: "Remote",
    jobType: "Contract",
    category: "Engineering",
    tags: [
      "React",
      "TypeScript",
      "Design Systems",
      "Animation",
      "Accessibility",
      "Storybook",
    ],
    source: "Figma Careers",
    sourceUrl: "https://figma.com/careers",
    postedAgo: "2 weeks ago",
  },
  {
    id: "stripe-data-analyst",
    title: "Data Analyst",
    company: "Stripe",
    logo: { abbr: "St", bg: "#FCE9DD", fg: "#9F430D" },
    location: "Dublin, Ireland",
    jobType: "Full-time",
    category: "Data",
    tags: [
      "SQL",
      "Python",
      "Looker",
      "Analytics",
      "Experimentation",
      "Statistics",
    ],
    source: "Stripe Careers",
    sourceUrl: "https://stripe.com/jobs",
    postedAgo: "3 weeks ago",
  },
  {
    id: "airbnb-ios-engineer",
    title: "iOS Engineer",
    company: "Airbnb",
    logo: { abbr: "Ab", bg: "#FCE9DD", fg: "#9F430D" },
    location: "Seattle, WA, US",
    jobType: "Full-time",
    category: "Engineering",
    tags: [
      "Swift",
      "SwiftUI",
      "iOS",
      "Xcode",
      "Combine",
      "MVVM",
    ],
    source: "LinkedIn Jobs",
    sourceUrl: "https://linkedin.com/jobs",
    postedAgo: "1 month ago",
  },
];

export type ResolvedJob = Required<
  Pick<
    Job,
    | "description"
    | "department"
    | "experience"
    | "salary"
    | "remote"
    | "industries"
    | "status"
  >
> &
  Job & { jobId: string };

export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function resolveJob(job: Job): ResolvedJob {
  return {
    ...job,
    status: job.status ?? "Open",
    description:
      job.description ??
      `We’re looking for a ${job.title} to join the ${job.category} team at ${job.company}. You’ll collaborate with cross-functional partners to ship meaningful work.`,
    department: job.department ?? job.category,
    experience: job.experience ?? "3+ years",
    salary: job.salary ?? "Not disclosed",
    remote: job.remote ?? (/remote/i.test(job.location) ? "Remote" : "Not specified"),
    industries: job.industries ?? [job.category],
    jobId: job.jobId ?? "—",
  };
}

export const LOCATION_OPTIONS = [
  "All locations",
  "Remote",
  "United States",
  "Canada",
  "United Kingdom",
  "Europe",
  "Asia",
];

export const JOB_TYPE_OPTIONS = [
  "All job types",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const EXPERIENCE_OPTIONS = [
  "All levels",
  "Entry level",
  "Mid level",
  "Senior",
  "Lead / Principal",
  "Manager",
];

export const CATEGORY_OPTIONS = [
  "All categories",
  "Design",
  "Engineering",
  "Product",
  "Research",
  "Marketing",
  "Data",
  "Operations",
];

export const POSTED_WITHIN_OPTIONS = [
  "Any time",
  "Last 24 hours",
  "Last 3 days",
  "Last week",
  "Last month",
];

export const SOURCE_OPTIONS = [
  "All sources",
  "LinkedIn Jobs",
  "Shopify Careers",
  "Google Careers",
  "Notion Careers",
  "Figma Careers",
  "Stripe Careers",
];

export type JobFilters = {
  keywords: string;
  location: string;
  jobType: string;
  experience: string;
  category: string;
  postedWithin: string;
  source: string;
};

export const emptyJobFilters: JobFilters = {
  keywords: "",
  location: "All locations",
  jobType: "All job types",
  experience: "All levels",
  category: "All categories",
  postedWithin: "Any time",
  source: "All sources",
};

export type SavedSearch = {
  id: string;
  name: string;
  filters: JobFilters;
  createdAt: number;
};

export function jobMatchesExperience(job: Job, level: string): boolean {
  if (level === "All levels") return true;
  const haystack = `${job.title} ${job.experience ?? ""} ${job.tags.join(" ")}`.toLowerCase();
  if (level === "Entry level")
    return /\b(entry|junior|jr\.?|intern|graduate|associate)\b/.test(haystack);
  if (level === "Mid level")
    return (
      /\b(mid|intermediate|ii|iii)\b/.test(haystack) ||
      (!/(senior|sr\.?|lead|principal|staff|manager|director|entry|junior|jr\.?|intern)/.test(
        haystack,
      ) &&
        /\b(3\+|4\+|5\+)\s*years?\b/.test(haystack))
    );
  if (level === "Senior") return /\b(senior|sr\.?|staff)\b/.test(haystack);
  if (level === "Lead / Principal")
    return /\b(lead|principal|staff)\b/.test(haystack);
  if (level === "Manager")
    return /\b(manager|director|head\sof|vp)\b/.test(haystack);
  return true;
}

export function countActiveFilters(f: JobFilters): number {
  let n = 0;
  if (f.keywords.trim()) n++;
  if (f.location !== emptyJobFilters.location) n++;
  if (f.jobType !== emptyJobFilters.jobType) n++;
  if (f.experience !== emptyJobFilters.experience) n++;
  if (f.category !== emptyJobFilters.category) n++;
  if (f.postedWithin !== emptyJobFilters.postedWithin) n++;
  if (f.source !== emptyJobFilters.source) n++;
  return n;
}

export function activeFilterChips(
  f: JobFilters,
): Array<{ key: keyof JobFilters; label: string }> {
  const chips: Array<{ key: keyof JobFilters; label: string }> = [];
  if (f.keywords.trim()) chips.push({ key: "keywords", label: `"${f.keywords.trim()}"` });
  if (f.location !== emptyJobFilters.location) chips.push({ key: "location", label: f.location });
  if (f.jobType !== emptyJobFilters.jobType) chips.push({ key: "jobType", label: f.jobType });
  if (f.experience !== emptyJobFilters.experience) chips.push({ key: "experience", label: f.experience });
  if (f.category !== emptyJobFilters.category) chips.push({ key: "category", label: f.category });
  if (f.postedWithin !== emptyJobFilters.postedWithin) chips.push({ key: "postedWithin", label: f.postedWithin });
  if (f.source !== emptyJobFilters.source) chips.push({ key: "source", label: f.source });
  return chips;
}
