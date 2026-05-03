import { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';

function LoginPage({ onAuthSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible iniciar sesión');
      }

      onAuthSuccess(data);
      setMessage({
        text: 'Inicio de sesión correcto.',
        type: 'success',
      });
    } catch (error) {
      setMessage({
        text: error.message,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-page" aria-labelledby="login-title">
      <div className="login-hero" aria-hidden="true">
        <div className="login-hero-content">
          <h1>Vuelve al agua con tu plan de entrenamiento</h1>
          <p>
            Accede para gestionar tu perfil, consultar servicios o publicar
            nuevas clases como entrenador.
          </p>
        </div>
      </div>

      <div className="login-panel">
        <form className="login-form" onSubmit={submitLogin}>
          <p className="login-brand">SwimTrack</p>
          <h2 id="login-title">Iniciar sesión</h2>

          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            name="email"
            onChange={updateField}
            placeholder="usuario de prueba"
            type="email"
            value={formData.email}
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            name="password"
            onChange={updateField}
            placeholder="********"
            type="password"
            value={formData.password}
          />

          <a className="login-forgot-link" href="/login">
            Olvidé mi contraseña
          </a>

          {message && (
            <p className={`form-message form-message--${message.type}`}>
              {message.text}
            </p>
          )}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <a className="login-register-link" href="/registro">
            No tengo cuenta, registrarme
          </a>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
