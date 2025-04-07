// packages/common/src/index.ts
export const VERSION = '0.1.0';

export function getGreeting(name: string): string {
  return `Hello, ${name}! Welcome to the Banking Simulation.`;
}

// If you have src/types/index.ts
// Make sure it exports all your types
export * from './types/types.js';

export * from './api/account.js'
export * from './api/customer.js'
export * from './api/transaction.js'
export * from './api/consent.js'