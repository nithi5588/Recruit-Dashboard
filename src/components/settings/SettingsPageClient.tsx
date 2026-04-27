"use client";

import { useState } from "react";
import {
  SettingsIcon, UsersIcon, ShieldIcon, BellIcon, GlobeIcon,
  MonitorIcon, AtIcon, CheckIcon, PlusIcon, XIcon, EditIcon,
  ChevronRight, CopyIcon, LinkChainIcon, RefreshIcon,
} from "@/components/icons/AppIcons";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import {
  useTheme,
  type Density,
  type ThemeMode,
} from "@/components/theme/ThemeProvider";

// ─── Types & constants ────────────────────────────────────────────────────────

type Tab = "profile" | "team" | "notifications" | "security" | "integrations" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile",       label: "Profile",        icon: <AtIcon size={16} /> },
  { id: "team",          label: "Team & Members",  icon: <UsersIcon size={16} /> },
  { id: "notifications", label: "Notifications",   icon: <BellIcon size={16} /> },
  { id: "security",      label: "Security",        icon: <ShieldIcon size={16} /> },
  { id: "integrations",  label: "Integrations",    icon: <GlobeIcon size={16} /> },
  { id: "appearance",    label: "Appearance",      icon: <MonitorIcon size={16} /> },
];

const TEAM_MEMBERS = [
  { id: "1", name: "Nithish Baddula", email: "Invisiedge@gmail.com",       role: "Admin",     avatar: "NB", color: "#2E47E0", status: "active",  lastActive: "Active now" },
  { id: "2", name: "Priya Mehta",     email: "priya.mehta@recruit.io",     role: "Recruiter", avatar: "PM", color: "#525252", status: "active",  lastActive: "12 min ago" },
  { id: "3", name: "Alex Johnson",    email: "alex.johnson@recruit.io",    role: "Recruiter", avatar: "AJ", color: "#2E47E0", status: "active",  lastActive: "3 hr ago" },
  { id: "4", name: "Sarah Wilson",    email: "sarah.wilson@recruit.io",    role: "Viewer",    avatar: "SW", color: "#5C6FE7", status: "pending", lastActive: "Invited 2 days ago" },
];

type Integration = {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
  category: "Sourcing" | "Communication" | "Scheduling" | "Productivity";
  connected: boolean;
  syncedAgo?: string;
};

const INTEGRATIONS: Integration[] = [
  { id: "linkedin",  name: "LinkedIn",        desc: "Sync jobs and candidates from LinkedIn",  color: "#0A66C2", icon: "in", category: "Sourcing",      connected: true,  syncedAgo: "2 min ago" },
  { id: "gmail",     name: "Gmail",           desc: "Send emails and track responses",          color: "#EA4335", icon: "G",  category: "Communication", connected: true,  syncedAgo: "10 min ago" },
  { id: "slack",     name: "Slack",           desc: "Get pipeline updates in Slack channels",   color: "#611F69", icon: "S",  category: "Communication", connected: false },
  { id: "zoom",      name: "Zoom",            desc: "Auto-create Zoom links for interviews",    color: "#2D8CFF", icon: "Z",  category: "Scheduling",    connected: true,  syncedAgo: "1 hr ago" },
  { id: "naukri",    name: "Naukri",          desc: "Import candidate profiles from Naukri",    color: "#E94057", icon: "N",  category: "Sourcing",      connected: false },
  { id: "calendar",  name: "Google Calendar", desc: "Two-way sync with Google Calendar",        color: "#4285F4", icon: "C",  category: "Scheduling",    connected: true,  syncedAgo: "5 min ago" },
];

// ─── Shared styled helpers ────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", borderRadius: 16, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", display: "block", marginBottom: 6 }}>{children}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", boxSizing: "border-box", height: 42,
        borderRadius: 10, border: "1.5px solid var(--color-border)",
        padding: "0 12px", fontSize: 14, color: "var(--color-text)",
        background: "var(--color-bg-base)", outline: "none",
        transition: "border-color .15s, box-shadow .15s",
      }}
      onFocus={e => {
        e.target.style.borderColor = "var(--color-brand-500)";
        e.target.style.boxShadow = "var(--shadow-ring-brand)";
      }}
      onBlur={e => {
        e.target.style.borderColor = "var(--color-border)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 999, border: "none",
        background: checked ? "var(--color-brand-500)" : "var(--control-track-off)",
        position: "relative", cursor: "pointer",
        transition: "background .2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "var(--color-surface)",
        transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,.15)",
      }} />
    </button>
  );
}

function SaveBtn({ label = "Save changes" }: { label?: string }) {
  const [saved, setSaved] = useState(false);
  const [hover, setHover] = useState(false);
  const background = saved
    ? "#273DC0"
    : hover
      ? "var(--color-brand-600)"
      : "var(--color-brand-500)";
  return (
    <button
      type="button"
      onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1800); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        alignSelf: "flex-start",
        height: 38,
        padding: "0 18px",
        borderRadius: 10,
        border: "none",
        background,
        color: "#FFFFFF",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background .15s, transform .15s, box-shadow .15s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        boxShadow: hover
          ? "0 6px 16px rgba(46, 71, 224, 0.28)"
          : "0 2px 6px rgba(46, 71, 224, 0.18)",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        letterSpacing: "-0.01em",
      }}
    >
      {saved ? <><CheckIcon size={14} /> Saved</> : label}
    </button>
  );
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName]   = useState("Nithish Baddula");
  const [email, setEmail] = useState("Invisiedge@gmail.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [role, setRole]   = useState("Recruitment Manager");
  const [company, setCompany] = useState("InvisiEdge");
  const [bio, setBio]     = useState("Building the future of recruitment ops.");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Personal Information</h3>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "linear-gradient(135deg,#2E47E0,#96A3EF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "var(--color-surface)" }}>
            NB
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 10 }}>{email}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ height: 32, padding: "0 14px", borderRadius: 8, border: "none", background: "var(--color-brand-100)", color: "var(--color-brand-500)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Upload photo
              </button>
              <button style={{ height: 32, padding: "0 14px", borderRadius: 8, border: "1.5px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Remove
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div><Label>Full Name</Label><Input value={name} onChange={setName} /></div>
          <div><Label>Email Address</Label><Input value={email} onChange={setEmail} type="email" /></div>
          <div><Label>Phone Number</Label><Input value={phone} onChange={setPhone} /></div>
          <div><Label>Job Title</Label><Input value={role} onChange={setRole} /></div>
          <div><Label>Company</Label><Input value={company} onChange={setCompany} /></div>
          <div>
            <Label>Bio</Label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
              style={{ width: "100%", boxSizing: "border-box", borderRadius: 10, border: "1.5px solid var(--color-border)", padding: "10px 12px", fontSize: 14, color: "var(--color-text)", background: "var(--color-bg-base)", resize: "vertical", outline: "none", transition: "border-color .15s" }}
              onFocus={e => (e.target.style.borderColor = "var(--color-brand-500)")}
              onBlur={e => (e.target.style.borderColor = "var(--color-border)")}
            />
          </div>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn />
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Time Zone & Language</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <Label>Time Zone</Label>
            <select style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--color-border)", padding: "0 12px", fontSize: 14, color: "var(--color-text)", background: "var(--color-bg-base)", outline: "none" }}>
              <option>US/Eastern (UTC-5)</option>
              <option>US/Pacific (UTC-8)</option>
              <option>US/Central (UTC-6)</option>
              <option>Asia/Kolkata (UTC+5:30)</option>
            </select>
          </div>
          <div>
            <Label>Language</Label>
            <select style={{ width: "100%", height: 42, borderRadius: 10, border: "1.5px solid var(--color-border)", padding: "0 12px", fontSize: 14, color: "var(--color-text)", background: "var(--color-bg-base)", outline: "none" }}>
              <option>English (US)</option>
              <option>English (UK)</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn />
        </div>
      </Card>
    </div>
  );
}

