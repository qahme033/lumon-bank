// api/admin/[...path].ts
import { createAdminHandler } from '@banking-sim/admin-api/src/serverless-adapter.js';
import { Request, Response } from 'express';

// Get bank ID from environment variable or use default
const bankId = process.env.BANK_ID || 'default-bank-id';

// Create the handler once (will be cached across invocations)
const adminHandler = createAdminHandler(bankId);

export default function handler(req: Request, res: Response) {
  // Normalize the URL path
  if (!req.url.startsWith('/')) {
    req.url = '/' + req.url;
  }
  
  if(req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  
  return adminHandler(req, res);
}
