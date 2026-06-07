const TOKEN_STORAGE_KEY = 'swimtrack_token';
const USER_STORAGE_KEY = 'swimtrack_user';

/**
 * Reads the persisted auth session from localStorage.
 *
 * @returns {{token: string, user: object}|null} Current session or null.
 */
export function getSession() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !storedUser) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(storedUser),
    };
  } catch {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

/**
 * Persists token and user data after successful auth.
 *
 * @param {{token: string, user: object}} authData
 * @returns {{token: string, user: object}} Stored session object.
 */
export function saveSession(authData) {
  const session = {
    token: authData.token,
    user: authData.user,
  };

  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));

  return session;
}

/**
 * Removes all stored auth session data.
 *
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Determines the default post-auth route for a role.
 *
 * @param {string|undefined} role User role from the auth token/user object.
 * @returns {string} Frontend route for the role.
 */
export function getRedirectPathForRole(role) {
  return role === 'trainer' ? '/servicios/publicar' : '/servicios';
}

/**
 * Determines the default post-auth route for a session object.
 *
 * @param {{user?: {role?: string}}|null} session
 * @returns {string} Frontend route for the session role.
 */
export function getRedirectPathForSession(session) {
  return getRedirectPathForRole(session?.user?.role);
}
