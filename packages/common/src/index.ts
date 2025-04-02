// packages/common/src/index.ts
export const VERSION = '0.1.0';

export function getGreeting(name: string): string {
  return `Hello, ${name}! Welcome to the Banking Simulation.`;
}

// If you have src/types/index.ts
// Make sure it exports all your types
export * from './types/account';

export * from './api/account'