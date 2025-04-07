// src/controllers/consent-controller.ts
import { Request, Response, NextFunction } from 'express';
import { ConsentService } from '../services/consent-service.js'; // Adjust the import path as needed
import { IConsent } from '../data/in-memory-db.js';

export class ConsentController {
  private consentService: ConsentService;

  constructor(bankId: string) {
    this.consentService = new ConsentService(bankId);
  }

  // Create a new consent
  async createConsent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id, account_ids, permissions, psu_ip_address, psu_user_agent, tpp_id } = req.body;
      const consent: IConsent = await this.consentService.createConsent(
        customer_id, account_ids, permissions, psu_ip_address, psu_user_agent, tpp_id
      );
      res.status(201).json(consent);
    } catch (error) {
      next(error);
    }
  }

    // Create a new consent
    async updateConsent(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { consent_id } = req.params;
        const { status, permissions } = req.body;
        const consent = await this.consentService.updateConsent(
          consent_id,
          {status, permissions}
        );
        res.status(201).json(consent);
      } catch (error) {
        next(error);
      }
    }

  // Get a specific consent
  async getConsent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { consent_id } = req.params;
      const consent: IConsent | null = await this.consentService.getConsent(consent_id);
      if (consent) {
        res.status(200).json(consent);
      } else {
        res.status(404).json({ error: 'Consent not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Revoke a consent
  async revokeConsent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { consent_id } = req.params;
      const success: boolean = await this.consentService.revokeConsent(consent_id);
      if (success) {
        res.status(200).json({ message: 'Consent revoked successfully' });
      } else {
        res.status(404).json({ error: 'Consent not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}
