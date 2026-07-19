import type { AuthUser, UserProfile } from "@/lib/api";

type ProfileFields = {
  name: string;
  college: string;
  year: string;
  degree: string;
  domains: string[];
  skills: string[];
  goals: string[];
  preferredMode: string;
  availability: string;
};

function normalizeText(value: string | undefined | null) {
  return value?.trim() || "";
}

function hasSelection(values: string[] | undefined) {
  return Array.isArray(values) && values.some((value) => normalizeText(value));
}

export function isProfileSetupComplete(input?: AuthUser | UserProfile | null) {
  if (!input) return false;

  const profile = "profile" in input ? input.profile : input;

  if (!profile) return false;
  if ("profileCompleted" in input && input.profileCompleted) return true;

  const typedProfile = profile as Partial<ProfileFields>;

  return Boolean(
    normalizeText(typedProfile.name) &&
      normalizeText(typedProfile.college) &&
      normalizeText(typedProfile.year) &&
      normalizeText(typedProfile.degree) &&
      hasSelection(typedProfile.domains) &&
      hasSelection(typedProfile.skills) &&
      hasSelection(typedProfile.goals) &&
      normalizeText(typedProfile.preferredMode) &&
      normalizeText(typedProfile.availability)
  );
}
