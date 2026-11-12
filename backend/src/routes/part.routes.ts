import { Router } from 'express';
import { getPartById, getPartSearchOptions, searchParts } from '../controllers/part.controller';

const router = Router();

router.get('/', searchParts);
router.get('/options', getPartSearchOptions);
router.get('/search', searchParts);
router.get('/:id', getPartById);

export default router;
