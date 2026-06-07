import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../../src/config/db.js';
import {
  createService,
  listServices,
} from '../../src/controllers/services.controller.js';

vi.mock('../../src/config/db.js', () => ({
  pool: {
    query: vi.fn(),
  },
}));

function createResponse() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe('services controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists services successfully', async () => {
    const createdAt = '2026-06-07T12:00:00.000Z';
    pool.query.mockResolvedValue({
      rows: [
        {
          created_at: createdAt,
          description: 'Clase tecnica',
          id: 1,
          location: 'Piscina Olimpica',
          modality: 'Individual',
          schedule: 'Lunes 6 p.m.',
          title: 'Natacion tecnica',
          trainer_email: 'trainer@test.com',
          trainer_full_name: 'Trainer Test',
          trainer_id: 9,
        },
      ],
    });
    const res = createResponse();

    await listServices({}, res);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('FROM services'));
    expect(res.json).toHaveBeenCalledWith({
      services: [
        {
          coach: {
            email: 'trainer@test.com',
            full_name: 'Trainer Test',
            id: 9,
          },
          created_at: createdAt,
          description: 'Clase tecnica',
          id: 1,
          location: 'Piscina Olimpica',
          modality: 'Individual',
          schedule: 'Lunes 6 p.m.',
          title: 'Natacion tecnica',
        },
      ],
    });
  });

  it('creates a service successfully for a trainer', async () => {
    const createdService = {
      created_at: '2026-06-07T12:00:00.000Z',
      description: 'Clase tecnica',
      id: 1,
      location: 'Piscina Olimpica',
      modality: 'Individual',
      schedule: 'Lunes 6 p.m.',
      title: 'Natacion tecnica',
    };
    pool.query.mockResolvedValue({
      rows: [createdService],
    });
    const req = {
      body: {
        description: ' Clase tecnica ',
        location: ' Piscina Olimpica ',
        modality: ' Individual ',
        schedule: ' Lunes 6 p.m. ',
        title: ' Natacion tecnica ',
      },
      user: {
        role: 'trainer',
        sub: '9',
      },
    };
    const res = createResponse();

    await createService(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO services'),
      [
        9,
        'Natacion tecnica',
        'Clase tecnica',
        'Individual',
        'Piscina Olimpica',
        'Lunes 6 p.m.',
      ],
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Servicio creado correctamente',
      service: createdService,
    });
  });

  it('rejects service creation when required fields are missing', async () => {
    const req = {
      body: {
        description: 'Clase tecnica',
      },
      user: {
        role: 'trainer',
        sub: '9',
      },
    };
    const res = createResponse();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'title, description, modality, location y schedule son obligatorios',
    });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('rejects service creation when the authenticated user is not a trainer', async () => {
    const req = {
      body: {
        description: 'Clase tecnica',
        location: 'Piscina Olimpica',
        modality: 'Individual',
        schedule: 'Lunes 6 p.m.',
        title: 'Natacion tecnica',
      },
      user: {
        role: 'client',
        sub: '3',
      },
    };
    const res = createResponse();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Solo los entrenadores pueden crear servicios',
    });
    expect(pool.query).not.toHaveBeenCalled();
  });
});
