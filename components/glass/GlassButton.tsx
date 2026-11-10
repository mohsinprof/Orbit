import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost";
  icon?: React.ReactNode;
}

export default function GlassButton({
  variant = "default",
  icon,
  className = "",
  children,
  ...rest
}: Props) {
  const classes =
    variant === "primary"
      ? "primary"
      : variant === "ghost"
      ? ""
      : "";

  return (
    <button className={`${classes} ${className}`} {...rest}>
      {icon && <span style={{ marginRight: children ? 6 : 0, display: "inline-flex", verticalAlign: "middle" }}>{icon}</span>}
      {children}
    </button>
  );
}