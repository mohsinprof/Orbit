"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AIOrbStage from "@/modules/orbit/AIOrbStage";
import { mockItems, mockFolders, mockSessions, MOCK_NOW, mockProgressLogs, mockSettings } from "@/lib/mock/data";
import { useChatStore } from "@/stores/useChatStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { IconX, IconArrowUp, IconAt } from "@tabler/icons-react";

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

const INITIAL_GREETING = `Hi! It's ${new Date(MOCK_NOW).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}. You have 2 tasks due this week. Database Systems is on pace. Operating Systems is behind by 4h roll-over. Suggested next: continue DB Chapter 4.`;

export default function AiHome() {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());
  const [focusMode, setFocusMode] = useState(false);
  const [orbitTyping, setOrbitTyping] = useState(false);
  const [taskStartTimes, setTaskStartTimes] = useState<Record<string, number>>({});
  const [taskElapsedMs, setTaskElapsedMs] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    messages, input, setInput, mentions, addMention, removeMention,
    addUserMessage, addAssistantMessage, processing, setProcessing,
    pickerOpen, setPickerOpen,
  } = useChatStore();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Seed greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => addAssistantMessage(INITIAL_GREETING, null), 500);
    }
  }, []);

  const items = mockItems.filter((i) => !i.archived_at);
  const activeItem = items.find((i) => i.id === activeItemId) ?? null;
  const activeSession = mockSessions[0];

  const timerDisplay = useMemo(() => {
    if (!activeItem) return "00:00:00";
    const startTime = taskStartTimes[activeItem.id];
    const elapsedMs = (taskElapsedMs[activeItem.id] ?? 0) + (startTime ? now - startTime : 0);
    return formatHMS(Math.max(0, Math.floor(elapsedMs / 1000)));
  }, [taskStartTimes, taskElapsedMs, activeItem, now]);

  const remainingDisplay = activeItem
    ? `${activeItem.total_goal - activeItem.done_units} / ${activeItem.total_goal} ${activeItem.unit}`
    : "— / —";

  const todayEffortPct = useMemo(() => {
    const logged = mockProgressLogs.reduce((s, l) => s + l.amount, 0);
    return Math.min(100, (logged / mockSettings.daily_target_hours) * 100);
  }, []);

  const suggestedNextItem = items.find((i) => i.status !== "done" && i.id !== activeItemId) ?? null;
  const running = !!activeItem;

  const stopCurrentTask = () => {
    if (!activeItem) return;
    const startTime = taskStartTimes[activeItem.id];
    if (!startTime) return;

    const elapsedMs = Date.now() - startTime;
    setTaskElapsedMs((prev) => ({
      ...prev,
      [activeItem.id]: (prev[activeItem.id] ?? 0) + elapsedMs,
    }));
    setTaskStartTimes((prev) => {
      const next = { ...prev };
      delete next[activeItem.id];
      return next;
    });
  };

  const handleStartTask = (itemId: string) => {
    if (activeItem && activeItem.id !== itemId) stopCurrentTask();
    setActiveItemId(itemId);
    setTaskStartTimes((prev) => prev[itemId] ? prev : { ...prev, [itemId]: Date.now() });
  };

  const handleOrbClick = () => {
    if (running && activeItem) {
      stopCurrentTask();
      const startTime = taskStartTimes[activeItem.id];
      if (startTime) {
        const elapsedHours = (Date.now() - startTime) / 3600000;
        console.log(`[Mock] Stopped ${activeItem.title}: ${elapsedHours.toFixed(2)}h logged`);
      }
      setActiveItemId(null);
    }
  };
  const handleStartPause = () => {
    if (running && activeItem) {
      stopCurrentTask();
      setActiveItemId(null);
    } else if (suggestedNextItem) {
      handleStartTask(suggestedNextItem.id);
    }
  };

  const handleSwitchTask = (slot: number) => {
    const others = items.filter((i) => !activeItem || i.id !== activeItem.id);
    if (others[slot]) {
      if (activeItem && activeItem.id !== others[slot].id) stopCurrentTask();
      setActiveItemId(others[slot].id);
      setTaskStartTimes((prev) => ({ ...prev, [others[slot].id]: Date.now() }));
    }
  };
  const handleFocusInput = () => inputRef.current?.focus();
  const handleCloseChat = () => { setFocusMode(false); inputRef.current?.blur(); };

  useKeyboardShortcuts({
    running,
    chatOpen: focusMode,
    onStartPause: handleStartPause,
    onSwitchTask: handleSwitchTask,
    onFocusInput: handleFocusInput,
    onCloseChat: handleCloseChat,
  });

  const mentionList = useMemo(() => ([
    ...mockFolders.map((f) => ({ id: f.id, type: "folder" as const, label: f.title })),
    ...mockItems.map((i) => ({ id: i.id, type: "item" as const, label: i.title })),
  ]), []);

  const handleSend = () => {
    const text = input.trim();
    if (!text || processing) return;
    addUserMessage(text, mentions.map((m) => m.id));
    setInput("");
    setOrbitTyping(true);
    setProcessing(true);
    setTimeout(() => {
      addAssistantMessage(
        `I am tracking your focus on <strong>${activeItem?.title ?? "your tasks"}</strong>. Keep up the great work!`,
        null,
      );
      setOrbitTyping(false);
      setProcessing(false);
    }, 700 + Math.random() * 400);
  };

  return (
    <div className="ai-home">
      <AIOrbStage
        items={items}
        activeItem={activeItem}
        running={running}
        timerDisplay={timerDisplay}
        remainingDisplay={remainingDisplay}
        todayEffortPct={todayEffortPct}
        suggestedNextItem={suggestedNextItem}
        focusMode={focusMode}
        dateLabel={new Date(MOCK_NOW).toLocaleDateString("en-US", { day: "numeric", month: "long" })}
        onSelectTask={handleStartTask}
        onOrbClick={handleOrbClick}
      />

      <div className="msg-area">
        {messages.map((m) => (
          <div key={m.id} className={`msg-bubble ${m.role}`}>
            {m.role === "assistant" && (
              <div className="msg-icon">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
            )}
            <div className="msg-text" dangerouslySetInnerHTML={{ __html: m.content }} />
          </div>
        ))}
        {orbitTyping && (
          <div className="msg-bubble orbit">
            <div className="msg-icon">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {pickerOpen && (
        <div className="mention-picker">
          <div className="mention-picker-title">Mention</div>
          {mentionList.slice(0, 8).map((m) => (
            <button
              key={m.id}
              className="mention-option"
              onClick={() => { addMention(m); setPickerOpen(false); }}
            >
              {m.label}
              <span>{m.type}</span>
            </button>
          ))}
        </div>
      )}

      <form className="ask-bar" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        {mentions.length > 0 && (
          <div className="mention-chips" style={{ position: "absolute", top: -28, left: 0 }}>
            {mentions.map((m) => (
              <span key={m.id} className="mention-chip">
                @{m.label}
                <button type="button" onClick={() => removeMention(m.id)}>×</button>
              </span>
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocusMode(true)}
          onBlur={() => { if (!input.trim()) setFocusMode(false); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask Orbit…"
        />
        <button type="button" className="ib plain" onClick={() => setPickerOpen(true)} aria-label="Mention">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
        </button>
        <button type="submit" className="ib" disabled={!input.trim() || processing} aria-label="Send">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
    </div>
  );
}