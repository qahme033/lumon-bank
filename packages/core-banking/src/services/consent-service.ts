import { v4 as uuidv4 } from 'uuid';
import { ConsentPermission, ConsentStatus, IConsent } from '@banking-sim/common'
import { DatabaseService } from './database-service.js';
import { getDatabaseService } from './mongodb-service.js';
import { ObjectId } from 'mongodb';

export class ConsentService {
  private db?: DatabaseService;
  private bankId: string;

  constructor(bankId: string) {
    this.bankId = bankId;
  }

  // Helper method to get database instance
  private async getDatabase(): Promise<DatabaseService> {
    if (!this.db) {
      this.db = await getDatabaseService();
    }
    return this.db;
  }

  /**
   * Create a new consent record.
   */
  async createConsent(
    customerId: string,
    accountIds: string[],
    permissions: ConsentPermission[],
    psuIpAddress: string,
    psuUserAgent: string,
    tppId: string
  ): Promise<IConsent> {
    const db = await this.getDatabase();
  
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
    const customer = await db.getCustomer(customerId);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} does not exist.`);
    }
  
    // 2. Validate Bank
    const bankId = customer.bankId;
    const bank = await db.getBank(bankId);
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
      const account = await db.getAccount(accountId);
      if (!account) {
        throw new Error(`Account with ID ${accountId} does not exist.`);
      }
  
      if (account.bankId !== bankId) {
        throw new Error(
          `Account with ID ${accountId} does not belong to bank with ID ${bankId}.`
        );
      }
  
      // Check if account belongs to customer
      if (account.customerId.toString() !== customerId) {
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
  
    // Create the consent
    const consent_id = uuidv4();
    const created_at = new Date();
    const expires_at = new Date(Date.now() + 86400000); // Consent valid for 24 hours
    const authorization_url = `https://example.com/authorize?consent_id=${consent_id}`;
  
    const consent: IConsent = {
      consent_id: new ObjectId(consent_id),
      customer_id: new ObjectId(customerId),
      bank_id: bankId,
      account_ids: validatedAccountIds.map(id => new ObjectId(id)),
      permissions,
      status: ConsentStatus.AWAITING_AUTHORIZATION,
      created_at,
      expires_at,
      authorization_url,
      psu_ip_address: psuIpAddress,
      psu_user_agent: psuUserAgent,
      tpp_id: tppId
    };
  
    // Store the consent
    await db.addConsent(consent);
  
    return consent;
  }

  /**
   * Retrieve a consent record by its ID.
   */
  async getConsent(consentId: string): Promise<IConsent | null> {
    const db = await this.getDatabase();
    const consent = await db.getConsent(consentId);
    
    if (consent && consent.bank_id.toString() === this.bankId) {
      return consent;
    }
    return null;
  }

  /**
   * Retrieve all consents for this bank, optionally filtering by customer ID.
   */
  async getConsents(customerId?: string): Promise<IConsent[]> {
    const db = await this.getDatabase();
    
    const query: any = { bank_id: this.bankId };
    if (customerId) {
      query.customer_id = customerId;
    }
    
    return db.getConsents(query);
  }

  /**
   * Update a consent record.
   */
  async updateConsent(
    consentId: string,
    updates: { permissions?: ConsentPermission[]; status?: ConsentStatus }
  ): Promise<IConsent | null> {
    const db = await this.getDatabase();
    const consent = await this.getConsent(consentId);
    
    if (!consent) {
      return null;
    }

    const updatedConsent: IConsent = {
      ...consent,
      permissions: updates.permissions || consent.permissions,
      status: updates.status || consent.status
    };

    await db.updateConsent(updatedConsent);
    return updatedConsent;
  }

  /**
   * Revoke a consent by setting its status to 'REVOKED'.
   */
  async revokeConsent(consentId: string): Promise<boolean> {
    const db = await this.getDatabase();
    const consent = await this.getConsent(consentId);
    
    if (!consent) {
      return false;
    }

    const updatedConsent: IConsent = {
      ...consent,
      status: ConsentStatus.REVOKED
    };
    
    await db.updateConsent(updatedConsent);
    return true;
  }
}
