import express from 'express';
import { login, register, getById, logout, refreshToken } from '../controllers/user-controller';

const router = express.Router();

router.get('/users/:id', getById);
router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);


export default router;