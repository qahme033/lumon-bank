// packages/admin-api/src/controllers/consent-controller.ts
import { Request, Response } from 'express';
import { CoreBankingClient, Consent } from '@banking-sim/core-banking-client';

export class ConsentController {
  private client: CoreBankingClient;

  /**
   * Initialize the consent controller with a core banking client.
   * @param bankId The bank ID for this controller
   * @param apiBaseUrl Optional base URL for the core banking API
   */
  constructor(bankId: string, apiBaseUrl?: string) {
    this.client = new CoreBankingClient(bankId);
  }

  /**
   * Create a new consent record.
   * Expects the request body to include:
   * - customerId: string
   * - accountIds: string[]
   * - permissions: string[]
   * - psuIpAddress: string
   * - psuUserAgent: string
   * - tppId: string
   */
  async createConsent(req: Request, res: Response): Promise<void> {
    try {
      const { customerId, accountIds, permissions, psuIpAddress, psuUserAgent, tppId } = req.body;
      
      if (!customerId || !psuIpAddress || !psuUserAgent || !tppId) {
        res.status(400).json({ 
          success: false,
          error: 'Bad Request',
          message: 'customerId, psuIpAddress, psuUserAgent, and tppId are required'
        });
        return;
      }
      
      const consentData: Partial<Consent> = { 
        customerId, 
        accountIds, 
        permissions, 
        psuIpAddress, 
        psuUserAgent, 
        tppId 
      };
      
      const consent = await this.client.createConsent(consentData);
      
      res.status(201).json({
        success: true,
        data: consent
      });
    } catch (error: any) {
      console.error(`Error in createConsent: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }

  /**
   * Retrieve a consent record by its ID.
   * Expects the consent ID in the URL parameters as 'consent_id'.
   */
  async getConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      
      if (!consentId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'consent_id is required'
        });
        return;
      }
      
      const consent = await this.client.getConsent(consentId);
      
      if (!consent) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Consent not found'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: consent
      });
    } catch (error: any) {
      console.error(`Error in getConsent: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }

  /**
   * Update an existing consent record.
   * Accepts updates for permissions and status in the request body.
   */
  async updateConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      const { status } = req.body;
      
      if (!consentId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'consent_id is required'
        });
        return;
      }
      
      const updatedConsent = await this.client.updateConsent(consentId, { status });
      
      res.status(200).json({
        success: true,
        data: updatedConsent
      });
    } catch (error: any) {
      console.error(`Error in updateConsent: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      // Handle specific 404 error from the client
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Consent not found'
        });
        return;
      }
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }

  /**
   * Revoke a consent by setting its status to 'REVOKED'.
   * Expects the consent ID in the URL parameters as 'consent_id'.
   */
  async revokeConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      
      if (!consentId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'consent_id is required'
        });
        return;
      }
      
      const revokedConsent = await this.client.revokeConsent(consentId);
      
      res.status(200).json({
        success: true,
        message: 'Consent revoked successfully',
        data: revokedConsent
      });
    } catch (error: any) {
      console.error(`Error in revokeConsent: ${error.message}`);
      
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      // Handle specific 404 error from the client
      if (error.response?.status === 404) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Consent not found'
        });
        return;
      }
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }
}
