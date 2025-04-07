// packages/auth-service/src/auth-middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth-service.js';
import { consentAPI, ConsentPermission, ConsentStatus } from '@banking-sim/common';

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

    /**
 * Middleware to verify that the request has a valid, authorized customer consent
 * with the required permissions.
 * 
 * @param requiredPermissions - An array of ConsentPermission values required for the operation.
 */
    export function verifyConsent(requiredPermissions: ConsentPermission[]) {
      return async (req: Request, res: Response, next: NextFunction) => {
        // Look for a consent ID in headers ('x-consent-id') or query parameters ('consent_id').
        const consentId = req.headers['x-consent-id'] || req.query.consent_id;
        if (!consentId) {
          return res.status(400).json({ error: 'Consent ID is missing' });
        }
    
        try {
          const consent = await consentAPI.getConsent(String(consentId));
          if (!consent) {
            return res.status(404).json({ error: 'Consent not found' });
          }
          
          // Check that the consent is authorized.
          if (consent.status !== ConsentStatus.AUTHORIZED) {
            return res.status(403).json({ error: 'Consent is not authorized' });
          }
          
          // Check that the consent includes all the required permissions.
          const hasAllPermissions = requiredPermissions.every(permission =>
            consent.permissions.includes(permission)
          );
          
          if (!hasAllPermissions) {
            return res.status(403).json({ error: 'Insufficient consent permissions' });
          }
          
          // Optionally, attach the consent object to the request for further use.
          (req as any).consent = consent;
          
          next();
        } catch (error: any) {
          console.error('Error verifying consent:', error.message);
          return res.status(500).json({ error: 'Failed to verify consent' });
        }
      };
    }
      
  
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
