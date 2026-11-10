import type { Session, ProgressLog, PlanEntry, ChatMessage } from "@/lib/types";

export const mockItemSessions: Session[] = [
    {
        id: "session-1",
        item_id: "item-1",
        started_at: new Date(Date.parse("2026-11-06T18:00:15+05:00")).toISOString(),
        paused_at: null,
        paused_seconds: 0,
        ended_at: null,
    },
    {
        id: "session-2",
        item_id: "item-1",
        started_at: "2026-11-06T10:00:00+05:00",
        paused_at: null,
        paused_seconds: 0,
        ended_at: "2026-11-06T12:30:00+05:00",
    },
    {
        id: "session-3",
        item_id: "item-1",
        started_at: "2026-11-05T15:00:00+05:00",
        paused_at: null,
        paused_seconds: 0,
        ended_at: "2026-11-05T17:00:00+05:00",
    },
];

export const mockItemProgressLogs: ProgressLog[] = [
    { id: "log-1", item_id: "item-1", amount: 2.5, logged_at: "2026-11-06T10:00:00+05:00", source: "manual", note: "Chapter 4 morning session" },
    { id: "log-4", item_id: "item-1", amount: 1.0, logged_at: "2026-11-05T16:00:00+05:00", source: "ai", note: "Orbit logged: completed 1 lecture" },
    { id: "log-5", item_id: "item-1", amount: 2.0, logged_at: "2026-11-04T14:00:00+05:00", source: "manual", note: "Chapter 3 review" },
    { id: "log-6", item_id: "item-1", amount: 1.5, logged_at: "2026-11-03T11:00:00+05:00", source: "manual", note: null },
];

export const mockPlanEntries: PlanEntry[] = [
    { id: "plan-1", item_id: "item-1", date: "2026-11-06", planned_amount: 2.0, done: true },
    { id: "plan-2", item_id: "item-1", date: "2026-11-07", planned_amount: 2.0, done: false },
    { id: "plan-3", item_id: "item-1", date: "2026-11-08", planned_amount: 2.0, done: false },
    { id: "plan-4", item_id: "item-1", date: "2026-11-09", planned_amount: 2.0, done: false },
];

export const mockChanges = [
    { id: "chg-1", source: "manual" as const, action_type: "mark_progress", payload: { amount: 1.0 }, previous_state: { done_units: 17 }, message_id: null, undone: false, created_at: "2026-11-06T14:00:00+05:00" },
    { id: "chg-2", source: "ai" as const, action_type: "mark_progress", payload: { amount: 1.0 }, previous_state: { done_units: 16 }, message_id: "msg-2", undone: false, created_at: "2026-11-05T16:00:00+05:00" },
    { id: "chg-3", source: "manual" as const, action_type: "set_deadline", payload: { due_date: "2026-11-22" }, previous_state: { due_date: "2026-11-30" }, message_id: null, undone: false, created_at: "2026-11-04T09:00:00+05:00" },
    { id: "chg-4", source: "manual" as const, action_type: "create_item", payload: { title: "Database Systems" }, previous_state: null, message_id: null, undone: false, created_at: "2026-10-15T10:00:00+05:00" },
];

export const mockItemChat: ChatMessage[] = [
    {
        id: "msg-1",
        role: "user",
        content: "Completed 1 lecture of DBMS",
        mentions: ["item-1"],
        proposal: null,
        proposal_status: null,
        created_at: "2026-11-05T16:00:00+05:00",
    },
    {
        id: "msg-2",
        role: "assistant",
        content: "Logged 1.0 hour to Database Systems. New total: 18 / 30 hours.",
        mentions: ["item-1"],
        proposal: null,
        proposal_status: null,
        created_at: "2026-11-05T16:00:01+05:00",
    },
];
