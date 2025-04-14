// api/authorize.ts
import { createAuthHandler } from '@banking-sim/auth-service/src/serverless-adapter.js';
import { Request, Response } from 'express';

const authHandler = createAuthHandler();

export default function handler(req: Request, res: Response) {
  // Set the URL path for processing by the handler
  req.url = '/authorize';
  
  // Pass to your auth handler
  return authHandler(req, res);
}