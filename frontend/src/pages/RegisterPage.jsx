import { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';

function RegisterPage({ onAuthSuccess }) {
  const [profileType, setProfileType] = useState('trainee');
  const [formData, setFormData] = useState({
    confirmPassword: '',
    contactInfo: '',
    email: '',
    experienceYears: '',
    fullName: '',
    password: '',
    specialty: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const isTrainer = profileType === 'trainer';

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        text: 'Las contraseñas no coinciden.',
        type: 'error',
      });
      return;
    }

    const payload = {
      email: formData.email,
      full_name: formData.fullName,
      password: formData.password,
      role: isTrainer ? 'trainer' : 'client',
    };

    if (isTrainer) {
      payload.specialty = formData.specialty;
      payload.experience_years = formData.experienceYears;
      payload.contact_info = formData.contactInfo;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible crear la cuenta');
      }

      onAuthSuccess(data);
      setMessage({
        text: 'Cuenta creada correctamente.',
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
    <section className="register-page" aria-labelledby="register-title">
      <header className="register-header">
        <h1 id="register-title">Crear cuenta en SwimTrack</h1>
        <p>Selecciona tu tipo de perfil para personalizar la experiencia.</p>
      </header>

      <div className="profile-options" aria-label="Tipo de perfil">
        <button
          aria-pressed={profileType === 'trainee'}
          className={
            profileType === 'trainee'
              ? 'profile-card profile-card--active'
              : 'profile-card'
          }
          onClick={() => setProfileType('trainee')}
          type="button"
        >
          <span>Busco entrenamiento</span>
          <small>
            Encuentra servicios, entrenadores y horarios disponibles según tus
            necesidades.
          </small>
        </button>

        <button
          aria-pressed={isTrainer}
          className={
            isTrainer ? 'profile-card profile-card--active' : 'profile-card'
          }
          onClick={() => setProfileType('trainer')}
          type="button"
        >
          <span>Soy entrenador</span>
          <small>
            Publica tus servicios, administra horarios y conecta con nuevos
            usuarios.
          </small>
        </button>
      </div>

      <form className="register-form" onSubmit={submitRegister}>
        <label htmlFor="register-name">Nombre completo</label>
        <input
          id="register-name"
          name="fullName"
          onChange={updateField}
          placeholder="Laura Gomez"
          type="text"
          value={formData.fullName}
        />

        <label htmlFor="register-email">Correo electrónico</label>
        <input
          id="register-email"
          name="email"
          onChange={updateField}
          placeholder="usuario de prueba"
          type="email"
          value={formData.email}
        />

        <label htmlFor="register-password">Contraseña</label>
        <input
          id="register-password"
          name="password"
          onChange={updateField}
          placeholder="********"
          type="password"
          value={formData.password}
        />

        <label htmlFor="register-confirm-password">Confirmar contraseña</label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          onChange={updateField}
          placeholder="********"
          type="password"
          value={formData.confirmPassword}
        />

        {isTrainer && (
          <div className="trainer-fields">
            <label htmlFor="register-specialty">Especialidad</label>
            <input
              id="register-specialty"
              name="specialty"
              onChange={updateField}
              placeholder="Entrenamiento de resistencia"
              type="text"
              value={formData.specialty}
            />

            <label htmlFor="register-experience">Años de experiencia</label>
            <input
              id="register-experience"
              min="0"
              name="experienceYears"
              onChange={updateField}
              placeholder="5"
              type="number"
              value={formData.experienceYears}
            />

            <label htmlFor="register-contact">Información de contacto</label>
            <textarea
              id="register-contact"
              name="contactInfo"
              onChange={updateField}
              placeholder="Telefono, correo alternativo o disponibilidad"
              rows="4"
              value={formData.contactInfo}
            />
          </div>
        )}

        {message && (
          <p className={`form-message form-message--${message.type}`}>
            {message.text}
          </p>
        )}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <a href="/login">Ya tengo cuenta, iniciar sesión</a>
      </form>
    </section>
  );
}

export default RegisterPage;
