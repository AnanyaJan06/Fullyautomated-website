import { Router } from 'express';
import { searchParts } from '../controllers/part.controller';

const router = Router();

router.get('/', searchParts);
router.get('/search', searchParts);

export default router;
