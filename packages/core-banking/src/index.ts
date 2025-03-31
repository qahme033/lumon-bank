// packages/core-banking/src/index.ts

import { getGreeting, VERSION } from '@banking-sim/common';

export function testCoreBanking(): string {
  return `${getGreeting('Tester')} Core Banking Module v${VERSION} is working!`;
}

export * from './controllers/customer-controller';
export * from './controllers/database-controller';
export * from './controllers/transaction-controller';
export * from './controllers/consent-controller';
export * from './controllers/account-controller';

// Export the test function
export { getGreeting } from '@banking-sim/common';
// Export models
export * from './models/account';

// Export 
export * from './services/customer-service';
export * from './services/account-service';
export * from './services/database-service';
export * from './services/consent-service';
export * from './services/transaction-service';

// Export database
export * from './data/in-memory-db';

export * from './server'


export {seedBankData} from './data/seed-data'