type TeamRole = "Admin" | "Recruiter" | "Viewer";
type TeamStatus = "active" | "pending";
type TeamMember = (typeof TEAM_MEMBERS)[number] & {
  role: TeamRole;
  status: TeamStatus;
  invitedAt?: number;
  lastActive?: string;
};

const ROLE_DESCRIPTIONS: Record<TeamRole, string> = {
  Admin: "Full access to settings, billing & team",
  Recruiter: "Can manage candidates, jobs & calendar",
  Viewer: "Read-only access to candidates & reports",
};

const ROLE_OPTIONS: TeamRole[] = ["Admin", "Recruiter", "Viewer"];
const AVATAR_PALETTE = ["#2E47E0", "#273DC0", "#5C6FE7", "#20319C", "#525252", "#96A3EF"];

function emailIsValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase() + s.slice(1).toLowerCase())
    .join(" ") || email;
}

function initialsFromName(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "??"
  );
}

function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(
    () => TEAM_MEMBERS as TeamMember[],
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Recruiter");
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [resentId, setResentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const adminCount    = members.filter((m) => m.role === "Admin").length;
  const recruiterCount = members.filter((m) => m.role === "Recruiter").length;
  const viewerCount   = members.filter((m) => m.role === "Viewer").length;
  const pendingCount  = members.filter((m) => m.status === "pending").length;

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  });

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function changeRole(id: string, role: TeamRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m)),
    );
  }

  function inviteMember() {
    const email = inviteEmail.trim().toLowerCase();
    if (!emailIsValid(email)) {
      setFeedback({ kind: "err", msg: "Please enter a valid email address." });
      return;
    }
    if (members.some((m) => m.email.toLowerCase() === email)) {
      setFeedback({ kind: "err", msg: "That email is already on the team." });
      return;
    }
    const name = nameFromEmail(email);
    const newMember: TeamMember = {
      id: `inv_${Date.now()}`,
      name,
      email,
      role: inviteRole,
      avatar: initialsFromName(name),
      color: AVATAR_PALETTE[members.length % AVATAR_PALETTE.length],
      status: "pending",
      invitedAt: Date.now(),
      lastActive: "Invited just now",
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setFeedback({ kind: "ok", msg: `Invite sent to ${email} as ${inviteRole}.` });
  }

  function resendInvite(id: string) {
    setResentId(id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, invitedAt: Date.now() } : m)),
    );
    setTimeout(() => setResentId(null), 1800);
  }

  function copyInviteLink() {
    const link = `https://recruit.app/invite/${Math.random().toString(36).slice(2, 10)}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1800);
  }

  // Auto-clear feedback after a few seconds so the inline message doesn't
  // linger forever.
  if (feedback) {
    setTimeout(() => setFeedback((f) => (f === feedback ? null : f)), 3500);
  }

  const roleChip = (role: TeamRole) => {
    if (role === "Admin")     return { bg: "var(--chip-brand-bg)",   text: "var(--chip-brand-fg)" };
    if (role === "Recruiter") return { bg: "var(--chip-info-bg)",    text: "var(--chip-info-fg)" };
    return { bg: "var(--chip-neutral-bg)", text: "var(--chip-neutral-fg)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        /* ── Hero invite block ─────────────────────────────────────────── */
        .team-hero { position:relative; overflow:hidden; border-radius:16px; padding:22px; border:1px solid var(--color-brand-200); background:radial-gradient(900px 220px at 0% 0%, rgba(46,71,224,0.10), transparent 60%), linear-gradient(180deg, #F2F3FD 0%, var(--color-surface) 70%); }
        html[data-theme="dark"] .team-hero { background:radial-gradient(900px 220px at 0% 0%, rgba(46,71,224,0.18), transparent 60%), linear-gradient(180deg, rgba(46,71,224,0.06) 0%, var(--color-surface) 70%); border-color:rgba(46,71,224,0.32); }
        .team-hero-head { display:flex; align-items:flex-start; gap:14px; margin-bottom:18px; }
        .team-hero-tile { width:44px; height:44px; border-radius:12px; flex-shrink:0; display:inline-flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600)); color:#fff; box-shadow:0 6px 18px rgba(46,71,224,0.32); }
        .team-hero-text h3 { margin:0; font-size:17px; font-weight:800; letter-spacing:-0.01em; color:var(--color-text); }
        .team-hero-text p  { margin:3px 0 0; font-size:13px; color:var(--color-text-secondary); }

        .team-invite-row { display:flex; flex-direction:column; gap:10px; }
        @media(min-width:780px){ .team-invite-row { flex-direction:row; align-items:stretch; } }
        .team-invite-input { flex:1; min-width:0; }
        .team-invite-input input { height:46px !important; border-radius:12px !important; }

        .team-role-select { height:46px; padding:0 36px 0 14px; border-radius:12px; border:1.5px solid var(--color-border); background:var(--color-surface); font-size:13px; font-weight:600; color:var(--color-text); cursor:pointer; appearance:none; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'><path d='m6 9 6 6 6-6' stroke='%239A9183' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>"); background-repeat:no-repeat; background-position:right 12px center; min-width:140px; transition:border-color .15s, box-shadow .15s; }
        .team-role-select:hover { border-color:var(--color-border-strong); }
        .team-role-select:focus { outline:none; border-color:var(--color-brand-500); box-shadow:var(--shadow-ring-brand); }

        .invite-btn { height:46px; padding:0 20px; border-radius:12px; border:none; background:var(--color-brand-500); color:#fff; font-size:13.5px; font-weight:700; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:7px; transition: background .15s, box-shadow .15s, transform .15s; box-shadow:0 6px 18px rgba(46,71,224,0.34); }
        .invite-btn:hover:not(:disabled) { background:var(--color-brand-600); transform:translateY(-1px); box-shadow:0 8px 22px rgba(46,71,224,0.42); }
        .invite-btn:disabled { opacity:0.5; cursor:not-allowed; box-shadow:none; }

        .team-role-hint { margin-top:8px; font-size:12px; color:var(--color-text-muted); display:flex; align-items:center; gap:6px; }
        .team-role-hint strong { color:var(--color-text-secondary); font-weight:600; }

        .team-divider { display:flex; align-items:center; gap:10px; margin:18px 0 14px; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--color-text-muted); }
        .team-divider::before, .team-divider::after { content:""; flex:1; height:1px; background:var(--color-border); }

        .team-link-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 16px; border-radius:12px; background:var(--color-surface); border:1px solid var(--color-border); transition:border-color .15s; }
        .team-link-row:hover { border-color:var(--color-border-strong); }
        .team-link-text { display:flex; align-items:center; gap:10px; min-width:0; font-size:12.5px; color:var(--color-text-secondary); flex:1; }
        .team-link-icon { width:28px; height:28px; border-radius:8px; background:var(--color-brand-50); color:var(--color-brand-600); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        .team-link-text strong { color:var(--color-text); font-weight:600; font-family:ui-monospace, monospace; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .team-link-btn { height:34px; padding:0 14px; border-radius:9px; border:1px solid var(--color-border); background:var(--color-bg-base); font-size:12px; font-weight:600; color:var(--color-text-secondary); cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition: all .15s; flex-shrink:0; }
        .team-link-btn:hover { border-color:var(--color-brand-300); color:var(--color-brand-600); background:var(--color-brand-50); }
        .team-link-btn.copied { background:var(--chip-success-bg); color:var(--chip-success-fg); border-color:transparent; }

        .team-feedback { margin-top:12px; padding:10px 14px; border-radius:10px; font-size:12.5px; font-weight:600; display:flex; align-items:center; gap:8px; }
        .team-feedback.ok  { background:var(--chip-success-bg); color:var(--chip-success-fg); }
        .team-feedback.err { background:var(--chip-error-bg);   color:var(--chip-error-fg); }

        /* ── Members header strip ──────────────────────────────────────── */
        .team-summary { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
        .team-summary-counts { display:flex; flex-wrap:wrap; gap:6px; }
        .team-count-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:999px; background:var(--color-bg-base); border:1px solid var(--color-border); font-size:11.5px; font-weight:600; color:var(--color-text-secondary); }
        .team-count-chip strong { color:var(--color-text); font-weight:700; font-size:12px; }
        .team-count-dot { width:7px; height:7px; border-radius:999px; }

        .team-search { position:relative; width:100%; max-width:240px; }
        .team-search input { width:100%; height:36px; padding:0 12px 0 34px; border-radius:10px; border:1px solid var(--color-border); background:var(--color-bg-base); font-size:13px; color:var(--color-text); outline:none; transition:border-color .15s, box-shadow .15s; }
        .team-search input::placeholder { color:var(--color-text-muted); }
        .team-search input:focus { border-color:var(--color-brand-500); box-shadow:var(--shadow-ring-brand); background:var(--color-surface); }
        .team-search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--color-text-muted); pointer-events:none; }

        /* ── Member rows ───────────────────────────────────────────────── */
        .team-list { display:flex; flex-direction:column; border:1px solid var(--color-border); border-radius:14px; overflow:hidden; background:var(--color-surface); }
        .team-row { display:grid; gap:14px; align-items:center; padding:14px 16px; border-bottom:1px solid var(--color-border); transition:background .15s; }
        .team-row:last-child { border-bottom:none; }
        .team-row:hover { background:var(--color-bg-base); }
        .team-row-pending { background:rgba(92,111,231,0.04); }
        html[data-theme="dark"] .team-row-pending { background:rgba(92,111,231,0.06); }

        /* Compact: avatar+name | role | actions */
        .team-row { grid-template-columns: minmax(0, 1fr) 138px 90px; }
        .team-col-status, .team-col-actions { display:none; }
        @media(min-width:760px){
          .team-row { grid-template-columns: minmax(0, 1.4fr) 140px 110px 96px; }
          .team-col-status { display:flex; }
        }
        @media(min-width:1080px){
          .team-row { grid-template-columns: minmax(0, 1.4fr) 150px 130px 96px; }
          .team-col-actions { display:flex; }
        }

        .team-member-cell { display:flex; align-items:center; gap:12px; min-width:0; }
        .team-avatar { position:relative; width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; flex-shrink:0; letter-spacing:-0.02em; }
        .team-avatar-pulse { position:absolute; bottom:-2px; right:-2px; width:11px; height:11px; border-radius:999px; background:var(--color-brand-500); border:2px solid var(--color-surface); }
        .team-avatar-pulse.online::after { content:""; position:absolute; inset:-3px; border-radius:999px; border:2px solid var(--color-brand-500); opacity:0.5; animation:teamPulse 2s ease-out infinite; }
        @keyframes teamPulse { 0%{ transform:scale(0.8); opacity:0.6; } 100%{ transform:scale(1.5); opacity:0; } }

        .team-info { min-width:0; }
        .team-name { font-size:13.5px; font-weight:700; color:var(--color-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:6px; }
        .team-you-badge { font-size:9.5px; font-weight:700; padding:1px 6px; border-radius:5px; background:var(--color-brand-50); color:var(--color-brand-600); text-transform:uppercase; letter-spacing:0.04em; }
        .team-meta { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:2px; font-size:11.5px; color:var(--color-text-muted); }
        .team-meta-email { color:var(--color-text-secondary); }
        .team-meta-sep { color:var(--color-text-muted); opacity:0.6; }

        .row-role-select { width:100%; height:32px; padding:0 28px 0 12px; border-radius:9px; border:1px solid transparent; font-size:12px; font-weight:700; cursor:pointer; appearance:none; background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none'><path d='m6 9 6 6 6-6' stroke='%239A9183' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/></svg>"); background-repeat:no-repeat; background-position:right 9px center; transition:transform .12s; }
        .row-role-select:hover:not(:disabled) { transform:translateY(-1px); }
        .row-role-select:focus { outline:none; box-shadow:var(--shadow-ring-brand); }
        .row-role-select:disabled { opacity:0.6; cursor:not-allowed; }

        .status-chip { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; white-space:nowrap; }
        .status-chip .dot { width:6px; height:6px; border-radius:999px; flex-shrink:0; }

        .team-actions { display:flex; align-items:center; justify-content:flex-end; gap:6px; }
        .team-action-btn { height:30px; padding:0 10px; border-radius:8px; border:1px solid var(--color-border); background:var(--color-surface); color:var(--color-text-secondary); font-size:11.5px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:5px; transition: all .15s; white-space:nowrap; }
        .team-action-btn:hover:not(:disabled) { border-color:var(--color-brand-300); color:var(--color-brand-600); background:var(--color-brand-50); }
        .team-action-btn:disabled { opacity:0.35; cursor:not-allowed; }
        .team-action-btn.danger:hover:not(:disabled) { border-color:transparent; color:var(--chip-error-fg); background:var(--chip-error-bg); }
        .team-action-btn.success { background:var(--chip-success-bg); color:var(--chip-success-fg); border-color:transparent; }
        .team-action-btn.icon { padding:0; width:30px; justify-content:center; }

        .team-empty { padding:36px 16px; text-align:center; color:var(--color-text-muted); font-size:13px; }
      `}</style>

      {/* ── Hero invite block ─────────────────────────────────────────── */}
      <div className="team-hero">
        <div className="team-hero-head">
          <span className="team-hero-tile">
            <UsersIcon size={20} />
          </span>
          <div className="team-hero-text">
            <h3>Invite teammates</h3>
            <p>
              Send an email invite or share a private link. New members
              receive their access instantly.
            </p>
          </div>
        </div>

        <div className="team-invite-row">
          <div className="team-invite-input">
            <Input
              value={inviteEmail}
              onChange={setInviteEmail}
              placeholder="colleague@company.com"
              type="email"
            />
          </div>
          <select
            aria-label="Invite role"
            className="team-role-select"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as TeamRole)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="button"
            className="invite-btn"
            onClick={inviteMember}
            disabled={!inviteEmail.trim()}
          >
            <PlusIcon size={14} /> Send invite
          </button>
        </div>

        <div className="team-role-hint">
          <strong>{inviteRole}</strong> · {ROLE_DESCRIPTIONS[inviteRole]}
        </div>

        {feedback ? (
          <div className={`team-feedback ${feedback.kind}`}>
            {feedback.kind === "ok" ? <CheckIcon size={13} /> : <XIcon size={13} />}
            {feedback.msg}
          </div>
        ) : null}

        <div className="team-divider">or share a link</div>

        <div className="team-link-row">
          <span className="team-link-text">
            <span className="team-link-icon">
              <LinkChainIcon size={14} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Workspace invite link
              </span>
              <strong>recruit.app/invite/your-team</strong>
            </span>
          </span>
          <button
            type="button"
            onClick={copyInviteLink}
            className={`team-link-btn${linkCopied ? " copied" : ""}`}
          >
            {linkCopied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            {linkCopied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>

      {/* ── Team Members list ─────────────────────────────────────────── */}
      <Card>
        <div className="team-summary">
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>
              Team Members
            </h3>
            <div className="team-summary-counts" style={{ marginTop: 8 }}>
              <span className="team-count-chip">
                <span className="team-count-dot" style={{ background: "var(--color-brand-500)" }} />
                <strong>{adminCount}</strong> Admin
              </span>
              <span className="team-count-chip">
                <span className="team-count-dot" style={{ background: "var(--color-text-secondary)" }} />
                <strong>{recruiterCount}</strong> Recruiter
              </span>
              <span className="team-count-chip">
                <span className="team-count-dot" style={{ background: "var(--color-text-muted)" }} />
                <strong>{viewerCount}</strong> Viewer
              </span>
              {pendingCount > 0 ? (
                <span className="team-count-chip" style={{ background: "var(--chip-warning-bg)", borderColor: "transparent", color: "var(--chip-warning-fg)" }}>
                  <strong style={{ color: "var(--chip-warning-fg)" }}>{pendingCount}</strong> Pending
                </span>
              ) : null}
            </div>
          </div>

          <div className="team-search">
            <span className="team-search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or role…"
              aria-label="Search team members"
            />
          </div>
        </div>

        <div className="team-list">
          {filteredMembers.length === 0 ? (
            <div className="team-empty">
              {searchQuery ? `No members match "${searchQuery}"` : "No team members yet."}
            </div>
          ) : (
            filteredMembers.map((m, idx) => {
              const isActive = m.status === "active";
              const isOnlyAdmin = m.role === "Admin" && adminCount <= 1;
              const isYou = idx === 0; // first member acts as the signed-in user
              const rc = roleChip(m.role);
              return (
                <div
                  key={m.id}
                  className={`team-row${!isActive ? " team-row-pending" : ""}`}
                >
                  <div className="team-member-cell">
                    <div
                      className="team-avatar"
                      style={{
                        background: `linear-gradient(135deg, ${m.color}33 0%, ${m.color}1A 100%)`,
                        color: m.color,
                        boxShadow: `inset 0 0 0 1.5px ${m.color}40`,
                      }}
                    >
                      {m.avatar}
                      {isActive && /now|min/i.test(m.lastActive ?? "") ? (
                        <span className="team-avatar-pulse online" />
                      ) : null}
                    </div>
                    <div className="team-info">
                      <div className="team-name">
                        <span title={m.name}>{m.name}</span>
                        {isYou ? <span className="team-you-badge">You</span> : null}
                      </div>
                      <div className="team-meta">
                        <span className="team-meta-email" title={m.email}>{m.email}</span>
                        {m.lastActive ? (
                          <>
                            <span className="team-meta-sep">·</span>
                            <span>{m.lastActive}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <select
                    aria-label={`Change role for ${m.name}`}
                    className="row-role-select"
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value as TeamRole)}
                    disabled={isOnlyAdmin}
                    title={isOnlyAdmin ? "At least one Admin is required" : ROLE_DESCRIPTIONS[m.role]}
                    style={{ background: rc.bg, color: rc.text }}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <span
                    className="status-chip team-col-status"
                    style={{
                      background: isActive ? "var(--chip-success-bg)" : "var(--chip-warning-bg)",
                      color: isActive ? "var(--chip-success-fg)" : "var(--chip-warning-fg)",
                    }}
                  >
                    <span
                      className="dot"
                      style={{ background: isActive ? "var(--chip-success-fg)" : "var(--chip-warning-fg)" }}
                    />
                    {isActive ? "Active" : "Pending"}
                  </span>

                  <div className="team-actions team-col-actions">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => resendInvite(m.id)}
                        className={`team-action-btn${resentId === m.id ? " success" : ""}`}
                        title="Resend invite email"
                      >
                        {resentId === m.id ? <CheckIcon size={11} /> : <RefreshIcon size={11} />}
                        {resentId === m.id ? "Sent" : "Resend"}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      aria-label={`Remove ${m.name}`}
                      onClick={() => removeMember(m.id)}
                      disabled={isOnlyAdmin || isYou}
                      title={
                        isOnlyAdmin
                          ? "Can't remove the only Admin"
                          : isYou
                          ? "Can't remove yourself"
                          : `Remove ${m.name}`
                      }
                      className="team-action-btn danger icon"
                    >
                      <XIcon size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Role Permissions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {([
            { role: "Admin"     as TeamRole, perms: ["Full access", "Manage team", "Billing", "Settings"] },
            { role: "Recruiter" as TeamRole, perms: ["Manage candidates", "Jobs", "Calendar", "Reports"] },
            { role: "Viewer"    as TeamRole, perms: ["View candidates", "View reports"] },
          ]).map((r) => {
            const rc = roleChip(r.role);
            return (
              <div
                key={r.role}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  background: "var(--color-bg-base)",
                  borderRadius: 10,
                  border: "1px solid var(--color-border)",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="chip"
                  style={{ background: rc.bg, color: rc.text, minWidth: 90 }}
                >
                  {r.role}
                </span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {r.perms.map((p) => (
                    <span
                      key={p}
                      style={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-secondary)",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    newCandidate: true,
    interviewScheduled: true,
    taskDue: true,
    pipelineUpdate: false,
    weeklyReport: true,
    offerAccepted: true,
    emailDigest: false,
    slackAlerts: true,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const groups = [
    {
      title: "Candidate Activity",
      items: [
        { key: "newCandidate" as const,      label: "New candidate added",         desc: "When a new profile is added to your pool" },
        { key: "pipelineUpdate" as const,    label: "Pipeline stage changed",      desc: "When a candidate moves to a new stage" },
        { key: "offerAccepted" as const,     label: "Offer accepted / rejected",   desc: "When a candidate responds to an offer" },
      ],
    },
    {
      title: "Interviews & Tasks",
      items: [
        { key: "interviewScheduled" as const,label: "Interview scheduled",         desc: "When an interview is booked for a candidate" },
        { key: "taskDue" as const,           label: "Task due reminders",          desc: "Alerts for tasks due in the next 24 hours" },
      ],
    },
    {
      title: "Reports & Digests",
      items: [
        { key: "weeklyReport" as const,      label: "Weekly performance report",   desc: "Summary of submissions, interviews, and placements" },
        { key: "emailDigest" as const,       label: "Daily email digest",          desc: "Daily roundup of all activity in your account" },
        { key: "slackAlerts" as const,       label: "Slack channel alerts",        desc: "Post updates to your connected Slack workspace" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {groups.map(g => (
        <Card key={g.title}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>{g.title}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {g.items.map((item, idx) => (
              <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: idx < g.items.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{item.desc}</div>
                </div>
                <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </Card>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <SaveBtn label="Save notification preferences" />
      </div>
    </div>
  );
}

function SecurityTab() {
  const [current, setCurrent]   = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [confirm, setConfirm]   = useState("");
  const [twoFA, setTwoFA]       = useState(false);
  const [sessionLog] = useState([
    { device: "Chrome on macOS",         ip: "192.168.1.1",  time: "Now",             current: true  },
    { device: "Safari on iPhone",        ip: "10.0.0.42",    time: "2 hours ago",     current: false },
    { device: "Chrome on Windows 11",    ip: "203.0.113.42", time: "May 20, 2:30 PM", current: false },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ marginBottom: 18 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Change Password</h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
            Use a strong password you don&rsquo;t reuse elsewhere.
          </p>
        </div>
        <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 14 }}>
          <div><Label>Current Password</Label><Input value={current} onChange={setCurrent} type="password" placeholder="Enter your current password" /></div>
          <div><Label>New Password</Label><Input value={newPwd} onChange={setNewPwd} type="password" placeholder="Min. 8 characters" /></div>
          <div><Label>Confirm New Password</Label><Input value={confirm} onChange={setConfirm} type="password" placeholder="Re-enter your new password" /></div>

          {/* Inline feedback */}
          {newPwd && confirm && newPwd !== confirm ? (
            <p style={{
              margin: 0, fontSize: 12, fontWeight: 600,
              color: "var(--chip-error-fg)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <span aria-hidden style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 14, height: 14, borderRadius: "50%",
                background: "var(--chip-error-bg)", fontSize: 10, fontWeight: 700,
              }}>!</span>
              Passwords do not match
            </p>
          ) : newPwd && confirm && newPwd === confirm ? (
            <p style={{
              margin: 0, fontSize: 12, fontWeight: 600,
              color: "var(--chip-success-fg)",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <CheckIcon size={12} /> Passwords match
            </p>
          ) : null}

          <div style={{ marginTop: 4 }}>
            <SaveBtn label="Update password" />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Two-Factor Authentication</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", maxWidth: 360 }}>{"Add an extra layer of security. You'll be asked for a verification code when signing in from a new device."}</p>
          </div>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>
        {twoFA && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: "var(--chip-success-bg)",
              borderRadius: 10,
              border: "1px solid transparent",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--chip-success-fg)", display: "flex", alignItems: "center", gap: 6 }}>
              <CheckIcon size={14} /> Two-factor authentication is enabled
            </div>
            <div style={{ fontSize: 12, color: "var(--chip-success-fg)", opacity: 0.8, marginTop: 4 }}>
              Your account is protected with an authenticator app.
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Active Sessions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sessionLog.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "var(--color-bg-base)", borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)", display: "flex", alignItems: "center", gap: 8 }}>
                  {s.device}
                  {s.current && (
                    <span
                      className="chip"
                      style={{ background: "var(--chip-success-bg)", color: "var(--chip-success-fg)", fontSize: 10 }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>IP: {s.ip} · {s.time}</div>
              </div>
              {!s.current && (
                <button
                  type="button"
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 8,
                    border: "1px solid transparent",
                    background: "var(--chip-error-bg)",
                    color: "var(--chip-error-fg)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "background .15s, transform .15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

type IntegrationFilter = "all" | "connected" | "available";

function IntegrationCard({
  app,
  connected,
  onToggle,
}: {
  app: Integration;
  connected: boolean;
  onToggle: () => void;
}) {
  const syncedShort = (app.syncedAgo ?? "")
    .replace(" min ago", "m ago")
    .replace(" hr ago", "h ago")
    .replace(" hrs ago", "h ago")
    .replace(" sec ago", "s ago");

  return (
    <div className="int-card" data-connected={connected ? "true" : "false"}>
      {/* Top status ribbon */}
      {connected && <span className="int-ribbon" aria-hidden />}

      <div className="int-card-body">
        {/* Header — icon + name + category */}
        <div className="int-card-head">
          <CompanyLogo
            company={app.name}
            size={40}
            fallbackBg={app.color}
            fallbackText={app.icon}
            rounded="rounded-[11px]"
            padding={6}
            className="shadow-sm"
          />
          <div className="int-title-wrap">
            <div className="int-title-row">
              <span className="int-title">{app.name}</span>
              {connected && (
                <span className="int-mini-status" aria-label="Connected" title="Connected">
                  <span className="int-mini-dot" />
                </span>
              )}
            </div>
            <span className="int-category">{app.category}</span>
          </div>
        </div>

        {/* Description */}
        <p className="int-desc">{app.desc}</p>

        {/* Status strip — stacked so it never truncates */}
        <div className="int-meta">
          <span className="int-status" data-connected={connected ? "true" : "false"}>
            <span className="int-status-dot" />
            <span className="int-status-label">
              {connected ? "Connected" : "Not connected"}
            </span>
          </span>
          {connected && syncedShort && (
            <span className="int-sync">Last sync · {syncedShort}</span>
          )}
        </div>

        {/* Action button — full width so it can never truncate */}
        <button
          type="button"
          onClick={onToggle}
          className={connected ? "int-btn int-btn-secondary" : "int-btn int-btn-primary"}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  );
  const [filter, setFilter] = useState<IntegrationFilter>("all");

  const connectedCount = INTEGRATIONS.filter(a => connected[a.id]).length;
  const totalCount = INTEGRATIONS.length;

  const visible = INTEGRATIONS.filter(a => {
    if (filter === "connected") return connected[a.id];
    if (filter === "available") return !connected[a.id];
    return true;
  });

  const filters: { key: IntegrationFilter; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: totalCount },
    { key: "connected", label: "Connected", count: connectedCount },
    { key: "available", label: "Available", count: totalCount - connectedCount },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .int-header { display:flex; flex-direction:column; gap:12px; margin-bottom:18px; }
        @media(min-width:640px){ .int-header { flex-direction:row; align-items:flex-start; justify-content:space-between; gap:16px; } }

        .int-filters { display:inline-flex; padding:3px; border-radius:10px; background:var(--color-surface-2); border:1px solid var(--color-border); align-self:flex-start; }
        .int-filter-btn { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 12px; border-radius:7px; border:none; background:transparent; color:var(--color-text-secondary); font-size:12px; font-weight:600; cursor:pointer; transition:background .15s, color .15s; white-space:nowrap; }
        .int-filter-btn:hover { color:var(--color-text); }
        .int-filter-btn[aria-pressed="true"] { background:var(--color-surface); color:var(--color-text); box-shadow:var(--shadow-card); }
        .int-filter-count { font-size:10px; font-weight:700; padding:1px 6px; border-radius:999px; background:var(--color-border); color:var(--color-text-secondary); }
        .int-filter-btn[aria-pressed="true"] .int-filter-count { background:var(--color-brand-100); color:var(--color-brand-600); }

        .int-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:640px){ .int-grid { grid-template-columns:repeat(2, minmax(0,1fr)); } }
        @media(min-width:1200px){ .int-grid { grid-template-columns:repeat(3, minmax(0,1fr)); } }

        .int-card { position:relative; border-radius:14px; border:1.5px solid var(--color-border); background:var(--color-surface); transition:border-color .18s, transform .18s, box-shadow .18s; overflow:hidden; }
        .int-card[data-connected="true"] { border-color:rgba(46,71,224,0.22); }
        .int-card:hover { border-color:var(--color-brand-300); transform:translateY(-2px); box-shadow:0 8px 22px rgba(46,71,224,0.10); }
        .int-card-body { display:flex; flex-direction:column; gap:12px; padding:16px; height:100%; }

        .int-ribbon { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, transparent 0%, rgba(46,71,224,0.55) 50%, transparent 100%); }

        .int-card-head { display:flex; gap:12px; align-items:center; }
        .int-icon { flex-shrink:0; width:40px; height:40px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:16px; letter-spacing:-0.01em; text-transform:lowercase; }
        .int-title-wrap { min-width:0; flex:1; display:flex; flex-direction:column; gap:3px; }
        .int-title-row { display:flex; align-items:center; gap:6px; }
        .int-title { font-size:14px; font-weight:700; color:var(--color-text); letter-spacing:-0.01em; }
        .int-mini-status { display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; border-radius:999px; background:rgba(46,71,224,0.15); }
        .int-mini-dot { width:6px; height:6px; border-radius:999px; background:#2E47E0; box-shadow:0 0 0 2px rgba(46,71,224,0.25); }
        .int-category { display:inline-flex; align-self:flex-start; font-size:9.5px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--color-text-muted); background:var(--color-surface-2); padding:2px 7px; border-radius:999px; }
        .int-desc { margin:0; font-size:12.5px; line-height:1.5; color:var(--color-text-secondary); }

        .int-meta { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:auto; padding-top:10px; border-top:1px dashed var(--color-border); flex-wrap:wrap; }
        .int-status { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; color:var(--color-text-muted); }
        .int-status-label { white-space:nowrap; }
        .int-status-dot { width:7px; height:7px; border-radius:999px; background:var(--color-border-strong); flex-shrink:0; }
        .int-status[data-connected="true"] { color:#273DC0; }
        .int-status[data-connected="true"] .int-status-dot { background:#2E47E0; box-shadow:0 0 0 3px rgba(46,71,224,0.22); }
        .int-sync { font-size:11px; font-weight:500; color:var(--color-text-muted); white-space:nowrap; }

        .int-btn { width:100%; height:34px; padding:0 14px; border-radius:9px; font-size:12.5px; font-weight:700; cursor:pointer; transition:background .15s, border-color .15s, color .15s, transform .12s; border:1.5px solid transparent; display:inline-flex; align-items:center; justify-content:center; white-space:nowrap; letter-spacing:-0.01em; }
        .int-btn-primary { background:var(--color-brand-500); color:#fff; box-shadow:0 4px 12px rgba(46,71,224,0.22); }
        .int-btn-primary:hover { background:var(--color-brand-600); transform:translateY(-1px); }
        .int-btn-secondary { background:var(--color-surface-2); border-color:var(--color-border); color:var(--color-text-secondary); }
        .int-btn-secondary:hover { border-color:rgba(32,49,156,0.35); color:#20319C; background:rgba(32,49,156,0.08); }

        .int-empty { padding:40px 16px; border:1.5px dashed var(--color-border); border-radius:14px; text-align:center; color:var(--color-text-muted); font-size:12.5px; }
      `}</style>

      <Card>
        <div className="int-header">
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>
              Connected Apps
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
              Connect your tools to automate workflows and keep data in sync.
              {" "}
              <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
                {connectedCount} of {totalCount} connected
              </span>
            </p>
          </div>
          <div className="int-filters" role="group" aria-label="Filter integrations">
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
                className="int-filter-btn"
              >
                {f.label}
                <span className="int-filter-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="int-empty">No integrations in this view.</div>
        ) : (
          <div className="int-grid">
            {visible.map(app => (
              <IntegrationCard
                key={app.id}
                app={app}
                connected={!!connected[app.id]}
                onToggle={() => setConnected(p => ({ ...p, [app.id]: !p[app.id] }))}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function AppearanceTab() {
  const {
    theme, density, resolvedTheme,
    setTheme, setDensity, reset,
    save, discard, isDirty, savedAt,
  } = useTheme();
  const [justSaved, setJustSaved] = useState(false);

  function handleSave() {
    save();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Theme</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Currently showing <strong style={{ color: "var(--color-text)" }}>{resolvedTheme}</strong>
          {theme === "system" && " (following your system preference)"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {(["light", "dark", "system"] as const).map((t) => {
            const selected = theme === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={selected}
                onClick={() => { setTheme(t as ThemeMode);}}
                style={{
                  padding: 14, borderRadius: 12, cursor: "pointer",
                  border: selected ? "2px solid var(--color-brand-500)" : "1.5px solid var(--color-border)",
                  background: t === "dark" ? "#262626" : "var(--color-bg-base)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "transform .12s, border-color .12s",
                }}
              >
                <div style={{ width: "100%", height: 48, borderRadius: 8, background: t === "dark" ? "#262626" : "var(--color-surface)", border: "1px solid rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MonitorIcon size={18} style={{ color: t === "dark" ? "#96A3EF" : "var(--color-brand-500)" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: t === "dark" ? "#EAEAEA" : "var(--color-text)", textTransform: "capitalize" }}>{t}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Layout Density</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Adjusts spacing, font size, and card scale across the dashboard. Changes apply immediately.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {(
            [
              { id: "compact",  label: "Compact",  hint: "Fits more on screen", scale: "0.94×", lines: 4 },
              { id: "default",  label: "Default",  hint: "Balanced",            scale: "1.00×", lines: 3 },
              { id: "spacious", label: "Spacious", hint: "More breathing room", scale: "1.06×", lines: 2 },
            ] as const
          ).map((opt) => {
            const selected = density === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={selected}
                onClick={() => { setDensity(opt.id as Density); }}
                style={{
                  position: "relative",
                  padding: "14px 14px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: selected ? "2px solid var(--color-brand-500)" : "1.5px solid var(--color-border)",
                  background: selected ? "rgba(var(--accent-rgb, 91, 61, 245), 0.08)" : "var(--color-bg-base)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  transition: "border-color .15s, background .15s, transform .12s",
                  textAlign: "left",
                }}
              >
                {/* Preview rows — visually show the density */}
                <div
                  aria-hidden
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: opt.id === "compact" ? 4 : opt.id === "default" ? 6 : 9,
                    padding: opt.id === "compact" ? 6 : opt.id === "default" ? 8 : 10,
                    borderRadius: 8,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    minHeight: 64,
                  }}
                >
                  {Array.from({ length: opt.lines }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: i === 0
                          ? "var(--color-brand-500)"
                          : "var(--color-border-strong)",
                        width: i === 0 ? "65%" : i === opt.lines - 1 ? "40%" : "85%",
                        opacity: i === 0 ? 0.85 : 0.5,
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--color-text)" }}>
                    {opt.label}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: selected ? "var(--color-brand-500)" : "var(--color-text-muted)",
                    fontFamily: "ui-monospace, monospace",
                  }}>
                    {opt.scale}
                  </span>
                </div>
                <span style={{ fontSize: 11.5, color: "var(--color-text-secondary)", lineHeight: 1.3 }}>
                  {opt.hint}
                </span>

                {selected && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "var(--color-brand-500)",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon size={11} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Sticky save bar */}
      <div
        style={{
          position: "sticky",
          bottom: 16,
          zIndex: 5,
          marginTop: 4,
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border)",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 10px 32px rgba(31, 27, 23, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              width: 8, height: 8, borderRadius: 999,
              background: isDirty ? "#5C6FE7" : justSaved ? "#2E47E0" : "#D4D4D4",
              flexShrink: 0,
              transition: "background .15s",
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>
              {isDirty
                ? "You have unsaved appearance changes"
                : justSaved
                ? "Appearance saved"
                : savedAt
                ? "All changes saved"
                : "No changes yet"}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
              Previewing <strong style={{ color: "var(--color-text-secondary)" }}>{resolvedTheme}</strong>
              {" · "}{density}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            type="button"
            onClick={reset}
            style={{
              height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={discard}
            disabled={!isDirty}
            style={{
              height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)", color: "var(--color-text-secondary)", fontSize: 13, fontWeight: 600,
              cursor: isDirty ? "pointer" : "not-allowed",
              opacity: isDirty ? 1 : 0.4,
            }}
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty && !justSaved}
            style={{
              height: 40, padding: "0 22px", borderRadius: 10, border: "none",
              background: justSaved ? "#2E47E0" : "var(--color-brand-500)",
              color: "var(--color-surface)", fontSize: 14, fontWeight: 600,
              cursor: isDirty || justSaved ? "pointer" : "not-allowed",
              opacity: isDirty || justSaved ? 1 : 0.55,
              display: "flex", alignItems: "center", gap: 6,
              transition: "background .15s, opacity .15s",
              boxShadow: isDirty ? "0 6px 16px rgba(46, 71, 224, 0.25)" : "none",
            }}
          >
            {justSaved ? <><CheckIcon size={14} /> Saved</> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SettingsPageClient() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const tabContent: Record<Tab, React.ReactNode> = {
    profile:       <ProfileTab />,
    team:          <TeamTab />,
    notifications: <NotificationsTab />,
    security:      <SecurityTab />,
    integrations:  <IntegrationsTab />,
    appearance:    <AppearanceTab />,
  };

  return (
    <div className="settings-shell">
      <style>{`
        .settings-shell { display:flex; flex-direction:column; min-height:calc(100dvh - 64px); background:var(--color-bg-base); }
        @media(min-width:900px){ .settings-shell { flex-direction:row; } }

        /* Mobile: horizontal scrolling tab strip pinned at the top */
        .settings-tabs-mobile { display:flex; overflow-x:auto; gap:6px; padding:10px 14px; background:var(--color-surface); border-bottom:1px solid var(--color-border); position:sticky; top:0; z-index:5; scrollbar-width:none; }
        .settings-tabs-mobile::-webkit-scrollbar { display:none; }
        .settings-tab-pill { display:inline-flex; align-items:center; gap:7px; height:34px; padding:0 14px; border-radius:999px; border:1px solid var(--color-border); background:var(--color-surface); color:var(--color-text-secondary); font-size:13px; font-weight:600; white-space:nowrap; cursor:pointer; flex-shrink:0; transition:all .15s; }
        .settings-tab-pill:hover { color:var(--color-text); border-color:var(--color-border-strong); }
        .settings-tab-pill[aria-pressed="true"] { background:var(--color-brand-50); border-color:var(--color-brand-200); color:var(--color-brand-600); }

        @media(min-width:900px){ .settings-tabs-mobile { display:none; } }

        /* Desktop sidebar */
        .settings-sidebar { display:none; }
        @media(min-width:900px){
          .settings-sidebar { display:block; width:240px; min-width:240px; background:var(--color-surface); border-right:1.5px solid var(--color-border); padding:24px 12px; }
        }
        .settings-side-title { padding:0 8px 16px; font-size:11px; font-weight:700; color:var(--color-text-muted); letter-spacing:.06em; text-transform:uppercase; }
        .settings-side-btn { width:100%; text-align:left; height:42px; padding:0 12px; border-radius:10px; border:none; background:transparent; color:var(--color-text-secondary); font-size:14px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:10px; margin-bottom:2px; transition:all .12s; }
        .settings-side-btn:hover { background:var(--color-bg-base); }
        .settings-side-btn[aria-pressed="true"] { background:var(--color-brand-100); color:var(--color-brand-500); font-weight:600; }
        .settings-side-btn[aria-pressed="true"] .settings-side-icon { opacity:1; }
        .settings-side-icon { opacity:0.6; }

        /* Danger zone */
        .settings-danger { margin-top:24px; padding:0 8px; }
        .settings-danger-title { font-size:11px; font-weight:700; color:var(--color-text-muted); letter-spacing:.06em; text-transform:uppercase; margin-bottom:8px; }
        .settings-danger-btn { width:100%; height:38px; border-radius:10px; border:1.5px solid #C4CBF6; background:#C4CBF6; color:#20319C; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; }
        .settings-danger-btn:hover { background:transparent; }

        /* Content */
        .settings-content { flex:1; min-width:0; padding:18px 16px 32px; overflow-y:auto; }
        @media(min-width:640px){ .settings-content { padding:24px 22px 32px; } }
        @media(min-width:900px){ .settings-content { padding:28px 32px; } }
        .settings-content-inner { max-width:760px; margin:0 auto; }
        @media(min-width:900px){ .settings-content-inner { margin:0; } }
        .settings-page-title { margin:0 0 4px; font-size:22px; font-weight:700; color:var(--color-text); letter-spacing:-0.01em; }
        @media(min-width:640px){ .settings-page-title { font-size:24px; } }
        .settings-page-sub { margin:0 0 24px; font-size:13.5px; color:var(--color-text-secondary); }
      `}</style>

      {/* Mobile tabs */}
      <nav className="settings-tabs-mobile" aria-label="Settings sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className="settings-tab-pill"
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ display: "inline-flex" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Desktop sidebar */}
      <aside className="settings-sidebar">
        <div className="settings-side-title">Settings</div>
        <nav>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="settings-side-btn"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-side-icon">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id ? (
                <ChevronRight size={13} style={{ marginLeft: "auto", color: "var(--color-brand-500)" }} />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="settings-danger">
          <div className="settings-danger-title">Danger Zone</div>
          <button type="button" className="settings-danger-btn">
            Delete Account
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="settings-content">
        <div className="settings-content-inner">
          <div>
            <h1 className="settings-page-title">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="settings-page-sub">
              Manage your {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} settings
            </p>
          </div>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
