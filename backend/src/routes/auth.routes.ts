import { Router } from 'express';
import { signup, signin, getMe } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Sign Up / Register
router.post('/signup', signup);
router.post('/register', signup);

// Sign In / Login
router.post('/signin', signin);
router.post('/login', signin);

// Current Authenticated User Profile
router.get('/me', requireAuth, getMe);

export default router;
