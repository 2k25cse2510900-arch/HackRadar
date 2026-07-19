export type RadarThemeMode = "light" | "dark";

export type RadarCity = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
  markerColor?: string;
};

export type RadarMapPoint = {
  x: number;
  y: number;
  label?: string;
};

export type RadarHackathonMarker = RadarMapPoint & {
  id: string;
  name: string;
  city?: string;
  subtitle?: string;
  intensity?: number;
};

export type RadarUserLocation = RadarMapPoint & {
  id: string;
  label: string;
};

export type RadarThemeColors = {
  grid: string;
  ring: string;
  sweep: string;
  sweepTail: string;
  glow: string;
  marker: string;
  markerGlow: string;
  panel: string;
};
