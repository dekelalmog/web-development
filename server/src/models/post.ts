import mongoose, { Schema, Document } from 'mongoose';

interface Comment {
    owner: string;
    text: string;
}

interface Post extends Document {
    id: string;
    description: string;
    imageUrl: string;
    owner: string;
    comments: Comment[];
}

const postSchema: Schema = new Schema({
    id: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    owner: { type: String, required: true },
    comments: [{ owner: String, text: String }]
});

const PostModel = mongoose.model<Post>('Post', postSchema);

export default PostModel;