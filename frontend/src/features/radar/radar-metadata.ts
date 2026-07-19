import type { Hackathon } from "@/lib/api";

export type RadarGeoPoint = {
  city: string;
  latitude: number;
  longitude: number;
};

export type RadarHackathon = Hackathon & RadarGeoPoint;

export const radarFallbackCenter: RadarGeoPoint = {
  city: "New Delhi, India",
  latitude: 28.6139,
  longitude: 77.209,
};

export const radarDefaultCenter = radarFallbackCenter;

export const radarRadiusOptions = [50, 100, 250, 500, 1000] as const;

export const radarGeoById: Record<string, RadarGeoPoint> = {
  "smart-india-hackathon": {
    city: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
  },
  "google-solution-challenge": {
    city: "Mountain View, USA",
    latitude: 37.3861,
    longitude: -122.0839,
  },
  "microsoft-imagine-cup": {
    city: "Redmond, USA",
    latitude: 47.673,
    longitude: -122.1215,
  },
  ethindia: {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  hackcbs: {
    city: "Delhi, India",
    latitude: 28.7041,
    longitude: 77.1025,
  },
  hacknitr: {
    city: "Rourkela, India",
    latitude: 22.2604,
    longitude: 84.8536,
  },
  hackthisfall: {
    city: "Ahmedabad, India",
    latitude: 23.0225,
    longitude: 72.5714,
  },
  "jpmorgan-code-for-good": {
    city: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
  },
  "nasa-space-apps": {
    city: "Washington, DC, USA",
    latitude: 38.9072,
    longitude: -77.0369,
  },
  hackmit: {
    city: "Cambridge, USA",
    latitude: 42.3736,
    longitude: -71.1097,
  },
  "mlh-global-hack-week": {
    city: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
  },
  angelhack: {
    city: "San Francisco, USA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  "hack2skill-events": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "hack-the-future-devfolio": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "walmart-sparkathon": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "flipkart-grid": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "adobe-india-hackathon": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "unstop-challenges": {
    city: "Gurugram, India",
    latitude: 28.4595,
    longitude: 77.0266,
  },
  "hack-with-india": {
    city: "Hyderabad, India",
    latitude: 17.385,
    longitude: 78.4867,
  },
  "techkriti-hackathon": {
    city: "Kanpur, India",
    latitude: 26.4499,
    longitude: 80.3319,
  },
  "hackathon-by-hackerearth": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "devpost-hackathons": {
    city: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
  },
  "hackerearth-open-challenges": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "hackathon-radar-community": {
    city: "Bengaluru, India",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  "opensource-sprint": {
    city: "Amsterdam, Netherlands",
    latitude: 52.3676,
    longitude: 4.9041,
  },
};

export function enrichRadarHackathons(hackathons: Hackathon[]) {
  return hackathons
    .map((hackathon) => {
      const geo = radarGeoById[hackathon.id];
      if (!geo) return null;
      return {
        ...hackathon,
        ...geo,
      };
    })
    .filter((hackathon): hackathon is RadarHackathon => Boolean(hackathon));
}
