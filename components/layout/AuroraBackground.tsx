"use client";

import React, { useEffect, useRef } from "react";

export default function AuroraBackground() {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mx = useRef(0);
  const my = useRef(0);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.current = nx;
      my.current = ny;
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    const ks = [70, -90, 50, -60];
    let raf = 0;
    function loop() {
      for (let i = 0; i < blobRefs.current.length; i++) {
        const el = blobRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${(mx.current * ks[i]).toFixed(1)}px, ${(my.current * ks[i]).toFixed(1)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="aurora-bg" aria-hidden="true">
      <div className="blob b1" ref={(el) => { blobRefs.current[0] = el; }} />
      <div className="blob b2" ref={(el) => { blobRefs.current[1] = el; }} />
      <div className="blob b3" ref={(el) => { blobRefs.current[2] = el; }} />
      <div className="blob b4" ref={(el) => { blobRefs.current[3] = el; }} />
    </div>
  );
}