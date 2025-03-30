// packages/core-banking/src/data/in-memory-db.ts
import { AccountType, AccountStatus, IAccount } from '@banking-sim/common';

// Define basic types for our database
export interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bankId: string;
}

export interface IBalance {
  available: number;
  current: number;
  pending: number;
}

export interface ITransaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  type: 'CREDIT' | 'DEBIT';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  timestamp: Date;
}

export enum ConsentPermission {
  ACCOUNT_DETAILS = 'account:details:read',
  TRANSACTIONS = 'transactions:read',
  BALANCE = 'balances:read'
  // Add more permissions as needed
}

export enum ConsentStatus {
  AWAITING_AUTHORIZATION = 'AWAITING_AUTHORIZATION',
  AUTHORIZED = 'AUTHORIZED',
  REVOKED = 'REVOKED'
}

export interface IBank {
  id: string;
  name: string;
  // Add other relevant fields
}


export interface IConsent {
  consent_id: string;
  customer_id: string;          // Link the consent to a specific user
  account_ids: string[];        // Array of account IDs this consent applies to
  permissions: ConsentPermission[];        // What permissions are granted
  status: ConsentStatus;
  created_at: Date;
  expires_at: Date;
  authorization_url: string;
  bank_id: string;          // The bank ID for which this consent is valid
  psu_ip_address: string
  psu_user_agent: string
  tpp_id: string
}

export class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  
  customers: Map<string, ICustomer> = new Map();
  accounts: Map<string, IAccount> = new Map();
  balances: Map<string, IBalance> = new Map();
  transactions: Map<string, ITransaction[]> = new Map();
  payments: Map<string, any> = new Map();
  mandates: Map<string, any> = new Map();
  consents: Map<string, any> = new Map();
  banks: Map<string, IBank> = new Map();


  private constructor() {}

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  public getDatabaseSnapshot(bankId?: string): any {
    // If bankId is provided, filter data for that bank only
    if (bankId) {
      return {
        customers: Array.from(this.customers.entries())
          .filter(([_, customer]) => customer.bankId === bankId)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        accounts: Array.from(this.accounts.entries())
          .filter(([_, account]) => account.bankId === bankId)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        balances: Array.from(this.balances.entries())
          .filter(([key, _]) => {
            const account = this.accounts.get(key);
            return account && account.bankId === bankId;
          })
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        transactions: Array.from(this.transactions.entries())
          .filter(([key, _]) => {
            const account = this.accounts.get(key);
            return account && account.bankId === bankId;
          })
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        payments: Array.from(this.payments.entries())
          .filter(([_, payment]) => payment.bankId === bankId)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        mandates: Array.from(this.mandates.entries())
          .filter(([_, mandate]) => mandate.bankId === bankId)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        consents: Array.from(this.consents.entries())
          .filter(([_, consent]) => consent.bank_id === bankId)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
      };
    }
    
    // Otherwise, return all data
    return {
      customers: Object.fromEntries(this.customers),
      accounts: Object.fromEntries(this.accounts),
      balances: Object.fromEntries(this.balances),
      transactions: Object.fromEntries(this.transactions),
      payments: Object.fromEntries(this.payments),
      mandates: Object.fromEntries(this.mandates),
      consents: Object.fromEntries(this.consents)
    };
  }

  // Reset database for a specific bank
  public reset(bankId: string): void {
    // Filter and keep only data not belonging to the specified bank
    this.customers = new Map([...this.customers].filter(([_, customer]) => customer.bankId !== bankId));
    this.accounts = new Map([...this.accounts].filter(([_, account]) => account.bankId !== bankId));
    // Similar filtering for other collections
  }
}
