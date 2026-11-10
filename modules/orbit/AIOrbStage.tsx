"use client";

import React, { useEffect, useMemo, useRef } from "react";
import type { Item } from "@/lib/types";
import { accentHex } from "@/lib/colors";

interface Props {
  items: Item[];
  activeItem: Item | null;
  running: boolean;
  timerDisplay: string;
  remainingDisplay: string;
  todayEffortPct: number;
  suggestedNextItem?: Item | null;
  focusMode: boolean;
  dateLabel: string;
  onSelectTask: (itemId: string) => void;
  onOrbClick: () => void;
}

interface Mote { x: number; y: number; vx: number; vy: number; r: number; a: number; c: number; }
interface Ripple { x: number; y: number; min: number; max: number; t0: number; rgb: number[]; }
interface BurstP { x: number; y: number; vx: number; vy: number; life: number; r: number; rgb: number[]; }

const BLOCK: number[][] = [[94, 234, 212], [251, 191, 36], [191, 219, 254], [240, 171, 252]];
const EMBER: number[][] = [[251, 191, 36], [240, 171, 252]];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const mix = (a: number[], b: number[], k: number) => [Math.round(a[0] + (b[0] - a[0]) * k), Math.round(a[1] + (b[1] - a[1]) * k), Math.round(a[2] + (b[2] - a[2]) * k)];
function hexToRgb(hex: string): number[] { return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]; }

