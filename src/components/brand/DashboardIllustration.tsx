export function DashboardIllustration() {
  return (
    <div
      className="relative mx-auto aspect-[4/3] w-full max-w-[360px]"
      aria-hidden
    >
      {/* Back card — analytics panel */}
      <div
        className="absolute left-[32%] top-[6%] h-[72%] w-[58%] rounded-[14px] bg-white"
        style={{ boxShadow: "var(--shadow-panel)" }}
      >
        <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-surface-2)]" />
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-surface-2)]" />
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-surface-2)]" />
          </div>
          <div className="h-2.5 w-10 rounded-full bg-[color:var(--color-surface-2)]" />
        </div>
        <div className="space-y-2 px-4 pt-4">
          <div className="h-2.5 w-2/3 rounded-full bg-[color:var(--color-surface-2)]" />
          <div className="h-2 w-1/2 rounded-full bg-[color:var(--color-surface-2)]" />
        </div>
        {/* Simple sparkline area */}
        <div className="relative mt-4 h-16 px-4">
          <svg viewBox="0 0 200 64" className="h-full w-full" fill="none">
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EA6814" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#EA6814" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 52 L22 44 L46 48 L70 30 L96 36 L120 22 L146 28 L172 14 L200 18 L200 64 L0 64 Z"
              fill="url(#sparkFill)"
            />
            <path
              d="M0 52 L22 44 L46 48 L70 30 L96 36 L120 22 L146 28 L172 14 L200 18"
              stroke="#EA6814"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Front card — candidate list */}
      <div
        className="absolute left-[4%] top-[14%] h-[78%] w-[64%] overflow-hidden rounded-[14px] bg-white"
        style={{ boxShadow: "var(--shadow-panel)" }}
      >
        <div className="flex items-center gap-2 border-b border-[color:var(--color-border)] px-3 py-3">
          <div className="h-6 w-6 rounded-md bg-[color:var(--color-brand-100)]" />
          <div className="h-2 w-20 rounded-full bg-[color:var(--color-surface-2)]" />
          <div className="ml-auto h-2 w-10 rounded-full bg-[color:var(--color-surface-2)]" />
        </div>
        <div className="space-y-3 px-3 py-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="h-7 w-7 rounded-full"
                style={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg,#F2B187,#EA6814)"
                      : "linear-gradient(135deg,#F8D5BD,#ED8E55)",
                }}
              />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 w-4/5 rounded-full bg-[color:var(--color-surface-2)]" />
                <div className="h-1.5 w-2/5 rounded-full bg-[color:var(--color-surface-2)]" />
              </div>
              <div
                className={`h-2 w-8 rounded-full ${
                  i === 0
                    ? "bg-[color:var(--color-brand-200)]"
                    : "bg-[color:var(--color-surface-2)]"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating avatar badge top-right */}
      <div
        className="absolute right-[4%] top-[2%] flex h-10 w-10 items-center justify-center rounded-full text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600))",
          boxShadow: "var(--shadow-panel)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Floating check bottom-left */}
      <div
        className="absolute bottom-[6%] left-[0%] flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{
          background: "linear-gradient(135deg,#F2B187,#C75510)",
          boxShadow: "var(--shadow-panel)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l4 4L19 6"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Floating calendar bottom-right */}
      <div
        className="absolute bottom-[2%] right-[12%] flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{
          background: "linear-gradient(135deg,#ED8E55,#ED8E55)",
          boxShadow: "var(--shadow-panel)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8h18M7 3v3M17 3v3M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
