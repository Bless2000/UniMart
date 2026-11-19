import express from 'express';
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token', verifyResetToken);

export default router;
