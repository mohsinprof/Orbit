"use client";

import React, { useEffect, useState } from "react";
import Orb from "./Orb";
import type { OrbConfig } from "@/lib/orbTypes";
import { ORB_SIZES } from "@/lib/orbTypes";
import { useModeStore } from "@/stores/useModeStore";

interface Props {
  activeItemTitle?: string;
  activeItemRemaining?: string;     // e.g. "12 / 200 hrs"
  timerDisplay?: string;            // e.g. "00:42:15"
  chatActive: boolean;
  onChatClose?: () => void;
  onOrbClick?: () => void;
}

type StageState = "idle" | "split" | "triple" | "manual-idle" | "manual-active";

export default function OrbStage({
  activeItemTitle,
  activeItemRemaining,
  timerDisplay,
  chatActive,
  onChatClose,
  onOrbClick,
}: Props) {
  const mode = useModeStore((s) => s.mode);
  const taskRunning = !!activeItemTitle;

  const [state, setState] = useState<StageState>(mode === "ai" ? "idle" : "manual-idle");

  useEffect(() => {
    if (mode === "manual") {
      setState(taskRunning ? "manual-active" : "manual-idle");
    } else {
      if (taskRunning && chatActive) setState("triple");
      else if (taskRunning) setState("split");
      else setState("idle");
    }
  }, [mode, taskRunning, chatActive]);

  if (state === "idle") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
        <Orb
          variant="ai-idle"
          size={ORB_SIZES.idle}
          primary="Orbit"
          secondary="AI Ready"
          onClick={onOrbClick}
          animateIn
          animateKey="ai-idle"
        />
      </div>
    );
  }

  if (state === "split" || state === "triple") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: state === "triple" ? 32 : 24,
          padding: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <Orb
          variant="timer"
          size={ORB_SIZES.active}
          primary={timerDisplay || "00:00:00"}
          secondary="Timer"
          label={activeItemTitle}
          animateIn
          animateKey={`timer-${activeItemTitle}`}
        />
        <Orb
          variant="remaining"
          size={ORB_SIZES.active}
          primary={activeItemRemaining || "—"}
          secondary="Remaining"
          animateIn
          animateKey="remaining"
        />
        {state === "triple" && (
          <Orb
            variant="chat"
            size={ORB_SIZES.active}
            primary="Chat"
            secondary="with Orbit"
            onClick={onChatClose}
            animateIn
            animateKey="chat"
            label="× to close"
          />
        )}
      </div>
    );
  }

  if (state === "manual-idle") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
        <Orb
          variant="manual-timer"
          size={ORB_SIZES.manual}
          primary="00:00:00"
          secondary="Timer"
          onClick={onOrbClick}
          animateIn
          animateKey="manual-idle"
        />
      </div>
    );
  }

  // manual-active
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
      <Orb
        variant="manual-timer"
        size={ORB_SIZES.manual}
        primary={timerDisplay || "00:00:00"}
        secondary="Timer"
        label={activeItemTitle}
        animateIn
        animateKey={`manual-${activeItemTitle}`}
      />
    </div>
  );
}