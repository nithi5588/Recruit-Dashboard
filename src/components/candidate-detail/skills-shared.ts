import type { BadgeTone } from "@/components/ui/Badge";
import type { SkillLevel } from "@/lib/candidate-detail";

export function levelBadgeTone(level: SkillLevel): BadgeTone {
  switch (level) {
    case "Expert":
      return "purple";
    case "Advanced":
      return "purple";
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

// All proficiency bars stay within one color family (brand purple ramp +
// neutral) so a row of skills reads as a calm gradient instead of a rainbow.
export function levelBarColor(level: SkillLevel): string {
  switch (level) {
    case "Expert":
      return "var(--color-brand-500)";
    case "Advanced":
      return "var(--color-brand-400)";
    case "Intermediate":
      return "var(--color-brand-300)";
    case "Beginner":
    default:
      return "var(--color-text-muted)";
  }
}
