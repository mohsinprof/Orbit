"use client";

import React from "react";
import { useModeStore } from "@/stores/useModeStore";
import AiHome from "./AiHome";
import ManualHome from "./ManualHome";

export default function HomeClient() {
  const mode = useModeStore((s) => s.mode);

  if (mode === "manual") return <ManualHome />;
  return <AiHome />;
}