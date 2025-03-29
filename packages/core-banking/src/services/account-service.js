"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
// packages/core-banking/src/services/account-service.ts
const in_memory_db_1 = require("../data/in-memory-db");
class AccountService {
    constructor(bankId) {
        this.db = in_memory_db_1.InMemoryDatabase.getInstance();
        this.bankId = bankId;
    }
    async getAccounts(customerId) {
        const accounts = [];
        for (const [_, account] of this.db.accounts) {
            if (account.customerId === customerId && account.bankId === this.bankId) {
                accounts.push(account);
            }
        }
        return accounts;
    }
    async getAccount(accountId) {
        const account = this.db.accounts.get(accountId);
        if (account && account.bankId === this.bankId) {
            return account;
        }
        return null;
    }
    async getAccountBalance(accountId) {
        const account = await this.getAccount(accountId);
        if (!account)
            return null;
        const balance = this.db.balances.get(accountId);
        if (!balance)
            return null;
        return {
            account_id: accountId,
            balances: [
                {
                    balance_type: 'AVAILABLE',
                    amount: balance.available,
                    currency: account.currency
                },
                {
                    balance_type: 'CURRENT',
                    amount: balance.current,
                    currency: account.currency
                },
                {
                    balance_type: 'PENDING',
                    amount: balance.pending,
                    currency: account.currency
                }
            ],
            timestamp: new Date().toISOString()
        };
    }
}
exports.AccountService = AccountService;
