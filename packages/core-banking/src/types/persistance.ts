import { ObjectId } from "mongodb";

export interface ICustomer {
    id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    bankId: ObjectId; // Add this field

  }
  

export  enum ConsentPermission {
    ACCOUNT_DETAILS = "account:details:read",
    TRANSACTIONS = "transactions:read",
    BALANCE = "balances:read"
}
export  enum ConsentStatus {
    AWAITING_AUTHORIZATION = "AWAITING_AUTHORIZATION",
    AUTHORIZED = "AUTHORIZED",
    REVOKED = "REVOKED"
}
export interface IBank {
    id: ObjectId;
    name: string;
}
export interface IConsent {
    consentId: ObjectId;
    customerId: ObjectId;
    accountIds: ObjectId[];
    permissions: ConsentPermission[];
    status: ConsentStatus;
    createdAt: Date;
    expiresAt: Date;
    authorizationUrl: string;
    bankId: ObjectId;
    psuIpAddress: string;
    psuUserAgent: string;
    tppId: string;
}


export interface ITransaction {
    id: ObjectId;
    accountId: ObjectId;
    amount: number;
    description: string;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
    timestamp: Date;
}

// packages/common/src/index.ts
// Export enums and interfaces
export enum AccountType {
    CURRENT = 'CURRENT',
    SAVINGS = 'SAVINGS',
    CREDIT_CARD = 'CREDIT_CARD',
    LOAN = 'LOAN'
  }
  
  export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED'
  }
  
  export interface IAccount {
    id: ObjectId;
    customerId: ObjectId;
    bankId: ObjectId;
    accountType: AccountType;
    accountName: string;
    currency: string;
    status: AccountStatus;
    departmentCode: string;
    createdAt: Date;
    updatedAt: Date;         
  }
  
  export interface IBalance {
    id: ObjectId;
    // accountId: ObjectId;
    available: number;
    current: number;
    pending: number;
  }

  export interface IBalanceResponse {
    accountId: ObjectId;
    balances: {
      balanceType: string;
      amount: number;
      currency: string;
    }[];
    timestamp: string;
  }

  // User role enum
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

// Authentication type enum
export enum AuthType {
  PASSWORD = 'PASSWORD',
  OAUTH = 'OAUTH',
  API_KEY = 'API_KEY'
}

// User interface
export interface IUser {
  id: ObjectId;
  username: string;
  password?: string;
  role: UserRole;
  customerId?: ObjectId;  // Required for customer users, links to a customer record
  authType: AuthType;
  bankId: ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  status: UserStatus;
  email?: string;
  permissions?: string[];  // Optional array of specific permissions
}


// User status enum
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING_ACTIVATION = 'PENDING_ACTIVATION'
}

// User session interface for tracking active sessions
export interface IUserSession {
  id: ObjectId;
  userId: ObjectId;
  token: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
}

// Authentication result interface
export interface IAuthResult {
  user: Omit<IUser, 'password'>;
  token: string;
  expiresAt: Date;
}

// Token payload interface
export interface ITokenPayload {
  sub: string;
  username: string;
  role: UserRole;
  customerId?: string;
  authType: AuthType;
  bankId: string;
  scope: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

  // Add a simple utility function to ensure the module is recognized
  export function formatAccountId(id: string): string {
    return `ACC-${id}`;
  }
  