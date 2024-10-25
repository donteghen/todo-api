import jwt from 'jsonwebtoken';
import mongoose, { Schema, Types } from 'mongoose';
import { IUser } from '../models/interfaces'; // Adjust the import path according to your project structure

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure you set this in your environment variables

type UserType = IUser & {
    _id: mongoose.Types.ObjectId
}
export const generateToken = (user: UserType): string => {
    const payload = {
        id: user._id, // or user.id depending on your user model
        role: user.role,
        team: user.team // If applicable, otherwise exclude this line
    };

    const options = {
        expiresIn: '1h' // Set the token expiration time as needed
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

export const toMongoId = (id: string ) => new Types.ObjectId(id);
export const mongoIdToString = (_id: Types.ObjectId ) => _id.toString();
