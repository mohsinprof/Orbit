"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { MOCK_DISTRIBUTION } from "@/lib/mock/data";
import { accentHex } from "@/lib/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DistributionChart() {
  const data = {
    labels: MOCK_DISTRIBUTION.map((d) => d.label),
    datasets: [
      {
        data: MOCK_DISTRIBUTION.map((d) => d.value),
        backgroundColor: MOCK_DISTRIBUTION.map((d) => accentHex(d.color)),
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#F5F7FA",
          font: { size: 11 },
          boxWidth: 12,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: "#0B132B",
        borderColor: "rgba(255,255,255,0.15)",
        borderWidth: 0.5,
        titleColor: "#F5F7FA",
        bodyColor: "#9FB0C4",
        padding: 10,
        callbacks: {
          label: (ctx: { parsed: unknown; label: string }) => `${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}