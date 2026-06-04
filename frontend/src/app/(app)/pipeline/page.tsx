import { OwnerPipelineBoard } from "@/components/pipeline/OwnerPipelineBoard";
import { PipelineBoardClient } from "@/components/pipeline/PipelineBoardClient";
import { RoleGate } from "@/components/role/RoleGate";

export default function PipelinePage() {
  return (
    <>
      {/* Owner / admin sees the agency-wide pipeline across all recruiters. */}
      <RoleGate allow="owner">
        <OwnerPipelineBoard />
      </RoleGate>

      {/* Recruiter & Bench Sales keep their focused board. */}
      <RoleGate allow={["recruiter", "bench_sales"]}>
        <PipelineBoardClient />
      </RoleGate>
    </>
  );
}
