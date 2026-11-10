"use client";

import { useEffect } from "react";

interface ShortcutConfig {
  running: boolean;
  chatOpen: boolean;
  onStartPause: () => void;
  onSwitchTask: (slot: number) => void;
  onFocusInput: () => void;
  onCloseChat: () => void;
}

export function useKeyboardShortcuts({
  running,
  chatOpen,
  onStartPause,
  onSwitchTask,
  onFocusInput,
  onCloseChat,
}: ShortcutConfig) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (isTyping) {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          onStartPause();
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          onSwitchTask(parseInt(e.key) - 1);
          break;
        case "/":
          e.preventDefault();
          onFocusInput();
          break;
        case "Escape":
          onCloseChat();
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [running, chatOpen, onStartPause, onSwitchTask, onFocusInput, onCloseChat]);
}