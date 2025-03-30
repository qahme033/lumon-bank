// packages/auth-service/src/index.ts
export { AuthServer } from './auth-server';
export { AuthService } from './auth-service';
export { 
  verifyToken, 
  requireScope, 
  requireRole, 
  requireOwnCustomerData 
} from './auth-middleware';

