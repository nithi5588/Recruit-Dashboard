"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  FilterIcon,
  LinkChainIcon,
  MenuListIcon,
  MoreIcon,
  PhoneIcon,
  PlusIcon,
  RefreshIcon,
  SyncIcon,
  UsersIcon,
  VideoIcon,
  XIcon,
} from "@/components/icons/AppIcons";
import { exportToExcel } from "@/lib/export-utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType =
  | "interview"
  | "screening"
  | "client-call"
  | "client-meeting"
  | "hiring-manager-call"
  | "offer-discussion"
  | "team-standup"
  | "team-retro"
  | "follow-up"
  | "feedback-call";

type EventIconType = "video" | "phone" | "refresh" | "bell";

type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  subtitle?: string;
  date: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  iconType?: EventIconType;
  candidate?: {
    name: string;
    role: string;
    company: string;
    initials: string;
    color: string;
  };
  meetLink?: string;
  attendees?: Array<{ initials: string; color: string }>;
  notes?: string;
};

// ─── Style Map ────────────────────────────────────────────────────────────────

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  interview: "Interview",
  screening: "Screening Call",
  "client-call": "Client Call",
  "client-meeting": "Client Meeting",
  "hiring-manager-call": "Hiring Manager Call",
  "offer-discussion": "Offer Discussion",
  "team-standup": "Team Standup",
  "team-retro": "Team Retro",
  "follow-up": "Follow-up",
  "feedback-call": "Feedback Call",
};

const EVENT_TYPE_ORDER: EventType[] = [
  "interview",
  "screening",
  "client-call",
  "client-meeting",
  "hiring-manager-call",
  "offer-discussion",
  "team-standup",
  "team-retro",
  "follow-up",
  "feedback-call",
];

const EVENT_STYLES: Record<EventType, { bg: string; text: string; dot: string }> = {
  interview:               { bg: "#FCE9DD", text: "#C75510", dot: "#EA6814" },
  screening:               { bg: "#FFF6EE", text: "#C75510", dot: "#ED8E55" },
  "client-call":           { bg: "#FCE9DD", text: "#9F430D", dot: "#EA6814" },
  "client-meeting":        { bg: "#FCE9DD", text: "#9F430D", dot: "#EA6814" },
  "hiring-manager-call":   { bg: "#FCE9DD", text: "#9F430D", dot: "#EA6814" },
  "offer-discussion":      { bg: "#FFF6EE", text: "#9F430D", dot: "#C75510" },
  "team-standup":          { bg: "#F4F2EE", text: "#6B6358", dot: "#6B6358" },
  "team-retro":            { bg: "#F4F2EE", text: "#6B6358", dot: "#6B6358" },
  "follow-up":             { bg: "#FFF6EE", text: "#9F430D", dot: "#F97316" },
  "feedback-call":         { bg: "#FFF6EE", text: "#9F430D", dot: "#C75510" },
};

// ─── Constants ────────────────────────────────────────────────────────────────

const HOUR_H = 64;
const START_H = 7;
const END_H = 21;
const HOURS = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];
const DAY_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── Date Helpers ─────────────────────────────────────────────────────────────

function getMonday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toYMD(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  return toYMD(a) === toYMD(b);
}

