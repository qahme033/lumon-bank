import { ObjectId } from "mongodb";

export interface ICustomer {
    id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    bankId: ObjectId; // Add this field

  }
  

export  enum ConsentPermission {
    ACCOUNT_DETAILS = "account:details:read",
    TRANSACTIONS = "transactions:read",
    BALANCE = "balances:read"
}
export  enum ConsentStatus {
    AWAITING_AUTHORIZATION = "AWAITING_AUTHORIZATION",
    AUTHORIZED = "AUTHORIZED",
    REVOKED = "REVOKED"
}
export interface IBank {
    id: ObjectId;
    name: string;
}
export interface IConsent {
    consent_id: ObjectId;
    customer_id: ObjectId;
    account_ids: ObjectId[];
    permissions: ConsentPermission[];
    status: ConsentStatus;
    created_at: Date;
    expires_at: Date;
    authorization_url: string;
    bank_id: ObjectId;
    psu_ip_address: string;
    psu_user_agent: string;
    tpp_id: string;
}


export interface ITransaction {
    id: ObjectId;
    accountId: ObjectId;
    amount: number;
    description: string;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
    timestamp: Date;
}

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
    id: ObjectId;
    customerId: ObjectId;
    bankId: ObjectId;
    accountType: AccountType;
    accountName: string;
    currency: string;
    status: AccountStatus;
    departmentCode: string;
    createdAt: Date;
    updatedAt: Date;         
  }
  
  export interface IBalance {
    id: ObjectId;
    // account_id: ObjectId;
    available: number;
    current: number;
    pending: number;
  }

  export interface IBalanceResponse {
    account_id: ObjectId;
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
  