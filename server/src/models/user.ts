import mongoose, { Schema, Document } from 'mongoose';

export interface User {
    id: number;
    email: string;
    password: string;
    tokens: string[];
}

const userSchema: Schema = new Schema({
    id: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    tokens: { type: [String], required: true }
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;