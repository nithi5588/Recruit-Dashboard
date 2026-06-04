// Agency-wide pipeline data for the Owner/Admin pipeline board. Figures mirror
// the approved design mock — swap for live API data when the backend is wired.

export type OwnerStageId = "new" | "submitted" | "interview" | "offered" | "placed";

export type OwnerPipelineStage = {
  id: OwnerStageId;
  label: string;
  accent: string; // dot + icon + progress accent
  soft: string; // tinted tile / progress track
  forecast: string; // weighted $ value shown in the column header
};

// Category accents reuse the same per-stage hues as the recruiter board so the
// colour language stays consistent across both pipeline views.
export const OWNER_PIPELINE_STAGES: OwnerPipelineStage[] = [
  { id: "new",       label: "New / Shortlisted", accent: "#EC4899", soft: "#FCE7F3", forecast: "$27,600" },
  { id: "submitted", label: "Submitted",         accent: "#3B82F6", soft: "#DBEAFE", forecast: "$18,700" },
  { id: "interview", label: "Interview",         accent: "#F59E0B", soft: "#FEF3C7", forecast: "$16,400" },
  { id: "offered",   label: "Offered",           accent: "#8B5CF6", soft: "#EDE9FE", forecast: "$22,000" },
  { id: "placed",    label: "Placed",            accent: "#10B981", soft: "#D1FAE5", forecast: "$48,200" },
];

export type Visa = "H1B" | "GC" | "OPT";

export type OwnerPriority = "High" | "Medium" | "Low";

export type OwnerPipelineOwner = { initials: string; name: string; color: string };

export const ownerPipelineOwners: OwnerPipelineOwner[] = [
  { initials: "SK", name: "Sarah Khan",  color: "#4F46E5" },
  { initials: "AM", name: "Alex Morgan", color: "#F59E0B" },
  { initials: "JB", name: "Jason Brown", color: "#EC4899" },
  { initials: "LC", name: "Liam Chen",   color: "#64748B" },
];

export type OwnerPipelineCard = {
  id: string;
  name: string;
  role: string;
  visa: Visa;
  client: string;
  rate: string;
  priority: OwnerPriority;
  score: number; // match score 0–100
  ownerInitials: string;
  updated: string; // "2d ago"
  placedAgo?: string; // "Placed 2d ago" — shown on placed cards
  stage: OwnerStageId;
};

export const ownerPipelineCards: OwnerPipelineCard[] = [
  // ── New / Shortlisted ────────────────────────────────────────────────────
  { id: "op-1", name: "Vikram Reddy", role: "Java Developer",   visa: "H1B", client: "TechCorp", rate: "$100/hr", priority: "High",   score: 94, ownerInitials: "SK", updated: "2d ago", stage: "new" },
  { id: "op-2", name: "Priya Sharma", role: "DevOps Engineer",  visa: "H1B", client: "FinServe", rate: "$95/hr",  priority: "Medium", score: 82, ownerInitials: "AM", updated: "1d ago", stage: "new" },
  { id: "op-3", name: "Arjun Mehta",  role: "React Developer",  visa: "OPT", client: "Walmart",  rate: "$85/hr",  priority: "Low",    score: 71, ownerInitials: "JB", updated: "3d ago", stage: "new" },

  // ── Submitted ────────────────────────────────────────────────────────────
  { id: "op-4", name: "Michael Johnson", role: "Data Engineer", visa: "GC",  client: "JPMorgan", rate: "$110/hr", priority: "High",   score: 90, ownerInitials: "SK", updated: "3d ago", stage: "submitted" },
  { id: "op-5", name: "Neha Verma",      role: "QA Engineer",   visa: "OPT", client: "Walmart",  rate: "$75/hr",  priority: "Medium", score: 78, ownerInitials: "SK", updated: "1d ago", stage: "submitted" },

  // ── Interview ────────────────────────────────────────────────────────────
  { id: "op-6", name: "Wade Warren",  role: "DevOps Engineer", visa: "H1B", client: "Denver client", rate: "$105/hr", priority: "High",   score: 88, ownerInitials: "LC", updated: "2d ago", stage: "interview" },
  { id: "op-7", name: "Theresa Webb", role: "Data Scientist",  visa: "GC",  client: "Microsoft",     rate: "$120/hr", priority: "Medium", score: 83, ownerInitials: "AM", updated: "1d ago", stage: "interview" },

  // ── Offered ──────────────────────────────────────────────────────────────
  { id: "op-8", name: "Cody Fisher", role: "Backend Engineer", visa: "H1B", client: "Boston client", rate: "$110/hr", priority: "High", score: 92, ownerInitials: "SK", updated: "1d ago", stage: "offered" },
  { id: "op-9", name: "Rohit Patel", role: "Cloud Engineer",   visa: "GC",  client: "Google",        rate: "$115/hr", priority: "High", score: 89, ownerInitials: "JB", updated: "2d ago", stage: "offered" },

  // ── Placed ───────────────────────────────────────────────────────────────
  { id: "op-10", name: "Savannah Nguyen", role: "Data Engineer", visa: "H1B", client: "PayPal", rate: "$105/hr", priority: "Medium", score: 95, ownerInitials: "SK", updated: "2d ago", placedAgo: "Placed 2d ago", stage: "placed" },
  { id: "op-11", name: "Kathryn Murphy",  role: "QA Engineer",   visa: "OPT", client: "Adobe",  rate: "$90/hr",  priority: "Low",    score: 86, ownerInitials: "AM", updated: "5d ago", placedAgo: "Placed 5d ago", stage: "placed" },
];

// Headline KPI cards (top row).
export const ownerPipelineKpis = {
  openPipeline: { value: "84", unit: "candidates", note: "across 8 recruiters" },
  weightedForecast: { value: "$18,000", note: "by stage probability" },
  placedThisMonth: { value: "32", note: "$48,200 margin" },
  winRate: { value: "38%", note: "32 placed • 12 dropped" },
};

// Secondary metric strip (single divided panel).
export const ownerPipelineStrip = {
  benchIdle: { value: "4", note: "$32,000 accruing" },
  conversionRate: { value: "25%", note: "across open pipeline" },
  atRisk: { value: "3", note: "stalled 7+ days in stage" },
};
