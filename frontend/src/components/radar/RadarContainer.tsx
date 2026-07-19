"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Radar as RadarIcon, Signal, Sparkles, Target } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { ProfileCompletionGate } from "@/components/auth/profile-completion-gate";
import { RadarOverviewModal } from "@/components/radar/RadarOverviewModal";
import { useRadarAnimation } from "@/hooks/useRadarAnimation";
import { useRadarTheme } from "@/hooks/useRadarTheme";
import { radarCities } from "@/lib/radar/cities";
import { projectGeoPointToRadar } from "@/lib/radar/animation";
import { cn } from "@/lib/utils";
import { loadRadarHackathons, buildRadarDetections, buildRadarSummary } from "@/features/radar/radar-data";
import { radarFallbackCenter, type RadarGeoPoint, type RadarHackathon } from "@/features/radar/radar-metadata";

import { RadarScene } from "./RadarScene";
import type { RadarHackathonMarker } from "@/types/radar";

const radarRadiusOptions = [50, 100, 250, 500] as const;

function formatLocation(origin: RadarGeoPoint, mode: "live" | "fallback") {
  if (mode === "live") {
    return `${origin.latitude.toFixed(4)}, ${origin.longitude.toFixed(4)}`;
  }

  return origin.city;
}

function useCountUp(target: number, duration = 850) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [duration, target]);

  return count;
}

function InfoCard({
  icon,
  label,
  value,
  subtext,
  dark,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subtext?: string;
  dark: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border px-4 py-3 shadow-[0_10px_28px_rgba(31,25,48,0.06)] backdrop-blur-2xl",
        dark
          ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,14,22,0.9),rgba(9,9,16,0.72))]"
          : "border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,244,255,0.82))]"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-2xl border",
            dark ? "border-white/10 bg-white/5 text-violet-200" : "border-border bg-background text-primary"
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className={cn("text-[11px] font-medium uppercase tracking-[0.18em]", dark ? "text-violet-100/55" : "text-muted-foreground")}>
            {label}
          </p>
          <p className={cn("mt-1 text-lg font-semibold tracking-tight", dark ? "text-white" : "text-foreground")}>{value}</p>
          {subtext ? <p className={cn("mt-1 text-xs leading-5", dark ? "text-violet-100/55" : "text-muted-foreground")}>{subtext}</p> : null}
        </div>
      </div>
    </div>
  );
}

