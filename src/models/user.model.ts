import mongoose, { Document,ObjectId, Schema } from "mongoose";

export interface User extends Document {
    _id?: ObjectId;
    name?: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'super_admin';
    gender?: 'male' | 'female' | 'other';
    image?: string;
    address? : string;
}

const UserSchema: Schema<User> = new Schema<User>(
    {
        name: {
            type: String,
        },
        email: {
            required: true,
            type: String,
        },
        password: {
            required: true,
            type: String,
        },
        role: {
            required: true,
            type: String,
            enum: ['user', 'admin'],
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        image: {
            type: String,
        },
        address: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model<User>('users', UserSchema);