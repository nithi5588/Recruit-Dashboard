export type PipelineStageId =
  | "new"
  | "shortlisted"
  | "submitted"
  | "interview"
  | "offered"
  | "placed"
  | "rejected";

export type PipelineStage = {
  id: PipelineStageId;
  label: string;
  color: string;
  soft: string;
  description: string;
};

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "new",         label: "New Profiles", color: "#8B5CF6", soft: "#EEE9FF", description: "Just added to the pool" },
  { id: "shortlisted", label: "Shortlisted",  color: "#5B3DF5", soft: "#E4DAFF", description: "Matched to an open JD" },
  { id: "submitted",   label: "Submitted",    color: "#3B82F6", soft: "#EAF2FF", description: "Sent to client / vendor" },
  { id: "interview",   label: "Interview",    color: "#F97316", soft: "#FFEDD5", description: "Actively interviewing" },
  { id: "offered",     label: "Offered",      color: "#F59E0B", soft: "#FFF4DB", description: "Offer extended" },
  { id: "placed",      label: "Placed",       color: "#22C55E", soft: "#EAFBF1", description: "Deal closed — on billing" },
  { id: "rejected",    label: "Rejected",     color: "#EF4444", soft: "#FDECEC", description: "Not moving forward" },
];

export type PipelinePriority = "High" | "Medium" | "Low";

export type PipelineCard = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  location: string;
  priority: PipelinePriority;
  score: number;               // match score 0–100
  ageInStage: string;          // "3d", "1w"
  updated: string;             // display string
  owner: { name: string; initials: string; color: string };
  nextStep: string;
  tags: string[];
  stage: PipelineStageId;
};

