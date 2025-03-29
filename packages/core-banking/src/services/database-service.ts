// packages/core-banking/src/services/database-service.ts
import { InMemoryDatabase } from '../data/in-memory-db';

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
}
