// api/admin/health.ts
import { createAdminHandler } from '@banking-sim/admin-api/src/serverless-adapter.js';
import { Request, Response } from 'express';

const bankId = process.env.BANK_ID || 'default-bank-id';
const adminHandler = createAdminHandler(bankId);

export default function handler(req: Request, res: Response) {
  // Set the URL path for processing by the handler
  req.url = '/admin/health';
  req.method = 'GET';
  
  // Pass to your admin handler
  return adminHandler(req, res);
}