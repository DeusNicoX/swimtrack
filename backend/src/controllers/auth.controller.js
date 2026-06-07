import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const allowedRoles = ['client', 'trainer'];
const passwordSaltRounds = 10;

/**
 * Builds the JWT payload used by protected API routes.
 *
 * @param {{id: number|string, email: string, role: string}} user
 * @returns {string} Signed JWT with subject, email and role claims.
 */
function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      sub: String(user.id),
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

/**
 * Removes sensitive database fields before returning user data to clients.
 *
 * @param {{id: number, full_name: string, email: string, role: string}} row
 * @returns {{id: number, full_name: string, email: string, role: string}}
 */
function mapUser(row) {
  return {
    email: row.email,
    full_name: row.full_name,
    id: row.id,
    role: row.role,
  };
}

/**
 * Validates the registration payload for both clients and trainers.
 *
 * @param {object} payload Incoming Express request body.
 * @returns {string|null} Human-readable validation error or null.
 */
function validateRegisterPayload(payload) {
  const {
    email,
    experience_years: experienceYears,
    full_name: fullName,
    password,
    role,
  } = payload;

  if (!fullName || !email || !password || !role) {
    return 'full_name, email, password y role son obligatorios';
  }

  if (!allowedRoles.includes(role)) {
    return 'role debe ser client o trainer';
  }

  if (
    role === 'trainer' &&
    experienceYears !== undefined &&
    experienceYears !== '' &&
    (!Number.isInteger(Number(experienceYears)) || Number(experienceYears) < 0)
  ) {
    return 'experience_years debe ser un numero entero mayor o igual a 0';
  }

  return null;
}

/**
 * Handles POST /api/auth/register.
 *
 * Creates the user inside a transaction, optionally creates a trainer profile,
 * and returns the sanitized user plus JWT.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export async function register(req, res) {
  const validationError = validateRegisterPayload(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const {
    contact_info: contactInfo,
    email,
    experience_years: experienceYears,
    full_name: fullName,
    password,
    role,
    specialty,
  } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, passwordSaltRounds);
  const dbClient = await pool.connect();

  try {
    await dbClient.query('BEGIN');

    const userResult = await dbClient.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, email, role`,
      [fullName.trim(), normalizedEmail, passwordHash, role],
    );

    const user = userResult.rows[0];

    if (role === 'trainer') {
      await dbClient.query(
        `INSERT INTO trainer_profiles
          (user_id, specialty, experience_years, contact_info)
         VALUES ($1, $2, $3, $4)`,
        [
          user.id,
          specialty || null,
          experienceYears === undefined || experienceYears === ''
            ? null
            : Number(experienceYears),
          contactInfo || null,
        ],
      );
    }

    await dbClient.query('COMMIT');

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token: createToken(user),
      user: mapUser(user),
    });
  } catch (error) {
    await dbClient.query('ROLLBACK');

    if (error.code === '23505') {
      return res.status(409).json({ message: 'El email ya esta registrado' });
    }

    return res.status(500).json({ message: 'Error al registrar usuario' });
  } finally {
    dbClient.release();
  }
}

/**
 * Handles POST /api/auth/login.
 *
 * Validates credentials against the stored password hash and returns a JWT
 * for authenticated API calls.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<import('express').Response>}
 */
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'email y password son obligatorios',
    });
  }

  const userResult = await pool.query(
    `SELECT id, full_name, email, password_hash, role
     FROM users
     WHERE email = $1`,
    [email.trim().toLowerCase()],
  );

  const user = userResult.rows[0];

  if (!user) {
    return res.status(401).json({ message: 'Credenciales invalidas' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Credenciales invalidas' });
  }

  return res.json({
    message: 'Login correcto',
    token: createToken(user),
    user: mapUser(user),
  });
}
