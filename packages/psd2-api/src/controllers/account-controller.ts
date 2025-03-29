// packages/psd2-api/src/controllers/account-controller.ts
import { Request, Response } from 'express';
import { AccountService } from '@banking-sim/core-banking';

export class AccountController {
  private bankId: string;
  private accountService: AccountService;

  constructor(bankId: string) {
    this.bankId = bankId;
    this.accountService = new AccountService(bankId);
  }

  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.query.customer_id as string;
      
      if (!customerId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'customer_id is required'
        });
        return;
      }
      
      const accounts = await this.accountService.getAccounts(customerId);
      
      res.status(200).json({
        accounts,
        total_count: accounts.length
      });
    } catch (error) {
    //   console.error(`Error in getAccounts: ${error.message}`);
    //   res.status(500).json({
    //     error: 'Internal Server Error',
    //     message: error.message
    //   });
    }
  }

  async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.account_id;
      
      if (!accountId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'account_id is required'
        });
        return;
      }
      
      const account = await this.accountService.getAccount(accountId);
      
      if (!account) {
        res.status(404).json({
          error: 'Not Found',
          message: `Account with ID ${accountId} not found`
        });
        return;
      }
      
      res.status(200).json({ account });
    } catch (error) {
    //   console.error(`Error in getAccount: ${error.message}`);
    //   res.status(500).json({
    //     error: 'Internal Server Error',
    //     message: error.message
    //   });
    }
  }

  async getAccountBalance(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.account_id;
      
      if (!accountId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'account_id is required'
        });
        return;
      }
      
      const balance = await this.accountService.getAccountBalance(accountId);
      
      if (!balance) {
        res.status(404).json({
          error: 'Not Found',
          message: `Balance for account with ID ${accountId} not found`
        });
        return;
      }
      
      res.status(200).json(balance);
    } catch (error) {
    //   console.error(`Error in getAccountBalance: ${error.message}`);
    //   res.status(500).json({
    //     error: 'Internal Server Error',
    //     message: error.message
    //   });
    }
  }
}
