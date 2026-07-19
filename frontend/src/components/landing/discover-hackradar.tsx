"use client";

import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DiaTextReveal({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const colors = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];

  return (
    <span className={cn("relative inline-block align-baseline", className)}>
      <span className="invisible select-none">{children}</span>
      <span aria-hidden="true" className="absolute inset-0 select-none text-primary/80">
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 select-none bg-clip-text text-transparent [WebkitBackgroundClip:text]",
          "drop-shadow-[0_0_18px_rgba(139,92,246,0.14)]"
        )}
        style={
          reduceMotion
            ? undefined
            : {
                backgroundImage: `linear-gradient(110deg, ${colors[0]} 10%, ${colors[1]} 24%, ${colors[2]} 38%, ${colors[3]} 54%, ${colors[4]} 70%, ${colors[0]} 84%)`,
                backgroundSize: "250% 100%",
                backgroundPosition: "0% 50%",
                WebkitMaskImage: "linear-gradient(115deg, transparent 34%, black 46%, black 56%, transparent 68%)",
                maskImage: "linear-gradient(115deg, transparent 34%, black 46%, black 56%, transparent 68%)",
                WebkitMaskSize: "220% 220%",
                maskSize: "220% 220%",
                willChange: "background-position",
              }
        }
        animate={
          reduceMotion
            ? undefined
            : {
                backgroundPositionX: ["0%", "100%"],
                opacity: [0.92, 1, 0.92],
              }
        }
        transition={{
          duration: 4.9,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 0.9,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function DiscoverHackRadar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.08),transparent_32%),radial-gradient(circle_at_center,rgba(167,139,250,0.06),transparent_38%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.04),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Final signal
        </p>

        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
          Discover with{" "}
          <DiaTextReveal className="text-primary">
            HackRadar
          </DiaTextReveal>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Your next hackathon, deadline, and breakthrough opportunity is already on the radar.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/hackathons">
              Explore Hackathons
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
