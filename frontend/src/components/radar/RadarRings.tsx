"use client";

import { motion, useReducedMotion } from "framer-motion";

import { radarConfig } from "@/lib/radar/radarConfig";
import { cn } from "@/lib/utils";

type RadarRingsProps = {
  dark: boolean;
  className?: string;
};

export function RadarRings({ dark, className }: RadarRingsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {Array.from({ length: radarConfig.ringCount }).map((_, index) => {
        const size = 18 + index * 11.5;
        const opacity = dark ? 0.08 + index * 0.012 : 0.07 + index * 0.01;

        return (
          <motion.div
            key={`ring-${index}`}
            className="absolute rounded-full border"
            style={{
              inset: `${size}%`,
              borderColor: dark ? `rgba(196,181,253,${opacity})` : `rgba(139,92,246,${opacity})`,
              boxShadow:
                index === radarConfig.ringCount - 1
                  ? dark
                    ? "0 0 0 1px rgba(167,139,250,0.05), 0 0 28px rgba(139,92,246,0.10)"
                    : "0 0 0 1px rgba(139,92,246,0.04), 0 0 24px rgba(139,92,246,0.08)"
                  : "none",
            }}
            animate={reduceMotion ? undefined : { opacity: [0.28, 0.5, 0.28], scale: [1, 1.008, 1] }}
            transition={{
              duration: 5 + index * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: index * 0.18,
            }}
          />
        );
      })}
    </div>
  );
}
