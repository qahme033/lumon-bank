// packages/auth-service/src/types/express.d.ts
import { User } from '@banking-sim/core-banking-client';
import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
