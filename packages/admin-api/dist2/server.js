"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServer = void 0;
// packages/admin-api/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_account_controller_1 = require("./controllers/admin-account-controller");
const admin_database_controller_1 = require("./controllers/admin-database-controller");
const auth_service_1 = require("@banking-sim/auth-service");
class AdminServer {
    constructor(bankId, port) {
        this.bankId = bankId;
        this.port = port;
        this.app = (0, express_1.default)();
        // Initialize controllers
        this.accountController = new admin_account_controller_1.AdminAccountController();
        // this.customerController = new AdminCustomerController(bankId);
        // this.transactionController = new AdminTransactionController(bankId);
        // this.systemController = new AdminSystemController(bankId);
        this.databaseController = new admin_database_controller_1.AdminDatabaseController(bankId);
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        // CORS middleware
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
            console.log(`[ADMIN] [${new Date().toISOString()}] ${req.method} ${req.url}`);
            next();
        });
        // Public health check endpoint (no authentication required)
        this.app.get('/admin/health', (req, res) => {
            res.status(200).json({
                status: 'UP',
                bankId: this.bankId,
                timestamp: new Date().toISOString()
            });
        });
        // Apply authentication to all API routes
        this.app.use('/admin/api', auth_service_1.verifyToken);
        // Apply admin role check to all API routes
        this.app.use('/admin/api', (0, auth_service_1.requireRole)('admin'));
    }
    configureRoutes() {
        // Customer management
        // this.app.post('/admin/api/customers', this.customerController.createCustomer.bind(this.customerController));
        // this.app.get('/admin/api/customers', this.customerController.getCustomers.bind(this.customerController));
        // this.app.get('/admin/api/customers/:customerId', this.customerController.getCustomer.bind(this.customerController));
        // this.app.put('/admin/api/customers/:customerId', this.customerController.updateCustomer.bind(this.customerController));
        // this.app.delete('/admin/api/customers/:customerId', this.customerController.deleteCustomer.bind(this.customerController));
        // Account management
        // Public health check endpoint (no authentication required)
        this.app.get('/admin/health', (req, res) => {
            res.status(200).json({
                status: 'UP',
                bankId: this.bankId,
                timestamp: new Date().toISOString()
            });
        });
        // Account management (protected routes)
        this.app.post('/admin/api/accounts', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:write'), this.accountController.createAccount.bind(this.accountController));
        this.app.get('/admin/api/accounts', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:read'), this.accountController.getAccounts.bind(this.accountController));
        this.app.get('/admin/api/accounts/:accountId', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:read'), this.accountController.getAccount.bind(this.accountController));
        this.app.put('/admin/api/accounts/:accountId', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:write'), this.accountController.updateAccount.bind(this.accountController));
        this.app.delete('/admin/api/accounts/:accountId', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:write'), this.accountController.deleteAccount.bind(this.accountController));
        this.app.post('/admin/api/accounts/:accountId/balance', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:write'), this.accountController.updateBalance.bind(this.accountController));
        // Database inspection (protected routes)
        this.app.get('/admin/api/database', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:read'), this.databaseController.getDatabaseSnapshot.bind(this.databaseController));
        this.app.get('/admin/api/database/stats', auth_service_1.verifyToken, (0, auth_service_1.requireRole)('admin'), (0, auth_service_1.requireScope)('admin:read'), this.databaseController.getDatabaseStats.bind(this.databaseController));
        // Transaction management
        // this.app.post('/admin/api/transactions', this.transactionController.createTransaction.bind(this.transactionController));
        // this.app.get('/admin/api/transactions', this.transactionController.getTransactions.bind(this.transactionController));
        // System management
        // this.app.post('/admin/api/system/reset', this.systemController.resetSystem.bind(this.systemController));
        // this.app.post('/admin/api/system/seed', this.systemController.seedData.bind(this.systemController));
        // this.app.get('/admin/api/system/status', this.systemController.getStatus.bind(this.systemController));
        this.app.get('/admin/api/database', this.databaseController.getDatabaseSnapshot.bind(this.databaseController));
        this.app.get('/admin/api/database/stats', this.databaseController.getDatabaseStats.bind(this.databaseController));
        // Health check endpoint
        this.app.get('/admin/health', (req, res) => {
            res.status(200).json({
                status: 'UP',
                bankId: this.bankId,
                timestamp: new Date().toISOString()
            });
        });
        // Error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(`[ADMIN ERROR] ${err.message}`);
            // Handle authentication errors
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Invalid token'
                });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Token expired'
                });
            }
            // Handle other errors
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: err.message
            });
        });
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Not Found',
                message: `Route ${req.method} ${req.url} not found`
            });
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Admin API for Bank ${this.bankId} running on port ${this.port}`);
            console.log(`Health check available at http://localhost:${this.port}/admin/health`);
        });
    }
}
exports.AdminServer = AdminServer;
