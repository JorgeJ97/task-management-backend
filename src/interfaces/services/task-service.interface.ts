import type { CreateTaskDto } from "../../dto/task.dto";
import type { TaskFilters, TaskStats } from "../../types/task.types";

export interface ITaskService <KTask> {
  createTask(taskData: CreateTaskDto): Promise<KTask>;
  getUserTasks(
    userId: string, 
    filters: TaskFilters, 
    page: number, 
    limit: number
  ): Promise<{ tasks: KTask[]; pagination: any }>;
  updateTask(id: string, userId: string, updates: Partial<KTask>): Promise<KTask | null>;
  deleteTask(id: string, userId: string): Promise<KTask | null>;
  getUserStats(userId: string): Promise<TaskStats>;
}