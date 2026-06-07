/**
 * Builds a two-letter avatar label from a coach name.
 *
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Converts the API service shape into the fields consumed by ServicesListPage.
 *
 * @param {object} service Service returned by the backend API.
 * @returns {object} UI-oriented service model.
 */
export function mapApiService(service) {
  const coachName = service.coach?.full_name || 'Entrenador SwimTrack';

  return {
    category: service.modality,
    coach: coachName,
    id: service.id,
    initials: getInitials(coachName),
    location: service.location,
    schedule: service.schedule,
    serviceName: service.title,
    type: service.title,
  };
}

/**
 * Filters services using the same text and checkbox rules as the UI.
 *
 * @param {object[]} services UI service models.
 * @param {string} searchTerm Free-text search query.
 * @param {string[]} selectedFilters Active checkbox filters.
 * @returns {object[]} Matching services.
 */
export function filterServices(services, searchTerm = '', selectedFilters = []) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return services.filter((service) => {
    const textSearchableFields = [
      service.serviceName,
      service.type,
      service.coach,
      service.location,
    ]
      .join(' ')
      .toLowerCase();

    const filterSearchableFields = [
      service.serviceName,
      service.type,
      service.category,
      service.schedule,
      service.coach,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === '' ||
      textSearchableFields.includes(normalizedSearch);

    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) =>
        filterSearchableFields.includes(filter.toLowerCase()),
      );

    return matchesSearch && matchesFilters;
  });
}
