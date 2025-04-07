// packages/auth-service/src/index.ts
export { AuthServer } from './auth-server.js';
export { AuthService } from './auth-service.js';
export { 
  verifyToken, 
  verifyConsent,
  requireScope, 
  requireRole, 
  requireOwnCustomerData 
} from './auth-middleware.js';

