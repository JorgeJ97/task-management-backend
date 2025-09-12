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
    completed?: boolean | undefined;
    category?: CategoryTypes | undefined;
    priority?: PriorityLevels | undefined;
    search?: string | undefined;
    deadlineFrom?: Date | undefined;
    deadlineTo?: Date | undefined;
    createdAtFrom?: Date | undefined;
    createdAtTo?: Date | undefined;
}
export interface TaskStats {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionRate: number;
    tasksByCategory: Record<CategoryTypes, number>;
    tasksByPriority: Record<PriorityLevels, number>;
}
export interface CreateTaskData {
    title: string;
    description?: string | undefined;
    completed?: boolean | undefined;
    category: CategoryTypes;
    priority?: PriorityLevels | undefined;
    deadline?: Date | undefined;
    userId: string;
    userEmail: string;
}

export interface PriorityAggregationResult {
    _id: PriorityLevels;
    count: number;
}

export interface CategoryAggregationResult {
    _id: CategoryTypes;
    count: number;
}

export interface UpdateTaskData extends Partial<Omit<CreateTaskData, 'userId' | 'userEmail'>> {
    _id: string;
}

export interface MongoTaskQuery {
    userId: string;
    completed?: boolean;
    category?: CategoryTypes;
    priority?: PriorityLevels;
    deadline?: {
        $gte?: Date;
        $lte?: Date;
    };
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TasksResponse <KTask>{
    tasks: KTask[] | [];
    pagination: PaginationInfo;
}