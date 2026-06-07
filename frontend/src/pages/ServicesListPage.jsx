import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL } from '../config/api.js';
import { filterServices, mapApiService } from '../utils/services.js';

const filterOptions = [
  'Natacion tecnica',
  'Iniciacion',
  'Competencia',
  'Grupal',
  'Individual',
  'Mananas',
];

function ServicesListPage({ onLogout, session }) {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/services`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'No fue posible cargar servicios');
        }

        if (isMounted) {
          setServices((data.services || []).map(mapApiService));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleServices = useMemo(
    () => filterServices(services, searchTerm, selectedFilters),
    [searchTerm, selectedFilters, services],
  );

  const resultsLabel =
    visibleServices.length === 1
      ? '1 servicio encontrado'
      : `${visibleServices.length} servicios encontrados`;

  const searchServices = (event) => {
    event.preventDefault();
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter],
    );
  };

  return (
    <section className="services-page" aria-labelledby="services-title">
      <header className="services-header">
        <a className="services-brand" href="/">
          SwimTrack
        </a>
        <nav className="services-nav" aria-label="Navegacion de busqueda">
          <a href="/">Inicio</a>
          <a className="services-nav-active" href="/servicios">
            Buscar
          </a>
          {session?.user?.role === 'trainer' && (
            <a href="/servicios/publicar">Publicar</a>
          )}
          {session ? (
            <button
              className="services-nav-button"
              onClick={onLogout}
              type="button"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/registro">Registro</a>
            </>
          )}
        </nav>
      </header>

      <div className="services-content">
        <h1 id="services-title">Buscar servicios de natacion</h1>

        <form className="services-search-row" onSubmit={searchServices}>
          <input
            aria-label="Buscar servicios"
            onChange={(event) => setSearchTerm(event.target.value)}
            type="search"
            value={searchTerm}
          />
          <button className="button-primary" type="button">
            Buscar
          </button>
          <button
            className="button-secondary"
            onClick={() => setFiltersVisible((isVisible) => !isVisible)}
            type="button"
          >
            Filtros
          </button>
        </form>

        <div
          className={
            filtersVisible
              ? 'services-layout'
              : 'services-layout services-layout--filters-hidden'
          }
        >
          {filtersVisible && (
            <aside className="filters-panel" aria-label="Filtros">
              <h2>Filtros</h2>
              <div className="filters-list">
                {filterOptions.map((filter) => (
                  <label key={filter}>
                    <input
                      checked={selectedFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      type="checkbox"
                    />
                    <span>{filter}</span>
                  </label>
                ))}
              </div>
            </aside>
          )}

          <section className="services-results" aria-live="polite">
            <p className="services-count">{resultsLabel}</p>

            {isLoading ? (
              <div className="services-empty-state">
                <h2>Cargando servicios</h2>
                <p>Estamos consultando los servicios disponibles.</p>
              </div>
            ) : loadError ? (
              <div className="services-empty-state">
                <h2>No fue posible cargar servicios</h2>
                <p>{loadError}</p>
              </div>
            ) : visibleServices.length > 0 ? (
              <div className="services-results-grid">
                {visibleServices.map((service) => (
                  <article className="service-result-card" key={service.id}>
                    <div className="service-card-image" aria-hidden="true" />

                    <div className="service-card-body">
                      <div className="coach-avatar" aria-hidden="true">
                        {service.initials}
                      </div>
                      <div className="service-card-title">
                        <h2>{service.coach}</h2>
                        <p>{service.type}</p>
                        <span
                          className={
                            service.category === 'Grupal'
                              ? 'service-badge service-badge--blue'
                              : 'service-badge'
                          }
                        >
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <div className="service-card-footer">
                      <div>
                        <p>{service.location}</p>
                        <p>{service.schedule}</p>
                      </div>
                      <button className="button-primary" type="button">
                        Ver detalles
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="services-empty-state">
                <h2>No encontramos servicios</h2>
                <p>Prueba con otra palabra de busqueda o ajusta los filtros.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

export default ServicesListPage;
