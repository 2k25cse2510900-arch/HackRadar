import type { Hackathon, HackathonFilters } from "./types";

export function matchesHackathonFilters(
  hackathon: Hackathon,
  filters: HackathonFilters,
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesQuery =
    !normalizedQuery ||
    [hackathon.name, hackathon.organizer, hackathon.domain]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);

  const matchesMulti = (selected: string[], value: string) =>
    selected.length === 0 || selected.includes(value);

  return (
    matchesQuery &&
    matchesMulti(filters.modes, hackathon.mode) &&
    matchesMulti(filters.statuses, hackathon.status) &&
    matchesMulti(filters.domains, hackathon.domain) &&
    matchesMulti(filters.difficulties, hackathon.difficulty) &&
    matchesMulti(filters.registrations, hackathon.registration) &&
    matchesMulti(filters.prizeBands, hackathon.prizeBand)
  );
}

export function formatFilterCount(filters: HackathonFilters) {
  return Object.values(filters).reduce((count, values) => count + values.length, 0);
}
