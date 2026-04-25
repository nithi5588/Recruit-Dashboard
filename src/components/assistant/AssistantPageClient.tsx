"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import {
  SparklesIcon, PaperPlaneIcon,
  UsersIcon, CalendarIcon, RefreshIcon, MoreIcon,
  ClockIcon, CheckIcon, BarChartMiniIcon, DocumentIcon,
  FilterIcon, TasksIcon, SearchIcon,
  BriefcaseIcon, MatchIcon,
  ChevronLeft, ChevronRight, XIcon,
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
  { id:"c1",  name:"Ananya Sharma",    initials:"AS", color:"#5B3DF5", role:"Senior Frontend Developer", exp:"6 yrs",   location:"Bangalore, KA", skills:["React","TypeScript","Next.js","Tailwind","GraphQL"],          score:95, availability:"Available" },
  { id:"c2",  name:"Rohit Menon",      initials:"RM", color:"#8B7DF7", role:"Frontend Developer",        exp:"3.5 yrs", location:"Bangalore, KA", skills:["React","Vue","CSS","Figma"],                                  score:92, availability:"Available" },
  { id:"c3",  name:"Neha Iyer",        initials:"NI", color:"#16A34A", role:"Frontend Engineer",         exp:"5 yrs",   location:"Remote · India",skills:["Angular","React","GraphQL","AWS"],                            score:90, availability:"2 weeks"  },
  { id:"c4",  name:"Karan Patel",      initials:"KP", color:"#F59E0B", role:"UI Engineer",               exp:"3 yrs",   location:"Mumbai, MH",    skills:["React","Redux","SCSS","Jest"],                                score:85, availability:"Available" },
  { id:"c5",  name:"Divya Reddy",      initials:"DR", color:"#94A3B8", role:"Frontend Engineer",         exp:"4.5 yrs", location:"Hyderabad, TS", skills:["React","TypeScript","Node.js"],                               score:82, availability:"1 month"  },
  { id:"c6",  name:"Aarav Kapoor",     initials:"AK", color:"#5B3DF5", role:"Staff Frontend Engineer",   exp:"9 yrs",   location:"Pune, MH",      skills:["React","Next.js","TypeScript","Webpack","Performance"],       score:96, availability:"2 weeks"  },
  { id:"c7",  name:"Mira Joshi",       initials:"MJ", color:"#8B7DF7", role:"Frontend Developer",        exp:"2 yrs",   location:"Chennai, TN",   skills:["Vue","Nuxt","TypeScript","Sass"],                             score:78, availability:"Available" },

  // ─── Backend ───────────────────────────────────────────────────────────────
  { id:"c8",  name:"Marvin McKinney",  initials:"MM", color:"#5B3DF5", role:"Senior Backend Developer",  exp:"7 yrs",   location:"Bangalore, KA", skills:["Python","Django","PostgreSQL","Redis","AWS"],                 score:94, availability:"Available" },
  { id:"c9",  name:"Priya Shah",       initials:"PS", color:"#16A34A", role:"Backend Engineer",          exp:"4 yrs",   location:"Hyderabad, TS", skills:["Java","Spring Boot","Kafka","MySQL"],                          score:89, availability:"Available" },
  { id:"c10", name:"Ralph Edwards",    initials:"RE", color:"#8B7DF7", role:"Senior Backend Developer",  exp:"8 yrs",   location:"Remote · India",skills:["Go","gRPC","Postgres","Kubernetes"],                          score:91, availability:"1 month"  },
  { id:"c11", name:"Vikram Iyer",      initials:"VI", color:"#94A3B8", role:"Backend Engineer",          exp:"5 yrs",   location:"Delhi NCR",     skills:["Node.js","Express","MongoDB","TypeScript"],                   score:84, availability:"2 weeks"  },
  { id:"c12", name:"Sanya Khurana",    initials:"SK", color:"#5B3DF5", role:"Staff Backend Engineer",    exp:"10 yrs",  location:"Bangalore, KA", skills:["Rust","Go","Postgres","Kafka","Distributed Systems"],         score:97, availability:"1 month"  },

  // ─── Full-stack ────────────────────────────────────────────────────────────
  { id:"c13", name:"Aditya Verma",     initials:"AV", color:"#8B7DF7", role:"Full-Stack Engineer",       exp:"5 yrs",   location:"Pune, MH",      skills:["React","Node.js","TypeScript","AWS","PostgreSQL"],            score:88, availability:"Available" },
  { id:"c14", name:"Tara Nambiar",     initials:"TN", color:"#16A34A", role:"Full-Stack Developer",      exp:"3 yrs",   location:"Bangalore, KA", skills:["Next.js","tRPC","Prisma","TypeScript"],                       score:86, availability:"Available" },

  // ─── DevOps / SRE ──────────────────────────────────────────────────────────
  { id:"c15", name:"Robert Fox",       initials:"RF", color:"#5B3DF5", role:"DevOps Engineer",           exp:"6 yrs",   location:"Hyderabad, TS", skills:["AWS","Docker","Kubernetes","Terraform","Jenkins"],            score:90, availability:"Available" },
  { id:"c16", name:"Ishaan Bose",      initials:"IB", color:"#94A3B8", role:"Site Reliability Engineer", exp:"4 yrs",   location:"Bangalore, KA", skills:["Kubernetes","Prometheus","GCP","Go","Linux"],                 score:87, availability:"2 weeks"  },

  // ─── Data / ML ─────────────────────────────────────────────────────────────
  { id:"c17", name:"Kathryn Murphy",   initials:"KM", color:"#5B3DF5", role:"Data Scientist",            exp:"5 yrs",   location:"Mumbai, MH",    skills:["Python","TensorFlow","SQL","Power BI","Pandas"],              score:91, availability:"Available" },
  { id:"c18", name:"Cody Fisher",      initials:"CF", color:"#8B7DF7", role:"ML Engineer",               exp:"6 yrs",   location:"Bangalore, KA", skills:["Python","PyTorch","ML","Deep Learning","Kubernetes"],         score:93, availability:"1 month"  },
  { id:"c19", name:"Meera Krishnan",   initials:"MK", color:"#16A34A", role:"Data Engineer",             exp:"4 yrs",   location:"Chennai, TN",   skills:["Python","Spark","Airflow","Snowflake","SQL"],                 score:85, availability:"Available" },

  // ─── Mobile ────────────────────────────────────────────────────────────────
  { id:"c20", name:"Arjun Rao",        initials:"AR", color:"#8B7DF7", role:"iOS Engineer",              exp:"5 yrs",   location:"Bangalore, KA", skills:["Swift","SwiftUI","Combine","Core Data"],                      score:88, availability:"Available" },
  { id:"c21", name:"Nikita Sen",       initials:"NS", color:"#16A34A", role:"React Native Developer",    exp:"3 yrs",   location:"Remote · India",skills:["React Native","TypeScript","Expo","Firebase"],                score:84, availability:"2 weeks"  },
  { id:"c22", name:"Daksh Malhotra",   initials:"DM", color:"#94A3B8", role:"Android Engineer",          exp:"4 yrs",   location:"Gurgaon, HR",   skills:["Kotlin","Jetpack Compose","Coroutines","MVVM"],               score:82, availability:"1 month"  },

  // ─── Design ────────────────────────────────────────────────────────────────
  { id:"c23", name:"Savannah Nguyen",  initials:"SN", color:"#5B3DF5", role:"Senior Product Designer",   exp:"6 yrs",   location:"Bangalore, KA", skills:["UI/UX","Figma","Design Systems","Prototyping"],               score:94, availability:"Available" },
  { id:"c24", name:"Esther Howard",    initials:"EH", color:"#8B7DF7", role:"UX Researcher",             exp:"5 yrs",   location:"Mumbai, MH",    skills:["User Research","Figma","Usability Testing","Mixpanel"],       score:87, availability:"2 weeks"  },
  { id:"c25", name:"Arlene McCoy",     initials:"AM", color:"#16A34A", role:"UX Designer",               exp:"3 yrs",   location:"Pune, MH",      skills:["Figma","Sketch","Adobe XD","Prototyping"],                    score:80, availability:"Available" },

  // ─── Product / QA ──────────────────────────────────────────────────────────
  { id:"c26", name:"Cameron Williamson", initials:"CW", color:"#5B3DF5", role:"Product Manager",         exp:"7 yrs",   location:"Bangalore, KA", skills:["Roadmapping","Jira","Analytics","Stakeholder Mgmt"],          score:90, availability:"Available" },
  { id:"c27", name:"Jane Cooper",      initials:"JC", color:"#94A3B8", role:"Senior Product Manager",    exp:"9 yrs",   location:"Hyderabad, TS", skills:["Strategy","Roadmapping","B2B SaaS","Analytics"],              score:92, availability:"1 month"  },
  { id:"c28", name:"Riya Bhatt",       initials:"RB", color:"#8B7DF7", role:"QA Engineer",               exp:"4 yrs",   location:"Bangalore, KA", skills:["Cypress","Playwright","Jest","Selenium","TypeScript"],        score:81, availability:"Available" },
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
  { icon:"users",    label:"Find Candidates",    color:"#EEE9FF", ic:"#5B3DF5", prompt:"Find me the best available candidates" },
  { icon:"match",    label:"Match Candidates",   color:"#EAF2FF", ic:"#3B82F6", prompt:"Match candidates to the latest JD" },
  { icon:"doc",      label:"Generate JD",        color:"#FFF4DB", ic:"#F59E0B", prompt:"Help me generate a job description" },
  { icon:"screen",   label:"Screen Resumes",     color:"#EAFBF1", ic:"#22C55E", prompt:"Screen and rank resumes for the current role" },
  { icon:"calendar", label:"Schedule Interview", color:"#FEF3E8", ic:"#EA580C", prompt:"Help me schedule interviews" },
  { icon:"pipeline", label:"Pipeline Summary",   color:"#F0F9FF", ic:"#0EA5E9", prompt:"Give me a recruitment pipeline summary" },
];

