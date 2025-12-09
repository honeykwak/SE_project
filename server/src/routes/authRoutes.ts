import express from 'express';
import { register, login, getMe, updateProfile, googleLogin } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // Added
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

