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
        bg: "#E6E9FB",
        fg: "#2E47E0",
        icon: <NoteLinesIcon size={iconSize} />,
      };
    case "status":
      return {
        bg: "#E6E9FB",
        fg: "#273DC0",
        icon: <UsersIcon size={iconSize} />,
      };
    case "interview":
      return {
        bg: "#F2F3FD",
        fg: "#273DC0",
        icon: <CalendarIcon size={iconSize} />,
      };
    case "note":
      return {
        bg: "#F5F5F5",
        fg: "#525252",
        icon: <ChatIcon size={iconSize} />,
      };
    case "application":
      return {
        bg: "#E6E9FB",
        fg: "#20319C",
        icon: <InboxIcon size={iconSize} />,
      };
    case "shortlist":
      return {
        bg: "#F2F3FD",
        fg: "#20319C",
        icon: <StarOutlineIcon size={iconSize} />,
      };
    case "added":
    default:
      return {
        bg: "#E6E9FB",
        fg: "#2E47E0",
        icon: <UserPlusIcon size={iconSize} />,
      };
  }
}
