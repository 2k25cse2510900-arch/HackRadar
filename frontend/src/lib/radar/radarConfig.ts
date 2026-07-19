import type { RadarThemeColors } from "@/types/radar";

export const radarConfig = {
  rotationDurationMs: 6000,
  sweepWidthDeg: 34,
  sweepTailDeg: 72,
  ringCount: 5,
  glowRadiusPx: 52,
  pulseDurationMs: 2400,
  markerSizePx: 14,
  hitThresholdDeg: 8,
  mapAspectRatio: 1400 / 1085,
  overviewStorageKey: "hackradar-radar-overview-dismissed",
  indiaBounds: {
    latitudeMin: 6.0,
    latitudeMax: 36.5,
    longitudeMin: 67.0,
    longitudeMax: 97.5,
  },
  themeColors: {
    dark: {
      grid: "rgba(196,181,253,0.12)",
      ring: "rgba(196,181,253,0.18)",
      sweep: "rgba(221,214,254,0.96)",
      sweepTail: "rgba(167,139,250,0.10)",
      glow: "rgba(139,92,246,0.35)",
      marker: "rgba(221,214,254,0.94)",
      markerGlow: "rgba(139,92,246,0.36)",
      panel: "rgba(12,12,20,0.92)",
    },
    light: {
      grid: "rgba(139,92,246,0.10)",
      ring: "rgba(139,92,246,0.12)",
      sweep: "rgba(139,92,246,0.94)",
      sweepTail: "rgba(167,139,250,0.08)",
      glow: "rgba(139,92,246,0.22)",
      marker: "rgba(255,255,255,0.98)",
      markerGlow: "rgba(139,92,246,0.24)",
      panel: "rgba(255,255,255,0.94)",
    },
  } satisfies Record<"dark" | "light", RadarThemeColors>,
} as const;
