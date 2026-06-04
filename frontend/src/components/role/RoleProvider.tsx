"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_ROLE,
  ROLES,
  isRole,
  type Role,
  type RoleDef,
} from "@/lib/roles";

const STORAGE_KEY = "recruit.activeRole";

// Tiny external store so the active role survives reloads and stays in sync
// across tabs — and so React reads it without a setState-in-effect.
const listeners = new Set<() => void>();

function readRole(): Role {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isRole(stored)) return stored;
  } catch {
    // localStorage unavailable (privacy mode) — fall through to default.
  }
  return DEFAULT_ROLE;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeRole(next: Role): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore persistence failures
  }
  listeners.forEach((l) => l());
}

type RoleContextValue = {
  role: Role;
  def: RoleDef;
  setRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  // Server + first hydration render use DEFAULT_ROLE; the client immediately
  // re-reads the stored choice. No hydration mismatch, no effect needed.
  const role = useSyncExternalStore(subscribe, readRole, () => DEFAULT_ROLE);
  const setRole = useCallback((next: Role) => writeRole(next), []);

  return (
    <RoleContext.Provider value={{ role, def: ROLES[role], setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return ctx;
}
