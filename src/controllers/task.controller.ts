import type { Request, Response, NextFunction } from 'express';
import type { ITaskService } from '../interfaces/services/task-service.interface';
import { ApiResponseFactory } from '../utils/api-response';
import { Logger } from '../utils/logger';
import type { ITask } from '../entities/task.entity';
import type { Auth0User } from '../types/user.types';
import type { CreateTaskInput, PaginationInput, TaskFiltersInput, UpdateTaskInput } from '../schemas/task.schemas';

declare global {
  namespace Express {
    interface Request {
      user: Auth0User;
    }
  }
}

export class TaskController {
  private taskService: ITaskService<ITask>;
  private logger: Logger;

  constructor(taskService: ITaskService<ITask>, logger: Logger) {
    this.taskService = taskService;
    this.logger = logger;
  }

  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskData: CreateTaskInput = req.body as CreateTaskInput;

      const task = await this.taskService.createTask(
        {...taskData,
            userId: req.user.id,
            userEmail: req.user.email} );

      res.status(201).json(ApiResponseFactory.success(task, 'Task created successfully', 201));
    } catch (error) {
      this.logger.error('Error in createTask controller:', error as Error);
      next(error);
    }
  }

  async getUserTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: TaskFiltersInput = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const result = await this.taskService.getUserTasks(
        req.user.id,
        filters,
        pagination.page,
        pagination.limit
      );

      res.json(ApiResponseFactory.paginated(result.tasks, result.pagination));
    } catch (error) {
      this.logger.error('Error in getUserTasks controller:', error as Error);
      next(error);
    }
  }


  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.params.id) {
            res.status(400).json(ApiResponseFactory.error('Task ID is required', 400, 'Bad Request'));
            return;
        }

      const taskId = req.params.id;
      const updates: UpdateTaskInput = req.body as UpdateTaskInput;

      const task = await this.taskService.updateTask(req.user.id, taskId, updates);
      
      if (!task) {
        res.status(404).json(ApiResponseFactory.error('Task not found', 404, 'Not Found'));
        return;
      }

      res.json(ApiResponseFactory.success(task, 'Task updated successfully'));
    } catch (error) {
      this.logger.error('Error in updateTask controller:', error as Error);
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(ApiResponseFactory.error('Task ID is required', 400, 'Bad Request'));
        return;
      }
      const task = await this.taskService.deleteTask(id, req.user.id);
      
      if (!task) {
        res.status(404).json(ApiResponseFactory.error('Task not found', 404, 'Not Found'));
        return;
      }

      res.json(ApiResponseFactory.success(null, 'Task deleted successfully'));
    } catch (error) {
      this.logger.error('Error in deleteTask controller:', error as Error);
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.taskService.getUserStats(req.user.id);
      res.json(ApiResponseFactory.success(stats, 'User stats retrieved successfully'));
    } catch (error) {
      this.logger.error('Error in getUserStats controller:', error as Error);
      next(error);
    }
  }

  async toggleTaskCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json(ApiResponseFactory.error('Task ID is required', 400, 'Bad Request'));
        return;
      }
      const task = await this.taskService.toggleTaskCompletion(id, req.user.id);
      
      if (!task) {
        res.status(404).json(ApiResponseFactory.error('Task not found', 404, 'Not Found'));
        return;
      }

      res.json(ApiResponseFactory.success(task, 'Task completion toggled successfully'));
    } catch (error) {
      this.logger.error('Error in toggleTaskCompletion controller:', error as Error);
      next(error);
    }
  }
}