// packages/auth-service/src/serverless-adapter.ts
import { AuthServer } from './auth-server.js';
import { Request, Response } from 'express';

// This function will be imported by your Vercel serverless function
export function createAuthHandler() {
  // Create an instance of your server (without port)
  const authServer = new AuthServer(0); // Port isn't used in serverless
  
  // Return a handler function that processes incoming requests
  return async function handler(req: Request, res: Response) {
    // Map the incoming path to your existing routes
    const path = req.url || '';
    
    // Add middleware processing (normally done by Express)
    if (!req.body && req.method !== 'GET') {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        req.body = JSON.parse(req.body || '{}');
      }
    }

          // Health check endpoint (no auth required)
          if (path.startsWith('/auth/health') && req.method === 'GET') {
            return res.status(200).json({
              status: 'UP',
              timestamp: new Date().toISOString()
            });
          }
    
    // Simulate route handling based on the path and method
    if (path.startsWith('/auth/login')) {
      if (req.method === 'GET') {
        return authServer.handleLoginPage(req, res);
      } else if (req.method === 'POST') {
        return authServer.handleLogin(req, res);
      }
    } else if (path.startsWith('/auth/register') && req.method === 'POST') {
      return authServer.handleRegister(req, res);
    } else if (path.startsWith('/auth/profile') && req.method === 'GET') {
      return authServer.handleProfile(req, res);
    } else if (path.startsWith('/authorize')) {
      if (req.method === 'GET') {
        return authServer.handleAuthorizeGet(req, res);
      } else if (req.method === 'POST') {
        return authServer.handleAuthorizePost(req, res);
      }
    }
    
    // If no route matches
    res.status(404).json({ error: 'Not found' });
  };
}
