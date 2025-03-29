import { IAccount } from '@banking-sim/common';
export declare class AccountService {
    private db;
    private bankId;
    constructor(bankId: string);
    getAccounts(customerId: string): Promise<IAccount[]>;
    getAccount(accountId: string): Promise<IAccount | null>;
    getAccountBalance(accountId: string): Promise<any | null>;
}
