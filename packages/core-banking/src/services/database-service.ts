// packages/core-banking/src/services/database-service.ts
import { ConsentStatus, IBank, IConsent, InMemoryDatabase } from '../data/in-memory-db';

export class DatabaseService {
  private db: InMemoryDatabase;
  private bankId: string;

  constructor(bankId: string) {
    this.db = InMemoryDatabase.getInstance();
    this.bankId = bankId;
  }

  async getDatabaseSnapshot(includeAllBanks: boolean = false): Promise<any> {
    return this.db.getDatabaseSnapshot(includeAllBanks ? undefined : this.bankId);
  }

  async getStats(): Promise<any> {
    const snapshot = await this.getDatabaseSnapshot();
    
    return {
      customers: Object.keys(snapshot.customers).length,
      accounts: Object.keys(snapshot.accounts).length,
      transactions: (Object.values(snapshot.transactions) as any[][])
      .reduce((total, txList) => total + txList.length, 0),
      totalBalance: Object.entries(snapshot.balances)
        .reduce((total, [_, balance]: [string, any]) => total + balance.current, 0)
    };
  }
  public addBank(bank: IBank): void {
    if (this.db.banks.has(bank.id)) {
      throw new Error(`Bank with ID ${bank.id} already exists.`);
    }
    this.db.banks.set(bank.id, bank);
  }
   // The getConsentStatus method retrieves the status of a given consent.
   async getConsentStatus(consentId: string): Promise<ConsentStatus> {
    const consent = this.db.consents.get(consentId) as IConsent | undefined;
    if (!consent) {
      throw new Error(`Consent with ID ${consentId} not found.`);
    }
    // Verify the consent belongs to the bank associated with this service.
    if (consent.bank_id !== this.bankId) {
      throw new Error(`Consent with ID ${consentId} does not belong to bank ${this.bankId}.`);
    }
    return consent.status;
  }
}
