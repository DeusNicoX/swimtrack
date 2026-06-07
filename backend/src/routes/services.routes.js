import { Router } from 'express';
import {
  createService,
  listServices,
} from '../controllers/services.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/services:
 *   get:
 *     summary: Lista servicios publicados
 *     description: Devuelve los servicios disponibles junto con informacion basica del entrenador.
 *     tags:
 *       - Services
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 */
router.get('/', listServices);

/**
 * @openapi
 * /api/services:
 *   post:
 *     summary: Publica un servicio de entrenamiento
 *     description: Permite a un usuario trainer autenticado crear un servicio visible en el listado publico.
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Servicio creado correctamente
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token requerido o invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario autenticado no es trainer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', requireAuth, createService);

export default router;
