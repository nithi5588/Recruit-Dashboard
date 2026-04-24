import type { CSSProperties } from "react";
type IconProps = { className?: string; size?: number; style?: CSSProperties };

const base = (p: IconProps) => ({
  width: p.size ?? 18,
  height: p.size ?? 18,
  viewBox: "0 0 24 24",
  fill: "none",
  className: p.className,
  style: p.style,
  "aria-hidden": true,
});

const S = { stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function HomeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5Z" {...S} />
    </svg>
  );
}

export function UsersIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="9" r="3.2" {...S} />
      <path d="M5 20a7 7 0 0 1 14 0" {...S} />
    </svg>
  );
}

export function BriefcaseIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="7" width="18" height="13" rx="2" {...S} />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" {...S} />
    </svg>
  );
}

export function MatchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="8" cy="10" r="3" {...S} />
      <circle cx="16" cy="14" r="3" {...S} />
      <path d="M10.5 11.5 14 13" {...S} />
      <path d="M6 20a4 4 0 0 1 8 0M14 4a4 4 0 0 1 8 0" {...S} />
    </svg>
  );
}

export function ClientsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="8" cy="9" r="3" {...S} />
      <circle cx="17" cy="10" r="2.3" {...S} />
      <path d="M3 19a5 5 0 0 1 10 0M14 18a4 4 0 0 1 7 0" {...S} />
    </svg>
  );
}

export function CalendarIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="16" rx="2" {...S} />
      <path d="M3 10h18M8 3v4M16 3v4" {...S} />
    </svg>
  );
}

export function TasksIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h10" {...S} />
      <path d="M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" {...S} />
    </svg>
  );
}

export function ReportsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h16" {...S} />
      <rect x="6" y="11" width="3" height="7" rx="1" {...S} />
      <rect x="11" y="7" width="3" height="11" rx="1" {...S} />
      <rect x="16" y="14" width="3" height="4" rx="1" {...S} />
    </svg>
  );
}

export function SparklesIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4l1.6 4L18 9.6 13.6 11.2 12 15l-1.6-3.8L6 9.6 10.4 8 12 4Z" {...S} />
      <path d="M18 15l.8 1.8L20.6 18l-1.8.7L18 20l-.8-1.3L15.4 18l1.8-1.2L18 15Z" {...S} />
    </svg>
  );
}

export function SettingsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" {...S} />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" {...S} />
    </svg>
  );
}

export function MenuListIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" {...S} />
    </svg>
  );
}

export function SearchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="7" {...S} />
      <path d="m20 20-3.5-3.5" {...S} />
    </svg>
  );
}

export function PlusIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" {...S} strokeWidth="2" />
    </svg>
  );
}

export function BellIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 15V10a6 6 0 0 1 12 0v5l1.5 2H4.5L6 15Z" {...S} />
      <path d="M10 19a2 2 0 0 0 4 0" {...S} />
    </svg>
  );
}

export function ChatIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" {...S} />
    </svg>
  );
}

export function ChevronDown(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoreIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function FilterIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 5h16l-6 8v5l-4 2v-7L4 5Z" {...S} />
    </svg>
  );
}

export function PhoneIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" {...S} />
    </svg>
  );
}

export function StarIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.8L12 16.8 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z" {...S} />
    </svg>
  );
}

export function PaperPlaneIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12 20 4l-3 16-4-6-9-2Z" {...S} />
    </svg>
  );
}

export function PaperclipIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m20 12-8 8a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8" {...S} />
    </svg>
  );
}

export function ImageIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" {...S} />
      <circle cx="9" cy="10" r="1.5" {...S} />
      <path d="m4 18 5-5 4 4 3-3 4 4" {...S} />
    </svg>
  );
}

export function TemplateIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="6" rx="1.5" {...S} />
      <rect x="3" y="12" width="10" height="8" rx="1.5" {...S} />
      <rect x="15" y="12" width="6" height="8" rx="1.5" {...S} />
    </svg>
  );
}

export function RefreshIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 12a9 9 0 1 1-3.5-7.1L21 7" {...S} />
      <path d="M21 3v4h-4" {...S} />
    </svg>
  );
}

export function ExpandIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 9V5h4M19 9V5h-4M5 15v4h4M19 15v4h-4" {...S} />
    </svg>
  );
}

