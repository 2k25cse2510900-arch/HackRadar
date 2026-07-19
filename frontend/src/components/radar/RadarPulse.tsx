"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RadarPulseProps = {
  dark: boolean;
  active?: boolean;
  className?: string;
  delayMs?: number;
};

export function RadarPulse({ dark, active = false, className, delayMs = 0 }: RadarPulseProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className={cn("absolute inset-[-12px] rounded-full", className)}
      style={{
        background: dark
          ? "radial-gradient(circle, rgba(196,181,253,0.26), rgba(139,92,246,0.06) 55%, rgba(99,102,241,0) 82%)"
          : "radial-gradient(circle, rgba(139,92,246,0.18), rgba(167,139,250,0.06) 55%, rgba(99,102,241,0) 82%)",
        filter: "blur(1px)",
      }}
      initial={{ opacity: 0.55, scale: 0.72 }}
      animate={
        reduceMotion
          ? undefined
          : {
              opacity: active ? [0.7, 0.08, 0.7] : [0.6, 0, 0.6],
              scale: active ? [0.72, 1.55, 0.72] : [0.72, 1.75, 0.72],
            }
      }
      transition={{
        duration: active ? 1.15 : 1.35,
        ease: "easeOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: active ? 0.9 : 1.8,
        delay: delayMs / 1000,
      }}
    />
  );
}
