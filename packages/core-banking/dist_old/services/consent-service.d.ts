import { ConsentPermission, ConsentStatus, IConsent } from '../data/in-memory-db';
/**
 * Your IConsent interface (defined in your in-memory DB file) should now include:
 *
 * export interface IConsent {
 *   consent_id: string;
 *   customer_id: string;
 *   bank_id: string;
 *   account_ids: string[];
 *   permissions: string[];
 *   status: string; // e.g., AWAITING_AUTHORIZATION, AUTHORIZED, REVOKED
 *   created_at: Date;
 *   expires_at: Date;
 *   authorization_url: string;
 *   psu_ip_address: string;
 *   psu_user_agent: string;
 *   tpp_id: string;
 * }
 */
export declare class ConsentService {
    private db;
    private bankId;
    constructor(bankId: string);
    /**
     * Create a new consent record.
     * @param customerId The ID of the customer granting consent.
     * @param accountIds An array of account IDs this consent applies to.
     * @param permissions A list of permissions (e.g., 'account_details', 'transactions').
     * @param psuIpAddress IP address of the Payment Service User.
     * @param psuUserAgent User-Agent string from the PSU's device.
     * @param tppId Third-Party Provider identifier.
     * @returns The newly created consent record.
     */
    createConsent(customerId: string, accountIds: string[], permissions: ConsentPermission[], psuIpAddress: string, psuUserAgent: string, tppId: string): Promise<IConsent>;
    /**
     * Retrieve a consent record by its ID.
     * @param consentId The unique ID of the consent.
     * @returns The consent record or null if not found or not matching the bank.
     */
    getConsent(consentId: string): Promise<IConsent | null>;
    /**
     * Retrieve all consents for this bank, optionally filtering by customer ID.
     * @param customerId (Optional) Filter consents for a specific customer.
     * @returns An array of consent records.
     */
    getConsents(customerId?: string): Promise<IConsent[]>;
    /**
     * Update a consent record.
     * @param consentId The unique ID of the consent to update.
     * @param updates Object containing fields to update (e.g., permissions, status).
     * @returns The updated consent record or null if not found.
     */
    updateConsent(consentId: string, updates: {
        permissions?: ConsentPermission[];
        status?: ConsentStatus;
    }): Promise<IConsent | null>;
    /**
     * Revoke a consent by setting its status to 'REVOKED'.
     * @param consentId The unique ID of the consent to revoke.
     * @returns True if revocation was successful, false otherwise.
     */
    revokeConsent(consentId: string): Promise<boolean>;
    /**
     * Delete a consent record.
     * @param consentId The unique ID of the consent to delete.
     * @returns True if deletion was successful, false otherwise.
     */
    deleteConsent(consentId: string): Promise<boolean>;
}
