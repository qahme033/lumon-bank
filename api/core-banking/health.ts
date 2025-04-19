// api/admin/health.ts
import { createCoreBankingHandler } from '@banking-sim/core-banking/src/serverless-adapter.js';
import { Request, Response } from 'express';

const adminHandler = createCoreBankingHandler('1');

export default function handler(req: Request, res: Response) {
  // Set the URL path for processing by the handler
  req.url = '/api/v1/health';
  req.method = 'GET';
  
  // Pass to your admin handler
  return adminHandler(req, res);
}