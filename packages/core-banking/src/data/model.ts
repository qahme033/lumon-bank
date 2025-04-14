// models.ts
import {  IAccount, ICustomer, IBalance, ITransaction, IConsent } from '@banking-sim/common';



export interface DatabaseSnapshot {
  customers: Record<string, ICustomer>;
  accounts: Record<string, IAccount>;
  balances: Record<string, IBalance>;
  transactions: Record<string, ITransaction[]>;
  payments: Record<string, any>;
  mandates: Record<string, any>;
  consents: Record<string, IConsent>;
}
