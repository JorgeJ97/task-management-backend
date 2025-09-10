import type { ITask } from "../entities/task.entity";
import type { ITaskService } from "../interfaces/services/task-service.interface";
import type { CreateTaskData, TaskFilters, TaskStats } from "../types/task.types";
import type { ITaskRepository } from "../interfaces/repositories/task-repository.interface";
import { Singleton } from "../utils/singleton";

@Singleton
export class TaskService implements ITaskService <ITask>   {

    private readonly taskRepository: ITaskRepository<ITask>;

    constructor(taskRepository: ITaskRepository<ITask>) {
        this.taskRepository = taskRepository;
    }

    async createTask(taskData: CreateTaskData): Promise<ITask> {

        throw new Error("Method not implemented.");
    }
    getUserTasks(userId: string, filters: TaskFilters, page: number, limit: number): Promise<{ tasks: ITask[]; pagination: any; }> {
        throw new Error("Method not implemented.");
    }
    updateTask(id: string, userId: string, updates: Partial<ITask>): Promise<ITask | null> {
        throw new Error("Method not implemented.");
    }
    deleteTask(id: string, userId: string): Promise<ITask | null> {
        throw new Error("Method not implemented.");
    }
    getUserStats(userId: string): Promise<TaskStats> {
        throw new Error("Method not implemented.");
    }


}