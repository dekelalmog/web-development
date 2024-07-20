import express from 'express';
import multer from "multer"
import path from 'path';
import { getAll, addPost, updatePost, deletePost, addComment } from '../controllers/posts-controller';

const router = express.Router();

const base = "http://127.0.0.1:3000/"

// Get all posts
router.get('/', getAll);

// Create a new post
router.post('/', addPost);

// Update a post
router.put('/:id', updatePost);

// Add a Comment
router.put('/comment/:id', addComment)

// Delete a post
router.delete('/:id', deletePost);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage });

router.post('/image', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});

export default router;