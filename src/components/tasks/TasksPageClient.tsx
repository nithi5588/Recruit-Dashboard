"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
} from "react";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  DownloadIcon,
  FilterIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  TasksIcon,
  UsersIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { exportToExcel } from "@/lib/export-utils";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Priority = "high" | "medium" | "low";
type TaskStatus = "todo" | "in-progress" | "done";

type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  candidate?: string;
  job?: string;
  assignee: { initials: string; color: string; name: string };
  tags: string[];
};

const sampleTasks: Task[] = [
  { id: "t1",  title: "Follow up with Savannah Nguyen",            description: "Send updated resume to client and get feedback on product design role.", priority: "high",   status: "todo",        dueDate: "Today",       candidate: "Savannah Nguyen",    job: "Product Designer",      assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Follow-up", "Interview"] },
  { id: "t2",  title: "Schedule technical round for Ralph Edwards", description: "Coordinate with Atlassian hiring team for backend assessment.",          priority: "high",   status: "todo",        dueDate: "Today",       candidate: "Ralph Edwards",      job: "Frontend Developer",    assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Interview"] },
  { id: "t3",  title: "Review 5 new candidate profiles",            description: "Screen profiles for DevOps roles and update scores.",                    priority: "medium", status: "in-progress", dueDate: "Tomorrow",    candidate: undefined,            job: "DevOps Engineer",       assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Screening"] },
  { id: "t4",  title: "Send offer letter to Cameron Williamson",    description: "Prepare and send offer package for Product Manager position.",           priority: "high",   status: "in-progress", dueDate: "Today",       candidate: "Cameron Williamson", job: "Product Manager",       assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Offer"] },
  { id: "t5",  title: "Update JD for UX Researcher role",           description: "Add revised skill requirements and remote work policy.",                 priority: "low",    status: "todo",        dueDate: "Apr 25",      candidate: undefined,            job: "UX Researcher",         assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Admin"] },
  { id: "t6",  title: "Prepare weekly pipeline report",             description: "Compile metrics for leadership review meeting.",                         priority: "medium", status: "todo",        dueDate: "Apr 25",      candidate: undefined,            job: undefined,               assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Report"] },
  { id: "t7",  title: "Call Dianne Russell — follow-up pending",    description: "She asked for update on marketing manager screening result.",            priority: "medium", status: "in-progress", dueDate: "Yesterday",   candidate: "Dianne Russell",     job: "Marketing Manager",     assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Follow-up"] },
  { id: "t8",  title: "Send JD to Esther Howard",                   description: "UX Research role at Google — attach JD and instructions.",              priority: "low",    status: "done",        dueDate: "Apr 22",      candidate: "Esther Howard",      job: "UX Researcher",         assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Outreach"] },
  { id: "t9",  title: "Complete background check for Albert Flores", description: "Initiate BGV process through vendor portal.",                          priority: "medium", status: "done",        dueDate: "Apr 21",      candidate: "Albert Flores",      job: "DevOps Engineer",       assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["BGV"] },
  { id: "t10", title: "Sync with client — Shopify hiring status",   description: "Weekly check-in on open positions and pipeline progress.",              priority: "medium", status: "todo",        dueDate: "Apr 26",      candidate: undefined,            job: undefined,               assignee: { initials: "NB", color: "#5B3DF5", name: "Nithish" },    tags: ["Client"] },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  high:   { label: "High",   bg: "#FDECEC", text: "#DC2626", dot: "#EF4444" },
  medium: { label: "Medium", bg: "#FFF4DB", text: "#B45309", dot: "#F59E0B" },
  low:    { label: "Low",    bg: "#EAFBF1", text: "#166534", dot: "#22C55E" },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; bg: string; text: string }> = {
  "todo":        { label: "To Do",       bg: "#F3F4F8", text: "#667085" },
  "in-progress": { label: "In Progress", bg: "#EAF2FF", text: "#1E40AF" },
  "done":        { label: "Done",        bg: "#EAFBF1", text: "#166534" },
};

type TabKey = "all" | "today" | "priority" | "overdue" | "done";
const TABS: { key: TabKey; label: string }[] = [
  { key: "all",      label: "All Tasks" },
  { key: "today",    label: "Due Today" },
  { key: "priority", label: "High Priority" },
  { key: "overdue",  label: "Overdue" },
  { key: "done",     label: "Completed" },
];

const DEFAULT_ASSIGNEE = { initials: "NB", color: "#5B3DF5", name: "Nithish" } as const;

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function toYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateToLabel(ymd: string): string {
  if (!ymd) return "No due date";
  const d = new Date(ymd + "T00:00:00");
  if (Number.isNaN(d.getTime())) return ymd;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function labelToYmd(label: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (/today/i.test(label)) return toYmd(today);
  if (/tomorrow/i.test(label)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toYmd(d);
  }
  if (/yesterday/i.test(label)) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return toYmd(d);
  }
  const m = label.match(/^([A-Za-z]{3})\s+(\d{1,2})/);
  if (m) {
    const month = (MONTH_SHORT as readonly string[]).indexOf(m[1]);
    if (month >= 0) {
      const d = new Date(today.getFullYear(), month, parseInt(m[2], 10));
      return toYmd(d);
    }
  }
  return toYmd(today);
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging,
  justDropped,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  justDropped: boolean;
}) {
  const p = PRIORITY_CONFIG[task.priority];
  const s = STATUS_CONFIG[task.status];
  const isDone = task.status === "done";
  const isOverdue = task.dueDate === "Yesterday";

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={onEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit();
        }
      }}
      className={`group task-enter select-none rounded-[16px] border bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-card)] outline-none transition-all hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(23,26,43,0.08)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-400)] ${
        isDone
          ? "border-[color:var(--color-border)] opacity-75"
          : "border-[color:var(--color-border)]"
      } ${isDragging ? "task-card-dragging" : ""} ${justDropped ? "task-just-dropped" : ""}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isDone
              ? "border-[color:var(--color-success)] bg-[color:var(--color-success)]"
              : "border-[color:var(--color-border)] hover:border-[color:var(--color-brand-400)]"
          }`}
        >
          {isDone && <CheckIcon size={10} className="text-white" />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <p className={`text-[13px] font-semibold leading-snug text-[color:var(--color-text)] ${isDone ? "line-through opacity-60" : ""}`}>
              {task.title}
            </p>
            <button
              type="button"
              aria-label="Edit task"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="shrink-0 text-[color:var(--color-text-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[color:var(--color-text)]"
            >
              <MoreIcon size={15} />
            </button>
          </div>

          {task.description && (
            <p className="mb-2 text-[11px] leading-relaxed text-[color:var(--color-text-secondary)] line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority badge */}
            <span
              className="rounded-[999px] px-2 py-[2px] text-[10px] font-semibold"
              style={{ backgroundColor: p.bg, color: p.text }}
            >
              {p.label}
            </span>

            {/* Status badge */}
            <span
              className="rounded-[999px] px-2 py-[2px] text-[10px] font-semibold"
              style={{ backgroundColor: s.bg, color: s.text }}
            >
              {s.label}
            </span>

            {/* Due date */}
            <div className={`flex items-center gap-1 text-[11px] ${isOverdue && !isDone ? "font-semibold text-[color:var(--color-error)]" : "text-[color:var(--color-text-muted)]"}`}>
              <CalendarIcon size={11} />
              {task.dueDate}
              {isOverdue && !isDone && " — Overdue"}
            </div>

            {/* Tags */}
            {task.tags.map((tag) => (
              <span key={tag} className="rounded-[999px] bg-[color:var(--color-surface-2)] px-2 py-[1px] text-[10px] font-medium text-[color:var(--color-text-secondary)]">
                {tag}
              </span>
            ))}
          </div>

          {/* Linked items */}
          {(task.candidate || task.job) && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {task.candidate && (
                <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-brand-500)]">
                  <UsersIcon size={11} />
                  {task.candidate}
                </div>
              )}
              {task.job && (
                <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-secondary)]">
                  <BriefcaseIcon size={11} />
                  {task.job}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignee */}
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: task.assignee.color }}
          title={task.assignee.name}
        >
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function TaskStats({ tasks }: { tasks: Task[] }) {
  const total   = tasks.length;
  const today   = tasks.filter((t) => t.dueDate === "Today" && t.status !== "done").length;
  const overdue = tasks.filter((t) => t.dueDate === "Yesterday" && t.status !== "done").length;
  const done    = tasks.filter((t) => t.status === "done").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats: Array<{
    label: string;
    value: number;
    color: string;
    bg: string;
    pill?: string;
  }> = [
    { label: "Total",     value: total,   color: "#5B3DF5", bg: "#EEE9FF" },
    { label: "Due today", value: today,   color: "#F59E0B", bg: "#FFF4DB" },
    { label: "Overdue",   value: overdue, color: "#EF4444", bg: "#FDECEC" },
    { label: "Completed", value: done,    color: "#22C55E", bg: "#EAFBF1", pill: `${progress}%` },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2 shadow-[var(--shadow-card)] sm:grid-cols-4 sm:gap-0 sm:p-0">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 sm:rounded-none sm:px-4 sm:py-3 ${
            i > 0 ? "sm:border-l sm:border-[color:var(--color-border)]" : ""
          }`}
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[13px] font-bold tabular-nums"
            style={{ background: s.bg, color: s.color }}
          >
            {s.value}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
              {s.label}
            </p>
            <div className="flex items-center gap-1.5">
              <p className="text-[17px] font-bold leading-none text-[color:var(--color-text)]">
                {s.value}
              </p>
              {s.pill ? (
                <span className="inline-flex items-center rounded-[999px] bg-[color:var(--color-success-light)] px-1.5 py-[1px] text-[10px] font-bold text-[color:var(--color-success)]">
                  {s.pill}
                </span>
              ) : null}
            </div>
            {s.label === "Completed" ? (
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[color:var(--color-surface-2)]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: s.color }}
                />
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Task Editor Modal (create + edit) ───────────────────────────────────────

type TaskEditorMode =
  | { kind: "create"; status?: TaskStatus }
  | { kind: "edit"; task: Task };

function TaskEditorModal({
  open,
  mode,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  mode: TaskEditorMode;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
}) {
  const isEdit = mode.kind === "edit";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueYmd, setDueYmd] = useState<string>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return toYmd(d);
  });
  const [candidate, setCandidate] = useState("");
  const [job, setJob] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (mode.kind === "edit") {
      const t = mode.task;
      setTitle(t.title);
      setDescription(t.description ?? "");
      setStatus(t.status);
      setPriority(t.priority);
      setDueYmd(labelToYmd(t.dueDate));
      setCandidate(t.candidate ?? "");
      setJob(t.job ?? "");
      setTagsInput(t.tags.join(", "));
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setTitle("");
      setDescription("");
      setStatus(mode.status ?? "todo");
      setPriority("medium");
      setDueYmd(toYmd(today));
      setCandidate("");
      setJob("");
      setTagsInput("");
    }
    setError(null);
    requestAnimationFrame(() => titleRef.current?.focus());
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setError("Please add a title.");
      return;
    }
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const base: Task = {
      id: isEdit ? mode.task.id : `t-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dateToLabel(dueYmd),
      candidate: candidate.trim() || undefined,
      job: job.trim() || undefined,
      assignee: isEdit ? mode.task.assignee : { ...DEFAULT_ASSIGNEE },
      tags,
    };
    onSave(base);
  };

  const handleDelete = () => {
    if (!isEdit || !onDelete) return;
    onDelete(mode.task.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-editor-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <div className="relative z-10 flex w-full max-w-[560px] max-h-[92vh] flex-col overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_24px_60px_rgba(15,16,20,0.22)]">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 border-b border-[color:var(--color-border)] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                aria-hidden
              >
                <TasksIcon size={15} />
              </span>
              <h2
                id="task-editor-title"
                className="text-[16px] font-bold tracking-tight text-[color:var(--color-text)]"
              >
                {isEdit ? "Edit task" : "New task"}
              </h2>
            </div>
            <p className="mt-0.5 text-[12px] text-[color:var(--color-text-secondary)]">
              {isEdit
                ? "Update details, status, or priority."
                : "Capture a recruiter action and keep your pipeline moving."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            <XIcon size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* Title */}
          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Title
            </span>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow up with Savannah Nguyen"
              className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Description <span className="text-[color:var(--color-text-muted)]">(optional)</span>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Context, links, next actions…"
              className="mt-1 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          {/* Status + Priority */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Status
              </p>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {(["todo", "in-progress", "done"] as const).map((k) => {
                  const cfg = STATUS_CONFIG[k];
                  const active = status === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setStatus(k)}
                      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] border text-[12px] font-semibold transition-colors ${
                        active
                          ? "border-transparent text-[color:var(--color-text)] shadow-[0_1px_2px_rgba(23,26,43,0.04)]"
                          : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                      }`}
                      style={
                        active
                          ? { background: cfg.bg, color: cfg.text, boxShadow: `0 0 0 1px ${cfg.text}33` }
                          : undefined
                      }
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Priority
              </p>
              <div className="mt-1 grid grid-cols-3 gap-1.5">
                {(["high", "medium", "low"] as const).map((k) => {
                  const cfg = PRIORITY_CONFIG[k];
                  const active = priority === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setPriority(k)}
                      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-[10px] border text-[12px] font-semibold transition-colors ${
                        active
                          ? "border-transparent shadow-[0_1px_2px_rgba(23,26,43,0.04)]"
                          : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                      }`}
                      style={
                        active
                          ? { background: cfg.bg, color: cfg.text, boxShadow: `0 0 0 1px ${cfg.dot}55` }
                          : undefined
                      }
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: cfg.dot }}
                      />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Due date */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Due date
              </span>
              <input
                type="date"
                value={dueYmd}
                onChange={(e) => setDueYmd(e.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
            </label>
            <div className="flex items-end">
              <span className="inline-flex h-10 items-center rounded-[10px] bg-[color:var(--color-surface-2)] px-3 text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                {dateToLabel(dueYmd)}
              </span>
            </div>
          </div>

          {/* Candidate + Job */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Candidate <span className="text-[color:var(--color-text-muted)]">(optional)</span>
              </span>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                  <UsersIcon size={14} />
                </span>
                <input
                  type="text"
                  value={candidate}
                  onChange={(e) => setCandidate(e.target.value)}
                  placeholder="e.g. Savannah Nguyen"
                  className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Job <span className="text-[color:var(--color-text-muted)]">(optional)</span>
              </span>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]">
                  <BriefcaseIcon size={14} />
                </span>
                <input
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="e.g. Product Designer"
                  className="h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
                />
              </div>
            </label>
          </div>

          {/* Tags */}
          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Tags <span className="text-[color:var(--color-text-muted)]">(comma-separated)</span>
            </span>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Follow-up, Interview, Offer"
              className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
            {tagsInput.trim() ? (
              <div className="mt-2 flex flex-wrap gap-1">
                {tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-[999px] bg-[color:var(--color-surface-2)] px-2 py-[1px] text-[10px] font-medium text-[color:var(--color-text-secondary)]"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            ) : null}
          </label>

          {error ? (
            <p className="text-[12px] font-semibold text-[color:var(--color-error)]">
              {error}
            </p>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-5 py-3">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[12px] font-semibold text-[color:var(--color-error)] transition-colors hover:bg-[color:var(--color-error-light)]"
            >
              Delete task
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded-[10px] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(91,61,245,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
            >
              {isEdit ? (
                <>
                  <CheckIcon size={13} />
                  Save changes
                </>
              ) : (
                <>
                  <PlusIcon size={13} />
                  Create task
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function TasksPageClient() {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
  const [justDroppedId, setJustDroppedId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<TaskEditorMode | null>(null);
  const dropResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCreate = useCallback((status?: TaskStatus) => {
    setEditorMode({ kind: "create", status });
  }, []);
  const openEdit = useCallback((task: Task) => {
    setEditorMode({ kind: "edit", task });
  }, []);
  const closeEditor = useCallback(() => setEditorMode(null), []);

  const handleSaveTask = useCallback((task: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id);
      if (exists) return prev.map((t) => (t.id === task.id ? task : t));
      return [task, ...prev];
    });
    setJustDroppedId(task.id);
    if (dropResetRef.current) clearTimeout(dropResetRef.current);
    dropResetRef.current = setTimeout(() => setJustDroppedId(null), 900);
    setEditorMode(null);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEditorMode(null);
  }, []);

  useEffect(() => {
    return () => {
      if (dropResetRef.current) clearTimeout(dropResetRef.current);
    };
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t,
      ),
    );
  };

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>, task: Task) => {
      setDraggingId(task.id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", task.id);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverCol(null);
  }, []);

  const handleColumnDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>, col: TaskStatus) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverCol((prev) => (prev === col ? prev : col));
    },
    [],
  );

  const handleColumnDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>, col: TaskStatus) => {
      const related = e.relatedTarget as Node | null;
      const current = e.currentTarget as Node;
      if (related && current.contains(related)) return;
      setDragOverCol((prev) => (prev === col ? null : prev));
    },
    [],
  );

  const handleColumnDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, col: TaskStatus) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain") || draggingId;
      if (!id) return;
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        if (!task || task.status === col) return prev;
        return prev.map((t) => (t.id === id ? { ...t, status: col } : t));
      });
      setJustDroppedId(id);
      if (dropResetRef.current) clearTimeout(dropResetRef.current);
      dropResetRef.current = setTimeout(() => setJustDroppedId(null), 900);
      setDraggingId(null);
      setDragOverCol(null);
    },
    [draggingId],
  );

  const filtered = tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.candidate?.toLowerCase().includes(q) ?? false) ||
      (t.job?.toLowerCase().includes(q) ?? false);

    const matchTab =
      tab === "all"      ? true :
      tab === "today"    ? t.dueDate === "Today" && t.status !== "done" :
      tab === "priority" ? t.priority === "high" && t.status !== "done" :
      tab === "overdue"  ? t.dueDate === "Yesterday" && t.status !== "done" :
      /* done */           t.status === "done";

    return matchSearch && matchTab;
  });

  const grouped = {
    todo:        filtered.filter((t) => t.status === "todo"),
    "in-progress": filtered.filter((t) => t.status === "in-progress"),
    done:        filtered.filter((t) => t.status === "done"),
  };

  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">Tasks</h1>
            <TasksIcon size={20} className="text-[color:var(--color-brand-500)]" />
          </div>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Keep track of follow-ups, interviews, and recruiter actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (filtered.length === 0) return;
              exportToExcel({
                filename: "tasks",
                sheetName: "Tasks",
                columns: [
                  { header: "Title", key: "title", width: 36 },
                  { header: "Description", key: (t: Task) => t.description ?? "", width: 40 },
                  { header: "Status", key: (t: Task) => STATUS_CONFIG[t.status].label, width: 14 },
                  { header: "Priority", key: (t: Task) => PRIORITY_CONFIG[t.priority].label, width: 12 },
                  { header: "Due Date", key: "dueDate", width: 14 },
                  { header: "Candidate", key: (t: Task) => t.candidate ?? "", width: 22 },
                  { header: "Job", key: (t: Task) => t.job ?? "", width: 22 },
                  { header: "Assignee", key: (t: Task) => t.assignee.name, width: 16 },
                  { header: "Tags", key: (t: Task) => t.tags.join(", "), width: 26 },
                  { header: "ID", key: "id", width: 10 },
                ],
                rows: filtered,
              });
            }}
            disabled={filtered.length === 0}
            title={`Export ${filtered.length} task${filtered.length === 1 ? "" : "s"} to Excel`}
            className="flex h-10 items-center gap-2 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            type="button"
            onClick={() => openCreate()}
            className="flex h-10 items-center gap-2 rounded-[12px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(91,61,245,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <PlusIcon size={15} />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <TaskStats tasks={tasks} />

      {/* Search + filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks, candidates, jobs..."
            className="h-10 w-full rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-9 pr-4 text-[13px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-muted)] outline-none transition focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
          />
        </div>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 text-[13px] font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] transition-colors"
        >
          <FilterIcon size={14} />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 border-b border-[color:var(--color-border)]">
        {TABS.map((t) => {
          const count =
            t.key === "all"      ? tasks.length :
            t.key === "today"    ? tasks.filter((x) => x.dueDate === "Today" && x.status !== "done").length :
            t.key === "priority" ? tasks.filter((x) => x.priority === "high" && x.status !== "done").length :
            t.key === "overdue"  ? tasks.filter((x) => x.dueDate === "Yesterday" && x.status !== "done").length :
            tasks.filter((x) => x.status === "done").length;

          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 pb-3 pt-2 text-[13px] font-medium transition-colors px-3 ${
                tab === t.key
                  ? "text-[color:var(--color-brand-500)]"
                  : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {t.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                    tab === t.key ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]" : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
                  }`}
                >
                  {count}
                </span>
              )}
              {tab === t.key && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[color:var(--color-brand-500)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Kanban hint */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-muted)]">
          <span
            aria-hidden
            className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Drag any card between columns to update its status.
        </p>
      </div>

      {/* Task groups */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[color:var(--color-brand-100)]">
            <TasksIcon size={28} className="text-[color:var(--color-brand-500)]" />
          </div>
          <h3 className="mb-1 text-[15px] font-semibold text-[color:var(--color-text)]">
            No tasks found
          </h3>
          <p className="text-[13px] text-[color:var(--color-text-secondary)]">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {(
            [
              {
                key: "todo",
                label: "To Do",
                color: "#667085",
                bg: "#F3F4F8",
                count: grouped.todo.length,
              },
              {
                key: "in-progress",
                label: "In Progress",
                color: "#1E40AF",
                bg: "#EAF2FF",
                count: grouped["in-progress"].length,
              },
              {
                key: "done",
                label: "Done",
                color: "#166534",
                bg: "#EAFBF1",
                count: grouped.done.length,
              },
            ] as const
          ).map((col) => {
            const isDropTarget = dragOverCol === col.key;
            const isDragging = draggingId !== null;
            const colTasks =
              grouped[col.key === "in-progress" ? "in-progress" : (col.key as "todo" | "done")];

            return (
              <div
                key={col.key}
                onDragOver={(e) => handleColumnDragOver(e, col.key)}
                onDragLeave={(e) => handleColumnDragLeave(e, col.key)}
                onDrop={(e) => handleColumnDrop(e, col.key)}
                className={`task-column relative flex flex-col overflow-hidden rounded-[18px] border bg-[color:var(--color-surface-2)]/40 p-3 ${
                  isDropTarget
                    ? "task-column-droppable"
                    : "border-[color:var(--color-border)]"
                } ${isDragging && !isDropTarget ? "opacity-95" : ""}`}
              >
                {/* Column header */}
                <div className="mb-3 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-6 items-center gap-1.5 rounded-[999px] px-2 text-[11px] font-bold"
                      style={{ background: col.bg, color: col.color }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: col.color }}
                      />
                      {col.label}
                    </span>
                    <span className="text-[12px] font-semibold text-[color:var(--color-text-muted)]">
                      {col.count}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Add task to ${col.label}`}
                    onClick={() => openCreate(col.key)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-brand-600)]"
                  >
                    <PlusIcon size={14} />
                  </button>
                </div>

                {/* Cards */}
                <div className="flex min-h-[120px] flex-col gap-3">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onEdit={() => openEdit(task)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggingId === task.id}
                      justDropped={justDroppedId === task.id}
                    />
                  ))}

                  {colTasks.length === 0 ? (
                    <div
                      className={`flex min-h-[120px] flex-col items-center justify-center rounded-[14px] border-2 border-dashed px-4 py-6 text-center transition-colors ${
                        isDropTarget
                          ? "drop-zone-active border-[color:var(--color-brand-400)] bg-[color:var(--color-brand-50)]"
                          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/40"
                      }`}
                    >
                      <div
                        className={`mb-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          isDropTarget
                            ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                            : "bg-[color:var(--color-surface-2)] text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        <PlusIcon size={14} />
                      </div>
                      <p
                        className={`text-[12px] font-medium ${
                          isDropTarget
                            ? "text-[color:var(--color-brand-600)]"
                            : "text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        {isDropTarget ? "Drop here" : "No tasks here"}
                      </p>
                      {!isDropTarget ? (
                        <p className="text-[11px] text-[color:var(--color-text-muted)]">
                          Drag a task to this column
                        </p>
                      ) : null}
                    </div>
                  ) : isDropTarget ? (
                    <div className="drop-zone-active mt-0 rounded-[14px] border-2 border-dashed border-[color:var(--color-brand-400)] bg-[color:var(--color-brand-50)] px-4 py-4 text-center">
                      <p className="text-[12px] font-semibold text-[color:var(--color-brand-600)]">
                        Drop here to move to {col.label}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskEditorModal
        open={editorMode !== null}
        mode={editorMode ?? { kind: "create" }}
        onClose={closeEditor}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
