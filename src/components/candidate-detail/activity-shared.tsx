import {
  CalendarIcon,
  ChatIcon,
  InboxIcon,
  NoteLinesIcon,
  StarOutlineIcon,
  UserPlusIcon,
  UsersIcon,
} from "@/components/icons/AppIcons";
import type { ActivityKind } from "@/lib/candidate-detail";

export type ActivityTheme = {
  bg: string;
  fg: string;
  icon: React.ReactNode;
};

export function activityTheme(
  kind: ActivityKind,
  iconSize = 18,
): ActivityTheme {
  switch (kind) {
    case "resume":
      return {
        bg: "#EEE9FF",
        fg: "#5B3DF5",
        icon: <NoteLinesIcon size={iconSize} />,
      };
    case "status":
      return {
        bg: "#EAFBF1",
        fg: "#16A34A",
        icon: <UsersIcon size={iconSize} />,
      };
    case "interview":
      return {
        bg: "#FFEDD5",
        fg: "#C2410C",
        icon: <CalendarIcon size={iconSize} />,
      };
    case "note":
      return {
        bg: "#EAF2FF",
        fg: "#1D4ED8",
        icon: <ChatIcon size={iconSize} />,
      };
    case "application":
      return {
        bg: "#FCE7F3",
        fg: "#BE185D",
        icon: <InboxIcon size={iconSize} />,
      };
    case "shortlist":
      return {
        bg: "#FFF4DB",
        fg: "#92400E",
        icon: <StarOutlineIcon size={iconSize} />,
      };
    case "added":
    default:
      return {
        bg: "#F3E8FF",
        fg: "#7C3AED",
        icon: <UserPlusIcon size={iconSize} />,
      };
  }
}
