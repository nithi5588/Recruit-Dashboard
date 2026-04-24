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
      return "#5B3DF5";
    case "blue":
      return "#3B82F6";
    case "orange":
      return "#F59E0B";
    case "green":
      return "#22C55E";
    case "red":
      return "#EF4444";
    case "gray":
    default:
      return "#98A2B3";
  }
}
