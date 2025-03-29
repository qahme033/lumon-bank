// packages/core-banking/src/services/account-service.ts
import { v4 as uuidv4 } from 'uuid';
import { InMemoryDatabase } from '../data/in-memory-db';
import { AccountType, AccountStatus, IAccount } from '@banking-sim/common';

export class AccountService {
  private db: InMemoryDatabase;
  private bankId: string;

  constructor(bankId: string) {
    this.db = InMemoryDatabase.getInstance();
    this.bankId = bankId;
  }

  async createAccount(
    customerId: string,
    accountType: AccountType,
    accountName: string,
    currency: string,
    initialBalance: number = 0,
    status: AccountStatus = AccountStatus.ACTIVE
  ): Promise<IAccount> {
    // Verify the customer exists
    const customer = this.db.customers.get(customerId);
    if (!customer || customer.bankId !== this.bankId) {
      throw new Error('Customer not found');
    }
    
    // Create the account
    const account: IAccount = {
      id: uuidv4(),
      customerId,
      bankId: this.bankId,
      accountType,
      accountName,
      currency,
      status,
      departmentCode: 'MDR',
      createdAt: new Date()
    };
    
    // Store the account
    this.db.accounts.set(account.id, account);
    
    // Initialize balance
    this.db.balances.set(account.id, {
      available: initialBalance,
      current: initialBalance,
      pending: 0
    });
    
    // Initialize empty transaction list
    this.db.transactions.set(account.id, []);
    
    return account;
  }

  async getAccounts(customerId: string): Promise<IAccount[]> {
    const accounts: IAccount[] = [];
    
    for (const [_, account] of this.db.accounts) {
      if (account.customerId === customerId && account.bankId === this.bankId) {
        accounts.push(account);
      }
    }
    
    return accounts;
  }

  async getAccount(accountId: string): Promise<IAccount | null> {
    const account = this.db.accounts.get(accountId);
    if (account && account.bankId === this.bankId) {
      return account;
    }
    return null;
  }

  async getAccountBalance(accountId: string): Promise<any | null> {
    const account = await this.getAccount(accountId);
    if (!account) return null;
    
    const balance = this.db.balances.get(accountId);
    if (!balance) return null;
    
    return {
      account_id: accountId,
      balances: [
        {
          balance_type: 'AVAILABLE',
          amount: balance.available,
          currency: account.currency
        },
        {
          balance_type: 'CURRENT',
          amount: balance.current,
          currency: account.currency
        },
        {
          balance_type: 'PENDING',
          amount: balance.pending,
          currency: account.currency
        }
      ],
      timestamp: new Date().toISOString()
    };
  }
}
