import { radarConfig } from "./radarConfig";
import type { RadarCity } from "@/types/radar";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function angleDistance(a: number, b: number) {
  const delta = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(delta, 360 - delta);
}

export function cityBearing(city: RadarCity) {
  const centerX = 50;
  const centerY = 50;
  const radians = Math.atan2(city.x - centerX, centerY - city.y);
  return normalizeAngle((radians * 180) / Math.PI);
}

export function isCityHit(city: RadarCity, sweepAngle: number, threshold = radarConfig.hitThresholdDeg) {
  return angleDistance(cityBearing(city), sweepAngle) <= threshold;
}

export function projectGeoPointToRadar(latitude: number, longitude: number) {
  const { latitudeMin, latitudeMax, longitudeMin, longitudeMax } = radarConfig.indiaBounds;
  const x = ((longitude - longitudeMin) / (longitudeMax - longitudeMin)) * 100;
  const y = (1 - (latitude - latitudeMin) / (latitudeMax - latitudeMin)) * 100;

  return {
    x: clamp(x, 4, 96),
    y: clamp(y, 6, 96),
  };
}

export function getPulseDelay(index: number) {
  return (index % 7) * 210;
}
