import express from 'express';
import { login, register, getById, logout, refreshToken, googleLogin } from '../controllers/user-controller';

const router = express.Router();

router.get('/:id', getById);
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/google-login', googleLogin);

export default router;