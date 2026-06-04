"use client";

import { useState } from "react";

// Muted, cohesive avatar palette — flat neutral tones so a list of avatars
// reads as one calm set.
const GRADIENTS = [
  "#A3A3A3",
  "#737373",
  "#8E726B",
  "#A3A3A3",
  "#737373",
  "#A3A3A3",
  "#737373",
  "#737373",
];

function hashIndex(seed: string, mod: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export function Avatar({
  name,
  size = 40,
  className = "",
  color,
  image,
}: {
  name: string;
  size?: number;
  className?: string;
  /** Explicit background override; falls back to the muted hashed palette. */
  color?: string;
  /** Profile photo URL. Falls back to initials if it fails to load. */
  image?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const gradient = color ?? GRADIENTS[hashIndex(name, GRADIENTS.length)];
  const showImage = Boolean(image) && !failed;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient,
        fontSize: Math.max(11, Math.round(size * 0.38)),
        letterSpacing: "0.02em",
      }}
      aria-hidden
    >
      {/* Initials sit underneath as the fallback; the photo overlays them and
         is removed on error, revealing the initials again. */}
      {initials}
      {showImage ? (
        <img
          src={image}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </span>
  );
}