function RadarSidebar({
  summary,
  locationLabel,
  radarStateLabel,
  loadingHackathons,
  radiusKm,
  onRadiusChange,
  dark,
}: {
  summary: ReturnType<typeof buildRadarSummary>;
  locationLabel: string;
  radarStateLabel: string;
  loadingHackathons: boolean;
  radiusKm: number;
  onRadiusChange: (radiusKm: number) => void;
  dark: boolean;
}) {
  const nearbyCount = useCountUp(summary.detectedCount);
  const signalStrength = useCountUp(summary.signalStrength);

  return (
    <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <InfoCard
        icon={<MapPin className="size-4" />}
        label="Current Location"
        value={locationLabel}
        subtext={loadingHackathons ? "Resolving geolocation" : "Browser geolocation active"}
        dark={dark}
      />
      <InfoCard
        icon={<Target className="size-4" />}
        label="Nearby Hackathons"
        value={nearbyCount}
        subtext={`Within ${radiusKm} km`}
        dark={dark}
      />
      <InfoCard
        icon={<RadarIcon className="size-4" />}
        label="Radius"
        value={`${radiusKm} km`}
        subtext="Refine the scan range"
        dark={dark}
      />
      <InfoCard
        icon={<Signal className="size-4" />}
        label="Status"
        value={radarStateLabel}
        subtext="Continuous scan"
        dark={dark}
      />

      <div
        className={cn(
          "rounded-[1.5rem] border px-4 py-4 shadow-[0_10px_28px_rgba(31,25,48,0.06)] backdrop-blur-2xl sm:col-span-2 lg:col-span-1",
          dark
            ? "border-white/10 bg-[linear-gradient(180deg,rgba(14,14,22,0.9),rgba(9,9,16,0.72))]"
            : "border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,244,255,0.82))]"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("size-4", dark ? "text-violet-200" : "text-primary")} />
            <p className={cn("text-[11px] font-medium uppercase tracking-[0.18em]", dark ? "text-violet-100/55" : "text-muted-foreground")}>
              Signal
            </p>
          </div>
          <span className={cn("text-sm font-semibold", dark ? "text-white" : "text-foreground")}>{signalStrength}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(196,181,253,0.72),rgba(139,92,246,1),rgba(99,102,241,0.82))]"
            initial={{ width: 0 }}
            animate={{ width: `${signalStrength}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
        <p className={cn("mt-3 text-xs leading-5", dark ? "text-violet-100/55" : "text-muted-foreground")}>
          Average detected distance:{" "}
          <span className={cn("font-medium", dark ? "text-white" : "text-foreground")}>{summary.averageDistanceLabel}</span>
        </p>

        <div className="mt-4">
          <p className={cn("text-[11px] font-medium uppercase tracking-[0.18em]", dark ? "text-violet-100/55" : "text-muted-foreground")}>
            Radius Presets
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {radarRadiusOptions.map((option) => {
              const active = option === radiusKm;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onRadiusChange(option)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? dark
                        ? "border-violet-300/20 bg-violet-300/12 text-white shadow-[0_8px_20px_rgba(139,92,246,0.10)]"
                        : "border-violet-300/20 bg-violet-300/10 text-primary shadow-[0_8px_20px_rgba(139,92,246,0.08)]"
                      : dark
                        ? "border-white/10 bg-white/5 text-violet-100/70 hover:border-violet-300/20 hover:bg-white/10 hover:text-white"
                        : "border-border/70 bg-background/75 text-foreground hover:border-violet-300/20 hover:bg-violet-300/8"
                  )}
                  aria-pressed={active}
                >
                  {option} km
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function RadarContainer() {
  const { dark } = useRadarTheme();
  const { sweepAngle } = useRadarAnimation();
  const [hackathons, setHackathons] = useState<RadarHackathon[]>([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [radiusKm, setRadiusKm] = useState(250);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<RadarGeoPoint>(radarFallbackCenter);
  const [locationMode, setLocationMode] = useState<"loading" | "live" | "fallback">("loading");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const data = await loadRadarHackathons();
        if (active) {
          setHackathons(data);
        }
      } finally {
        if (active) {
          setLoadingHackathons(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      window.setTimeout(() => {
        if (active) {
          setLocationMode("fallback");
        }
      }, 0);
      return () => {
        active = false;
      };
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!active) return;
        setOrigin({
          city: "Live location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationMode("live");
      },
      () => {
        if (!active) return;
        setOrigin(radarFallbackCenter);
        setLocationMode("fallback");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 12000,
      }
    );

    return () => {
      active = false;
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const detections = useMemo(() => buildRadarDetections(hackathons, origin, radiusKm), [hackathons, origin, radiusKm]);
  const summary = useMemo(() => buildRadarSummary(detections), [detections]);
  const locationLabel = formatLocation(origin, locationMode === "live" ? "live" : "fallback");
  const radarStateLabel = locationMode === "live" ? "Live" : locationMode === "fallback" ? "Fallback" : "Locating";
  const activeCityId = selectedCityId ?? hoveredCityId;
  const activeHackathonId = selectedHackathonId;

  const userLocation = useMemo(() => {
    const projected = projectGeoPointToRadar(origin.latitude, origin.longitude);
    return {
      x: projected.x,
      y: projected.y,
      label: locationMode === "live" ? "Live location" : "Current location",
    };
  }, [locationMode, origin.latitude, origin.longitude]);

  const hackathonMarkers = useMemo<RadarHackathonMarker[]>(
    () =>
      detections
        .filter((detection) => detection.inRadius)
        .slice(0, 8)
        .map((detection) => {
          const projected = projectGeoPointToRadar(detection.latitude, detection.longitude);
          return {
            id: detection.id,
            name: detection.name,
            city: detection.city,
            subtitle: detection.status,
            x: projected.x,
            y: projected.y,
            intensity: detection.signalStrength / 100,
          };
        }),
    [detections]
  );

  const selectedDetection = activeHackathonId
    ? detections.find((detection) => detection.id === activeHackathonId) ?? null
    : null;

  return (
    <ProfileCompletionGate>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-16">
          <section className="px-4 py-4 sm:px-6 lg:px-8">
            <RadarOverviewModal dark={dark} />
            <div className="mx-auto max-w-3xl pb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Radar
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                AI-powered geography radar for discovering hackathons around your location.
              </p>
            </div>

            <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <RadarScene
                  dark={dark}
                  sweepAngle={sweepAngle}
                  cities={radarCities}
                  userLocation={userLocation}
                  hackathonMarkers={hackathonMarkers}
                  activeCityId={activeCityId}
                  activeHackathonId={activeHackathonId}
                  onCitySelect={setSelectedCityId}
                  onCityHover={setHoveredCityId}
                  onHackathonSelect={setSelectedHackathonId}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                className="grid gap-4"
              >
                <RadarSidebar
                  summary={summary}
                  locationLabel={locationLabel}
                  radarStateLabel={selectedDetection ? `${selectedDetection.name}` : radarStateLabel}
                  loadingHackathons={loadingHackathons}
                  radiusKm={radiusKm}
                  onRadiusChange={setRadiusKm}
                  dark={dark}
                />
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </ProfileCompletionGate>
  );
}