const PINNED = [
  { icon:"doc",   iconColor:"#5B3DF5", bg:"#EEE9FF", title:"Frontend Developer JD",   meta:"Created by you · May 10" },
  { icon:"users", iconColor:"#3B82F6", bg:"#EAF2FF", title:"Top React Developers",    meta:"Smart list · 42 candidates" },
  { icon:"form",  iconColor:"#22C55E", bg:"#EAFBF1", title:"Interview Feedback Form", meta:"Form · 18 responses" },
];

const SNAPSHOT = [
  { label:"Interviews Today",   value:5,  color:"#5B3DF5", bg:"#EEE9FF" },
  { label:"Follow-ups Due",     value:8,  color:"#F59E0B", bg:"#FFF4DB" },
  { label:"Offers in Progress", value:3,  color:"#22C55E", bg:"#EAFBF1" },
  { label:"Tasks Pending",      value:12, color:"#EF4444", bg:"#FDECEC" },
];

const TOP_WEEK = [
  { name:"Ananya Sharma", role:"Frontend Developer", score:95, initials:"AS", color:"#5B3DF5" },
  { name:"Rohit Menon",   role:"Frontend Developer", score:92, initials:"RM", color:"#3B82F6" },
  { name:"Neha Iyer",     role:"Frontend Developer", score:90, initials:"NI", color:"#22C55E" },
];

