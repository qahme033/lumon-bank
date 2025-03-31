import { IAccount } from '@banking-sim/common';
export interface ICustomer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bankId: string;
}
export interface IBalance {
    available: number;
    current: number;
    pending: number;
}
export interface ITransaction {
    id: string;
    accountId: string;
    amount: number;
    description: string;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
    timestamp: Date;
}
export declare enum ConsentPermission {
    ACCOUNT_DETAILS = "account:details:read",
    TRANSACTIONS = "transactions:read",
    BALANCE = "balances:read"
}
export declare enum ConsentStatus {
    AWAITING_AUTHORIZATION = "AWAITING_AUTHORIZATION",
    AUTHORIZED = "AUTHORIZED",
    REVOKED = "REVOKED"
}
export interface IBank {
    id: string;
    name: string;
}
export interface IConsent {
    consent_id: string;
    customer_id: string;
    account_ids: string[];
    permissions: ConsentPermission[];
    status: ConsentStatus;
    created_at: Date;
    expires_at: Date;
    authorization_url: string;
    bank_id: string;
    psu_ip_address: string;
    psu_user_agent: string;
    tpp_id: string;
}
export declare class InMemoryDatabase {
    private static instance;
    customers: Map<string, ICustomer>;
    accounts: Map<string, IAccount>;
    balances: Map<string, IBalance>;
    transactions: Map<string, ITransaction[]>;
    payments: Map<string, any>;
    mandates: Map<string, any>;
    consents: Map<string, any>;
    banks: Map<string, IBank>;
    private constructor();
    static getInstance(): InMemoryDatabase;
    getDatabaseSnapshot(bankId?: string): any;
    reset(bankId: string): void;
}
