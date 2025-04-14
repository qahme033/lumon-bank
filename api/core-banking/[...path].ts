import { Request, Response } from 'express';
import { createCoreBankingHandler } from '@banking-sim/core-banking/src/serverless-adapter.js';

// Get bank ID from environment variable or default to 'default-bank'
const bankId = process.env.BANK_ID || 'default-bank';

// Create handler with bank ID
const coreBankingHandler = createCoreBankingHandler(bankId);

export default function handler(req: Request, res: Response) {
  if (req.method !== 'GET' && req.method !== 'HEAD' && !req.body) {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      try {
        req.body = JSON.parse(req.body || '{}');
      } catch (e) {
        console.error('Error parsing JSON body:', e);
      }
    }
  }
  
  // Make sure URL path is correctly formatted
  if (!req.url) {
    const path = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path || '';
    req.url = `/api/v1/${path}`;
  }
  
  // Handle the request
  return coreBankingHandler(req, res);
}