export default function AIOrbStage(props: Props) {
  const { items, activeItem, running, timerDisplay, remainingDisplay, todayEffortPct, suggestedNextItem, focusMode, dateLabel, onSelectTask, onOrbClick } = props;

  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLButtonElement>(null);
  const orbBRef = useRef<HTMLButtonElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const s = useRef(0), vel = useRef(0);
  const mx = useRef(0), my = useRef(0), tx = useRef(0), ty = useRef(0);
  const hasPtr = useRef(false);
  const motes = useRef<Mote[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const burst = useRef<BurstP[]>([]);
  const hov = useRef([0, 0, 0, 0]), hv = useRef([0, 0, 0, 0]);
  const lastRef = useRef(0), rafRef = useRef(0);
  const W = useRef(0), H = useRef(0), dpr = useRef(1), narrow = useRef(false), R = useRef(85), spread = useRef(140);

  const lowPerf = typeof navigator !== 'undefined' && typeof window !== 'undefined' && (
    (navigator.hardwareConcurrency ?? 8) <= 8 ||
    ((navigator as any).deviceMemory ?? 8) <= 8 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const MOTE_COUNT = lowPerf ? 6 : 35;
  const FRAME_CAP = lowPerf ? 24 : 60;

  const chipItems = useMemo(
    () => items.filter((i) => !activeItem || i.id !== activeItem.id).slice(0, 4),
    [items, activeItem?.id],
  );

  // Center helpers
  const cx = () => { const z = zoneRef.current; return z ? z.offsetLeft + z.offsetWidth / 2 : 0; };
  const cy = () => { const z = zoneRef.current; return z ? z.offsetTop + z.offsetHeight / 2 : 0; };

  // --- Canvas drawing ---
  function bez(u: number, p0: number[], c: number[], p2: number[]) {
    const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u;
    return [a * p0[0] + b * c[0] + d * p2[0], a * p0[1] + b * c[1] + d * p2[1]];
  }

  function drawMotes(ctx: CanvasRenderingContext2D, t: number, dt: number) {
    for (let i = 0; i < motes.current.length; i++) {
      const m = motes.current[i];
      if (!lowPerf) {
        const dx = m.x - mx.current, dy = m.y - my.current, d2 = dx * dx + dy * dy;
        if (d2 < 16900 && d2 > 0) { const d = Math.sqrt(d2), f = (130 - d) / 130 * 90 * dt; m.x += dx / d * f; m.y += dy / d * f; }
        m.x += m.vx * dt; m.y += m.vy * dt;
        if (m.x < -10) m.x = W.current + 10; if (m.x > W.current + 10) m.x = -10; if (m.y < -10) m.y = H.current + 10; if (m.y > H.current + 10) m.y = -10;
      }
      const tw = lowPerf ? 1 : .65 + .35 * Math.sin(t * 1.5 + i);
      ctx.fillStyle = `rgba(${BLOCK[m.c]},${(m.a * tw).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
    }
  }

  function drawThreads(ctx: CanvasRenderingContext2D, t: number, ox: number, oy: number, sc: number, sr: number) {
    if (running) return;
    const sh = stageRef.current!.getBoundingClientRect();
    const visibleChips = chipRefs.current.filter(c => c && c.isConnected);
    for (let j = 0; j < visibleChips.length; j++) {
      const chip = visibleChips[j]; if (!chip) continue;
      const r = chip.getBoundingClientRect(), left = j < 2;
      const ax = (left ? r.right : r.left) - sh.left, ay = r.top - sh.top + r.height / 2;
      const ocx = left ? ox - spread.current * sc : ox + spread.current * sc;
      const a = Math.atan2(ay - oy, ax - ocx), rad = sr + 4;
      const p0 = [ocx + Math.cos(a) * rad, oy + Math.sin(a) * rad], p2 = [ax, ay];
      const mxp = (p0[0] + p2[0]) / 2, myp = (p0[1] + p2[1]) / 2, d2 = (mx.current - mxp) * (mx.current - mxp) + (my.current - myp) * (my.current - myp);
      const pull = lowPerf ? 0 : .38 * Math.max(0, 1 - Math.sqrt(d2) / 320);
      const cp = [mxp + (mx.current - mxp) * pull + (lowPerf ? 0 : Math.sin(t * .9 + j) * 4), myp + 24 + (my.current - myp) * pull + (lowPerf ? 0 : Math.cos(t * .7 + j) * 4)];
      hv.current[j] += (hov.current[j] - hv.current[j]) * .12;
      const rgb = hexToRgb(accentHex(chipItems[j]?.color ?? 'blue'));
      ctx.lineWidth = 1 + hv.current[j] * 1.4; ctx.strokeStyle = `rgba(${rgb},${(.38 + hv.current[j] * .5).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(cp[0], cp[1], p2[0], p2[1]); ctx.stroke();
      for (let k = 1; k <= 3; k++) {
        const u = k / 4, p = bez(u, p0, cp, p2), br = 1.8 + 2.4 * Math.sin(u * Math.PI) + hv.current[j] * 1.2;
        ctx.fillStyle = `rgba(${rgb},.85)`;
        ctx.beginPath(); ctx.arc(p[0], p[1], br, 0, 6.2832); ctx.fill();
      }
    }
  }

  function rays(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, N: number, k: number, t: number, dir: number, colorFn: (i: number) => number[]) {
    const base = (narrow.current ? 22 : 36) * k, bump = (narrow.current ? 30 : 56) * k, mA = Math.atan2(my.current - y, mx.current - x);
    const d2 = (mx.current - x) * (mx.current - x) + (my.current - y) * (my.current - y);
    const inf = lowPerf ? 0 : .4 + .6 * Math.max(0, 1 - Math.sqrt(d2) / 520);
    ctx.lineWidth = 2;
    for (let i = 0; i < N; i++) {
      const ang = i / N * 6.2832 + (lowPerf ? 0 : t * .05 * dir);
      const da = Math.atan2(Math.sin(ang - mA), Math.cos(ang - mA));
      const bb = Math.pow(Math.max(0, Math.cos(da)), 5) * inf;
      const len = base * (.7 + .3 * (lowPerf ? 1 : Math.sin(t * 1.4 + i * 1.7))) + bump * bb;
      const cs = Math.cos(ang), sn = Math.sin(ang), r0 = rad + 8;
      const x1 = x + cs * (r0 + len), y1 = y + sn * (r0 + len), rgb = colorFn(i);
      ctx.strokeStyle = `rgba(${rgb},${(.6 * Math.min(1, k)).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(x + cs * r0, y + sn * r0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.fillStyle = `rgba(${rgb},${Math.min(.95, k).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x1, y1, (2 + 2.2 * bb) * Math.min(1, k), 0, 6.2832); ctx.fill();
    }
  }

  function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, frac: number, rgb: number[], alpha: number) {
    ctx.lineCap = 'round'; ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(255,255,255,${(.12 * alpha).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.stroke();
    ctx.strokeStyle = `rgba(${rgb},${(.95 * alpha).toFixed(3)})`;
    ctx.beginPath(); ctx.arc(x, y, r, -1.5708, -1.5708 + 6.2832 * frac); ctx.stroke();
  }

  function frame(ctx: CanvasRenderingContext2D, t: number, dt: number) {
    ctx.clearRect(0, 0, W.current, H.current);

    if (lowPerf) {
      drawMotes(ctx, t, dt);
      return;
    }

    const ox = cx(), oy = cy(), sc = clamp(s.current, 0, 1.06), k = clamp(s.current, 0, 1);
    const rA = R.current * (1.18 - .18 * sc), rB = R.current * Math.max(0, sc);
    drawMotes(ctx, t, dt);
    if (!narrow.current) drawThreads(ctx, t, ox, oy, sc, R.current * (1.18 - .18 * k));
    const actHex = accentHex(activeItem?.color ?? 'blue');
    const act = hexToRgb(actHex);
    rays(ctx, ox - spread.current * sc, oy, rA, 16, 1, t, 1, (i) => mix(BLOCK[Math.floor(i / 4) % 4], act, k));
    if (k > .03) rays(ctx, ox + spread.current * sc, oy, rB, 14, k, t, -1, (i) => EMBER[i % 2]);
    if (k > .03) {
      const frac = ((Date.now() / 1000) % 60) / 60;
      ring(ctx, ox - spread.current * sc, oy, rA + (narrow.current ? 20 : 24), frac % 1, act, k);
      ring(ctx, ox + spread.current * sc, oy, rB + (narrow.current ? 20 : 24), (activeItem ? activeItem.done_units / activeItem.total_goal : 0), [251, 191, 36], k);
      // 3rd ring: today's effort
      ring(ctx, ox - spread.current * sc, oy, rA + (narrow.current ? 28 : 36), todayEffortPct / 100, [94, 234, 212], k);
    }
    for (let i = burst.current.length - 1; i >= 0; i--) {
      const b = burst.current[i]; b.life -= dt * .9;
      if (b.life <= 0) { burst.current.splice(i, 1); continue; }
      b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= .97; b.vy *= .97;
      ctx.fillStyle = `rgba(${b.rgb},${(b.life * .8).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fill();
    }
    for (let n = ripples.current.length - 1; n >= 0; n--) {
      const r = ripples.current[n], p = (t - r.t0) / 1.4;
      if (p < 0) continue;
      if (p >= 1) { ripples.current.splice(n, 1); continue; }
      const e = 1 - Math.pow(1 - p, 3);
      ctx.strokeStyle = `rgba(${r.rgb},${((1 - p) * .6).toFixed(3)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.min + (r.max - r.min) * e, 0, 6.2832); ctx.stroke();
    }
  }

  function doBurst() {
    if (lowPerf) return;
    const t = performance.now() / 1000;
    ripples.current.push({ x: cx(), y: cy(), min: R.current, max: R.current * 3.4, t0: t, rgb: BLOCK[0] }, { x: cx(), y: cy(), min: R.current, max: R.current * 2.6, t0: t + .12, rgb: BLOCK[1] });
    for (let i = 0; i < 12; i++) {
      const an = rnd(0, 6.2832), sp = rnd(60, 180);
      burst.current.push({ x: cx(), y: cy(), vx: Math.cos(an) * sp, vy: Math.sin(an) * sp, life: 1, r: rnd(1.8, 3.5), rgb: BLOCK[i % 4] });
    }
  }

  // --- Animation loop ---
  useEffect(() => {
    const cv = canvasRef.current!, ctx = cv.getContext('2d')!;
    const stage = stageRef.current!;

    function setStaticLayout() {
      const focusScale = focusMode ? 0.88 : 1;
      const sc = running ? 1 : 0;
      const xA = -spread.current * sc * focusScale;
      const xB = spread.current * sc * focusScale;
      const scA = (1.18 - .18 * sc) * focusScale;

      if (orbARef.current) {
        orbARef.current.style.transform = `translate3d(${xA.toFixed(2)}px,0,0) scale(${scA.toFixed(3)}) perspective(600px) rotateX(0deg) rotateY(0deg)`;
        orbARef.current.style.setProperty('--s', sc.toFixed(3));
        orbARef.current.style.setProperty('--hx', '35%');
        orbARef.current.style.setProperty('--hy', '28%');
        orbARef.current.style.setProperty('--tx', '0px');
        orbARef.current.style.setProperty('--ty', '0px');
      }
      if (orbBRef.current) {
        orbBRef.current.style.transform = `translate3d(${xB.toFixed(2)}px,0,0) scale(${Math.max(0, sc).toFixed(3)}) perspective(600px) rotateX(0deg) rotateY(0deg)`;
        orbBRef.current.style.opacity = sc.toFixed(3);
        orbBRef.current.style.pointerEvents = sc > 0.6 ? 'auto' : 'none';
        orbBRef.current.style.setProperty('--hx', '35%');
        orbBRef.current.style.setProperty('--hy', '28%');
        orbBRef.current.style.setProperty('--tx', '0px');
        orbBRef.current.style.setProperty('--ty', '0px');
      }
      if (capRef.current) {
        capRef.current.style.setProperty('--xa', xA.toFixed(2) + 'px');
        capRef.current.style.setProperty('--capy', (R.current * scA + 16).toFixed(1) + 'px');
      }
    }

    function resize() {
      dpr.current = Math.min(window.devicePixelRatio || 1, lowPerf ? 1 : 1.5);
      W.current = stage.clientWidth; H.current = stage.clientHeight;
      cv.width = Math.round(W.current * dpr.current); cv.height = Math.round(H.current * dpr.current);
      ctx.setTransform(dpr.current, 0, 0, dpr.current, 0, 0);
      narrow.current = window.innerWidth <= 760;
      R.current = orbARef.current ? orbARef.current.offsetWidth / 2 : 85;
      spread.current = narrow.current ? 85 : 140;
      if (!motes.current.length) for (let i = 0; i < MOTE_COUNT; i++) motes.current.push({ x: rnd(0, W.current), y: rnd(0, H.current), vx: rnd(-6, 6), vy: rnd(-9, -2), r: rnd(.8, 2.2), a: rnd(.15, .45), c: i % 4 });
      if (!mx.current && !my.current) { mx.current = tx.current = W.current / 2; my.current = ty.current = H.current / 2; }
      if (lowPerf) setStaticLayout();
    }

    function loop(now: number) {
      const t = now / 1000;
      if (lowPerf) {
        frame(ctx, t, 1 / 30);
        return;
      }
      const delta = t - lastRef.current || 0.016;
      if (delta < 1 / FRAME_CAP) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(.05, delta); lastRef.current = t;
      const ox = cx(), oy = cy();
      if (!hasPtr.current) { tx.current = ox + Math.cos(t * .5) * 260; ty.current = oy + Math.sin(t * .7) * 160 + 60; }
      mx.current += (tx.current - mx.current) * .09; my.current += (ty.current - my.current) * .09;

      const target = running ? 1 : 0;
      vel.current += ((target - s.current) * 95 - vel.current * 11) * dt; s.current += vel.current * dt;
      const sc = clamp(s.current, 0, 1.06), k = clamp(s.current, 0, 1);
      const focusScale = focusMode ? 0.88 : 1;
      const xA = -spread.current * sc * focusScale, xB = spread.current * sc * focusScale, scA = (1.18 - .18 * sc) * focusScale;

      const dxA = clamp((mx.current - (ox + xA)) / W.current, -.5, .5), dyA = clamp((my.current - oy) / H.current, -.5, .5);
      const dxB = clamp((mx.current - (ox + xB)) / W.current, -.5, .5);
      if (orbARef.current) {
        orbARef.current.style.transform = `translate3d(${xA.toFixed(2)}px,0,0) scale(${scA.toFixed(3)}) perspective(600px) rotateX(${(-dyA * 28).toFixed(2)}deg) rotateY(${(dxA * 28).toFixed(2)}deg)`;
        orbARef.current.style.setProperty('--s', k.toFixed(3));
        orbARef.current.style.setProperty('--hx', (35 + dxA * 45).toFixed(1) + '%');
        orbARef.current.style.setProperty('--hy', (28 + dyA * 45).toFixed(1) + '%');
        orbARef.current.style.setProperty('--tx', (dxA * 9).toFixed(2) + 'px');
        orbARef.current.style.setProperty('--ty', (dyA * 9).toFixed(2) + 'px');
      }
      if (orbBRef.current) {
        orbBRef.current.style.transform = `translate3d(${xB.toFixed(2)}px,0,0) scale(${Math.max(0, sc).toFixed(3)}) perspective(600px) rotateX(${(-dyA * 28).toFixed(2)}deg) rotateY(${(dxB * 28).toFixed(2)}deg)`;
        orbBRef.current.style.opacity = k.toFixed(3);
        orbBRef.current.style.pointerEvents = k > .6 ? 'auto' : 'none';
        orbBRef.current.style.setProperty('--hx', (35 + dxB * 45).toFixed(1) + '%');
        orbBRef.current.style.setProperty('--hy', (28 + dyA * 45).toFixed(1) + '%');
        orbBRef.current.style.setProperty('--tx', (dxB * 9).toFixed(2) + 'px');
        orbBRef.current.style.setProperty('--ty', (dyA * 9).toFixed(2) + 'px');
      }
      if (capRef.current) {
        capRef.current.style.setProperty('--xa', xA.toFixed(2) + 'px');
        capRef.current.style.setProperty('--capy', (R.current * scA + 16).toFixed(1) + 'px');
      }

      // Chip parallax
      const DEPTH = [1, 1.25, 1.1, .85];
      for (let j = 0; j < chipRefs.current.length; j++) {
        const c = chipRefs.current[j]; if (!c) continue;
        if (narrow.current) { c.style.removeProperty('--px'); c.style.removeProperty('--py'); continue; }
        c.style.setProperty('--px', (-(mx.current - W.current / 2) * .025 * DEPTH[j]).toFixed(2) + 'px');
        c.style.setProperty('--py', (-(my.current - H.current / 2) * .025 * DEPTH[j]).toFixed(2) + 'px');
      }

      frame(ctx, t, dt);
      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    const ro = new ResizeObserver(resize); ro.observe(stage);
    if (lowPerf) {
      frame(ctx, performance.now() / 1000, 1 / 30);
      return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [running, focusMode, todayEffortPct, activeItem?.id]);

  // Pointer tracking
  useEffect(() => {
    if (lowPerf) return;
    function onMove(e: PointerEvent) {
      const r = stageRef.current!.getBoundingClientRect();
      tx.current = e.clientX - r.left; ty.current = e.clientY - r.top; hasPtr.current = true;
    }
    function onLeave() { hasPtr.current = false; }
    stageRef.current!.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      stageRef.current?.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [lowPerf]);

  // Burst on start
  useEffect(() => {
    if (running) doBurst();
  }, [running]);

  // Focus mode: fade chip columns
  useEffect(() => {
    if (leftColRef.current) leftColRef.current.classList.toggle('faded', focusMode);
    if (rightColRef.current) rightColRef.current.classList.toggle('faded', focusMode);
  }, [focusMode]);

  // Click on stage (ripples)
  function onStagePointerDown(e: React.PointerEvent) {
    if (lowPerf) return;
    const r = stageRef.current!.getBoundingClientRect(), t = performance.now() / 1000;
    const o = (e.target as HTMLElement).closest('.orb');
    if (o) {
      const x = cx() + (o === orbBRef.current ? spread.current * clamp(s.current, 0, 1) : -spread.current * clamp(s.current, 0, 1));
      ripples.current.push({ x, y: cy(), min: R.current, max: R.current * 2.6, t0: t, rgb: BLOCK[Math.floor(rnd(0, 4))] });
    } else if (!(e.target as HTMLElement).closest('.orb-chip,.ask-bar,.msg-area')) {
      ripples.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, min: 4, max: 130, t0: t, rgb: BLOCK[Math.floor(rnd(0, 4))] });
    }
  }

  return (
    <div className={`ai-orb-stage${lowPerf ? ' low-spec' : ''}`} ref={stageRef} onPointerDown={onStagePointerDown}>
      <canvas ref={canvasRef} className="ai-orb-canvas" />

      <div className="orb-zone" ref={zoneRef}>
        <button className="orb orb-a" ref={orbARef} type="button" onClick={onOrbClick} aria-label="Your Orbit">
          <span className="orb-layer orb-layer-home">
            <span className="orb-hint">{dateLabel}</span>
            <span className="orb-title">Your Orbit</span>
          </span>
          <span className="orb-layer orb-layer-timer">
            <span className="orb-title">{activeItem?.title ?? 'Task'}</span>
            <span className="orb-time">{timerDisplay}</span>
          </span>
        </button>
        <button className="orb orb-b" ref={orbBRef} type="button" tabIndex={-1} aria-label="Remaining">
          <span className="orb-layer">
            <span className="orb-big">{remainingDisplay}</span>
            <span className="orb-tiny">Remaining</span>
          </span>
        </button>
        <div className="orb-cap" ref={capRef}>
          {running ? activeItem?.title : suggestedNextItem ? `Suggested: ${suggestedNextItem.title}` : 'Press a subject to start'}
        </div>
      </div>

      <div className="orb-col orb-col-left" ref={leftColRef}>
        {chipItems.slice(0, 2).map((item, idx) => (
          <button
            key={item.id}
            className="orb-chip"
            ref={(el) => { chipRefs.current[idx] = el; }}
            onClick={() => onSelectTask(item.id)}
            onPointerEnter={() => hov.current[idx] = 1}
            onPointerLeave={() => hov.current[idx] = 0}
            style={{ ['--c' as any]: accentHex(item.color), ['--d' as any]: `${.1 + idx * .12}s` }}
          >
            <span className="orb-chip-dot" />
            <span className="orb-chip-name">{item.title}</span>
            <svg className="orb-chip-play" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 1.8 L10 6 L2.5 10.2 Z" />
            </svg>
          </button>
        ))}
      </div>
      <div className="orb-col orb-col-right" ref={rightColRef}>
        {chipItems.slice(2, 4).map((item, idx) => {
          const j = idx + 2;
          return (
            <button
              key={item.id}
              className="orb-chip"
              ref={(el) => { chipRefs.current[j] = el; }}
              onClick={() => onSelectTask(item.id)}
              onPointerEnter={() => hov.current[j] = 1}
              onPointerLeave={() => hov.current[j] = 0}
              style={{ ['--c' as any]: accentHex(item.color), ['--d' as any]: `${.1 + j * .12}s` }}
            >
              <span className="orb-chip-dot" />
              <span className="orb-chip-name">{item.title}</span>
              <svg className="orb-chip-play" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M2.5 1.8 L10 6 L2.5 10.2 Z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}