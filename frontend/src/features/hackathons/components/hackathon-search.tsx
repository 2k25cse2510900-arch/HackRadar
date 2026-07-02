"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type HackathonSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function HackathonSearch({ value, onChange }: HackathonSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search hackathons..."
        aria-label="Search hackathons"
        className="h-12 rounded-2xl pl-10 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}
