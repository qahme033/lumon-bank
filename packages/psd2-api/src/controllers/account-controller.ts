import { Request, Response } from 'express';
import { AccountService, ConsentPermission } from '@banking-sim/core-banking';
import { ConsentService } from '@banking-sim/core-banking'; // adjust path as needed

export class AccountController {
  private bankId: string;
  private accountService: AccountService;
  private consentService: ConsentService;

  constructor(bankId: string) {
    this.bankId = bankId;
    this.accountService = new AccountService(bankId);
    this.consentService = new ConsentService(bankId);
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

    const consent = await this.consentService.getConsent(consentId);
    if (!consent) {
      return { valid: false, message: 'Invalid consent' };
    }

    if (consent.status !== 'AUTHORIZED') {
      return { valid: false, message: 'Consent not authorized' };
    }

    if (!consent.permissions.includes(ConsentPermission.ACCOUNT_DETAILS)) {
      return { valid: false, message: 'Consent does not include account details permission' };
    }

    if (consent.customer_id !== customerId) {
      return { valid: false, message: 'Consent does not match the customer' };
    }

    return { valid: true };
  }

  async getAccounts(req: Request, res: Response){
    try {
      // Unpack required variables as early as possible
      const customerId = req.query.customer_id as string;
      const consentId = req.query.consent_id as string;

      if (!customerId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'customer_id is required'
        });
      }

      // Validate consent using the extracted variables
      const consentValidation = await this.validateAccountConsent(consentId, customerId);
      if (!consentValidation.valid) {
        return res.status(403).json({
          error: 'Consent Error',
          message: consentValidation.message
        });
      }

      const accounts = await this.accountService.getAccounts(customerId);
      res.status(200).json({
        accounts,
        total_count: accounts.length
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  async getAccount(req: Request, res: Response) {
    try {
      // Unpack parameters from both req.params and req.query
      const accountId = req.params.account_id;
      const customerId = req.query.customer_id as string;
      const consentId = req.query.consent_id as string;

      if (!accountId || !customerId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'account_id and customer_id are required'
        });
      }

      const consentValidation = await this.validateAccountConsent(consentId, customerId);
      if (!consentValidation.valid) {
        return res.status(403).json({
          error: 'Consent Error',
          message: consentValidation.message
        });
      }

      const account = await this.accountService.getAccount(accountId);
      if (!account) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Account with ID ${accountId} not found`
        });
      }

      res.status(200).json({ account });
    } catch (error: any) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  async getAccountBalance(req: Request, res: Response) {
    try {
      const accountId = req.params.account_id;
      const customerId = req.query.customer_id as string;
      const consentId = req.query.consent_id as string;

      if (!accountId || !customerId) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'account_id and customer_id are required'
        });
      }

      const consentValidation = await this.validateAccountConsent(consentId, customerId);
      if (!consentValidation.valid) {
        return res.status(403).json({
          error: 'Consent Error',
          message: consentValidation.message
        });
      }

      const balance = await this.accountService.getAccountBalance(accountId);
      if (!balance) {
        return res.status(404).json({
          error: 'Not Found',
          message: `Balance for account with ID ${accountId} not found`
        });
      }

      res.status(200).json(balance);
    } catch (error: any) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }
}
