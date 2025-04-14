// mongodb-service.ts
import { MongoClient, Db, ObjectId } from 'mongodb';
import { IAccount, IBalance, IBank, IConsent, ICustomer, ITransaction,  } from '@banking-sim/common';
import { DatabaseSnapshot } from '../data/model.js';
import { DatabaseService } from './database-service.js';

export class MongoDBService implements DatabaseService {
  private static instance: MongoDBService;
  private client: MongoClient;
  private db: Db;
  private initialized: boolean = false;
  
  private constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.db = this.client.db('banking-sim');
  }

  // Singleton pattern with async initialization
  public static async getInstance(): Promise<MongoDBService> {
    if (!MongoDBService.instance) {
      const uri = process.env.MONGODB_URI || '';
      MongoDBService.instance = new MongoDBService(uri);
      await MongoDBService.instance.initialize();
    }
    return MongoDBService.instance;
  }
  
  private async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.client.connect();
      
      // Create indexes for better query performance
      await this.db.collection('customers').createIndex({ bankId: 1 });
      await this.db.collection('accounts').createIndex({ bankId: 1 });
      await this.db.collection('accounts').createIndex({ customerId: 1 });
      await this.db.collection('transactions').createIndex({ accountId: 1 });
      await this.db.collection('consents').createIndex({ bank_id: 1 });
      
      this.initialized = true;
    }
  }
  
  // Customers
  async addCustomer(customer: ICustomer): Promise<void> {
    await this.db.collection<ICustomer>('customers').insertOne(customer);
  }
  
  async getCustomer(customerId: string | ObjectId): Promise<ICustomer | null> {
    const objectId = customerId instanceof ObjectId ? customerId : new ObjectId(customerId);
    return this.db.collection<ICustomer>('customers').findOne({ id: objectId });
  }
  
  async updateCustomer(customer: ICustomer): Promise<void> {
    await this.db.collection<ICustomer>('customers').updateOne(
      { id: customer.id }, 
      { $set: customer }
    );
  }
  
  async deleteCustomer(customerId: string | ObjectId): Promise<void> {
    const objectId = customerId instanceof ObjectId ? customerId : new ObjectId(customerId);
    await this.db.collection('customers').deleteOne({ id: objectId });
  }
  
  async getCustomers(bankId?: string | ObjectId): Promise<ICustomer[]> {
    if (bankId) {
      const objectId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);
      return this.db.collection<ICustomer>('customers').find({ bankId: objectId }).toArray();
    }
    return this.db.collection<ICustomer>('customers').find({}).toArray();
  }
  
  // Accounts
  async addAccount(account: IAccount): Promise<void> {
    await this.db.collection<IAccount>('accounts').insertOne(account);
  }
  
  async getAccount(accountId: string | ObjectId): Promise<IAccount | null> {
    const objectId = accountId instanceof ObjectId ? accountId : new ObjectId(accountId);
    return this.db.collection<IAccount>('accounts').findOne({ id: objectId });
  }
  
  async getAccounts(bankId?: string | ObjectId): Promise<IAccount[]> {
    if (bankId) {
      const objectId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);
      return this.db.collection<IAccount>('accounts').find({ bankId: objectId }).toArray();
    }
    return this.db.collection<IAccount>('accounts').find({}).toArray();
  }
  
  async getAccountsByCustomer(customerId: string | ObjectId): Promise<IAccount[]> {
    const objectId = customerId instanceof ObjectId ? customerId : new ObjectId(customerId);
    return this.db.collection<IAccount>('accounts').find({ customerId: objectId }).toArray();
  }
  
  // Balances
  async setBalance(accountId: string | ObjectId, balance: IBalance): Promise<void> {
    const objectId = accountId instanceof ObjectId ? accountId : new ObjectId(accountId);
    await this.db.collection<IBalance>('balances').updateOne(
      { _id: objectId }, 
      { $set: balance },
      { upsert: true }
    );
  }
  
  async getBalance(accountId: string | ObjectId): Promise<IBalance | null> {
    const objectId = accountId instanceof ObjectId ? accountId : new ObjectId(accountId);
    return this.db.collection<IBalance>('balances').findOne({ _id: objectId });
  }
  
  // Transactions
  async addTransaction(transaction: ITransaction): Promise<void> {
    await this.db.collection<ITransaction>('transactions').insertOne(transaction);
  }
  
  async getTransaction(transactionId: string | ObjectId): Promise<ITransaction | null> {
    const objectId = transactionId instanceof ObjectId ? transactionId : new ObjectId(transactionId);
    return this.db.collection<ITransaction>('transactions').findOne({ id: objectId });
  }
  
  async getTransactionsByAccount(accountId: string | ObjectId): Promise<ITransaction[]> {
    const objectId = accountId instanceof ObjectId ? accountId : new ObjectId(accountId);
    return this.db.collection<ITransaction>('transactions')
      .find({ accountId: objectId })
      .sort({ timestamp: -1 })
      .toArray();
  }
  
  // Consents
  async addConsent(consent: IConsent): Promise<void> {
    await this.db.collection<IConsent>('consents').insertOne(consent);
  }
  
  async getConsent(consentId: string | ObjectId): Promise<IConsent | null> {
    const objectId = consentId instanceof ObjectId ? consentId : new ObjectId(consentId);
    return this.db.collection<IConsent>('consents').findOne({ consent_id: objectId });
  }
  
  async updateConsent(consent: IConsent): Promise<void> {
    await this.db.collection<IConsent>('consents').updateOne(
      { consent_id: consent.consent_id }, 
      { $set: consent }
    );
  }
  
  async getConsents(query: any): Promise<IConsent[]> {
    return this.db.collection<IConsent>('consents').find(query).toArray();
  }
  
  // Banks
  async getBank(bankId: string | ObjectId): Promise<IBank | null> {
    const objectId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);
    return this.db.collection<IBank>('banks').findOne({ id: objectId });
  }
  
  async addBank(bank: IBank): Promise<void> {
    await this.db.collection<IBank>('banks').insertOne(bank);
  }
  
  // Database snapshot
  async getDatabaseSnapshot(bankId?: string | ObjectId): Promise<DatabaseSnapshot> {
    let bankOId = null;
    if (bankId) {
      bankOId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);
    }

    const query = bankOId ? { bankId: bankOId } : {};
    const accountQuery = bankOId ? { bankId: bankOId } : {};
    const consentQuery = bankOId ? { bank_id: bankOId } : {};
    
    // Get all collections
    const [customers, accounts, balances, transactions, payments, mandates, consents] = 
      await Promise.all([
        this.db.collection<ICustomer>('customers').find(query).toArray(),
        this.db.collection<IAccount>('accounts').find(accountQuery).toArray(),
        this.db.collection<IBalance>('balances').find({}).toArray(),
        this.db.collection<ITransaction>('transactions').find({}).toArray(),
        this.db.collection('payments').find(query).toArray(),
        this.db.collection('mandates').find(query).toArray(),
        this.db.collection<IConsent>('consents').find(consentQuery).toArray()
      ]);
    
    // Filter balances and transactions by account's bankId if bankId provided
    let filteredBalances = balances;
    let filteredTransactions = transactions;
    
    if (bankId) {
      const accountIds = accounts.map(a => a.id);
      filteredBalances = balances.filter(b => accountIds.includes(b._id));
      filteredTransactions = transactions.filter(t => accountIds.includes(t.accountId));
    }
    
    // Convert arrays to objects keyed by ID for compatibility
    return {
      customers: this.arrayToObject(customers, 'id'),
      accounts: this.arrayToObject(accounts, 'id'),
      balances: this.arrayToObject(filteredBalances, '_id'),
      transactions: this.groupTransactionsByAccount(filteredTransactions),
      payments: this.arrayToObject(payments, 'id'),
      mandates: this.arrayToObject(mandates, 'id'),
      consents: this.arrayToObject(consents, 'consent_id')
    };
  }
  
  // Helper to convert array to object
  private arrayToObject<T>(array: T[], keyField: keyof T): Record<string, T> {
    return array.reduce((obj, item) => {
      const key = String(item[keyField]);
      return { ...obj, [key]: item };
    }, {});
  }
  
  // Group transactions by account ID
  private groupTransactionsByAccount(transactions: ITransaction[]): Record<string, ITransaction[]> {
    const grouped: Record<string, ITransaction[]> = {};
    
    for (const transaction of transactions) {
      if (!grouped[transaction.accountId.toString()]) {
        grouped[transaction.accountId.toString()] = [];
      }
      grouped[transaction.accountId.toString()].push(transaction);
    }
    
    return grouped;
  }
  
  // Reset database for a specific bank
  async reset(bankId: string | ObjectId): Promise<void> {
    const bankOId = bankId instanceof ObjectId ? bankId : new ObjectId(bankId);

    const collections = [
      'customers', 'accounts', 'payments', 'mandates', 'consents'
    ];
    
    // Delete all documents for this bank from these collections
    const deletePromises = collections.map(collection => 
      this.db.collection(collection).deleteMany({ bankId: bankOId })
    );
    
    // Special case for consents which use bank_id
    deletePromises.push(
      this.db.collection('consents').deleteMany({ bank_id: bankOId })
    );
    
    // Get account IDs for this bank
    const accounts = await this.db.collection<IAccount>('accounts').find({ bankId: bankOId }).toArray();
    const accountIds = accounts.map(a => a.id);
    
    // Delete balances and transactions for these accounts
    if (accountIds.length > 0) {
      deletePromises.push(
        this.db.collection('balances').deleteMany({ _id: { $in: accountIds } }),
        this.db.collection('transactions').deleteMany({ accountId: { $in: accountIds } })
      );
    }
    
    await Promise.all(deletePromises);
  }
  
  // Close connection when needed
  async close(): Promise<void> {
    await this.client.close();
  }
}

// Export factory function for dependency injection
export async function getDatabaseService(): Promise<DatabaseService> {
  return MongoDBService.getInstance();
}
