// src/controllers/transaction-controller.ts
import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction-service'; // Adjust the import path as needed
import { ITransaction } from '../data/in-memory-db';

export class TransactionController {
  private transactionService: TransactionService;

  constructor(bankId: string) {
    this.transactionService = new TransactionService(bankId);
  }

  // Create a new transaction
  async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { account_id } = req.params;
      const { amount, description, type, status } = req.body;
      const transaction: ITransaction = await this.transactionService.createTransaction(
        account_id,
        amount,
        description,
        type,
        status
      );
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific transaction
  async getTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { transaction_id } = req.params;
      const transaction: ITransaction = await this.transactionService.getTransaction(transaction_id);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // Get all transactions for an account
  async getTransactionsForAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { account_id } = req.params;
      const transactions: ITransaction[] = await this.transactionService.getTransactionsForAccount(account_id);
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}
