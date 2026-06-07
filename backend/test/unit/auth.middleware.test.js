import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireAuth } from '../../src/middleware/auth.middleware.js';

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
  },
}));

function createResponse() {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
  };
}

describe('requireAuth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects requests without a bearer token', () => {
    const req = {
      get: vi.fn().mockReturnValue(undefined),
    };
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects requests with an invalid token', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });
    const req = {
      get: vi.fn().mockReturnValue('Bearer invalid-token'),
    };
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('continues when the token is valid', () => {
    const decodedToken = {
      email: 'trainer@test.com',
      role: 'trainer',
      sub: '2',
    };
    jwt.verify.mockReturnValue(decodedToken);
    const req = {
      get: vi.fn().mockReturnValue('Bearer valid-token'),
    };
    const res = createResponse();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(req.user).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
