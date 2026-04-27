export type EnrichmentStatus = "Success" | "Failed" | "In Progress";

export type Experience = {
  company: string;
  companyColor: string;
  title: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  dates: string;
  duration: string;
  location: string;
  description?: string;
  current?: boolean;
};

export type Education = {
  school: string;
  schoolColor: string;
  degree: string;
  field?: string;
  dates: string;
  activities?: string;
};

export type SkillCategory = {
  category: string;
  skills: { name: string; endorsements: number }[];
};

export type Language = {
  name: string;
  level:
    | "Native"
    | "Native or bilingual"
    | "Full professional"
    | "Professional working"
    | "Limited working"
    | "Elementary";
};

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  expiry?: string;
};

export type LinkedInActivity = {
  type: "post" | "repost" | "like" | "comment" | "article";
  text: string;
  context?: string;
  when: string;
  reactions?: number;
  comments?: number;
};

export type Recruiter = {
  id: string;
  name: string;
  headline: string;
  title: string;
  company: string;
  companyColor: string;
  location: string;
  pronouns?: string;
  verified?: boolean;
  openToWork?: boolean;
  linkedin: string;
  email: string;
  phone: string;
  seniority: "Staff" | "Senior" | "Lead" | "Head";
  focus: string;
  tags: string[];
  industry: string;
  companySize: string;
  joinedLinkedIn: string;
  about: string;
  connections: string;
  followers: string;
  mutualConnections: number;
  experience: Experience[];
  educationEntries: Education[];
  skillsCategorized: SkillCategory[];
  languages: Language[];
  certifications: Certification[];
  activity: LinkedInActivity[];
  enrichedAt: string;
  enrichedAtMs: number;
  source: string[];
  status: EnrichmentStatus;
  /** 0–100 — confidence we have on the scraped data overall. */
  dataQuality: number;
};

