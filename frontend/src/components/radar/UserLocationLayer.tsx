"use client";

import { MapPin } from "lucide-react";

import { RadarPulse } from "./RadarPulse";
import type { RadarMapPoint } from "@/types/radar";
import { cn } from "@/lib/utils";

type UserLocationLayerProps = {
  point: RadarMapPoint;
  dark: boolean;
  label?: string;
};

export function UserLocationLayer({ point, dark, label = "Current location" }: UserLocationLayerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[25]">
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${point.x}%`, top: `${point.y}%` }}
      >
        <RadarPulse dark={dark} active className="inset-[-18px]" />
        <span
          className={cn(
            "relative z-10 flex size-4 items-center justify-center rounded-full border",
            dark
              ? "border-violet-100/70 bg-[radial-gradient(circle,rgba(221,214,254,0.98),rgba(167,139,250,0.92))] shadow-[0_0_0_8px_rgba(139,92,246,0.08),0_0_22px_rgba(139,92,246,0.34)]"
              : "border-violet-100/70 bg-[radial-gradient(circle,rgba(255,255,255,0.98),rgba(167,139,250,0.94))] shadow-[0_0_0_8px_rgba(139,92,246,0.06),0_0_20px_rgba(139,92,246,0.24)]"
          )}
        >
          <MapPin className={cn("size-2.5", dark ? "text-slate-950" : "text-violet-950")} />
        </span>
        <span
          className={cn(
            "absolute left-full ml-3 whitespace-nowrap text-[11px] font-medium tracking-tight",
            dark ? "text-violet-50/92" : "text-slate-700"
          )}
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
