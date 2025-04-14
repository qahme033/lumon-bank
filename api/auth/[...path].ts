// api/auth/[...path].js
import { createAuthHandler } from '@banking-sim/auth-service/src/serverless-adapter.js';
import { Request, Response } from 'express';

// Create the handler once (will be cached across invocations)
const authHandler = createAuthHandler();

export default function handler(req: Request, res: Response) {
  // Normalize the URL path
  if (!req.url.startsWith('/')) {
    req.url = '/' + req.url;
  }
  if(req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  
  // // Prepend "/auth" to the path if not already present
  // if (!req.url.startsWith('/auth') && !req.url.startsWith('/authorize')) {
  //   req.url = '/auth' + req.url;
  // }
  
  return authHandler(req, res);
}
