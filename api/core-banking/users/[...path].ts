import { Request, Response } from 'express';
import { createCoreBankingHandler } from '@banking-sim/core-banking/src/serverless-adapter.js';

// Get bank ID from environment variable or default to 'default-bank'
const bankId = process.env.BANK_ID || 'default-bank';

// Create handler with bank ID
const coreBankingHandler = createCoreBankingHandler(bankId);

export default function handler(req: Request, res: Response) {
  // Normalize the URL path
  if (!req.url.startsWith('/')) {
    req.url = '/' + req.url;
  }
  if(req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  // Handle the request
  return coreBankingHandler(req, res);
}
