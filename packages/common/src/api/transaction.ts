// packages/common/src/api/transaction.ts
import axiosInstance from './axios-instance';
import { ITransaction } from '../types/types';

interface CreateTransactionPayload {
  accountId: string;
  amount: number;
  transactionType: string; // e.g., 'credit' or 'debit'
  description?: string;
  // Add other fields as needed
}

class TransactionAPI {

/**
 * Retrieve a single transaction by its ID.
 * @param transactionId - The ID of the transaction to retrieve.
 * @returns The transaction if found, otherwise null.
 */
async getTransaction(transactionId: string): Promise<ITransaction | null> {
    try {
      const response = await axiosInstance.get<ITransaction>(`/transactions/${transactionId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error; // Re-throw other errors
    }
  }
}

// Export a singleton instance for reuse
export const transactionAPI = new TransactionAPI();
