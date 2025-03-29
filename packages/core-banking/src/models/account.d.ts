import { AccountType, AccountStatus, IAccount } from '@banking-sim/common';
export declare class Account implements IAccount {
    customerId: string;
    accountType: AccountType;
    accountName: string;
    currency: string;
    status: AccountStatus;
    departmentCode: string;
    id: string;
    createdAt: Date;
    bankId: string;
    constructor(customerId: string, accountType: AccountType, accountName: string, currency: string, bankId: string, status?: AccountStatus, departmentCode?: string, id?: string);
}
