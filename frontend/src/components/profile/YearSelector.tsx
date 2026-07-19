"use client";

import { Input } from "@/components/ui/input";
import { ProfileCombobox } from "@/components/profile/ProfileCombobox";
import { degreeYearHelperText, degreeYearOptions } from "@/lib/constants/degreeYears";

type YearSelectorProps = {
  degree: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function YearSelector({ degree, value, onValueChange, disabled = false, className }: YearSelectorProps) {
  const helperText = degreeYearHelperText[degree];
  const options = degree ? degreeYearOptions[degree] ?? degreeYearOptions.Other : [];
  const isManualYear = degree === "Other";
  const isDisabled = disabled || !degree;

  return (
    <div className={className}>
      {isManualYear ? (
        <Input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder="Enter your current academic year"
          disabled={isDisabled}
        />
      ) : (
        <ProfileCombobox
          value={value}
          onValueChange={onValueChange}
          options={options}
          placeholder={isDisabled ? "Select degree first" : "Year"}
          searchPlaceholder="Search years"
          emptyMessage="No year found."
          disabled={isDisabled}
        />
      )}

      {helperText ? <p className="mt-2 text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
