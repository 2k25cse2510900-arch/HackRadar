"use client";

import { motion, useReducedMotion } from "framer-motion";

import { radarConfig } from "@/lib/radar/radarConfig";
import { cn } from "@/lib/utils";

type RadarSweepProps = {
  dark: boolean;
  sweepAngle: number;
  className?: string;
};

export function RadarSweep({ dark, sweepAngle, className }: RadarSweepProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-0 z-20", className)}
      style={{ transformOrigin: "50% 50%" }}
      animate={reduceMotion ? undefined : { rotate: sweepAngle }}
      transition={reduceMotion ? undefined : { duration: 0, ease: "linear" }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: dark
            ? `conic-gradient(from 270deg, rgba(139,92,246,0) 0deg, rgba(167,139,250,0.02) ${360 - radarConfig.sweepTailDeg}deg, rgba(221,214,254,0.88) ${360 - radarConfig.sweepWidthDeg}deg, rgba(167,139,250,0.15) ${360 - 8}deg, rgba(139,92,246,0) 360deg)`
            : `conic-gradient(from 270deg, rgba(139,92,246,0) 0deg, rgba(167,139,250,0.02) ${360 - radarConfig.sweepTailDeg}deg, rgba(139,92,246,0.82) ${360 - radarConfig.sweepWidthDeg}deg, rgba(167,139,250,0.12) ${360 - 8}deg, rgba(139,92,246,0) 360deg)`,
          clipPath: "circle(50% at 50% 50%)",
          filter: "blur(0.8px) saturate(1.06)",
          opacity: 0.9,
          mixBlendMode: dark ? "screen" : "multiply",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2 h-[148%] w-[148%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: dark
            ? "linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(167,139,250,0.10) 22%, rgba(221,214,254,0.88) 50%, rgba(167,139,250,0.10) 78%, rgba(139,92,246,0) 100%)"
            : "linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(167,139,250,0.08) 22%, rgba(139,92,246,0.82) 50%, rgba(167,139,250,0.08) 78%, rgba(139,92,246,0) 100%)",
          clipPath: "polygon(0% 48%, 100% 34%, 100% 66%, 0% 52%)",
          filter: "blur(14px)",
          opacity: 0.58,
          mixBlendMode: dark ? "screen" : "multiply",
          transformOrigin: "50% 50%",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2 size-10 rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          background: dark
            ? "radial-gradient(circle, rgba(221,214,254,0.96), rgba(167,139,250,0.7) 42%, rgba(99,102,241,0.12) 76%)"
            : "radial-gradient(circle, rgba(255,255,255,0.98), rgba(196,181,253,0.78) 42%, rgba(139,92,246,0.16) 76%)",
          boxShadow: dark
            ? "0 0 0 10px rgba(139,92,246,0.06), 0 0 28px rgba(139,92,246,0.22)"
            : "0 0 0 10px rgba(139,92,246,0.04), 0 0 22px rgba(139,92,246,0.16)",
          backdropFilter: "blur(12px)",
        }}
      />
    </motion.div>
  );
}
