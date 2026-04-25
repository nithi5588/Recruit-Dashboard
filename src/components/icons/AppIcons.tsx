"use client";

/**
 * App icon wrappers powered by iconsax-reactjs.
 *
 * Every export keeps its original name so consumers across the app don't
 * need to change. We pin the visual variant per-icon so the look stays
 * consistent (Linear ≈ outline) and bold accents stay obvious.
 */

import {
  Add,
  Airplane,
  ArrowDown2,
  ArrowLeft2,
  ArrowLeft3,
  ArrowRight2,
  Bag2,
  Bookmark,
  Briefcase,
  Buildings,
  Buildings2,
  Calendar,
  Call,
  CallCalling,
  Chart,
  Chart2,
  Clock,
  CloseCircle,
  Code,
  Copy,
  Cup,
  DocumentDownload,
  DocumentText,
  DocumentUpload,
  DollarCircle,
  Edit2,
  Element3,
  Element4,
  ExportSquare,
  Gallery,
  Global,
  HamburgerMenu,
  Hierarchy,
  Home,
  InfoCircle,
  Layer,
  Link,
  Location,
  MagicStar,
  Magicpen,
  Maximize,
  Message,
  Mobile,
  Monitor,
  More,
  Note1,
  Notification,
  Paperclip,
  Profile2User,
  Refresh,
  RowVertical,
  SearchNormal,
  Send2,
  Setting2,
  Setting4,
  Share,
  ShieldTick,
  ShoppingCart,
  Sms,
  Sort,
  Star,
  Star1,
  Tag2,
  TaskSquare,
  TickCircle,
  TrendUp,
  UserAdd,
  Verify,
  Video,
  Watch,
  type IconProps as IconsaxProps,
} from "iconsax-reactjs";
import type { CSSProperties, ComponentType, SVGAttributes } from "react";

// ─── Public API ──────────────────────────────────────────────────────────────

export type IconProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

type Variant = NonNullable<IconsaxProps["variant"]>;
type SVGOmit = Omit<SVGAttributes<SVGElement>, "color">;
type IconsaxComponent = ComponentType<IconsaxProps & SVGOmit>;

/**
 * Wrap an iconsax-reactjs icon and lock in a default variant + 18px size,
 * while passing className/style through so existing Tailwind colors keep
 * working via `currentColor`.
 */
function wrap(Icon: IconsaxComponent, variant: Variant = "Linear") {
  return function WrappedIcon({ size = 18, className, style }: IconProps) {
    return (
      <Icon
        variant={variant}
        size={size}
        color="currentColor"
        className={className}
        style={style}
      />
    );
  };
}

// ─── Sidebar / navigation ────────────────────────────────────────────────────

export const HomeIcon          = wrap(Home, "Linear");
export const UsersIcon         = wrap(Profile2User, "Linear");
export const BriefcaseIcon     = wrap(Briefcase, "Linear");
export const MatchIcon         = wrap(Magicpen, "Linear");
export const ClientsIcon       = wrap(Buildings, "Linear");
export const CalendarIcon      = wrap(Calendar, "Linear");
export const TasksIcon         = wrap(TaskSquare, "Linear");
export const ReportsIcon       = wrap(Chart, "Linear");
export const SparklesIcon      = wrap(MagicStar, "Bold");
export const SettingsIcon      = wrap(Setting2, "Linear");
export const MenuListIcon      = wrap(HamburgerMenu, "Linear");

// ─── Search / actions ────────────────────────────────────────────────────────