export const pipelineCards: PipelineCard[] = [
  // ─ New Profiles ──────────────────────────────────────────
  { id: "p-1",  name: "Savannah Nguyen",    initials: "SN", avatarColor: "#8B5CF6", role: "Senior Product Designer", location: "New York",      priority: "High",   score: 94, ageInStage: "1d", updated: "2h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#8B5CF6" }, nextStep: "Review resume & screen",        tags: ["Figma", "Design Systems"],           stage: "new" },
  { id: "p-2",  name: "Marvin McKinney",    initials: "MM", avatarColor: "#3B82F6", role: "Full-Stack Engineer",     location: "San Francisco", priority: "Medium", score: 78, ageInStage: "2d", updated: "5h ago",  owner: { name: "Liam Chen",       initials: "LC", color: "#3B82F6" }, nextStep: "Screening call",                tags: ["React", "Node.js"],                  stage: "new" },
  { id: "p-3",  name: "Priya Shah",         initials: "PS", avatarColor: "#22C55E", role: "Data Analyst",             location: "Remote",        priority: "Low",    score: 71, ageInStage: "3d", updated: "1d ago",  owner: { name: "Aarav Mehta",     initials: "AM", color: "#06B6D4" }, nextStep: "Verify work authorization",     tags: ["SQL", "Python"],                     stage: "new" },

  // ─ Shortlisted ───────────────────────────────────────────
  { id: "p-4",  name: "Ralph Edwards",      initials: "RE", avatarColor: "#3B82F6", role: "Frontend Developer",      location: "Austin",        priority: "High",   score: 91, ageInStage: "2d", updated: "1h ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#8B5CF6" }, nextStep: "Match to Acme job",             tags: ["React", "TypeScript"],               stage: "shortlisted" },
  { id: "p-5",  name: "Leslie Alexander",   initials: "LA", avatarColor: "#EC4899", role: "iOS Developer",           location: "Chicago",       priority: "Medium", score: 82, ageInStage: "4d", updated: "6h ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EC4899" }, nextStep: "Share with client",             tags: ["Swift", "SwiftUI"],                  stage: "shortlisted" },
  { id: "p-6",  name: "Dianne Russell",     initials: "DR", avatarColor: "#EC4899", role: "Marketing Manager",       location: "New York",      priority: "High",   score: 87, ageInStage: "1d", updated: "3h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#8B5CF6" }, nextStep: "Prepare submission email",      tags: ["B2B", "Demand Gen"],                 stage: "shortlisted" },

  // ─ Submitted ─────────────────────────────────────────────
  { id: "p-7",  name: "Cameron Williamson", initials: "CW", avatarColor: "#22C55E", role: "Product Manager",          location: "Remote",        priority: "High",   score: 90, ageInStage: "3d", updated: "2h ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#8B5CF6" }, nextStep: "Awaiting feedback — Acme",      tags: ["B2B SaaS", "Fintech"],               stage: "submitted" },
  { id: "p-8",  name: "Esther Howard",      initials: "EH", avatarColor: "#F59E0B", role: "UX Researcher",            location: "Seattle",       priority: "Medium", score: 79, ageInStage: "5d", updated: "1d ago",  owner: { name: "Olivia Brown",    initials: "OB", color: "#F59E0B" }, nextStep: "Nudge recruiter tomorrow",      tags: ["Interviews", "Workshops"],           stage: "submitted" },

  // ─ Interview ─────────────────────────────────────────────
  { id: "p-9",  name: "Wade Warren",        initials: "WW", avatarColor: "#5B3DF5", role: "DevOps Engineer",          location: "Denver",        priority: "High",   score: 88, ageInStage: "2d", updated: "30m ago", owner: { name: "Liam Chen",       initials: "LC", color: "#3B82F6" }, nextStep: "Technical round on Thu",        tags: ["AWS", "Terraform"],                  stage: "interview" },
  { id: "p-10", name: "Theresa Webb",       initials: "TW", avatarColor: "#06B6D4", role: "Data Scientist",           location: "Remote",        priority: "Medium", score: 83, ageInStage: "6d", updated: "4h ago",  owner: { name: "Aarav Mehta",     initials: "AM", color: "#06B6D4" }, nextStep: "Managerial interview prep",     tags: ["ML", "Python"],                      stage: "interview" },

  // ─ Offered ───────────────────────────────────────────────
  { id: "p-11", name: "Cody Fisher",        initials: "CF", avatarColor: "#F59E0B", role: "Backend Engineer",         location: "Boston",        priority: "High",   score: 92, ageInStage: "1d", updated: "45m ago", owner: { name: "Sophia Patel",    initials: "SP", color: "#8B5CF6" }, nextStep: "Send offer letter today",       tags: ["Go", "Postgres"],                    stage: "offered" },
  { id: "p-12", name: "Brooklyn Simmons",   initials: "BS", avatarColor: "#EC4899", role: "Product Designer",         location: "Remote",        priority: "High",   score: 89, ageInStage: "3d", updated: "2h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#8B5CF6" }, nextStep: "Negotiate comp — counter $140k", tags: ["Figma", "Mobile"],                  stage: "offered" },

  // ─ Placed ────────────────────────────────────────────────
  { id: "p-13", name: "Kristin Watson",     initials: "KW", avatarColor: "#22C55E", role: "Engineering Manager",      location: "New York",      priority: "Medium", score: 95, ageInStage: "1w", updated: "2d ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#8B5CF6" }, nextStep: "Confirm start date 5/28",       tags: ["Leadership", "Backend"],             stage: "placed" },
  { id: "p-14", name: "Arlene McCoy",       initials: "AM", avatarColor: "#5B3DF5", role: "Senior QA Engineer",       location: "Remote",        priority: "Low",    score: 86, ageInStage: "2w", updated: "5d ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EC4899" }, nextStep: "Billing kickoff scheduled",     tags: ["Cypress", "Playwright"],             stage: "placed" },

  // ─ Rejected ──────────────────────────────────────────────
  { id: "p-15", name: "Jacob Jones",        initials: "JJ", avatarColor: "#94A3B8", role: "Android Developer",        location: "Atlanta",       priority: "Low",    score: 64, ageInStage: "4d", updated: "2d ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EC4899" }, nextStep: "Re-engage in 3 months",         tags: ["Kotlin"],                            stage: "rejected" },
  { id: "p-16", name: "Bessie Cooper",      initials: "BC", avatarColor: "#94A3B8", role: "Business Analyst",         location: "Chicago",       priority: "Low",    score: 58, ageInStage: "1w", updated: "4d ago",  owner: { name: "Olivia Brown",    initials: "OB", color: "#F59E0B" }, nextStep: "Kept in nurture pool",          tags: ["SQL"],                                stage: "rejected" },
];

export const pipelineOwners = [
  { initials: "ER", name: "Emma Rodriguez", color: "#8B5CF6", candidates: 32 },
  { initials: "SP", name: "Sophia Patel",   color: "#8B5CF6", candidates: 26 },
  { initials: "LC", name: "Liam Chen",      color: "#3B82F6", candidates: 28 },
  { initials: "OB", name: "Olivia Brown",   color: "#F59E0B", candidates: 18 },
  { initials: "NK", name: "Noah Kim",       color: "#EC4899", candidates: 22 },
  { initials: "AM", name: "Aarav Mehta",    color: "#06B6D4", candidates: 16 },
];
