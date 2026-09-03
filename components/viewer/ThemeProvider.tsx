"use client";

import { ColorPalette } from "@/lib/schema";
import { useMemo } from "react";

/**
 * Default palette used when the AI doesn't provide one.
 * Matches the original nebula_dark indigo/purple aesthetic.
 */
const DEFAULT_PALETTE: ColorPalette = {
  primary: "#6366f1",
  secondary: "#ec4899",
  accent: "#10b981",
  background: "#0b0f19",
  surface: "#1a1a2e",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  accents: ["#6366f1", "#10b981", "#f43e5e", "#f59e0b"],
};

/**
 * Convert a hex color like "#6366f1" to an "R, G, B" string like "99, 102, 241"
 * for use with standard CSS rgb() / rgba() syntax via CSS variables.
 */
export function hexToRgb(hex: string): string {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  if (isNaN(bigint)) return "99, 102, 241"; // fallback
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export function paletteToCssVars(palette?: ColorPalette | null): React.CSSProperties {
  if (!palette) return {};
  const p = palette;
  const rawAccents = [...(p.accents || [p.primary, p.accent, p.secondary, "#f59e0b"])];
  while (rawAccents.length < 4) rawAccents.push(rawAccents[rawAccents.length - 1] || p.primary);

  return {
    "--theme-primary": hexToRgb(p.primary),
    "--theme-secondary": hexToRgb(p.secondary),
    "--theme-accent": hexToRgb(p.accent),
    "--theme-bg": hexToRgb(p.background),
    "--theme-surface": hexToRgb(p.surface),
    "--theme-text": hexToRgb(p.text),
    "--theme-text-muted": hexToRgb(p.textMuted),
    "--theme-accent-1": hexToRgb(rawAccents[0]),
    "--theme-accent-2": hexToRgb(rawAccents[1]),
    "--theme-accent-3": hexToRgb(rawAccents[2]),
    "--theme-accent-4": hexToRgb(rawAccents[3]),
    "--theme-bg-hex": p.background,
    "--theme-surface-hex": p.surface,
    "--theme-primary-hex": p.primary,
    "--theme-secondary-hex": p.secondary,
  } as React.CSSProperties;
}

interface ThemeProviderProps {
  palette?: ColorPalette | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * Injects the AI-generated color palette as CSS custom properties.
 * All layout components use these variables for dynamic theming.
 */
export function ThemeProvider({ palette, children, className }: ThemeProviderProps) {
  const p = palette || DEFAULT_PALETTE;
  const cssVars = useMemo(() => paletteToCssVars(p), [p]);

  return (
    <div style={cssVars} className={className}>
      {children}
    </div>
  );
}

export { DEFAULT_PALETTE };
