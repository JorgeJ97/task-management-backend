import mongoose from "mongoose";
import { Task, type ITask } from "../entities/task.entity";
import type { ITaskRepository } from "../interfaces/repositories/task-repository.interface";
import type { CategoryAggregationResult, CreateTaskData, MongoTaskQuery, PriorityAggregationResult } from "../types/task.types";


export class TaskRepository implements ITaskRepository<ITask> {

    async create(taskData: CreateTaskData): Promise<ITask> {
        return await Task.create(taskData);
    }

    async getTasksByPriority(userId:string): Promise<PriorityAggregationResult[]> {
        return await Task.aggregate([
            { $match: { userId } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);
    }

    async getTasksByCategory(userId:string): Promise<CategoryAggregationResult[]> {
        return await Task.aggregate([
            { $match: { userId } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
    }

    getTotalTasks(userId:string): Promise<number> {
        return Task.countDocuments({ userId });
    }
    getCompletedTasks(userId:string): Promise<number> {
        return Task.countDocuments({ userId, completed: true });
    }
    
    async findTasksWithPagination(query: MongoTaskQuery, page: number, limit: number): Promise<{tasks: ITask[] | [], total: number}> {
              const [tasks, total] = await Promise.all([
                Task.find(query)
                  .sort({ createdAt: -1, _id: 1 }) // Ordenar por fecha de creación descendente
                  .skip((page - 1) * limit)
                  .limit(limit)
                  .lean() // Retorna objetos JavaScript planos en lugar de documentos Mongoose
                  .exec(),
                Task.countDocuments(query).exec()
              ]);
              if(page===1 && tasks.length===0){
                return {tasks: [], total: 0};
              }

              return {tasks, total};
        
    }


    async update(userId: string,id:string, updates: Partial<ITask>): Promise<ITask | null> {
        // Validar que el ID es un ObjectId válido
        if(!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid task ID format');

        // Actualizar solo si la tarea pertenece al usuario
        const updatedTask = await Task.findOneAndUpdate(
            { 
                _id: id, 
                userId // Verificar ownership 
            },
            {
                ...updates,
            },
            { 
                new: true, // Retornar documento actualizado
                runValidators: true // Ejecutar validadores del schema
            }
        );
        return updatedTask;
    }

    async delete(id: string, userId: string): Promise<ITask | null> {
        // Validar que el ID es un ObjectId válido
        if(!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid task ID format');

        return await Task.findOneAndDelete(
            { _id: id,
              userId
             }

        )
    }
    
    async findOne(id:string, userId:string ): Promise<ITask | null> {
        // Validar que el ID es un ObjectId válido
        if(!mongoose.Types.ObjectId.isValid(id)) throw new Error('Invalid task ID format'); 
        return await Task.findOne({ _id: id, userId });
    }


}