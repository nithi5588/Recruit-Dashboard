"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

/**
 * Theme-aware checkbox. In light mode it stays white; in dark mode the
 * unchecked background switches to a dark surface so it doesn't read as
 * a glaring white square. The styling lives in globals.css under
 * `.app-checkbox` so we can target the `:checked` state with proper
 * pseudo-class CSS instead of fighting the native `accent-color`.
 */
export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={`app-checkbox ${className}`}
      {...props}
    />
  );
});
