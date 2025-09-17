import type { Request, Response, NextFunction} from 'express';
import { ZodObject, ZodError } from 'zod';
import { Logger } from '../utils/logger';

// Type guard para objetos
const isRecord = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null;

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Asignación más segura
      if (validatedData.body) req.body = validatedData.body;

      next();
    } catch (error) {
      const logger = new Logger();
      
      if (error instanceof ZodError) {
        logger.warn('Validation errors:', error.issues);
        
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      } else {
        logger.error('Unexpected validation error:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
        });
      }
    }
  };
};

// Sanitización global de inputs
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value.replace(/[<>&]/g, ''); // Sanitización básica XSS
    }
    if (Array.isArray(value)) {
      return value.map(sanitize);
    }
    if (isRecord(value)) {
      const sanitizedObj: Record<string, unknown> = {};
      for (const key in value) {
        sanitizedObj[key] = sanitize(value[key]);
      }
      return sanitizedObj;
    }
    return value;
  };

  req.body = sanitize(req.body) as any;
  req.query = sanitize(req.query) as any;
  req.params = sanitize(req.params) as any;

  next();
};