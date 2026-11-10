import React from "react";
import type { Item } from "@/lib/types";
import TaskCard from "./TaskCard";

interface Props {
  items: Item[];
  todayLogged: number;
  pace: number;
}

export default function TaskGrid({ items, todayLogged, pace }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      {items.map((item) => (
        <TaskCard key={item.id} item={item} todayLogged={todayLogged} pace={pace} />
      ))}
    </div>
  );
}