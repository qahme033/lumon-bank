"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
// packages/core-banking/src/services/database-service.ts
const in_memory_db_1 = require("../data/in-memory-db");
class DatabaseService {
    constructor(bankId) {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
        this.bankId = bankId;
    }
    async getDatabaseSnapshot(includeAllBanks = false) {
        return this.db.getDatabaseSnapshot(includeAllBanks ? undefined : this.bankId);
    }
    async getStats() {
        const snapshot = await this.getDatabaseSnapshot();
        return {
            customers: Object.keys(snapshot.customers).length,
            accounts: Object.keys(snapshot.accounts).length,
            transactions: Object.values(snapshot.transactions)
                .reduce((total, txList) => total + txList.length, 0),
            totalBalance: Object.entries(snapshot.balances)
                .reduce((total, [_, balance]) => total + balance.current, 0)
        };
    }
    addBank(bank) {
        if (this.db.banks.has(bank.id)) {
            throw new Error(`Bank with ID ${bank.id} already exists.`);
        }
        this.db.banks.set(bank.id, bank);
    }
    // The getConsentStatus method retrieves the status of a given consent.
    async getConsentStatus(consentId) {
        const consent = this.db.consents.get(consentId);
        if (!consent) {
            throw new Error(`Consent with ID ${consentId} not found.`);
        }
        // Verify the consent belongs to the bank associated with this service.
        if (consent.bank_id !== this.bankId) {
            throw new Error(`Consent with ID ${consentId} does not belong to bank ${this.bankId}.`);
        }
        return consent.status;
    }
    // Retrieves a transaction by its ID.
    async getTransaction(transactionId) {
        // Iterate over each account's transaction list in the in-memory database.
        for (const [accountId, txList] of this.db.transactions.entries()) {
            for (const transaction of txList) {
                if (transaction.id === transactionId) {
                    // Verify that the transaction's account belongs to the current bank.
                    const account = this.db.accounts.get(accountId);
                    if (account && account.bankId === this.bankId) {
                        return transaction;
                    }
                    else {
                        throw new Error(`Transaction with ID ${transactionId} does not belong to bank ${this.bankId}.`);
                    }
                }
            }
        }
        throw new Error(`Transaction with ID ${transactionId} not found.`);
    }
}
exports.DatabaseService = DatabaseService;
