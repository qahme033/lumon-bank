// packages/common/src/index.ts
// Export enums and interfaces
export enum AccountType {
    CURRENT = 'CURRENT',
    SAVINGS = 'SAVINGS',
    CREDIT_CARD = 'CREDIT_CARD',
    LOAN = 'LOAN'
  }
  
  export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
  }
  
  export interface IAccount {
    id: string;
    customerId: string;
    bankId: string;
    accountType: AccountType;
    accountName: string;
    currency: string;
    status: AccountStatus;
    departmentCode: string;
    createdAt: Date;
  }
  
  export interface IBalance {
    available: number;
    current: number;
    pending: number;
  }

  export interface IBalanceResponse {
    account_id: string;
    balances: {
      balance_type: string;
      amount: number;
      currency: string;
    }[];
    timestamp: string;
  }

  // Add a simple utility function to ensure the module is recognized
  export function formatAccountId(id: string): string {
    return `ACC-${id}`;
  }
  