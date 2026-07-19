import type { Metadata } from "next";

import { RadarPage } from "@/features/radar/radar-page";

export const metadata: Metadata = {
  title: "Radar | HackRadar",
  description: "Interactive hackathon radar for discovering opportunities on a live map.",
};

export default function RadarRoute() {
  return <RadarPage />;
}
