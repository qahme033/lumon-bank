import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  CoreBankingClientConfig, 
  TransactionFilters,
  PaginatedResponse,
  ApiResponse,
  HealthStatus,
  ErrorDetails,
  Customer, 
  Account, 
  Consent, 
  Transaction, 
  User ,
  Balance
} from './types/index.js';
import { handleAxiosError, shouldRetry } from './utils/request-utils.js';

/**
 * Client for interacting with the Core Banking API
 */
export class CoreBankingClient {
  private apiClient: AxiosInstance;
  private bankId: string;
  private maxRetries: number = 3;

  /**
   * Creates a new CoreBankingClient
   * 
   * @param config - Configuration options for the client
   */
  constructor(config: CoreBankingClientConfig | string) {
    // Handle both object config and simple string bankId
    if (typeof config === 'string') {
      this.bankId = config;
      config = { bankId: config };
    } else {
      this.bankId = config.bankId;
    }

    const baseURL = config.baseUrl || 'http://localhost:3000/api/core-banking';
    
    this.apiClient = axios.create({
      baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Bank-ID': this.bankId,
        ...(config.headers || {})
      }
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // Implement retry logic for network errors and server errors
        if (
          originalRequest &&
          originalRequest._retry !== true &&
          originalRequest._retryCount < this.maxRetries &&
          shouldRetry(error.response?.status || 0)
        ) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          
          // Exponential backoff
          const delay = Math.pow(2, originalRequest._retryCount) * 300;
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return this.apiClient(originalRequest);
        }
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token for subsequent requests
   */
  setAuthToken(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    delete this.apiClient.defaults.headers.common['Authorization'];
  }

  // ==================== CUSTOMER ENDPOINTS ====================

  /**
   * Create a new customer
   */
  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      const response = await this.apiClient.post<Customer>('/customers', customerData);
      return response.data as Customer;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to create customer: ${errorDetails.message}`);
    }
  }

  /**
   * Get all customers, optionally filtered
   */
  async getCustomers(filters?: Record<string, any>): Promise<Customer[]> {
    try {
      const response = await this.apiClient.get<Customer[]>('/customers', { 
        params: filters 
      });
      return response.data || [];
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get customers: ${errorDetails.message}`);
    }
  }

  /**
   * Get a customer by ID
   */
  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const response = await this.apiClient.get<Customer>(`/customers/${customerId}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get customer: ${errorDetails.message}`);
    }
  }

  /**
   * Update a customer by ID
   */
  async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const response = await this.apiClient.put<Customer>(
        `/customers/${customerId}`, 
        updates
      );
      return response.data as Customer;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to update customer: ${errorDetails.message}`);
    }
  }

  /**
   * Delete a customer by ID
   */
  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      await this.apiClient.delete(`/customers/${customerId}`);
      return true;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to delete customer: ${errorDetails.message}`);
    }
  }

  /**
   * Get all accounts for a customer
   */
  async getCustomerAccounts(customerId: string): Promise<Account[]> {
    try {
      const response = await this.apiClient.get<Account[]>(
        `/customers/${customerId}/accounts`
      );
      return response.data || [];
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get customer accounts: ${errorDetails.message}`);
    }
  }

  // ==================== ACCOUNT ENDPOINTS ====================

  /**
   * Create a new account
   */
  async createAccount(accountData: Partial<Account>): Promise<Account> {
    try {
      const response = await this.apiClient.post<Account>('/accounts', accountData);
      return response.data as Account;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to create account: ${errorDetails.message}`);
    }
  }

  /**
   * Get all accounts, optionally filtered
   */
  async getAccounts(filters?: Record<string, any>): Promise<Account[]> {
    try {
      const response = await this.apiClient.get<Account[]>('/accounts', { 
        params: filters 
      });
      return response.data || [];
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get accounts: ${errorDetails.message}`);
    }
  }

  /**
   * Get an account by ID
   */
  async getAccount(accountId: string): Promise<Account | null> {
    try {
      const response = await this.apiClient.get<Account>(`/accounts/${accountId}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get account: ${errorDetails.message}`);
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(accountId: string): Promise<Balance | null> {
    try {
      const response = await this.apiClient.get<Balance>(
        `/accounts/${accountId}/balance`
      );
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get account balance: ${errorDetails.message}`);
    }
  }

  // ==================== CONSENT ENDPOINTS ====================

  /**
   * Create a new consent
   */
  async createConsent(consentData: Partial<Consent>): Promise<Consent> {
    try {
      const response = await this.apiClient.post<Consent>('/consent', consentData);
      return response.data as Consent;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to create consent: ${errorDetails.message}`);
    }
  }

  /**
   * Get a consent by ID
   */
  async getConsent(consentId: string): Promise<Consent | null> {
    try {
      const response = await this.apiClient.get<Consent>(`/consent/${consentId}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get consent: ${errorDetails.message}`);
    }
  }

  /**
   * Update a consent
   */
  async updateConsent(consentId: string, updates: Partial<Consent>): Promise<Consent> {
    try {
      const response = await this.apiClient.put<Consent>(
        `/consent/${consentId}`, 
        updates
      );
      return response.data as Consent;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to update consent: ${errorDetails.message}`);
    }
  }

  /**
   * Revoke a consent
   */
  async revokeConsent(consentId: string): Promise<Consent> {
    try {
      const response = await this.apiClient.put<Consent>(
        `/consent/${consentId}/revoke`, 
        {}
      );
      return response.data as Consent;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to revoke consent: ${errorDetails.message}`);
    }
  }

  // ==================== TRANSACTION ENDPOINTS ====================

  /**
   * Create a transaction for an account
   */
  async createTransaction(accountId: string, transactionData: Partial<Transaction>): Promise<Transaction> {
    try {
      const response = await this.apiClient.post<Transaction>(
        `/accounts/${accountId}/transactions`, 
        transactionData
      );
      return response.data as Transaction;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to create transaction: ${errorDetails.message}`);
    }
  }

  /**
   * Get a transaction by ID
   */
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const response = await this.apiClient.get<Transaction>(
        `/transactions/${transactionId}`
      );
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get transaction: ${errorDetails.message}`);
    }
  }

  /**
   * Get transactions for an account
   */
  async getTransactionsForAccount(
    accountId: string, 
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const response = await this.apiClient.get<PaginatedResponse<Transaction>>(
        `/accounts/${accountId}/transactions`,
        { params: filters }
      );
      return response.data as PaginatedResponse<Transaction>;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get account transactions: ${errorDetails.message}`);
    }
  }

  // ==================== USER ENDPOINTS ====================

  /**
   * Create a new user
   */
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.apiClient.post<User>('/users', userData);
      return response.data as User;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to create user: ${errorDetails.message}`);
    }
  }

  /**
   * Authenticate a user
   */
  async authenticateUser(credentials: { username: string; password: string }): Promise<{
    user: User;
    token: string;
  }> {
    try {
      const response = await this.apiClient.post<{ user: User; token: string }>(
        '/users/authenticate', 
        credentials
      );
      return response.data as { user: User; token: string };
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Authentication failed: ${errorDetails.message}`);
    }
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const response = await this.apiClient.get<User>(`/users/${userId}`);
      return response.data || null;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get user: ${errorDetails.message}`);
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(filters?: Record<string, any>): Promise<User[]> {
    try {
      const response = await this.apiClient.get<User[]>('/users', {
        params: filters
      });
      return response.data || [];
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get users: ${errorDetails.message}`);
    }
  }

  // ==================== DATABASE ENDPOINTS ====================

  /**
   * Get database snapshot
   */
  async getDatabaseSnapshot(): Promise<{
    customers: Customer[];
    accounts: Account[];
    transactions: Transaction[];
    consents: Consent[];
    users: User[];
  }> {
    try {
      const response = await this.apiClient.get<{
        customers: Customer[];
        accounts: Account[];
        transactions: Transaction[];
        consents: Consent[];
        users: User[];
      }>('/database/snapshot');
      return response.data as {
        customers: Customer[];
        accounts: Account[];
        transactions: Transaction[];
        consents: Consent[];
        users: User[];
      };
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Failed to get database snapshot: ${errorDetails.message}`);
    }
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check the health of the core banking service
   */
  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await this.apiClient.get<HealthStatus>('/health', {
        baseURL: this.apiClient.defaults.baseURL!.replace('/api/v1', '')
      });
      return response.data;
    } catch (error) {
      const errorDetails = handleAxiosError(error);
      throw new Error(`Health check failed: ${errorDetails.message}`);
    }
  }
}
