"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RadarOverviewModalProps = {
  dark: boolean;
};

export function RadarOverviewModal({ dark }: RadarOverviewModalProps) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={dark ? "border-white/10 bg-slate-950/96 text-white sm:max-w-[520px]" : "sm:max-w-[520px]"}
        style={{
          borderRadius: "20px",
          padding: "28px",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <DialogHeader className="w-full items-center text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">Radar Overview</DialogTitle>
            <DialogDescription className={dark ? "max-w-md text-base leading-7 text-violet-100/75" : "max-w-md text-base leading-7"}>
              Welcome to HackRadar&apos;s intelligent radar.
            </DialogDescription>
          </DialogHeader>

          <div className={dark ? "mt-5 max-w-md text-sm leading-7 text-violet-50/80" : "mt-5 max-w-md text-sm leading-7 text-muted-foreground"}>
            This page currently showcases a demo visualization of our upcoming AI-powered radar system.
            In future updates, you&apos;ll be able to discover nearby hackathons, receive AI recommendations, track live events,
            and explore opportunities based on your real-time location.
          </div>

          <div className="mt-8 flex w-full justify-center">
            <Button type="button" onClick={() => setOpen(false)} className="h-11 px-6">
              Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
