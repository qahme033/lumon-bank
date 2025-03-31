import { ITransaction } from '../data/in-memory-db';
export declare class TransactionService {
    private db;
    private bankId;
    constructor(bankId: string);
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
    createTransaction(accountId: string, amount: number, description: string, type: 'CREDIT' | 'DEBIT', status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'): Promise<ITransaction>;
    /**
     * Retrieves a transaction by its ID.
     *
     * @param transactionId The ID of the transaction to retrieve.
     * @returns The matching transaction.
     * @throws An error if the transaction is not found or does not belong to the current bank.
     */
    getTransaction(transactionId: string): Promise<ITransaction>;
    /**
     * Retrieves all transactions for a specific account.
     *
     * @param accountId The account ID whose transactions are to be retrieved.
     * @returns An array of transactions for the account.
     * @throws An error if the account is not found or does not belong to the current bank.
     */
    getTransactionsForAccount(accountId: string): Promise<ITransaction[]>;
}
