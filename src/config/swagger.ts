import swaggerJSDoc from 'swagger-jsdoc';
import { type SwaggerOptions } from 'swagger-ui-express';
import { CategoryTypes, PriorityLevels } from '../types/task.types';
import { boolean, success } from 'zod';

const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Tasks Management API',
    version: '1.0.0',
    description: 'API completa con autenticación Auth0 para gestión de tareas',
    contact: {
      name: 'Tu Equipo',
      email: 'dev@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo local'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token de Auth0. Formato: Bearer <token>'
      }
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
          error: { type: 'string' },
          statusCode: { type: 'integer' }
        }
      },
        ApiResponseTasks: {
         type: 'object',
         properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { $ref: '#/components/schemas/Task'},
          statusCode: { type: 'integer' }
        }
      },

      ApiResponseStats: {
        type: 'object',
        properties: {
          success: { type: 'boolean'},
          message: { type: 'string'},
          data: {$ref: '#/components/schemas/TaskStats'},
          statusCode: { type: 'integer'}
        }
      },
      
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { 
            type: 'array',
            items:  { $ref: '#/components/schemas/Task' }
          },
          statusCode: { type: 'integer' },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              pages: { type: 'integer' },
              hasNext: { type: boolean},
              hasPrev: { type: boolean}
            }
          }
        }
      },

      // SCHEMAS DE TAREAS
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string'},
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          completed: { type: 'boolean' },
          category: { 
            type: 'string', 
            enum: Object.values(CategoryTypes) 
          },
          priority: { 
            type: 'string', 
            enum: Object.values(PriorityLevels),
            nullable: true 
          },
          deadline: { type: 'string', format: 'date-time', nullable: true },
          userId: { type: 'string' },
          userEmail: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },

      CreateTaskData: {
        type: 'object',
        required: ['title', 'category'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          completed: { type: 'boolean' },
          category: { 
            type: 'string', 
            enum: Object.values(CategoryTypes) 
          },
          priority: { 
            type: 'string', 
            enum: Object.values(PriorityLevels),
            nullable: true 
          },
          deadline: { type: 'string', format: 'date-time', nullable: true },
        }
      },

      UpdateTaskData: {
        type: 'object',
        properties: {
          _id: { type: 'string', format: 'uuid' },
          title: { type: 'string', nullable: true },
          description: { type: 'string', nullable: true },
          completed: { type: 'boolean', nullable: true },
          category: { 
            type: 'string', 
            enum: Object.values(CategoryTypes),
            nullable: true 
          },
          priority: { 
            type: 'string', 
            enum: Object.values(PriorityLevels),
            nullable: true 
          },
          deadline: { type: 'string', format: 'date-time', nullable: true },
          userId:'string'
        }
      },

      TaskStats: {
        type: 'object',
        properties: {
          totalTasks: { type: 'integer' },
          completedTasks: { type: 'integer' },
          pendingTasks: { type: 'integer' },
          completionRate: { type: 'number', format: 'float' },
          tasksByCategory: {
            type: 'object',
            additionalProperties: { type: 'integer' }
          },
          tasksByPriority: {
            type: 'object',
            additionalProperties: { type: 'integer' }
          }
        }
      },

    },
    responses: {
      UnauthorizedError: {
        description: 'Token no válido o faltante',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Unauthorized',
              error: 'Invalid token',
              statusCode: 401
            }
          }
        }
      },
      ValidationError: {
        description: 'Error de validación de datos',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Validation error',
              error: '[{"field":"title","message":"Title is required"}]',
              statusCode: 400
            }
          }
        }
      },
      NotFoundError: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Not found',
              error: 'Task not found',
              statusCode: 404
            }
          }
        }
      }
    },
    parameters: {
      TaskIdParam: {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'ID único de la tarea (MongoDB Object)'
      }
    }
  },
  tags: [
    {
      name: 'Auth',
      description: 'Autenticación con Auth0'
    },
    {
      name: 'Tasks',
      description: 'Gestión de tareas'
    },
    {
      name: 'Statistics',
      description: 'Estadísticas y reportes'
    }
  ]
};

// Configuración de Swagger JSDoc
const options: swaggerJSDoc.Options = {
  definition: swaggerConfig,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts',
    './src/middlewares/*.ts'
  ]
};

// Configuración de la UI de Swagger
export const swaggerUiOptions: SwaggerOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
  `,
  customSiteTitle: 'Tasks API - Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true
  }
};

export const specs = swaggerJSDoc(options);
