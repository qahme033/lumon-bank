"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAccountController = void 0;
const common_1 = require("@banking-sim/common"); // Adjust the import path based on your setup
const common_2 = require("@banking-sim/common");
class AdminAccountController {
    // private accountAPI: AccountAPI;
    constructor() {
        // accountAPI = new AccountAPI();
    }
    /**
     * Create a new account by delegating to the core banking API via the common package.
     */
    async createAccount(req, res) {
        try {
            const { customerId, accountType, accountName, currency, initialBalance, status, } = req.body;
            // Validate required fields
            if (!customerId || !accountType || !accountName || !currency) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'Missing required fields: customerId, accountType, accountName, currency',
                });
                return;
            }
            // Validate account type
            if (!Object.values(common_2.AccountType).includes(accountType)) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: `Invalid account type. Must be one of: ${Object.values(common_2.AccountType).join(', ')}`,
                });
                return;
            }
            // Validate account status (optional)
            if (status && !Object.values(common_2.AccountStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: `Invalid account status. Must be one of: ${Object.values(common_2.AccountStatus).join(', ')}`,
                });
                return;
            }
            const account = await common_1.accountAPI.createAccount({
                customerId,
                accountType,
                accountName,
                currency,
                initialBalance: initialBalance || 0,
                status: status || common_2.AccountStatus.ACTIVE,
            });
            res.status(201).json({
                success: true,
                data: account,
            });
        }
        catch (error) {
            console.error(`Error in createAccount: ${error.message}`);
            if (error.response) {
                // Errors from core banking API
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                // No response received
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                // Other errors
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
    /**
     * Retrieve all accounts for a specific customer.
     */
    async getAccounts(req, res) {
        try {
            const customerId = req.query.customerId;
            if (!customerId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'customerId query parameter is required',
                });
                return;
            }
            const accounts = await common_1.accountAPI.getAccounts(customerId);
            res.status(200).json({
                success: true,
                data: accounts,
                count: accounts.length,
            });
        }
        catch (error) {
            console.error(`Error in getAccounts: ${error.message}`);
            if (error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
    /**
     * Retrieve a specific account by its ID.
     */
    async getAccount(req, res) {
        try {
            const accountId = req.params.accountId;
            if (!accountId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'accountId is required',
                });
                return;
            }
            const account = await common_1.accountAPI.getAccount(accountId);
            if (!account) {
                res.status(404).json({
                    success: false,
                    error: 'Not Found',
                    message: `Account with ID ${accountId} not found`,
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: account,
            });
        }
        catch (error) {
            console.error(`Error in getAccount: ${error.message}`);
            if (error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
    /**
     * Update an existing account.
     */
    async updateAccount(req, res) {
        try {
            const accountId = req.params.accountId;
            const updates = req.body;
            if (!accountId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'accountId is required',
                });
                return;
            }
            const updatedAccount = await common_1.accountAPI.updateAccount(accountId, updates);
            res.status(200).json({
                success: true,
                message: 'Account updated successfully',
                data: updatedAccount,
            });
        }
        catch (error) {
            console.error(`Error in updateAccount: ${error.message}`);
            if (error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
    /**
     * Delete an account.
     */
    async deleteAccount(req, res) {
        try {
            const accountId = req.params.accountId;
            if (!accountId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'accountId is required',
                });
                return;
            }
            await common_1.accountAPI.deleteAccount(accountId);
            res.status(200).json({
                success: true,
                message: 'Account deleted successfully',
            });
        }
        catch (error) {
            console.error(`Error in deleteAccount: ${error.message}`);
            if (error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
    /**
     * Update the balance of an account.
     */
    async updateBalance(req, res) {
        try {
            const accountId = req.params.accountId;
            const balanceData = req.body;
            if (!accountId) {
                res.status(400).json({
                    success: false,
                    error: 'Bad Request',
                    message: 'accountId is required',
                });
                return;
            }
            const updatedBalance = await common_1.accountAPI.getAccountBalance(accountId);
            if (!updatedBalance) {
                res.status(404).json({
                    success: false,
                    error: 'Not Found',
                    message: `Balance for account ID ${accountId} not found`,
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Account balance updated successfully',
                data: updatedBalance,
            });
        }
        catch (error) {
            console.error(`Error in updateBalance: ${error.message}`);
            if (error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.statusText,
                    message: error.response.data.message || 'An error occurred',
                });
            }
            else if (error.request) {
                res.status(503).json({
                    success: false,
                    error: 'Service Unavailable',
                    message: 'No response from core banking service',
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Internal Server Error',
                    message: error.message,
                });
            }
        }
    }
}
exports.AdminAccountController = AdminAccountController;
