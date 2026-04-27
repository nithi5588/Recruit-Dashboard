export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-600) 100%)",
          boxShadow: "0 6px 16px rgba(46, 71, 224, 0.28)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2.5L11.5 7L3 11.5V2.5Z" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[20px] font-bold tracking-tight text-[color:var(--color-text)]">
        recruit
      </span>
    </div>
  );
}
