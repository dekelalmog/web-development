import express from 'express';
import { login, register, getById, logout, refreshToken, googleLogin, updateUser } from '../controllers/user-controller';

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
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
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
router.get('/:id', getById);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 * /users/register:
 *   post:
 *     summary: User registration
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 * /users/refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 * /users/logout:
 *   post:
 *     summary: User logout
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /users/google-login:
 *   post:
 *     summary: User login via Google
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Google ID token credential
 *             example:
 *               credential: 'your-google-id-token'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *               example:
 *                 email: 'user@example.com'
 *                 _id: '60d0fe4f5311236168a109ca'
 *                 imageUrl: 'http://example.com/image.jpg'
 *                 tokens:
 *                   accessToken: 'your-access-token'
 *                   refreshToken: 'your-refresh-token'
 *       400:
 *         description: Invalid Google ID token or other error
 *       500:
 *         description: Internal server error
 */
router.post('/google-login', googleLogin);

/**
 * @swagger
 * /users/:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the user's image URL and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The user ID
 *                 example: "60d0fe4f5311236168a109ca"
 *               imageUrl:
 *                 type: string
 *                 description: The URL of the user's profile image
 *                 example: "image/path/here"
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: "Updated User"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user ID
 *                       example: "60d0fe4f5311236168a109ca"
 *                     email:
 *                       type: string
 *                       description: The user's email
 *                       example: "user@example.com"
 *                     imageUrl:
 *                       type: string
 *                       description: The URL of the user's profile image
 *                       example: "new/image/path/here"
 *                     name:
 *                       type: string
 *                       description: The user's name
 *                       example: "Updated User"
 *       500:
 *         description: Internal Server Error
 */
router.put('/', updateUser)
export default router;