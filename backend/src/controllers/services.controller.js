import { pool } from '../config/db.js';

function mapService(row) {
  return {
    coach: {
      email: row.trainer_email,
      full_name: row.trainer_full_name,
      id: row.trainer_id,
    },
    created_at: row.created_at,
    description: row.description,
    id: row.id,
    location: row.location,
    modality: row.modality,
    schedule: row.schedule,
    title: row.title,
  };
}

function validateServicePayload(payload) {
  const { description, location, modality, schedule, title } = payload;

  if (!title || !description || !modality || !location || !schedule) {
    return 'title, description, modality, location y schedule son obligatorios';
  }

  return null;
}

export async function listServices(req, res) {
  const servicesResult = await pool.query(
    `SELECT
       services.id,
       services.title,
       services.description,
       services.modality,
       services.location,
       services.schedule,
       services.created_at,
       users.id AS trainer_id,
       users.full_name AS trainer_full_name,
       users.email AS trainer_email
     FROM services
     INNER JOIN users ON users.id = services.trainer_id
     ORDER BY services.created_at DESC`,
  );

  return res.json({
    services: servicesResult.rows.map(mapService),
  });
}

export async function createService(req, res) {
  if (req.user.role !== 'trainer') {
    return res.status(403).json({
      message: 'Solo los entrenadores pueden crear servicios',
    });
  }

  const validationError = validateServicePayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const { description, location, modality, schedule, title } = req.body;
  const trainerId = Number(req.user.sub);

  const serviceResult = await pool.query(
    `INSERT INTO services
      (trainer_id, title, description, modality, location, schedule)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, description, modality, location, schedule, created_at`,
    [
      trainerId,
      title.trim(),
      description.trim(),
      modality.trim(),
      location.trim(),
      schedule.trim(),
    ],
  );

  return res.status(201).json({
    message: 'Servicio creado correctamente',
    service: serviceResult.rows[0],
  });
}
