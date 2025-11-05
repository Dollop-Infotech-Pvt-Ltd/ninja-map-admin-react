import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "./http";

export type PermissionType = "READ" | "WRITE" | "DELETE" | "ADMIN" | string;

export interface PermissionEntry {
  resource: string; // e.g., BLOG_POST_MANAGEMENT
  action: string;   // e.g., SHARE_BLOGS
  type: PermissionType; // e.g., WRITE
}

interface PermissionContextValue {
  permissions: PermissionEntry[];
  setPermissions: (p: PermissionEntry[]) => void;
  addPermissions: (p: PermissionEntry | PermissionEntry[]) => void;
  has: (resource: string, action?: string | null, type?: PermissionType | null) => boolean;
  refresh: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

const LS_KEY = "app_permissions";

function normalize(s: string | null | undefined): string {
  return (s || "").toString().trim().toUpperCase();
}

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissionsState] = useState<PermissionEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      const parsed = raw ? (JSON.parse(raw) as PermissionEntry[]) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((next: PermissionEntry[]) => {
    setPermissionsState(next);
    try { if (typeof window !== "undefined") window.localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const setPermissions = useCallback((p: PermissionEntry[]) => {
    const cleaned = p.map((x) => ({
      resource: normalize(x.resource),
      action: normalize(x.action),
      type: normalize(x.type) as PermissionType,
    }));
    persist(cleaned);
  }, [persist]);

  const addPermissions = useCallback((p: PermissionEntry | PermissionEntry[]) => {
    const list = Array.isArray(p) ? p : [p];
    const normalized = list.map((x) => ({
      resource: normalize(x.resource),
      action: normalize(x.action),
      type: normalize(x.type) as PermissionType,
    }));
    const key = (x: PermissionEntry) => `${x.resource}:${x.action}:${x.type}`;
    const current = new Map(permissions.map((x) => [key(x), x] as const));
    for (const item of normalized) current.set(key(item), item);
    persist(Array.from(current.values()));
  }, [permissions, persist]);

  const has = useCallback((resource: string, action?: string | null, type?: PermissionType | null) => {
    const R = normalize(resource);
    const A = normalize(action || "");
    const T = normalize(type || "");

    return permissions.some((p) => {
      const rOk = p.resource === R || p.resource === "*" || R === "*";
      const aOk = !A || p.action === A || p.action === "*";
      const tOk = !T || p.type === T || p.type === "*";
      return rOk && aOk && tOk;
    });
  }, [permissions]);

  const refresh = useCallback(async () => {
    // Best-effort: If backend exposes a current-permissions endpoint, hydrate from it.
    // If not available or fails, keep existing permissions.
    try {
      const res = await api.get<any>("/api/permissions/me");
      const data = (res as any)?.data ?? res;
      const list: PermissionEntry[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.permissions)
        ? (data as any).permissions
        : [];
      if (Array.isArray(list)) setPermissions(list);
    } catch {
      // ignore
    }
  }, [setPermissions]);

  useEffect(() => {
    // Try to hydrate from server on mount but do not block UI
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<PermissionContextValue>(() => ({
    permissions,
    setPermissions,
    addPermissions,
    has,
    refresh,
  }), [permissions, setPermissions, addPermissions, has, refresh]);

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}
