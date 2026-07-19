"use client"

import { useEffect } from "react"

const RIPPLE_DURATION = 420
const RIPPLE_SELECTOR = "button:not([data-ripple-skip]), [data-slot='button']:not([data-ripple-skip])"

function getRippleTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null

  const rippleTarget = target.closest(RIPPLE_SELECTOR) as HTMLElement | null
  if (!rippleTarget) return null

  if (rippleTarget instanceof HTMLButtonElement && rippleTarget.disabled) return null
  if (rippleTarget.getAttribute("aria-disabled") === "true") return null

  return rippleTarget
}

function getRippleColor(target: HTMLElement) {
  const computed = window.getComputedStyle(target)
  return (
    computed.getPropertyValue("--magicui-ripple-color").trim() ||
    computed.getPropertyValue("--ripple-color").trim() ||
    (document.documentElement.classList.contains("dark")
      ? "rgba(167, 139, 250, 0.25)"
      : "rgba(139, 92, 246, 0.18)")
  )
}

function spawnRipple(target: HTMLElement, x: number, y: number) {
  const rect = target.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2.2
  const ripple = document.createElement("span")

  ripple.setAttribute("aria-hidden", "true")
  ripple.className = "magicui-ripple-wave"
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x - rect.left}px`
  ripple.style.top = `${y - rect.top}px`
  ripple.style.background = getRippleColor(target)
  ripple.style.boxShadow = `0 0 0 1px ${getRippleColor(target)}`
  ripple.style.zIndex = "0"

  target.dataset.rippleActive = "true"
  target.insertBefore(ripple, target.firstChild)

  const release = window.setTimeout(() => {
    delete target.dataset.rippleActive
  }, RIPPLE_DURATION)

  const cleanup = window.setTimeout(() => {
    ripple.remove()
    window.clearTimeout(release)
  }, RIPPLE_DURATION + 80)

  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove()
      window.clearTimeout(release)
      window.clearTimeout(cleanup)
      delete target.dataset.rippleActive
    },
    { once: true }
  )
}

export function RippleButtonProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return

      const target = getRippleTarget(event.target)
      if (!target) return

      spawnRipple(target, event.clientX, event.clientY)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return

      const target = getRippleTarget(document.activeElement)
      if (!target) return

      const rect = target.getBoundingClientRect()
      spawnRipple(target, rect.left + rect.width / 2, rect.top + rect.height / 2)
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("keydown", onKeyDown, true)

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("keydown", onKeyDown, true)
    }
  }, [])

  return null
}
