export type MatchQuality = "Excellent" | "Good" | "Fair" | "Low";

export type MatchCandidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  experience: string;
  skills: string[];
  extraSkills: number;
  isVerified: boolean;
  isOnline: boolean;
};

export type MatchJob = {
  id: string;
  title: string;
  company: string;
  isVerified: boolean;
  location: string;
  type: string;
  workMode?: "Remote" | "Hybrid" | "On-site";
  applicants?: number;
  source: string;
  salary: string;
  skills: string[];
  extraSkills: number;
  postedAgo: string;
  logoColor: string;
  logoText: string;
};

export type Match = {
  id: string;
  candidate: MatchCandidate;
  job: MatchJob;
  score: number;
  quality: MatchQuality;
  whyMatch: string[];
  saved: boolean;
};

export const matchStats = {
  total: 156,
  excellent: 56,
  good: 68,
  fair: 20,
  low: 12,
  saved: 12,
  viewed: 8,
};

export const allMatches: Match[] = [
  {
    id: "m1",
    candidate: {
      id: "savannah-nguyen",
      name: "Savannah Nguyen",
      role: "Senior Product Designer",
      location: "Toronto, Canada",
      experience: "5+ years",
      skills: ["Figma", "UI/UX", "Design Systems"],
      extraSkills: 3,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j1",
      title: "Senior Product Designer",
      company: "Shopify",
      isVerified: true,
      location: "Toronto, Canada",
      type: "Full-time",
      workMode: "Hybrid",
      applicants: 45,
      source: "Shopify Careers",
      salary: "$120K – $160K / year",
      skills: ["Figma", "UI/UX", "Design Systems"],
      extraSkills: 2,
      postedAgo: "2 days ago",
      logoColor: "#273DC0",
      logoText: "S",
    },
    score: 93,
    quality: "Excellent",
    whyMatch: [
      "Skills match 95% of job requirements",
      "Location is an exact match — Toronto, Canada",
      "5+ years experience meets the seniority level",
    ],
    saved: false,
  },
  {
    id: "m2",
    candidate: {
      id: "cameron-williamson",
      name: "Cameron Williamson",
      role: "Product Manager",
      location: "New York, NY, US",
      experience: "4+ years",
      skills: ["Product Strategy", "Analytics", "Roadmapping"],
      extraSkills: 2,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j2",
      title: "Product Manager",
      company: "LinkedIn",
      isVerified: true,
      location: "New York, NY, US",
      type: "Full-time",
      source: "LinkedIn Jobs",
      salary: "$130K – $170K / year",
      skills: ["Product Strategy", "Analytics", "Roadmapping"],
      extraSkills: 2,
      postedAgo: "3 days ago",
      logoColor: "#525252",
      logoText: "in",
    },
    score: 88,
    quality: "Excellent",
    whyMatch: [
      "Strong product management background aligns perfectly",
      "Analytics expertise matches core job requirements",
      "Location is an exact match — New York, NY",
    ],
    saved: false,
  },
  {
    id: "m3",
    candidate: {
      id: "esther-howard",
      name: "Esther Howard",
      role: "UX Researcher",
      location: "Austin, TX, US",
      experience: "3+ years",
      skills: ["User Research", "Usability Testing", "Analytics"],
      extraSkills: 2,
      isVerified: true,
      isOnline: false,
    },
    job: {
      id: "j3",
      title: "UX Researcher",
      company: "Google",
      isVerified: true,
      location: "New York, NY, US",
      type: "Full-time",
      source: "Google Careers",
      salary: "$115K – $140K / year",
      skills: ["User Research", "Usability Testing", "Data Analysis"],
      extraSkills: 2,
      postedAgo: "5 days ago",
      logoColor: "#525252",
      logoText: "G",
    },
    score: 76,
    quality: "Good",
    whyMatch: [
      "Research skills cover 85% of the job requirements",
      "Usability testing experience is a strong fit",
      "Location differs — remote consideration needed",
    ],
    saved: true,
  },
  {
    id: "m4",
    candidate: {
      id: "ralph-edwards",
      name: "Ralph Edwards",
      role: "Frontend Developer",
      location: "Remote",
      experience: "4+ years",
      skills: ["React", "TypeScript", "JavaScript"],
      extraSkills: 2,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j4",
      title: "Frontend Developer",
      company: "Atlassian",
      isVerified: true,
      location: "Remote",
      type: "Full-time",
      source: "LinkedIn Jobs",
      salary: "$110K – $135K / year",
      skills: ["React", "TypeScript", "JavaScript"],
      extraSkills: 2,
      postedAgo: "1 week ago",
      logoColor: "#525252",
      logoText: "A",
    },
    score: 72,
    quality: "Good",
    whyMatch: [
      "React and TypeScript skills align well with requirements",
      "Remote role matches candidate's working preference",
      "Experience slightly below the senior-level requirement",
    ],
    saved: false,
  },
  {
    id: "m5",
    candidate: {
      id: "dianne-russell",
      name: "Dianne Russell",
      role: "Marketing Specialist",
      location: "Chicago, IL, US",
      experience: "3+ years",
      skills: ["SEO", "Analytics", "Content Strategy"],
      extraSkills: 2,
      isVerified: false,
      isOnline: false,
    },
    job: {
      id: "j5",
      title: "Growth Marketing Manager",
      company: "Notion",
      isVerified: true,
      location: "San Francisco, CA, US",
      type: "Full-time",
      source: "Notion Careers",
      salary: "$125K – $155K / year",
      skills: ["Growth Marketing", "SEO", "Analytics"],
      extraSkills: 2,
      postedAgo: "1 week ago",
      logoColor: "#0A0A0A",
      logoText: "N",
    },
    score: 65,
    quality: "Fair",
    whyMatch: [
      "SEO and analytics skills partially match requirements",
      "Location requires relocation or remote arrangement",
      "Growth focus area may require ramp-up time",
    ],
    saved: false,
  },
  {
    id: "m6",
    candidate: {
      id: "robert-fox",
      name: "Robert Fox",
      role: "DevOps Engineer",
      location: "Dallas, TX, US",
      experience: "6+ years",
      skills: ["AWS", "Docker", "Kubernetes"],
      extraSkills: 2,
      isVerified: true,
      isOnline: false,
    },
    job: {
      id: "j6",
      title: "Senior DevOps Engineer",
      company: "Amazon",
      isVerified: true,
      location: "Seattle, WA, US",
      type: "Full-time",
      source: "Amazon Jobs",
      salary: "$140K – $180K / year",
      skills: ["AWS", "Docker", "Kubernetes"],
      extraSkills: 3,
      postedAgo: "2 weeks ago",
      logoColor: "#5C6FE7",
      logoText: "A",
    },
    score: 84,
    quality: "Excellent",
    whyMatch: [
      "AWS expertise is a strong and direct match",
      "Docker and Kubernetes experience meets all requirements",
      "6+ years comfortably qualifies for the senior-level role",
    ],
    saved: true,
  },
  {
    id: "m7",
    candidate: {
      id: "kathryn-murphy",
      name: "Kathryn Murphy",
      role: "Data Scientist",
      location: "Austin, TX, US",
      experience: "4+ years",
      skills: ["Python", "TensorFlow", "SQL"],
      extraSkills: 2,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j7",
      title: "ML Engineer",
      company: "Meta",
      isVerified: true,
      location: "Menlo Park, CA, US",
      type: "Full-time",
      source: "Meta Careers",
      salary: "$160K – $200K / year",
      skills: ["Python", "PyTorch", "Machine Learning"],
      extraSkills: 3,
      postedAgo: "4 days ago",
      logoColor: "#525252",
      logoText: "M",
    },
    score: 78,
    quality: "Good",
    whyMatch: [
      "Python and ML skills are strong baseline matches",
      "TensorFlow experience transfers well to PyTorch",
      "Location change or relocation package would be required",
    ],
    saved: false,
  },
  {
    id: "m8",
    candidate: {
      id: "jane-cooper",
      name: "Jane Cooper",
      role: "Backend Engineer",
      location: "San Francisco, CA, US",
      experience: "5+ years",
      skills: ["Node.js", "PostgreSQL", "GraphQL"],
      extraSkills: 2,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j8",
      title: "Senior Backend Engineer",
      company: "Stripe",
      isVerified: true,
      location: "San Francisco, CA, US",
      type: "Full-time",
      source: "Stripe Careers",
      salary: "$145K – $185K / year",
      skills: ["Node.js", "PostgreSQL", "APIs"],
      extraSkills: 2,
      postedAgo: "1 week ago",
      logoColor: "#5C6FE7",
      logoText: "S",
    },
    score: 91,
    quality: "Excellent",
    whyMatch: [
      "Node.js and PostgreSQL expertise is an excellent match",
      "Location is an exact match — San Francisco, CA",
      "GraphQL experience is a valuable bonus skill",
    ],
    saved: false,
  },
  {
    id: "m9",
    candidate: {
      id: "marvin-mckinney",
      name: "Marvin McKinney",
      role: "Full Stack Developer",
      location: "New York, NY, US",
      experience: "5+ years",
      skills: ["Python", "Django", "AWS"],
      extraSkills: 2,
      isVerified: true,
      isOnline: false,
    },
    job: {
      id: "j9",
      title: "Full Stack Engineer",
      company: "Airbnb",
      isVerified: true,
      location: "San Francisco, CA, US",
      type: "Full-time",
      source: "Airbnb Careers",
      salary: "$130K – $165K / year",
      skills: ["Python", "React", "AWS"],
      extraSkills: 2,
      postedAgo: "3 days ago",
      logoColor: "#2E47E0",
      logoText: "A",
    },
    score: 69,
    quality: "Fair",
    whyMatch: [
      "Python and AWS skills are a strong partial match",
      "React frontend experience may need strengthening",
      "Location requires remote arrangement or relocation",
    ],
    saved: true,
  },
  {
    id: "m10",
    candidate: {
      id: "floyd-miles",
      name: "Floyd Miles",
      role: "Cloud Architect",
      location: "Chicago, IL, US",
      experience: "8+ years",
      skills: ["Azure", "AWS", "Terraform"],
      extraSkills: 3,
      isVerified: true,
      isOnline: true,
    },
    job: {
      id: "j10",
      title: "Cloud Solutions Architect",
      company: "Microsoft",
      isVerified: true,
      location: "Redmond, WA, US",
      type: "Full-time",
      source: "Microsoft Careers",
      salary: "$155K – $200K / year",
      skills: ["Azure", "Cloud Architecture", "Terraform"],
      extraSkills: 2,
      postedAgo: "2 days ago",
      logoColor: "#A3A3A3",
      logoText: "M",
    },
    score: 87,
    quality: "Excellent",
    whyMatch: [
      "Azure expertise is a direct and perfect match",
      "8+ years experience comfortably meets architect requirements",
      "Terraform proficiency is highly valued by Microsoft",
    ],
    saved: false,
  },
];
