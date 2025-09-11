import { CategoryTypes, PriorityLevels } from "../types/task.types";
import type { CreateTaskData } from "../types/task.types";


export class TaskFactory {
    private static DEFAULT_DESCRIPTION = "Sin descripción";
    private static DEFAULT_COMPLETED = false;

    static createTask(taskData: CreateTaskData): CreateTaskData {
        switch (taskData.category) {
            case CategoryTypes.URGENT:
                taskData.priority = taskData.priority || PriorityLevels.HIGH;
                taskData = this.setDefaultValues(taskData);
                break;
            case CategoryTypes.WORK:
                taskData.priority = taskData.priority || PriorityLevels.MEDIUM;
                taskData = this.setDefaultValues(taskData);
                break;
            case CategoryTypes.PERSONAL:
                taskData.priority = taskData.priority || PriorityLevels.LOW;
                taskData = this.setDefaultValues(taskData);
                break;
            case CategoryTypes.REMINDER:
                taskData.priority = taskData.priority || PriorityLevels.MEDIUM;
                taskData = this.setDefaultValues(taskData);
                break;
            case CategoryTypes.GENERAL:
                taskData.priority = taskData.priority || PriorityLevels.MEDIUM;
                taskData = this.setDefaultValues(taskData);
                break;
            default:
                taskData.category = CategoryTypes.GENERAL;
                taskData.priority = taskData.priority || PriorityLevels.MEDIUM;
                taskData = this.setDefaultValues(taskData);
    }

    return taskData;
    }

    static setDefaultValues(taskData: CreateTaskData): CreateTaskData {
        taskData.description = taskData.description || TaskFactory.DEFAULT_DESCRIPTION;
        taskData.completed = taskData.completed || TaskFactory.DEFAULT_COMPLETED;
        return taskData;
    }
}