// packages/common/src/mappers.ts

import { ObjectId } from "mongodb";
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
} from "./persistance.js";
import {
  Customer,
  Bank,
  Consent,
  Transaction,
  Account,
  Balance,
  BalanceResponse,
  User,
  UserSession,
  AuthResult,
  TokenPayload,
  ConsentPermission,
  ConsentStatus,
  AccountType,
  AccountStatus,
  UserRole,
  AuthType,
  UserStatus,
} from "./dto.js";

// === Customer ===
export function to_customer_dto(c: ICustomer): Customer {
  return {
    id: c.id.toHexString(),
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    bankId: c.bankId.toHexString(),
  };
}

export function from_customer_dto(dto: Customer): ICustomer {
  return {
    id: new ObjectId(dto.id),
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    bankId: new ObjectId(dto.bankId),
  };
}

// === Bank ===
export function to_bank_dto(b: IBank): Bank {
  return {
    id: b.id.toHexString(),
    name: b.name,
  };
}

export function from_bank_dto(dto: Bank): IBank {
  return {
    id: new ObjectId(dto.id),
    name: dto.name,
  };
}

// === Consent ===
export function to_consent_dto(c: IConsent): Consent {
  return {
    consentId: c.consentId.toHexString(),
    customerId: c.customerId.toHexString(),
    accountIds: c.accountIds.map((id: ObjectId) => id.toHexString()),
    permissions: c.permissions,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    expiresAt: c.expiresAt.toISOString(),
    authorizationUrl: c.authorizationUrl,
    bankId: c.bankId.toHexString(),
    psuIpAddress: c.psuIpAddress,
    psuUserAgent: c.psuUserAgent,
    tppId: c.tppId,
  };
}

export function from_consent_dto(dto: Consent): IConsent {
  return {
    consentId: new ObjectId(dto.consentId),
    customerId: new ObjectId(dto.customerId),
    accountIds: dto.accountIds.map((id: string) => new ObjectId(id)),
    permissions: dto.permissions,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    expiresAt: new Date(dto.expiresAt),
    authorizationUrl: dto.authorizationUrl,
    bankId: new ObjectId(dto.bankId),
    psuIpAddress: dto.psuIpAddress,
    psuUserAgent: dto.psuUserAgent,
    tppId: dto.tppId,
  };
}

// === Transaction ===
export function to_transaction_dto(t: ITransaction): Transaction {
  return {
    id: t.id.toHexString(),
    accountId: t.accountId.toHexString(),
    amount: t.amount,
    description: t.description,
    type: t.type,
    status: t.status,
    timestamp: t.timestamp.toISOString(),
  };
}

export function from_transaction_dto(dto: Transaction): ITransaction {
  return {
    id: new ObjectId(dto.id),
    accountId: new ObjectId(dto.accountId),
    amount: dto.amount,
    description: dto.description,
    type: dto.type,
    status: dto.status,
    timestamp: new Date(dto.timestamp),
  };
}

// === Account ===
export function to_account_dto(a: IAccount): Account {
  return {
    id: a.id.toHexString(),
    customerId: a.customerId.toHexString(),
    bankId: a.bankId.toHexString(),
    accountType: a.accountType,
    accountName: a.accountName,
    currency: a.currency,
    status: a.status,
    departmentCode: a.departmentCode,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export function from_account_dto(dto: Account): IAccount {
  return {
    id: new ObjectId(dto.id),
    customerId: new ObjectId(dto.customerId),
    bankId: new ObjectId(dto.bankId),
    accountType: dto.accountType,
    accountName: dto.accountName,
    currency: dto.currency,
    status: dto.status,
    departmentCode: dto.departmentCode,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

// === Balance ===
export function to_balance_dto(b: IBalance): Balance {
  return {
    id: b.id.toHexString(),
    available: b.available,
    current: b.current,
    pending: b.pending,
  };
}

export function from_balance_dto(dto: Balance): IBalance {
  return {
    id: new ObjectId(dto.id),
    available: dto.available,
    current: dto.current,
    pending: dto.pending,
  };
}

// === BalanceResponse ===
export function to_balance_response_dto(b: IBalanceResponse): BalanceResponse {
  return {
    accountId: b.accountId.toHexString(),
    balances: b.balances.map(
      (x) => ({ balanceType: x.balanceType, amount: x.amount, currency: x.currency })
    ),
    timestamp: b.timestamp,
  };
}

export function from_balance_response_dto(dto: BalanceResponse): IBalanceResponse {
  return {
    accountId: new ObjectId(dto.accountId),
    balances: dto.balances.map(
      (x) => ({ balanceType: x.balanceType, amount: x.amount, currency: x.currency })
    ),
    timestamp: dto.timestamp,
  };
}

// === User ===
export function to_user_dto(u: IUser): User {
  return {
    id: u.id.toHexString(),
    username: u.username,
    role: u.role,
    customerId: u.customerId?.toHexString(),
    authType: u.authType,
    bankId: u.bankId.toHexString(),
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt?.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString(),
    status: u.status,
    email: u.email,
    permissions: u.permissions,
  };
}

export function from_user_dto(dto: User): IUser {
  return {
    id: new ObjectId(dto.id),
    username: dto.username,
    role: dto.role,
    customerId: dto.customerId ? new ObjectId(dto.customerId) : undefined,
    authType: dto.authType,
    bankId: new ObjectId(dto.bankId),
    createdAt: new Date(dto.createdAt),
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    lastLoginAt: dto.lastLoginAt ? new Date(dto.lastLoginAt) : undefined,
    status: dto.status,
    email: dto.email,
    permissions: dto.permissions,
  };
}

// === UserSession ===
export function to_user_session_dto(s: IUserSession): UserSession {
  return {
    id: s.id.toHexString(),
    userId: s.userId.toHexString(),
    token: s.token,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    createdAt: s.createdAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    lastActivityAt: s.lastActivityAt.toISOString(),
    isActive: s.isActive,
  };
}

export function from_user_session_dto(dto: UserSession): IUserSession {
  return {
    id: new ObjectId(dto.id),
    userId: new ObjectId(dto.userId),
    token: dto.token,
    ipAddress: dto.ipAddress,
    userAgent: dto.userAgent,
    createdAt: new Date(dto.createdAt),
    expiresAt: new Date(dto.expiresAt),
    lastActivityAt: new Date(dto.lastActivityAt),
    isActive: dto.isActive,
  };
}

// === AuthResult ===
export function to_auth_result_dto(r: IAuthResult): AuthResult {
  return {
    user: to_user_dto(r.user),
    token: r.token,
    expiresAt: r.expiresAt.toISOString(),
  };
}

export function from_auth_result_dto(dto: AuthResult): IAuthResult {
  return {
    user: from_user_dto(dto.user),
    token: dto.token,
    expiresAt: new Date(dto.expiresAt),
  };
}

// === TokenPayload ===
export function to_token_payload_dto(p: ITokenPayload): TokenPayload {
  return {
    sub: p.sub,
    username: p.username,
    role: p.role,
    customerId: p.customerId,
    authType: p.authType,
    bankId: p.bankId,
    scope: p.scope,
    iat: p.iat,
    exp: p.exp,
    aud: p.aud,
    iss: p.iss,
  };
}

export function from_token_payload_dto(dto: TokenPayload): ITokenPayload {
  return {
    sub: dto.sub,
    username: dto.username,
    role: dto.role,
    customerId: dto.customerId,
    authType: dto.authType,
    bankId: dto.bankId,
    scope: dto.scope,
    iat: dto.iat,
    exp: dto.exp,
    aud: dto.aud,
    iss: dto.iss,
  };
}
