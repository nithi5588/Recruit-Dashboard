import { stats, type Stat } from "@/lib/sample-data";

const TONE: Record<Stat["tone"], { bg: string; fg: string; outline: string }> = {
  purple: { bg: "#EEE9FF", fg: "#5B3DF5", outline: "#D8D0FF" },
  blue: { bg: "#EAF2FF", fg: "#2563EB", outline: "#C7DBFC" },
  orange: { bg: "#FFF1E6", fg: "#F97316", outline: "#FCD9B6" },
  green: { bg: "#EAFBF1", fg: "#16A34A", outline: "#BBF0CF" },
};

function ArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 19V5M6 11l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ArrowDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M6 13l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatIcon({ tone }: { tone: Stat["tone"] }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  } as const;
  if (tone === "purple") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0 0-6M15 20a5 5 0 0 1 6-4.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (tone === "blue") {
    return (
      <svg {...common}>
        <circle cx="10" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M4 20a6 6 0 0 1 12 0M19 8v6M16 11h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (tone === "orange") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 8v4l3 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m8.5 12.2 2.4 2.4 4.6-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({ stat }: { stat: Stat }) {
  const tone = TONE[stat.tone];
  const up = stat.deltaDirection === "up";
  return (
    <div
      className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
        style={{
          background: tone.bg,
          color: tone.fg,
          border: `1px solid ${tone.outline}`,
        }}
      >
        <StatIcon tone={stat.tone} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[color:var(--color-text-secondary)]">
          {stat.label}
        </p>
        <p className="text-[22px] font-bold leading-[28px] tracking-tight text-[color:var(--color-text)]">
          {stat.value}
        </p>
        <p
          className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: up ? "#16A34A" : "#EF4444" }}
        >
          {up ? <ArrowUp /> : <ArrowDown />}
          {stat.delta}
        </p>
      </div>
    </div>
  );
}

export function CandidatesStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} stat={s} />
      ))}
    </div>
  );
}