function fmt12(h: number, m: number): string {
  const ampm = h < 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function fmtHour(h: number): string {
  if (h === 0)  return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

// ─── Event Geometry ───────────────────────────────────────────────────────────

function eventTop(e: CalendarEvent): number {
  return (e.startHour + e.startMin / 60 - START_H) * HOUR_H;
}

function eventHeight(e: CalendarEvent): number {
  const dur = (e.endHour + e.endMin / 60) - (e.startHour + e.startMin / 60);
  return Math.max(dur * HOUR_H, 22);
}

// ─── Event Generation ─────────────────────────────────────────────────────────

function genEvents(weekStart: Date): CalendarEvent[] {
  const days = Array.from({ length: 7 }, (_, i) => toYMD(addDays(weekStart, i)));
  const [mon, tue, wed, thu, fri, , sun] = days;

  return [
    {
      id: "e1", title: "Interview", type: "interview",
      subtitle: "Savannah Nguyen", date: mon,
      startHour: 9, startMin: 0, endHour: 10, endMin: 0, iconType: "video",
      candidate: { name: "Savannah Nguyen", role: "Senior Product Designer", company: "Shopify", initials: "SN", color: "#EA6814" },
    },
    {
      id: "e2", title: "Client Call", type: "client-call",
      subtitle: "Acme Corp", date: mon,
      startHour: 11, startMin: 0, endHour: 12, endMin: 0, iconType: "phone",
    },
    {
      id: "e3", title: "Team Standup", type: "team-standup",
      subtitle: "", date: mon,
      startHour: 14, startMin: 0, endHour: 14, endMin: 30, iconType: "refresh",
    },
    {
      id: "e4", title: "Follow up", type: "follow-up",
      subtitle: "Cameron Wil.", date: mon,
      startHour: 16, startMin: 0, endHour: 16, endMin: 30, iconType: "bell",
    },
    {
      id: "e5", title: "Screening Call", type: "screening",
      subtitle: "Esther Howard", date: tue,
      startHour: 8, startMin: 30, endHour: 9, endMin: 15, iconType: "phone",
      candidate: { name: "Esther Howard", role: "UX Researcher", company: "Google", initials: "EH", color: "#ED8E55" },
    },
    {
      id: "e6", title: "Interview", type: "interview",
      subtitle: "Ralph Edwards", date: tue,
      startHour: 10, startMin: 30, endHour: 11, endMin: 15, iconType: "video",
      candidate: { name: "Ralph Edwards", role: "Frontend Developer", company: "Atlassian", initials: "RE", color: "#6B6358" },
      meetLink: "meet.google.com/abc-defg-hij",
      attendees: [
        { initials: "SN", color: "#EA6814" },
        { initials: "EH", color: "#ED8E55" },
        { initials: "RE", color: "#6B6358" },
        { initials: "CM", color: "#EA6814" },
      ],
      notes: "Assess technical skills and culture fit...",
    },
    {
      id: "e7", title: "Hiring Manager Call", type: "hiring-manager-call",
      subtitle: "Product Manager", date: tue,
      startHour: 13, startMin: 0, endHour: 14, endMin: 0, iconType: "video",
    },
    {
      id: "e8", title: "Client Meeting", type: "client-meeting",
      subtitle: "Linear Inc.", date: tue,
      startHour: 15, startMin: 30, endHour: 16, endMin: 15, iconType: "phone",
    },
    {
      id: "e9", title: "Interview", type: "interview",
      subtitle: "Dianne Russell", date: wed,
      startHour: 9, startMin: 0, endHour: 10, endMin: 0, iconType: "video",
      candidate: { name: "Dianne Russell", role: "Marketing Specialist", company: "Notion", initials: "DR", color: "#EA6814" },
    },
    {
      id: "e10", title: "Feedback Call", type: "feedback-call",
      subtitle: "Design Team", date: wed,
      startHour: 12, startMin: 0, endHour: 13, endMin: 0, iconType: "phone",
    },
    {
      id: "e11", title: "Interview", type: "interview",
      subtitle: "Floyd Miles", date: wed,
      startHour: 15, startMin: 0, endHour: 16, endMin: 0, iconType: "video",
      candidate: { name: "Floyd Miles", role: "Product Manager", company: "Linear", initials: "FM", color: "#ED8E55" },
    },
    {
      id: "e12", title: "Client Call", type: "client-call",
      subtitle: "Google", date: thu,
      startHour: 10, startMin: 0, endHour: 10, endMin: 45, iconType: "phone",
    },
    {
      id: "e13", title: "Interview", type: "interview",
      subtitle: "Albert Flores", date: fri,
      startHour: 9, startMin: 30, endHour: 10, endMin: 30, iconType: "video",
      candidate: { name: "Albert Flores", role: "DevOps Engineer", company: "AWS", initials: "AF", color: "#ED8E55" },
    },
    {
      id: "e14", title: "Offer Discussion", type: "offer-discussion",
      subtitle: "Dev Role", date: fri,
      startHour: 13, startMin: 30, endHour: 14, endMin: 0, iconType: "phone",
    },
    {
      id: "e15", title: "Screening Call", type: "screening",
      subtitle: "Jane Cooper", date: fri,
      startHour: 14, startMin: 0, endHour: 15, endMin: 0, iconType: "phone",
      candidate: { name: "Jane Cooper", role: "UI Designer", company: "Figma", initials: "JC", color: "#EA6814" },
    },
    {
      id: "e16", title: "Team Retro", type: "team-retro",
      subtitle: "", date: sun,
      startHour: 17, startMin: 0, endHour: 18, endMin: 0, iconType: "refresh",
    },
  ];
}

// ─── Icon Component ───────────────────────────────────────────────────────────

function EvIcon({ type, size = 12 }: { type: EventIconType; size?: number }) {
  if (type === "video")   return <VideoIcon size={size} />;
  if (type === "phone")   return <PhoneIcon size={size} />;
  if (type === "refresh") return <RefreshIcon size={size} />;
  return <BellIcon size={size} />;
}

// ─── Event Card ───────────────────────────────────────────────────────────────

// ─── Hour Slot (click anywhere to add event) ──────────────────────────────────

function HourSlot({ hour, onClick }: { hour: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add event at ${fmt12(hour, 0)}`}
      className="group/slot absolute inset-x-0 z-0 flex items-center justify-center transition-colors hover:bg-[color:var(--color-brand-500)]/[0.06]"
      style={{
        top: `${(hour - START_H) * HOUR_H}px`,
        height: `${HOUR_H}px`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none flex h-7 w-7 scale-90 items-center justify-center rounded-full bg-[color:var(--color-brand-500)] text-white opacity-0 shadow-[0_4px_12px_rgba(234,104,20,0.4)] transition-all group-hover/slot:scale-100 group-hover/slot:opacity-100"
      >
        <PlusIcon size={14} />
      </span>
    </button>
  );
}

function EventCard({
  event,
  isSelected,
  onClick,
}: {
  event: CalendarEvent;
  isSelected: boolean;
  onClick: () => void;
}) {
  const s = EVENT_STYLES[event.type];
  const h = eventHeight(event);
  const top = eventTop(event);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute left-[3px] right-[3px] overflow-hidden rounded-[8px] text-left transition-all hover:brightness-95 ${
        isSelected ? "ring-2 ring-offset-1 ring-[color:var(--color-brand-400)]" : ""
      }`}
      style={{ top: `${top}px`, height: `${h}px`, backgroundColor: s.bg, color: s.text, zIndex: isSelected ? 5 : 2 }}
    >
      {/* Left accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-[8px]"
        style={{ backgroundColor: s.dot }}
      />
      <div className="flex h-full flex-col gap-[2px] py-[5px] pl-[8px] pr-2">
        {h < 36 ? (
          <div className="flex min-w-0 items-center gap-1">
            {event.iconType && (
              <span className="shrink-0 opacity-60">
                <EvIcon type={event.iconType} size={10} />
              </span>
            )}
            <span className="truncate text-[10px] font-semibold">{event.title}</span>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-1">
              <span className="text-[10px] font-medium opacity-70">
                {fmt12(event.startHour, event.startMin)}
              </span>
              {event.iconType && (
                <span className="mt-[1px] shrink-0 opacity-75">
                  <EvIcon type={event.iconType} size={11} />
                </span>
              )}
            </div>
            <span className="truncate text-[11px] font-semibold leading-tight">
              {event.title}
            </span>
            {h >= 52 && event.subtitle && (
              <span className="truncate text-[10px] leading-tight opacity-75">
                {event.subtitle}
              </span>
            )}
            {h >= 80 && event.candidate && (
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[7px] font-bold text-white"
                  style={{ backgroundColor: event.candidate.color }}
                >
                  {event.candidate.initials}
                </div>
                <span className="truncate text-[10px] opacity-70">
                  {event.candidate.name}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </button>
  );
}

// ─── Time Grid (shared between Week and Day views) ────────────────────────────

function TimeGutter({ now, showNowLabel }: { now: Date; showNowLabel: boolean }) {
  const nowTop = (now.getHours() + now.getMinutes() / 60 - START_H) * HOUR_H;

  return (
    <div className="relative w-[56px] shrink-0 select-none">
      {HOURS.map((h) => (
        <div
          key={h}
          className="absolute right-2 flex items-center text-[10px] leading-none text-[color:var(--color-text-muted)]"
          style={{ top: `${(h - START_H) * HOUR_H - 8}px` }}
        >
          {fmtHour(h)}
        </div>
      ))}
      {showNowLabel && nowTop >= 0 && nowTop <= (END_H - START_H) * HOUR_H && (
        <div
          className="absolute right-1 text-[10px] font-semibold leading-none text-[color:var(--color-brand-500)]"
          style={{ top: `${nowTop - 8}px` }}
        >
          {fmt12(now.getHours(), now.getMinutes())}
        </div>
      )}
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({
  weekDays,
  today,
  now,
  events,
  selectedEvent,
  onEventClick,
  onSlotClick,
}: {
  weekDays: Date[];
  today: Date;
  now: Date;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventClick: (e: CalendarEvent) => void;
  onSlotClick: (day: Date, hour: number) => void;
}) {
  const todayYMD = toYMD(today);
  const nowTop = (now.getHours() + now.getMinutes() / 60 - START_H) * HOUR_H;

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day header row */}
      <div className="flex shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex w-[56px] shrink-0 items-end justify-center pb-2 text-[10px] text-[color:var(--color-text-muted)]">
          GMT
        </div>
        {weekDays.map((day, i) => {
          const isToday = sameDay(day, today);
          return (
            <div key={i} className="min-w-0 flex-1 py-2 text-center">
              <div className="text-[11px] font-medium text-[color:var(--color-text-muted)]">
                {DAY_SHORT[i]}
              </div>
              <div
                className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
                  isToday
                    ? "bg-[color:var(--color-brand-500)] text-white"
                    : "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="flex"
          style={{ height: `${(END_H - START_H) * HOUR_H}px` }}
        >
          <TimeGutter now={now} showNowLabel />

          {weekDays.map((day, i) => {
            const ymd = toYMD(day);
            const dayEvents = eventsByDay[ymd] ?? [];
            const isToday = ymd === todayYMD;

            return (
              <div
                key={i}
                className="relative min-w-0 flex-1 border-l border-[color:var(--color-border)]"
                style={isToday ? { background: "rgba(234,104,20,0.07)" } : undefined}
              >
                {/* Hour grid lines */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 border-t border-[color:var(--color-border)]"
                    style={{ top: `${(h - START_H) * HOUR_H}px` }}
                  />
                ))}

                {/* Half-hour lines */}
                {HOURS.map((h) => (
                  <div
                    key={`${h}h`}
                    className="absolute inset-x-0 border-t border-dashed border-[color:var(--color-border)]"
                    style={{ top: `${(h - START_H) * HOUR_H + HOUR_H / 2}px`, opacity: 0.5 }}
                  />
                ))}

                {/* Hour slot click + hover overlays */}
                {HOURS.map((h) => (
                  <HourSlot
                    key={`slot-${h}`}
                    hour={h}
                    onClick={() => onSlotClick(day, h)}
                  />
                ))}

                {/* Current time indicator */}
                {isToday && nowTop >= 0 && nowTop <= (END_H - START_H) * HOUR_H && (
                  <>
                    <div
                      className="absolute z-10 h-2.5 w-2.5 rounded-full bg-[color:var(--color-brand-500)]"
                      style={{ top: `${nowTop - 5}px`, left: "-5px" }}
                    />
                    <div
                      className="absolute inset-x-0 z-10 h-px bg-[color:var(--color-brand-500)]"
                      style={{ top: `${nowTop}px` }}
                    />
                  </>
                )}

                {/* Events */}
                {dayEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    isSelected={selectedEvent?.id === e.id}
                    onClick={() => onEventClick(e)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({
  selectedDay,
  today,
  now,
  events,
  selectedEvent,
  onEventClick,
  onSlotClick,
}: {
  selectedDay: Date;
  today: Date;
  now: Date;
  events: CalendarEvent[];
  selectedEvent: CalendarEvent | null;
  onEventClick: (e: CalendarEvent) => void;
  onSlotClick: (day: Date, hour: number) => void;
}) {
  const ymd = toYMD(selectedDay);
  const dayEvents = events.filter((e) => e.date === ymd);
  const isToday = sameDay(selectedDay, today);
  const nowTop = (now.getHours() + now.getMinutes() / 60 - START_H) * HOUR_H;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex w-[56px] shrink-0 items-end justify-center pb-2 text-[10px] text-[color:var(--color-text-muted)]">
          GMT
        </div>
        <div className="flex-1 py-2 text-center">
          <div className="text-[11px] font-medium text-[color:var(--color-text-muted)]">
            {DAY_FULL[selectedDay.getDay()]}
          </div>
          <div
            className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold ${
              isToday ? "bg-[color:var(--color-brand-500)] text-white" : "text-[color:var(--color-text)]"
            }`}
          >
            {selectedDay.getDate()}
          </div>
        </div>
      </div>

      {/* Scrollable time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex" style={{ height: `${(END_H - START_H) * HOUR_H}px` }}>
          <TimeGutter now={now} showNowLabel={isToday} />

          <div
            className="relative flex-1 border-l border-[color:var(--color-border)]"
            style={isToday ? { background: "rgba(234,104,20,0.07)" } : undefined}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute inset-x-0 border-t border-[color:var(--color-border)]"
                style={{ top: `${(h - START_H) * HOUR_H}px` }}
              />
            ))}
            {HOURS.map((h) => (
              <div
                key={`${h}h`}
                className="absolute inset-x-0 border-t border-dashed border-[color:var(--color-border)]"
                style={{ top: `${(h - START_H) * HOUR_H + HOUR_H / 2}px`, opacity: 0.5 }}
              />
            ))}
            {HOURS.map((h) => (
              <HourSlot
                key={`slot-${h}`}
                hour={h}
                onClick={() => onSlotClick(selectedDay, h)}
              />
            ))}
            {isToday && nowTop >= 0 && nowTop <= (END_H - START_H) * HOUR_H && (
              <>
                <div
                  className="absolute z-10 h-2.5 w-2.5 rounded-full bg-[color:var(--color-brand-500)]"
                  style={{ top: `${nowTop - 5}px`, left: "-5px" }}
                />
                <div
                  className="absolute inset-x-0 z-10 h-px bg-[color:var(--color-brand-500)]"
                  style={{ top: `${nowTop}px` }}
                />
              </>
            )}
            {dayEvents.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                isSelected={selectedEvent?.id === e.id}
                onClick={() => onEventClick(e)}
              />
            ))}
            {dayEvents.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <CalendarIcon size={32} className="mx-auto mb-3 text-[color:var(--color-text-muted)]" />
                  <p className="text-[14px] font-semibold text-[color:var(--color-text-secondary)]">
                    No events scheduled
                  </p>
                  <p className="text-[12px] text-[color:var(--color-text-muted)]">
                    Click an hour to add an event
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Agenda View ──────────────────────────────────────────────────────────────

function AgendaView({
  weekDays,
  events,
  today,
  selectedEvent,
  onEventClick,
}: {
  weekDays: Date[];
  events: CalendarEvent[];
  today: Date;
  selectedEvent: CalendarEvent | null;
  onEventClick: (e: CalendarEvent) => void;
}) {
  const grouped = useMemo(
    () =>
      weekDays.map((day) => ({
        day,
        events: events
          .filter((e) => e.date === toYMD(day))
          .sort((a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin)),
      })),
    [weekDays, events]
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {grouped.map(({ day, events: dayEvents }) => {
        const isToday = sameDay(day, today);
        const ymd = toYMD(day);
        return (
          <div key={ymd}>
            {/* Date group header */}
            <div
              className={`sticky top-0 z-10 flex items-center gap-3 border-b border-[color:var(--color-border)] px-6 py-2.5 ${
                isToday ? "bg-[color:var(--color-brand-50)]" : "bg-[color:var(--color-surface-2)]"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                  isToday
                    ? "bg-[color:var(--color-brand-500)] text-white"
                    : "bg-[color:var(--color-surface)] text-[color:var(--color-text)]"
                }`}
              >
                {day.getDate()}
              </div>
              <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
                {DAY_FULL[day.getDay()]}
              </span>
              <span className="text-[12px] text-[color:var(--color-text-muted)]">
                {MONTH_SHORT[day.getMonth()]} {day.getDate()}, {day.getFullYear()}
              </span>
              {dayEvents.length > 0 && (
                <span className="ml-auto rounded-[999px] bg-[color:var(--color-brand-100)] px-2 py-[1px] text-[10px] font-semibold text-[color:var(--color-brand-600)]">
                  {dayEvents.length} event{dayEvents.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {dayEvents.length === 0 ? (
              <div className="px-6 py-4 text-[12px] text-[color:var(--color-text-muted)]">
                No events scheduled
              </div>
            ) : (
              <div className="space-y-2 px-6 py-3">
                {dayEvents.map((e) => {
                  const s = EVENT_STYLES[e.type];
                  const isSelected = selectedEvent?.id === e.id;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onEventClick(e)}
                      className={`group w-full rounded-[12px] border p-3 text-left transition-all hover:shadow-sm ${
                        isSelected
                          ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)]"
                          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-border-strong)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1 h-10 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: s.dot }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 text-[11px] text-[color:var(--color-text-muted)]">
                            {fmt12(e.startHour, e.startMin)} – {fmt12(e.endHour, e.endMin)}
                          </div>
                          <div className="truncate text-[13px] font-semibold text-[color:var(--color-text)]">
                            {e.title}
                          </div>
                          {(e.candidate || e.subtitle) && (
                            <div className="mt-0.5 truncate text-[11px] text-[color:var(--color-text-secondary)]">
                              {e.candidate?.name ?? e.subtitle}
                              {e.candidate?.role ? ` · ${e.candidate.role}` : ""}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {e.iconType && (
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-[8px]"
                              style={{ backgroundColor: s.bg, color: s.text }}
                            >
                              <EvIcon type={e.iconType} size={13} />
                            </div>
                          )}
                          <span
                            className="rounded-[999px] px-2 py-[2px] text-[10px] font-semibold"
                            style={{ backgroundColor: s.bg, color: s.text }}
                          >
                            {e.type.replace(/-/g, " ")}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  month,
  today,
  selectedDay,
  eventDates,
  onMonthChange,
  onDayClick,
}: {
  month: Date;
  today: Date;
  selectedDay: Date;
  eventDates: Set<string>;
  onMonthChange: (d: Date) => void;
  onDayClick: (d: Date) => void;
}) {
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last  = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const out: (Date | null)[] = [];
    for (let i = 0; i < first.getDay(); i++) out.push(null);
    for (let d = 1; d <= last.getDate(); d++)
      out.push(new Date(month.getFullYear(), month.getMonth(), d));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [month]);

  return (
    <>
      {/* Month navigation */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[color:var(--color-text)]">
          {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="flex h-6 w-6 items-center justify-center rounded text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="mb-1 grid grid-cols-7">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-0.5 text-center text-[10px] font-medium text-[color:var(--color-text-muted)]">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const isToday = sameDay(day, today);
          const isSel   = sameDay(day, selectedDay);
          const hasEv   = eventDates.has(toYMD(day));
          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick(day)}
              className={`relative mx-auto flex h-7 w-7 flex-col items-center justify-center rounded-full text-[11px] font-medium transition-colors ${
                isToday
                  ? "bg-[color:var(--color-brand-500)] text-white"
                  : isSel
                  ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand-600)]"
                  : "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
              }`}
            >
              {day.getDate()}
              {hasEv && !isToday && (
                <span
                  className="absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                  style={{ backgroundColor: "#EA6814" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Upcoming Events ──────────────────────────────────────────────────────────

function UpcomingPanel({
  events,
  today,
  now,
  selectedId,
  onSelect,
}: {
  events: CalendarEvent[];
  today: Date;
  now: Date;
  selectedId: string | null;
  onSelect: (e: CalendarEvent) => void;
}) {
  const upcoming = useMemo(() => {
    const todayYMD = toYMD(today);
    const nowMins  = now.getHours() * 60 + now.getMinutes();
    return events
      .filter((e) => {
        if (e.date > todayYMD) return true;
        if (e.date === todayYMD) return e.startHour * 60 + e.startMin >= nowMins;
        return false;
      })
      .sort((a, b) =>
        a.date !== b.date
          ? a.date.localeCompare(b.date)
          : a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin)
      )
      .slice(0, 5);
  }, [events, today, now]);

  return (
    <div className="shrink-0 border-t border-[color:var(--color-border)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[color:var(--color-text)]">
          Upcoming ({upcoming.length})
        </span>
        <button
          type="button"
          className="text-[12px] font-medium text-[color:var(--color-brand-500)] hover:text-[color:var(--color-brand-600)]"
        >
          View all
        </button>
      </div>

      <div className="space-y-1.5">
        {upcoming.map((ev) => {
          const s  = EVENT_STYLES[ev.type];
          const isSel = ev.id === selectedId;
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelect(ev)}
              className={`group flex w-full items-center gap-2.5 rounded-[10px] p-2 text-left transition-colors ${
                isSel
                  ? "bg-[color:var(--color-brand-100)]"
                  : "hover:bg-[color:var(--color-surface-2)]"
              }`}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {ev.iconType && <EvIcon type={ev.iconType} size={14} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-[color:var(--color-text-muted)]">
                  {fmt12(ev.startHour, ev.startMin)}
                </div>
                <div className="truncate text-[12px] font-semibold text-[color:var(--color-text)]">
                  {ev.title}
                </div>
                {(ev.candidate || ev.subtitle) && (
                  <div className="truncate text-[10px] text-[color:var(--color-text-secondary)]">
                    {ev.candidate?.name ?? ev.subtitle}
                    {ev.candidate?.role ? ` · ${ev.candidate.role}` : ""}
                  </div>
                )}
              </div>
            </button>
          );
        })}
        {upcoming.length === 0 && (
          <p className="py-4 text-center text-[12px] text-[color:var(--color-text-muted)]">
            No upcoming events
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Event Detail Card ────────────────────────────────────────────────────────

function EventDetailCard({
  event,
  onClose,
}: {
  event: CalendarEvent;
  onClose: () => void;
}) {
  const s = EVENT_STYLES[event.type];
  const typeLabel = event.type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="shrink-0 border-t border-[color:var(--color-border)] p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium text-[color:var(--color-text-muted)]">
              {fmt12(event.startHour, event.startMin)} – {fmt12(event.endHour, event.endMin)}
            </span>
            <span
              className="rounded-[999px] px-2 py-[1px] text-[10px] font-semibold"
              style={{ backgroundColor: s.bg, color: s.text }}
            >
              {typeLabel}
            </span>
          </div>
          <h3 className="text-[14px] font-bold leading-snug text-[color:var(--color-text)]">
            {event.candidate
              ? `Interview with ${event.candidate.name}`
              : event.title}
          </h3>
          {event.candidate && (
            <p className="mt-0.5 text-[11px] text-[color:var(--color-text-secondary)]">
              {event.candidate.role} at {event.candidate.company}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
          >
            <MoreIcon size={14} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
          >
            <XIcon size={14} />
          </button>
        </div>
      </div>

      <div className="mb-3 space-y-2">
        {event.meetLink && (
          <div className="flex items-center gap-2">
            <LinkChainIcon size={13} className="shrink-0 text-[color:var(--color-text-muted)]" />
            <a
              href={`https://${event.meetLink}`}
              className="truncate text-[11px] text-[color:var(--color-brand-500)] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {event.meetLink}
            </a>
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-2">
            <UsersIcon size={13} className="shrink-0 text-[color:var(--color-text-muted)]" />
            <div className="flex -space-x-1.5">
              {event.attendees.slice(0, 4).map((a, i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.initials}
                </div>
              ))}
              {event.attendees.length > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[color:var(--color-surface-2)] text-[8px] font-semibold text-[color:var(--color-text-secondary)]">
                  +{event.attendees.length - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] text-[color:var(--color-text-secondary)]">
              +{event.attendees.length - 1} attendees
            </span>
          </div>
        )}

        {event.notes && (
          <div className="flex items-start gap-2">
            <div className="mt-0.5 h-3 w-3 shrink-0 rounded-[3px] border border-[color:var(--color-text-muted)]" />
            <span className="text-[11px] leading-relaxed text-[color:var(--color-text-secondary)]">
              {event.notes}
            </span>
          </div>
        )}
      </div>

      {event.candidate && (
        <button
          type="button"
          className="h-9 w-full rounded-[10px] bg-[color:var(--color-brand-500)] text-[12px] font-semibold text-white transition-colors hover:bg-[color:var(--color-brand-600)]"
        >
          View Candidate
        </button>
      )}
    </div>
  );
}

// ─── New Event Modal ──────────────────────────────────────────────────────────

function NewEventModal({
  open,
  defaultDate,
  defaultStart,
  defaultEnd,
  onClose,
  onCreate,
}: {
  open: boolean;
  defaultDate: Date;
  defaultStart?: string;
  defaultEnd?: string;
  onClose: () => void;
  onCreate: (e: CalendarEvent) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("interview");
  const [date, setDate] = useState<string>(toYMD(defaultDate));
  const [start, setStart] = useState<string>(defaultStart ?? "10:00");
  const [end, setEnd] = useState<string>(defaultEnd ?? "11:00");
  const [subtitle, setSubtitle] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setType("interview");
      setDate(toYMD(defaultDate));
      setStart(defaultStart ?? "10:00");
      setEnd(defaultEnd ?? "11:00");
      setSubtitle("");
      setCandidateName("");
      setNotes("");
      setError(null);
      requestAnimationFrame(() => firstInputRef.current?.focus());
    }
  }, [open, defaultDate, defaultStart, defaultEnd]);

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

  function parseTime(t: string): { h: number; m: number } | null {
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
    return { h, m: mm };
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError("Please add a title.");
      return;
    }
    const s = parseTime(start);
    const en = parseTime(end);
    if (!s || !en) {
      setError("Invalid time format. Use HH:MM.");
      return;
    }
    const startMins = s.h * 60 + s.m;
    const endMins = en.h * 60 + en.m;
    if (endMins <= startMins) {
      setError("End time must be after start time.");
      return;
    }
    const color = EVENT_STYLES[type].dot;
    const initials = candidateName.trim()
      ? candidateName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("")
      : "";
    const iconType: EventIconType =
      type === "interview" || type === "hiring-manager-call"
        ? "video"
        : type.includes("call")
          ? "phone"
          : type.startsWith("team")
            ? "refresh"
            : "bell";
    const newEvent: CalendarEvent = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      type,
      subtitle: subtitle.trim() || candidateName.trim() || undefined,
      date,
      startHour: s.h,
      startMin: s.m,
      endHour: en.h,
      endMin: en.m,
      iconType,
      candidate: candidateName.trim()
        ? {
            name: candidateName.trim(),
            role: subtitle.trim() || "Candidate",
            company: "",
            initials,
            color,
          }
        : undefined,
      notes: notes.trim() || undefined,
    };
    onCreate(newEvent);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-event-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div className="relative z-10 flex w-full max-w-[520px] max-h-[90vh] flex-col overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_24px_60px_rgba(15,16,20,0.22)]">
        <header className="flex items-start justify-between gap-3 border-b border-[color:var(--color-border)] px-5 py-4">
          <div>
            <h2
              id="new-event-title"
              className="text-[16px] font-bold text-[color:var(--color-text)]"
            >
              New event
            </h2>
            <p className="mt-0.5 text-[12px] text-[color:var(--color-text-secondary)]">
              Add an interview, call, or reminder to the calendar.
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

        <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Title
            </span>
            <input
              ref={firstInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interview — Senior React Engineer"
              className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Type
            </span>
            <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {EVENT_TYPE_ORDER.map((t) => {
                const sty = EVENT_STYLES[t];
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 rounded-[10px] border px-2.5 py-2 text-left text-[12px] font-medium transition-colors ${
                      active
                        ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                        : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: sty.dot }}
                    />
                    <span className="truncate">{EVENT_TYPE_LABELS[t]}</span>
                  </button>
                );
              })}
            </div>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block sm:col-span-3">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Start
              </span>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                End
              </span>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
                Duration
              </span>
              <div className="mt-1 flex h-10 items-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 text-[13px] text-[color:var(--color-text-secondary)]">
                {(() => {
                  const s = parseTime(start);
                  const en = parseTime(end);
                  if (!s || !en) return "—";
                  const mins = en.h * 60 + en.m - (s.h * 60 + s.m);
                  if (mins <= 0) return "—";
                  const h = Math.floor(mins / 60);
                  const m = mins % 60;
                  return `${h ? `${h}h` : ""}${h && m ? " " : ""}${m ? `${m}m` : ""}`;
                })()}
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Candidate / Attendee (optional)
            </span>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Savannah Nguyen"
              className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Subtitle (optional)
            </span>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Role, company, or short context"
              className="mt-1 h-10 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-semibold text-[color:var(--color-text-secondary)]">
              Notes (optional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Agenda, links, prep notes…"
              className="mt-1 w-full rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 text-[13px] text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-brand-500)] focus:shadow-[var(--shadow-ring-brand)]"
            />
          </label>

          {error ? (
            <p className="text-[12px] font-semibold text-[color:var(--color-error)]">
              {error}
            </p>
          ) : null}
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/40 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-[10px] px-3 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[color:var(--color-brand-500)] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(234,104,20,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <PlusIcon size={14} />
            Create event
          </button>
        </footer>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function CalendarPageClient() {
  const [view, setView]         = useState<"week" | "day" | "agenda">("week");
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [miniCalMonth, setMiniCalMonth] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [now, setNow] = useState<Date>(() => new Date());
  const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
  const [filterTypes, setFilterTypes] = useState<Set<EventType>>(
    () => new Set(EVENT_TYPE_ORDER),
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [datePickerMonth, setDatePickerMonth] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [slotDefaults, setSlotDefaults] = useState<{
    date: Date;
    start: string;
    end: string;
  } | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
  }
  function openSlotModal(day: Date, hour: number) {
    setSlotDefaults({
      date: day,
      start: `${pad(hour)}:00`,
      end: `${pad(Math.min(hour + 1, 23))}:00`,
    });
    setNewEventOpen(true);
  }

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!filterOpen) return;
    function onPointer(e: PointerEvent) {
      if (!filterRef.current?.contains(e.target as Node)) setFilterOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFilterOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!datePickerOpen) return;
    function onPointer(e: PointerEvent) {
      if (!datePickerRef.current?.contains(e.target as Node))
        setDatePickerOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDatePickerOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [datePickerOpen]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const mergeAndFilter = (base: CalendarEvent[], ws: Date): CalendarEvent[] => {
    const wsYmd = toYMD(ws);
    const weYmd = toYMD(addDays(ws, 6));
    const userInWeek = userEvents.filter(
      (e) => e.date >= wsYmd && e.date <= weYmd,
    );
    return [...base, ...userInWeek].filter((e) => filterTypes.has(e.type));
  };

  const events = useMemo(
    () => mergeAndFilter(genEvents(weekStart), weekStart),
    [weekStart, userEvents, filterTypes],
  );

  // For day view, generate events for the week containing the selected day
  const dayViewEvents = useMemo(() => {
    const ws = getMonday(selectedDay);
    return mergeAndFilter(genEvents(ws), ws);
  }, [selectedDay, userEvents, filterTypes]);

  const eventDates = useMemo(() => new Set(events.map((e) => e.date)), [events]);

  const activeFilterCount = filterTypes.size;
  const totalTypes = EVENT_TYPE_ORDER.length;
  const isFilterActive = activeFilterCount !== totalTypes;

  const toggleFilterType = (t: EventType) => {
    setFilterTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };
  const selectAllFilters = () => setFilterTypes(new Set(EVENT_TYPE_ORDER));
  const clearAllFilters = () => setFilterTypes(new Set());

  const addUserEvent = (e: CalendarEvent) => {
    setUserEvents((prev) => [...prev, e]);
    const newDay = new Date(e.date + "T00:00:00");
    setSelectedDay(newDay);
    setWeekStart(getMonday(newDay));
  };

  // Navigation
  const goPrev = () => {
    if (view === "day") {
      const prev = addDays(selectedDay, -1);
      setSelectedDay(prev);
      setWeekStart(getMonday(prev));
    } else {
      setWeekStart((d) => addDays(d, -7));
    }
  };

  const goNext = () => {
    if (view === "day") {
      const next = addDays(selectedDay, 1);
      setSelectedDay(next);
      setWeekStart(getMonday(next));
    } else {
      setWeekStart((d) => addDays(d, 7));
    }
  };

  const goToday = () => {
    const t = new Date();
    setSelectedDay(t);
    setWeekStart(getMonday(t));
    setMiniCalMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  };

  const onMiniCalDayClick = (day: Date) => {
    setSelectedDay(day);
    setWeekStart(getMonday(day));
    if (view === "week") {
      // stay in week view but jump to that week
    } else {
      setView("day");
    }
  };

  const toggleEvent = (e: CalendarEvent) => {
    setSelectedEvent((prev) => (prev?.id === e.id ? null : e));
  };

  // Header date range label
  const dateLabel = useMemo(() => {
    if (view === "day") {
      return `${DAY_FULL[selectedDay.getDay()]}, ${MONTH_SHORT[selectedDay.getMonth()]} ${selectedDay.getDate()}, ${selectedDay.getFullYear()}`;
    }
    const end = addDays(weekStart, 6);
    const startStr = `${MONTH_SHORT[weekStart.getMonth()]} ${weekStart.getDate()}`;
    const endStr =
      weekStart.getMonth() === end.getMonth()
        ? `${end.getDate()}, ${end.getFullYear()}`
        : `${MONTH_SHORT[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
    return `${startStr} – ${endStr}`;
  }, [view, weekStart, selectedDay]);

  // Right-panel header date
  const rightPanelDate = useMemo(() => {
    const d = view === "day" ? selectedDay : today;
    return `${DAY_FULL[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }, [view, selectedDay, today]);

  return (
    <div
      className="flex flex-col overflow-hidden bg-[color:var(--color-bg-base)]"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)]">
              Calendar
            </h1>
            <CalendarIcon size={20} className="text-[color:var(--color-brand-500)]" />
          </div>
          <p className="mt-0.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Manage your interviews, meetings and reminders.
          </p>
        </div>
      </div>

      {/* ── Nav Bar ──────────────────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={goToday}
          className="h-9 rounded-[10px] border border-[color:var(--color-border)] px-3 text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-surface-2)] sm:px-4"
        >
          Today
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)]"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-2)]"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={() => {
              const d = view === "day" ? selectedDay : weekStart;
              setDatePickerMonth(new Date(d.getFullYear(), d.getMonth(), 1));
              setDatePickerOpen((o) => !o);
            }}
            aria-haspopup="dialog"
            aria-expanded={datePickerOpen}
            className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[13px] font-semibold transition-colors sm:text-[14px] ${
              datePickerOpen
                ? "bg-[color:var(--color-surface-2)] text-[color:var(--color-text)]"
                : "text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            {dateLabel}
            <ChevronDown
              size={13}
              className={`text-[color:var(--color-text-muted)] transition-transform ${datePickerOpen ? "rotate-180" : ""}`}
            />
          </button>

          {datePickerOpen ? (
            <div className="absolute left-0 top-full z-30 mt-1.5 w-[280px] rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-panel)]">
              <MiniCalendar
                month={datePickerMonth}
                today={today}
                selectedDay={view === "day" ? selectedDay : weekStart}
                eventDates={eventDates}
                onMonthChange={setDatePickerMonth}
                onDayClick={(d) => {
                  setSelectedDay(d);
                  setWeekStart(getMonday(d));
                  setMiniCalMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                  setDatePickerOpen(false);
                }}
              />
              <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    goToday();
                    setDatePickerOpen(false);
                  }}
                  className="text-[12px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:text-[color:var(--color-brand-700)]"
                >
                  Jump to today
                </button>
                <button
                  type="button"
                  onClick={() => setDatePickerOpen(false)}
                  className="text-[12px] font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-secondary)]"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-[10px] border border-[color:var(--color-border)]">
            {(["Week", "Day", "Agenda"] as const).map((v) => {
              const key = v.toLowerCase() as "week" | "day" | "agenda";
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(key)}
                  className={`h-9 px-3 text-[13px] font-semibold transition-colors sm:px-4 ${
                    view === key
                      ? "bg-[color:var(--color-brand-500)] text-white"
                      : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)]"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
              className={`flex h-9 items-center gap-1.5 rounded-[10px] border px-3 text-[13px] font-semibold transition-colors ${
                filterOpen || isFilterActive
                  ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
              }`}
            >
              <FilterIcon size={14} />
              <span className="hidden sm:inline">Filter</span>
              {isFilterActive ? (
                <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[color:var(--color-brand-500)] px-1 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
              <ChevronDown
                size={13}
                className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {filterOpen ? (
              <div className="absolute right-0 top-full z-30 mt-1.5 w-[260px] overflow-hidden rounded-[14px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-panel)]">
                <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-3 py-2.5">
                  <p className="text-[13px] font-semibold text-[color:var(--color-text)]">
                    Event types
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={selectAllFilters}
                      className="rounded-[6px] px-1.5 py-0.5 text-[11px] font-semibold text-[color:var(--color-brand-600)] transition-colors hover:bg-[color:var(--color-brand-50)]"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="rounded-[6px] px-1.5 py-0.5 text-[11px] font-semibold text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-surface-2)]"
                    >
                      None
                    </button>
                  </div>
                </div>
                <ul className="max-h-[320px] overflow-y-auto py-1">
                  {EVENT_TYPE_ORDER.map((t) => {
                    const sty = EVENT_STYLES[t];
                    const on = filterTypes.has(t);
                    return (
                      <li key={t}>
                        <button
                          type="button"
                          onClick={() => toggleFilterType(t)}
                          aria-pressed={on}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color:var(--color-surface-2)]"
                        >
                          <span
                            aria-hidden
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: sty.dot }}
                          />
                          <span
                            className={`flex-1 truncate ${
                              on
                                ? "font-semibold text-[color:var(--color-text)]"
                                : "text-[color:var(--color-text-secondary)]"
                            }`}
                          >
                            {EVENT_TYPE_LABELS[t]}
                          </span>
                          <span
                            aria-hidden
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              on
                                ? "border-[color:var(--color-brand-500)] bg-[color:var(--color-brand-500)] text-white"
                                : "border-[color:var(--color-border-strong)]"
                            }`}
                          >
                            {on ? <CheckIcon size={12} /> : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              if (events.length === 0) return;
              exportToExcel({
                filename: "calendar-events",
                sheetName: "Events",
                columns: [
                  { header: "Title", key: "title", width: 30 },
                  { header: "Type", key: (e: CalendarEvent) => EVENT_TYPE_LABELS[e.type], width: 22 },
                  { header: "Date", key: "date", width: 14 },
                  {
                    header: "Start",
                    key: (e: CalendarEvent) => fmt12(e.startHour, e.startMin),
                    width: 12,
                  },
                  {
                    header: "End",
                    key: (e: CalendarEvent) => fmt12(e.endHour, e.endMin),
                    width: 12,
                  },
                  {
                    header: "Duration (min)",
                    key: (e: CalendarEvent) =>
                      e.endHour * 60 + e.endMin - (e.startHour * 60 + e.startMin),
                    type: "number",
                    width: 14,
                  },
                  { header: "Subtitle", key: (e: CalendarEvent) => e.subtitle ?? "", width: 24 },
                  { header: "Candidate", key: (e: CalendarEvent) => e.candidate?.name ?? "", width: 22 },
                  { header: "Candidate Role", key: (e: CalendarEvent) => e.candidate?.role ?? "", width: 22 },
                  { header: "Company", key: (e: CalendarEvent) => e.candidate?.company ?? "", width: 18 },
                  { header: "Meeting Link", key: (e: CalendarEvent) => e.meetLink ?? "", width: 32 },
                  { header: "Notes", key: (e: CalendarEvent) => e.notes ?? "", width: 40 },
                  { header: "ID", key: "id", width: 10 },
                ],
                rows: events,
              });
            }}
            disabled={events.length === 0}
            title={`Export ${events.length} event${events.length === 1 ? "" : "s"} in this week to Excel`}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[13px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon size={14} />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setNewEventOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-[color:var(--color-brand-500)] px-3 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(234,104,20,0.25)] transition-colors hover:bg-[color:var(--color-brand-600)]"
          >
            <PlusIcon size={15} />
            <span className="hidden sm:inline">New event</span>
          </button>

          <button
            type="button"
            onClick={() => setMobilePanelOpen(true)}
            aria-label="Open calendar details panel"
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] lg:hidden"
          >
            <MenuListIcon size={16} />
          </button>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Calendar grid */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          {view === "week" && (
            <WeekView
              weekDays={weekDays}
              today={today}
              now={now}
              events={events}
              selectedEvent={selectedEvent}
              onEventClick={toggleEvent}
              onSlotClick={openSlotModal}
            />
          )}
          {view === "day" && (
            <DayView
              selectedDay={selectedDay}
              today={today}
              now={now}
              events={dayViewEvents}
              selectedEvent={selectedEvent}
              onEventClick={toggleEvent}
              onSlotClick={openSlotModal}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              weekDays={weekDays}
              events={events}
              today={today}
              selectedEvent={selectedEvent}
              onEventClick={toggleEvent}
            />
          )}
        </div>

        {/* ── Right Panel — docked on lg+, drawer on smaller ──────── */}
        {/* Backdrop (mobile only) */}
        <div
          aria-hidden
          onClick={() => setMobilePanelOpen(false)}
          className={`fixed inset-0 z-40 bg-[rgba(31,27,23,0.45)] transition-opacity lg:hidden ${
            mobilePanelOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        />
        <div
          className={`fixed inset-y-0 right-0 z-50 flex w-[min(320px,90vw)] shrink-0 flex-col overflow-y-auto border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[var(--shadow-panel)] transition-transform lg:static lg:z-auto lg:w-[300px] lg:translate-x-0 lg:shadow-none ${
            mobilePanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile header with close */}
          <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3 lg:hidden">
            <span className="text-[13px] font-bold text-[color:var(--color-text)]">
              Calendar details
            </span>
            <button
              type="button"
              onClick={() => setMobilePanelOpen(false)}
              aria-label="Close panel"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)] hover:text-[color:var(--color-text)]"
            >
              <XIcon size={14} />
            </button>
          </div>

          {/* Date header + mini calendar */}
          <div className="shrink-0 border-b border-[color:var(--color-border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <CalendarIcon size={13} className="shrink-0 text-[color:var(--color-brand-500)]" />
              <span className="text-[12px] font-semibold text-[color:var(--color-text)]">
                {rightPanelDate}
              </span>
              <div className="ml-auto flex gap-0.5">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex h-5 w-5 items-center justify-center rounded text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                >
                  <ChevronLeft size={11} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-5 w-5 items-center justify-center rounded text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-2)]"
                >
                  <ChevronRight size={11} />
                </button>
              </div>
            </div>
            <MiniCalendar
              month={miniCalMonth}
              today={today}
              selectedDay={view === "day" ? selectedDay : today}
              eventDates={eventDates}
              onMonthChange={setMiniCalMonth}
              onDayClick={onMiniCalDayClick}
            />
          </div>

          {/* Upcoming events */}
          <UpcomingPanel
            events={events}
            today={today}
            now={now}
            selectedId={selectedEvent?.id ?? null}
            onSelect={toggleEvent}
          />

          {/* Event detail */}
          {selectedEvent && (
            <EventDetailCard
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </div>
      </div>

      {/* ── Legend Footer ────────────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 sm:gap-x-5 sm:px-6">
        {[
          { label: "Interviews", color: "#EA6814" },
          { label: "Calls",      color: "#ED8E55" },
          { label: "Meetings",   color: "#EA6814" },
          { label: "Follow-ups", color: "#F97316" },
          { label: "Reminders",  color: "#9F430D" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[12px] text-[color:var(--color-text-secondary)]">{label}</span>
          </div>
        ))}

        <button
          type="button"
          className="ml-auto flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]"
        >
          <SyncIcon size={13} />
          Sync Calendar
        </button>
      </div>

      <NewEventModal
        open={newEventOpen}
        defaultDate={
          slotDefaults?.date ?? (view === "day" ? selectedDay : today)
        }
        defaultStart={slotDefaults?.start}
        defaultEnd={slotDefaults?.end}
        onClose={() => {
          setNewEventOpen(false);
          setSlotDefaults(null);
        }}
        onCreate={addUserEvent}
      />
    </div>
  );
}
