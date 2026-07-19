"use client";

import { motion, useReducedMotion } from "framer-motion";

import { angleDistance, cityBearing, getPulseDelay, isCityHit } from "@/lib/radar/animation";
import type { RadarCity } from "@/types/radar";
import { cn } from "@/lib/utils";

import { RadarPulse } from "./RadarPulse";

type RadarGlowDotsProps = {
  cities: RadarCity[];
  sweepAngle: number;
  dark: boolean;
  activeCityId?: string | null;
  onCitySelect?: (cityId: string) => void;
  onCityHover?: (cityId: string | null) => void;
};

function labelAnchor(x: number) {
  if (x <= 35) return "left-full ml-3 text-left";
  if (x >= 65) return "right-full mr-3 text-right";
  return "left-full ml-3 text-left";
}

export function RadarGlowDots({
  cities,
  sweepAngle,
  dark,
  activeCityId = null,
  onCitySelect,
  onCityHover,
}: RadarGlowDotsProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {cities.map((city, index) => {
        const selected = city.id === activeCityId;
        const beamHit = isCityHit(city, sweepAngle);
        const emphasized = beamHit || selected;
        const delayMs = getPulseDelay(index);
        const bearing = cityBearing(city);
        const intensity = Math.max(0.65, 1 - angleDistance(bearing, sweepAngle) / 20);

        return (
          <motion.button
            key={city.id}
            type="button"
            aria-label={city.name}
            onMouseEnter={() => onCityHover?.(city.id)}
            onMouseLeave={() => onCityHover?.(null)}
            onFocus={() => onCityHover?.(city.id)}
            onBlur={() => onCityHover?.(null)}
            onClick={() => onCitySelect?.(city.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{
              left: `${city.x}%`,
              top: `${city.y}%`,
            }}
            initial={false}
            animate={
              reduceMotion
                ? undefined
                : {
                    scale: emphasized ? [1, 1.08, 1.02] : [1, 1.03, 1],
                    opacity: emphasized ? [0.92, 1, 0.92] : [0.85, 0.98, 0.85],
                  }
            }
            transition={{
              duration: emphasized ? 1.1 : 4.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <RadarPulse dark={dark} active={emphasized} delayMs={delayMs} />
            <span
              className={cn(
                "relative z-10 flex size-3.5 items-center justify-center rounded-full border",
                dark
                  ? "border-violet-100/60 bg-[radial-gradient(circle,rgba(221,214,254,0.98),rgba(167,139,250,0.9))] shadow-[0_0_0_5px_rgba(139,92,246,0.10),0_0_18px_rgba(139,92,246,0.28)]"
                  : "border-violet-100/70 bg-[radial-gradient(circle,rgba(255,255,255,0.98),rgba(167,139,250,0.92))] shadow-[0_0_0_5px_rgba(139,92,246,0.08),0_0_16px_rgba(139,92,246,0.22)]"
              )}
              style={{
                transform: `scale(${emphasized ? 1.08 + intensity * 0.08 : 1})`,
              }}
            >
              <span className={cn("size-1.5 rounded-full", dark ? "bg-white" : "bg-violet-50")} />
            </span>

            <span
              className={cn(
                "absolute top-1/2 whitespace-nowrap text-[11px] font-medium tracking-tight transition-all duration-200",
                labelAnchor(city.x),
                dark ? "text-violet-50/92 drop-shadow-[0_1px_8px_rgba(5,6,12,0.55)]" : "text-slate-700 drop-shadow-[0_1px_6px_rgba(255,255,255,0.72)]",
                emphasized ? "opacity-100" : "opacity-[0.84]"
              )}
              style={{ transform: "translateY(-50%)" }}
            >
              {city.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
