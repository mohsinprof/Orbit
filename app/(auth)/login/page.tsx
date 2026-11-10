"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/glass/GlassCard";
import GlassButton from "@/components/glass/GlassButton";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // UI phase mock — Phase B will wire Supabase Auth
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <GlassCard style={{ width: "100%", maxWidth: 420, padding: 32 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "linear-gradient(135deg, var(--accent-red), var(--accent-orange))",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            boxShadow: "0 8px 24px rgba(255,59,48,0.3)",
          }}
        >
          D
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Done</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
          Sign in to continue tracking with Orbit
        </p>
      </div>

      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "rgba(0,0,0,0.3)",
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        {(["password", "magic"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: 13,
              fontWeight: 600,
              background: mode === m ? "rgba(255,255,255,0.08)" : "transparent",
              border: "none",
              borderRadius: 8,
              color: mode === m ? "var(--text-main)" : "var(--text-muted)",
            }}
          >
            {m === "password" ? "Password" : "Magic link"}
          </button>
        ))}
      </div>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        {mode === "password" && (
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
        )}

        <GlassButton type="submit" variant="primary" style={{ marginTop: 6 }} disabled={loading}>
          {loading
            ? "Signing in…"
            : mode === "password"
            ? "Sign in"
            : "Send magic link"}
        </GlassButton>
      </form>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "0.5px solid var(--border-glass)",
          fontSize: 12,
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        Don&apos;t have an account?{" "}
        <span style={{ color: "var(--accent-blue)", cursor: "pointer" }}>
          Create one
        </span>
      </div>
    </GlassCard>
  );
}