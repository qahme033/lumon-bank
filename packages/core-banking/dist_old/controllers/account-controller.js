"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const core_banking_1 = require("@banking-sim/core-banking"); // Adjust the import path as needed
class AccountController {
    constructor(bankId) {
        this.accountService = new core_banking_1.AccountService(bankId);
    }
    // Create a new account
    async createAccount(req, res, next) {
        try {
            const { customerId, accountType, accountName, currency, initialBalance, status } = req.body;
            const account = await this.accountService.createAccount(customerId, accountType, accountName, currency, initialBalance, status);
            res.status(201).json(account);
        }
        catch (error) {
            next(error);
        }
    }
    // Get all accounts for a customer
    async getAccounts(req, res, next) {
        try {
            const { customer_id } = req.query;
            if (!customer_id || typeof customer_id !== 'string') {
                res.status(400).json({ error: 'customer_id query parameter is required and must be a string' });
                return;
            }
            const accounts = await this.accountService.getAccounts(customer_id);
            res.status(200).json(accounts);
        }
        catch (error) {
            next(error);
        }
    }
    // Get a specific account
    async getAccount(req, res, next) {
        try {
            const { account_id } = req.params;
            const account = await this.accountService.getAccount(account_id);
            if (account) {
                res.status(200).json(account);
            }
            else {
                res.status(404).json({ error: 'Account not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
    // Get account balance
    async getAccountBalance(req, res, next) {
        try {
            const { account_id } = req.params;
            const balance = await this.accountService.getAccountBalance(account_id);
            if (balance) {
                res.status(200).json(balance);
            }
            else {
                res.status(404).json({ error: 'Balance not found' });
            }
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AccountController = AccountController;
