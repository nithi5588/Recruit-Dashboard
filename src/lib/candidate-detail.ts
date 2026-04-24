import { candidates, type Candidate } from "@/lib/sample-data";

export type ExperienceEntry = {
  role: string;
  company: string;
  period: string;
  duration: string;
  bullets: string[];
  current?: boolean;
  logoBg: string;
  logoFg: string;
  logoAbbr: string;
};

export type ExperienceSkill = {
  name: string;
  years: number;
  /** 0–100, controls bar width in Top Skills from Experience. */
  percent: number;
};

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export type CoreSkill = { name: string; level: SkillLevel };

export type OtherSkill = {
  name: string;
  level: SkillLevel;
  abbr: string;
  bg: string;
  fg: string;
};

export type MatchSkill = {
  name: string;
  percent: number;
  iconBg: string;
  iconFg: string;
  abbr: string;
};

export type SkillCategory = { name: string; count: number; color: string };

export type SkillsBlock = {
  totalSkills: number;
  coreSkillsCount: number;
  toolsCount: number;
  overallMatch: number;
  matchedRole: string;
  coreSkills: CoreSkill[];
  otherSkills: OtherSkill[];
  topMatchSkills: MatchSkill[];
  categories: SkillCategory[];
  insight: { headline: string; body: string } | null;
};

export type ProjectIconKind =
  | "chart"
  | "phone"
  | "cart"
  | "watch"
  | "layers"
  | "monitor";

export type Project = {
  id: string;
  title: string;
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  /** 0–100 impact percentage, undefined when not measured. */
  impact?: number;
  teamSize: number;
  featured?: boolean;
  icon: ProjectIconKind;
};

export type ProjectsBlock = {
  totalProjects: number;
  featuredCount: number;
  companiesCount: number;
  totalExperience: string;
  projects: Project[];
  byRole: { name: string; count: number; color: string }[];
  topSkills: { name: string; percent: number }[];
  highlights: string[];
};

export type EducationEntry = {
  degree: string;
  school: string;
  period: string;
};

export type ToolEntry = {
  label: string;
  abbr: string;
  bg: string;
  fg: string;
};

export type DocumentEntry = {
  name: string;
  size: string;
  uploadedAgo: string;
  kind: "pdf" | "doc";
};

export type ApplicationStatus =
  | "In Progress"
  | "Under Review"
  | "Shortlisted"
  | "Submitted"
  | "Offered"
  | "Placed"
  | "Rejected";

export type ApplicationStageDot =
  | "purple"
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "gray";

export type ApplicationEntry = {
  id: string;
  jobTitle: string;
  company: string;
  logo: { abbr: string; bg: string; fg: string };
  status: ApplicationStatus;
  stage: { label: string; dot: ApplicationStageDot };
  appliedOn: string;
  recruiter: string;
};

export type ApplicationsBlock = {
  summary: {
    total: number;
    inProgress: number;
    underReview: number;
    shortlisted: number;
  };
  applications: ApplicationEntry[];
  funnel: { name: string; count: number; color: string }[];
  topApplied: {
    jobTitle: string;
    company: string;
    logo: { abbr: string; bg: string; fg: string };
    status: ApplicationStatus;
    applicationCount: number;
    percentOfTotal: number;
  } | null;
};

export type NoteKind = "Private" | "Team" | "Interview";

export type NoteEntry = {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  kind: NoteKind;
  pinned?: boolean;
};

export type NotesBlock = {
  summary: { total: number; mine: number; team: number; pinned: number };
  notes: NoteEntry[];
};

export type ActivityKind =
  | "resume"
  | "status"
  | "interview"
  | "note"
  | "application"
  | "shortlist"
  | "added";

export type ActivityEntry = {
  id: string;
  kind: ActivityKind;
  title: string;
  description: string;
  author: string;
  time: string;
};

export type ActivityByType = {
  name: string;
  count: number;
  percent: number;
  color: string;
};

export type ActivityBlock = {
  summary: {
    total: number;
    updatesByYou: number;
    interviewsScheduled: number;
    notesAdded: number;
  };
  byType: ActivityByType[];
  activities: ActivityEntry[];
};

export type ResumeStatus = "Active" | "Backup" | "Old";

