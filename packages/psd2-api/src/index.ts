// // packages/psd2-api/src/index.ts
// packages/psd2-api/src/index.ts
export { PSD2Server } from './server';
export * from './controllers/account-controller';
export * from './controllers/payment-controller';
// export * from './controllers/consent-controller';
export * from './controllers/transaction-controller';

import { testCoreBanking } from '@banking-sim/core-banking';

export function testPSD2API(): string {
  return `${testCoreBanking()} PSD2 API Module is connected!`;
}