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
        bg: "#FCE9DD",
        fg: "#EA6814",
        icon: <NoteLinesIcon size={iconSize} />,
      };
    case "status":
      return {
        bg: "#FCE9DD",
        fg: "#C75510",
        icon: <UsersIcon size={iconSize} />,
      };
    case "interview":
      return {
        bg: "#FFF6EE",
        fg: "#C75510",
        icon: <CalendarIcon size={iconSize} />,
      };
    case "note":
      return {
        bg: "#F4F2EE",
        fg: "#6B6358",
        icon: <ChatIcon size={iconSize} />,
      };
    case "application":
      return {
        bg: "#FCE9DD",
        fg: "#9F430D",
        icon: <InboxIcon size={iconSize} />,
      };
    case "shortlist":
      return {
        bg: "#FFF6EE",
        fg: "#9F430D",
        icon: <StarOutlineIcon size={iconSize} />,
      };
    case "added":
    default:
      return {
        bg: "#FCE9DD",
        fg: "#EA6814",
        icon: <UserPlusIcon size={iconSize} />,
      };
  }
}
