"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentController = void 0;
const core_banking_1 = require("@banking-sim/core-banking"); // Adjust the import path as needed
class ConsentController {
    constructor(bankId) {
        this.consentService = new core_banking_1.ConsentService(bankId);
    }
    // Create a new consent
    async createConsent(req, res, next) {
        try {
            const { customerId, accountIds, permissions, psuIpAddress, psuUserAgent, tppId } = req.body;
            const consent = await this.consentService.createConsent(customerId, accountIds, permissions, psuIpAddress, psuUserAgent, tppId);
            res.status(201).json(consent);
        }
        catch (error) {
            next(error);
        }
    }
    // Get a specific consent
    async getConsent(req, res, next) {
        try {
            const { consent_id } = req.params;
            const consent = await this.consentService.getConsent(consent_id);
            if (consent) {
                res.status(200).json(consent);
            }
            else {
                res.status(404).json({ error: 'Consent not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Revoke a consent
    async revokeConsent(req, res, next) {
        try {
            const { consent_id } = req.params;
            const success = await this.consentService.revokeConsent(consent_id);
            if (success) {
                res.status(200).json({ message: 'Consent revoked successfully' });
            }
            else {
                res.status(404).json({ error: 'Consent not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ConsentController = ConsentController;
