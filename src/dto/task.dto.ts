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
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
    category?: CategoryTypes | undefined;
    priority?: PriorityLevels | undefined;
    deadline?: Date | undefined;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    statusCode: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}