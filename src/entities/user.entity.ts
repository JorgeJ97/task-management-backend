import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    last_name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema : Schema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        maxLenghth: [50, 'Name cannot be more than 50 characters'],
        trim: true
    },
    last_name: {
        type: String,
        require: [true, 'Last name is required'],
        maxLenghth: [50, 'Last name cannot be more than 50 characters'],
        trim: true
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true, 
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        maxLength: [100, 'Password cannot be more than 100 characters']
    }
}, {timestamps: true});

export const User = mongoose.model<IUser>('User', UserSchema);