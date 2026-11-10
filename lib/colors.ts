import type { AccentColor } from "./types";

export const ACCENT_HEX: Record<AccentColor, string> = {
  red: "#FF3B30",
  orange: "#fbbf24",
  blue: "#5eead4",
  white: "#bfdbfe",
  green: "#86efac",
  magenta: "#f0abfc",
  sky: "#bfdbfe",
};

export function accentVar(color: AccentColor): string {
  return `var(--accent-${color === "white" ? "" : color})`;
}

export function accentHex(color: AccentColor): string {
  return ACCENT_HEX[color];
}