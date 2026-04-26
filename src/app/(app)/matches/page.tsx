import { Suspense } from "react";
import { MatchesPageClient } from "@/components/matches/MatchesPageClient";

export default function MatchesPage() {
  return (
    <Suspense fallback={<MatchesFallback />}>
      <MatchesPageClient />
    </Suspense>
  );
}

function MatchesFallback() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
        <div className="mb-6 h-8 w-40 animate-pulse rounded-md bg-slate-200" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[180px] animate-pulse rounded-xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
