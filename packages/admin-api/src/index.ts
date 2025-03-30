// packages/admin-api/src/index.ts
// packages/admin-api/src/index.ts
export { AdminServer } from './server';
export * from './controllers/admin-account-controller';
export * from './controllers/admin-customer-controller';
export * from './controllers/admin-transaction-controller';
export * from './controllers/admin-system-controller';

export * from './controllers/admin-database-controller';


import { testCoreBanking } from '@banking-sim/core-banking';


export function testAdminAPI(): string {
  return `${testCoreBanking()} Admin API Module is connected!`;
}