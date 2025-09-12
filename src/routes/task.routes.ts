import express from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import type { ITaskService } from '../interfaces/services/task-service.interface';
import {
  createTaskRouteSchema,
  updateTaskRouteSchema,
  getTasksRouteSchema,
  taskByIdRouteSchema,
  toggleCompletionRouteSchema
} from '../schemas/route.schemas';
import type { ITask } from '../entities/task.entity';
import type { Logger } from '../utils/logger';


export const createTaskRouter = (taskService: ITaskService<ITask>, logger: Logger) => {
  const router = express.Router();
  const taskController = new TaskController(taskService, logger);

  router.use(authenticate);

  // GET /api/tasks - Con validación de query params
  router.get('/', validate(getTasksRouteSchema), taskController.getUserTasks.bind(taskController));

  // POST /api/tasks/create - Con validación del body
  router.post('/create', validate(createTaskRouteSchema), taskController.createTask.bind(taskController));

  // PUT /api/tasks/update/:id - Con validación de params y body
  router.put('/update/:id', validate(updateTaskRouteSchema), taskController.updateTask.bind(taskController));

  // PATCH /api/tasks/:id/toggle - Con validación de params
  router.patch('/:id/toggle', validate(toggleCompletionRouteSchema), taskController.toggleTaskCompletion.bind(taskController));

  // DELETE /api/tasks/delete/:id - Con validación de params
  router.delete('/delete/:id', validate(taskByIdRouteSchema), taskController.deleteTask.bind(taskController));

  return router;
};