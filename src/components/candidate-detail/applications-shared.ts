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
      return "#EA6814";
    case "blue":
      return "#6B6358";
    case "orange":
      return "#ED8E55";
    case "green":
      return "#EA6814";
    case "red":
      return "#9F430D";
    case "gray":
    default:
      return "#9A9183";
  }
}
