import { z } from 'zod';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  taskFiltersSchema, 
  paginationSchema, 
  taskParamsSchema 
} from './task.schemas';

export const createTaskRouteSchema = z.object({
  body: createTaskSchema
});

export const updateTaskRouteSchema = z.object({
  params: taskParamsSchema,
  body: updateTaskSchema
});

export const getTasksRouteSchema = z.object({
  query: taskFiltersSchema.extend(paginationSchema.shape)
});

export const taskByIdRouteSchema = z.object({
  params: taskParamsSchema
});

export const toggleCompletionRouteSchema = z.object({
  params: taskParamsSchema
});