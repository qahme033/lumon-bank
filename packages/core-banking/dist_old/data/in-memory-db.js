"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDatabase = exports.ConsentStatus = exports.ConsentPermission = void 0;
var ConsentPermission;
(function (ConsentPermission) {
    ConsentPermission["ACCOUNT_DETAILS"] = "account:details:read";
    ConsentPermission["TRANSACTIONS"] = "transactions:read";
    ConsentPermission["BALANCE"] = "balances:read";
    // Add more permissions as needed
})(ConsentPermission = exports.ConsentPermission || (exports.ConsentPermission = {}));
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus["AWAITING_AUTHORIZATION"] = "AWAITING_AUTHORIZATION";
    ConsentStatus["AUTHORIZED"] = "AUTHORIZED";
    ConsentStatus["REVOKED"] = "REVOKED";
})(ConsentStatus = exports.ConsentStatus || (exports.ConsentStatus = {}));
class InMemoryDatabase {
    constructor() {
        this.customers = new Map();
        this.accounts = new Map();
        this.balances = new Map();
        this.transactions = new Map();
        this.payments = new Map();
        this.mandates = new Map();
        this.consents = new Map();
        this.banks = new Map();
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
    }
    getDatabaseSnapshot(bankId) {
        // If bankId is provided, filter data for that bank only
        if (bankId) {
            return {
                customers: Array.from(this.customers.entries())
                    .filter(([_, customer]) => customer.bankId === bankId)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                accounts: Array.from(this.accounts.entries())
                    .filter(([_, account]) => account.bankId === bankId)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                balances: Array.from(this.balances.entries())
                    .filter(([key, _]) => {
                    const account = this.accounts.get(key);
                    return account && account.bankId === bankId;
                })
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                transactions: Array.from(this.transactions.entries())
                    .filter(([key, _]) => {
                    const account = this.accounts.get(key);
                    return account && account.bankId === bankId;
                })
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                payments: Array.from(this.payments.entries())
                    .filter(([_, payment]) => payment.bankId === bankId)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                mandates: Array.from(this.mandates.entries())
                    .filter(([_, mandate]) => mandate.bankId === bankId)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
                consents: Array.from(this.consents.entries())
                    .filter(([_, consent]) => consent.bank_id === bankId)
                    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
            };
        }
        // Otherwise, return all data
        return {
            customers: Object.fromEntries(this.customers),
            accounts: Object.fromEntries(this.accounts),
            balances: Object.fromEntries(this.balances),
            transactions: Object.fromEntries(this.transactions),
            payments: Object.fromEntries(this.payments),
            mandates: Object.fromEntries(this.mandates),
            consents: Object.fromEntries(this.consents)
        };
    }
    // Reset database for a specific bank
    reset(bankId) {
        // Filter and keep only data not belonging to the specified bank
        this.customers = new Map([...this.customers].filter(([_, customer]) => customer.bankId !== bankId));
        this.accounts = new Map([...this.accounts].filter(([_, account]) => account.bankId !== bankId));
        // Similar filtering for other collections
    }
}
exports.InMemoryDatabase = InMemoryDatabase;
