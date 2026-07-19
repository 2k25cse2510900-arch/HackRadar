"use client";

import { radarConfig } from "@/lib/radar/radarConfig";
import { cn } from "@/lib/utils";
import type { RadarCity, RadarHackathonMarker, RadarMapPoint } from "@/types/radar";

import { RadarGrid } from "./RadarGrid";
import { RadarMap } from "./RadarMap";
import { RadarMarkerLayer } from "./RadarMarkerLayer";
import { RadarRings } from "./RadarRings";
import { RadarSweep } from "./RadarSweep";

type RadarSceneProps = {
  dark: boolean;
  sweepAngle: number;
  cities: RadarCity[];
  userLocation: RadarMapPoint;
  hackathonMarkers: RadarHackathonMarker[];
  activeCityId?: string | null;
  activeHackathonId?: string | null;
  onCitySelect?: (cityId: string) => void;
  onCityHover?: (cityId: string | null) => void;
  onHackathonSelect?: (id: string) => void;
  className?: string;
};

export function RadarScene({
  dark,
  sweepAngle,
  cities,
  userLocation,
  hackathonMarkers,
  activeCityId,
  activeHackathonId,
  onCitySelect,
  onCityHover,
  onHackathonSelect,
  className,
}: RadarSceneProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] border shadow-[0_30px_90px_rgba(31,25,48,0.12)]",
        dark
          ? "border-white/10 bg-[linear-gradient(180deg,rgba(10,10,18,0.95),rgba(7,7,12,0.88))]"
          : "border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,246,255,0.82))]",
        className
      )}
      style={{ aspectRatio: `${radarConfig.mapAspectRatio}` }}
    >
      <div className="absolute inset-0">
        <RadarMap dark={dark} />
        <RadarGrid dark={dark} />
        <RadarRings dark={dark} />
        <RadarSweep dark={dark} sweepAngle={sweepAngle} />
        <RadarMarkerLayer
          cities={cities}
          sweepAngle={sweepAngle}
          dark={dark}
          activeCityId={activeCityId}
          userLocation={userLocation}
          hackathonMarkers={hackathonMarkers}
          activeHackathonId={activeHackathonId}
          onCitySelect={onCitySelect}
          onCityHover={onCityHover}
          onHackathonSelect={onHackathonSelect}
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-28 bg-gradient-to-t from-background/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(139,92,246,0.02)_52%,rgba(139,92,246,0.06)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.02),transparent_62%)]" />
    </div>
  );
}
