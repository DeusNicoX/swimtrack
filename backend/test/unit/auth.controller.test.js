import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { pool } from '../../src/config/db.js';
import { login, register } from '../../src/controllers/auth.controller.js';

vi.mock('../../src/config/db.js', () => ({
  pool: {
    connect: vi.fn(),
    query: vi.fn(),
  },
}));

vi.mock('bcrypt', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

function createResponse() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

function createDbClient() {
  return {
    query: vi.fn(),
    release: vi.fn(),
  };
}

describe('auth controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bcrypt.hash.mockResolvedValue('hashed-password');
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('signed-token');
  });

  it('registers a client user successfully', async () => {
    const dbClient = createDbClient();
    dbClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            email: 'client@test.com',
            full_name: 'Client Test',
            id: 1,
            role: 'client',
          },
        ],
      })
      .mockResolvedValueOnce({});
    pool.connect.mockResolvedValue(dbClient);
    const req = {
      body: {
        email: ' Client@Test.com ',
        full_name: ' Client Test ',
        password: '123456',
        role: 'client',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(dbClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(dbClient.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('INSERT INTO users'),
      ['Client Test', 'client@test.com', 'hashed-password', 'client'],
    );
    expect(dbClient.query).toHaveBeenNthCalledWith(3, 'COMMIT');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario registrado correctamente',
      token: 'signed-token',
      user: {
        email: 'client@test.com',
        full_name: 'Client Test',
        id: 1,
        role: 'client',
      },
    });
    expect(dbClient.release).toHaveBeenCalled();
  });

  it('registers a trainer user successfully', async () => {
    const dbClient = createDbClient();
    dbClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            email: 'trainer@test.com',
            full_name: 'Trainer Test',
            id: 2,
            role: 'trainer',
          },
        ],
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    pool.connect.mockResolvedValue(dbClient);
    const req = {
      body: {
        contact_info: 'trainer@test.com',
        email: 'trainer@test.com',
        experience_years: '5',
        full_name: 'Trainer Test',
        password: '123456',
        role: 'trainer',
        specialty: 'Tecnica',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(dbClient.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('INSERT INTO trainer_profiles'),
      [2, 'Tecnica', 5, 'trainer@test.com'],
    );
    expect(dbClient.query).toHaveBeenNthCalledWith(4, 'COMMIT');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Usuario registrado correctamente',
        token: 'signed-token',
      }),
    );
  });

  it('returns a validation error when required registration fields are missing', async () => {
    const req = {
      body: {
        email: 'missing@test.com',
        role: 'client',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'full_name, email, password y role son obligatorios',
    });
    expect(pool.connect).not.toHaveBeenCalled();
  });

  it('returns a validation error when trainer experience is invalid', async () => {
    const req = {
      body: {
        email: 'trainer@test.com',
        experience_years: '-1',
        full_name: 'Trainer Test',
        password: '123456',
        role: 'trainer',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'experience_years debe ser un numero entero mayor o igual a 0',
    });
  });

  it('returns a validation error when role is invalid', async () => {
    const req = {
      body: {
        email: 'admin@test.com',
        full_name: 'Admin Test',
        password: '123456',
        role: 'admin',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'role debe ser client o trainer',
    });
  });

  it('stores nullable trainer profile fields when optional data is blank', async () => {
    const dbClient = createDbClient();
    dbClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        rows: [
          {
            email: 'trainer@test.com',
            full_name: 'Trainer Test',
            id: 2,
            role: 'trainer',
          },
        ],
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    pool.connect.mockResolvedValue(dbClient);
    const req = {
      body: {
        contact_info: '',
        email: 'trainer@test.com',
        experience_years: '',
        full_name: 'Trainer Test',
        password: '123456',
        role: 'trainer',
        specialty: '',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(dbClient.query).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining('INSERT INTO trainer_profiles'),
      [2, null, null, null],
    );
  });

  it('returns a conflict when the email already exists', async () => {
    const dbClient = createDbClient();
    dbClient.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce({ code: '23505' })
      .mockResolvedValueOnce({});
    pool.connect.mockResolvedValue(dbClient);
    const req = {
      body: {
        email: 'duplicate@test.com',
        full_name: 'Duplicate Test',
        password: '123456',
        role: 'client',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(dbClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'El email ya esta registrado',
    });
    expect(dbClient.release).toHaveBeenCalled();
  });

  it('returns a generic error when registration fails unexpectedly', async () => {
    const dbClient = createDbClient();
    dbClient.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('database unavailable'))
      .mockResolvedValueOnce({});
    pool.connect.mockResolvedValue(dbClient);
    const req = {
      body: {
        email: 'error@test.com',
        full_name: 'Error Test',
        password: '123456',
        role: 'client',
      },
    };
    const res = createResponse();

    await register(req, res);

    expect(dbClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al registrar usuario',
    });
  });

  it('rejects login when required fields are missing', async () => {
    const req = {
      body: {
        email: 'client@test.com',
      },
    };
    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'email y password son obligatorios',
    });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it('logs in an existing user successfully', async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          email: 'client@test.com',
          full_name: 'Client Test',
          id: 1,
          password_hash: 'hashed-password',
          role: 'client',
        },
      ],
    });
    bcrypt.compare.mockResolvedValue(true);
    const req = {
      body: {
        email: ' CLIENT@Test.com ',
        password: '123456',
      },
    };
    const res = createResponse();

    await login(req, res);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('FROM users'), [
      'client@test.com',
    ]);
    expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login correcto',
      token: 'signed-token',
      user: {
        email: 'client@test.com',
        full_name: 'Client Test',
        id: 1,
        role: 'client',
      },
    });
  });

  it('rejects login when the user does not exist', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const req = {
      body: {
        email: 'missing@test.com',
        password: '123456',
      },
    };
    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales invalidas' });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('rejects login when the password is invalid', async () => {
    pool.query.mockResolvedValue({
      rows: [
        {
          email: 'client@test.com',
          full_name: 'Client Test',
          id: 1,
          password_hash: 'hashed-password',
          role: 'client',
        },
      ],
    });
    bcrypt.compare.mockResolvedValue(false);
    const req = {
      body: {
        email: 'client@test.com',
        password: 'wrong-password',
      },
    };
    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales invalidas' });
  });
});
