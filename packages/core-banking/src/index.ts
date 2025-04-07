// packages/core-banking/src/index.ts

import { getGreeting, VERSION } from '@banking-sim/common';

export function testCoreBanking(): string {
  return `${getGreeting('Tester')} Core Banking Module v${VERSION} is working!`;
}

export * from './controllers/customer-controller.js';
export * from './controllers/database-controller.js';
export * from './controllers/transaction-controller.js';
export * from './controllers/consent-controller.js';
export * from './controllers/account-controller.js';

// Export the test function
export { getGreeting } from '@banking-sim/common';
// Export models
export * from './models/account.js';

// Export 
export * from './services/customer-service.js';
export * from './services/account-service.js';
export * from './services/database-service.js';
export * from './services/consent-service.js';
export * from './services/transaction-service.js';

// Export database
export * from './data/in-memory-db.js';

export * from './server.js'


export {seedBankData} from './data/seed-data.js'