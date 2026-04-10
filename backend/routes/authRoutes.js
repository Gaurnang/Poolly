import express from 'express';
import { registerUser, loginUser, logoutUser, getUser, updateUsername } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', protect, getUser);
router.patch('/update-username', protect, updateUsername);

export default router;