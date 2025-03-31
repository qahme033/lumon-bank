"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const core_banking_1 = require("@banking-sim/core-banking"); // Adjust the import path as needed
class TransactionController {
    constructor(bankId) {
        this.transactionService = new core_banking_1.TransactionService(bankId);
    }
    // Create a new transaction
    async createTransaction(req, res, next) {
        try {
            const { account_id } = req.params;
            const { amount, description, type, status } = req.body;
            const transaction = await this.transactionService.createTransaction(account_id, amount, description, type, status);
            res.status(201).json(transaction);
        }
        catch (error) {
            next(error);
        }
    }
    // Get a specific transaction
    async getTransaction(req, res, next) {
        try {
            const { transaction_id } = req.params;
            const transaction = await this.transactionService.getTransaction(transaction_id);
            res.status(200).json(transaction);
        }
        catch (error) {
            next(error);
        }
    }
    // Get all transactions for an account
    async getTransactionsForAccount(req, res, next) {
        try {
            const { account_id } = req.params;
            const transactions = await this.transactionService.getTransactionsForAccount(account_id);
            res.status(200).json(transactions);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
