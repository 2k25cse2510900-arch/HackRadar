"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { Input } from "@/components/ui/input";
import { phoneCountries } from "@/lib/constants/phoneCountries";
import { cn } from "@/lib/utils";

type PhoneNumberInputProps = {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  disabled?: boolean;
};

export function PhoneNumberInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  disabled = false,
}: PhoneNumberInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const selectedCountry = phoneCountries.find((country) => country.dialCode === countryCode) ?? phoneCountries[0];

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return phoneCountries;
    return phoneCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.toLowerCase().includes(query) ||
      country.flag.toLowerCase().includes(query)
    );
  }, [search]);
  const safeActiveIndex = filteredCountries.length ? Math.min(activeIndex, filteredCountries.length - 1) : -1;

  const selectCountry = (dialCode: string) => {
    onCountryCodeChange(dialCode);
    setOpen(false);
    setSearch("");
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (!filteredCountries.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % filteredCountries.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + filteredCountries.length) % filteredCountries.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selected = filteredCountries[safeActiveIndex];
      if (selected) {
        selectCountry(selected.dialCode);
      }
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(10rem,11rem)_1fr]">
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
            disabled={disabled}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 text-left text-sm text-foreground outline-none transition-all duration-200 focus:border-primary-border focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="truncate">{selectedCountry.dialCode}</span>
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
                placeholder="Search countries"
                aria-label="Search countries"
                className="h-10 rounded-2xl pl-10"
              />
            </div>

            <div id={listboxId} className="mt-3 max-h-72 overflow-y-auto pr-1" role="listbox" aria-label="Countries">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => {
                  const selected = country.dialCode === countryCode;

                  return (
                    <button
                      key={`${country.name}-${country.dialCode}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectCountry(country.dialCode)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                        index === safeActiveIndex ? "bg-muted text-foreground" : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
                        <span className="text-base leading-none">{country.flag}</span>
                        <span className="truncate">{country.name}</span>
                        <span className="shrink-0 text-muted-foreground">{country.dialCode}</span>
                      </span>
                      {selected ? <Check className="size-4 shrink-0 text-primary" /> : null}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-sm text-muted-foreground">No country found.</div>
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Input
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={phoneNumber}
        onChange={(event) => onPhoneNumberChange(event.target.value)}
        placeholder="Phone Number"
        disabled={disabled}
      />
    </div>
  );
}