export type Resume = {
  id: string;
  name: string;
  size: string;
  uploadedOn: string;
  status: ResumeStatus;
  type?: "Primary" | "Secondary";
  bestForRoles?: string[];
  lastUsedRole?: string;
  lastUsedCompany?: string;
  lastUsedDate?: string;
  usedInApplications?: number;
  notes?: string;
  tags?: string[];
};

export type CandidateDetail = {
  id: string;
  bio: string;
  phone: string;
  email: string;
  currentLocation: string;
  workAuthorization: string;
  noticePeriod: string;
  currentSalary: string;
  expectedSalary: string;
  industryPreference: string;
  relocation: string;
  topSkills: string[];
  tools: ToolEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  documents: DocumentEntry[];
  snapshot: {
    source: string;
    addedOn: string;
    owner: string;
  };
  applicationsBlock: ApplicationsBlock;
  activityBlock: ActivityBlock;
  resumes: Resume[];
  experienceSkills: ExperienceSkill[];
  skillsBlock: SkillsBlock;
  projectsBlock: ProjectsBlock;
  notesBlock: NotesBlock;
};

const savannah: CandidateDetail = {
  id: "savannah-nguyen",
  bio: "Creative and detail-oriented Product Designer with 3+ years of experience designing user-centered digital products. Skilled in UI/UX design, prototyping, and collaborating with cross-functional teams to deliver impactful solutions.",
  phone: "+1 (416) 555-0198",
  email: "savannah.nguyen@email.com",
  currentLocation: "Toronto, Canada",
  workAuthorization: "Canadian Citizen",
  noticePeriod: "15 days",
  currentSalary: "$80K",
  expectedSalary: "$95K – $110K",
  industryPreference: "SaaS, FinTech, Healthcare",
  relocation: "Open to relocate",
  topSkills: [
    "Product Design",
    "UI/UX Design",
    "Figma",
    "Prototyping",
    "User Research",
    "Design System",
    "Wireframing",
    "Interaction Design",
  ],
  tools: [
    { label: "Figma", abbr: "Fig", bg: "#FEE2E2", fg: "#DC2626" },
    { label: "Sketch", abbr: "Sk", bg: "#FEF3C7", fg: "#D97706" },
    { label: "Adobe XD", abbr: "Xd", bg: "#F3E8FF", fg: "#9333EA" },
    { label: "Photoshop", abbr: "Ps", bg: "#DBEAFE", fg: "#1D4ED8" },
    { label: "Illustrator", abbr: "Ai", bg: "#FFEDD5", fg: "#C2410C" },
    { label: "InDesign", abbr: "Id", bg: "#FCE7F3", fg: "#BE185D" },
    { label: "InVision", abbr: "In", bg: "#EDE9FE", fg: "#5B21B6" },
    { label: "Notion", abbr: "N", bg: "#F3F4F8", fg: "#171A2B" },
  ],
  experience: [
    {
      role: "Senior Product Designer",
      company: "DesignHub Inc.",
      period: "Jan 2022 – Present",
      duration: "1.5 yrs",
      current: true,
      logoBg: "#FEE2E2",
      logoFg: "#DC2626",
      logoAbbr: "DH",
      bullets: [
        "Led design for enterprise SaaS platform used by 10K+ users across global markets.",
        "Collaborated with PMs and engineers to define product roadmap and ship high-quality features.",
        "Improved user engagement by 28% through data-driven design iterations.",
      ],
    },
    {
      role: "Product Designer",
      company: "PixelMatters",
      period: "Jun 2020 – Dec 2021",
      duration: "1.5 yrs",
      logoBg: "#F3F4F8",
      logoFg: "#171A2B",
      logoAbbr: "PM",
      bullets: [
        "Designed responsive web and mobile applications for B2B and B2C clients.",
        "Created design systems and reusable components reducing development time by 30%.",
        "Conducted user research and usability testing to validate design decisions.",
      ],
    },
    {
      role: "UI/UX Designer",
      company: "Creatix Studios",
      period: "Jan 2019 – May 2020",
      duration: "1.4 yrs",
      logoBg: "#DBEAFE",
      logoFg: "#1D4ED8",
      logoAbbr: "CS",
      bullets: [
        "Designed user interfaces for clients across healthcare, fintech, and e-commerce industries.",
        "Worked on end-to-end product lifecycle from wireframes to high-fidelity prototypes.",
        "Collaborated in an agile team of 8 designers and developers.",
      ],
    },
    {
      role: "Junior Designer",
      company: "Invision Labs",
      period: "Jun 2018 – Dec 2018",
      duration: "7 mos",
      logoBg: "#FCE7F3",
      logoFg: "#BE185D",
      logoAbbr: "IL",
      bullets: [
        "Assisted in UI design, asset creation and maintaining design consistency.",
        "Supported senior designers in creating mockups and interactive prototypes.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Sc in Computer Science",
      school: "North South University, Dhaka",
      period: "Jan 2015 – Dec 2019",
    },
  ],
  documents: [
    {
      name: "Savannah_Nguyen_Resume.pdf",
      size: "280 KB",
      uploadedAgo: "Uploaded 2d ago",
      kind: "pdf",
    },
    {
      name: "Portfolio_Savannah.pdf",
      size: "1.2 MB",
      uploadedAgo: "Uploaded 5d ago",
      kind: "pdf",
    },
    {
      name: "Cover_Letter.pdf",
      size: "210 KB",
      uploadedAgo: "Uploaded 5d ago",
      kind: "pdf",
    },
  ],
  snapshot: {
    source: "LinkedIn",
    addedOn: "May 10, 2023",
    owner: "Nithish",
  },
  applicationsBlock: {
    summary: { total: 4, inProgress: 1, underReview: 1, shortlisted: 1 },
    applications: [
      {
        id: "app-figma",
        jobTitle: "Senior Product Designer",
        company: "Figma",
        logo: { abbr: "F", bg: "#FEE2E2", fg: "#DC2626" },
        status: "In Progress",
        stage: { label: "Interview Round 2", dot: "purple" },
        appliedOn: "May 12, 2023",
        recruiter: "Nithish",
      },
      {
        id: "app-adobe",
        jobTitle: "Product Designer",
        company: "Adobe",
        logo: { abbr: "A", bg: "#FEE2E2", fg: "#B91C1C" },
        status: "Under Review",
        stage: { label: "Screening", dot: "orange" },
        appliedOn: "May 08, 2023",
        recruiter: "Nithish",
      },
      {
        id: "app-shopify",
        jobTitle: "UX Designer",
        company: "Shopify",
        logo: { abbr: "S", bg: "#DCFCE7", fg: "#15803D" },
        status: "Shortlisted",
        stage: { label: "Interview Round 1", dot: "green" },
        appliedOn: "Apr 28, 2023",
        recruiter: "Jessica Lee",
      },
      {
        id: "app-atlassian",
        jobTitle: "Product Designer",
        company: "Atlassian",
        logo: { abbr: "A", bg: "#DBEAFE", fg: "#1D4ED8" },
        status: "Rejected",
        stage: { label: "Rejected", dot: "red" },
        appliedOn: "Apr 20, 2023",
        recruiter: "Rohan Mehta",
      },
    ],
    funnel: [
      { name: "Applied", count: 4, color: "#5B3DF5" },
      { name: "Screening", count: 1, color: "#3B82F6" },
      { name: "Interview", count: 2, color: "#22C55E" },
      { name: "Offered", count: 0, color: "#F59E0B" },
      { name: "Rejected", count: 1, color: "#EF4444" },
    ],
    topApplied: {
      jobTitle: "Senior Product Designer",
      company: "Figma",
      logo: { abbr: "F", bg: "#FEE2E2", fg: "#DC2626" },
      status: "In Progress",
      applicationCount: 1,
      percentOfTotal: 25,
    },
  },
  activityBlock: {
    summary: {
      total: 12,
      updatesByYou: 6,
      interviewsScheduled: 4,
      notesAdded: 2,
    },
    byType: [
      { name: "Status Updates", count: 4, percent: 33, color: "#5B3DF5" },
      { name: "Notes", count: 3, percent: 25, color: "#3B82F6" },
      { name: "Interviews", count: 2, percent: 17, color: "#22C55E" },
      { name: "Applications", count: 2, percent: 17, color: "#F59E0B" },
      { name: "Others", count: 1, percent: 8, color: "#EF4444" },
    ],
    activities: [
      {
        id: "act-resume-updated",
        kind: "resume",
        title: "Resume updated",
        description: "Savannah Nguyen's resume was updated.",
        author: "Nithish",
        time: "Today, 11:30 AM",
      },
      {
        id: "act-status-changed",
        kind: "status",
        title: "Status changed to In Progress",
        description: "Moved from Open to In Progress.",
        author: "Nithish",
        time: "Today, 10:15 AM",
      },
      {
        id: "act-interview-scheduled",
        kind: "interview",
        title: "Interview scheduled",
        description: "Interview - Round 2 scheduled on May 16, 2023 at 2:00 PM.",
        author: "Jessica Lee",
        time: "May 13, 2023, 04:20 PM",
      },
      {
        id: "act-note-added",
        kind: "note",
        title: "Note added",
        description: "Great portfolio and strong product design thinking.",
        author: "Nithish",
        time: "May 12, 2023, 11:30 AM",
      },
      {
        id: "act-applied",
        kind: "application",
        title: "Applied to Senior Product Designer at Figma",
        description: "Application status: In Progress",
        author: "System",
        time: "May 12, 2023, 09:10 AM",
      },
      {
        id: "act-shortlisted",
        kind: "shortlist",
        title: "Candidate shortlisted",
        description: "Added to pipeline: Shortlisted",
        author: "Nithish",
        time: "May 10, 2023, 03:45 PM",
      },
      {
        id: "act-added",
        kind: "added",
        title: "Candidate added",
        description: "Savannah Nguyen was added to the system.",
        author: "Nithish",
        time: "May 10, 2023, 11:20 AM",
      },
    ],
  },
  resumes: [
    {
      id: "product-designer",
      name: "Savannah_Nguyen_Product_Designer.pdf",
      size: "280 KB",
      uploadedOn: "May 10, 2023",
      status: "Active",
      type: "Primary",
      bestForRoles: ["Product Designer", "UI/UX Designer", "UX Designer"],
      lastUsedRole: "UI/UX Designer",
      lastUsedCompany: "TechCorp Inc.",
      lastUsedDate: "May 12, 2023",
      usedInApplications: 3,
      notes: "Updated resume with latest experience and projects.",
      tags: ["Product Design", "UI/UX", "Figma", "User Research", "Prototyping"],
    },
    {
      id: "resume-oct-2022",
      name: "Savannah_Nguyen_Resume_Oct2022.pdf",
      size: "256 KB",
      uploadedOn: "Oct 12, 2022",
      status: "Backup",
    },
    {
      id: "designer-2021",
      name: "Savannah_Nguyen_Designer_2021.pdf",
      size: "210 KB",
      uploadedOn: "Jun 18, 2021",
      status: "Old",
    },
  ],
  experienceSkills: [
    { name: "Product Design", years: 4, percent: 90 },
    { name: "UI/UX Design", years: 3, percent: 75 },
    { name: "Figma", years: 3, percent: 75 },
    { name: "User Research", years: 2.5, percent: 60 },
    { name: "Prototyping", years: 2, percent: 50 },
  ],
  skillsBlock: {
    totalSkills: 18,
    coreSkillsCount: 9,
    toolsCount: 7,
    overallMatch: 85,
    matchedRole: "Product Designer",
    coreSkills: [
      { name: "Product Design", level: "Expert" },
      { name: "UI/UX Design", level: "Expert" },
      { name: "User Research", level: "Advanced" },
      { name: "Figma", level: "Expert" },
      { name: "Interaction Design", level: "Advanced" },
      { name: "Wireframing", level: "Advanced" },
      { name: "Prototyping", level: "Advanced" },
      { name: "Design System", level: "Advanced" },
      { name: "User Testing", level: "Intermediate" },
      { name: "Information Architecture", level: "Intermediate" },
    ],
    otherSkills: [
      { name: "Adobe XD", level: "Intermediate", abbr: "Xd", bg: "#F3E8FF", fg: "#9333EA" },
      { name: "Sketch", level: "Intermediate", abbr: "Sk", bg: "#FEF3C7", fg: "#D97706" },
      { name: "Webflow", level: "Beginner", abbr: "W", bg: "#DBEAFE", fg: "#1D4ED8" },
      { name: "HTML/CSS", level: "Beginner", abbr: "H5", bg: "#FFEDD5", fg: "#C2410C" },
      { name: "Miro", level: "Intermediate", abbr: "M", bg: "#FEF3C7", fg: "#D97706" },
      { name: "Zeplin", level: "Intermediate", abbr: "Z", bg: "#FFEDD5", fg: "#C2410C" },
    ],
    topMatchSkills: [
      { name: "Product Design", percent: 95, abbr: "PD", iconBg: "#FCE7F3", iconFg: "#BE185D" },
      { name: "UI/UX Design", percent: 92, abbr: "UI", iconBg: "#FFEDD5", iconFg: "#C2410C" },
      { name: "Figma", percent: 90, abbr: "F", iconBg: "#FEE2E2", iconFg: "#DC2626" },
      { name: "User Research", percent: 85, abbr: "UR", iconBg: "#DBEAFE", iconFg: "#1D4ED8" },
      { name: "Prototyping", percent: 80, abbr: "P", iconBg: "#FEF3C7", iconFg: "#D97706" },
    ],
    categories: [
      { name: "Design", count: 8, color: "#5B3DF5" },
      { name: "Research", count: 3, color: "#22C55E" },
      { name: "Tools", count: 5, color: "#3B82F6" },
      { name: "Other", count: 2, color: "#F97316" },
    ],
    insight: {
      headline: "Strong match!",
      body: "Savannah has 85% of the required skills for Product Designer role.",
    },
  },
  projectsBlock: {
    totalProjects: 6,
    featuredCount: 2,
    companiesCount: 4,
    totalExperience: "3+ years",
    projects: [
      {
        id: "saas-dashboard",
        title: "SaaS Dashboard Redesign",
        role: "Product Designer",
        company: "DesignHub Inc.",
        period: "Jan 2022 – Present",
        description:
          "Redesigned analytics dashboard for a SaaS platform to improve usability and data visualization. Increased user engagement by 28%.",
        tags: ["UI/UX Design", "Data Visualization", "Figma", "User Research"],
        impact: 28,
        teamSize: 4,
        featured: true,
        icon: "chart",
      },
      {
        id: "fintrack-mobile",
        title: "FinTrack Mobile App",
        role: "Product Designer",
        company: "DesignHub Inc.",
        period: "Jun 2021 – Dec 2021",
        description:
          "Designed a personal finance tracking app from concept to high-fidelity prototypes with a focus on UX and accessibility.",
        tags: ["Mobile Design", "Prototyping", "Figma", "User Testing"],
        impact: 20,
        teamSize: 3,
        featured: true,
        icon: "phone",
      },
      {
        id: "ecommerce-ux",
        title: "E-commerce Website UX",
        role: "UI/UX Designer",
        company: "TechCorp Inc.",
        period: "Jan 2021 – May 2021",
        description:
          "Conducted user research and designed end-to-end UX for an e-commerce platform, improving conversion rate by 15%.",
        tags: ["UX Research", "Wireframing", "User Flow", "Figma"],
        impact: 15,
        teamSize: 5,
        icon: "cart",
      },
      {
        id: "smartwatch-app",
        title: "Smartwatch Companion App",
        role: "Product Designer",
        company: "InnovateX",
        period: "Aug 2020 – Dec 2020",
        description:
          "Designed the companion app for a smartwatch with health tracking and activity insights.",
        tags: ["Mobile Design", "UI Design", "Prototyping", "Figma"],
        impact: 18,
        teamSize: 2,
        icon: "watch",
      },
      {
        id: "design-system-startup",
        title: "Design System for Startup",
        role: "UI/UX Designer",
        company: "PixelMatters",
        period: "Feb 2020 – Jul 2020",
        description:
          "Built a scalable design system and component library used across web and mobile products.",
        tags: ["Design System", "Components", "Figma", "Documentation"],
        teamSize: 2,
        icon: "layers",
      },
      {
        id: "internal-admin",
        title: "Internal Admin Dashboard",
        role: "UX Designer",
        company: "Creatix Studios",
        period: "Oct 2019 – Dec 2019",
        description:
          "Designed an internal admin dashboard to streamline operations and reporting.",
        tags: ["Dashboard", "Wireframing", "User Flow", "Figma"],
        impact: 12,
        teamSize: 3,
        icon: "monitor",
      },
    ],
    byRole: [
      { name: "Product Designer", count: 4, color: "#5B3DF5" },
      { name: "UI/UX Designer", count: 3, color: "#3B82F6" },
      { name: "UX Designer", count: 1, color: "#22C55E" },
    ],
    topSkills: [
      { name: "UI/UX Design", percent: 100 },
      { name: "Figma", percent: 100 },
      { name: "Prototyping", percent: 83 },
      { name: "User Research", percent: 67 },
      { name: "Wireframing", percent: 67 },
    ],
    highlights: [
      "Strong focus on user-centered design and usability",
      "Experience across web, mobile and dashboard platforms",
      "Improved user engagement and conversion across projects",
      "Collaborated with cross-functional teams effectively",
    ],
  },
  notesBlock: {
    summary: { total: 8, mine: 4, team: 3, pinned: 1 },
    notes: [
      {
        id: "note-portfolio",
        title: "Great portfolio and strong product design thinking.",
        body: "Discussed her experience in dashboard design and data visualization. She showed excellent problem-solving skills.",
        author: "Nithish",
        date: "May 12, 2023 at 11:30 AM",
        kind: "Private",
        pinned: true,
      },
      {
        id: "note-culture-fit",
        title: "Good cultural fit for our team.",
        body: "Spoke about our product vision and how she can contribute. Very enthusiastic about the opportunity.",
        author: "Jessica Lee",
        date: "May 12, 2023 at 04:15 PM",
        kind: "Team",
      },
      {
        id: "note-interview-r1",
        title: "Interview feedback – Round 1",
        body: "Strong UI skills and design system knowledge. Needs to improve on interaction design depth.",
        author: "Rohan Mehta",
        date: "May 13, 2023 at 09:20 AM",
        kind: "Interview",
      },
      {
        id: "note-followup",
        title: "Follow up",
        body: "Will share case study by end of this week.",
        author: "Nithish",
        date: "May 13, 2023 at 02:45 PM",
        kind: "Private",
      },
    ],
  },
};

/** Generic placeholder detail so every candidate id has a detail view. */
function placeholderFor(c: Candidate): CandidateDetail {
  return {
    id: c.id,
    bio: `${c.role} with ${c.experience} of experience. Detailed profile coming soon.`,
    phone: "+1 (555) 555-0100",
    email: `${c.id.replace(/-/g, ".")}@example.com`,
    currentLocation: c.location,
    workAuthorization: "Authorized to work",
    noticePeriod: "30 days",
    currentSalary: "—",
    expectedSalary: "—",
    industryPreference: "—",
    relocation: "Not specified",
    topSkills: c.skills,
    tools: savannah.tools.slice(0, 4),
    experience: [],
    education: [],
    documents: [],
    snapshot: { source: "Direct", addedOn: "—", owner: "Nithish" },
    applicationsBlock: {
      summary: { total: 0, inProgress: 0, underReview: 0, shortlisted: 0 },
      applications: [],
      funnel: [],
      topApplied: null,
    },
    activityBlock: {
      summary: { total: 0, updatesByYou: 0, interviewsScheduled: 0, notesAdded: 0 },
      byType: [],
      activities: [],
    },
    resumes: [],
    experienceSkills: [],
    skillsBlock: {
      totalSkills: c.skills.length,
      coreSkillsCount: c.skills.length,
      toolsCount: 0,
      overallMatch: c.score,
      matchedRole: c.role,
      coreSkills: c.skills.map((s) => ({ name: s, level: "Intermediate" as const })),
      otherSkills: [],
      topMatchSkills: [],
      categories: [],
      insight: null,
    },
    projectsBlock: {
      totalProjects: 0,
      featuredCount: 0,
      companiesCount: 0,
      totalExperience: c.experience,
      projects: [],
      byRole: [],
      topSkills: [],
      highlights: [],
    },
    notesBlock: {
      summary: { total: 0, mine: 0, team: 0, pinned: 0 },
      notes: [],
    },
  };
}

const byId: Record<string, CandidateDetail> = {
  [savannah.id]: savannah,
};

export function getCandidateDetail(id: string): CandidateDetail | null {
  if (byId[id]) return byId[id];
  const c = candidates.find((c) => c.id === id);
  return c ? placeholderFor(c) : null;
}
