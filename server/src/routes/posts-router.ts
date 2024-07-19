import express from 'express';
import { getAll, addPost, updatePost, deletePost } from '../controllers/posts-controller';

const router = express.Router();

// Get all posts
router.get('/', getAll);

// Create a new post
router.post('/', addPost);

// Update a post
router.put('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

export default router;