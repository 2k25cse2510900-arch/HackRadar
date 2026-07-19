"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useTheme } from "next-themes"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleButtonProps = Omit<
  ComponentPropsWithoutRef<typeof AnimatedThemeToggler>,
  "theme" | "onThemeChange"
>

export function ThemeToggleButton({
  className,
  children,
  ...props
}: ThemeToggleButtonProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <AnimatedThemeToggler
      theme={theme}
      onThemeChange={setTheme}
      className={buttonVariants({
        variant: "ghost",
        size: "icon",
        className: cn("transition-colors duration-200 hover:bg-muted/70", className),
      })}
      {...props}
    >
      {children}
    </AnimatedThemeToggler>
  )
}
