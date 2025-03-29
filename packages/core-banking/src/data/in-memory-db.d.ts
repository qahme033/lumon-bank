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
export declare class InMemoryDatabase {
    private static instance;
    customers: Map<string, ICustomer>;
    accounts: Map<string, IAccount>;
    balances: Map<string, IBalance>;
    transactions: Map<string, ITransaction[]>;
    payments: Map<string, any>;
    mandates: Map<string, any>;
    consents: Map<string, any>;
    private constructor();
    static getInstance(): InMemoryDatabase;
    reset(bankId: string): void;
}
