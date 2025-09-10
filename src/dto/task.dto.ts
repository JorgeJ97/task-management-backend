import type { CategoryTypes, PriorityLevels } from "../types/task.types";

export interface CreateTaskDto {
    title: string;
    description?: string;
    completed?: boolean;
    category: CategoryTypes;
    priority?: PriorityLevels;
    deadline?: Date;
}

export interface UpdateTaskDto {
    id: string;
    title?: string;
    description?: string;
    completed?: boolean;
    category?: CategoryTypes;
    priority?: PriorityLevels;
    deadline?: Date;
}