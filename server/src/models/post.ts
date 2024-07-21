import mongoose, { Schema, Document } from 'mongoose';
import { Comment } from './comment';

export interface Post extends Document {
    _id?: string;
    description: string;
    imageUrl?: string;
    owner: string;
    comments: Comment[];
}

const postSchema: Schema = new Schema({
    description: { type: String, required: true },
    imageUrl: { type: String },
    owner: { type: String, required: true },
    comments: [{ owner: String, text: String }]
});

const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;