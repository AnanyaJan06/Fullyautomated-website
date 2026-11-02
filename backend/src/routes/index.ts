import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import partRoutes from './part.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/parts', partRoutes);

export default router;
