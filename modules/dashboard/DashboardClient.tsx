"use client";

import React from "react";
import Banner from "./Banner";
import DailySummary from "./DailySummary";
import ActiveTimer from "./ActiveTimer";
import TaskGrid from "./TaskGrid";
import OrbitStage from "@/modules/orbit/OrbitStage";
import { mockItems, mockSessions, mockProgressLogs, mockSettings, MOCK_NOW } from "@/lib/mock/data";

export default function DashboardClient() {
  const items = mockItems.filter((i) => !i.archived_at);
  const activeSession = mockSessions[0];
  const activeItem = items.find((i) => i.id === activeSession?.item_id) ?? null;

  // Today's logged hours (mock: 4.5h)
  const todayLogged = mockProgressLogs.reduce((sum, l) => sum + l.amount, 0);
  const targetHours = mockSettings.daily_target_hours;

  // Pace: simple mock — 2.0 units/day for now
  const pace = 2.0;

  const dateLabel = new Date(MOCK_NOW).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <Banner />
      <DailySummary loggedHours={todayLogged} targetHours={targetHours} />
      <ActiveTimer session={activeSession} item={activeItem} />
      <OrbitStage
        items={items}
        dateLabel={dateLabel}
        todayLogged={todayLogged}
        pace={pace}
      />
      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Active Tasks &amp; Goals</h3>
      <TaskGrid items={items} todayLogged={todayLogged} pace={pace} />
    </>
  );
}
