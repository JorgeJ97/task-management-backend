import {  type ITask } from "../entities/task.entity";
import type { ITaskService } from "../interfaces/services/task-service.interface";
import { CategoryTypes, PriorityLevels, type CreateTaskData, type PaginationInfo, type PriorityAggregationResult, type TaskFilters, type TasksResponse, type TaskStats } from "../types/task.types";
import type { ITaskRepository } from "../interfaces/repositories/task-repository.interface";
import { Singleton } from "../utils/singleton";
import { TaskFactory } from "../utils/task-factory";
import type { Logger } from "../utils/logger";

@Singleton
export class TaskService implements ITaskService <ITask>   {
    private readonly logger : Logger;
    private readonly taskRepository: ITaskRepository<ITask>;

    constructor(taskRepository: ITaskRepository<ITask>, logger: Logger) {
        this.taskRepository = taskRepository;
        this.logger = logger;
    }

    async createTask(taskData: CreateTaskData): Promise<ITask> {
        try {
            let newTask = TaskFactory.createTask(taskData);
            return await this.taskRepository.create(newTask);
            
        } catch (error) {
            this.logger.error(`Error creating user task: ${(error as Error).message}`);
            throw error;
        }
    }
    async getUserTasks(userId: string, filters: TaskFilters, page: number=1, limit: number=10): Promise<TasksResponse<ITask>> {
            try {

         // Validar parámetros
            const validatedPage = Math.max(1, page);
            const validatedLimit = Math.min(Math.max(1, limit), 100);
 

            // Construir query de filtros
            const query = this.buildQuery(userId, filters);
            
            // Ejecutar consultas en paralelo para mejor performance
            const {tasks, total} = await this.taskRepository.findTasksWithPagination(query, page, limit);

                  // Calcular información de paginación
            const totalPages = Math.ceil(total / validatedLimit);
      
            const pagination: PaginationInfo = {
                page: validatedPage,
                limit: validatedLimit,
                total,
                pages: totalPages,
                hasNext: validatedPage < totalPages,
                hasPrev: validatedPage > 1
            };

            this.logger.info(`Fetched ${tasks.length} tasks for user ${userId}`);
      
            return {
                tasks,
                pagination
            }
    }   catch (error) {
            this.logger.error(`Error in getUserTasks: ${(error as Error).message}`);
            throw error;
    }
    }


    async updateTask(userId: string,id:string, updates: Partial<ITask>): Promise<ITask | null> {
        try {

            // Filtrar campos que NO deben ser actualizables por seguridad
            const {
                _id,
                userId: userIdField,
                userEmail,
                createdAt,
                updatedAt,
                ...allowedUpdates
                } = updates;

            // Validar que hay algo que actualizar
            if (Object.keys(allowedUpdates).length === 0) {
                throw new Error('No valid fields to update');}

            return await this.taskRepository.update(userId, id, allowedUpdates);
        }
        catch (error) {
            this.logger.error(`Error updating task: ${(error as Error).message}`);
            throw error;
        }
        
    }


    async deleteTask(id: string, userId: string): Promise<ITask | null> {
        try {
            return await this.taskRepository.delete(id, userId);
            
        } catch (error) {
            this.logger.error(`Error deleting task: ${(error as Error).message}`);
            throw error;
            
        }
    }

    async toggleTaskCompletion(id: string, userId: string): Promise<ITask | null> {
    try {
        const task = await this.taskRepository.findOne(id, userId);
        if (!task) return null;
        
        return await this.taskRepository.update(userId, id, { 
            completed: !task.completed 
        });
    } catch (error) {
        this.logger.error(`Error toggling task completion: ${(error as Error).message}`);
        throw error;
    }
}


    async getUserStats(userId: string): Promise<TaskStats> {
        try {
            const totalTasks = await this.taskRepository.getTotalTasks(userId);
            const completedTasks = await this.taskRepository.getCompletedTasks(userId);
      
        // Inicializar con ceros para todas las categorías y prioridades
            const categoryStats: Record<CategoryTypes, number> = {
                [CategoryTypes.PERSONAL]: 0,
                [CategoryTypes.WORK]: 0,
                [CategoryTypes.URGENT]: 0,
                [CategoryTypes.REMINDER]: 0,
                [CategoryTypes.GENERAL]: 0
            };
      
            const priorityStats: Record<PriorityLevels, number> = {
                [PriorityLevels.LOW]: 0,
                [PriorityLevels.MEDIUM]: 0,
                [PriorityLevels.HIGH]: 0
            };
      
        // Obtener estadísticas por categoría
            const tasksByCategory = await this.taskRepository.getTasksByCategory(userId);
      
            tasksByCategory.forEach((item: { _id: CategoryTypes; count: number }) => {
                categoryStats[item._id] = item.count;
            });
      
        // Obtener estadísticas por prioridad
            const tasksByPriority = await this.taskRepository.getTasksByPriority(userId);
      
            tasksByPriority.forEach((item) => {
                priorityStats[item._id] = item.count;
            });

            return {
                totalTasks,
                completedTasks,
                pendingTasks: totalTasks - completedTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
                tasksByCategory: categoryStats,
                tasksByPriority: priorityStats
            };
    } catch (error) {
        this.logger.error(`Error getting user stats: ${(error as Error).message}`);
        throw error;
    }
  }

    private buildQuery(userId: string, filters: TaskFilters): any {
        const query: any = { userId };
    
        // Filtro por estado de completado
        if (filters.completed !== undefined) {
            query.completed = filters.completed;
        }
    
        // Filtro por categoría
        if (filters.category) {
            query.category = Array.isArray(filters.category) 
                ? { $in: filters.category } 
                : filters.category;
       }

        // Filtro por prioridad (ahora acepta array)
        if (filters.priority) {
            query.priority = Array.isArray(filters.priority) 
                ? { $in: filters.priority } 
                : filters.priority;
       }
    
        // Filtro por fecha de vencimiento
        if (filters.deadlineFrom || filters.deadlineTo) {
            query.deadline = {};
            if (filters.deadlineFrom) {
                query.deadline.$gte = new Date(filters.deadlineFrom);
            }
            if (filters.deadlineTo) {
                query.deadline.$lte = new Date(filters.deadlineTo);
            }
        }
    
        // Búsqueda en título y descripción
        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } }
           ];
        }
    
        // Filtro por rango de fechas de creación
        if (filters.createdAtFrom || filters.createdAtTo) {
            query.createdAt = {};
            if (filters.createdAtFrom) {
               query.createdAt.$gte = this.parseDate(filters.createdAtFrom);
            }
            if (filters.createdAtTo) {
                query.createdAt.$lte = this.parseDate(filters.createdAtTo);
           }
        }
    
        return query;
  }

      // Método auxiliar para parsear fechas de forma segura
    private parseDate(date: string | Date): Date {
        if (date instanceof Date) {
            return date;
        }
        
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error(`Invalid date format: ${date}`);
        }
        
        return parsedDate;
    }

}