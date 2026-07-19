"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";

import { RadarPulse } from "./RadarPulse";
import type { RadarHackathonMarker } from "@/types/radar";
import { cn } from "@/lib/utils";

type HackathonLayerProps = {
  markers: RadarHackathonMarker[];
  dark: boolean;
  activeId?: string | null;
  onSelect?: (id: string) => void;
};

export function HackathonLayer({ markers, dark, activeId = null, onSelect }: HackathonLayerProps) {
  const reduceMotion = useReducedMotion();

  if (!markers.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[22]">
      {markers.map((marker, index) => {
        const active = marker.id === activeId;

        return (
          <motion.button
            key={marker.id}
            type="button"
            aria-label={marker.name}
            onClick={() => onSelect?.(marker.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: active ? [1, 1.06, 1.02] : [1, 1.02, 1],
                    opacity: active ? [0.8, 1, 0.8] : [0.62, 0.88, 0.62],
                  }
            }
            transition={{
              duration: active ? 1.1 : 5.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: (index % 5) * 0.14,
            }}
          >
            <RadarPulse dark={dark} active={active} delayMs={index * 180} className="inset-[-14px]" />
            <span
              className={cn(
                "relative z-10 flex size-3 items-center justify-center rounded-full border",
                dark
                  ? "border-violet-100/60 bg-violet-300/90 shadow-[0_0_0_4px_rgba(139,92,246,0.08),0_0_14px_rgba(139,92,246,0.24)]"
                  : "border-violet-200/80 bg-violet-500/90 shadow-[0_0_0_4px_rgba(139,92,246,0.05),0_0_12px_rgba(139,92,246,0.18)]"
              )}
            >
              <Zap className={cn("size-1.5", dark ? "text-white" : "text-violet-50")} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
