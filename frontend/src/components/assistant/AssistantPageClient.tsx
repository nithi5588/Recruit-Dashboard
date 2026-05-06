"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback, useMemo, KeyboardEvent } from "react";
import {
  SparklesIcon, PaperPlaneIcon,
  UsersIcon, CalendarIcon, RefreshIcon, MoreIcon,
  ClockIcon, CheckIcon, BarChartMiniIcon, DocumentIcon,
  FilterIcon, TasksIcon, SearchIcon,
  BriefcaseIcon, MatchIcon,
  ChevronLeft, ChevronRight, XIcon,
  PlusIcon, ChatIcon, EditIcon,
} from "@/components/icons/AppIcons";
import { exportToExcel } from "@/lib/export-utils";

const SIDEBAR_MIN = 260;
const SIDEBAR_DEFAULT = 300;
const SIDEBAR_COLLAPSE_THRESHOLD = 200;

/* ──────────────────────────────── types ───────────────────────────────────── */

type Role = "user" | "assistant";

interface Candidate {
  id: string; name: string; initials: string; color: string;
  role: string; exp: string; location: string;
  skills: string[]; score: number;
  availability: "Available" | "2 weeks" | "1 month";
}

interface Msg {
  id: string; role: Role; text: string;
  candidates?: Candidate[]; ts: Date;
}

/* ──────────────────────────────── data ────────────────────────────────────── */

const CANDIDATES: Candidate[] = [
  // ─── Frontend ──────────────────────────────────────────────────────────────
  { id:"c1",  name:"Ananya Sharma",    initials:"AS", color:"var(--color-brand-500)", role:"Senior Frontend Developer", exp:"6 yrs",   location:"Bangalore, KA", skills:["React","TypeScript","Next.js","Tailwind","GraphQL"],          score:95, availability:"Available" },
  { id:"c2",  name:"Rohit Menon",      initials:"RM", color:"#5C6FE7", role:"Frontend Developer",        exp:"3.5 yrs", location:"Bangalore, KA", skills:["React","Vue","CSS","Figma"],                                  score:92, availability:"Available" },
  { id:"c3",  name:"Neha Iyer",        initials:"NI", color:"var(--color-brand-600)", role:"Frontend Engineer",         exp:"5 yrs",   location:"Remote · India",skills:["Angular","React","GraphQL","AWS"],                            score:90, availability:"2 weeks"  },
  { id:"c4",  name:"Karan Patel",      initials:"KP", color:"#5C6FE7", role:"UI Engineer",               exp:"3 yrs",   location:"Mumbai, MH",    skills:["React","Redux","SCSS","Jest"],                                score:85, availability:"Available" },
  { id:"c5",  name:"Divya Reddy",      initials:"DR", color:"var(--color-text-muted)", role:"Frontend Engineer",         exp:"4.5 yrs", location:"Hyderabad, TS", skills:["React","TypeScript","Node.js"],                               score:82, availability:"1 month"  },
  { id:"c6",  name:"Aarav Kapoor",     initials:"AK", color:"var(--color-brand-500)", role:"Staff Frontend Engineer",   exp:"9 yrs",   location:"Pune, MH",      skills:["React","Next.js","TypeScript","Webpack","Performance"],       score:96, availability:"2 weeks"  },
  { id:"c7",  name:"Mira Joshi",       initials:"MJ", color:"#5C6FE7", role:"Frontend Developer",        exp:"2 yrs",   location:"Chennai, TN",   skills:["Vue","Nuxt","TypeScript","Sass"],                             score:78, availability:"Available" },

  // ─── Backend ───────────────────────────────────────────────────────────────
  { id:"c8",  name:"Marvin McKinney",  initials:"MM", color:"var(--color-brand-500)", role:"Senior Backend Developer",  exp:"7 yrs",   location:"Bangalore, KA", skills:["Python","Django","PostgreSQL","Redis","AWS"],                 score:94, availability:"Available" },
  { id:"c9",  name:"Priya Shah",       initials:"PS", color:"var(--color-brand-600)", role:"Backend Engineer",          exp:"4 yrs",   location:"Hyderabad, TS", skills:["Java","Spring Boot","Kafka","MySQL"],                          score:89, availability:"Available" },
  { id:"c10", name:"Ralph Edwards",    initials:"RE", color:"#5C6FE7", role:"Senior Backend Developer",  exp:"8 yrs",   location:"Remote · India",skills:["Go","gRPC","Postgres","Kubernetes"],                          score:91, availability:"1 month"  },
  { id:"c11", name:"Vikram Iyer",      initials:"VI", color:"var(--color-text-muted)", role:"Backend Engineer",          exp:"5 yrs",   location:"Delhi NCR",     skills:["Node.js","Express","MongoDB","TypeScript"],                   score:84, availability:"2 weeks"  },
  { id:"c12", name:"Sanya Khurana",    initials:"SK", color:"var(--color-brand-500)", role:"Staff Backend Engineer",    exp:"10 yrs",  location:"Bangalore, KA", skills:["Rust","Go","Postgres","Kafka","Distributed Systems"],         score:97, availability:"1 month"  },

  // ─── Full-stack ────────────────────────────────────────────────────────────
  { id:"c13", name:"Aditya Verma",     initials:"AV", color:"#5C6FE7", role:"Full-Stack Engineer",       exp:"5 yrs",   location:"Pune, MH",      skills:["React","Node.js","TypeScript","AWS","PostgreSQL"],            score:88, availability:"Available" },
  { id:"c14", name:"Tara Nambiar",     initials:"TN", color:"var(--color-brand-600)", role:"Full-Stack Developer",      exp:"3 yrs",   location:"Bangalore, KA", skills:["Next.js","tRPC","Prisma","TypeScript"],                       score:86, availability:"Available" },

  // ─── DevOps / SRE ──────────────────────────────────────────────────────────
  { id:"c15", name:"Robert Fox",       initials:"RF", color:"var(--color-brand-500)", role:"DevOps Engineer",           exp:"6 yrs",   location:"Hyderabad, TS", skills:["AWS","Docker","Kubernetes","Terraform","Jenkins"],            score:90, availability:"Available" },
  { id:"c16", name:"Ishaan Bose",      initials:"IB", color:"var(--color-text-muted)", role:"Site Reliability Engineer", exp:"4 yrs",   location:"Bangalore, KA", skills:["Kubernetes","Prometheus","GCP","Go","Linux"],                 score:87, availability:"2 weeks"  },

  // ─── Data / ML ─────────────────────────────────────────────────────────────
  { id:"c17", name:"Kathryn Murphy",   initials:"KM", color:"var(--color-brand-500)", role:"Data Scientist",            exp:"5 yrs",   location:"Mumbai, MH",    skills:["Python","TensorFlow","SQL","Power BI","Pandas"],              score:91, availability:"Available" },
  { id:"c18", name:"Cody Fisher",      initials:"CF", color:"#5C6FE7", role:"ML Engineer",               exp:"6 yrs",   location:"Bangalore, KA", skills:["Python","PyTorch","ML","Deep Learning","Kubernetes"],         score:93, availability:"1 month"  },
  { id:"c19", name:"Meera Krishnan",   initials:"MK", color:"var(--color-brand-600)", role:"Data Engineer",             exp:"4 yrs",   location:"Chennai, TN",   skills:["Python","Spark","Airflow","Snowflake","SQL"],                 score:85, availability:"Available" },

  // ─── Mobile ────────────────────────────────────────────────────────────────
  { id:"c20", name:"Arjun Rao",        initials:"AR", color:"#5C6FE7", role:"iOS Engineer",              exp:"5 yrs",   location:"Bangalore, KA", skills:["Swift","SwiftUI","Combine","Core Data"],                      score:88, availability:"Available" },
  { id:"c21", name:"Nikita Sen",       initials:"NS", color:"var(--color-brand-600)", role:"React Native Developer",    exp:"3 yrs",   location:"Remote · India",skills:["React Native","TypeScript","Expo","Firebase"],                score:84, availability:"2 weeks"  },
  { id:"c22", name:"Daksh Malhotra",   initials:"DM", color:"var(--color-text-muted)", role:"Android Engineer",          exp:"4 yrs",   location:"Gurgaon, HR",   skills:["Kotlin","Jetpack Compose","Coroutines","MVVM"],               score:82, availability:"1 month"  },

  // ─── Design ────────────────────────────────────────────────────────────────
  { id:"c23", name:"Savannah Nguyen",  initials:"SN", color:"var(--color-brand-500)", role:"Senior Product Designer",   exp:"6 yrs",   location:"Bangalore, KA", skills:["UI/UX","Figma","Design Systems","Prototyping"],               score:94, availability:"Available" },
  { id:"c24", name:"Esther Howard",    initials:"EH", color:"#5C6FE7", role:"UX Researcher",             exp:"5 yrs",   location:"Mumbai, MH",    skills:["User Research","Figma","Usability Testing","Mixpanel"],       score:87, availability:"2 weeks"  },
  { id:"c25", name:"Arlene McCoy",     initials:"AM", color:"var(--color-brand-600)", role:"UX Designer",               exp:"3 yrs",   location:"Pune, MH",      skills:["Figma","Sketch","Adobe XD","Prototyping"],                    score:80, availability:"Available" },

  // ─── Product / QA ──────────────────────────────────────────────────────────
  { id:"c26", name:"Cameron Williamson", initials:"CW", color:"var(--color-brand-500)", role:"Product Manager",         exp:"7 yrs",   location:"Bangalore, KA", skills:["Roadmapping","Jira","Analytics","Stakeholder Mgmt"],          score:90, availability:"Available" },
  { id:"c27", name:"Jane Cooper",      initials:"JC", color:"var(--color-text-muted)", role:"Senior Product Manager",    exp:"9 yrs",   location:"Hyderabad, TS", skills:["Strategy","Roadmapping","B2B SaaS","Analytics"],              score:92, availability:"1 month"  },
  { id:"c28", name:"Riya Bhatt",       initials:"RB", color:"#5C6FE7", role:"QA Engineer",               exp:"4 yrs",   location:"Bangalore, KA", skills:["Cypress","Playwright","Jest","Selenium","TypeScript"],        score:81, availability:"Available" },
];

