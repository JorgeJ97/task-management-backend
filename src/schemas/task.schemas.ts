import { z } from 'zod';
import { CategoryTypes, PriorityLevels } from '../types/task.types';

// Esquema base para sanitización
const sanitizeString = z.string().trim().transform((val) => 
  val.replace(/[<>]/g, '') // Sanitización básica XSS
);

// Esquemas reutilizables
export const taskIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});

export const taskFiltersSchema = z.object({
  completed: z.coerce.boolean().optional(),
  category: z.enum(CategoryTypes).optional(),
  priority: z.enum(PriorityLevels).optional(),
  search: sanitizeString.optional(),
  deadlineFrom: z.coerce.date().optional(),
  deadlineTo: z.coerce.date().optional(),
  createdAtFrom: z.coerce.date().optional(),
  createdAtTo: z.coerce.date().optional()
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').transform((val) => val.replace(/[<>]/g, '')),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').transform((val) => val.replace(/[<>]/g, '')).optional(),
  category: z.enum(CategoryTypes),
  priority: z.enum(PriorityLevels).default(PriorityLevels.MEDIUM),
  deadline: z.coerce.date()
    .refine(date => date > new Date(), 'Deadline must be a future date')
    .optional(),
  completed: z.boolean().default(false)
}).strict(); // ← No permite campos adicionales

export const updateTaskSchema = createTaskSchema.partial().strict();

// Esquema para params de la URL
export const taskParamsSchema = z.object({
  id: taskIdSchema
});

// Inferir tipos de los esquemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;