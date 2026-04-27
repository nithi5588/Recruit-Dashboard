"use client";

import { useState } from "react";
import { Chart, DocumentDownload } from "iconsax-reactjs";
import { ActivitiesTab } from "@/components/reports/ActivitiesTab";
import { CandidatesTab } from "@/components/reports/CandidatesTab";
import {
  DateRangePicker,
  rangeFromPreset,
  type DateRange,
} from "@/components/reports/DateRangePicker";
import { FollowupsTab } from "@/components/reports/FollowupsTab";
import { InterviewsTab } from "@/components/reports/InterviewsTab";
import { JobsTab } from "@/components/reports/JobsTab";
import { OverviewTab } from "@/components/reports/OverviewTab";
import { TeamPerformanceTab } from "@/components/reports/TeamPerformanceTab";
import {
  REPORT_TABS,
  activityData,
  followUpsData,
  funnelData,
  interviewStageData,
  recentActivities,
  reportStatCards,
  sourceData,
  topJobsData,
} from "@/lib/reports-data";
import { exportToExcel } from "@/lib/export-utils";

function ComingSoonTab({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-[color:var(--color-brand-100)]">
        <Chart size={28} variant="Bulk" color="var(--color-brand-500)" />
      </div>
      <h3 className="mb-1.5 text-[16px] font-bold text-[color:var(--color-text)]">{name} Report</h3>
      <p className="text-[13px] text-[color:var(--color-text-secondary)]">Detailed {name.toLowerCase()} analytics coming soon.</p>
    </div>
  );
}

type TabExport = {
  filename: string;
  sheetName: string;
  rows: Record<string, unknown>[];
  columns: Array<{ header: string; key: string; width?: number; type?: "string" | "number" | "date" }>;
};

