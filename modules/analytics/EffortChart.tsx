"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MOCK_EFFORT_7D } from "@/lib/mock/data";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function EffortChart() {
  const data = {
    labels: MOCK_EFFORT_7D.map((d) => d.day),
    datasets: [
      {
        label: "Hours",
        data: MOCK_EFFORT_7D.map((d) => d.hours),
        backgroundColor: "#00F0FF",
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0B132B",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 0.5,
        titleColor: "#F5F7FA",
        bodyColor: "#9FB0C4",
        padding: 10,
        callbacks: {
          label: (ctx: { parsed: { y: unknown } }) => `${ctx.parsed.y}h`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9FB0C4", font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9FB0C4", font: { size: 11 } },
      },
    },
  };

  return (
    <div style={{ height: 200 }}>
      <Bar data={data} options={options} />
    </div>
  );
}