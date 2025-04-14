import { v4 as uuidv4 } from 'uuid';
import { AccountStatus, AccountType, IAccount, IBalance } from '@banking-sim/common';
import { DatabaseService } from './database-service.js';
import { getDatabaseService } from './mongodb-service.js';
import { ObjectId } from 'mongodb';

export class AccountService {
  private bankId: string;
  private db?: DatabaseService;

  constructor(bankId: string) {
    this.bankId = bankId;
  }

  // Helper method to get database instance
  private async getDatabase(): Promise<DatabaseService> {
    if (!this.db) {
      this.db = await getDatabaseService();
    }
    return this.db;
  }

  async createAccount(
    customerId: string,
    accountType: AccountType,
    accountName: string,
    currency: string,
    initialBalance: number = 0,
    status: AccountStatus = AccountStatus.ACTIVE
  ): Promise<IAccount> {
    const db = await this.getDatabase();
    
    // Verify the customer exists
    const customer = await db.getCustomer(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    const accountOId = new ObjectId(uuidv4());
    const bankOId = new ObjectId(this.bankId);
    const customerOId = new ObjectId(customerId);
    // Create the account
    const account: IAccount = {
      id: accountOId,
      customerId: customerOId,
      bankId: bankOId,
      accountType,
      accountName,
      currency,
      status,
      departmentCode: 'MDR',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store the account
    await db.addAccount(account);
    
    // Initialize balance
    const balance: IBalance = {
      id: new ObjectId(uuidv4()),
      available: initialBalance,
      current: initialBalance,
      pending: 0
    };
    
    await db.setBalance(account.id.toString(), balance);
    
    return account;
  }

  async getAccounts(customerId: string): Promise<IAccount[]> {
    const db = await this.getDatabase();
    
    // Get accounts matching both customerId and bankId
    const accounts = await db.getAccountsByCustomer(customerId);
    return accounts.filter(account => account.bankId.toString() === this.bankId);
  }

  async getAccount(accountId: string): Promise<IAccount | null> {
    const db = await this.getDatabase();
    
    // Get the specific account
    const account = await db.getAccount(accountId);
    
    // Verify it belongs to this bank
    if (account && account.bankId.toString() === this.bankId) {
      return account;
    }
    
    return null;
  }

  async getAccountBalance(accountId: string): Promise<any | null> {
    const db = await this.getDatabase();
    
    // First check if the account exists
    const account = await this.getAccount(accountId);
    if (!account) return null;
    
    // Get the balance
    const balance = await db.getBalance(accountId);
    if (!balance) return null;
    
    // Format the balance in the expected structure
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
  
  // Additional helper methods could be added here as needed
  // For example, methods to update account status, update balances, etc.
}
