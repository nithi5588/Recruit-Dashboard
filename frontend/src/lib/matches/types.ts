export type MatchQuality = "Excellent" | "Good" | "Fair";
export type Seniority = "Junior" | "Mid" | "Senior" | "Lead" | "Principal";
export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  location: string;
  experienceYears: number;
  experienceLabel: string;
  seniority: Seniority;
  verified?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoText: string;
  companyLogoColor: string;
  location: string;
  workMode: WorkMode;
  salaryMin: number;
  salaryMax: number;
  salaryLabel: string;
  applicants: number;
  postedAgo: string;
  source: string;
}

export interface FitBreakdown {
  skills: number;
  location: number;
  seniority: number;
  salary: number;
}

export interface Match {
  id: string;
  candidate: Candidate;
  job: Job;
  score: number;
  quality: MatchQuality;
  fitBreakdown: FitBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  whyMatch: string[];
  saved: boolean;
}

export type MatchTone = "excellent" | "good" | "fair";

export function scoreTone(score: number): MatchTone {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  return "fair";
}

export function qualityFromScore(score: number): MatchQuality {
  const t = scoreTone(score);
  return t === "excellent" ? "Excellent" : t === "good" ? "Good" : "Fair";
}

export function tooltipForBreakdown(key: keyof FitBreakdown, value: number, m: Match): string {
  switch (key) {
    case "skills": {
      const matched = m.matchedSkills.length;
      const total = matched + m.missingSkills.length;
      return total > 0
        ? `Skills: ${value}% — matches ${matched} of ${total} required`
        : `Skills: ${value}%`;
    }
    case "location":
      return value >= 90
        ? `Location: ${value}% — exact match (${m.candidate.location})`
        : value >= 60
          ? `Location: ${value}% — close, may need flex on ${m.job.workMode.toLowerCase()}`
          : `Location: ${value}% — relocation or remote arrangement required`;
    case "seniority":
      return value >= 90
        ? `Seniority: ${value}% — perfectly aligned with ${m.candidate.seniority} level`
        : value >= 70
          ? `Seniority: ${value}% — close to required level`
          : `Seniority: ${value}% — gap in required experience`;
    case "salary":
      return value >= 80
        ? `Salary: ${value}% — comfortably in range (${m.job.salaryLabel})`
        : value >= 50
          ? `Salary: ${value}% — partial overlap, negotiable`
          : `Salary: ${value}% — outside expected range`;
  }
}
