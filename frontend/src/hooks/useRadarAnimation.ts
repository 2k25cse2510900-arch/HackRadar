"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { radarConfig } from "@/lib/radar/radarConfig";

export function useRadarAnimation() {
  const reduceMotion = useReducedMotion();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      setElapsedMs(now - start);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  const sweepAngle = reduceMotion
    ? 240
    : ((elapsedMs % radarConfig.rotationDurationMs) / radarConfig.rotationDurationMs) * 360;

  return {
    elapsedMs,
    sweepAngle,
    reduceMotion: Boolean(reduceMotion),
  };
}
