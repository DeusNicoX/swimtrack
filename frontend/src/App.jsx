import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PublishServicePage from './pages/PublishServicePage.jsx';
import ServicesListPage from './pages/ServicesListPage.jsx';
import {
  clearSession,
  getRedirectPathForSession,
  getSession,
  saveSession,
} from './utils/session.js';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getSession());
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/registro';
  const hasStandaloneLayout =
    isAuthPage ||
    location.pathname === '/' ||
    location.pathname === '/servicios' ||
    location.pathname === '/servicios/publicar';

  const handleAuthSuccess = (authData) => {
    const nextSession = saveSession(authData);
    setSession(nextSession);
    navigate(getRedirectPathForSession(nextSession), { replace: true });
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    navigate('/login', { replace: true });
  };

  const publishServiceElement =
    session?.user?.role === 'trainer' ? (
      <PublishServicePage onLogout={handleLogout} session={session} />
    ) : (
      <Navigate replace to={session ? '/servicios' : '/login'} />
    );

  return (
    <div className="app-shell">
      {!hasStandaloneLayout && (
        <header className="app-header">
          <a className="brand" href="/">
            SwimTrack
          </a>
          <nav className="nav-links" aria-label="Navegacion principal">
            <NavLink to="/servicios">Servicios</NavLink>
            {session?.user?.role === 'trainer' && (
              <NavLink to="/servicios/publicar">Publicar servicio</NavLink>
            )}
            {session ? (
              <button
                className="nav-button"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/registro">Registro</NavLink>
              </>
            )}
          </nav>
        </header>
      )}

      <main
        className={hasStandaloneLayout ? 'app-main app-main--auth' : 'app-main'}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ServicesListPage onLogout={handleLogout} session={session} />
            }
          />
          <Route
            path="/login"
            element={
              session ? (
                <Navigate replace to={getRedirectPathForSession(session)} />
              ) : (
                <LoginPage onAuthSuccess={handleAuthSuccess} />
              )
            }
          />
          <Route
            path="/registro"
            element={
              session ? (
                <Navigate replace to={getRedirectPathForSession(session)} />
              ) : (
                <RegisterPage onAuthSuccess={handleAuthSuccess} />
              )
            }
          />
          <Route
            path="/servicios"
            element={
              <ServicesListPage onLogout={handleLogout} session={session} />
            }
          />
          <Route path="/servicios/publicar" element={publishServiceElement} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
