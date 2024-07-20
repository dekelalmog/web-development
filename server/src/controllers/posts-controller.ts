import { Request, Response } from 'express';
import PostModel from '../models/post';
import { Comment } from '../models/comment';

const model = PostModel

// Get all posts
export async function getAll(req: Request, res: Response) {
    try {
        const posts = await model.find({})
        
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).send(err.message);
    }
}

// Add a post
export async function addPost(req: Request, res: Response) {
    const post = req.body;
    try {
        const newPost = await model.create(post);
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updatePost(req: Request, res: Response) {
    const post = req.body

    try {
        const updated = await model.findByIdAndUpdate({_id: post._id}, post, {new: true});
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deletePost(req: Request, res: Response) {
    const postId = req.params.id

    try {
        await model.findByIdAndDelete(postId);
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function addComment(req: Request, res: Response) {
    console.log(req)
    const comment: Comment = {
        // owner: req.user.id,
        owner: req.body.owner,
        text: req.body.text,
    }

    const postId = req.params.id
    console.log(postId)

    try {
        const post = await model.findById(postId)
        post.comments.push(comment)
        const updatedPost = await model.findByIdAndUpdate(postId, post, {new: true})
        res.status(201).json(updatedPost)
    } catch (err) {
        res.status(500).send(err.message);
    }
}
