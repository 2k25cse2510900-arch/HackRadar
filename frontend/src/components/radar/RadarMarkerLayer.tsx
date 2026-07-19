"use client";

import type { RadarCity, RadarHackathonMarker, RadarMapPoint } from "@/types/radar";

import { HackathonLayer } from "./HackathonLayer";
import { RadarGlowDots } from "./RadarGlowDots";
import { UserLocationLayer } from "./UserLocationLayer";

type RadarMarkerLayerProps = {
  cities: RadarCity[];
  sweepAngle: number;
  dark: boolean;
  activeCityId?: string | null;
  userLocation: RadarMapPoint;
  hackathonMarkers: RadarHackathonMarker[];
  onCitySelect?: (cityId: string) => void;
  onCityHover?: (cityId: string | null) => void;
  activeHackathonId?: string | null;
  onHackathonSelect?: (id: string) => void;
};

export function RadarMarkerLayer({
  cities,
  sweepAngle,
  dark,
  activeCityId,
  userLocation,
  hackathonMarkers,
  onCitySelect,
  onCityHover,
  activeHackathonId,
  onHackathonSelect,
}: RadarMarkerLayerProps) {
  return (
    <>
      <RadarGlowDots
        cities={cities}
        sweepAngle={sweepAngle}
        dark={dark}
        activeCityId={activeCityId}
        onCitySelect={onCitySelect}
        onCityHover={onCityHover}
      />
      <UserLocationLayer point={userLocation} dark={dark} />
      <HackathonLayer markers={hackathonMarkers} dark={dark} activeId={activeHackathonId} onSelect={onHackathonSelect} />
    </>
  );
}
