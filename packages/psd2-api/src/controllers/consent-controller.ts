import { ConsentService } from '@banking-sim/core-banking';
import { Request, Response } from 'express';

export class ConsentController {
  private consentService: ConsentService;

  constructor(bankId: string) {
    this.consentService = new ConsentService(bankId);
  }

  /**
   * Create a new consent record.
   * Expects the request body to include:
   * - customer_id: string
   * - account_ids: string[]
   * - permissions: string[]
   * - psu_ip_address: string
   * - psu_user_agent: string
   * - tpp_id: string
   */
  async createConsent(req: Request, res: Response): Promise<void> {
    try {
      const { customer_id, account_ids, permissions, psu_ip_address, psu_user_agent, tpp_id } = req.body;
      
      if (!customer_id || !psu_ip_address || !psu_user_agent || !tpp_id) {
        res.status(400).json({ 
          error: 'Missing required fields',
          message: 'customer_id, psu_ip_address, psu_user_agent, and tpp_id are required'
        });
        return;
      }
      
      const consent = await this.consentService.createConsent(
        customer_id,
        account_ids,
        permissions,
        psu_ip_address,
        psu_user_agent,
        tpp_id
      );
      res.status(201).json(consent);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Retrieve a consent record by its ID.
   * Expects the consent ID in the URL parameters as 'consent_id'.
   */
  async getConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      const consent = await this.consentService.getConsent(consentId);
      if (!consent) {
        res.status(404).json({ error: 'Consent not found' });
      } else {
        res.status(200).json(consent);
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Update an existing consent record.
   * Accepts updates for permissions and status in the request body.
   */
  async updateConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      const { permissions, status } = req.body;
      const updatedConsent = await this.consentService.updateConsent(consentId, { permissions, status });
      if (!updatedConsent) {
        res.status(404).json({ error: 'Consent not found' });
      } else {
        res.status(200).json(updatedConsent);
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Revoke a consent by setting its status to 'REVOKED'.
   * Expects the consent ID in the URL parameters as 'consent_id'.
   */
  async revokeConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      const success = await this.consentService.revokeConsent(consentId);
      if (success) {
        res.status(200).json({ message: 'Consent revoked successfully' });
      } else {
        res.status(404).json({ error: 'Consent not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Delete a consent record.
   * Expects the consent ID in the URL parameters as 'consent_id'.
   */
  async deleteConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.params.consent_id;
      const success = await this.consentService.deleteConsent(consentId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Consent not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }
}