export function PinIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 21c4-5 7-8.5 7-12a7 7 0 1 0-14 0c0 3.5 3 7 7 12Z" {...S} />
      <circle cx="12" cy="9" r="2.3" {...S} />
    </svg>
  );
}

export function SortIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 6v12M5 9l3-3 3 3M16 18V6M13 15l3 3 3-3" {...S} />
    </svg>
  );
}

export function ListViewIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" {...S} />
      <circle cx="4" cy="6" r="0.5" fill="currentColor" />
      <circle cx="4" cy="12" r="0.5" fill="currentColor" />
      <circle cx="4" cy="18" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function GridViewIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" {...S} />
      <rect x="13" y="4" width="7" height="7" rx="1.5" {...S} />
      <rect x="4" y="13" width="7" height="7" rx="1.5" {...S} />
      <rect x="13" y="13" width="7" height="7" rx="1.5" {...S} />
    </svg>
  );
}

export function DownloadIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v12M7 11l5 5 5-5M4 20h16" {...S} />
    </svg>
  );
}

export function UploadIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 20V8M7 13l5-5 5 5M4 4h16" {...S} />
    </svg>
  );
}

export function EditIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4Z" {...S} />
      <path d="m13.5 6.5 4 4" {...S} />
    </svg>
  );
}

export function ShareIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M16 6l-4-4-4 4M12 2v14M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" {...S} />
    </svg>
  );
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" {...S} />
      <path d="M12 7v5l3 2" {...S} />
    </svg>
  );
}

export function MoneyIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 6v12M9 9h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h6" {...S} />
      <circle cx="12" cy="12" r="9" {...S} />
    </svg>
  );
}

export function ShieldIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 4 6v6a9 9 0 0 0 8 9 9 9 0 0 0 8-9V6l-8-3Z" {...S} />
      <path d="m9 12 2 2 4-4" {...S} />
    </svg>
  );
}

export function GlobeIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" {...S} />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...S} />
    </svg>
  );
}

export function BuildingsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 21V7l6-3v17M10 11h3a2 2 0 0 1 2 2v8M20 21V13a2 2 0 0 0-2-2h-3M7 9h.01M7 13h.01M7 17h.01" {...S} />
    </svg>
  );
}

export function AtIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="4" {...S} />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" {...S} />
    </svg>
  );
}

export function PhoneCircleIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" {...S} />
    </svg>
  );
}

export function BookmarkIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 4h12v17l-6-4-6 4V4Z" {...S} />
    </svg>
  );
}

export function DocumentIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" {...S} />
      <path d="M14 3v5h5" {...S} />
    </svg>
  );
}

export function SolidStar(p: IconProps) {
  return (
    <svg width={p.size ?? 14} height={p.size ?? 14} viewBox="0 0 24 24" className={p.className} aria-hidden>
      <path
        d="m12 2 2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.4 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlaneIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M21 12 3 5l2 7-2 7 18-7Z" {...S} />
    </svg>
  );
}

export function SuitcaseIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="7" width="18" height="13" rx="2" {...S} />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" {...S} />
    </svg>
  );
}

export function NodesIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="6" cy="6" r="2.2" {...S} />
      <circle cx="18" cy="6" r="2.2" {...S} />
      <circle cx="6" cy="18" r="2.2" {...S} />
      <circle cx="18" cy="18" r="2.2" {...S} />
      <path d="M8 6h8M6 8v8M18 8v8M8 18h8" {...S} />
    </svg>
  );
}

export function TargetIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" {...S} />
      <circle cx="12" cy="12" r="5" {...S} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function WrenchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path
        d="M14.5 3a5 5 0 0 1 4.5 7.3L21 12.4l-2.6 2.6-2.1-2A5 5 0 0 1 9.1 8.9L3 15l2 2 6.1-6.1"
        {...S}
      />
    </svg>
  );
}

export function StarOutlineIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path
        d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.8L12 16.8 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3Z"
        {...S}
      />
    </svg>
  );
}

export function MobileIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="7" y="3" width="10" height="18" rx="2" {...S} />
      <path d="M11 18h2" {...S} />
    </svg>
  );
}

export function CartIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 4h2l2.5 12a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6" {...S} />
      <circle cx="10" cy="20" r="1.4" {...S} />
      <circle cx="17" cy="20" r="1.4" {...S} />
    </svg>
  );
}