/** Heuristic: score how well a candidate matches a free-form prompt. */
function scoreCandidateForQuery(c: Candidate, q: string): number {
  if (!q) return 0;
  const tokens = q
    .toLowerCase()
    .split(/[\s,/]+/)
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return 0;

  const hayParts = [
    c.name.toLowerCase(),
    c.role.toLowerCase(),
    c.location.toLowerCase(),
    c.exp.toLowerCase(),
    c.availability.toLowerCase(),
    c.skills.join(" ").toLowerCase(),
  ];
  const hay = hayParts.join(" • ");

  // Stop words we shouldn't penalise on absence.
  const STOP = new Set([
    "in", "for", "the", "a", "an", "and", "or", "of", "with", "to",
    "find", "show", "me", "top", "best", "candidates", "candidate",
    "developer", "developers", "engineer", "engineers", "available",
    "now", "next", "month", "weeks", "week",
  ]);

  let score = 0;
  let meaningful = 0;
  for (const t of tokens) {
    if (STOP.has(t)) continue;
    meaningful++;
    if (hay.includes(t)) score += 1;
    // Skill exact match bonus
    if (c.skills.some((s) => s.toLowerCase() === t)) score += 0.5;
  }
  // No meaningful tokens — match nothing so we fall back to top-N by score.
  if (meaningful === 0) return 0;
  return score / meaningful;
}

/** Filter + rank candidates for a prompt. Falls back to top-N by fit score. */
function filterCandidates(query: string, limit = 6): Candidate[] {
  const q = query.trim();
  if (!q) {
    return [...CANDIDATES].sort((a, b) => b.score - a.score).slice(0, limit);
  }
  const ranked = CANDIDATES
    .map((c) => ({ c, m: scoreCandidateForQuery(c, q) }))
    .filter((r) => r.m > 0)
    .sort((a, b) => b.m - a.m || b.c.score - a.c.score)
    .map((r) => r.c);
  if (ranked.length === 0) {
    return [...CANDIDATES].sort((a, b) => b.score - a.score).slice(0, limit);
  }
  return ranked.slice(0, limit);
}

const SEED: Msg[] = [
  { id:"s1", role:"user",      text:"Show me top 5 candidates for Frontend Developer role in Bangalore", ts: new Date(Date.now()-120000) },
  {
    id: "s2",
    role: "assistant",
    text: `Here are the top 5 Frontend Developer candidates in Bangalore — ranked by fit score and availability. ${CANDIDATES.length} total candidates in your pool right now.`,
    candidates: filterCandidates("Frontend Developer Bangalore", 5),
    ts: new Date(Date.now() - 115000),
  },
];

/* ─── Conversations (chat history) ─────────────────────────────────────────── */

type Conversation = {
  id: string;
  title: string;
  msgs: Msg[];
  updatedAt: Date;
};

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-current",
    title: "Top frontend devs in Bangalore",
    msgs: SEED,
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "conv-2",
    title: "Match candidates to ML Engineer JD",
    msgs: [],
    updatedAt: new Date(Date.now() - 4 * HOUR),
  },
  {
    id: "conv-3",
    title: "Pipeline summary · this week",
    msgs: [],
    updatedAt: new Date(Date.now() - 8 * HOUR),
  },
  {
    id: "conv-4",
    title: "Interviews scheduled today",
    msgs: [],
    updatedAt: new Date(Date.now() - 1 * DAY),
  },
  {
    id: "conv-5",
    title: "Find Python data scientists",
    msgs: [],
    updatedAt: new Date(Date.now() - 2 * DAY),
  },
  {
    id: "conv-6",
    title: "Top React Native candidates",
    msgs: [],
    updatedAt: new Date(Date.now() - 4 * DAY),
  },
  {
    id: "conv-7",
    title: "DevOps engineers in Hyderabad",
    msgs: [],
    updatedAt: new Date(Date.now() - 6 * DAY),
  },
  {
    id: "conv-8",
    title: "Generate Senior PM job description",
    msgs: [],
    updatedAt: new Date(Date.now() - 12 * DAY),
  },
  {
    id: "conv-9",
    title: "Stalled candidates in Submitted stage",
    msgs: [],
    updatedAt: new Date(Date.now() - 20 * DAY),
  },
];

function groupConversations(convs: Conversation[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday); startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const sevenDaysAgo  = new Date(startOfToday); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date(startOfToday); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const week: Conversation[] = [];
  const month: Conversation[] = [];
  const older: Conversation[] = [];
  for (const c of convs) {
    const t = c.updatedAt;
    if (t >= startOfToday)        today.push(c);
    else if (t >= startOfYesterday) yesterday.push(c);
    else if (t >= sevenDaysAgo)   week.push(c);
    else if (t >= thirtyDaysAgo)  month.push(c);
    else                          older.push(c);
  }
  return [
    { label: "Today",            items: today },
    { label: "Yesterday",        items: yesterday },
    { label: "Previous 7 Days",  items: week },
    { label: "Previous 30 Days", items: month },
    { label: "Older",            items: older },
  ].filter((g) => g.items.length > 0);
}

function deriveTitle(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 40) return clean;
  return clean.slice(0, 40).trimEnd() + "…";
}

type StarterCard = {
  icon: ReactNode;
  title: string;
  hint: string;
  prompt: string;
  scope: Scope;
};

type Scope = "all" | "candidates" | "interviews" | "jobs" | "pipeline" | "tasks";

const STARTER_CARDS_FACTORY = (): StarterCard[] => [
  {
    icon: <UsersIcon size={18} />,
    title: "Find React developers in Bangalore",
    hint: "Top 5 ranked by fit · available now",
    prompt: "Show me the top React developers in Bangalore available immediately",
    scope: "candidates",
  },
  {
    icon: <CalendarIcon size={18} />,
    title: "What's on my interview schedule today?",
    hint: "5 scheduled · next at 10:30 AM",
    prompt: "What interviews are scheduled today?",
    scope: "interviews",
  },
  {
    icon: <BarChartMiniIcon size={18} />,
    title: "Walk me through the pipeline",
    hint: "126 active across 7 stages · 5.6% conv.",
    prompt: "Give me a full pipeline summary with conversion rates",
    scope: "pipeline",
  },
  {
    icon: <MatchIcon size={18} />,
    title: "Match candidates to my newest job",
    hint: "Run AI matching for the latest opening",
    prompt: "Match candidates to my latest open job description",
    scope: "candidates",
  },
];