export const SearchIcon        = wrap(SearchNormal, "Linear");
export const PlusIcon          = wrap(Add, "Linear");
export const BellIcon          = wrap(Notification, "Linear");
export const ChatIcon          = wrap(Message, "Linear");
export const ChevronDown       = wrap(ArrowDown2, "Linear");
export const ChevronRight      = wrap(ArrowRight2, "Linear");
export const ChevronLeft       = wrap(ArrowLeft2, "Linear");
export const MoreIcon          = wrap(More, "Linear");
export const FilterIcon        = wrap(Setting4, "Linear");
export const PhoneIcon         = wrap(Call, "Linear");
export const StarIcon          = wrap(Star1, "Linear");
export const PaperPlaneIcon    = wrap(Send2, "Linear");
export const PaperclipIcon     = wrap(Paperclip, "Linear");
export const ImageIcon         = wrap(Gallery, "Linear");
export const TemplateIcon      = wrap(Element4, "Linear");
export const RefreshIcon       = wrap(Refresh, "Linear");
export const ExpandIcon        = wrap(Maximize, "Linear");
export const PinIcon           = wrap(Location, "Linear");
export const SortIcon          = wrap(Sort, "Linear");
export const ListViewIcon      = wrap(RowVertical, "Linear");
export const GridViewIcon      = wrap(Element3, "Linear");
export const DownloadIcon      = wrap(DocumentDownload, "Linear");
export const UploadIcon        = wrap(DocumentUpload, "Linear");
export const EditIcon          = wrap(Edit2, "Linear");
export const ShareIcon         = wrap(Share, "Linear");
export const ClockIcon         = wrap(Clock, "Linear");

// ─── Money / status / glyphs ─────────────────────────────────────────────────

export const MoneyIcon         = wrap(DollarCircle, "Linear");
export const ShieldIcon        = wrap(ShieldTick, "Linear");
export const GlobeIcon         = wrap(Global, "Linear");
export const BuildingsIcon     = wrap(Buildings2, "Linear");
export const AtIcon            = wrap(Sms, "Linear");
export const PhoneCircleIcon   = wrap(CallCalling, "Linear");
export const BookmarkIcon      = wrap(Bookmark, "Linear");
export const DocumentIcon      = wrap(DocumentText, "Linear");
export const SolidStar         = wrap(Star, "Bold");
export const PlaneIcon         = wrap(Airplane, "Linear");
export const SuitcaseIcon      = wrap(Bag2, "Linear");
export const NodesIcon         = wrap(Hierarchy, "Linear");
export const TargetIcon        = wrap(Cup, "Bold");
export const WrenchIcon        = wrap(Setting2, "Bold");
export const StarOutlineIcon   = wrap(Star1, "Linear");

// ─── Industry / category ─────────────────────────────────────────────────────

export const MobileIcon        = wrap(Mobile, "Linear");
export const CartIcon          = wrap(ShoppingCart, "Linear");
export const WatchIcon         = wrap(Watch, "Linear");
export const LayersIcon        = wrap(Layer, "Linear");
export const MonitorIcon       = wrap(Monitor, "Linear");
export const BarChartMiniIcon  = wrap(Chart2, "Linear");

// ─── Confirmation / utility ──────────────────────────────────────────────────

export const CheckIcon         = wrap(TickCircle, "Bold");
export const PushPinIcon       = wrap(Location, "Bold");
export const NoteLinesIcon     = wrap(Note1, "Linear");
export const ExternalLinkIcon  = wrap(ExportSquare, "Linear");
export const InboxIcon         = wrap(Sms, "Linear");
export const UserPlusIcon      = wrap(UserAdd, "Linear");
export const CodeBracketsIcon  = wrap(Code, "Linear");
export const GraduationCapIcon = wrap(Bag2, "Linear");
export const DotCircleIcon     = wrap(InfoCircle, "Linear");
export const LinkChainIcon     = wrap(Link, "Linear");
export const TagIcon           = wrap(Tag2, "Linear");
export const ArrowLeftIcon     = wrap(ArrowLeft3, "Linear");
export const CopyIcon          = wrap(Copy, "Linear");
export const VerifiedBadgeIcon = wrap(Verify, "Bold");
export const InfoIcon          = wrap(InfoCircle, "Linear");
export const VideoIcon         = wrap(Video, "Linear");
export const XIcon             = wrap(CloseCircle, "Linear");
export const TrophyIcon        = wrap(Cup, "Bold");
export const TrendUpIcon       = wrap(TrendUp, "Linear");
export const SyncIcon          = wrap(Refresh, "Linear");

export type { Variant as IconVariant };
