import type { UpdateTaskDto } from "../../dto/task.dto";
import type { CreateTaskData, TaskFilters, TasksResponse, TaskStats } from "../../types/task.types";

export interface ITaskService <KTask> {
  createTask(taskData: CreateTaskData): Promise<KTask>;
  getUserTasks(
    userId: string, 
    filters: TaskFilters, 
    page: number, 
    limit: number
  ): Promise<TasksResponse<KTask>>;
  updateTask(userId: string,id:string, update: UpdateTaskDto): Promise<KTask | null>;
  deleteTask(id: string, userId: string): Promise<KTask | null>;
  getUserStats(userId: string): Promise<TaskStats>;
  toggleTaskCompletion(id: string, userId: string): Promise<KTask | null>
}