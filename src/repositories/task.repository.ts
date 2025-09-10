import { Task, type ITask } from "../entities/task.entity";
import type { ITaskRepository } from "../interfaces/repositories/task-repository.interface";
import type { CreateTaskData } from "../types/task.types";


export class TaskRepository implements ITaskRepository<ITask> {

    async create(taskData: CreateTaskData): Promise<ITask> {
        return await Task.create(taskData);
    }

}