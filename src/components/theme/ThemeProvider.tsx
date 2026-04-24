"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Density = "compact" | "default" | "spacious";

export const ACCENT_PRESETS = [
  "#5B3DF5",
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
  "#EF4444",
] as const;

export const DEFAULT_ACCENT = ACCENT_PRESETS[0];
const STORAGE_KEY = "recruit:appearance:v1";

type Appearance = {
  theme: ThemeMode;
  accent: string;
  density: Density;
};

type ThemeContextValue = Appearance & {
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemeMode) => void;
  setAccent: (c: string) => void;
  setDensity: (d: Density) => void;
  reset: () => void;
  save: () => void;
  discard: () => void;
  isDirty: boolean;
  savedAt: number | null;
};

const DEFAULTS: Appearance = {
  theme: "light",
  accent: DEFAULT_ACCENT,
  density: "default",
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function clampHex(hex: string): string {
  const v = hex.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v.toLowerCase();
  return DEFAULT_ACCENT;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = clampHex(hex).replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function mix(hex: string, with_: string, ratio: number): string {
  const [r1, g1, b1] = hexToRgb(hex);
  const [r2, g2, b2] = hexToRgb(with_);
  return rgbToHex(
    r1 * (1 - ratio) + r2 * ratio,
    g1 * (1 - ratio) + g2 * ratio,
    b1 * (1 - ratio) + b2 * ratio
  );
}

function buildAccentShades(accent: string) {
  const base = clampHex(accent);
  return {
    50: mix(base, "#ffffff", 0.94),
    100: mix(base, "#ffffff", 0.88),
    200: mix(base, "#ffffff", 0.72),
    300: mix(base, "#ffffff", 0.5),
    400: mix(base, "#ffffff", 0.22),
    500: base,
    600: mix(base, "#000000", 0.14),
    700: mix(base, "#000000", 0.3),
  };
}

function readInitial(): Appearance {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Appearance>;
    return {
      theme:
        parsed.theme === "dark" || parsed.theme === "light" || parsed.theme === "system"
          ? parsed.theme
          : DEFAULTS.theme,
      accent: parsed.accent ? clampHex(parsed.accent) : DEFAULTS.accent,
      density:
        parsed.density === "compact" ||
        parsed.density === "default" ||
        parsed.density === "spacious"
          ? parsed.density
          : DEFAULTS.density,
    };
  } catch {
    return DEFAULTS;
  }
}

function resolveSystem(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyToDocument(a: Appearance, resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-mode", a.theme);
  root.setAttribute("data-density", a.density);
  root.setAttribute("data-accent", a.accent.toLowerCase());

  const shades = buildAccentShades(a.accent);
  root.style.setProperty("--color-brand-50", shades[50]);
  root.style.setProperty("--color-brand-100", shades[100]);
  root.style.setProperty("--color-brand-200", shades[200]);
  root.style.setProperty("--color-brand-300", shades[300]);
  root.style.setProperty("--color-brand-400", shades[400]);
  root.style.setProperty("--color-brand-500", shades[500]);
  root.style.setProperty("--color-brand-600", shades[600]);
  root.style.setProperty("--color-brand-700", shades[700]);
  root.style.setProperty("--accent", shades[500]);
  root.style.setProperty("--accent-600", shades[600]);
  root.style.setProperty("--accent-100", shades[100]);
  root.style.setProperty("--accent-200", shades[200]);

  const [r, g, b] = hexToRgb(a.accent);
  root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
}

function eq(a: Appearance, b: Appearance): boolean {
  return (
    a.theme === b.theme &&
    a.density === b.density &&
    a.accent.toLowerCase() === b.accent.toLowerCase()
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // `state` is the live/preview value applied to the DOM.
  // `saved` is the persisted value in localStorage. Changes preview immediately;
  // `save()` commits them to localStorage.
  const [state, setState] = useState<Appearance>(DEFAULTS);
  const [saved, setSaved] = useState<Appearance>(DEFAULTS);
  const [systemPref, setSystemPref] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useIsoLayoutEffect(() => {
    const loaded = readInitial();
    setState(loaded);
    setSaved(loaded);
    setSystemPref(resolveSystem());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setSystemPref(e.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "light" | "dark" =
    state.theme === "system" ? systemPref : state.theme;

  useIsoLayoutEffect(() => {
    if (!hydrated) return;
    applyToDocument(state, resolvedTheme);
  }, [state, resolvedTheme, hydrated]);

  const setTheme = useCallback((t: ThemeMode) => {
    setState((s) => ({ ...s, theme: t }));
  }, []);
  const setAccent = useCallback((c: string) => {
    setState((s) => ({ ...s, accent: clampHex(c) }));
  }, []);
  const setDensity = useCallback((d: Density) => {
    setState((s) => ({ ...s, density: d }));
  }, []);
  const reset = useCallback(() => setState(DEFAULTS), []);

  const save = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaved(state);
      setSavedAt(Date.now());
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [state]);

  const discard = useCallback(() => {
    setState(saved);
  }, [saved]);

  const isDirty = hydrated && !eq(state, saved);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...state,
      resolvedTheme,
      setTheme,
      setAccent,
      setDensity,
      reset,
      save,
      discard,
      isDirty,
      savedAt,
    }),
    [state, resolvedTheme, setTheme, setAccent, setDensity, reset, save, discard, isDirty, savedAt]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}

// Inlined in <head> before React hydrates so the first paint matches the
// persisted user preference (no light-flash when dark mode is saved).
export const THEME_INIT_SCRIPT = `
(function(){try{
  var k="${STORAGE_KEY}";
  var raw=localStorage.getItem(k);
  var s=raw?JSON.parse(raw):null;
  var t=s&&s.theme?s.theme:"light";
  var a=s&&s.accent?s.accent:"${DEFAULT_ACCENT}";
  var d=s&&s.density?s.density:"default";
  var resolved=t==="system"
    ?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")
    :t;
  var r=document.documentElement;
  r.setAttribute("data-theme",resolved);
  r.setAttribute("data-theme-mode",t);
  r.setAttribute("data-density",d);
  r.setAttribute("data-accent",(a||"").toLowerCase());
  function hx(h){h=(h||"").replace("#","");if(h.length===3){h=h.split("").map(function(c){return c+c;}).join("");}var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
  function th(r,g,b){function to(v){return Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0");}return "#"+to(r)+to(g)+to(b);}
  function mx(x,y,r){var a=hx(x),b=hx(y);return th(a[0]*(1-r)+b[0]*r,a[1]*(1-r)+b[1]*r,a[2]*(1-r)+b[2]*r);}
  var sh={50:mx(a,"#ffffff",0.94),100:mx(a,"#ffffff",0.88),200:mx(a,"#ffffff",0.72),300:mx(a,"#ffffff",0.5),400:mx(a,"#ffffff",0.22),500:a,600:mx(a,"#000000",0.14),700:mx(a,"#000000",0.3)};
  Object.keys(sh).forEach(function(k){r.style.setProperty("--color-brand-"+k,sh[k]);});
  r.style.setProperty("--accent",sh[500]);
  r.style.setProperty("--accent-600",sh[600]);
  r.style.setProperty("--accent-100",sh[100]);
  r.style.setProperty("--accent-200",sh[200]);
  var rgb=hx(a);
  r.style.setProperty("--accent-rgb",rgb[0]+", "+rgb[1]+", "+rgb[2]);
}catch(e){}})();
`;
