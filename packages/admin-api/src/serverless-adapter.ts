// packages/admin-api/src/serverless-adapter.ts
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AdminServer } from './server.js';
import { 
  verifyToken, 
  requireRole, 
  requireScope 
} from '@banking-sim/auth-service';

// This function will be imported by your Vercel serverless functions
export function createAdminHandler(bankId: string = 'default-bank-id') {
  // Create an instance of your server (without starting it)
  const adminServer = new AdminServer(bankId, 0); // Port isn't used in serverless
  
  // Get controller instances from our server
  const accountController = adminServer['accountController'];
  const customerController = adminServer['customerController'];
  // const transactionController = adminServer['transactionController'];
  const databaseController = adminServer['databaseController'];
  
  // Return a handler function that processes incoming requests
  return async function handler(req: Request, res: Response) {
    try {
      // Add bank ID to request context
      (req as any).bankId = bankId;
      
      // Apply CORS
      cors()(req, res, () => {});
      
      // Parse JSON body if not already parsed and content-type is application/json
      if (!req.body && req.method !== 'GET') {
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          try {
            req.body = JSON.parse(req.body || '{}');
          } catch (e) {
            req.body = {};
          }
        }
      }
      
      // Get the path and check for health endpoint first
      const path = req.url || '';
      
      // Health check endpoint (no auth required)
      if (path.startsWith('/admin/health') && req.method === 'GET') {
        return res.status(200).json({
          status: 'UP',
          bankId: bankId,
          timestamp: new Date().toISOString()
        });
      }
      
      // For API routes, verify authentication and roles
      if (path.startsWith('/admin')) {
        // Create a promise-based middleware handler
        const runMiddleware = (middleware: any) => {
          return new Promise((resolve, reject) => {
            middleware(req, res, (result: any) => {
              if (result instanceof Error) {
                return reject(result);
              }
              return resolve(result);
            });
          });
        };
        
        // Run auth middleware for API routes
        try {
          await runMiddleware(verifyToken);
          await runMiddleware(requireRole('admin'));
          
          // Apply scope checking for specific endpoints
          if (path.includes('/accounts') && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
            await runMiddleware(requireScope('admin:write'));
          } else if (path.includes('/accounts')) {
            await runMiddleware(requireScope('admin:read'));
          } else if (path.includes('/database')) {
            await runMiddleware(requireScope('admin:read'));
          }
        } catch (error: any) {
          // Handle auth errors
          if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
              success: false,
              error: 'Unauthorized',
              message: 'Invalid token'
            });
          }
          
          if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
              success: false,
              error: 'Unauthorized',
              message: 'Token expired'
            });
          }
          
          return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: error.message || 'Authentication failed'
          });
        }
      }
      
      // Route the request to the appropriate controller method
      
      // Customer endpoints
      if (path.startsWith('/admin/customers')) {
        if (path === '/admin/customers' && req.method === 'POST') {
          return customerController.createCustomer(req, res);
        } else if (path === '/admin/customers' && req.method === 'GET') {
          return customerController.getCustomers(req, res);
        } else if (path.match(/\/admin\/api\/customers\/[^\/]+$/) && req.method === 'GET') {
          return customerController.getCustomer(req, res);
        } else if (path.match(/\/admin\/api\/customers\/[^\/]+$/) && req.method === 'PUT') {
          return customerController.updateCustomer(req, res);
        } else if (path.match(/\/admin\/api\/customers\/[^\/]+$/) && req.method === 'DELETE') {
          return customerController.deleteCustomer(req, res);
        }
      }
      
      // Account endpoints
      else if (path.startsWith('/admin/accounts')) {
        if (path === '/admin/accounts' && req.method === 'POST') {
          return accountController.createAccount(req, res);
        } else if (path === '/admin/accounts' && req.method === 'GET') {
          return accountController.getAccounts(req, res);
        } else if (path.match(/\/admin\/api\/accounts\/[^\/]+$/) && req.method === 'GET') {
          return accountController.getAccount(req, res);
        } 
        // else if (path.match(/\/admin\/api\/accounts\/[^\/]+$/) && req.method === 'PUT') {
        //   return accountController.updateAccount(req, res);
        // } 
        // else if (path.match(/\/admin\/api\/accounts\/[^\/]+$/) && req.method === 'DELETE') {
        //   return accountController.deleteAccount(req, res);
        // } 
        // else if (path.match(/\/admin\/api\/accounts\/[^\/]+\/balance$/) && req.method === 'POST') {
        //   return accountController.updateBalance(req, res);
        // }
      }
      
      // Transaction endpoints
      // else if (path.startsWith('/admin/transaction')) {
      //   if (path.match(/\/admin\/api\/transaction\/[^\/]+$/) && req.method === 'GET') {
      //     return transactionController.getTransaction(req, res);
      //   }
      // }
      
      // Database endpoints
      else if (path.startsWith('/admin/database')) {
        if (req.method === 'GET') {
          return databaseController.getDatabaseSnapshot(req, res);
        } 
        // else if (path === '/admin/database/stats' && req.method === 'GET') {
        //   return databaseController.getDatabaseStats(req, res);
        // }
      }
      
      // If no route matches
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.method} ${path} not found`
      });
      
    } catch (err: any) {
      // General error handling
      console.error(`[ADMIN ERROR] ${err.message}`);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: err.message
      });
    }
  };
}
