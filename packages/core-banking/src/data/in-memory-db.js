"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDatabase = void 0;
class InMemoryDatabase {
    constructor() {
        this.customers = new Map();
        this.accounts = new Map();
        this.balances = new Map();
        this.transactions = new Map();
        this.payments = new Map();
        this.mandates = new Map();
        this.consents = new Map();
    }
    static getInstance() {
        if (!InMemoryDatabase.instance) {
            InMemoryDatabase.instance = new InMemoryDatabase();
        }
        return InMemoryDatabase.instance;
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
