// packages/admin-api/src/controllers/admin-account-controller.ts
import { Request, Response } from 'express';
import { AccountService } from '@banking-sim/core-banking';
import { AccountType, AccountStatus } from '@banking-sim/common';

export class AdminAccountController {
  private bankId: string;
  private accountService: AccountService;

  constructor(bankId: string) {
    this.bankId = bankId;
    this.accountService = new AccountService(bankId);
  }

  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const {
        customerId,
        accountType,
        accountName,
        currency,
        initialBalance,
        status
      } = req.body;
      
      // Validate required fields
      if (!customerId || !accountType || !accountName || !currency) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Missing required fields: customerId, accountType, accountName, currency'
        });
        return;
      }
      
      // Validate account type
      if (!Object.values(AccountType).includes(accountType)) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid account type. Must be one of: ${Object.values(AccountType).join(', ')}`
        });
        return;
      }
      
      const account = await this.accountService.createAccount(
        customerId,
        accountType as AccountType,
        accountName,
        currency,
        initialBalance || 0,
        status || AccountStatus.ACTIVE
      );
      
      res.status(201).json({
        success: true,
        data: account
      });
    } catch (error) {
    //   console.error(`Error in createAccount: ${error.message}`);
      res.status(400).json({
        success: false,
        error: 'Creation Failed',
        // message: error.message
      });
    }
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.query.customerId as string;
      
      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId query parameter is required'
        });
        return;
      }
      
      const accounts = await this.accountService.getAccounts(customerId);
      
      res.status(200).json({
        success: true,
        data: accounts,
        count: accounts.length
      });
    } catch (error) {
    //   console.error(`Error in getAccounts: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.accountId;
      
      if (!accountId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'accountId is required'
        });
        return;
      }
      
      const account = await this.accountService.getAccount(accountId);
      
      if (!account) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Account with ID ${accountId} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: account
      });
    } catch (error) {
    //   console.error(`Error in getAccount: ${error.message}`);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async updateAccount(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would go here
      res.status(200).json({
        success: true,
        message: 'Account updated successfully',
        data: { id: req.params.accountId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would go here
      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async updateBalance(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would go here
      res.status(200).json({
        success: true,
        message: 'Account balance updated successfully',
        data: { id: req.params.accountId }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }
}
