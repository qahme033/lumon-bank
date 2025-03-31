import { AccountType, AccountStatus, IAccount } from '@banking-sim/common';
export declare class AccountService {
    private db;
    private bankId;
    constructor(bankId: string);
    createAccount(customerId: string, accountType: AccountType, accountName: string, currency: string, initialBalance?: number, status?: AccountStatus): Promise<IAccount>;
    getAccounts(customerId: string): Promise<IAccount[]>;
    getAccount(accountId: string): Promise<IAccount | null>;
    getAccountBalance(accountId: string): Promise<any | null>;
}
