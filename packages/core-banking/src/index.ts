// packages/core-banking/src/index.ts

import { getGreeting, VERSION } from '@banking-sim/common';

export function testCoreBanking(): string {
  return `${getGreeting('Tester')} Core Banking Module v${VERSION} is working!`;
}

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


export {seedBankData} from './data/seed-data'