import type { Request, Response, NextFunction } from 'express';
import { checkJwt, extractUserInfo } from '../config/auth0';
import { ApiResponseFactory } from '../utils/api-response';

// Middleware de autenticación
export const authenticate = [
  checkJwt,
  (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'UnauthorizedError') {
      return res.status(401).json(ApiResponseFactory.error('Invalid token', 401, error.message));
    }
    next();
  },
  extractUserInfo
];