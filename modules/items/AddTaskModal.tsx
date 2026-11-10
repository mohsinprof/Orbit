"use client";

import React, { useState } from "react";
import GlassModal from "@/components/glass/GlassModal";
import GlassButton from "@/components/glass/GlassButton";
import { useUiStore } from "@/stores/useUiStore";
import type { GoalType, Priority } from "@/lib/types";

const GOAL_TYPES: { value: GoalType; label: string }[] = [
  { value: "hours", label: "Hours Goal" },
  { value: "chapters", label: "Chapter Goal" },
  { value: "days", label: "Days Goal" },
  { value: "one_time", label: "One-Time Task" },
];

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function AddTaskModal() {
  const open = useUiStore((s) => s.addTaskModalOpen);
  const close = useUiStore((s) => s.closeAddTaskModal);

  const [name, setName] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("hours");
  const [totalGoal, setTotalGoal] = useState("200");
  const [dailyTarget, setDailyTarget] = useState("3");
  const [deadlineDays, setDeadlineDays] = useState("30");
  const [priority, setPriority] = useState<Priority>("medium");
  const [date, setDate] = useState("2026-11-25");

  const handleSave = () => {
    alert(`Mock save:\n${name || "Untitled"}\n${goalType} · total ${totalGoal}\ndaily ${dailyTarget}\ndeadline ${deadlineDays}d\npriority ${priority}`);
    close();
  };

  return (
    <GlassModal open={open} onClose={close} title="Create New Task" width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Task Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Quantum Physics" autoFocus />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Goal Type</label>
            <select value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)}>
              {GOAL_TYPES.map((g) => (<option key={g.value} value={g.value}>{g.label}</option>))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              {PRIORITIES.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Total Goal</label>
            <input type="number" value={totalGoal} onChange={(e) => setTotalGoal(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Daily Target</label>
            <input type="number" value={dailyTarget} onChange={(e) => setDailyTarget(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Deadline (days)</label>
            <input type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 12, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Start Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
        <GlassButton onClick={close}>Cancel</GlassButton>
        <GlassButton variant="primary" onClick={handleSave}>Create Task</GlassButton>
      </div>
    </GlassModal>
  );
}