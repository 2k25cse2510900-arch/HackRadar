import type { RadarCity } from "@/types/radar";

export const radarCities: RadarCity[] = [
  { id: "delhi", name: "Delhi", latitude: 28.6139, longitude: 77.209, x: 39.5, y: 27.5 },
  { id: "kanpur", name: "Kanpur", latitude: 26.4499, longitude: 80.3319, x: 52.0, y: 38.5 },
  { id: "lucknow", name: "Lucknow", latitude: 26.8467, longitude: 80.9462, x: 54.6, y: 35.8 },
  { id: "jaipur", name: "Jaipur", latitude: 26.9124, longitude: 75.7873, x: 33.0, y: 33.2 },
  { id: "ahmedabad", name: "Ahmedabad", latitude: 23.0225, longitude: 72.5714, x: 24.5, y: 50.2 },
  { id: "mumbai", name: "Mumbai", latitude: 19.076, longitude: 72.8777, x: 21.0, y: 72.0 },
  { id: "pune", name: "Pune", latitude: 18.5204, longitude: 73.8567, x: 26.8, y: 78.8 },
  { id: "hyderabad", name: "Hyderabad", latitude: 17.385, longitude: 78.4867, x: 48.8, y: 81.2 },
  { id: "bangalore", name: "Bangalore", latitude: 12.9716, longitude: 77.5946, x: 42.0, y: 94.8 },
  { id: "chennai", name: "Chennai", latitude: 13.0827, longitude: 80.2707, x: 50.8, y: 94.2 },
  { id: "kolkata", name: "Kolkata", latitude: 22.5726, longitude: 88.3639, x: 76.5, y: 56.0 },
] as const;

export const radarCityIdList = radarCities.map((city) => city.id);
