import express from 'express';
import { login, register, getById, logout, refreshToken } from '../controllers/user-controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User management API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    required:
 *      - id
 *      - email
 *      - password
 *      - tokens
 *    properties:
 *      id:
 *        type: number
 *        description: User ID
 *      email:
 *        type: string
 *        description: User email
 *      password:
 *        type: string
 *        description: User password
 *      tokens:
 *        type: array
 *        items:
 *          type: string
 *        description: Authentication tokens
 *    example:
 *      id: 1
 *      email: 'user@example.com'
 *      password: 'password123'
 *      tokens: ['token1', 'token2']
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/users/:id', getById);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: 'user@example.com'
 *               password: 'password123'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: 'newuser@example.com'
 *               password: 'password123'
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post('/register', register);

/**
 * @swagger
 * /refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: 'oldToken123'
 *     responses:
 *       200:
 *         description: Token refreshed
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *             example:
 *               token: 'token123'
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/logout', logout);

export default router;