"use client";

import {
  Profile,
  Profile2User,
  ShieldTick,
  TickCircle,
  type IconProps,
} from "iconsax-reactjs";
import type { ComponentType } from "react";
import { useRole } from "@/components/role/RoleProvider";
import { ROLE_ORDER, ROLES, type Role } from "@/lib/roles";

const ROLE_ICON: Record<Role, ComponentType<IconProps>> = {
  owner: ShieldTick,
  recruiter: Profile,
  bench_sales: Profile2User,
};

export function RoleSwitcher({ onSwitch }: { onSwitch?: () => void }) {
  const { role: activeRole, setRole } = useRole();

  return (
    <div role="radiogroup" aria-label="Switch role" className="flex flex-col gap-1">
      {ROLE_ORDER.map((id) => {
        const def = ROLES[id];
        const Icon = ROLE_ICON[id];
        const active = id === activeRole;
        const green = def.accent === "green";

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (!active) setRole(id);
              onSwitch?.();
            }}
            className={`group flex w-full items-center gap-3 rounded-[12px] border px-2.5 py-2.5 text-left transition-all ${
              active
                ? "border-[color:var(--color-brand-300)] bg-[color:var(--color-brand-50)]"
                : "border-transparent hover:bg-[color:var(--color-surface-2)]"
            }`}
          >
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
              style={
                green
                  ? { background: "var(--color-success-light, #EAFBF1)", color: "var(--color-success, #16A34A)" }
                  : { background: "var(--color-brand-100)", color: "var(--color-brand-600)" }
              }
            >
              <Icon size={18} variant={active ? "Bold" : "Linear"} color="currentColor" />
            </span>

            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[13.5px] font-semibold text-[color:var(--color-text)]">
                {def.label}
              </span>
              <span className="block truncate text-[11.5px] text-[color:var(--color-text-secondary)]">
                {def.description}
              </span>
            </span>

            {active ? (
              <TickCircle
                size={18}
                variant="Bold"
                color="var(--color-brand-500)"
                className="shrink-0"
              />
            ) : (
              <span
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 rounded-full border border-[color:var(--color-border-strong)] opacity-0 transition-opacity group-hover:opacity-60"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
