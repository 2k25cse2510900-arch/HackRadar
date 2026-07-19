"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { Input } from "@/components/ui/input";
import { colleges } from "@/lib/constants/colleges";
import { cn } from "@/lib/utils";

type CollegeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function CollegeSelector({
  value,
  onValueChange,
  disabled = false,
  placeholder = "College",
  className,
}: CollegeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filteredColleges = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return colleges;
    return colleges.filter((college) => college.toLowerCase().includes(query));
  }, [search]);

  const selectCollege = (college: string) => {
    onValueChange(college);
    setOpen(false);
    setSearch("");
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredColleges.length) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filteredColleges.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filteredColleges.length) % filteredColleges.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedCollege = filteredColleges[activeIndex];
      if (selectedCollege) {
        selectCollege(selectedCollege);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setSearch("");
          setActiveIndex(0);
        }
      }}
    >
      <Popover.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 text-left text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary-border focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn("truncate", value ? "text-foreground" : "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-3xl border border-border bg-surface p-3 shadow-[0_24px_60px_rgba(0,0,0,0.12)] outline-none"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            window.requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
          }}
        >
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search colleges"
              aria-label="Search colleges"
              className="h-10 rounded-2xl pl-10"
              role="searchbox"
            />
          </div>

          <div id={listboxId} className="mt-3 max-h-72 overflow-y-auto pr-1" role="listbox" aria-label="College options">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college, index) => {
                const active = index === activeIndex;
                const selected = college === value;

                return (
                  <button
                    key={college}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectCollege(college)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                      active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/70"
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{college}</span>
                    {selected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-sm text-muted-foreground">No college found.</div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
