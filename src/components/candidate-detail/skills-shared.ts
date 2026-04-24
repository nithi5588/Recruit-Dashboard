import type { BadgeTone } from "@/components/ui/Badge";
import type { SkillLevel } from "@/lib/candidate-detail";

export function levelBadgeTone(level: SkillLevel): BadgeTone {
  switch (level) {
    case "Expert":
      return "purple";
    case "Advanced":
      return "blue";
    case "Intermediate":
      return "amber";
    case "Beginner":
    default:
      return "gray";
  }
}

export function levelPercent(level: SkillLevel): number {
  switch (level) {
    case "Expert":
      return 100;
    case "Advanced":
      return 80;
    case "Intermediate":
      return 55;
    case "Beginner":
    default:
      return 30;
  }
}

export function levelBarColor(level: SkillLevel): string {
  switch (level) {
    case "Expert":
      return "#5B3DF5";
    case "Advanced":
      return "#3B82F6";
    case "Intermediate":
      return "#F59E0B";
    case "Beginner":
    default:
      return "#98A2B3";
  }
}
