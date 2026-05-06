import type { BadgeTone } from "@/components/ui/Badge";
import type { NoteKind } from "@/lib/candidate-detail";

export function noteKindTone(kind: NoteKind): BadgeTone {
  switch (kind) {
    case "Team":
      return "blue";
    case "Interview":
      return "green";
    case "Private":
    default:
      return "purple";
  }
}
