// packages/common/src/api/consent.ts
import { IConsent } from '../types/types.js';
import axiosInstance from './axios-instance.js';

interface CreateConsentPayload {
  customer_id: string;
  account_ids: string[];
  permissions: string[];
  psu_ip_address: string;
  psu_user_agent: string;
  tpp_id: string;
}

interface UpdateConsentPayload {
  permissions?: string[];
  status?: string;
}

class ConsentAPI {
  /**
   * Create a new consent.
   * @param payload - Details required to create a consent.
   * @returns The created consent.
   */
  async createConsent(payload: CreateConsentPayload): Promise<IConsent> {
    const response = await axiosInstance.post<IConsent>('/consent', payload);
    return response.data;
  }

  /**
   * Retrieve a specific consent by its ID.
   * @param consentId - The ID of the consent.
   * @returns The consent if found, otherwise null.
   */
  async getConsent(consentId: string): Promise<IConsent | null> {
    try {
      const response = await axiosInstance.get<IConsent>(`/consent/${consentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update an existing consent.
   * @param consentId - The ID of the consent to update.
   * @param updates - The fields to update.
   * @returns The updated consent.
   */
  async updateConsent(consentId: string, updates: UpdateConsentPayload): Promise<IConsent> {
    const response = await axiosInstance.put<IConsent>(`/consent/${consentId}`, updates);
    return response.data;
  }

  /**
   * Revoke a consent by setting its status to 'REVOKED'.
   * @param consentId - The ID of the consent to revoke.
   * @returns True if revocation was successful, false if not found.
   */
  async revokeConsent(consentId: string): Promise<boolean> {
    try {
      await axiosInstance.put(`/consents/${consentId}/revoke`, {});
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Delete a consent.
   * @param consentId - The ID of the consent to delete.
   */
  async deleteConsent(consentId: string): Promise<void> {
    await axiosInstance.delete(`/consents/${consentId}`);
  }
}

// Export a singleton instance for reuse
export const consentAPI = new ConsentAPI();
