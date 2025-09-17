import mongoose, { Document, Schema } from "mongoose";
import { CategoryTypes, PriorityLevels } from "../types/task.types";

export interface ITask extends Document {
    title: string;
    description: string;
    completed: boolean;
    category: CategoryTypes;
    priority: PriorityLevels;
    deadline?: Date;
    userId: string;
    userEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema : Schema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxLenghth: [100, 'Title cannot be more than 100 characters'],
        trim: true
    },
    description: {
        type: String,
        maxLenghth: [500, 'Description cannot be more than 500 characters'],
        trim: true
    }
    ,completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum:{
            values: Object.values(CategoryTypes),
            message: 'Category must be one of: personal, work, urgent, reminder, general'
        },
        default: CategoryTypes.GENERAL
    },
    priority: {
        type: String,
        enum:{
            values: Object.values(PriorityLevels),
            message: 'Priority must be one of: low, medium, high'
        },
        default: PriorityLevels.MEDIUM
    },
    deadline: {
        type: Date,
        validate: {
            validator: function(this: ITask, value: Date) : boolean{
                return  !value || value > new Date();
            },
            message: 'Deadline must be a future date'
        } 
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    },
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        trim: true
    }
}, { timestamps: true

});
TaskSchema.index({ userId: 1, createdAt: -1});
TaskSchema.index({category:1, priority:1});
TaskSchema.index({completed:1, deadline:1});

export const Task = mongoose.model<ITask>('Task', TaskSchema);