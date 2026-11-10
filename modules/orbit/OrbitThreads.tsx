import React from "react";

interface Thread {
  // endpoint coordinates in stage-space (0-720 x, 0-580 y) — centre of node
  x: number;
  y: number;
}

interface Props {
  threads: Thread[];
}

// SVG viewBox matches the mockup's 720x580 stage
export default function OrbitThreads({ threads }: Props) {
  const centerX = 360;
  const centerY = 290;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
      viewBox="0 0 720 580"
      preserveAspectRatio="none"
    >
      <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8">
        {threads.map((t, idx) => {
          // Quadratic curve through midpoint toward center
          const midX = (t.x + centerX) / 2;
          const midY = (t.y + centerY) / 2;
          const dx = centerX - t.x;
          const dy = centerY - t.y;
          const perp = { x: -dy, y: dx };
          const len = Math.hypot(perp.x, perp.y) || 1;
          const offset = 30;
          const ctrlX = midX + (perp.x / len) * offset;
          const ctrlY = midY + (perp.y / len) * offset;
          return (
            <path
              key={idx}
              d={`M ${t.x} ${t.y} Q ${ctrlX} ${ctrlY} ${centerX} ${centerY}`}
            />
          );
        })}
      </g>
      <g fill="#00F0FF" stroke="#fff" strokeWidth="0.6">
        {threads.map((t, idx) => {
          const midX = (t.x + centerX) / 2;
          const midY = (t.y + centerY) / 2;
          return <circle key={idx} cx={midX} cy={midY} r="3" />;
        })}
      </g>
    </svg>
  );
}