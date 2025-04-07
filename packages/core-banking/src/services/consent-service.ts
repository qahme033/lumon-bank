import { v4 as uuidv4 } from 'uuid';
import { ConsentPermission, ConsentStatus, IConsent, InMemoryDatabase } from '../data/in-memory-db.js';

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

export class ConsentService {
  private db: InMemoryDatabase;
  private bankId: string;

  constructor(bankId: string) {
    this.db = InMemoryDatabase.getInstance();
    this.bankId = bankId;
  }

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
  async createConsent(
    customerId: string,
    accountIds: string[],
    permissions: ConsentPermission[],
    psuIpAddress: string,
    psuUserAgent: string,
    tppId: string
  ): Promise<IConsent> {
    const db = InMemoryDatabase.getInstance();
  
    // Basic Input Validation
    if (
      !customerId ||
      !permissions ||
      permissions.length === 0 ||
      !psuIpAddress ||
      !psuUserAgent ||
      !tppId
    ) {
      throw new Error(
        'Customer ID, at least one permission, PSU IP, PSU User-Agent, and TPP ID are required'
      );
    }
  
    // 1. Validate Customer
    const customer = db.customers.get(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} does not exist.`);
    }
  
    // 2. Validate Bank (Assuming consent is tied to a specific bank)
    const bankId = customer.bankId;
    const bank = db.banks.get(bankId);
    if (!bank) {
      throw new Error(`Bank with ID ${bankId} does not exist.`);
    }
  
    // 3. Validate Accounts
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      throw new Error('At least one account ID must be provided.');
    }
  
    // Collect validated account IDs
    const validatedAccountIds: string[] = [];
  
    for (const accountId of accountIds) {
      const account = db.accounts.get(accountId);
      if (!account) {
        throw new Error(`Account with ID ${accountId} does not exist.`);
      }
  
      if (account.bankId !== bankId) {
        throw new Error(
          `Account with ID ${accountId} does not belong to bank with ID ${bankId}.`
        );
      }
  
      // Optionally, check if the account belongs to the customer
      if (account.customerId !== customerId) { // Assuming IAccount has a customerId field
        throw new Error(
          `Account with ID ${accountId} does not belong to customer with ID ${customerId}.`
        );
      }
  
      validatedAccountIds.push(accountId);
    }
  
    // 4. Validate Permissions
    const validPermissions = Object.values(ConsentPermission);
    for (const permission of permissions) {
      if (!validPermissions.includes(permission)) {
        throw new Error(`Invalid permission: ${permission}`);
      }
    }
  
    // 5. (Optional) Validate TPP ID
    // If you have a list or method to validate TPPs, implement it here.
    // For example:
    // const tpp = db.tpps.get(tppId);
    // if (!tpp) {
    //   throw new Error(`TPP with ID ${tppId} is not authorized.`);
    // }
  
    // All validations passed, create the consent
    const consent_id = uuidv4();
    const created_at = new Date();
    const expires_at = new Date(Date.now() + 86400000); // Consent valid for 24 hours
    const authorization_url = `https://example.com/authorize?consent_id=${consent_id}`;
  
    const consent: IConsent = {
      consent_id,
      customer_id: customerId,
      bank_id: bankId,
      account_ids: validatedAccountIds,
      permissions,
      status: ConsentStatus.AWAITING_AUTHORIZATION,
      created_at,
      expires_at,
      authorization_url,
      psu_ip_address: psuIpAddress,
      psu_user_agent: psuUserAgent,
      tpp_id: tppId
    };
  
    // Store the consent record in the in-memory DB
    db.consents.set(consent_id, consent);
  
    return consent;
  }

  /**
   * Retrieve a consent record by its ID.
   * @param consentId The unique ID of the consent.
   * @returns The consent record or null if not found or not matching the bank.
   */
  async getConsent(consentId: string): Promise<IConsent | null> {
    const consent = this.db.consents.get(consentId) as IConsent | undefined;
    if (consent && consent.bank_id === this.bankId) {
      return consent;
    }
    return null;
  }

  /**
   * Retrieve all consents for this bank, optionally filtering by customer ID.
   * @param customerId (Optional) Filter consents for a specific customer.
   * @returns An array of consent records.
   */
  async getConsents(customerId?: string): Promise<IConsent[]> {
    const consents: IConsent[] = [];
    for (const [, consent] of this.db.consents) {
      const c = consent as IConsent;
      if (c.bank_id === this.bankId && (!customerId || c.customer_id === customerId)) {
        consents.push(c);
      }
    }
    return consents;
  }

  /**
   * Update a consent record.
   * @param consentId The unique ID of the consent to update.
   * @param updates Object containing fields to update (e.g., permissions, status).
   * @returns The updated consent record or null if not found.
   */
  async updateConsent(
    consentId: string,
    updates: { permissions?: ConsentPermission[]; status?: ConsentStatus }
  ): Promise<IConsent | null> {
    const consent = await this.getConsent(consentId);
    if (!consent) {
      return null;
    }

    const updatedConsent: IConsent = {
      ...consent,
      permissions: updates.permissions || consent.permissions,
      status: updates.status || consent.status
    };

    this.db.consents.set(consentId, updatedConsent);
    return updatedConsent;
  }

  /**
   * Revoke a consent by setting its status to 'REVOKED'.
   * @param consentId The unique ID of the consent to revoke.
   * @returns True if revocation was successful, false otherwise.
   */
  async revokeConsent(consentId: string): Promise<boolean> {
    const consent = await this.getConsent(consentId);
    if (!consent) {
      return false;
    }

    const updatedConsent: IConsent = {
      ...consent,
      status: ConsentStatus.REVOKED
    };
    this.db.consents.set(consentId, updatedConsent);
    return true;
  }

 
}
