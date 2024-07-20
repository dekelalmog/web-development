import mongoose, { Schema } from 'mongoose';

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    tokens: string[];
    imageUrl?: string;
}

const userSchema: Schema = new Schema({
    id: { type: Number },
    name: { type: String},
    email: { type: String, required: true },
    password: { type: String },
    tokens: { type: [String], required: true },
    imageUrl: { type: String }
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;