// packages/common/src/.ts

import {
    ICustomer,
    IBank,
    IConsent,
    ITransaction,
    IAccount,
    IBalance,
    IBalanceResponse,
    IUser,
    IUserSession,
    IAuthResult,
    ITokenPayload,
    ConsentPermission,
    ConsentStatus,
    AccountType,
    AccountStatus,
    UserRole,
    AuthType,
    UserStatus,
  } from "./persistance.js";
  
  // Re-export enums and payloads that don’t need transformation
  export {
    ConsentPermission,
    ConsentStatus,
    AccountType,
    AccountStatus,
    UserRole,
    AuthType,
    UserStatus,
    ITokenPayload as TokenPayload,
  };
  
  // For interfaces with ObjectId/Date fields, define s by omitting those keys
  // and replacing them with string equivalents.
  
  export type Customer = Omit<
    ICustomer,
    "id" | "createdAt" | "updatedAt" | "bankId"
  > & {
    id: string;
    createdAt: string;
    updatedAt: string;
    bankId: string;
  };
  
  export type Bank = Omit<IBank, "id"> & { id: string };
  
  export type Consent = Omit<
    IConsent,
    | "consentId"
    | "customerId"
    | "accountIds"
    | "createdAt"
    | "expiresAt"
    | "bankId"
  > & {
    consentId: string;
    customerId: string;
    accountIds: string[];
    createdAt: string;
    expiresAt: string;
    bankId: string;
  };
  
  export type Transaction = Omit<
    ITransaction,
    "id" | "accountId" | "timestamp"
  > & {
    id: string;
    accountId: string;
    timestamp: string;
  };
  
  export type Account = Omit<
    IAccount,
    "id" | "customerId" | "bankId" | "createdAt" | "updatedAt"
  > & {
    id: string;
    customerId: string;
    bankId: string;
    createdAt: string;
    updatedAt: string;
  };
  
  export type Balance = Omit<IBalance, "id"> & { id: string };
  
  export type BalanceResponse = Omit<
    IBalanceResponse,
    "accountId"
  > & {
    accountId: string;
  };
  
  export type User = Omit<
    IUser,
    | "id"
    | "customerId"
    | "bankId"
    | "createdAt"
    | "updatedAt"
    | "lastLoginAt"
  > & {
    id: string;
    customerId?: string;
    bankId: string;
    createdAt: string;
    updatedAt?: string;
    lastLoginAt?: string;
  };
  
  export type UserSession = Omit<
    IUserSession,
    "id" | "userId" | "createdAt" | "expiresAt" | "lastActivityAt"
  > & {
    id: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
    lastActivityAt: string;
  };
  
  export type AuthResult = Omit<IAuthResult, "user" | "expiresAt"> & {
    user: User;
    expiresAt: string;
  };
  