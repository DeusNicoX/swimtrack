import { afterEach, describe, expect, it } from 'vitest';
import {
  clearSession,
  getRedirectPathForRole,
  getRedirectPathForSession,
  getSession,
  saveSession,
} from './session.js';

afterEach(() => {
  clearSession();
});

describe('session utilities', () => {
  it('returns null when no session is stored', () => {
    expect(getSession()).toBeNull();
  });

  it('stores and reads the authenticated session', () => {
    const authData = {
      token: 'test-token',
      user: {
        email: 'coach@test.com',
        full_name: 'Coach Test',
        id: 1,
        role: 'trainer',
      },
    };

    expect(saveSession(authData)).toEqual(authData);
    expect(getSession()).toEqual(authData);
  });

  it('clears corrupted stored user data', () => {
    localStorage.setItem('swimtrack_token', 'test-token');
    localStorage.setItem('swimtrack_user', '{invalid-json');

    expect(getSession()).toBeNull();
    expect(localStorage.getItem('swimtrack_token')).toBeNull();
    expect(localStorage.getItem('swimtrack_user')).toBeNull();
  });

  it('clears the stored session on logout', () => {
    saveSession({
      token: 'client-token',
      user: {
        email: 'client@test.com',
        full_name: 'Client Test',
        id: 2,
        role: 'client',
      },
    });

    clearSession();

    expect(getSession()).toBeNull();
  });

  it('redirects clients to services', () => {
    expect(getRedirectPathForRole('client')).toBe('/servicios');
  });

  it('redirects trainers to service publishing', () => {
    expect(getRedirectPathForRole('trainer')).toBe('/servicios/publicar');
  });

  it('redirects from a stored session role', () => {
    expect(
      getRedirectPathForSession({
        user: {
          role: 'trainer',
        },
      }),
    ).toBe('/servicios/publicar');
  });
});
