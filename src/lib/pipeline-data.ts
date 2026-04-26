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
  { id: "new",         label: "New Profiles", color: "#EA6814", soft: "#FCE9DD", description: "Just added to the pool" },
  { id: "shortlisted", label: "Shortlisted",  color: "#EA6814", soft: "#F8D5BD", description: "Matched to an open JD" },
  { id: "submitted",   label: "Submitted",    color: "#6B6358", soft: "#F4F2EE", description: "Sent to client / vendor" },
  { id: "interview",   label: "Interview",    color: "#F97316", soft: "#FFF6EE", description: "Actively interviewing" },
  { id: "offered",     label: "Offered",      color: "#ED8E55", soft: "#FFF6EE", description: "Offer extended" },
  { id: "placed",      label: "Placed",       color: "#EA6814", soft: "#FCE9DD", description: "Deal closed — on billing" },
  { id: "rejected",    label: "Rejected",     color: "#9F430D", soft: "#F8D5BD", description: "Not moving forward" },
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
  { id: "p-1",  name: "Savannah Nguyen",    initials: "SN", avatarColor: "#EA6814", role: "Senior Product Designer", location: "New York",      priority: "High",   score: 94, ageInStage: "1d", updated: "2h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#EA6814" }, nextStep: "Review resume & screen",        tags: ["Figma", "Design Systems"],           stage: "new" },
  { id: "p-2",  name: "Marvin McKinney",    initials: "MM", avatarColor: "#6B6358", role: "Full-Stack Engineer",     location: "San Francisco", priority: "Medium", score: 78, ageInStage: "2d", updated: "5h ago",  owner: { name: "Liam Chen",       initials: "LC", color: "#6B6358" }, nextStep: "Screening call",                tags: ["React", "Node.js"],                  stage: "new" },
  { id: "p-3",  name: "Priya Shah",         initials: "PS", avatarColor: "#EA6814", role: "Data Analyst",             location: "Remote",        priority: "Low",    score: 71, ageInStage: "3d", updated: "1d ago",  owner: { name: "Aarav Mehta",     initials: "AM", color: "#6B6358" }, nextStep: "Verify work authorization",     tags: ["SQL", "Python"],                     stage: "new" },

  // ─ Shortlisted ───────────────────────────────────────────
  { id: "p-4",  name: "Ralph Edwards",      initials: "RE", avatarColor: "#6B6358", role: "Frontend Developer",      location: "Austin",        priority: "High",   score: 91, ageInStage: "2d", updated: "1h ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#EA6814" }, nextStep: "Match to Acme job",             tags: ["React", "TypeScript"],               stage: "shortlisted" },
  { id: "p-5",  name: "Leslie Alexander",   initials: "LA", avatarColor: "#EA6814", role: "iOS Developer",           location: "Chicago",       priority: "Medium", score: 82, ageInStage: "4d", updated: "6h ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EA6814" }, nextStep: "Share with client",             tags: ["Swift", "SwiftUI"],                  stage: "shortlisted" },
  { id: "p-6",  name: "Dianne Russell",     initials: "DR", avatarColor: "#EA6814", role: "Marketing Manager",       location: "New York",      priority: "High",   score: 87, ageInStage: "1d", updated: "3h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#EA6814" }, nextStep: "Prepare submission email",      tags: ["B2B", "Demand Gen"],                 stage: "shortlisted" },

  // ─ Submitted ─────────────────────────────────────────────
  { id: "p-7",  name: "Cameron Williamson", initials: "CW", avatarColor: "#EA6814", role: "Product Manager",          location: "Remote",        priority: "High",   score: 90, ageInStage: "3d", updated: "2h ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#EA6814" }, nextStep: "Awaiting feedback — Acme",      tags: ["B2B SaaS", "Fintech"],               stage: "submitted" },
  { id: "p-8",  name: "Esther Howard",      initials: "EH", avatarColor: "#ED8E55", role: "UX Researcher",            location: "Seattle",       priority: "Medium", score: 79, ageInStage: "5d", updated: "1d ago",  owner: { name: "Olivia Brown",    initials: "OB", color: "#ED8E55" }, nextStep: "Nudge recruiter tomorrow",      tags: ["Interviews", "Workshops"],           stage: "submitted" },

  // ─ Interview ─────────────────────────────────────────────
  { id: "p-9",  name: "Wade Warren",        initials: "WW", avatarColor: "#EA6814", role: "DevOps Engineer",          location: "Denver",        priority: "High",   score: 88, ageInStage: "2d", updated: "30m ago", owner: { name: "Liam Chen",       initials: "LC", color: "#6B6358" }, nextStep: "Technical round on Thu",        tags: ["AWS", "Terraform"],                  stage: "interview" },
  { id: "p-10", name: "Theresa Webb",       initials: "TW", avatarColor: "#6B6358", role: "Data Scientist",           location: "Remote",        priority: "Medium", score: 83, ageInStage: "6d", updated: "4h ago",  owner: { name: "Aarav Mehta",     initials: "AM", color: "#6B6358" }, nextStep: "Managerial interview prep",     tags: ["ML", "Python"],                      stage: "interview" },

  // ─ Offered ───────────────────────────────────────────────
  { id: "p-11", name: "Cody Fisher",        initials: "CF", avatarColor: "#ED8E55", role: "Backend Engineer",         location: "Boston",        priority: "High",   score: 92, ageInStage: "1d", updated: "45m ago", owner: { name: "Sophia Patel",    initials: "SP", color: "#EA6814" }, nextStep: "Send offer letter today",       tags: ["Go", "Postgres"],                    stage: "offered" },
  { id: "p-12", name: "Brooklyn Simmons",   initials: "BS", avatarColor: "#EA6814", role: "Product Designer",         location: "Remote",        priority: "High",   score: 89, ageInStage: "3d", updated: "2h ago",  owner: { name: "Emma Rodriguez",  initials: "ER", color: "#EA6814" }, nextStep: "Negotiate comp — counter $140k", tags: ["Figma", "Mobile"],                  stage: "offered" },

  // ─ Placed ────────────────────────────────────────────────
  { id: "p-13", name: "Kristin Watson",     initials: "KW", avatarColor: "#EA6814", role: "Engineering Manager",      location: "New York",      priority: "Medium", score: 95, ageInStage: "1w", updated: "2d ago",  owner: { name: "Sophia Patel",    initials: "SP", color: "#EA6814" }, nextStep: "Confirm start date 5/28",       tags: ["Leadership", "Backend"],             stage: "placed" },
  { id: "p-14", name: "Arlene McCoy",       initials: "AM", avatarColor: "#EA6814", role: "Senior QA Engineer",       location: "Remote",        priority: "Low",    score: 86, ageInStage: "2w", updated: "5d ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EA6814" }, nextStep: "Billing kickoff scheduled",     tags: ["Cypress", "Playwright"],             stage: "placed" },

  // ─ Rejected ──────────────────────────────────────────────
  { id: "p-15", name: "Jacob Jones",        initials: "JJ", avatarColor: "#9A9183", role: "Android Developer",        location: "Atlanta",       priority: "Low",    score: 64, ageInStage: "4d", updated: "2d ago",  owner: { name: "Noah Kim",        initials: "NK", color: "#EA6814" }, nextStep: "Re-engage in 3 months",         tags: ["Kotlin"],                            stage: "rejected" },
  { id: "p-16", name: "Bessie Cooper",      initials: "BC", avatarColor: "#9A9183", role: "Business Analyst",         location: "Chicago",       priority: "Low",    score: 58, ageInStage: "1w", updated: "4d ago",  owner: { name: "Olivia Brown",    initials: "OB", color: "#ED8E55" }, nextStep: "Kept in nurture pool",          tags: ["SQL"],                                stage: "rejected" },
];

export const pipelineOwners = [
  { initials: "ER", name: "Emma Rodriguez", color: "#EA6814", candidates: 32 },
  { initials: "SP", name: "Sophia Patel",   color: "#EA6814", candidates: 26 },
  { initials: "LC", name: "Liam Chen",      color: "#6B6358", candidates: 28 },
  { initials: "OB", name: "Olivia Brown",   color: "#ED8E55", candidates: 18 },
  { initials: "NK", name: "Noah Kim",       color: "#EA6814", candidates: 22 },
  { initials: "AM", name: "Aarav Mehta",    color: "#6B6358", candidates: 16 },
];