const SCOPES: { id: Scope; label: string; icon: ReactNode; placeholder: string }[] = [
  { id: "all",         label: "Everything", icon: <SparklesIcon size={15} />,     placeholder: "Ask anything across your recruiting workspace…" },
  { id: "candidates",  label: "Candidates", icon: <UsersIcon size={15} />,        placeholder: "Search candidates by skill, location, availability…" },
  { id: "interviews",  label: "Interviews", icon: <CalendarIcon size={15} />,     placeholder: "Search today's schedule, upcoming interviews…" },
  { id: "jobs",        label: "Jobs",       icon: <BriefcaseIcon size={15} />,    placeholder: "Search open jobs, JDs, requirements…" },
  { id: "pipeline",    label: "Pipeline",   icon: <BarChartMiniIcon size={15} />, placeholder: "Ask about funnel stages, conversion, drop-off…" },
  { id: "tasks",       label: "Tasks",      icon: <CheckIcon size={15} />,        placeholder: "Search follow-ups, due tasks, overdue items…" },
];

const QUICK_ACTIONS = [
  { icon:"users",    label:"Find Candidates",    color:"var(--chip-brand-bg)",   ic:"var(--color-brand-500)", prompt:"Find me the best available candidates" },
  { icon:"match",    label:"Match Candidates",   color:"var(--chip-neutral-bg)", ic:"var(--color-text-secondary)", prompt:"Match candidates to the latest JD" },
  { icon:"doc",      label:"Generate JD",        color:"var(--chip-warning-bg)", ic:"var(--color-brand-400)", prompt:"Help me generate a job description" },
  { icon:"screen",   label:"Screen Resumes",     color:"var(--chip-brand-bg)",   ic:"var(--color-brand-500)", prompt:"Screen and rank resumes for the current role" },
  { icon:"calendar", label:"Schedule Interview", color:"var(--chip-warning-bg)", ic:"var(--color-brand-500)", prompt:"Help me schedule interviews" },
  { icon:"pipeline", label:"Pipeline Summary",   color:"var(--chip-neutral-bg)", ic:"var(--color-text-secondary)", prompt:"Give me a recruitment pipeline summary" },
];

const PINNED = [
  { icon:"doc",   iconColor:"var(--color-brand-500)",      bg:"var(--chip-brand-bg)",   title:"Frontend Developer JD",   meta:"Created by you · May 10" },
  { icon:"users", iconColor:"var(--color-text-secondary)", bg:"var(--chip-neutral-bg)", title:"Top React Developers",    meta:"Smart list · 42 candidates" },
  { icon:"form",  iconColor:"var(--color-brand-500)",      bg:"var(--chip-brand-bg)",   title:"Interview Feedback Form", meta:"Form · 18 responses" },
];

const SNAPSHOT = [
  { label:"Interviews Today",   value:5,  color:"var(--color-brand-500)", bg:"var(--chip-brand-bg)" },
  { label:"Follow-ups Due",     value:8,  color:"var(--color-brand-400)", bg:"var(--chip-warning-bg)" },
  { label:"Offers in Progress", value:3,  color:"var(--color-brand-500)", bg:"var(--chip-brand-bg)" },
  { label:"Tasks Pending",      value:12, color:"var(--color-brand-700)", bg:"var(--chip-error-bg)" },
];

const TOP_WEEK = [
  { name:"Ananya Sharma", role:"Frontend Developer", score:95, initials:"AS", color:"var(--color-brand-500)" },
  { name:"Rohit Menon",   role:"Frontend Developer", score:92, initials:"RM", color:"var(--color-text-secondary)" },
  { name:"Neha Iyer",     role:"Frontend Developer", score:90, initials:"NI", color:"var(--color-brand-500)" },
];

/* ──────────────────────────────── helpers ─────────────────────────────────── */

const uid = () => Math.random().toString(36).slice(2);
const fmt = (d: Date) => d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
const scoreColor = (s: number) => s >= 90 ? "#273DC0" : s >= 80 ? "#525252" : "#273DC0";
const scoreBg    = (s: number) => s >= 90 ? "#E6E9FB" : s >= 80 ? "#F5F5F5" : "#F2F3FD";
const availStyle = (a: Candidate["availability"]) =>
  a === "Available" ? { bg:"#E6E9FB", text:"#273DC0" }
  : a === "2 weeks" ? { bg:"#F5F5F5", text:"#525252" }
  : { bg:"#F2F3FD", text:"#273DC0" };

/* ──────────────────────────────── Typing dots ─────────────────────────────── */

function Dots() {
  return (
    <div style={{ display:"flex", gap:5, padding:"10px 16px", alignItems:"center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:"var(--color-brand-300)",
          animation:`dp 1.2s ease-in-out ${i*0.18}s infinite` }} />
      ))}
    </div>
  );
}

/* ──────────────────────────────── Candidate card ──────────────────────────── */

