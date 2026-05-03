import { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';

const initialFormData = {
  serviceName: '',
  trainingType: '',
  description: '',
  modality: '',
  location: '',
  schedule: '',
};

function PublishServicePage({ onLogout, session }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const goToNextStep = () => {
    setMessage(null);
    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const goToPreviousStep = () => {
    setMessage(null);
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setMessage(null);
  };

  const publishService = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        body: JSON.stringify({
          description: formData.description,
          location: formData.location,
          modality: formData.modality,
          schedule: formData.schedule,
          title: formData.serviceName,
        }),
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible publicar el servicio');
      }

      setFormData(initialFormData);
      setCurrentStep(1);
      setMessage({
        text: 'Servicio publicado correctamente.',
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

  const getStepClassName = (step) => {
    if (step === currentStep) {
      return 'publish-step publish-step--active';
    }

    if (step < currentStep) {
      return 'publish-step publish-step--complete';
    }

    return 'publish-step';
  };

  return (
    <section className="publish-page" aria-labelledby="publish-title">
      <header className="publish-header">
        <a className="publish-brand" href="/">
          SwimTrack
        </a>
        <h1 id="publish-title">Publicar nuevo servicio</h1>
        <div className="publish-header-actions">
          <span>{session?.user?.full_name}</span>
          <a href="/servicios">Servicios</a>
          <button onClick={onLogout} type="button">
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="publish-card">
        <h2>Formulario por pasos</h2>

        <ol className="publish-stepper" aria-label="Progreso de publicacion">
          <li className={getStepClassName(1)}>
            <span>1</span>
            <strong>Paso 1</strong>
          </li>
          <li className={getStepClassName(2)}>
            <span>2</span>
            <strong>Paso 2</strong>
          </li>
          <li className={getStepClassName(3)}>
            <span>3</span>
            <strong>Paso 3</strong>
          </li>
        </ol>

        <form className="publish-form">
          {message && (
            <p className={`form-message form-message--${message.type}`}>
              {message.text}
            </p>
          )}

          {currentStep === 1 && (
            <>
              <div className="publish-field">
                <label htmlFor="service-name">Nombre del servicio</label>
                <input
                  id="service-name"
                  name="serviceName"
                  onChange={updateField}
                  placeholder="Natacion tecnica individual"
                  type="text"
                  value={formData.serviceName}
                />
              </div>

              <div className="publish-field">
                <label htmlFor="training-type">Tipo de entrenamiento</label>
                <input
                  id="training-type"
                  name="trainingType"
                  onChange={updateField}
                  placeholder="Natacion tecnica"
                  type="text"
                  value={formData.trainingType}
                />
              </div>

              <div className="publish-field publish-field--full">
                <label htmlFor="service-description">Descripción</label>
                <input
                  id="service-description"
                  name="description"
                  onChange={updateField}
                  placeholder="Describe el servicio ofrecido"
                  type="text"
                  value={formData.description}
                />
              </div>

              <section className="service-preview" aria-label="Vista previa">
                <h3>Vista previa de tarjeta del servicio</h3>
                <p>Aqui se previsualiza el servicio antes de publicarlo.</p>
              </section>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="publish-field">
                <label htmlFor="service-modality">Modalidad</label>
                <input
                  id="service-modality"
                  name="modality"
                  onChange={updateField}
                  placeholder="Presencial"
                  type="text"
                  value={formData.modality}
                />
              </div>

              <div className="publish-field">
                <label htmlFor="service-location">Ubicación</label>
                <input
                  id="service-location"
                  name="location"
                  onChange={updateField}
                  placeholder="Piscina Olimpica"
                  type="text"
                  value={formData.location}
                />
              </div>

              <div className="publish-field publish-field--full">
                <label htmlFor="service-schedule">Horario</label>
                <input
                  id="service-schedule"
                  name="schedule"
                  onChange={updateField}
                  placeholder="Lunes y miercoles, 6:00 p.m."
                  type="text"
                  value={formData.schedule}
                />
              </div>

              <section
                className="service-preview"
                aria-label="Detalle de agenda"
              >
                <h3>Detalles de disponibilidad</h3>
                <p>Completa la modalidad, ubicacion y horario del servicio.</p>
              </section>
            </>
          )}

          {currentStep === 3 && (
            <section
              className="service-summary"
              aria-label="Resumen del servicio"
            >
              <h3>Resumen del servicio</h3>
              <dl>
                <div>
                  <dt>Nombre del servicio</dt>
                  <dd>{formData.serviceName || 'Sin definir'}</dd>
                </div>
                <div>
                  <dt>Tipo de entrenamiento</dt>
                  <dd>{formData.trainingType || 'Sin definir'}</dd>
                </div>
                <div>
                  <dt>Descripción</dt>
                  <dd>{formData.description || 'Sin definir'}</dd>
                </div>
                <div>
                  <dt>Modalidad</dt>
                  <dd>{formData.modality || 'Sin definir'}</dd>
                </div>
                <div>
                  <dt>Ubicación</dt>
                  <dd>{formData.location || 'Sin definir'}</dd>
                </div>
                <div>
                  <dt>Horario</dt>
                  <dd>{formData.schedule || 'Sin definir'}</dd>
                </div>
              </dl>
            </section>
          )}

          <div className="publish-actions">
            <div className="publish-actions-left">
              <button
                className="button-secondary"
                onClick={resetForm}
                type="button"
              >
                Cancelar
              </button>
              {currentStep > 1 && (
                <button
                  className="button-secondary"
                  onClick={goToPreviousStep}
                  type="button"
                >
                  Anterior
                </button>
              )}
            </div>

            {currentStep < 3 ? (
              <button
                className="button-primary"
                onClick={goToNextStep}
                type="button"
              >
                Siguiente
              </button>
            ) : (
              <button
                className="button-primary"
                disabled={isSubmitting}
                onClick={publishService}
                type="button"
              >
                {isSubmitting ? 'Publicando...' : 'Finalizar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default PublishServicePage;
