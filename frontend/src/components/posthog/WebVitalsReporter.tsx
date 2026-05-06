"use client";

import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// Field-level Core Web Vitals reporter.
// LCP / INP / CLS are surfaced to PostHog so we get real-user data, not lab.
// Lazy-imports `web-vitals` so it never lands in the main bundle.
export function WebVitalsReporter() {
  const posthog = usePostHog();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      if (cancelled) return;
      const send = (name: string) => (m: { value: number; rating: string; id: string }) => {
        if (!posthog) return;
        posthog.capture("$web_vitals", {
          metric:  name,
          value:   m.value,
          rating:  m.rating,
          metricId: m.id,
        });
      };
      onCLS(send("CLS"));
      onINP(send("INP"));
      onLCP(send("LCP"));
      onFCP(send("FCP"));
      onTTFB(send("TTFB"));
    }).catch(() => { /* web-vitals is best-effort */ });

    return () => { cancelled = true; };
  }, [posthog]);

  return null;
}
