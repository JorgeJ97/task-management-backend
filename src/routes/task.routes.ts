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

  /**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener tareas con filtros avanzados
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema: { type: boolean }
 *         description: Filtrar por estado de completado
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [personal, work, urgent, reminder, general] }
 *         description: Filtrar por categoría
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *         description: Filtrar por prioridad
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Búsqueda textual en título y descripción
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *         description: Límite de resultados por página
 *     responses:
 *       200:
 *         description: Lista de tareas paginada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
  router.get('/', validate(getTasksRouteSchema), taskController.getUserTasks.bind(taskController));

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Obtener estadísticas de tareas
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de tareas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseStats'
 */
  router.get('/stats', taskController.getUserStats.bind(taskController))

  /**
 * @swagger
 * /api/tasks/create:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskData'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseTasks'
 */

  router.post('/create', validate(createTaskRouteSchema), taskController.createTask.bind(taskController));



  /**
 * @swagger
 * /api/tasks/update/{id}:
 *   put:
 *     summary: Actualizar una tarea existente
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: ID de la tarea a eliminar (MongoDB ObjectID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskData'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseStats'
 */
  router.put('/update/:id', validate(updateTaskRouteSchema), taskController.updateTask.bind(taskController));

  /**
 * @swagger
 * /api/tasks/toggle/{id}:
 *   patch:
 *     summary: Alternar estado de completado de una tarea
 *     description: Cambia el estado de completado de una tarea (true/false)
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a eliminar (MongoDB ObjectID)
 *     responses:
 *       200:
 *         description: Estado de la tarea alternado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseStats'
 *       400:
 *         description: ID inválido o parámetros incorrectos
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
  router.patch('/toggle/:id', validate(toggleCompletionRouteSchema), taskController.toggleTaskCompletion.bind(taskController));


  /**
 * @swagger
 * /api/tasks/delete/{id}:
 *   delete:
 *     summary: Eliminar una tarea permanentemente
 *     description: Elimina una tarea específica por su ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a eliminar (MongoDB ObjectID)
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: ID inválido o parámetros incorrectos
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
  router.delete('/delete/:id', validate(taskByIdRouteSchema), taskController.deleteTask.bind(taskController));

  return router;
};