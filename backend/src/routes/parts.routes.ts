import { Router } from 'express';
import { createPart, requireAdmin } from '../controllers/parts.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', requireAuth, requireAdmin, createPart);

export default router;
