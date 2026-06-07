import request from 'supertest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { pool } from '../../src/config/db.js';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const createdEmails = [];

async function applySchema() {
  const schemaPath = resolve(process.cwd(), 'db/schema.sql');
  const schema = await readFile(schemaPath, 'utf8');

  await pool.query(schema);
}

async function registerUser({ email, role = 'client' }) {
  createdEmails.push(email);

  return request(app)
    .post('/api/auth/register')
    .send({
      contact_info: role === 'trainer' ? `${email} / 3001234567` : undefined,
      email,
      experience_years: role === 'trainer' ? 4 : undefined,
      full_name: role === 'trainer' ? 'Trainer Integration' : 'Client Integration',
      password: 'Password123!',
      role,
      specialty: role === 'trainer' ? 'Tecnica de libre' : undefined,
    });
}

describe.sequential('SwimTrack API integration', () => {
  beforeAll(async () => {
    await applySchema();
  });

  afterAll(async () => {
    if (createdEmails.length > 0) {
      await pool.query('DELETE FROM users WHERE email = ANY($1::text[])', [
        createdEmails,
      ]);
    }

    await pool.end();
  });

  it('responds with the API health message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'SwimTrack API' });
  });

  it('registers a client user successfully', async () => {
    const email = `client-register-${runId}@test.com`;

    const response = await registerUser({ email });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: 'Usuario registrado correctamente',
      user: {
        email,
        role: 'client',
      },
    });
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('logs in a registered user successfully', async () => {
    const email = `client-login-${runId}@test.com`;
    await registerUser({ email });

    const response = await request(app).post('/api/auth/login').send({
      email,
      password: 'Password123!',
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: 'Login correcto',
      user: {
        email,
        role: 'client',
      },
    });
    expect(response.body.token).toEqual(expect.any(String));
  });

  it('allows an authenticated trainer to create a service and list it', async () => {
    const email = `trainer-service-${runId}@test.com`;
    const registerResponse = await registerUser({ email, role: 'trainer' });
    const serviceTitle = `Servicio integracion ${runId}`;

    const createResponse = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        description: 'Servicio creado desde prueba de integracion',
        location: 'Piscina Integracion',
        modality: 'Individual',
        schedule: 'Lunes 6 p.m.',
        title: serviceTitle,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      message: 'Servicio creado correctamente',
      service: {
        description: 'Servicio creado desde prueba de integracion',
        location: 'Piscina Integracion',
        modality: 'Individual',
        schedule: 'Lunes 6 p.m.',
        title: serviceTitle,
      },
    });

    const listResponse = await request(app).get('/api/services');
    const createdService = listResponse.body.services.find(
      (service) => service.title === serviceTitle,
    );

    expect(listResponse.status).toBe(200);
    expect(createdService).toMatchObject({
      coach: {
        email,
        full_name: 'Trainer Integration',
      },
      description: 'Servicio creado desde prueba de integracion',
      location: 'Piscina Integracion',
      modality: 'Individual',
      schedule: 'Lunes 6 p.m.',
      title: serviceTitle,
    });
  });

  it('rejects service creation from an authenticated client', async () => {
    const email = `client-service-${runId}@test.com`;
    const registerResponse = await registerUser({ email });

    const response = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${registerResponse.body.token}`)
      .send({
        description: 'Intento invalido desde cliente',
        location: 'Piscina Integracion',
        modality: 'Individual',
        schedule: 'Martes 7 p.m.',
        title: `Servicio cliente ${runId}`,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Solo los entrenadores pueden crear servicios',
    });
  });
});
