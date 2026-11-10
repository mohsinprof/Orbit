import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "orange" | "red" | "none";
  as?: "div" | "section" | "aside";
}

const glowBg: Record<NonNullable<Props["glow"]>, string> = {
  none: "var(--surface-glass)",
  blue: "linear-gradient(135deg, rgba(0,240,255,0.08), rgba(255,59,48,0.05))",
  orange: "linear-gradient(135deg, rgba(255,149,0,0.08), rgba(255,255,255,0.04))",
  red: "linear-gradient(135deg, rgba(255,59,48,0.08), rgba(255,255,255,0.04))",
};

const glowBorder: Record<NonNullable<Props["glow"]>, string> = {
  none: "var(--border-glass)",
  blue: "rgba(0,240,255,0.3)",
  orange: "rgba(255,149,0,0.3)",
  red: "rgba(255,59,48,0.3)",
};

export default function GlassCard({
  glow = "none",
  className = "",
  style,
  children,
  ...rest
}: Props) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: glowBg[glow],
        borderColor: glowBorder[glow],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}