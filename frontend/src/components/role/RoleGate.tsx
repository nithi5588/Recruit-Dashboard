"use client";

import type { ReactNode } from "react";
import { useRole } from "@/components/role/RoleProvider";
import type { Role } from "@/lib/roles";

/**
 * Renders `children` only when the active role is in `allow`.
 * Use `fallback` to show alternate content for other roles.
 */
export function RoleGate({
  allow,
  children,
  fallback = null,
}: {
  allow: Role | Role[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { role } = useRole();
  const allowed = Array.isArray(allow) ? allow : [allow];
  return <>{allowed.includes(role) ? children : fallback}</>;
}
