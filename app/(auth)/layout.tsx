import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(circle at 30% 20%, rgba(255,59,48,0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,240,255,0.08), transparent 50%), var(--bg-primary)",
      }}
    >
      {children}
    </div>
  );
}