export function WatchIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="6" y="8" width="12" height="10" rx="2.5" {...S} />
      <path d="M9 8V5h6v3M9 18v3h6v-3M12 11v2.5l1.8 1" {...S} />
    </svg>
  );
}

export function LayersIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" {...S} />
      <path d="m3 13 9 5 9-5M3 18l9 5 9-5" {...S} />
    </svg>
  );
}

export function MonitorIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="3" y="4" width="18" height="12" rx="2" {...S} />
      <path d="M8 20h8M12 16v4" {...S} />
    </svg>
  );
}

export function BarChartMiniIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h16" {...S} />
      <rect x="6" y="11" width="3" height="7" rx="1" {...S} />
      <rect x="11" y="7" width="3" height="11" rx="1" {...S} />
      <rect x="16" y="14" width="3" height="4" rx="1" {...S} />
    </svg>
  );
}

export function CheckIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PushPinIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M9 3h6M10 3v5l-4 3v2h12v-2l-4-3V3M12 13v8" {...S} />
    </svg>
  );
}

export function NoteLinesIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" {...S} />
      <path d="M14 3v5h5M8 13h8M8 17h6" {...S} />
    </svg>
  );
}

export function ExternalLinkIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" {...S} />
    </svg>
  );
}

export function InboxIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 13l3-8h12l3 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6Z" {...S} />
      <path d="M3 13h6l1 2h4l1-2h6" {...S} />
    </svg>
  );
}

export function UserPlusIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="10" cy="9" r="3.2" {...S} />
      <path d="M4 20a6 6 0 0 1 12 0M19 8v6M16 11h6" {...S} />
    </svg>
  );
}

export function CodeBracketsIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m9 7-5 5 5 5M15 7l5 5-5 5M14 4l-4 16" {...S} />
    </svg>
  );
}

export function GraduationCapIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" {...S} />
      <path d="M6 11v5a6 6 0 0 0 12 0v-5M22 9v5" {...S} />
    </svg>
  );
}

export function DotCircleIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" {...S} />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </svg>
  );
}

export function LinkChainIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" {...S} />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" {...S} />
    </svg>
  );
}

export function TagIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" {...S} />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M19 12H5M11 6l-6 6 6 6" {...S} />
    </svg>
  );
}

export function CopyIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="8" y="8" width="12" height="12" rx="2" {...S} />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" {...S} />
    </svg>
  );
}

export function VerifiedBadgeIcon(p: IconProps) {
  return (
    <svg
      width={p.size ?? 16}
      height={p.size ?? 16}
      viewBox="0 0 24 24"
      className={p.className}
      aria-hidden
    >
      <path
        d="m12 2 2.4 1.8 3 .1.9 2.9 2.4 1.8-.8 2.9.8 2.9-2.4 1.8-.9 2.9-3 .1L12 22l-2.4-1.8-3-.1-.9-2.9L3.3 15.4l.8-2.9-.8-2.9 2.4-1.8.9-2.9 3-.1L12 2Z"
        fill="currentColor"
      />
      <path
        d="m8.5 12 2.4 2.4 4.6-5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function InfoIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="9" {...S} />
      <path d="M12 11v5M12 8v.01" {...S} />
    </svg>
  );
}

export function VideoIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="2" y="6" width="14" height="12" rx="2" {...S} />
      <path d="m16 10 5-3v10l-5-3V10Z" {...S} />
    </svg>
  );
}

export function XIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function TrophyIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M8 21h8M12 17v4M5 3H3v5a4 4 0 0 0 4 4h.5M19 3h2v5a4 4 0 0 1-4 4h-.5" {...S} />
      <path d="M7.5 12A5 5 0 0 0 12 17a5 5 0 0 0 4.5-5V3h-9v9Z" {...S} />
    </svg>
  );
}

export function TrendUpIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M3 17l5-5 4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 9h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SyncIcon(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 12a8 8 0 0 1 14.5-4.5" {...S} />
      <path d="M20 12a8 8 0 0 1-14.5 4.5" {...S} />
      <path d="M20 8V4l-3.5 3.5" {...S} />
      <path d="M4 16v4l3.5-3.5" {...S} />
    </svg>
  );
}
