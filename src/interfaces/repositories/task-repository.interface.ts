import type { CreateTaskData } from "../../types/task.types";

export interface ITaskRepository <KTask> {
    create(taskData: CreateTaskData): Promise<KTask>;
}