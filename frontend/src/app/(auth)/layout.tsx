export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-background flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
      <div
        className="grid w-full max-w-[1120px] grid-cols-1 overflow-hidden rounded-[var(--radius-panel)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        style={{ boxShadow: "var(--shadow-panel)" }}
      >
        {children}
      </div>
    </div>
  );
}
