// packages/auth-service/src/types/express.d.ts
import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username?: string;
        email?: string;
        role: 'admin' | 'customer';
        customerId?: string;
        scopes: string[];
        authType?: string;
      };
    }
  }
}