function buildTabExport(tab: string): TabExport {
  const base = tab.toLowerCase().replace(/\s+/g, "-");
  switch (tab) {
    case "Overview": {
      const rows = reportStatCards.map((s) => ({
        Metric: s.label,
        Value: s.value,
        "Change (%)": s.change,
      }));
      const activityRows = activityData.labels.map((d, i) => ({
        Metric: d,
        Value: activityData.applications[i],
        "Change (%)": activityData.interviews[i],
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Overview",
        rows: [...rows, ...activityRows],
        columns: [
          { header: "Metric", key: "Metric", width: 28 },
          { header: "Value", key: "Value", width: 14 },
          { header: "Change (%)", key: "Change (%)", type: "number", width: 14 },
        ],
      };
    }
    case "Jobs": {
      const rows = topJobsData.map((j) => ({
        Title: j.title,
        Applications: j.applications,
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Top Jobs",
        rows,
        columns: [
          { header: "Title", key: "Title", width: 32 },
          { header: "Applications", key: "Applications", type: "number", width: 16 },
        ],
      };
    }
    case "Candidates": {
      const rows = sourceData.map((s) => ({
        Source: s.label,
        Count: s.count,
        "Share (%)": s.pct,
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Candidate Sources",
        rows,
        columns: [
          { header: "Source", key: "Source", width: 24 },
          { header: "Count", key: "Count", type: "number", width: 12 },
          { header: "Share (%)", key: "Share (%)", type: "number", width: 14 },
        ],
      };
    }
    case "Interviews": {
      const rows = interviewStageData.map((s) => ({
        Stage: s.label,
        Count: s.count,
        "Share (%)": s.pct,
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Interview Stages",
        rows,
        columns: [
          { header: "Stage", key: "Stage", width: 28 },
          { header: "Count", key: "Count", type: "number", width: 12 },
          { header: "Share (%)", key: "Share (%)", type: "number", width: 14 },
        ],
      };
    }
    case "Activities": {
      const rows = recentActivities.map((a) => ({
        Candidate: a.name,
        Action: a.action,
        Role: a.role,
        Time: a.time,
        Type: a.type,
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Activities",
        rows,
        columns: [
          { header: "Candidate", key: "Candidate", width: 24 },
          { header: "Action", key: "Action", width: 28 },
          { header: "Role", key: "Role", width: 24 },
          { header: "Time", key: "Time", width: 16 },
          { header: "Type", key: "Type", width: 14 },
        ],
      };
    }
    case "Follow-ups": {
      const rows = followUpsData.map((f) => ({
        Status: f.label,
        Count: f.count,
        "Share (%)": f.pct,
      }));
      return {
        filename: `report-${base}`,
        sheetName: "Follow-ups",
        rows,
        columns: [
          { header: "Status", key: "Status", width: 20 },
          { header: "Count", key: "Count", type: "number", width: 12 },
          { header: "Share (%)", key: "Share (%)", type: "number", width: 14 },
        ],
      };
    }
    case "Team Performance":
    default: {
      const rows = funnelData.map((f) => ({
        Stage: f.label,
        Count: f.count,
      }));
      return {
        filename: `report-${base}`,
        sheetName: tab,
        rows,
        columns: [
          { header: "Stage", key: "Stage", width: 24 },
          { header: "Count", key: "Count", type: "number", width: 12 },
        ],
      };
    }
  }
}

export function ReportsPageClient() {
  const [activeTab, setActiveTab] = useState<string>("Overview");

  const [range, setRange] = useState<DateRange>(
    () => rangeFromPreset("7d") ?? { start: new Date(), end: new Date() },
  );

  const handleExportReport = () => {
    const payload = buildTabExport(activeTab);
    if (payload.rows.length === 0) return;
    exportToExcel({
      filename: payload.filename,
      sheetName: payload.sheetName,
      columns: payload.columns.map((c) => ({
        header: c.header,
        key: (r: Record<string, unknown>) => r[c.key],
        type: c.type,
        width: c.width,
      })),
      rows: payload.rows,
    });
  };

  return (
    <div className="min-h-full bg-[color:var(--color-bg-base)] px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[color:var(--color-brand-100)] sm:h-10 sm:w-10">
              <Chart size={20} variant="Bulk" color="var(--color-brand-500)" />
            </span>
            <h1 className="text-[22px] font-bold tracking-tight text-[color:var(--color-text)] sm:text-[26px]">
              Reports
            </h1>
          </div>
          <p className="mt-1.5 text-[13px] text-[color:var(--color-text-secondary)]">
            Track your recruitment activities and performance in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker value={range} onChange={setRange} variant="primary" />
          <button
            type="button"
            onClick={handleExportReport}
            title={`Export ${activeTab} report to Excel`}
            className="flex h-9 items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-[12px] font-semibold text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-colors hover:border-[color:var(--color-brand-300)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-600)] sm:px-4"
          >
            <DocumentDownload size={14} variant="Bulk" color="currentColor" />
            <span className="hidden sm:inline">Export {activeTab}</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-[color:var(--color-border)]" aria-hidden />
        <div
          role="tablist"
          aria-label="Report sections"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REPORT_TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative shrink-0 px-3 pb-3 pt-2 text-[13px] font-medium transition-colors sm:px-4 ${
                  active
                    ? "text-[color:var(--color-brand-500)]"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {tab}
                {active && (
                  <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-t-full bg-[color:var(--color-brand-500)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Overview" ? (
        <OverviewTab />
      ) : activeTab === "Jobs" ? (
        <JobsTab />
      ) : activeTab === "Candidates" ? (
        <CandidatesTab />
      ) : activeTab === "Interviews" ? (
        <InterviewsTab />
      ) : activeTab === "Activities" ? (
        <ActivitiesTab />
      ) : activeTab === "Follow-ups" ? (
        <FollowupsTab />
      ) : activeTab === "Team Performance" ? (
        <TeamPerformanceTab />
      ) : (
        <ComingSoonTab name={activeTab} />
      )}
    </div>
  );
}