const NOW = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const RECRUITERS: Recruiter[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    headline:
      "Senior Technical Recruiter @ Google · Hiring across Platform & Infra · ex-Stripe",
    title: "Senior Technical Recruiter",
    company: "Google",
    companyColor: "#4285F4",
    location: "Bengaluru, Karnataka, India",
    pronouns: "she/her",
    verified: true,
    openToWork: false,
    linkedin: "linkedin.com/in/priyasharma",
    email: "priya.sharma@google.com",
    phone: "+91 98765 43210",
    seniority: "Senior",
    focus: "Engineering · Platform",
    tags: ["Recruiter", "Hiring for Engineering", "Platform"],
    industry: "Technology, Information & Internet",
    companySize: "10,001+ employees",
    joinedLinkedIn: "March 2014",
    about:
      "Senior recruiter focused on hiring world-class platform and infrastructure engineers. I've spent 7+ years partnering with engineering leaders to build teams from scratch. Currently leading recruitment for Google Cloud Platform — Bengaluru org. Reach out if you're working on distributed systems, kernel-adjacent infra or developer tooling.",
    connections: "500+",
    followers: "12.4K",
    mutualConnections: 24,
    experience: [
      {
        company: "Google",
        companyColor: "#4285F4",
        title: "Senior Technical Recruiter — Platform & Infra",
        employmentType: "Full-time",
        dates: "May 2021 — Present",
        duration: "3 yrs 11 mos",
        location: "Bengaluru, India · Hybrid",
        description:
          "Leading recruitment for distributed systems, storage, and developer infrastructure orgs across India. Closed 70+ senior engineering hires across L4-L6 levels.",
        current: true,
      },
      {
        company: "Stripe",
        companyColor: "#635BFF",
        title: "Technical Recruiter — Engineering",
        employmentType: "Full-time",
        dates: "Aug 2018 — Apr 2021",
        duration: "2 yrs 9 mos",
        location: "Bengaluru, India",
        description:
          "Built out the India engineering recruiting function from zero. Hired the first 30 engineers across product, payments, and platform.",
      },
      {
        company: "Microsoft",
        companyColor: "#00A4EF",
        title: "Recruiter — Cloud & AI",
        employmentType: "Full-time",
        dates: "Jun 2016 — Jul 2018",
        duration: "2 yrs 2 mos",
        location: "Hyderabad, India",
      },
    ],
    educationEntries: [
      {
        school: "Symbiosis International University",
        schoolColor: "#B7282E",
        degree: "MBA",
        field: "Human Resources",
        dates: "2014 — 2016",
        activities: "HR Club Lead, Recruitment Forum panelist",
      },
      {
        school: "Delhi University",
        schoolColor: "#7E2025",
        degree: "B.A. (Hons)",
        field: "Economics",
        dates: "2010 — 2013",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Technical Recruiting", endorsements: 142 },
          { name: "Talent Sourcing", endorsements: 96 },
          { name: "Executive Search", endorsements: 41 },
          { name: "Boolean Search", endorsements: 67 },
        ],
      },
      {
        category: "Domain Knowledge",
        skills: [
          { name: "Distributed Systems", endorsements: 38 },
          { name: "Cloud Infrastructure", endorsements: 52 },
          { name: "Developer Tools", endorsements: 28 },
        ],
      },
      {
        category: "Tools",
        skills: [
          { name: "Greenhouse", endorsements: 84 },
          { name: "Gem", endorsements: 47 },
          { name: "LinkedIn Recruiter", endorsements: 156 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Native or bilingual" },
      { name: "Hindi", level: "Native" },
      { name: "Marathi", level: "Limited working" },
    ],
    certifications: [
      {
        name: "AIRS Certified Internet Recruiter",
        issuer: "ADP",
        year: "2019",
      },
      {
        name: "LinkedIn Certified Professional Recruiter",
        issuer: "LinkedIn",
        year: "2021",
      },
    ],
    activity: [
      {
        type: "post",
        text: "We're hiring senior platform engineers for Google Cloud — Bengaluru. If you've worked on storage systems, K8s internals, or developer infra, send me a DM.",
        when: "2 days ago",
        reactions: 312,
        comments: 47,
      },
      {
        type: "repost",
        text: "How we restructured our engineering interviews to reduce false negatives by 40%.",
        context: "Reposted from Google Engineering",
        when: "5 days ago",
        reactions: 188,
        comments: 24,
      },
      {
        type: "like",
        text: "Liked an article: 'The state of platform engineering in 2026'",
        when: "1 week ago",
      },
      {
        type: "comment",
        text: "Spot on — the best engineers I've placed treat hiring as a craft, not a side quest. Loved this read.",
        context: "On a post by Lara Hogan",
        when: "2 weeks ago",
        reactions: 41,
        comments: 3,
      },
    ],
    enrichedAt: "Today, 10:30 AM",
    enrichedAtMs: NOW - 4 * HOUR,
    source: ["LinkedIn", "Web Sources", "Crunchbase"],
    status: "Success",
    dataQuality: 96,
  },
  {
    id: "rahul-kumar",
    name: "Rahul Kumar",
    headline:
      "Talent Acquisition Partner @ Microsoft · Cloud + AI hiring across APAC",
    title: "Talent Acquisition Partner",
    company: "Microsoft",
    companyColor: "#00A4EF",
    location: "Hyderabad, Telangana, India",
    pronouns: "he/him",
    verified: true,
    linkedin: "linkedin.com/in/rahulkumar",
    email: "rahul.k@microsoft.com",
    phone: "+91 98200 11223",
    seniority: "Senior",
    focus: "Engineering · Cloud",
    tags: ["Recruiter", "Cloud", "AI"],
    industry: "Software Development",
    companySize: "10,001+ employees",
    joinedLinkedIn: "August 2016",
    about:
      "Talent partner for Azure Compute and AI Platform teams across APAC. Big believer that recruiting is product work — same craft, longer feedback loops.",
    connections: "500+",
    followers: "8.1K",
    mutualConnections: 12,
    experience: [
      {
        company: "Microsoft",
        companyColor: "#00A4EF",
        title: "Talent Acquisition Partner — Cloud + AI",
        employmentType: "Full-time",
        dates: "Feb 2020 — Present",
        duration: "5 yrs 2 mos",
        location: "Hyderabad, India",
        description:
          "Hiring across Azure Compute, AI Platform, and Cloud Security orgs. Coverage from L62 through L66.",
        current: true,
      },
      {
        company: "Amazon",
        companyColor: "#FF9900",
        title: "Recruiter — AWS",
        employmentType: "Full-time",
        dates: "Jul 2017 — Jan 2020",
        duration: "2 yrs 7 mos",
        location: "Hyderabad, India",
      },
    ],
    educationEntries: [
      {
        school: "NIT Warangal",
        schoolColor: "#1E40AF",
        degree: "B.Tech",
        field: "Computer Science & Engineering",
        dates: "2013 — 2017",
        activities: "Coding Club, Placement Coordinator",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Technical Recruiting", endorsements: 88 },
          { name: "Stakeholder Management", endorsements: 62 },
          { name: "Pipeline Building", endorsements: 39 },
        ],
      },
      {
        category: "Cloud",
        skills: [
          { name: "Azure", endorsements: 47 },
          { name: "AWS", endorsements: 29 },
          { name: "MLOps Hiring", endorsements: 18 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Full professional" },
      { name: "Hindi", level: "Native" },
      { name: "Telugu", level: "Native" },
    ],
    certifications: [
      {
        name: "Azure Fundamentals (AZ-900)",
        issuer: "Microsoft",
        year: "2022",
      },
    ],
    activity: [
      {
        type: "post",
        text: "Just closed three AI Platform hires this quarter. Common thread? They all spent time tinkering with open-source LLM tooling on weekends.",
        when: "15 min ago",
        reactions: 124,
        comments: 18,
      },
      {
        type: "repost",
        text: "Microsoft's new India AI engineering hub — what we're building.",
        context: "Reposted from Microsoft India",
        when: "3 days ago",
        reactions: 89,
        comments: 7,
      },
    ],
    enrichedAt: "Today, 9:42 AM",
    enrichedAtMs: NOW - 6 * HOUR,
    source: ["LinkedIn", "Web Sources"],
    status: "Success",
    dataQuality: 92,
  },
  {
    id: "ankit-singh",
    name: "Ankit Singh",
    headline: "Recruiter @ Amazon · Operations + Customer Fulfillment",
    title: "Recruiter",
    company: "Amazon",
    companyColor: "#FF9900",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/ankitsingh",
    email: "asingh@amazon.com",
    phone: "+91 98765 11100",
    seniority: "Staff",
    focus: "Operations",
    tags: ["Recruiter", "Operations"],
    industry: "Retail / Technology",
    companySize: "10,001+ employees",
    joinedLinkedIn: "November 2018",
    about:
      "Recruiter at Amazon — currently focused on operations and customer fulfillment hiring across India.",
    connections: "300+",
    followers: "1.2K",
    mutualConnections: 4,
    experience: [
      {
        company: "Amazon",
        companyColor: "#FF9900",
        title: "Recruiter — Operations",
        employmentType: "Full-time",
        dates: "Jun 2022 — Present",
        duration: "2 yrs 10 mos",
        location: "Bengaluru, India",
        current: true,
      },
      {
        company: "Flipkart",
        companyColor: "#2874F0",
        title: "Talent Associate",
        employmentType: "Full-time",
        dates: "Jul 2019 — May 2022",
        duration: "2 yrs 11 mos",
        location: "Bengaluru, India",
      },
    ],
    educationEntries: [
      {
        school: "Delhi University",
        schoolColor: "#7E2025",
        degree: "BBA",
        field: "Business Administration",
        dates: "2015 — 2018",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Operations Recruiting", endorsements: 23 },
          { name: "Volume Hiring", endorsements: 19 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Professional working" },
      { name: "Hindi", level: "Native" },
    ],
    certifications: [],
    activity: [
      {
        type: "like",
        text: "Liked a post about Amazon's new fulfillment center expansion in Hyderabad.",
        when: "Yesterday",
      },
    ],
    enrichedAt: "Yesterday, 4:18 PM",
    enrichedAtMs: NOW - 1 * DAY - 6 * HOUR,
    source: ["LinkedIn"],
    status: "Failed",
    dataQuality: 38,
  },
  {
    id: "neha-jain",
    name: "Neha Jain",
    headline:
      "HR Recruiter @ Deloitte · Consulting & Tech Advisory · ex-PwC, ex-EY",
    title: "HR Recruiter",
    company: "Deloitte",
    companyColor: "#86BC25",
    location: "Mumbai, Maharashtra, India",
    pronouns: "she/her",
    verified: true,
    linkedin: "linkedin.com/in/nehajain",
    email: "njain@deloitte.com",
    phone: "+91 98333 45678",
    seniority: "Senior",
    focus: "Consulting · Tech Advisory",
    tags: ["Recruiter", "Consulting", "Tech Advisory"],
    industry: "Management Consulting",
    companySize: "10,001+ employees",
    joinedLinkedIn: "January 2015",
    about:
      "Talent partner for Deloitte's Consulting and Technology Advisory practice. 6+ years across Big Four hiring — from analyst to partner-track roles.",
    connections: "500+",
    followers: "5.6K",
    mutualConnections: 18,
    experience: [
      {
        company: "Deloitte",
        companyColor: "#86BC25",
        title: "Senior HR Recruiter — Consulting",
        employmentType: "Full-time",
        dates: "Mar 2022 — Present",
        duration: "3 yrs 1 mo",
        location: "Mumbai, India",
        current: true,
      },
      {
        company: "PwC",
        companyColor: "#DC6900",
        title: "Recruiter — Advisory",
        employmentType: "Full-time",
        dates: "Aug 2019 — Feb 2022",
        duration: "2 yrs 7 mos",
        location: "Mumbai, India",
      },
      {
        company: "EY",
        companyColor: "#2E2E38",
        title: "Talent Associate",
        employmentType: "Full-time",
        dates: "Jul 2017 — Jul 2019",
        duration: "2 yrs",
        location: "Gurugram, India",
      },
    ],
    educationEntries: [
      {
        school: "XLRI Jamshedpur",
        schoolColor: "#1F3A93",
        degree: "MBA",
        field: "Human Resource Management",
        dates: "2015 — 2017",
        activities: "HR Forum, Placement Committee",
      },
      {
        school: "NMIMS Mumbai",
        schoolColor: "#003F87",
        degree: "BBA",
        field: "Business Administration",
        dates: "2012 — 2015",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Consulting Recruiting", endorsements: 78 },
          { name: "Lateral Hiring", endorsements: 54 },
          { name: "Campus Hiring", endorsements: 31 },
        ],
      },
      {
        category: "Domain Knowledge",
        skills: [
          { name: "Big Four Compensation", endorsements: 19 },
          { name: "Partnership Track", endorsements: 12 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Native or bilingual" },
      { name: "Hindi", level: "Native" },
      { name: "Gujarati", level: "Full professional" },
    ],
    certifications: [
      {
        name: "SHRM-CP",
        issuer: "SHRM",
        year: "2020",
      },
    ],
    activity: [
      {
        type: "article",
        text: "What I look for when hiring senior consultants — beyond the deck.",
        when: "1 week ago",
        reactions: 412,
        comments: 56,
      },
      {
        type: "post",
        text: "Open headcount this quarter: Senior Consultants in Banking & Financial Services. DM if interested.",
        when: "2 weeks ago",
        reactions: 198,
        comments: 33,
      },
    ],
    enrichedAt: "Yesterday, 11:02 AM",
    enrichedAtMs: NOW - 1 * DAY - 11 * HOUR,
    source: ["LinkedIn", "Web Sources", "Press Mentions"],
    status: "Success",
    dataQuality: 89,
  },
  {
    id: "deepak-p",
    name: "Deepak P.",
    headline:
      "Technical Recruiter @ Oracle · Database & Enterprise Engineering hires",
    title: "Technical Recruiter",
    company: "Oracle",
    companyColor: "#F80000",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/deepakp",
    email: "deepak.p@oracle.com",
    phone: "+91 97010 55566",
    seniority: "Senior",
    focus: "Engineering · Database",
    tags: ["Recruiter", "Enterprise", "Database"],
    industry: "Enterprise Software",
    companySize: "10,001+ employees",
    joinedLinkedIn: "September 2013",
    about:
      "Recruiter for Oracle's database and enterprise engineering orgs. 8 years specialising in deep-tech hiring across the storage, OLTP, and engineered systems portfolios.",
    connections: "500+",
    followers: "3.4K",
    mutualConnections: 9,
    experience: [
      {
        company: "Oracle",
        companyColor: "#F80000",
        title: "Senior Technical Recruiter — Database",
        employmentType: "Full-time",
        dates: "Jan 2019 — Present",
        duration: "6 yrs 3 mos",
        location: "Bengaluru, India · On-site",
        current: true,
      },
      {
        company: "SAP",
        companyColor: "#0FAAFF",
        title: "Recruiter",
        employmentType: "Full-time",
        dates: "Apr 2016 — Dec 2018",
        duration: "2 yrs 9 mos",
        location: "Bengaluru, India",
      },
    ],
    educationEntries: [
      {
        school: "IIT Madras",
        schoolColor: "#003366",
        degree: "M.Tech",
        field: "Computer Science",
        dates: "2014 — 2016",
      },
      {
        school: "BITS Pilani",
        schoolColor: "#0E7C4A",
        degree: "B.E.",
        field: "Computer Science",
        dates: "2009 — 2013",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Deep Tech Recruiting", endorsements: 64 },
          { name: "Database Engineering Hiring", endorsements: 48 },
        ],
      },
      {
        category: "Domain Knowledge",
        skills: [
          { name: "RDBMS / Storage", endorsements: 32 },
          { name: "Distributed SQL", endorsements: 21 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Full professional" },
      { name: "Hindi", level: "Native" },
      { name: "Kannada", level: "Native or bilingual" },
    ],
    certifications: [],
    activity: [
      {
        type: "post",
        text: "Top tip when hiring database engineers: ask them to debug a poorly indexed query rather than rote SQL trivia.",
        when: "4 days ago",
        reactions: 271,
        comments: 39,
      },
    ],
    enrichedAt: "Mon, Apr 22 · 3:14 PM",
    enrichedAtMs: NOW - 5 * DAY,
    source: ["LinkedIn", "Web Sources"],
    status: "Success",
    dataQuality: 84,
  },
  {
    id: "anita-rao",
    name: "Anita Rao",
    headline: "Lead Recruiter @ Atlassian · Eng + Design hiring · APAC",
    title: "Lead Recruiter",
    company: "Atlassian",
    companyColor: "#0052CC",
    location: "Bengaluru, India",
    pronouns: "she/her",
    verified: true,
    linkedin: "linkedin.com/in/anitarao",
    email: "anita.rao@atlassian.com",
    phone: "+91 99001 22334",
    seniority: "Lead",
    focus: "Engineering · Design",
    tags: ["Recruiter", "Engineering", "Design"],
    industry: "Software Development",
    companySize: "5,001-10,000 employees",
    joinedLinkedIn: "May 2012",
    about:
      "Lead recruiter at Atlassian for engineering and design hiring across APAC. I care a lot about candidate experience and have rebuilt our interview process twice.",
    connections: "500+",
    followers: "9.8K",
    mutualConnections: 21,
    experience: [
      {
        company: "Atlassian",
        companyColor: "#0052CC",
        title: "Lead Recruiter — APAC",
        employmentType: "Full-time",
        dates: "Aug 2020 — Present",
        duration: "4 yrs 8 mos",
        location: "Bengaluru, India",
        current: true,
      },
      {
        company: "ThoughtWorks",
        companyColor: "#F2617A",
        title: "Senior Recruiter",
        employmentType: "Full-time",
        dates: "Jan 2017 — Jul 2020",
        duration: "3 yrs 7 mos",
        location: "Bengaluru, India",
      },
    ],
    educationEntries: [
      {
        school: "IIM Bangalore",
        schoolColor: "#1A4480",
        degree: "PGDM",
        field: "Human Resources",
        dates: "2010 — 2012",
      },
    ],
    skillsCategorized: [
      {
        category: "Recruiting",
        skills: [
          { name: "Engineering Hiring", endorsements: 102 },
          { name: "Design Hiring", endorsements: 64 },
          { name: "Candidate Experience", endorsements: 88 },
        ],
      },
    ],
    languages: [
      { name: "English", level: "Native or bilingual" },
      { name: "Kannada", level: "Native" },
      { name: "Tamil", level: "Limited working" },
    ],
    certifications: [],
    activity: [],
    enrichedAt: "Apr 18 · 2:08 PM",
    enrichedAtMs: NOW - 9 * DAY,
    source: ["LinkedIn"],
    status: "In Progress",
    dataQuality: 64,
  },
];

export const ANALYTICS = {
  overview: {
    successful: 42,
    failed: 6,
    inProgress: 4,
  },
  accuracy: 95,
  accuracyPoints: [78, 82, 79, 85, 88, 90, 93, 91, 94, 95],
  accuracyDays: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
};
