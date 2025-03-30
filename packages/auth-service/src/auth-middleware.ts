// packages/auth-service/src/auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth-service';

// JWT secret (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authService = new AuthService();

// packages/auth-service/src/auth-middleware.ts
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'No token provided'
        });
      }
      
      const token = authHeader.split(' ')[1];
      
      try {
        const user = authService.verifyToken(token);
        req.user = user;
        next();
      } catch (error: unknown) {
        // Handle different types of token errors
        let errorMessage = 'Invalid token';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          if (errorMessage.includes('User no longer exists')) {
            return res.status(401).json({
              error: 'Unauthorized',
              message: 'User account has been deleted'
            });
          } else if (errorMessage.includes('User role has changed')) {
            return res.status(403).json({
              error: 'Forbidden',
              message: 'User permissions have changed, please log in again'
            });
          } else if (errorMessage.includes('User customer ID has changed')) {
            return res.status(403).json({
              error: 'Forbidden',
              message: 'User account has been modified, please log in again'
            });
          } else if (errorMessage.includes('jwt expired')) {
            return res.status(401).json({
              error: 'Unauthorized',
              message: 'Token has expired'
            });
          }
        }
        
        return res.status(401).json({
          error: 'Unauthorized',
          message: errorMessage
        });
      }
    } catch (error: unknown) {
      // Handle unexpected errors
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: errorMessage
      });
    }
  };
  
// Middleware to check scope
export const requireScope = (scope: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.user.scopes.includes(scope)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Insufficient scope, ${scope} is required`
      });
    }
    
    next();
  };
};

// Middleware to check role
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Role ${role} is required`
      });
    }
    
    next();
  };
};

// Middleware to check customer access
export const requireOwnCustomerData = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Admin can access any data
  if (req.user.role === 'admin') {
    return next();
  }
  
  // For customers, check if they're accessing their own data
  const requestedCustomerId = req.params.customerId || req.query.customer_id as string;
  
  if (!requestedCustomerId || requestedCustomerId !== req.user.customerId) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'You can only access your own data'
    });
  }
  
  next();
};
