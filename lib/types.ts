// Shared domain types. Extended in A7 to support the new
// goal/progress model: Total Goal, Daily Target, Deadline days,
// Priority, Chapters, Roll-over hours.

export type GoalType = "hours" | "chapters" | "days" | "one_time";

export type ItemStatus = "todo" | "doing" | "done";

export type Priority = "high" | "medium" | "low";
export type AccentColor = "red" | "orange" | "blue" | "white" | "green" | "magenta" | "sky";

export interface Chapter {
  id: string;
  title: string;
  done: boolean;
}

export interface Folder {
  id: string;
  parent_id: string | null;
  title: string;
  color: AccentColor;
  locked: boolean;
  position: number;
  archived_at: string | null;
}

export interface Item {
  id: string;
  folder_id: string | null;
  title: string;
  // Goal & progress
  goal_type: GoalType;
  unit: string; // "hrs", "lectures", "days"
  total_units: number; // legacy field — used by existing pages (alias of total_goal)
  total_goal: number; // total units to complete (e.g. 2000 hours, 12 chapters)
  done_units: number; // current progress
  // Daily target & roll-over
  daily_target: number; // e.g. 3 (hours per day)
  roll_over_hours: number; // accumulated shortfall carried to next day
  // Deadline
  deadline_days: number | null; // e.g. 30 (finish within 30 days)
  start_date: string | null;
  due_date: string | null; // hard date computed from start + deadline_days
  target_date: string | null; // dynamic projection
  original_target_date: string | null;
  // Other
  priority: Priority;
  chapters: Chapter[];
  status: ItemStatus;
  color: AccentColor;
  pinned: boolean;
  notes: string | null;
  aliases: string[];
  position: number;
  archived_at: string | null;
  updated_at: string;
}

export interface ProgressLog {
  id: string;
  item_id: string;
  amount: number;
  logged_at: string;
  source: "ai" | "manual";
  note: string | null;
}

export interface Session {
  id: string;
  item_id: string;
  started_at: string;
  paused_at: string | null;
  paused_seconds: number;
  ended_at: string | null;
}

export interface PlanEntry {
  id: string;
  item_id: string;
  date: string;
  planned_amount: number;
  done: boolean;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  mentions: string[];
  proposal: unknown | null;
  proposal_status: "pending" | "applied" | "cancelled" | null;
  created_at: string;
}

export interface Notification {
  id: string;
  type: "deadline_soon" | "behind_schedule" | "daily_goal_met" | "proposal_waiting";
  title: string;
  body: string;
  item_id: string | null;
  scheduled_for: string;
  read_at: string | null;
}

export interface Settings {
  daily_target_hours: number;
  theme: "dark" | "light" | "system";
  timezone: string;
  week_starts_on: "monday" | "sunday";
  notifications_enabled: boolean;
  reminder_time: string;
  quiet_hours_start: string;
  quiet_hours_end: string;
  ai_model: string;
  ai_mode_enabled: boolean; // NEW: global AI/manual mode toggle
}