"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

type RadarMapProps = {
  dark: boolean;
  className?: string;
};

export function RadarMap({ dark, className }: RadarMapProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={dark ? "/assets/radar/india-dark.png" : "/assets/radar/india-light.png"}
        alt="India map radar surface"
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-contain object-center"
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          dark
            ? "bg-[radial-gradient(circle_at_center,rgba(17,17,26,0)_0%,rgba(7,7,12,0.18)_58%,rgba(5,6,12,0.42)_100%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(245,243,255,0.10)_64%,rgba(233,229,247,0.24)_100%)]"
        )}
      />
    </div>
  );
}
