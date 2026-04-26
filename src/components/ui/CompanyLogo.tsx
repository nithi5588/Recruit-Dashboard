"use client";

import { useState } from "react";
import { domainForCompany, logoUrl } from "@/lib/company-logo";

/**
 * Renders a real company/domain logo via companyenrich.com with a graceful
 * fallback to a colored letter tile if the request fails (404, network, CORS).
 *
 * Pass either `company` (we'll resolve the domain) or `domain` directly.
 */
export function CompanyLogo({
  company,
  domain,
  size = 32,
  fallbackBg = "#9A9183",
  fallbackFg = "#FFFFFF",
  fallbackText,
  className = "",
  rounded = "rounded-md",
  padding = 4,
  bg = "#FFFFFF",
}: {
  company?: string;
  domain?: string;
  size?: number;
  fallbackBg?: string;
  fallbackFg?: string;
  fallbackText?: string;
  className?: string;
  rounded?: string;
  padding?: number;
  bg?: string;
}) {
  const [errored, setErrored] = useState(false);
  const resolvedDomain = domain ?? (company ? domainForCompany(company) : null);
  const url = resolvedDomain ? logoUrl(resolvedDomain) : "";
  const initials = (
    fallbackText ?? company ?? domain ?? ""
  )
    .replace(/^https?:\/\//, "")
    .split(/\s+|\./)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  if (!url || errored) {
    return (
      <span
        aria-label={company ? `${company} logo` : undefined}
        className={`inline-flex shrink-0 items-center justify-center font-bold leading-none ${rounded} ${className}`}
        style={{
          width: size,
          height: size,
          background: fallbackBg,
          color: fallbackFg,
          fontSize: Math.max(10, Math.round(size * 0.4)),
          letterSpacing: "-0.01em",
        }}
      >
        {initials || "•"}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={company ? `${company} logo` : "Company logo"}
      onError={() => setErrored(true)}
      className={`shrink-0 object-contain ${rounded} ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        padding,
        border: "1px solid var(--color-border)",
      }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
