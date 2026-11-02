import { Router } from 'express';
import { getPartSearchOptions, searchParts } from '../controllers/part.controller';

const router = Router();

router.get('/', searchParts);
router.get('/options', getPartSearchOptions);
router.get('/search', searchParts);

export default router;
