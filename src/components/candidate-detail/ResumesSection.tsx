"use client";

import { useMemo, useState } from "react";
import { ActiveResumeDetails } from "@/components/candidate-detail/ActiveResumeDetails";
import { ResumesList } from "@/components/candidate-detail/ResumesList";
import type { Resume } from "@/lib/candidate-detail";

export function ResumesSection({ resumes }: { resumes: Resume[] }) {
  const initialActive = useMemo(() => {
    return resumes.find((r) => r.status === "Active")?.id ?? resumes[0]?.id ?? null;
  }, [resumes]);

  const [activeId, setActiveId] = useState<string | null>(initialActive);
  const active = resumes.find((r) => r.id === activeId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <ResumesList
        resumes={resumes}
        activeId={activeId}
        onSelect={setActiveId}
      />
      <ActiveResumeDetails resume={active} />
    </div>
  );
}
