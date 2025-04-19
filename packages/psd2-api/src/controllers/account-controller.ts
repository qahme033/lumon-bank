// packages/banking-api/src/controllers/account-controller.ts
import { Request, Response } from 'express';
import { CoreBankingClient, ConsentPermission } from '@banking-sim/core-banking-client';

export class AccountController {
  private bankId: string;
  private coreBankingClient: CoreBankingClient;

  constructor(bankId: string, apiBaseUrl?: string) {
    this.bankId = bankId;
    this.coreBankingClient = new CoreBankingClient(bankId);
  }

  /**
   * Validates that the provided consent data is valid for accessing account details.
   * @param consentId - The consent identifier.
   * @param customerId - The customer identifier.
   * @returns An object indicating whether validation passed and an optional message.
   */
  private async validateAccountConsent(
    consentId: string,
    customerId: string
  ): Promise<{ valid: boolean; message?: string }> {
    if (!consentId) {
      return { valid: false, message: 'consent_id is required' };
    }

    const consent = await this.coreBankingClient.getConsent(consentId);
    if (!consent) {
      return { valid: false, message: 'Invalid consent' };
    }

    if (consent.status !== 'AUTHORIZED') {
      return { valid: false, message: 'Consent not authorized' };
    }

    if (!consent.permissions.includes(ConsentPermission.ACCOUNT_DETAILS)) {
      return { valid: false, message: 'Consent does not include account details permission' };
    }

    if (consent.customerId.toString() !== customerId) {
      return { valid: false, message: 'Consent does not match the customer' };
    }

    return { valid: true };
  }

  // async getAccounts(req: Request, res: Response): Promise<void> {
  //   try {
  //     // Unpack required variables as early as possible
  //     const customerId = req.query.customerId as string;
  //     const consentId = req.query.consent_id as string;

  //     if (!customerId) {
  //       res.status(400).json({
  //         error: 'Bad Request',
  //         message: 'customerId is required'
  //       });
  //       return;
  //     }

  //     // Validate consent using the extracted variables
  //     const consentValidation = await this.validateAccountConsent(consentId, customerId);
  //     if (!consentValidation.valid) {
  //       res.status(403).json({
  //         error: 'Consent Error',
  //         message: consentValidation.message
  //       });
  //       return;
  //     }

  //     const accounts = await this.coreBankingClient.getAccounts(customerId);
  //     res.status(200).json({
  //       accounts,
  //       total_count: accounts.length
  //     });
  //   } catch (error: any) {
  //     console.error(`Error in getAccounts: ${error.message}`);
      
  //     const status = error.response?.status || 500;
  //     const errorMessage = error.response?.data?.message || error.message;
      
  //     res.status(status).json({
  //       error: status === 500 ? 'Internal Server Error' : 'Request Failed',
  //       message: errorMessage
  //     });
  //   }
  // }

  async getAccount(req: Request, res: Response): Promise<void> {
    try {
      // Unpack parameters from both req.params and req.query
      const accountId = req.params.account_id;
      const customerId = req.query.customerId as string;
      const consentId = req.query.consent_id as string;

      if (!accountId || !customerId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'account_id and customerId are required'
        });
        return;
      }

      const consentValidation = await this.validateAccountConsent(consentId, customerId);
      if (!consentValidation.valid) {
        res.status(403).json({
          error: 'Consent Error',
          message: consentValidation.message
        });
        return;
      }

      const account = await this.coreBankingClient.getAccount(accountId);
      if (!account) {
        res.status(404).json({
          error: 'Not Found',
          message: `Account with ID ${accountId} not found`
        });
        return;
      }

      res.status(200).json({ account });
    } catch (error: any) {
      console.error(`Error in getAccount: ${error.message}`);
      
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(status).json({
        error: status === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }

  async getAccountBalance(req: Request, res: Response): Promise<void> {
    try {
      const accountId = req.params.account_id;
      const customerId = req.query.customerId as string;
      const consentId = req.query.consent_id as string;

      if (!accountId || !customerId) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'account_id and customerId are required'
        });
        return;
      }

      const consentValidation = await this.validateAccountConsent(consentId, customerId);
      if (!consentValidation.valid) {
        res.status(403).json({
          error: 'Consent Error',
          message: consentValidation.message
        });
        return;
      }

      const balance = await this.coreBankingClient.getAccountBalance(accountId);
      if (!balance) {
        res.status(404).json({
          error: 'Not Found',
          message: `Balance for account with ID ${accountId} not found`
        });
        return;
      }

      res.status(200).json(balance);
    } catch (error: any) {
      console.error(`Error in getAccountBalance: ${error.message}`);
      
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(status).json({
        error: status === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }
}
