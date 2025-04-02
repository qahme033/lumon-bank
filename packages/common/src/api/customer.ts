// packages/common/src/api/customer.ts
import { ICustomer } from '../types/customer';
import axiosInstance from './axios-instance';

interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

class CustomerAPI {
  /**
   * Create a new customer.
   * @param payload - Details required to create a customer.
   * @returns The created customer.
   */
  async createCustomer(payload: CreateCustomerPayload): Promise<ICustomer> {
    const response = await axiosInstance.post<ICustomer>('/customers', payload);
    return response.data;
  }

  /**
   * Retrieve all customers.
   * @returns An array of customers.
   */
  async getCustomers(): Promise<ICustomer[]> {
    const response = await axiosInstance.get<ICustomer[]>('/customers');
    return response.data;
  }

  /**
   * Retrieve a specific customer by its ID.
   * @param customerId - The ID of the customer.
   * @returns The customer if found, otherwise null.
   */
  async getCustomer(customerId: string): Promise<ICustomer | null> {
    try {
      const response = await axiosInstance.get<ICustomer>(`/customers/${customerId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Update an existing customer.
   * @param customerId - The ID of the customer to update.
   * @param updates - The fields to update.
   * @returns The updated customer.
   */
  async updateCustomer(customerId: string, updates: UpdateCustomerPayload): Promise<ICustomer> {
    const response = await axiosInstance.put<ICustomer>(`/customers/${customerId}`, updates);
    return response.data;
  }

  /**
   * Delete a customer.
   * @param customerId - The ID of the customer to delete.
   */
  async deleteCustomer(customerId: string): Promise<void> {
    await axiosInstance.delete(`/customers/${customerId}`);
  }
}

// Export a singleton instance for reuse
export const customerAPI = new CustomerAPI();
