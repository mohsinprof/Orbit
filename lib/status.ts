import type { Item } from "@/lib/types";

export type StatusLabel = "Goal Reached" | "Daily Goal Met" | "Behind Schedule" | "On Pace";

export interface StatusResult {
  label: StatusLabel;
  isComplete: boolean;
  isBehind: boolean;
}

export function computeStatus(item: Item, pace: number, todayLogged: number): StatusResult {
  if (item.done_units >= item.total_goal) {
    return { label: "Goal Reached", isComplete: true, isBehind: false };
  }
  if (todayLogged >= item.daily_target) {
    return { label: "Daily Goal Met", isComplete: false, isBehind: false };
  }
  if (isBehindSchedule(item)) {
    return { label: "Behind Schedule", isComplete: false, isBehind: true };
  }
  return { label: "On Pace", isComplete: false, isBehind: false };
}

export function isBehindSchedule(item: Item): boolean {
  if (item.status === "done") return false;
  if (item.roll_over_hours > 2) return true;

  if (typeof window === "undefined") return false;

  if (item.due_date && new Date(item.due_date) < new Date() && item.done_units < item.total_goal) {
    return true;
  }
  return false;
}

export function percentDone(item: Item): number {
  if (item.total_goal === 0) return 0;
  return Math.min(100, Math.round((item.done_units / item.total_goal) * 100));
}

export function priorityRank(p: "high" | "medium" | "low"): number {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}

export function priorityLabel(p: "high" | "medium" | "low"): string {
  return p[0].toUpperCase() + p.slice(1);
}