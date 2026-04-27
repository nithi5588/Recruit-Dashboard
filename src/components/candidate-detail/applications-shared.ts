import type { BadgeTone } from "@/components/ui/Badge";
import type {
  ApplicationStageDot,
  ApplicationStatus,
} from "@/lib/candidate-detail";

export function applicationStatusTone(status: ApplicationStatus): BadgeTone {
  switch (status) {
    case "In Progress":
      return "purple";
    case "Under Review":
      return "orange";
    case "Shortlisted":
      return "green";
    case "Submitted":
      return "blue";
    case "Offered":
      return "purple";
    case "Placed":
      return "green";
    case "Rejected":
      return "red";
  }
}

export function stageDotColor(dot: ApplicationStageDot): string {
  switch (dot) {
    case "purple":
      return "#2E47E0";
    case "blue":
      return "#525252";
    case "orange":
      return "#5C6FE7";
    case "green":
      return "#2E47E0";
    case "red":
      return "#20319C";
    case "gray":
    default:
      return "#A3A3A3";
  }
}
