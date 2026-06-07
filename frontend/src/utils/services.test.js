import { describe, expect, it } from 'vitest';
import { filterServices, getInitials, mapApiService } from './services.js';

const services = [
  {
    category: 'Individual',
    coach: 'Laura Gomez',
    id: 1,
    initials: 'LG',
    location: 'Piscina Olimpica',
    schedule: 'Lunes 6 p.m.',
    serviceName: 'Natacion tecnica individual',
    type: 'Natacion tecnica individual',
  },
  {
    category: 'Grupal',
    coach: 'Carlos Ruiz',
    id: 2,
    initials: 'CR',
    location: 'Club Norte',
    schedule: 'Sabados 8 a.m.',
    serviceName: 'Iniciacion grupal',
    type: 'Iniciacion grupal',
  },
  {
    category: 'Competencia',
    coach: 'Ana Perez',
    id: 3,
    initials: 'AP',
    location: 'Centro Acuatico Sur',
    schedule: 'Martes y jueves',
    serviceName: 'Preparacion competencia',
    type: 'Preparacion competencia',
  },
];

describe('service utilities', () => {
  it('builds initials from a coach name', () => {
    expect(getInitials('Laura Gomez Restrepo')).toBe('LG');
    expect(getInitials()).toBe('');
  });

  it('maps API services to the UI shape', () => {
    expect(
      mapApiService({
        coach: {
          full_name: 'Laura Gomez',
        },
        id: 10,
        location: 'Piscina Olimpica',
        modality: 'Individual',
        schedule: 'Lunes 6 p.m.',
        title: 'Natacion tecnica',
      }),
    ).toEqual({
      category: 'Individual',
      coach: 'Laura Gomez',
      id: 10,
      initials: 'LG',
      location: 'Piscina Olimpica',
      schedule: 'Lunes 6 p.m.',
      serviceName: 'Natacion tecnica',
      type: 'Natacion tecnica',
    });
  });

  it('uses a fallback coach name when the API omits coach details', () => {
    expect(
      mapApiService({
        id: 11,
        location: 'Club Norte',
        modality: 'Grupal',
        schedule: 'Sabados',
        title: 'Iniciacion',
      }).coach,
    ).toBe('Entrenador SwimTrack');
  });

  it('returns all services when search and filters are empty', () => {
    expect(filterServices(services)).toEqual(services);
  });

  it('searches by title', () => {
    expect(filterServices(services, 'competencia')).toEqual([services[2]]);
  });

  it('searches by location', () => {
    expect(filterServices(services, 'club norte')).toEqual([services[1]]);
  });

  it('filters by modality', () => {
    expect(filterServices(services, '', ['Grupal'])).toEqual([services[1]]);
  });

  it('combines search and filters', () => {
    expect(filterServices(services, 'natacion', ['Individual'])).toEqual([
      services[0],
    ]);
  });
});
