"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RadarGridProps = {
  dark: boolean;
  className?: string;
};

export function RadarGrid({ dark, className }: RadarGridProps) {
  const reduceMotion = useReducedMotion();
  const ringRadii = [12, 24, 36, 48, 60];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id="radar-grid-fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={dark ? "rgba(167,139,250,0.08)" : "rgba(139,92,246,0.06)"} />
          <stop offset="50%" stopColor={dark ? "rgba(196,181,253,0.16)" : "rgba(139,92,246,0.14)"} />
          <stop offset="100%" stopColor={dark ? "rgba(167,139,250,0.08)" : "rgba(139,92,246,0.06)"} />
        </linearGradient>
      </defs>

      {ringRadii.map((radius, index) => (
        <motion.circle
          key={`radar-ring-${radius}`}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#radar-grid-fade)"
          strokeWidth="0.22"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={index === ringRadii.length - 1 ? "0" : "0.7 0.9"}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.36, 0.62, 0.36],
                }
          }
          transition={{
            duration: 5.5 + index * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
          style={{
            filter: "drop-shadow(0 0 8px rgba(139,92,246,0.06))",
          }}
        />
      ))}

      <line x1="50" y1="0" x2="50" y2="100" stroke={dark ? "rgba(196,181,253,0.08)" : "rgba(139,92,246,0.08)"} strokeWidth="0.18" />
      <line x1="0" y1="50" x2="100" y2="50" stroke={dark ? "rgba(196,181,253,0.08)" : "rgba(139,92,246,0.08)"} strokeWidth="0.18" />
      <line x1="10" y1="10" x2="90" y2="90" stroke={dark ? "rgba(196,181,253,0.05)" : "rgba(139,92,246,0.05)"} strokeWidth="0.16" />
      <line x1="90" y1="10" x2="10" y2="90" stroke={dark ? "rgba(196,181,253,0.05)" : "rgba(139,92,246,0.05)"} strokeWidth="0.16" />
      <line x1="18" y1="0" x2="82" y2="100" stroke={dark ? "rgba(196,181,253,0.03)" : "rgba(139,92,246,0.04)"} strokeWidth="0.12" />
      <line x1="82" y1="0" x2="18" y2="100" stroke={dark ? "rgba(196,181,253,0.03)" : "rgba(139,92,246,0.04)"} strokeWidth="0.12" />

      <motion.ellipse
        cx="50"
        cy="50"
        rx="31"
        ry="31"
        fill="none"
        stroke={dark ? "rgba(167,139,250,0.08)" : "rgba(139,92,246,0.10)"}
        strokeWidth="0.5"
        animate={reduceMotion ? undefined : { opacity: [0.32, 0.5, 0.32], scale: [1, 1.01, 1] }}
        transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{
          filter: "drop-shadow(0 0 16px rgba(139,92,246,0.08))",
          transformOrigin: "50% 50%",
        }}
      />

      <motion.ellipse
        cx="50"
        cy="50"
        rx="21"
        ry="21"
        fill="none"
        stroke={dark ? "rgba(167,139,250,0.07)" : "rgba(139,92,246,0.08)"}
        strokeWidth="0.42"
        strokeDasharray="1 1.6"
        animate={reduceMotion ? undefined : { opacity: [0.28, 0.46, 0.28], scale: [1, 1.005, 1] }}
        transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.2 }}
      />
    </svg>
  );
}
