import { v4 as uuidv4 } from 'uuid';
import { ITransaction } from '@banking-sim/common';
import { DatabaseService } from './database-service.js';
import { getDatabaseService } from './mongodb-service.js';
import { ObjectId } from 'mongodb';

export class TransactionService {
  private db?: DatabaseService;
  private bankId: string;

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

  /**
   * Creates a new transaction for a given account.
   *
   * @param accountId The account ID for which the transaction is created.
   * @param amount The transaction amount.
   * @param description A description for the transaction.
   * @param type The type of the transaction ('CREDIT' or 'DEBIT').
   * @param status The transaction status, defaulting to 'PENDING'.
   * @returns The created transaction.
   */
  async createTransaction(
    accountId: string,
    amount: number,
    description: string,
    type: 'CREDIT' | 'DEBIT',
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' = 'PENDING'
  ): Promise<ITransaction> {
    const db = await this.getDatabase();
    
    // Verify the account exists and belongs to the current bank.
    const account = await db.getAccount(accountId);
    if (!account || account.bankId.toJSON() !== this.bankId) {
      throw new Error('Account not found or does not belong to the current bank');
    }

    const transaction: ITransaction = {
      id: new ObjectId(uuidv4()),
      accountId:new ObjectId(accountId),
      amount,
      description,
      type,
      status,
      timestamp: new Date()
    };

    // Store the transaction
    await db.addTransaction(transaction);

    return transaction;
  }

  /**
   * Retrieves a transaction by its ID.
   *
   * @param transactionId The ID of the transaction to retrieve.
   * @returns The matching transaction.
   * @throws An error if the transaction is not found or does not belong to the current bank.
   */
  async getTransaction(transactionId: string): Promise<ITransaction> {
    const db = await this.getDatabase();
    
    // Get the transaction by ID
    const transaction = await db.getTransaction(transactionId);
    
    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found.`);
    }
    
    // Verify that the transaction's account belongs to the current bank
    const account = await db.getAccount(transaction.accountId.toString());
    
    if (!account || account.bankId.toString() !== this.bankId) {
      throw new Error(`Transaction with ID ${transactionId} does not belong to bank ${this.bankId}.`);
    }
    
    return transaction;
  }

  /**
   * Retrieves all transactions for a specific account.
   *
   * @param accountId The account ID whose transactions are to be retrieved.
   * @returns An array of transactions for the account.
   * @throws An error if the account is not found or does not belong to the current bank.
   */
  async getTransactionsForAccount(accountId: string): Promise<ITransaction[]> {
    const db = await this.getDatabase();
    
    // Verify the account exists and belongs to the current bank.
    const account = await db.getAccount(accountId);
    if (!account || account.bankId.toString() !== this.bankId) {
      throw new Error('Account not found or does not belong to the current bank');
    }
    
    // Get transactions for the account
    const transactions = await db.getTransactionsByAccount(accountId);
    return transactions;
  }
}
