export type RadarMarkerPosition = {
  id: string;
  x: number;
  y: number;
};

export type RadarViewport = {
  centerX: number;
  centerY: number;
  radiusPx: number;
  width: number;
  height: number;
  markerPositions: RadarMarkerPosition[];
};
