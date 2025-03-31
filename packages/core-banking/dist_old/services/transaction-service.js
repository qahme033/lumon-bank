"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const uuid_1 = require("uuid");
const in_memory_db_1 = require("../data/in-memory-db");
class TransactionService {
    constructor(bankId) {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
        this.bankId = bankId;
    }
    /**
     * Creates a new transaction for a given account.
     *
     * @param accountId The account ID for which the transaction is created.
     * @param amount The transaction amount.
     * @param description A description for the transaction.
     * @param type The type of the transaction ('CREDIT' or 'DEBIT').
     * @param status The transaction status, defaulting to 'PENDING'.
     * @returns The created transaction.
     */
    async createTransaction(accountId, amount, description, type, status = 'PENDING') {
        // Verify the account exists and belongs to the current bank.
        const account = this.db.accounts.get(accountId);
        if (!account || account.bankId !== this.bankId) {
            throw new Error('Account not found or does not belong to the current bank');
        }
        const transaction = {
            id: (0, uuid_1.v4)(),
            accountId,
            amount,
            description,
            type,
            status,
            timestamp: new Date()
        };
        // Ensure a transaction list exists for the account.
        if (!this.db.transactions.has(accountId)) {
            this.db.transactions.set(accountId, []);
        }
        const transactions = this.db.transactions.get(accountId);
        transactions.push(transaction);
        return transaction;
    }
    /**
     * Retrieves a transaction by its ID.
     *
     * @param transactionId The ID of the transaction to retrieve.
     * @returns The matching transaction.
     * @throws An error if the transaction is not found or does not belong to the current bank.
     */
    async getTransaction(transactionId) {
        // Iterate over each account's transaction list.
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
    /**
     * Retrieves all transactions for a specific account.
     *
     * @param accountId The account ID whose transactions are to be retrieved.
     * @returns An array of transactions for the account.
     * @throws An error if the account is not found or does not belong to the current bank.
     */
    async getTransactionsForAccount(accountId) {
        // Verify the account exists and belongs to the current bank.
        const account = this.db.accounts.get(accountId);
        if (!account || account.bankId !== this.bankId) {
            throw new Error('Account not found or does not belong to the current bank');
        }
        return this.db.transactions.get(accountId) || [];
    }
}
exports.TransactionService = TransactionService;
