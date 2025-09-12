import type { CategoryAggregationResult, CreateTaskData, MongoTaskQuery, PriorityAggregationResult } from "../../types/task.types";

export interface ITaskRepository <KTask> {
    create(taskData: CreateTaskData): Promise<KTask>;
    findOne(id:string, userId:string ): Promise<KTask | null>;
    getTasksByPriority(userId:string): Promise<PriorityAggregationResult[]>;
    getTasksByCategory(userId:string): Promise<CategoryAggregationResult[]>;
    getTotalTasks(userId:string): Promise<number>;
    getCompletedTasks(userId:string): Promise<number>;
    update(userId: string,id:string, updates: Partial<KTask>): Promise<KTask | null>;
    delete(id: string, userId: string): Promise<KTask | null>;
    findTasksWithPagination(query: MongoTaskQuery, page: number, limit: number): Promise<{tasks:KTask[] | [], total:number}>;
}