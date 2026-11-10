export type OrbVariant =
  | "ai-idle"          // single central AI orb, no task running
  | "ai-active"        // AI orb still there but a task is running (splits with timer/remaining)
  | "timer"            // timer orb (running task counter)
  | "remaining"        // remaining-units orb (lectures/hours left)
  | "chat"             // third orb — appears when chatting during a task
  | "manual-timer";    // pure timer widget (Manual mode)

export interface OrbConfig {
  variant: OrbVariant;
  size: number;        // px
  label?: string;      // small text under orb
  primary?: string;    // main text inside orb (timer value, %, etc.)
  secondary?: string;  // smaller text under primary
  accentColor?: string;
}

export const ORB_SIZES = {
  idle: 180,
  active: 120,    // when split, each orb is smaller
  manual: 160,
};