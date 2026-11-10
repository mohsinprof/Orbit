import type { PlanEntry } from "@/lib/types";
import { mockItems } from "@/lib/mock/data";

// November 2026 calendar entries
// Each entry represents a planned item on a specific day
export interface CalendarEntry {
  id: string;
  day: number; // 1-30 for November 2026
  item_id: string;
  item_title: string;
  item_color: "red" | "orange" | "blue" | "white";
  planned_amount: number;
  done: boolean;
}

const itemMap = new Map(mockItems.map((i) => [i.id, i]));

export const mockCalendarEntries: CalendarEntry[] = [
  { id: "ce-1", day: 3, item_id: "item-1", item_title: "Database Systems", item_color: "blue", planned_amount: 2.0, done: true },
  { id: "ce-2", day: 5, item_id: "item-2", item_title: "Operating Systems", item_color: "orange", planned_amount: 1.5, done: true },
  { id: "ce-3", day: 6, item_id: "item-1", item_title: "Database Systems", item_color: "blue", planned_amount: 2.5, done: true },
  { id: "ce-4", day: 6, item_id: "item-2", item_title: "Operating Systems", item_color: "orange", planned_amount: 1.0, done: true },
  { id: "ce-5", day: 6, item_id: "item-3", item_title: "Algorithms", item_color: "red", planned_amount: 1.0, done: true },
  { id: "ce-6", day: 10, item_id: "item-3", item_title: "Algorithms", item_color: "red", planned_amount: 1.0, done: false },
  { id: "ce-7", day: 12, item_id: "item-1", item_title: "Database Systems", item_color: "blue", planned_amount: 2.0, done: false },
  { id: "ce-8", day: 14, item_id: "item-2", item_title: "Operating Systems", item_color: "orange", planned_amount: 2.0, done: false },
  { id: "ce-9", day: 18, item_id: "item-1", item_title: "Database Systems", item_color: "blue", planned_amount: 2.0, done: false },
  { id: "ce-10", day: 20, item_id: "item-2", item_title: "Operating Systems", item_color: "orange", planned_amount: 2.0, done: false },
  { id: "ce-11", day: 24, item_id: "item-1", item_title: "Database Systems", item_color: "blue", planned_amount: 2.5, done: false },
];

export function getEntriesForDay(day: number): CalendarEntry[] {
  return mockCalendarEntries.filter((e) => e.day === day);
}

export const CALENDAR_MONTH = {
  year: 2026,
  month: 10, // November (0-indexed)
  monthName: "November",
  totalDays: 30,
  todayDay: 6,
};

// November 1, 2026 is a Sunday.
// With Monday as week start, Sunday is column 6, so leading empties = 6.
export const LEADING_EMPTIES = 6;