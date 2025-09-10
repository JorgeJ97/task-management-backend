export enum CategoryTypes{
    PERSONAL = 'personal',
    WORK = 'work',
    URGENT = 'urgent',
    REMINDER = 'reminder',
    GENERAL = 'general'
}

export enum PriorityLevels {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
} 
export interface TaskFilters {
    completed?: boolean;
    category?: CategoryTypes;
    priority?: PriorityLevels;
    search?: string;
    deadlineFrom?: Date;
    deadlineTo?: Date;
}
export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    tasksByCategory: Record<CategoryTypes, number>;
    tasksByPriority: Record<PriorityLevels, number>;
}
export interface CreateTaskData {
    title: string;
    description?: string;
    completed?: boolean;
    category: CategoryTypes;
    priority?: PriorityLevels;
    deadline?: Date;
    userId: string;
    userEmail: string;
}

export interface UpdateTaskData extends Partial<Omit<CreateTaskData, 'userId' | 'userEmail'>> {}