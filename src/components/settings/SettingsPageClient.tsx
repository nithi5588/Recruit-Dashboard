"use client";

import { useState } from "react";
import {
  SettingsIcon, UsersIcon, ShieldIcon, BellIcon, GlobeIcon,
  MonitorIcon, AtIcon, CheckIcon, PlusIcon, XIcon, EditIcon,
  ChevronRight,
} from "@/components/icons/AppIcons";
import {
  ACCENT_PRESETS,
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
  { id: "1", name: "Nithish Baddula", email: "Invisiedge@gmail.com",       role: "Admin",     avatar: "NB", color: "#8B5CF6", status: "active" },
  { id: "2", name: "Priya Mehta",     email: "priya.mehta@recruit.io",     role: "Recruiter", avatar: "PM", color: "#3B82F6", status: "active" },
  { id: "3", name: "Alex Johnson",    email: "alex.johnson@recruit.io",    role: "Recruiter", avatar: "AJ", color: "#22C55E", status: "active" },
  { id: "4", name: "Sarah Wilson",    email: "sarah.wilson@recruit.io",    role: "Viewer",    avatar: "SW", color: "#F59E0B", status: "pending" },
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
    ? "#16A34A"
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
          ? "0 6px 16px rgba(91, 61, 245, 0.28)"
          : "0 2px 6px rgba(91, 61, 245, 0.18)",
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
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "linear-gradient(135deg,#5B3DF5,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "var(--color-surface)" }}>
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

function TeamTab() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");

  function removeMember(id: string) {
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  const roleChip = (role: string) => {
    if (role === "Admin")     return { bg: "var(--chip-brand-bg)",   text: "var(--chip-brand-fg)" };
    if (role === "Recruiter") return { bg: "var(--chip-info-bg)",    text: "var(--chip-info-fg)" };
    return { bg: "var(--chip-neutral-bg)", text: "var(--chip-neutral-fg)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        .team-header { display:flex; flex-direction:column; gap:14px; align-items:flex-start; justify-content:space-between; margin-bottom:18px; }
        @media(min-width:720px){ .team-header { flex-direction:row; align-items:center; } }
        .team-invite { display:flex; align-items:center; gap:8px; width:100%; }
        @media(min-width:720px){ .team-invite { width:auto; min-width:360px; } }
        .team-invite-input { flex:1; }

        .team-row { display:grid; gap:12px; align-items:center; padding:12px 12px; border-bottom:1px solid var(--color-border); }
        .team-row:last-child { border-bottom:none; }
        .team-row-header { padding:10px 12px; border-radius:8px; background:var(--color-bg-base); border:none; }
        .team-row-header span { font-size:11px; font-weight:700; color:var(--color-text-muted); text-transform:uppercase; letter-spacing:.05em; }

        /* Compact grid on narrow screens */
        .team-row, .team-row-header { grid-template-columns: minmax(0, 1.3fr) 90px 90px 36px; }
        .team-col-email { display:none; }
        @media(min-width:900px){
          .team-row, .team-row-header { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.4fr) 110px 100px 36px; }
          .team-col-email { display:block; }
        }

        .team-member-cell { display:flex; align-items:center; gap:10px; min-width:0; }
        .team-avatar { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; flex-shrink:0; letter-spacing:-0.01em; }
        .team-name { font-size:14px; font-weight:600; color:var(--color-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0; }
        .team-email { font-size:13px; color:var(--color-text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .chip { display:inline-flex; align-items:center; justify-content:center; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:0.01em; white-space:nowrap; }

        .team-remove { width:28px; height:28px; border-radius:8px; border:1px solid var(--color-border); background:var(--color-surface); color:#EF4444; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: background .15s, border-color .15s, transform .15s; }
        .team-remove:hover:not(:disabled) { background:var(--chip-error-bg); border-color:transparent; transform:scale(1.05); }
        .team-remove:disabled { opacity:0.25; cursor:not-allowed; }

        .invite-btn { height:42px; padding:0 16px; border-radius:10px; border:none; background:var(--color-brand-500); color:#fff; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; transition: background .15s, box-shadow .15s, transform .15s; box-shadow:0 4px 12px rgba(var(--accent-rgb, 91,61,245), 0.28); }
        .invite-btn:hover { background:var(--color-brand-600); transform:translateY(-1px); }
      `}</style>

      <Card>
        <div className="team-header">
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Team Members</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
              {members.length} members · <span style={{ color: "var(--chip-brand-fg)", fontWeight: 600 }}>Pro plan</span>
            </p>
          </div>
          <div className="team-invite">
            <div className="team-invite-input">
              <Input value={inviteEmail} onChange={setInviteEmail} placeholder="colleague@company.com" type="email" />
            </div>
            <button type="button" className="invite-btn">
              <PlusIcon size={14} /> Invite
            </button>
          </div>
        </div>

        <div>
          {/* Header */}
          <div className="team-row team-row-header">
            <span>Member</span>
            <span className="team-col-email">Email</span>
            <span>Role</span>
            <span>Status</span>
            <span aria-hidden></span>
          </div>
          {members.map((m) => {
            const rc = roleChip(m.role);
            const isActive = m.status === "active";
            return (
              <div key={m.id} className="team-row">
                <div className="team-member-cell">
                  <div
                    className="team-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${m.color}33 0%, ${m.color}1A 100%)`,
                      color: m.color,
                      boxShadow: `inset 0 0 0 1px ${m.color}33`,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <span className="team-name" title={m.name}>{m.name}</span>
                </div>
                <span className="team-email team-col-email" title={m.email}>{m.email}</span>
                <span className="chip" style={{ background: rc.bg, color: rc.text }}>{m.role}</span>
                <span
                  className="chip"
                  style={{
                    background: isActive ? "var(--chip-success-bg)" : "var(--chip-warning-bg)",
                    color: isActive ? "var(--chip-success-fg)" : "var(--chip-warning-fg)",
                  }}
                >
                  {isActive ? "Active" : "Pending"}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${m.name}`}
                  onClick={() => removeMember(m.id)}
                  disabled={m.role === "Admin"}
                  className="team-remove"
                >
                  <XIcon size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Role Permissions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { role: "Admin",     perms: ["Full access", "Manage team", "Billing", "Settings"] },
            { role: "Recruiter", perms: ["Manage candidates", "Jobs", "Calendar", "Reports"] },
            { role: "Viewer",    perms: ["View candidates", "View reports"] },
          ].map((r) => {
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
          <span
            className="int-icon"
            style={{ background: app.color, boxShadow: `0 4px 14px ${app.color}40` }}
            aria-hidden
          >
            {app.icon}
          </span>
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
        .int-card[data-connected="true"] { border-color:rgba(34,197,94,0.22); }
        .int-card:hover { border-color:var(--color-brand-300); transform:translateY(-2px); box-shadow:0 8px 22px rgba(91,61,245,0.10); }
        .int-card-body { display:flex; flex-direction:column; gap:12px; padding:16px; height:100%; }

        .int-ribbon { position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.55) 50%, transparent 100%); }

        .int-card-head { display:flex; gap:12px; align-items:center; }
        .int-icon { flex-shrink:0; width:40px; height:40px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:16px; letter-spacing:-0.01em; text-transform:lowercase; }
        .int-title-wrap { min-width:0; flex:1; display:flex; flex-direction:column; gap:3px; }
        .int-title-row { display:flex; align-items:center; gap:6px; }
        .int-title { font-size:14px; font-weight:700; color:var(--color-text); letter-spacing:-0.01em; }
        .int-mini-status { display:inline-flex; align-items:center; justify-content:center; width:14px; height:14px; border-radius:999px; background:rgba(34,197,94,0.15); }
        .int-mini-dot { width:6px; height:6px; border-radius:999px; background:#22C55E; box-shadow:0 0 0 2px rgba(34,197,94,0.25); }
        .int-category { display:inline-flex; align-self:flex-start; font-size:9.5px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; color:var(--color-text-muted); background:var(--color-surface-2); padding:2px 7px; border-radius:999px; }
        .int-desc { margin:0; font-size:12.5px; line-height:1.5; color:var(--color-text-secondary); }

        .int-meta { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:auto; padding-top:10px; border-top:1px dashed var(--color-border); flex-wrap:wrap; }
        .int-status { display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; color:var(--color-text-muted); }
        .int-status-label { white-space:nowrap; }
        .int-status-dot { width:7px; height:7px; border-radius:999px; background:var(--color-border-strong); flex-shrink:0; }
        .int-status[data-connected="true"] { color:#16A34A; }
        .int-status[data-connected="true"] .int-status-dot { background:#22C55E; box-shadow:0 0 0 3px rgba(34,197,94,0.22); }
        .int-sync { font-size:11px; font-weight:500; color:var(--color-text-muted); white-space:nowrap; }

        .int-btn { width:100%; height:34px; padding:0 14px; border-radius:9px; font-size:12.5px; font-weight:700; cursor:pointer; transition:background .15s, border-color .15s, color .15s, transform .12s; border:1.5px solid transparent; display:inline-flex; align-items:center; justify-content:center; white-space:nowrap; letter-spacing:-0.01em; }
        .int-btn-primary { background:var(--color-brand-500); color:#fff; box-shadow:0 4px 12px rgba(91,61,245,0.22); }
        .int-btn-primary:hover { background:var(--color-brand-600); transform:translateY(-1px); }
        .int-btn-secondary { background:var(--color-surface-2); border-color:var(--color-border); color:var(--color-text-secondary); }
        .int-btn-secondary:hover { border-color:rgba(239,68,68,0.35); color:#EF4444; background:rgba(239,68,68,0.08); }

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
    theme, accent, density, resolvedTheme,
    setTheme, setAccent, setDensity, reset,
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
                  background: t === "dark" ? "#1E1B2E" : "var(--color-bg-base)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "transform .12s, border-color .12s",
                }}
              >
                <div style={{ width: "100%", height: 48, borderRadius: 8, background: t === "dark" ? "#2D2A3E" : "var(--color-surface)", border: "1px solid rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MonitorIcon size={18} style={{ color: t === "dark" ? "#818CF8" : "var(--color-brand-500)" }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: t === "dark" ? "#E2E8F0" : "var(--color-text)", textTransform: "capitalize" }}>{t}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--color-text)" }}>Accent Color</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--color-text-secondary)" }}>
          Drives buttons, active states, focus rings, and chart accents across the app.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {ACCENT_PRESETS.map((c) => {
            const selected = accent.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                aria-label={`Accent ${c}`}
                onClick={() => { setAccent(c);}}
                style={{
                  width: 36, height: 36, borderRadius: 10, background: c,
                  border: selected ? "3px solid var(--color-text)" : "3px solid transparent",
                  cursor: "pointer", transition: "transform .12s, border .12s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {selected && <CheckIcon size={14} style={{ color: "var(--color-surface)" }} />}
              </button>
            );
          })}

          {/* Custom color picker */}
          <label
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginLeft: 4, padding: "6px 10px", borderRadius: 999,
              border: "1.5px dashed var(--color-border)", cursor: "pointer",
              fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)",
            }}
          >
            <span
              aria-hidden
              style={{ width: 16, height: 16, borderRadius: 999, background: accent, border: "1px solid rgba(0,0,0,.1)" }}
            />
            Custom
            <input
              type="color"
              value={accent}
              onChange={(e) => { setAccent(e.target.value);}}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
            />
          </label>
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
          boxShadow: "0 10px 32px rgba(23, 26, 43, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              width: 8, height: 8, borderRadius: 999,
              background: isDirty ? "#F59E0B" : justSaved ? "#22C55E" : "#D1D5DB",
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
              {" · "}accent
              <span
                aria-hidden
                style={{ display: "inline-block", width: 8, height: 8, borderRadius: 999, background: accent, verticalAlign: "middle", margin: "0 4px" }}
              />
              <span style={{ fontFamily: "ui-monospace, monospace" }}>{accent.toUpperCase()}</span>
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
              background: justSaved ? "#22C55E" : "var(--color-brand-500)",
              color: "var(--color-surface)", fontSize: 14, fontWeight: 600,
              cursor: isDirty || justSaved ? "pointer" : "not-allowed",
              opacity: isDirty || justSaved ? 1 : 0.55,
              display: "flex", alignItems: "center", gap: 6,
              transition: "background .15s, opacity .15s",
              boxShadow: isDirty ? "0 6px 16px rgba(91, 61, 245, 0.25)" : "none",
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
    <div style={{ display: "flex", minHeight: "calc(100dvh - 64px)", background: "var(--color-bg-base)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, minWidth: 240, background: "var(--color-surface)", borderRight: "1.5px solid var(--color-border)", padding: "24px 12px" }}>
        <div style={{ padding: "0 8px 16px", fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: ".06em", textTransform: "uppercase" }}>
          Settings
        </div>
        <nav>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: "100%", textAlign: "left", height: 42,
                padding: "0 12px", borderRadius: 10, border: "none",
                background: activeTab === tab.id ? "var(--color-brand-100)" : "transparent",
                color: activeTab === tab.id ? "var(--color-brand-500)" : "var(--color-text-secondary)",
                fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                marginBottom: 2, transition: "all .12s",
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.background = "var(--color-bg-base)"; }}
              onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <span style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</span>
              {tab.label}
              {activeTab === tab.id && (
                <ChevronRight size={13} style={{ marginLeft: "auto", color: "var(--color-brand-500)" }} />
              )}
            </button>
          ))}
        </nav>

        {/* Danger zone */}
        <div style={{ marginTop: 24, padding: "0 8px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>Danger Zone</div>
          <button style={{ width: "100%", height: 38, borderRadius: 10, border: "1.5px solid #FECACA", background: "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Delete Account
          </button>
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        <div style={{ maxWidth: 760 }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "var(--color-text)" }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>
              Manage your {TABS.find(t => t.id === activeTab)?.label.toLowerCase()} settings
            </p>
          </div>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
