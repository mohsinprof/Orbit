import type { Item } from "@/lib/types";

export interface OrbitSlot {
  x: number; // percent within stage 0-100
  y: number;
  width: number;
}

// Stage dimensions match the mockup: 720x580 max
const STAGE_W = 720;
const STAGE_H = 580;

// Corner slots (4 max) — match the HTML mockup positions
const CORNER_SLOTS: OrbitSlot[] = [
  { x: (40 / STAGE_W) * 100, y: (110 / STAGE_H) * 100, width: (180 / STAGE_W) * 100 }, // top-left
  { x: (500 / STAGE_W) * 100, y: (110 / STAGE_H) * 100, width: (180 / STAGE_W) * 100 }, // top-right
  { x: (40 / STAGE_W) * 100, y: (380 / STAGE_H) * 100, width: (200 / STAGE_W) * 100 }, // bottom-left
  { x: (480 / STAGE_W) * 100, y: (380 / STAGE_H) * 100, width: (200 / STAGE_W) * 100 }, // bottom-right
];

// For items beyond 4, spread by angle around the centre
function angleSlot(index: number, totalExtras: number): OrbitSlot {
  const angle = (Math.PI * 2 * index) / totalExtras - Math.PI / 2;
  const cx = 50, cy = 50, r = 38;
  const x = cx + Math.cos(angle) * r - 12; // -12 to roughly center the node
  const y = cy + Math.sin(angle) * r - 8;
  return { x, y, width: 22 };
}

export interface OrbitNodePlacement {
  item: Item;
  slot: OrbitSlot;
  isCorner: boolean;
}

export function layoutOrbit(items: Item[]): OrbitNodePlacement[] {
  const pinned = items.filter((i) => i.pinned && !i.archived_at);
  const placements: OrbitNodePlacement[] = [];

  pinned.slice(0, 4).forEach((item, idx) => {
    placements.push({ item, slot: CORNER_SLOTS[idx], isCorner: true });
  });

  // Extra items beyond 4 — placed by angle
  if (pinned.length > 4) {
    const extras = pinned.slice(4);
    extras.forEach((item, idx) => {
      placements.push({ item, slot: angleSlot(idx, extras.length), isCorner: false });
    });
  }

  return placements;
}