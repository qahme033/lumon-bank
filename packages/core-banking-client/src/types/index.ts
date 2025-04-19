

export { 
  Customer, 
  Account, 
  Consent, 
  Transaction, 
  User ,
  Balance,
  AccountStatus,
  AccountType,
  BalanceResponse,
  ConsentPermission,
  ConsentStatus,
  UserRole
} from '@banking-sim/core-banking';

// Client-specific types
export interface CoreBankingClientConfig {
  bankId: string;
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AccountBalance {
  available: number;
  current: number;
  currency: string;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface TransactionFilters extends PaginationParams {
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  type?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ErrorDetails {
  status: number;
  message: string;
  code?: string;
}

export interface HealthStatus {
  status: string;
  bankId: string;
  timestamp: string;
  version?: string;
}
