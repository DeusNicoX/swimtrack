import { Router } from 'express';
import {
  createService,
  listServices,
} from '../controllers/services.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', listServices);
router.post('/', requireAuth, createService);

export default router;
