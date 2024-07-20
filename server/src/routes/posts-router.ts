import express from 'express';
import multer from "multer"
import path from 'path';
import { getAll, addPost, updatePost, deletePost, addComment } from '../controllers/posts-controller';

const router = express.Router();

const base = "http://127.0.0.1:3000/"

/**
 * @swagger
 * tags:
 *  name: Post
 *  description: Posts API
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Post:
 *    type: object
 *    required:
 *      - description
 *      - owner
 *    properties:
 *      _id:
 *        type: string
 *        description: post ID
 *      description:
 *        type: string
 *        description: post text
 *      imageUrl:
 *        type: string
 *        description: image URL from the backend
 *      owner:
 *        type: string
 *        description: the user ID that owns the post
 *      comments:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            owner:
 *              type: string
 *            text: 
 *              type: string
 *        description: the posts comments
 *    example:
 *      description: 'cool post!'
 *      owner:       'Ben'
 * 
 */


/**
* @swagger
* /post/:
*   get:
*     summary: Get all posts
*     tags: [Post]
*     responses:
*       200:
*         description: File uploaded
*         content:
*           application/json:
*             schema: 
*               type: array
*               items:
*                 $ref: '#/components/schemas/Post'
*       500:
*         description: Internal server error
*/
router.get('/', getAll);

/**
 * @swagger
 * /post/:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.post('/', addPost);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updatePost);

/**
 * @swagger
 * /post/comment/{id}:
 *   put:
 *     summary: Add a comment to a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *                 description: The owner of the comment
 *               text:
 *                 type: string
 *                 description: The comment text
 *             example:
 *               owner: 'Jane'
 *               text: 'Great post!'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
router.put('/comment/:id', addComment);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Post]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deletePost);

export default router;