function CandidateCard({ c }: { c: Candidate }) {
  const av = availStyle(c.availability);
  return (
    <div
      style={{ background:"var(--color-surface)", border:"1.5px solid var(--color-brand-100)", borderRadius:14,
        padding:"14px 16px", display:"flex", gap:13, alignItems:"flex-start",
        transition:"box-shadow .15s, border-color .15s", cursor:"pointer" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor="var(--color-brand-300)"; el.style.boxShadow="0 4px 20px rgba(var(--accent-rgb,46,71,224),0.10)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor="var(--color-brand-100)"; el.style.boxShadow="none"; }}
    >
      <div style={{ width:42, height:42, borderRadius:"50%", background:c.color+"1A", color:c.color,
        display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, flexShrink:0 }}>
        {c.initials}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
          <span style={{ fontSize:14, fontWeight:700, color:"var(--color-text)" }}>{c.name}</span>
          <span style={{ background:av.bg, color:av.text, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{c.availability}</span>
        </div>
        <div style={{ fontSize:12, color:"var(--color-text-secondary)", marginBottom:8 }}>{c.role} · {c.exp} · 📍 {c.location}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {c.skills.map(sk => (
            <span key={sk} style={{ background:"var(--color-surface-2)", color:"var(--color-text-secondary)", fontSize:11, padding:"2px 8px", borderRadius:6, fontWeight:500 }}>{sk}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
        <span style={{ background:scoreBg(c.score), color:scoreColor(c.score), fontSize:13, fontWeight:800, padding:"3px 11px", borderRadius:999 }}>
          {c.score}% Match
        </span>
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ height:29, padding:"0 11px", borderRadius:8, border:"1.5px solid var(--color-border)", background:"var(--color-surface)", fontSize:12, fontWeight:600, color:"var(--color-text)", cursor:"pointer", transition:"border-color .12s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor="var(--color-brand-500)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor="var(--color-border)")}>View Profile</button>
          <button style={{ height:29, padding:"0 11px", borderRadius:8, border:"none", background:"var(--color-brand-500)", fontSize:12, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .12s" }}
            onMouseEnter={e => (e.currentTarget.style.background="#273DC0")}
            onMouseLeave={e => (e.currentTarget.style.background="#2E47E0")}>Add to Pipeline</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────── QA icon ─────────────────────────────────── */

function QAIcon({ icon, color }: { icon: string; color: string }) {
  const p = { size:14, style:{ color } };
  if (icon === "users")    return <UsersIcon {...p} />;
  if (icon === "match")    return <FilterIcon {...p} />;
  if (icon === "doc")      return <DocumentIcon {...p} />;
  if (icon === "screen")   return <TasksIcon {...p} />;
  if (icon === "calendar") return <CalendarIcon {...p} />;
  return <BarChartMiniIcon {...p} />;
}

/* ──────────────────────────────── Main ────────────────────────────────────── */

export function AssistantPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [activeId, setActiveId]           = useState<string>(SEED_CONVERSATIONS[0].id);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [scope, setScope]   = useState<Scope>("all");
  const [historySearch, setHistorySearch] = useState("");
  const STARTER_CARDS = STARTER_CARDS_FACTORY();

  const activeConv = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const msgs = useMemo(() => activeConv?.msgs ?? [], [activeConv]);

  const groupedConvs = useMemo(() => {
    const lowered = historySearch.trim().toLowerCase();
    const filtered = lowered
      ? conversations.filter((c) => c.title.toLowerCase().includes(lowered))
      : conversations;
    return groupConversations(filtered);
  }, [conversations, historySearch]);

  // ── Responsive sidebar state ───────────────────────────────
  const [sidebarWidth, setSidebarWidth]       = useState(SIDEBAR_DEFAULT);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]            = useState(false);
  const [isMobile, setIsMobile]                = useState(false);
  const [isDragging, setIsDragging]            = useState(false);

  // Chat history (left) sidebar state
  const [historyCollapsed, setHistoryCollapsed] = useState(false);
  const [historyMobileOpen, setHistoryMobileOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  // Consume ?q= from URL (e.g. submitted from dashboard AI Assistant) once on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (!q) return;
    const trimmed = q.trim();
    if (!trimmed) return;
    const newId = uid();
    const userMsg: Msg = { id: uid(), role: "user", text: trimmed, ts: new Date() };
    setConversations((prev) => [
      { id: newId, title: deriveTitle(trimmed), msgs: [userMsg], updatedAt: new Date() },
      ...prev,
    ]);
    setActiveId(newId);
    setTyping(true);
    const timer = setTimeout(() => {
      const reply = generateReply(trimmed, "all");
      setConversations((prev) =>
        prev.map((c) =>
          c.id === newId ? { ...c, msgs: [...c.msgs, reply], updatedAt: new Date() } : c,
        ),
      );
      setTyping(false);
    }, 1400);
    params.delete("q");
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect mobile & recompute max width on resize
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? "hidden" : prev;
    return () => { document.body.style.overflow = prev; };
  }, [isMobile, mobileOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Pointer-based resize handler
  const startResize = useCallback((e: React.PointerEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: PointerEvent) => {
      const raw = window.innerWidth - ev.clientX;
      // Hard limits while dragging: 100 → max 60% viewport (or viewport - 320 for main)
      const maxW = Math.min(Math.max(window.innerWidth * 0.6, 420), window.innerWidth - 320);
      setSidebarWidth(Math.max(100, Math.min(maxW, raw)));
    };
    const onUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      // Snap: if below threshold, collapse; else clamp to min
      setSidebarWidth((w) => {
        if (w < SIDEBAR_COLLAPSE_THRESHOLD) {
          setSidebarCollapsed(true);
          return SIDEBAR_DEFAULT;
        }
        if (w < SIDEBAR_MIN) return SIDEBAR_MIN;
        return w;
      });
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [isMobile]);

  // Double-click the resizer → expand to max (extreme left)
  const expandToMax = useCallback(() => {
    if (isMobile) return;
    const maxW = Math.min(Math.max(window.innerWidth * 0.6, 420), window.innerWidth - 320);
    setSidebarWidth(maxW);
    setSidebarCollapsed(false);
  }, [isMobile]);

  const togglePanel = useCallback(() => {
    if (isMobile) setMobileOpen((o) => !o);
    else setSidebarCollapsed((c) => !c);
  }, [isMobile]);

  const toggleHistory = () => {
    if (isMobile) setHistoryMobileOpen((o) => !o);
    else setHistoryCollapsed((c) => !c);
  };

  // Lock body scroll when history drawer is open on mobile
  useEffect(() => {
    if (!isMobile) return;
    if (!historyMobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isMobile, historyMobileOpen]);

  // Close history drawer on Escape (mobile)
  useEffect(() => {
    if (!historyMobileOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") setHistoryMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [historyMobileOpen]);

  const newChat = () => {
    const id = uid();
    const conv: Conversation = { id, title: "New chat", msgs: [], updatedAt: new Date() };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(id);
    setInput("");
    setScope("all");
    setHistoryMobileOpen(false);
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setInput("");
    setHistoryMobileOpen(false);
  };

  const deleteConversation = (id: string) => {
    const idx = conversations.findIndex((c) => c.id === id);
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const fresh: Conversation = { id: uid(), title: "New chat", msgs: [], updatedAt: new Date() };
      setConversations([fresh]);
      setActiveId(fresh.id);
      return;
    }
    setConversations(remaining);
    if (id === activeId) {
      const fallback = conversations[idx + 1] ?? conversations[idx - 1] ?? remaining[0];
      setActiveId(fallback.id);
    }
  };

  const renameConversation = (id: string, title: string) => {
    const clean = title.trim();
    if (!clean) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: clean } : c)),
    );
  };

  function send(text: string, overrideScope?: Scope) {
    const t = text.trim();
    if (!t) return;
    const useScope: Scope = overrideScope ?? scope;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        const isFirstUserMsg = !c.msgs.some((m) => m.role === "user");
        return {
          ...c,
          title: isFirstUserMsg ? deriveTitle(t) : c.title,
          msgs: [...c.msgs, { id: uid(), role: "user", text: t, ts: new Date() }],
          updatedAt: new Date(),
        };
      }),
    );
    setInput(""); setTyping(true);
    setTimeout(() => {
      const reply = generateReply(t, useScope);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, msgs: [...c.msgs, reply], updatedAt: new Date() } : c,
        ),
      );
      setTyping(false);
    }, 1400);
  }

  // Scope-aware responses — if a scope is locked, the AI only searches that
  // surface. With "all", it falls back to keyword detection.
  function generateReply(t: string, useScope: Scope): Msg {
    const wantsCandidates =
      useScope === "candidates" ||
      (useScope === "all" && /candidate|find|developer|engineer|designer|python|react|frontend|backend|java|devops|angular|node/i.test(t));

    if (wantsCandidates) {
      const matches = filterCandidates(t, 6);
      const text =
        matches.length === 0
          ? `No candidates matched "${t}" exactly. Showing the top performers from your pool instead.`
          : useScope === "candidates"
            ? `Found ${matches.length} candidate${matches.length === 1 ? "" : "s"} matching "${t}". Ranked by fit score & availability.`
            : `Here are ${matches.length} candidate${matches.length === 1 ? "" : "s"} matching "${t}", ranked by fit score and availability.`;
      return {
        id: uid(),
        role: "assistant",
        text,
        candidates: matches,
        ts: new Date(),
      };
    }

    if (useScope === "interviews" || (useScope === "all" && /interview|schedule|today|tomorrow/i.test(t))) {
      return {
        id: uid(),
        role: "assistant",
        text: "You have 5 interviews today:\n• 10:30 AM — Client call with TechCorp (John Smith)\n• 1:00 PM — Technical round · Marvin McKinney (Senior Developer)\n• 3:00 PM — HR round · Cameron Williamson (Product Manager)\n• 4:30 PM — Final round · Dianne Russell (Marketing Manager)\n• 5:30 PM — Screening · Esther Howard (UX Researcher)",
        ts: new Date(),
      };
    }

    if (useScope === "jobs" || (useScope === "all" && /\bjob|jd|opening|posting|role open/i.test(t))) {
      return {
        id: uid(),
        role: "assistant",
        text: "You have 24 active jobs across 5 departments:\n• Engineering — 12 (Frontend Developer, Backend Engineer, DevOps, ML Engineer)\n• Design — 5 (Product Designer, UX Researcher, UI Engineer)\n• Marketing — 3 (Marketing Manager, Content Lead, Demand Gen)\n• Product — 2 (PM, Senior PM)\n• Data — 2 (Data Analyst, Data Scientist)\n\nFrontend Developer has the highest application volume (45). Marketing Manager has the longest time-to-fill (35 days).",
        ts: new Date(),
      };
    }

    if (useScope === "pipeline" || (useScope === "all" && /pipeline|funnel|stage|conversion|drop[- ]?off/i.test(t))) {
      return {
        id: uid(),
        role: "assistant",
        text: "Pipeline snapshot — 89 active candidates:\n• 18 New Profiles\n• 24 Shortlisted\n• 12 Submitted to clients\n• 8 in Interview\n• 5 with active Offers\n• 7 Placed (this period)\n• 15 Rejected\n\nApplication → Placement conversion: 5.6%. Biggest drop-off is Submitted → Interview (33% pass-through). Want me to highlight stalled candidates?",
        ts: new Date(),
      };
    }

    if (useScope === "tasks" || (useScope === "all" && /task|follow[- ]?up|due|overdue|reminder/i.test(t))) {
      return {
        id: uid(),
        role: "assistant",
        text: "12 pending tasks · 7 overdue (4 high priority) · 8 due today.\n\nTop actions for today:\n• ⚠ Nudge Acme on Cameron Williamson submission (3 days waiting)\n• Call Ralph Edwards — Frontend Developer screen (due 3 PM)\n• Email Dianne Russell offer letter (due EOD)\n• Follow up with Marcus Lee — overdue from yesterday",
        ts: new Date(),
      };
    }

    // Generic / fallback
    const scopeLabel = SCOPES.find(s => s.id === useScope)?.label ?? "Everything";
    return {
      id: uid(),
      role: "assistant",
      text: useScope === "all"
        ? `I've analyzed your request: "${t}". I can search candidates, interviews, jobs, the pipeline, or tasks. Pick a focus from the toolbar below or be more specific.`
        : `Searching ${scopeLabel.toLowerCase()} for "${t}" — but I couldn't find a strong match. Try a different keyword or switch scope using the toolbar.`,
      ts: new Date(),
    };
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  return (
    <>
      {/* ── Global CSS — all surfaces use theme tokens so dark mode works ─── */}
      <style>{`
        .assist-root    { display:flex; height:calc(100dvh - 64px); background:var(--color-bg-base); overflow:hidden; position:relative; }
        .assist-main    { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; background:var(--color-bg-base); }
        .chat-inner     { max-width:820px; margin:0 auto; width:100%; }

        /* ── Chat history sidebar (left, ChatGPT style) ───────────────── */
        .assist-history { width:272px; flex-shrink:0; display:flex; flex-direction:column;
          background:var(--color-surface); border-right:1.5px solid var(--color-border);
          overflow:hidden; transition:width .22s ease, opacity .18s; }
        .assist-history.is-collapsed { width:0; border-right:none; opacity:0; pointer-events:none; }
        .hist-head      { padding:12px 12px 8px; display:flex; flex-direction:column; gap:8px; flex-shrink:0;
          border-bottom:1px solid var(--color-border); }
        .hist-newchat   { display:flex; align-items:center; justify-content:space-between; gap:8px;
          padding:9px 12px; border-radius:10px; border:1.5px dashed var(--color-border);
          background:var(--color-surface); color:var(--color-text); cursor:pointer;
          font-size:13px; font-weight:600; transition:all .15s; }
        .hist-newchat:hover { border-color:var(--color-brand-300); background:var(--color-brand-50); color:var(--color-brand-600); }
        .hist-search    { display:flex; align-items:center; gap:8px; padding:8px 11px;
          border:1.5px solid var(--color-border); border-radius:10px; background:var(--color-surface);
          transition:border-color .15s, box-shadow .15s; }
        .hist-search:focus-within { border-color:var(--color-brand-500); box-shadow:0 0 0 3px rgba(var(--accent-rgb,46,71,224),.10); }
        .hist-search input { flex:1; min-width:0; border:none; outline:none; background:transparent;
          font-size:12.5px; color:var(--color-text); font-family:inherit; }
        .hist-search input::placeholder { color:var(--color-text-muted); }
        .hist-list      { flex:1; overflow-y:auto; padding:8px 6px 12px; }
        .hist-list::-webkit-scrollbar { width:6px; }
        .hist-list::-webkit-scrollbar-thumb { background:var(--color-border); border-radius:3px; }
        .hist-section-label { padding:10px 8px 4px; font-size:10px; font-weight:700; letter-spacing:.06em;
          text-transform:uppercase; color:var(--color-text-muted); }
        .hist-empty     { padding:18px 8px; text-align:center; font-size:12px; color:var(--color-text-muted); }

        .hist-item      { position:relative; display:flex; align-items:center; gap:9px;
          width:100%; padding:9px 10px; margin:1px 0; border:none; border-radius:9px;
          background:transparent; color:var(--color-text-secondary); cursor:pointer; text-align:left;
          font-size:13px; font-weight:500; transition:background .12s, color .12s; }
        .hist-item:hover { background:var(--color-surface-2); color:var(--color-text); }
        .hist-item.is-active { background:var(--color-brand-50); color:var(--color-brand-600); font-weight:600; }
        .hist-item.is-active::before { content:""; position:absolute; left:2px; top:8px; bottom:8px; width:2px;
          border-radius:2px; background:var(--color-brand-500); }
        .hist-item .hist-title { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; line-height:1.35; }
        .hist-item .hist-icon  { flex-shrink:0; opacity:.7; }
        .hist-item.is-active .hist-icon { opacity:1; }

        .hist-actions   { position:absolute; right:6px; top:50%; transform:translateY(-50%);
          display:flex; gap:2px; opacity:0; transition:opacity .12s; pointer-events:none; }
        .hist-item:hover .hist-actions, .hist-item:focus-within .hist-actions { opacity:1; pointer-events:auto; }
        .hist-action-btn { width:24px; height:24px; border-radius:6px; border:none; background:transparent;
          color:var(--color-text-muted); cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:background .12s, color .12s; }
        .hist-action-btn:hover { background:var(--color-surface); color:var(--color-text); }
        .hist-action-btn.is-danger:hover { background:var(--color-error-light); color:var(--color-error); }

        .hist-foot      { padding:10px 12px; border-top:1px solid var(--color-border); flex-shrink:0;
          display:flex; align-items:center; gap:9px; background:var(--color-surface); }
        .hist-foot-avatar { width:30px; height:30px; border-radius:50%;
          background:var(--color-brand-500);
          color:#fff; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

        .hist-toggle-rail { position:relative; flex-shrink:0; width:14px; cursor:pointer;
          display:flex; align-items:center; justify-content:center; background:transparent;
          border:none; padding:0; z-index:5; }
        .hist-toggle-rail::before { content:""; position:absolute; top:0; bottom:0; left:50%; width:1.5px; background:var(--color-border); transform:translateX(-50%); transition:background .15s; }
        .hist-toggle-rail:hover::before { background:var(--color-brand-300); }
        .hist-toggle-rail .hist-toggle-pill { position:relative; width:18px; height:34px; border-radius:6px;
          background:var(--color-surface); border:1.5px solid var(--color-border); display:flex; align-items:center; justify-content:center;
          color:var(--color-text-secondary); transition:border-color .15s, color .15s, background .15s; }
        .hist-toggle-rail:hover .hist-toggle-pill { border-color:var(--color-brand-300); color:var(--color-brand-600); background:var(--color-brand-50); }

        @media(max-width:899px){
          .assist-history { position:fixed; left:0; top:0; bottom:0; z-index:60; width:min(86vw, 320px) !important;
            transform:translateX(-100%); transition:transform .25s ease-out; box-shadow:8px 0 30px rgba(0,0,0,.22);
            border-right:1.5px solid var(--color-border); opacity:1; pointer-events:auto; }
          .assist-history.mobile-open { transform:translateX(0); }
          .assist-history.is-collapsed { transform:translateX(-100%); width:min(86vw, 320px) !important; opacity:1; pointer-events:auto; }
          .hist-toggle-rail { display:none; }
        }


        /* Desktop resizable sidebar */
        .assist-sidebar { background:var(--color-surface); overflow-y:auto; flex-shrink:0; position:relative; transition:box-shadow .18s; }
        .assist-sidebar.is-docked { border-left:1.5px solid var(--color-border); }
        .assist-sidebar.is-dragging { box-shadow:-8px 0 24px rgba(0,0,0,.18); transition:none; }

        /* Resizer bar */
        .assist-resizer { width:6px; flex-shrink:0; cursor:ew-resize; position:relative; background:transparent; touch-action:none; z-index:5; }
        .assist-resizer::before { content:""; position:absolute; top:0; bottom:0; left:50%; width:1.5px; background:var(--color-border); transform:translateX(-50%); transition:background .15s, width .15s; }
        .assist-resizer:hover::before, .assist-resizer.is-dragging::before { background:var(--color-brand-500); width:3px; }
        .assist-resizer::after { content:""; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:3px; height:28px; border-radius:2px; background:var(--color-brand-300); opacity:0; transition:opacity .15s; }
        .assist-resizer:hover::after, .assist-resizer.is-dragging::after { opacity:1; }

        /* Collapsed rail — shows when sidebar hidden on desktop */
        .assist-rail { position:absolute; right:0; top:50%; transform:translateY(-50%); z-index:20; display:flex; flex-direction:column; align-items:center; gap:4px; background:var(--color-surface); border:1.5px solid var(--color-border); border-right:none; border-radius:12px 0 0 12px; padding:10px 6px; box-shadow:-4px 4px 14px rgba(0,0,0,.08); cursor:pointer; transition:border-color .15s, box-shadow .15s; }
        .assist-rail:hover { border-color:var(--color-brand-300); box-shadow:-4px 4px 18px rgba(var(--accent-rgb,46,71,224),.18); }
        .assist-rail span { writing-mode:vertical-rl; transform:rotate(180deg); font-size:11px; font-weight:700; color:var(--color-brand-500); letter-spacing:.04em; }

        /* Header toggle button */
        .assist-toggle { display:none; }
        @media(max-width:1100px){ .assist-toggle { display:inline-flex; } }

        /* Mobile drawer */
        .assist-backdrop { display:none; }
        @media(max-width:899px){
          .assist-sidebar { position:fixed; top:0; right:0; bottom:0; width:min(86vw, 360px) !important; z-index:60; transform:translateX(100%); transition:transform .25s ease-out; box-shadow:-8px 0 30px rgba(0,0,0,.22); border-left:1.5px solid var(--color-border); }
          .assist-sidebar.mobile-open { transform:translateX(0); }
          .assist-resizer { display:none; }
          .assist-rail { display:none; }
          .assist-backdrop { display:block; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:55; opacity:0; pointer-events:none; transition:opacity .2s; }
          .assist-backdrop.mobile-open { opacity:1; pointer-events:auto; }
        }

        @keyframes dp { 0%,60%,100%{ transform:translateY(0);opacity:.4 } 30%{ transform:translateY(-7px);opacity:1 } }

        .starter-card { transition:border-color .15s, box-shadow .15s, transform .15s; }
        .starter-card:hover { border-color:var(--color-brand-300) !important; box-shadow:0 4px 16px rgba(var(--accent-rgb,46,71,224),.10) !important; transform:translateY(-2px); }

        .input-box { border:1.5px solid var(--color-border); border-radius:16px; background:var(--color-surface); transition:border-color .2s, box-shadow .2s; }
        .input-box:focus-within { border-color:var(--color-brand-500); box-shadow:0 0 0 3px rgba(var(--accent-rgb,46,71,224),.10); }

        .qa-btn { background:var(--color-surface) !important; border-color:var(--color-border) !important; transition:all .15s; }
        .qa-btn:hover { border-color:var(--color-brand-300) !important; background:var(--color-surface-2) !important; transform:translateY(-2px); box-shadow:0 4px 14px rgba(var(--accent-rgb,46,71,224),.08); }

        .pin-btn { transition:all .12s; }
        .pin-btn:hover { border-color:var(--color-brand-300) !important; background:var(--color-surface-2) !important; }

        .tb-btn { transition:background .12s, color .12s; }
        .tb-btn:hover { background:var(--color-brand-100) !important; color:var(--color-brand-600) !important; }

        .scope-btn:hover { background: var(--color-surface-2) !important; color: var(--color-text) !important; }
        .scope-btn[aria-pressed="true"]:hover { background: var(--color-brand-200) !important; }
      `}</style>

      <div className="assist-root">

        {/* ══ CHAT HISTORY (left, ChatGPT-inspired) ═══════════════════════ */}
        <aside
          className={[
            "assist-history",
            !isMobile && historyCollapsed ? "is-collapsed" : "",
            isMobile && historyMobileOpen ? "mobile-open" : "",
            isMobile && !historyMobileOpen ? "is-collapsed" : "",
          ].filter(Boolean).join(" ")}
          aria-label="Chat history"
          aria-hidden={isMobile ? !historyMobileOpen : historyCollapsed}
        >
          <div className="hist-head">
            <button type="button" onClick={newChat} className="hist-newchat" aria-label="Start new chat">
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                <PlusIcon size={14} />
                New chat
              </span>
              <SparklesIcon size={13} style={{ color:"var(--color-brand-500)" }} />
            </button>
            <div className="hist-search">
              <SearchIcon size={13} style={{ color:"var(--color-text-muted)" }} />
              <input
                type="text"
                placeholder="Search chats…"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                aria-label="Search chats"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch("")}
                  aria-label="Clear search"
                  className="hist-action-btn"
                  style={{ width:20, height:20 }}
                >
                  <XIcon size={10} />
                </button>
              )}
            </div>
          </div>

          <div className="hist-list">
            {groupedConvs.length === 0 ? (
              <p className="hist-empty">No chats found</p>
            ) : (
              groupedConvs.map((g) => (
                <div key={g.label}>
                  <p className="hist-section-label">{g.label}</p>
                  {g.items.map((c) => {
                    const isActive = c.id === activeId;
                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectConversation(c.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectConversation(c.id);
                          }
                        }}
                        className={`hist-item${isActive ? " is-active" : ""}`}
                        title={c.title}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <ChatIcon size={14} className="hist-icon" />
                        <span className="hist-title">{c.title}</span>
                        <div className="hist-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            aria-label={`Rename ${c.title}`}
                            className="hist-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const t = window.prompt("Rename chat", c.title);
                              if (t) renameConversation(c.id, t);
                            }}
                          >
                            <EditIcon size={11} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${c.title}`}
                            className="hist-action-btn is-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(c.id);
                            }}
                          >
                            <XIcon size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="hist-foot">
            <span className="hist-foot-avatar" aria-hidden>N</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--color-text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                Nithish
              </div>
              <div style={{ fontSize:10.5, color:"var(--color-text-muted)" }}>
                {conversations.length} chat{conversations.length === 1 ? "" : "s"}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleHistory}
              aria-label="Hide chat history"
              style={{ width:28, height:28, borderRadius:7, border:"1.5px solid var(--color-border)",
                background:"var(--color-surface)", color:"var(--color-text-secondary)",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <ChevronLeft size={13} />
            </button>
          </div>
        </aside>

        {/* History toggle rail when collapsed (desktop) */}
        {!isMobile && historyCollapsed && (
          <button
            type="button"
            onClick={() => setHistoryCollapsed(false)}
            className="hist-toggle-rail"
            aria-label="Show chat history"
            title="Show chat history"
          >
            <div className="hist-toggle-pill">
              <ChevronRight size={12} />
            </div>
          </button>
        )}

        {/* Mobile backdrop for history drawer */}
        <div
          className={`assist-backdrop${historyMobileOpen ? " mobile-open" : ""}`}
          onClick={() => setHistoryMobileOpen(false)}
          aria-hidden
          style={{ zIndex: 55 }}
        />

        {/* ══ MAIN ════════════════════════════════════════════════════════ */}
        <div className="assist-main">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div style={{ padding:"13px 20px", borderBottom:"1.5px solid var(--color-border)", background:"var(--color-surface)", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                  background:"var(--color-brand-500)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 3px 12px rgba(46,71,224,.32)" }}>
                  <SparklesIcon size={18} style={{ color:"#fff" }} />
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:"var(--color-text)", letterSpacing:"-.3px" }}>
                      AI Recruiting Assistant
                    </h1>
                    <span style={{ background:"var(--chip-brand-bg)", color:"var(--color-brand-600)", fontSize:10, fontWeight:700,
                      padding:"2px 9px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--color-brand-500)" }} />
                      Online
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:"var(--color-text-muted)", marginTop:1 }}>
                    Powered by Claude 3 · Context-aware recruiting intelligence
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <button
                  onClick={toggleHistory}
                  aria-label={(isMobile ? historyMobileOpen : !historyCollapsed) ? "Hide chat history" : "Show chat history"}
                  className="hist-btn"
                  style={{ height:34, padding:"0 13px", borderRadius:9, border:"1.5px solid var(--color-border)", background:"var(--color-surface)", color:"var(--color-text-secondary)", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}
                >
                  <ClockIcon size={13} /> History
                </button>
                <button onClick={newChat}
                  style={{ height:34, padding:"0 13px", borderRadius:9, border:"none",
                    background:"var(--color-brand-500)", color:"#fff",
                    fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5,
                    boxShadow:"0 2px 10px rgba(46,71,224,.28)" }}>
                  <SparklesIcon size={13} /> New Chat
                </button>
                <button
                  type="button"
                  onClick={togglePanel}
                  aria-label={(isMobile ? mobileOpen : !sidebarCollapsed) ? "Close panel" : "Open panel"}
                  className="assist-toggle"
                  style={{ width:34, height:34, borderRadius:9, border:"1.5px solid var(--color-border)",
                    background:"var(--color-surface)", color:"var(--color-text-secondary)", cursor:"pointer",
                    alignItems:"center", justifyContent:"center" }}
                >
                  {(isMobile ? mobileOpen : !sidebarCollapsed) ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────────── */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 20px 12px" }}>
            <div className="chat-inner" style={{ display:"flex", flexDirection:"column", gap:24 }}>

              {msgs.length === 0 && (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, padding:"48px 0 32px", gap:32 }}>
                  {/* greeting */}
                  <div style={{ textAlign:"center" }}>
                    <div style={{ width:56, height:56, borderRadius:18, margin:"0 auto 14px",
                      background:"var(--color-brand-500)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 6px 24px rgba(46,71,224,.28)" }}>
                      <SparklesIcon size={26} style={{ color:"#fff" }} />
                    </div>
                    <p style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:"var(--color-text)" }}>Hi Nithish 👋</p>
                    <p style={{ margin:0, fontSize:14, color:"var(--color-text-secondary)" }}>How can I help with recruiting today?</p>
                  </div>

                  {/* starter cards */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, width:"100%", maxWidth:640 }}>
                    {STARTER_CARDS.map(card => (
                      <button key={card.prompt}
                        className="starter-card"
                        onClick={() => { setScope(card.scope); send(card.prompt, card.scope); }}
                        style={{
                          textAlign:"left", padding:"16px",
                          background:"var(--color-surface)",
                          border:"1.5px solid var(--color-border)",
                          borderRadius:16, cursor:"pointer",
                          boxShadow:"0 2px 8px rgba(31,27,23,.04)",
                          display:"flex", flexDirection:"column", gap:10,
                        }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{
                            width:34, height:34, borderRadius:10, flexShrink:0,
                            background:"var(--color-brand-100)",
                            color:"var(--color-brand-600)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                          }}>
                            {card.icon}
                          </span>
                          <span style={{
                            fontSize:9, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
                            color:"var(--color-text-muted)",
                          }}>
                            {SCOPES.find(s => s.id === card.scope)?.label}
                          </span>
                        </div>
                        <p style={{ margin:0, fontSize:13.5, fontWeight:700, color:"var(--color-text)", lineHeight:1.4 }}>
                          {card.title}
                        </p>
                        <p style={{ margin:0, fontSize:11.5, fontWeight:500, color:"var(--color-text-secondary)", lineHeight:1.45 }}>
                          {card.hint}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {msgs.map(m => m.role === "user" ? (
                /* ── User message ── */
                <div key={m.id} style={{ display:"flex", justifyContent:"flex-end", gap:10, alignItems:"flex-end" }}>
                  <div style={{ maxWidth:"72%" }}>
                    <div style={{ background:"var(--color-brand-500)",
                      color:"#fff", borderRadius:"18px 18px 4px 18px",
                      padding:"12px 16px", fontSize:14, lineHeight:1.65,
                      boxShadow:"0 4px 18px rgba(46,71,224,.28)" }}>
                      {m.text}
                    </div>
                    <div style={{ textAlign:"right", fontSize:10, color:"#A3A3A3", marginTop:4 }}>{fmt(m.ts)}</div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                    background:"var(--color-brand-100)",
                    border:"2px solid #fff", boxShadow:"0 2px 8px rgba(46,71,224,.18)",
                    color:"var(--color-brand-500)", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:800 }}>N</div>
                </div>
              ) : (
                /* ── AI message ── */
                <div key={m.id} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:11, flexShrink:0,
                    background:"var(--color-brand-500)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 3px 10px rgba(46,71,224,.30)" }}>
                    <SparklesIcon size={16} style={{ color:"#fff" }} />
                  </div>
                  <div style={{ flex:1, maxWidth:"calc(100% - 44px)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"var(--color-brand-500)" }}>AI Assistant</span>
                      <span style={{ background:"var(--chip-brand-bg)", color:"var(--chip-brand-fg)", fontSize:9, fontWeight:700, padding:"1px 7px", borderRadius:999 }}>● Online</span>
                      <span style={{ fontSize:10, color:"var(--color-text-muted)" }}>{fmt(m.ts)}</span>
                    </div>
                    <div style={{ background:"var(--color-surface)", border:"1.5px solid var(--color-border)",
                      borderRadius:"4px 16px 16px 16px", padding:"13px 16px",
                      fontSize:14, color:"var(--color-text)", lineHeight:1.75,
                      boxShadow:"var(--shadow-card)",
                      marginBottom: m.candidates ? 10 : 0 }}>
                      {m.text}
                    </div>

                    {m.candidates && (
                      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ background:"var(--chip-brand-bg)", color:"var(--color-brand-500)", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999 }}>
                              {m.candidates.length} candidates found
                            </span>
                            <span style={{ fontSize:11, color:"var(--color-text-muted)" }}>Ranked by match score</span>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            <button style={{ height:26, padding:"0 10px", borderRadius:7, border:"1.5px solid var(--color-border)", background:"var(--color-surface)", color:"var(--color-text-secondary)", fontSize:11, fontWeight:600, cursor:"pointer" }}>Filter</button>
                            <button style={{ height:26, padding:"0 10px", borderRadius:7, border:"none", background:"var(--chip-brand-bg)", color:"var(--color-brand-500)", fontSize:11, fontWeight:700, cursor:"pointer" }}>Shortlist all</button>
                          </div>
                        </div>
                        {m.candidates.map(c => <CandidateCard key={c.id} c={c} />)}
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <button style={{ height:32, padding:"0 14px", borderRadius:9, border:"none", background:"var(--chip-brand-bg)", color:"var(--color-brand-500)", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                            <SearchIcon size={13} /> Refine search
                          </button>
                          <button
                            onClick={() => {
                              if (!m.candidates || m.candidates.length === 0) return;
                              exportToExcel({
                                filename: "assistant-candidates",
                                sheetName: "Candidates",
                                columns: [
                                  { header: "Name", key: "name", width: 22 },
                                  { header: "Role", key: "role", width: 28 },
                                  { header: "Experience", key: "exp", width: 14 },
                                  { header: "Location", key: "location", width: 22 },
                                  { header: "Availability", key: "availability", width: 16 },
                                  { header: "Match Score", key: "score", type: "number", width: 12 },
                                  {
                                    header: "Skills",
                                    key: (c: Candidate) => c.skills.join(", "),
                                    width: 38,
                                  },
                                  { header: "ID", key: "id", width: 20 },
                                ],
                                rows: m.candidates,
                              });
                            }}
                            title="Export this list to Excel"
                            style={{ height:32, padding:"0 14px", borderRadius:9, border:"none", background:"var(--chip-brand-bg)", color:"var(--color-brand-600)", fontSize:12, fontWeight:600, cursor:"pointer" }}
                          >
                            Export list
                          </button>
                          <button style={{ height:32, padding:"0 14px", borderRadius:9, border:"1.5px solid var(--color-border)", background:"var(--color-surface)", color:"var(--color-text-secondary)", fontSize:12, fontWeight:600, cursor:"pointer" }}>Schedule interviews</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:34, height:34, borderRadius:11, flexShrink:0,
                    background:"var(--color-brand-500)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 3px 10px rgba(46,71,224,.28)" }}>
                    <SparklesIcon size={16} style={{ color:"#fff" }} />
                  </div>
                  <div style={{ background:"var(--color-surface)", border:"1.5px solid var(--color-border)",
                    borderRadius:"4px 14px 14px 14px", boxShadow:"0 2px 8px rgba(31,27,23,.05)" }}>
                    <Dots />
                  </div>
                  <span style={{ fontSize:11, color:"var(--color-text-muted)", fontStyle:"italic" }}>AI is thinking…</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── Input ───────────────────────────────────────────────────── */}
          <div style={{ padding:"10px 20px 18px", background:"var(--color-surface)", borderTop:"1.5px solid var(--color-border)", flexShrink:0 }}>
            <div className="chat-inner">

              {/* Scope chip — shows when user has narrowed search to a specific source */}
              {scope !== "all" && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    padding:"4px 10px 4px 8px",
                    background:"var(--color-brand-100)",
                    color:"var(--color-brand-600)",
                    borderRadius:999, fontSize:11, fontWeight:700,
                    border:"1px solid var(--color-brand-200)",
                  }}>
                    <span style={{ display:"inline-flex" }}>
                      {SCOPES.find(s => s.id === scope)?.icon}
                    </span>
                    Scope: {SCOPES.find(s => s.id === scope)?.label}
                    <button
                      type="button"
                      onClick={() => setScope("all")}
                      aria-label="Clear scope"
                      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
                        width:14, height:14, borderRadius:999, border:"none",
                        background:"rgba(46,71,224,.15)", color:"var(--color-brand-600)",
                        cursor:"pointer", padding:0 }}
                    >
                      <XIcon size={9} />
                    </button>
                  </span>
                  <span style={{ fontSize:11, color:"var(--color-text-muted)" }}>
                    AI will only search {SCOPES.find(s => s.id === scope)?.label.toLowerCase()}.
                  </span>
                </div>
              )}

              <div className="input-box">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={SCOPES.find(s => s.id === scope)?.placeholder ?? "Ask follow-up or refine your search…"}
                  rows={2}
                  style={{ width:"100%", boxSizing:"border-box",
                    padding:"14px 16px 4px", border:"none", outline:"none",
                    borderRadius:"16px 16px 0 0", resize:"none",
                    fontSize:14, color:"var(--color-text)", lineHeight:1.65,
                    background:"transparent", fontFamily:"inherit" }} />

                {/* Scope picker toolbar */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"6px 10px 10px", gap:8 }}>
                  <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                    {SCOPES.map(s => {
                      const active = scope === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          title={`${s.label} — ${active ? "active scope" : "click to scope search"}`}
                          aria-pressed={active}
                          onClick={() => setScope(active ? "all" : s.id)}
                          className="scope-btn"
                          style={{
                            height:32, padding: active ? "0 10px 0 8px" : "0 8px",
                            borderRadius:8, border: active
                              ? "1.5px solid var(--color-brand-300)"
                              : "1.5px solid transparent",
                            background: active ? "var(--color-brand-100)" : "transparent",
                            color: active ? "var(--color-brand-600)" : "var(--color-text-muted)",
                            display:"flex", alignItems:"center", gap:5,
                            cursor:"pointer",
                            fontSize:11, fontWeight:700,
                            transition:"all .15s",
                          }}
                        >
                          {s.icon}
                          {active && <span>{s.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                    <span style={{ fontSize:10, color:"var(--color-text-muted)", display:"flex", gap:4, alignItems:"center" }}>
                      <kbd style={{ background:"var(--color-surface-2)", border:"1px solid var(--color-border)", borderRadius:4, padding:"1px 5px", fontSize:10, color:"var(--color-text-muted)", fontFamily:"inherit" }}>↵</kbd>
                      to send
                    </span>
                    <button
                      onClick={() => send(input)}
                      disabled={!input.trim() || typing}
                      style={{ width:36, height:36, borderRadius:10, border:"none",
                        background: input.trim() && !typing ? "var(--color-brand-500)" : "var(--color-surface-2)",
                        color: input.trim() && !typing ? "#fff" : "var(--color-text-muted)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor: input.trim() && !typing ? "pointer" : "default",
                        transition:"background .15s, box-shadow .15s",
                        boxShadow: input.trim() && !typing ? "0 2px 10px rgba(46,71,224,.30)" : "none" }}>
                      <PaperPlaneIcon size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <p style={{ textAlign:"center", fontSize:10, color:"var(--color-text-muted)", margin:"7px 0 0" }}>
                AI can make mistakes · Always verify before sending submissions
              </p>
            </div>
          </div>
        </div>

        {/* ══ RESIZER ══════════════════════════════════════════════════════ */}
        {!isMobile && !sidebarCollapsed && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
            className={`assist-resizer${isDragging ? " is-dragging" : ""}`}
            onPointerDown={startResize}
            onDoubleClick={expandToMax}
            title="Drag to resize · double-click to expand"
          />
        )}

        {/* ══ COLLAPSED RAIL (desktop only) ═══════════════════════════════ */}
        {!isMobile && sidebarCollapsed && (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(false)}
            className="assist-rail"
            aria-label="Open panel"
          >
            <ChevronLeft size={14} style={{ color:"var(--color-brand-500)" }} />
            <span>Panel</span>
          </button>
        )}

        {/* ══ MOBILE BACKDROP ═════════════════════════════════════════════ */}
        <div
          className={`assist-backdrop${mobileOpen ? " mobile-open" : ""}`}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />

        {/* ══ SIDEBAR ══════════════════════════════════════════════════════ */}
        <aside
          className={[
            "assist-sidebar",
            !isMobile && !sidebarCollapsed ? "is-docked" : "",
            isDragging ? "is-dragging" : "",
            isMobile && mobileOpen ? "mobile-open" : "",
          ].filter(Boolean).join(" ")}
          style={{
            width: isMobile ? undefined : sidebarWidth,
            minWidth: isMobile ? undefined : sidebarWidth,
            display: !isMobile && sidebarCollapsed ? "none" : "block",
          }}
          aria-hidden={isMobile ? !mobileOpen : false}
        >

          {/* Mobile drawer close button */}
          {isMobile && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"12px 14px 4px", borderBottom:"1px solid var(--color-border)" }}>
              <span style={{ fontSize:13, fontWeight:800, color:"var(--color-text)" }}>Assistant Panel</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close panel"
                style={{ width:32, height:32, borderRadius:8, border:"none", background:"var(--color-surface-2)",
                  color:"var(--color-text-secondary)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              >
                <XIcon size={14} />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <section style={{ padding:"18px 14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--color-text)" }}>Quick Actions</span>
              <button style={{ fontSize:11, color:"var(--color-brand-500)", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {QUICK_ACTIONS.map(qa => (
                <button key={qa.label} className="qa-btn" onClick={() => send(qa.prompt)}
                  style={{ textAlign:"left", padding:"11px 11px", border:"1.5px solid var(--color-border)",
                    borderRadius:12, background:"var(--color-surface)", cursor:"pointer" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:qa.color,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:7 }}>
                    <QAIcon icon={qa.icon} color={qa.ic} />
                  </div>
                  <div style={{ fontSize:11.5, fontWeight:600, color:"var(--color-text)", lineHeight:1.3 }}>{qa.label}</div>
                </button>
              ))}
            </div>
          </section>

          <div style={{ height:1, background:"var(--color-surface-2)", margin:"0 14px" }} />

          {/* Today's Snapshot */}
          <section style={{ padding:"14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--color-text)" }}>Today&apos;s Snapshot</span>
              <span style={{ fontSize:10, color:"var(--color-text-muted)", display:"flex", alignItems:"center", gap:3 }}>
                just now <RefreshIcon size={10} style={{ color:"var(--color-text-muted)" }} />
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {SNAPSHOT.map(s => (
                <div key={s.label} style={{ padding:"11px 12px", background:s.bg, borderRadius:11 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10.5, color:"var(--color-text-secondary)", marginTop:3, lineHeight:1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ height:1, background:"var(--color-surface-2)", margin:"0 14px" }} />

          {/* Pinned */}
          <section style={{ padding:"14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--color-text)" }}>Pinned</span>
              <button style={{ fontSize:11, color:"var(--color-brand-500)", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Manage</button>
            </div>
            {PINNED.map(item => (
              <button key={item.title} className="pin-btn"
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 9px", width:"100%",
                  border:"1.5px solid var(--color-border)", borderRadius:10, background:"var(--color-surface)",
                  cursor:"pointer", textAlign:"left", marginBottom:6 }}>
                <div style={{ width:30, height:30, borderRadius:7, background:item.bg,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {item.icon === "doc"   && <DocumentIcon size={13} style={{ color:item.iconColor }} />}
                  {item.icon === "users" && <UsersIcon    size={13} style={{ color:item.iconColor }} />}
                  {item.icon === "form"  && <CheckIcon    size={13} style={{ color:item.iconColor }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--color-text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                  <div style={{ fontSize:10, color:"var(--color-text-muted)", marginTop:1 }}>{item.meta}</div>
                </div>
                <MoreIcon size={13} style={{ color:"#D4D4D4", flexShrink:0 }} />
              </button>
            ))}
          </section>

          <div style={{ height:1, background:"var(--color-surface-2)", margin:"0 14px" }} />

          {/* Top Candidates */}
          <section style={{ padding:"14px 14px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--color-text)" }}>
                Top Candidates
                <span style={{ color:"var(--color-text-muted)", fontWeight:400, fontSize:11 }}> (This Week)</span>
              </span>
              <button style={{ fontSize:11, color:"var(--color-brand-500)", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all</button>
            </div>
            {TOP_WEEK.map((c, i) => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 0",
                borderBottom: i < TOP_WEEK.length - 1 ? "1px solid #FAFAFA" : "none" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:c.color+"1A",
                  color:c.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {c.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--color-text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                  <div style={{ fontSize:10, color:"var(--color-text-muted)" }}>{c.role}</div>
                </div>
                <span style={{ background:scoreBg(c.score), color:scoreColor(c.score),
                  fontSize:11, fontWeight:800, padding:"2px 8px", borderRadius:999 }}>
                  {c.score}%
                </span>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
