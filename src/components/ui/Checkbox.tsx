"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Checkbox({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 shrink-0 cursor-pointer rounded-[4px] border border-[color:var(--color-border-strong)] accent-[color:var(--color-brand-500)] ${className}`}
      {...props}
    />
  );
});
