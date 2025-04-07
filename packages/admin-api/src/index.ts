// packages/admin-api/src/index.ts
// packages/admin-api/src/index.ts
export { AdminServer } from './server.js';
export * from './controllers/admin-account-controller.js';
export * from './controllers/admin-customer-controller.js';
export * from './controllers/admin-transaction-controller.js';
export * from './controllers/admin-system-controller.js';

export * from './controllers/admin-database-controller.js';


import { testCoreBanking } from '@banking-sim/core-banking';


export function testAdminAPI(): string {
  return `${testCoreBanking()} Admin API Module is connected!`;
}