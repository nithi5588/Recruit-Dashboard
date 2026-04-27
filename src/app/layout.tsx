import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/theme/ThemeProvider";
import { PostHogProvider } from "@/components/posthog/PostHogProvider";
import { PostHogPageView } from "@/components/posthog/PostHogPageView";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recruit — Recruitment operations, in one place",
  description:
    "Manage all your candidates, resumes, job matches, and interviews in a single recruiter-first workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          // Runs before first paint to apply persisted theme/accent/density.
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <PostHogProvider>
          <ThemeProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
