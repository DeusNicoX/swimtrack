import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Express middleware that validates a Bearer JWT and attaches the decoded
 * claims to req.user for downstream route handlers.
 *
 * @param {import('express').Request & {user?: object}} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void|import('express').Response}
 */
export function requireAuth(req, res, next) {
  const authorizationHeader = req.get('authorization');

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authorizationHeader.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ message: 'Token invalido' });
  }
}
