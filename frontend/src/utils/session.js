const TOKEN_STORAGE_KEY = 'swimtrack_token';
const USER_STORAGE_KEY = 'swimtrack_user';

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

export function saveSession(authData) {
  const session = {
    token: authData.token,
    user: authData.user,
  };

  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));

  return session;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getRedirectPathForRole(role) {
  return role === 'trainer' ? '/servicios/publicar' : '/servicios';
}

export function getRedirectPathForSession(session) {
  return getRedirectPathForRole(session?.user?.role);
}
