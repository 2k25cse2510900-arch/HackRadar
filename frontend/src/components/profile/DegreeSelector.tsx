"use client";

import { ProfileCombobox } from "@/components/profile/ProfileCombobox";
import { degrees } from "@/lib/constants/degrees";

type DegreeSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function DegreeSelector({ value, onValueChange, disabled = false, className }: DegreeSelectorProps) {
  return (
    <ProfileCombobox
      value={value}
      onValueChange={onValueChange}
      options={[...degrees]}
      placeholder="Degree"
      searchPlaceholder="Search degrees"
      emptyMessage="No degree found."
      disabled={disabled}
      className={className}
    />
  );
}
