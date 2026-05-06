"use client";

/**
 * Auth-flow icons (login, signup, password fields).
 * Single-line wrappers around iconsax-reactjs so the look matches the
 * rest of the app. Brand logos (Google / Microsoft) stay as hand-drawn
 * SVGs since iconsax doesn't ship those marks.
 */

import {
  ArrowDown2,
  Buildings,
  Eye,
  EyeSlash,
  Lock,
  Profile,
  Sms,
  TickCircle,
  type IconProps as IconsaxProps,
} from "iconsax-reactjs";
import type { ComponentType, SVGAttributes } from "react";

type IconProps = { className?: string; size?: number };
type Variant = NonNullable<IconsaxProps["variant"]>;
type IconsaxComponent = ComponentType<
  IconsaxProps & Omit<SVGAttributes<SVGElement>, "color">
>;

function wrap(Icon: IconsaxComponent, variant: Variant = "Linear", defaultSize = 18) {
  return function WrappedIcon({ className, size = defaultSize }: IconProps) {
    return (
      <Icon
        variant={variant}
        size={size}
        color="currentColor"
        className={className}
      />
    );
  };
}

// ─── Form-field icons ────────────────────────────────────────────────────────

export const MailIcon = wrap(Sms);
export const LockIcon = wrap(Lock);
export const UserIcon = wrap(Profile);
export const BuildingIcon = wrap(Buildings);
export const EyeIcon = wrap(Eye);
export const EyeOffIcon = wrap(EyeSlash);
export const ChevronDownIcon = wrap(ArrowDown2);
export const CheckCircleIcon = wrap(TickCircle, "Bold", 16);

// ─── Brand marks (kept as hand-drawn SVG) ────────────────────────────────────

export function GoogleIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-13l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"
      />
      <path
        fill="#5C6FE7"
        d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#525252"
        d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.4l6.3 5.3C41.8 35.5 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5Z"
      />
    </svg>
  );
}

export function MicrosoftIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
      <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
      <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
    </svg>
  );
}
