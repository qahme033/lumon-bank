"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreBankingServer = void 0;
// src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const customer_controller_1 = require("./controllers/customer-controller");
const account_controller_1 = require("./controllers/account-controller");
const consent_controller_1 = require("./controllers/consent-controller");
const transaction_controller_1 = require("./controllers/transaction-controller");
const database_controller_1 = require("./controllers/database-controller");
class CoreBankingServer {
    constructor(bankId, port) {
        this.bankId = bankId;
        this.port = port;
        this.app = (0, express_1.default)();
        // Initialize controllers
        this.customerController = new customer_controller_1.CustomerController(bankId);
        this.accountController = new account_controller_1.AccountController(bankId);
        this.consentController = new consent_controller_1.ConsentController(bankId);
        this.transactionController = new transaction_controller_1.TransactionController(bankId);
        this.databaseController = new database_controller_1.DatabaseController(bankId);
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        // Body parsing middleware
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Add bank ID to request context
        this.app.use((req, res, next) => {
            req.bankId = this.bankId;
            next();
        });
        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });
    }
    configureRoutes() {
        // Customer endpoints
        this.app.post('/api/v1/customers', this.customerController.createCustomer.bind(this.customerController));
        this.app.get('/api/v1/customers', this.customerController.getCustomers.bind(this.customerController));
        this.app.get('/api/v1/customers/:customer_id', this.customerController.getCustomer.bind(this.customerController));
        this.app.put('/api/v1/customers/:customer_id', this.customerController.updateCustomer.bind(this.customerController));
        this.app.delete('/api/v1/customers/:customer_id', this.customerController.deleteCustomer.bind(this.customerController));
        this.app.get('/api/v1/customers/:customer_id/accounts', this.customerController.getCustomerAccounts.bind(this.customerController));
        // Account endpoints
        this.app.post('/api/v1/accounts', this.accountController.createAccount.bind(this.accountController));
        this.app.get('/api/v1/accounts', this.accountController.getAccounts.bind(this.accountController));
        this.app.get('/api/v1/accounts/:account_id', this.accountController.getAccount.bind(this.accountController));
        this.app.get('/api/v1/accounts/:account_id/balance', this.accountController.getAccountBalance.bind(this.accountController));
        // Consent endpoints
        this.app.post('/api/v1/consent', this.consentController.createConsent.bind(this.consentController));
        this.app.get('/api/v1/consent/:consent_id', this.consentController.getConsent.bind(this.consentController));
        this.app.delete('/api/v1/consent/:consent_id', this.consentController.revokeConsent.bind(this.consentController));
        // Transaction endpoints
        this.app.post('/api/v1/accounts/:account_id/transactions', this.transactionController.createTransaction.bind(this.transactionController));
        this.app.get('/api/v1/transactions/:transaction_id', this.transactionController.getTransaction.bind(this.transactionController));
        this.app.get('/api/v1/accounts/:account_id/transactions', this.transactionController.getTransactionsForAccount.bind(this.transactionController));
        // Database endpoints
        this.app.get('/api/v1/database/snapshot', this.databaseController.getDatabaseSnapshot.bind(this.databaseController));
        this.app.get('/api/v1/database/stats', this.databaseController.getStats.bind(this.databaseController));
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'UP',
                bankId: this.bankId,
                timestamp: new Date().toISOString(),
            });
        });
        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(`[ERROR] ${err.message}`);
            res.status(500).json({
                error: 'Internal Server Error',
                message: err.message,
            });
        });
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found',
                message: `Route ${req.method} ${req.url} not found`,
            });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Core Banking API for Bank ${this.bankId} running on port ${this.port}`);
            console.log(`Health check available at http://localhost:${this.port}/health`);
        });
    }
}
exports.CoreBankingServer = CoreBankingServer;
