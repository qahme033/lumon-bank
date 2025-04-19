// packages/admin-api/src/controllers/admin-account-controller.ts
import { Request, Response } from 'express';
import { CoreBankingClient,AccountType, AccountStatus,  } from '@banking-sim/core-banking-client';

export class AdminAccountController {
  private client: CoreBankingClient;

  constructor(bankId: string, apiBaseUrl?: string) {
    this.client = new CoreBankingClient({
      bankId,
      baseUrl: apiBaseUrl
    });
  }

  /**
   * Create a new account by delegating to the core banking API.
   */
  async createAccount(req: Request, res: Response): Promise<void> {
    try {
      const {
        customerId,
        accountType,
        accountName,
        currency,
        initialBalance,
        status,
      } = req.body;

      // Validate required fields
      if (!customerId || !accountType || !accountName || !currency) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Missing required fields: customerId, accountType, accountName, currency',
        });
        return;
      }

      // Validate account type
      if (!Object.values(AccountType).includes(accountType)) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid account type. Must be one of: ${Object.values(AccountType).join(', ')}`,
        });
        return;
      }

      // Validate account status (optional)
      if (status && !Object.values(AccountStatus).includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid account status. Must be one of: ${Object.values(AccountStatus).join(', ')}`,
        });
        return;
      }

      const account = await this.client.createAccount({
        customerId,
        accountType,
        accountName,
        currency,
        // initialBalance: initialBalance || 0,
        status: status || AccountStatus.ACTIVE,
      });

      res.status(201).json({
        success: true,
        data: account,
      });
    } catch (error: any) {
      console.error(`Error in createAccount: ${error.message}`);

      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Retrieve all accounts for a specific customer.
   */
  async getAccounts(req: Request, res: Response): Promise<void> {
    try {
      const customerId = req.query.customerId as string;

      if (!customerId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'customerId query parameter is required',
        });
        return;
      }

      const accounts = await this.client.getCustomerAccounts(customerId);

      res.status(200).json({
        success: true,
        data: accounts,
        count: accounts.length,
      });
    } catch (error: any) {
      console.error(`Error in getAccounts: ${error.message}`);

      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  /**
   * Retrieve a specific account by its ID.
   */
  async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.accountId;

      if (!accountId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'accountId is required',
        });
        return;
      }

      const account = await this.client.getAccount(accountId);

      if (!account) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Account with ID ${accountId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: account,
      });
    } catch (error: any) {
      console.error(`Error in getAccount: ${error.message}`);

      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }

  // /**
  //  * Update an existing account.
  //  */
  // async updateAccount(req: Request, res: Response): Promise<void> {
  //   try {
  //     const accountId = req.params.accountId;
  //     const updates = req.body;

  //     if (!accountId) {
  //       res.status(400).json({
  //         success: false,
  //         error: 'Bad Request',
  //         message: 'accountId is required',
  //       });
  //       return;
  //     }

  //     // Note: We'll need to add an updateAccount method to the CoreBankingClient
  //     // if it doesn't exist yet
  //     const updatedAccount = await this.client.updateAccount(accountId, updates);

  //     res.status(200).json({
  //       success: true,
  //       message: 'Account updated successfully',
  //       data: updatedAccount,
  //     });
  //   } catch (error: any) {
  //     console.error(`Error in updateAccount: ${error.message}`);

  //     const statusCode = error.response?.status || 500;
  //     const errorMessage = error.response?.data?.message || error.message;
      
  //     res.status(statusCode).json({
  //       success: false,
  //       error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
  //       message: errorMessage,
  //     });
  //   }
  // }

  // /**
  //  * Delete an account.
  //  */
  // async deleteAccount(req: Request, res: Response): Promise<void> {
  //   try {
  //     const accountId = req.params.accountId;

  //     if (!accountId) {
  //       res.status(400).json({
  //         success: false,
  //         error: 'Bad Request',
  //         message: 'accountId is required',
  //       });
  //       return;
  //     }

  //     // Delete the account - assuming the client has this method
  //     const success = await this.client.deleteAccount(accountId);

  //     res.status(200).json({
  //       success: true,
  //       message: 'Account deleted successfully',
  //     });
  //   } catch (error: any) {
  //     console.error(`Error in deleteAccount: ${error.message}`);

  //     const statusCode = error.response?.status || 500;
  //     const errorMessage = error.response?.data?.message || error.message;
      
  //     res.status(statusCode).json({
  //       success: false,
  //       error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
  //       message: errorMessage,
  //     });
  //   }
  // }

  /**
   * Get the balance of an account.
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.accountId;

      if (!accountId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'accountId is required',
        });
        return;
      }

      const balance = await this.client.getAccountBalance(accountId);

      if (!balance) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: `Balance for account ID ${accountId} not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: balance,
      });
    } catch (error: any) {
      console.error(`Error in getBalance: ${error.message}`);

      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage,
      });
    }
  }
}
