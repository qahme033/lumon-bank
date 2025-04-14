// api/admin/health.ts
import { createAuthHandler } from '@banking-sim/auth-service/src/serverless-adapter.js';
import { Request, Response } from 'express';

const adminHandler = createAuthHandler();

export default function handler(req: Request, res: Response) {
  // Set the URL path for processing by the handler
  req.url = '/auth/health';
  req.method = 'GET';
  
  // Pass to your admin handler
  return adminHandler(req, res);
}