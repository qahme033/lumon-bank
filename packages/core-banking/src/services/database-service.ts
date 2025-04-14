// database-service.ts
import { IAccount, IBalance, IBank, IConsent, ICustomer, ITransaction,  } from '@banking-sim/common';
import { DatabaseSnapshot } from '../data/model.js';
import { ObjectId } from 'mongodb';


export interface DatabaseService {
  // Customers
  addCustomer(customer: ICustomer): Promise<void>;
  getCustomer(customerId: string | ObjectId): Promise<ICustomer | null>;
  updateCustomer(customer: ICustomer): Promise<void>;
  deleteCustomer(customerId: string | ObjectId): Promise<void>;
  getCustomers(bankId?: string | ObjectId): Promise<ICustomer[]>;
  
  // Accounts
  addAccount(account: IAccount): Promise<void>;
  getAccount(accountId: string | ObjectId): Promise<IAccount | null>;
  getAccounts(bankId?: string | ObjectId): Promise<IAccount[]>;
  getAccountsByCustomer(customerId: string): Promise<IAccount[]>;
  
  // Balances
  setBalance(accountId: string | ObjectId, balance: IBalance): Promise<void>;
  getBalance(accountId: string | ObjectId): Promise<IBalance | null>;
  
  // Transactions
  addTransaction(transaction: ITransaction): Promise<void>;
  getTransaction(transactionId: string | ObjectId): Promise<ITransaction | null>;
  getTransactionsByAccount(accountId: string | ObjectId): Promise<ITransaction[]>;
  
  // Consents
  addConsent(consent: IConsent): Promise<void>;
  getConsent(consentId: string | ObjectId): Promise<IConsent | null>;
  updateConsent(consent: IConsent): Promise<void>;
  getConsents(query: any): Promise<IConsent[]>;
  
  // Banks
  getBank(bankId: string | ObjectId): Promise<IBank | null>;
  addBank(bank: IBank): Promise<void>;
  
  // Database operations
  getDatabaseSnapshot(bankId?: string | ObjectId): Promise<DatabaseSnapshot>;
  reset(bankId: string | ObjectId): Promise<void>;
  close(): Promise<void>;
}
