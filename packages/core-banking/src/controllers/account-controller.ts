// src/controllers/account-controller.ts
import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../services/account-service'; // Adjust the import path as needed
import { AccountType, AccountStatus, IAccount } from '@banking-sim/common'; // Adjust as needed

export class AccountController {
  private accountService: AccountService;

  constructor(bankId: string) {
    this.accountService = new AccountService(bankId);
  }

  // Create a new account
  async createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId, accountType, accountName, currency, initialBalance, status } = req.body;
      const account: IAccount = await this.accountService.createAccount(
        customerId,
        accountType as AccountType,
        accountName,
        currency,
        initialBalance,
        status as AccountStatus
      );
      res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }

  // Get all accounts for a customer
  async getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id } = req.query;
      if (!customer_id || typeof customer_id !== 'string') {
        res.status(400).json({ error: 'customer_id query parameter is required and must be a string' });
        return;
      }
      const accounts: IAccount[] = await this.accountService.getAccounts(customer_id);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  }

  // Get a specific account
  async getAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { account_id } = req.params;
      const account: IAccount | null = await this.accountService.getAccount(account_id);
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get account balance
  async getAccountBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { account_id } = req.params;
      const balance = await this.accountService.getAccountBalance(account_id);
      if (balance) {
        res.status(200).json(balance);
      } else {
        res.status(404).json({ error: 'Balance not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}
