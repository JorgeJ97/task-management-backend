import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { createTaskRouter } from './routes/task.routes';
import { TaskService } from './services/task.service';
import { TaskRepository } from './repositories/task.repository';
import {Database} from './config/database';
import { Logger } from './utils/logger';
import { config } from './config/config';
import { ApiResponseFactory } from './utils/api-response';
import swaggerUi from "swagger-ui-express";

class App {
  public app: express.Application;
  private logger: Logger;

  constructor() {
    this.app = express();
    this.logger = new Logger();
    this.initializeMiddlewares();
  }

  private initializeMiddlewares(): void {
    // Seguridad
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: config.FRONTEND_URL,
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // límite de 100 requests por ventana
      message: 'Too many requests from this IP'
    });
    this.app.use(limiter);

    // Logging
    this.app.use(morgan('combined'));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API routes
    const taskRepository = new TaskRepository();
    const taskService = new TaskService(taskRepository, this.logger);
    this.app.use('/api/tasks', createTaskRouter(taskService, this.logger));

    // 404 handler
    // this.app.use('/*', (req, res) => {
    //   res.status(404).json({ error: 'Route not found' });
    // });
  }

  private initializeErrorHandling(): void {
    // Error handling middleware
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.logger.error('Unhandled error:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json(ApiResponseFactory.error('Validation Error', 400, error.message));
      }

      if (error.name === 'UnauthorizedError') {
        return res.status(401).json(ApiResponseFactory.error('Invalid token', 401, error.message));
      }

      res.status(error.status || 500).json(ApiResponseFactory.error('Internal server error', 500, error.message));
    });
  }

  public async initializeDatabase(): Promise<void> {
    try {
      const database = new Database(this.logger);
      await database.connect(config.DATABASE_URL);
      this.logger.info('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection failed:', error as Error);
      process.exit(1);
    }
  }
  public initialize(): void {
    this.initializeDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public async start(port: number | string): Promise<void> {
    try {
      this.initialize();
      
      this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
        this.logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      this.logger.error('Failed to start server:', error as Error);
      process.exit(1);
    }
  }
}

export default App;