function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hasSelectedItems(values) {
  return Array.isArray(values) && values.map(normalizeText).filter(Boolean).length > 0;
}

function isProfileComplete(profile = {}) {
  return Boolean(
    normalizeText(profile.name) &&
    normalizeText(profile.college) &&
    normalizeText(profile.year) &&
    normalizeText(profile.degree) &&
    hasSelectedItems(profile.domains) &&
    hasSelectedItems(profile.skills) &&
    hasSelectedItems(profile.goals) &&
      normalizeText(profile.preferredMode) &&
      normalizeText(profile.availability)
  );
}

function stripLegacyProfileFields(profile = {}) {
  // Remove fields that are no longer part of onboarding.
  const { experienceLevel, ...nextProfile } = profile;
  return nextProfile;
}

module.exports = {
  isProfileComplete,
  stripLegacyProfileFields,
};
