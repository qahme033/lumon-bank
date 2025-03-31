import { ConsentStatus, IBank, ITransaction } from '../data/in-memory-db';
export declare class DatabaseService {
    private db;
    private bankId;
    constructor(bankId: string);
    getDatabaseSnapshot(includeAllBanks?: boolean): Promise<any>;
    getStats(): Promise<any>;
    addBank(bank: IBank): void;
    getConsentStatus(consentId: string): Promise<ConsentStatus>;
    getTransaction(transactionId: string): Promise<ITransaction>;
}
