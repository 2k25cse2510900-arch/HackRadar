"use client";

import { useTheme } from "next-themes";

export function useRadarTheme() {
  const { resolvedTheme } = useTheme();
  return {
    theme: resolvedTheme === "dark" ? "dark" : "light",
    dark: resolvedTheme === "dark",
  } as const;
}