/* ──────────────────────────────── helpers ─────────────────────────────────── */

const uid = () => Math.random().toString(36).slice(2);
const fmt = (d: Date) => d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
const scoreColor = (s: number) => s >= 90 ? "#16A34A" : s >= 80 ? "#2563EB" : "#D97706";
const scoreBg    = (s: number) => s >= 90 ? "#EAFBF1" : s >= 80 ? "#EAF2FF" : "#FFF4DB";
const availStyle = (a: Candidate["availability"]) =>
  a === "Available" ? { bg:"#EAFBF1", text:"#16A34A" }
  : a === "2 weeks" ? { bg:"#EAF2FF", text:"#2563EB" }
  : { bg:"#FFF4DB", text:"#D97706" };

/* ──────────────────────────────── Typing dots ─────────────────────────────── */

function Dots() {
  return (
    <div style={{ display:"flex", gap:5, padding:"10px 16px", alignItems:"center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#818CF8",
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
      style={{ background:"#fff", border:"1.5px solid #EDE9FE", borderRadius:14,
        padding:"14px 16px", display:"flex", gap:13, alignItems:"flex-start",
        transition:"box-shadow .15s, border-color .15s", cursor:"pointer" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor="#C7BCF9"; el.style.boxShadow="0 4px 20px rgba(91,61,245,.10)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor="#EDE9FE"; el.style.boxShadow="none"; }}
    >
      <div style={{ width:42, height:42, borderRadius:"50%", background:c.color+"1A", color:c.color,
        display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, flexShrink:0 }}>
        {c.initials}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
          <span style={{ fontSize:14, fontWeight:700, color:"#171A2B" }}>{c.name}</span>
          <span style={{ background:av.bg, color:av.text, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{c.availability}</span>
        </div>
        <div style={{ fontSize:12, color:"#667085", marginBottom:8 }}>{c.role} · {c.exp} · 📍 {c.location}</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {c.skills.map(sk => (
            <span key={sk} style={{ background:"#F3F4F8", color:"#667085", fontSize:11, padding:"2px 8px", borderRadius:6, fontWeight:500 }}>{sk}</span>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
        <span style={{ background:scoreBg(c.score), color:scoreColor(c.score), fontSize:13, fontWeight:800, padding:"3px 11px", borderRadius:999 }}>
          {c.score}% Match
        </span>
        <div style={{ display:"flex", gap:6 }}>
          <button style={{ height:29, padding:"0 11px", borderRadius:8, border:"1.5px solid #E5E7EF", background:"#fff", fontSize:12, fontWeight:600, color:"#171A2B", cursor:"pointer", transition:"border-color .12s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor="#5B3DF5")}
            onMouseLeave={e => (e.currentTarget.style.borderColor="#E5E7EF")}>View Profile</button>
          <button style={{ height:29, padding:"0 11px", borderRadius:8, border:"none", background:"#5B3DF5", fontSize:12, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .12s" }}
            onMouseEnter={e => (e.currentTarget.style.background="#4B32D4")}
            onMouseLeave={e => (e.currentTarget.style.background="#5B3DF5")}>Add to Pipeline</button>
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
  const [msgs, setMsgs]     = useState<Msg[]>(SEED);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [scope, setScope]   = useState<Scope>("all");
  const STARTER_CARDS = STARTER_CARDS_FACTORY();

  // ── Responsive sidebar state ───────────────────────────────
  const [sidebarWidth, setSidebarWidth]       = useState(SIDEBAR_DEFAULT);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]            = useState(false);
  const [isMobile, setIsMobile]                = useState(false);
  const [isDragging, setIsDragging]            = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

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

  function send(text: string, overrideScope?: Scope) {
    const t = text.trim();
    if (!t) return;
    const useScope: Scope = overrideScope ?? scope;
    setMsgs(p => [...p, { id:uid(), role:"user", text:t, ts:new Date() }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      const reply = generateReply(t, useScope);
      setMsgs(p => [...p, reply]);
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
      {/* ── Global CSS ───────────────────────────────────────────────────── */}
      <style>{`
        .assist-root    { display:flex; height:calc(100dvh - 64px); background:#F7F8FC; overflow:hidden; position:relative; }
        .assist-main    { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
        .chat-inner     { max-width:820px; margin:0 auto; width:100%; }

        /* Desktop resizable sidebar */
        .assist-sidebar { background:#fff; overflow-y:auto; flex-shrink:0; position:relative; transition:box-shadow .18s; }
        .assist-sidebar.is-docked { border-left:1.5px solid #E5E7EF; }
        .assist-sidebar.is-dragging { box-shadow:-8px 0 24px rgba(23,26,43,.08); transition:none; }

        /* Resizer bar */
        .assist-resizer { width:6px; flex-shrink:0; cursor:ew-resize; position:relative; background:transparent; touch-action:none; z-index:5; }
        .assist-resizer::before { content:""; position:absolute; top:0; bottom:0; left:50%; width:1.5px; background:#E5E7EF; transform:translateX(-50%); transition:background .15s, width .15s; }
        .assist-resizer:hover::before, .assist-resizer.is-dragging::before { background:#5B3DF5; width:3px; }
        .assist-resizer::after { content:""; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:3px; height:28px; border-radius:2px; background:#C7BCF9; opacity:0; transition:opacity .15s; }
        .assist-resizer:hover::after, .assist-resizer.is-dragging::after { opacity:1; }

        /* Collapsed rail — shows when sidebar hidden on desktop */
        .assist-rail { position:absolute; right:0; top:50%; transform:translateY(-50%); z-index:20; display:flex; flex-direction:column; align-items:center; gap:4px; background:#fff; border:1.5px solid #E5E7EF; border-right:none; border-radius:12px 0 0 12px; padding:10px 6px; box-shadow:-4px 4px 14px rgba(23,26,43,.08); cursor:pointer; transition:border-color .15s, box-shadow .15s; }
        .assist-rail:hover { border-color:#C7BCF9; box-shadow:-4px 4px 18px rgba(91,61,245,.18); }
        .assist-rail span { writing-mode:vertical-rl; transform:rotate(180deg); font-size:11px; font-weight:700; color:#5B3DF5; letter-spacing:.04em; }

        /* Header toggle button */
        .assist-toggle { display:none; }
        @media(max-width:1100px){ .assist-toggle { display:inline-flex; } }

        /* Mobile drawer */
        .assist-backdrop { display:none; }
        @media(max-width:899px){
          .assist-sidebar { position:fixed; top:0; right:0; bottom:0; width:min(86vw, 360px) !important; z-index:60; transform:translateX(100%); transition:transform .25s ease-out; box-shadow:-8px 0 30px rgba(23,26,43,.22); border-left:1.5px solid #E5E7EF; }
          .assist-sidebar.mobile-open { transform:translateX(0); }
          .assist-resizer { display:none; }
          .assist-rail { display:none; }
          .assist-backdrop { display:block; position:fixed; inset:0; background:rgba(23,26,43,.38); z-index:55; opacity:0; pointer-events:none; transition:opacity .2s; }
          .assist-backdrop.mobile-open { opacity:1; pointer-events:auto; }
        }

        @keyframes dp { 0%,60%,100%{ transform:translateY(0);opacity:.4 } 30%{ transform:translateY(-7px);opacity:1 } }

        .starter-card { transition:border-color .15s, box-shadow .15s, transform .15s; }
        .starter-card:hover { border-color:#C7BCF9 !important; box-shadow:0 4px 16px rgba(91,61,245,.10) !important; transform:translateY(-2px); }

        .input-box { border:1.5px solid #E5E7EF; border-radius:16px; background:#fff; transition:border-color .2s, box-shadow .2s; }
        .input-box:focus-within { border-color:#5B3DF5; box-shadow:0 0 0 3px rgba(91,61,245,.08); }

        .qa-btn { transition:all .15s; }
        .qa-btn:hover { border-color:#C7BCF9 !important; background:#F9F8FF !important; transform:translateY(-2px); box-shadow:0 4px 14px rgba(91,61,245,.08); }

        .pin-btn { transition:all .12s; }
        .pin-btn:hover { border-color:#C7BCF9 !important; background:#F9F8FF !important; }

        .tb-btn { transition:background .12s, color .12s; }
        .tb-btn:hover { background:#EEE9FF !important; color:#5B3DF5 !important; }

        .scope-btn:hover { background: var(--color-surface-2) !important; color: var(--color-text) !important; }
        .scope-btn[aria-pressed="true"]:hover { background: var(--color-brand-200) !important; }
      `}</style>

      <div className="assist-root">

        {/* ══ MAIN ════════════════════════════════════════════════════════ */}
        <div className="assist-main">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <div style={{ padding:"13px 20px", borderBottom:"1.5px solid #E5E7EF", background:"#fff", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
                  background:"linear-gradient(135deg,#5B3DF5 0%,#818CF8 100%)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 3px 12px rgba(91,61,245,.32)" }}>
                  <SparklesIcon size={18} style={{ color:"#fff" }} />
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <h1 style={{ margin:0, fontSize:17, fontWeight:800, color:"#171A2B", letterSpacing:"-.3px" }}>
                      AI Recruiting Assistant
                    </h1>
                    <span style={{ background:"#EAFBF1", color:"#16A34A", fontSize:10, fontWeight:700,
                      padding:"2px 9px", borderRadius:999, display:"inline-flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:"#22C55E" }} />
                      Online
                    </span>
                  </div>
                  <div style={{ fontSize:11, color:"#98A2B3", marginTop:1 }}>
                    Powered by Claude 3 · Context-aware recruiting intelligence
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <button style={{ height:34, padding:"0 13px", borderRadius:9, border:"1.5px solid #E5E7EF", background:"#fff", color:"#667085", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                  <ClockIcon size={13} /> History
                </button>
                <button onClick={() => { setMsgs([]); setInput(""); }}
                  style={{ height:34, padding:"0 13px", borderRadius:9, border:"none",
                    background:"linear-gradient(135deg,#5B3DF5,#7C3AED)", color:"#fff",
                    fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5,
                    boxShadow:"0 2px 10px rgba(91,61,245,.28)" }}>
                  <SparklesIcon size={13} /> New Chat
                </button>
                <button
                  type="button"
                  onClick={togglePanel}
                  aria-label={(isMobile ? mobileOpen : !sidebarCollapsed) ? "Close panel" : "Open panel"}
                  className="assist-toggle"
                  style={{ width:34, height:34, borderRadius:9, border:"1.5px solid #E5E7EF",
                    background:"#fff", color:"#667085", cursor:"pointer",
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
                      background:"linear-gradient(135deg,#5B3DF5,#818CF8)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow:"0 6px 24px rgba(91,61,245,.28)" }}>
                      <SparklesIcon size={26} style={{ color:"#fff" }} />
                    </div>
                    <p style={{ margin:"0 0 4px", fontSize:20, fontWeight:800, color:"#171A2B" }}>Hi Nithish 👋</p>
                    <p style={{ margin:0, fontSize:14, color:"#667085" }}>How can I help with recruiting today?</p>
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
                          boxShadow:"0 2px 8px rgba(23,26,43,.04)",
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
                    <div style={{ background:"linear-gradient(135deg,#5B3DF5 0%,#7C3AED 100%)",
                      color:"#fff", borderRadius:"18px 18px 4px 18px",
                      padding:"12px 16px", fontSize:14, lineHeight:1.65,
                      boxShadow:"0 4px 18px rgba(91,61,245,.28)" }}>
                      {m.text}
                    </div>
                    <div style={{ textAlign:"right", fontSize:10, color:"#B0BAD0", marginTop:4 }}>{fmt(m.ts)}</div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0,
                    background:"linear-gradient(135deg,#EEE9FF,#DDD6FE)",
                    border:"2px solid #fff", boxShadow:"0 2px 8px rgba(91,61,245,.18)",
                    color:"#5B3DF5", display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:800 }}>N</div>
                </div>
              ) : (
                /* ── AI message ── */
                <div key={m.id} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ width:34, height:34, borderRadius:11, flexShrink:0,
                    background:"linear-gradient(135deg,#5B3DF5,#818CF8)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 3px 10px rgba(91,61,245,.30)" }}>
                    <SparklesIcon size={16} style={{ color:"#fff" }} />
                  </div>
                  <div style={{ flex:1, maxWidth:"calc(100% - 44px)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:"#5B3DF5" }}>AI Assistant</span>
                      <span style={{ background:"#EAFBF1", color:"#16A34A", fontSize:9, fontWeight:700, padding:"1px 7px", borderRadius:999 }}>● Online</span>
                      <span style={{ fontSize:10, color:"#B0BAD0" }}>{fmt(m.ts)}</span>
                    </div>
                    <div style={{ background:"#fff", border:"1.5px solid #E5E7EF",
                      borderRadius:"4px 16px 16px 16px", padding:"13px 16px",
                      fontSize:14, color:"#374151", lineHeight:1.75,
                      boxShadow:"0 2px 10px rgba(23,26,43,.05)",
                      marginBottom: m.candidates ? 10 : 0 }}>
                      {m.text}
                    </div>

                    {m.candidates && (
                      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 2px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ background:"#EEE9FF", color:"#5B3DF5", fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:999 }}>
                              {m.candidates.length} candidates found
                            </span>
                            <span style={{ fontSize:11, color:"#98A2B3" }}>Ranked by match score</span>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            <button style={{ height:26, padding:"0 10px", borderRadius:7, border:"1.5px solid #E5E7EF", background:"#fff", color:"#667085", fontSize:11, fontWeight:600, cursor:"pointer" }}>Filter</button>
                            <button style={{ height:26, padding:"0 10px", borderRadius:7, border:"none", background:"#EEE9FF", color:"#5B3DF5", fontSize:11, fontWeight:700, cursor:"pointer" }}>Shortlist all</button>
                          </div>
                        </div>
                        {m.candidates.map(c => <CandidateCard key={c.id} c={c} />)}
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <button style={{ height:32, padding:"0 14px", borderRadius:9, border:"none", background:"#EEE9FF", color:"#5B3DF5", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
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
                            style={{ height:32, padding:"0 14px", borderRadius:9, border:"none", background:"#EAFBF1", color:"#16A34A", fontSize:12, fontWeight:600, cursor:"pointer" }}
                          >
                            Export list
                          </button>
                          <button style={{ height:32, padding:"0 14px", borderRadius:9, border:"1.5px solid #E5E7EF", background:"#fff", color:"#667085", fontSize:12, fontWeight:600, cursor:"pointer" }}>Schedule interviews</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:34, height:34, borderRadius:11, flexShrink:0,
                    background:"linear-gradient(135deg,#5B3DF5,#818CF8)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 3px 10px rgba(91,61,245,.28)" }}>
                    <SparklesIcon size={16} style={{ color:"#fff" }} />
                  </div>
                  <div style={{ background:"#fff", border:"1.5px solid #E5E7EF",
                    borderRadius:"4px 14px 14px 14px", boxShadow:"0 2px 8px rgba(23,26,43,.05)" }}>
                    <Dots />
                  </div>
                  <span style={{ fontSize:11, color:"#98A2B3", fontStyle:"italic" }}>AI is thinking…</span>
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
                        background:"rgba(91,61,245,.15)", color:"var(--color-brand-600)",
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
                        background: input.trim() && !typing ? "linear-gradient(135deg,#5B3DF5,#7C3AED)" : "var(--color-surface-2)",
                        color: input.trim() && !typing ? "#fff" : "var(--color-text-muted)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor: input.trim() && !typing ? "pointer" : "default",
                        transition:"background .15s, box-shadow .15s",
                        boxShadow: input.trim() && !typing ? "0 2px 10px rgba(91,61,245,.30)" : "none" }}>
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
            <ChevronLeft size={14} style={{ color:"#5B3DF5" }} />
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
              padding:"12px 14px 4px", borderBottom:"1px solid #F3F4F8" }}>
              <span style={{ fontSize:13, fontWeight:800, color:"#171A2B" }}>Assistant Panel</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close panel"
                style={{ width:32, height:32, borderRadius:8, border:"none", background:"#F3F4F8",
                  color:"#667085", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
              >
                <XIcon size={14} />
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <section style={{ padding:"18px 14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:11 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#171A2B" }}>Quick Actions</span>
              <button style={{ fontSize:11, color:"#5B3DF5", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {QUICK_ACTIONS.map(qa => (
                <button key={qa.label} className="qa-btn" onClick={() => send(qa.prompt)}
                  style={{ textAlign:"left", padding:"11px 11px", border:"1.5px solid #E5E7EF",
                    borderRadius:12, background:"#fff", cursor:"pointer" }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:qa.color,
                    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:7 }}>
                    <QAIcon icon={qa.icon} color={qa.ic} />
                  </div>
                  <div style={{ fontSize:11.5, fontWeight:600, color:"#171A2B", lineHeight:1.3 }}>{qa.label}</div>
                </button>
              ))}
            </div>
          </section>

          <div style={{ height:1, background:"#F3F4F8", margin:"0 14px" }} />

          {/* Today's Snapshot */}
          <section style={{ padding:"14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#171A2B" }}>Today&apos;s Snapshot</span>
              <span style={{ fontSize:10, color:"#98A2B3", display:"flex", alignItems:"center", gap:3 }}>
                just now <RefreshIcon size={10} style={{ color:"#98A2B3" }} />
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {SNAPSHOT.map(s => (
                <div key={s.label} style={{ padding:"11px 12px", background:s.bg, borderRadius:11 }}>
                  <div style={{ fontSize:22, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:10.5, color:"#667085", marginTop:3, lineHeight:1.3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ height:1, background:"#F3F4F8", margin:"0 14px" }} />

          {/* Pinned */}
          <section style={{ padding:"14px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#171A2B" }}>Pinned</span>
              <button style={{ fontSize:11, color:"#5B3DF5", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Manage</button>
            </div>
            {PINNED.map(item => (
              <button key={item.title} className="pin-btn"
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 9px", width:"100%",
                  border:"1.5px solid #E5E7EF", borderRadius:10, background:"#fff",
                  cursor:"pointer", textAlign:"left", marginBottom:6 }}>
                <div style={{ width:30, height:30, borderRadius:7, background:item.bg,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {item.icon === "doc"   && <DocumentIcon size={13} style={{ color:item.iconColor }} />}
                  {item.icon === "users" && <UsersIcon    size={13} style={{ color:item.iconColor }} />}
                  {item.icon === "form"  && <CheckIcon    size={13} style={{ color:item.iconColor }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#171A2B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                  <div style={{ fontSize:10, color:"#98A2B3", marginTop:1 }}>{item.meta}</div>
                </div>
                <MoreIcon size={13} style={{ color:"#C0C8D8", flexShrink:0 }} />
              </button>
            ))}
          </section>

          <div style={{ height:1, background:"#F3F4F8", margin:"0 14px" }} />

          {/* Top Candidates */}
          <section style={{ padding:"14px 14px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#171A2B" }}>
                Top Candidates
                <span style={{ color:"#98A2B3", fontWeight:400, fontSize:11 }}> (This Week)</span>
              </span>
              <button style={{ fontSize:11, color:"#5B3DF5", fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all</button>
            </div>
            {TOP_WEEK.map((c, i) => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 0",
                borderBottom: i < TOP_WEEK.length - 1 ? "1px solid #F7F8FC" : "none" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:c.color+"1A",
                  color:c.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {c.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#171A2B", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                  <div style={{ fontSize:10, color:"#98A2B3" }}>{c.role}</div>
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
