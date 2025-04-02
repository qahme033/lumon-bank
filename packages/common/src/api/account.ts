// packages/common/src/api/account.ts
import { AccountStatus, AccountType, IAccount, IBalanceResponse } from '../types/account';
import axiosInstance from './axios-instance';

interface CreateAccountPayload {
  customerId: string;
  accountType: AccountType;
  accountName: string;
  currency: string;
  initialBalance?: number;
  status?: AccountStatus;
}

interface UpdateAccountPayload {
  accountName?: string;
  currency?: string;
  status?: AccountStatus;
  // Add other fields as needed
}

class AccountAPI {
  /**
   * Create a new account.
   * @param payload - Details required to create an account.
   * @returns The created account.
   */
  async createAccount(payload: CreateAccountPayload): Promise<IAccount> {
    const response = await axiosInstance.post<IAccount>('/accounts', payload);
    return response.data;
  }

  /**
   * Retrieve all accounts for a specific customer.
   * @param customerId - The ID of the customer.
   * @returns An array of accounts.
   */
  async getAccounts(customerId: string): Promise<IAccount[]> {
    const response = await axiosInstance.get<IAccount[]>('/accounts', {
      params: { customerId },
    });
    return response.data;
  }

  /**
   * Retrieve a specific account by its ID.
   * @param accountId - The ID of the account.
   * @returns The account if found, otherwise null.
   */
  async getAccount(accountId: string): Promise<IAccount | null> {
    try {
      const response = await axiosInstance.get<IAccount>(`/accounts/${accountId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Retrieve the balance details of an account.
   * @param accountId - The ID of the account.
   * @returns The balance details if found, otherwise null.
   */
  async getAccountBalance(accountId: string): Promise<IBalanceResponse | null> {
    try {
      const response = await axiosInstance.get<IBalanceResponse>(`/accounts/${accountId}/balance`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Update an existing account.
   * @param accountId - The ID of the account to update.
   * @param updates - The fields to update.
   * @returns The updated account.
   */
  async updateAccount(accountId: string, updates: UpdateAccountPayload): Promise<IAccount> {
    const response = await axiosInstance.put<IAccount>(`/accounts/${accountId}`, updates);
    return response.data;
  }

  /**
   * Delete an account.
   * @param accountId - The ID of the account to delete.
   */
  async deleteAccount(accountId: string): Promise<void> {
    await axiosInstance.delete(`/accounts/${accountId}`);
  }
}

// Export a singleton instance for reuse
export const accountAPI = new AccountAPI();
