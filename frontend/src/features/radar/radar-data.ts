import { listHackathons, type Hackathon } from "@/lib/api";

import { bearingDegrees, formatDistance, haversineDistanceKm } from "./radar-utils";
import { enrichRadarHackathons, type RadarGeoPoint, type RadarHackathon } from "./radar-metadata";

export type RadarDetection = RadarHackathon & {
  bearing: number;
  distanceKm: number;
  inRadius: boolean;
  signalStrength: number;
  visibility: number;
};

export type RadarSummary = {
  detectedCount: number;
  hiddenCount: number;
  onlineCount: number;
  offlineCount: number;
  averageDistanceLabel: string;
  nearest?: RadarDetection;
  signalStrength: number;
};

export async function loadRadarHackathons() {
  const hackathons = await listHackathons().catch(() => [] as Hackathon[]);
  return enrichRadarHackathons(hackathons);
}

export function buildRadarDetections(
  hackathons: RadarHackathon[],
  origin: RadarGeoPoint,
  radiusKm: number
) {
  return hackathons
    .map<RadarDetection>((hackathon) => {
      const distanceKm = haversineDistanceKm(origin, hackathon);
      const bearing = bearingDegrees(origin, hackathon);
      const inRadius = distanceKm <= radiusKm;
      const visibility = inRadius
        ? Math.max(0.52, 1 - distanceKm / Math.max(radiusKm * 1.18, 1))
        : Math.max(0.18, 0.38 - (distanceKm - radiusKm) / Math.max(radiusKm * 6, 1));

      const signalStrength = Math.round(
        Math.min(
          100,
          (inRadius ? 62 : 26) +
            (hackathon.status === "Live" ? 12 : 0) +
            (hackathon.mode === "Online" ? 8 : 0) +
            (hackathon.mode === "Hybrid" ? 6 : 0) +
            Math.max(0, 22 - Math.min(distanceKm / 3, 22))
        )
      );

      return {
        ...hackathon,
        bearing,
        distanceKm,
        inRadius,
        signalStrength,
        visibility,
      };
    })
    .sort((a, b) => {
      if (a.inRadius !== b.inRadius) return a.inRadius ? -1 : 1;
      if (a.signalStrength !== b.signalStrength) return b.signalStrength - a.signalStrength;
      return a.distanceKm - b.distanceKm;
    });
}

export function buildRadarSummary(detections: RadarDetection[]): RadarSummary {
  const detected = detections.filter((detection) => detection.inRadius);
  const onlineCount = detected.filter((detection) => detection.mode !== "Offline").length;
  const offlineCount = detected.filter((detection) => detection.mode !== "Online").length;
  const averageDistance =
    detected.length > 0
      ? detected.reduce((sum, detection) => sum + detection.distanceKm, 0) / detected.length
      : 0;
  const nearest = detected[0];
  const hiddenCount = detections.length - detected.length;
  const signalStrength =
    detected.length > 0
      ? Math.min(
          100,
          Math.round(
            detected.length / Math.max(1, detections.length / 1.8) * 30 +
              (nearest?.signalStrength ?? 0) * 0.7
          )
        )
      : 12;

  return {
    detectedCount: detected.length,
    hiddenCount,
    onlineCount,
    offlineCount,
    averageDistanceLabel: detected.length > 0 ? formatDistance(averageDistance) : "0 km",
    nearest,
    signalStrength,
  };
}
