import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#020611",
        "surface-glass": "rgba(255, 255, 255, 0.04)",
        "border-glass": "rgba(255, 255, 255, 0.15)",
        "border-bright": "rgba(255, 255, 255, 0.35)",
        "accent-red": "#FF3B30",
        "accent-orange": "#FF9500",
        "accent-blue": "#00F0FF",
        "text-main": "#F5F7FA",
        "text-muted": "#9FB0C4",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Helvetica Neue", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        glass: "20px",
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};

export default config;