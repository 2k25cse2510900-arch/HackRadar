import type { RadarGeoPoint } from "./radar-metadata";

export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function angleDistance(a: number, b: number) {
  const delta = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(delta, 360 - delta);
}

export function haversineDistanceKm(origin: RadarGeoPoint, target: RadarGeoPoint) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(target.latitude - origin.latitude);
  const dLon = toRadians(target.longitude - origin.longitude);

  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(target.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function bearingDegrees(origin: RadarGeoPoint, target: RadarGeoPoint) {
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(target.latitude);
  const lon1 = toRadians(origin.longitude);
  const lon2 = toRadians(target.longitude);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return normalizeAngle(toDegrees(Math.atan2(y, x)));
}

export function destinationPoint(origin: RadarGeoPoint, distanceKm: number, bearing: number): RadarGeoPoint {
  const earthRadiusKm = 6371;
  const angularDistance = distanceKm / earthRadiusKm;
  const bearingRadians = toRadians(bearing);
  const lat1 = toRadians(origin.latitude);
  const lon1 = toRadians(origin.longitude);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinAngularDistance = Math.sin(angularDistance);
  const cosAngularDistance = Math.cos(angularDistance);

  const latitude = Math.asin(
    sinLat1 * cosAngularDistance + cosLat1 * sinAngularDistance * Math.cos(bearingRadians)
  );
  const longitude =
    lon1 +
    Math.atan2(
      Math.sin(bearingRadians) * sinAngularDistance * cosLat1,
      cosAngularDistance - sinLat1 * Math.sin(latitude)
    );

  return {
    city: origin.city,
    latitude: toDegrees(latitude),
    longitude: ((toDegrees(longitude) + 540) % 360) - 180,
  };
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
}
