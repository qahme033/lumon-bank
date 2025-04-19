// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { CustomerController } from './controllers/customer-controller.js';
import { AccountController } from './controllers/account-controller.js';
import { ConsentController } from './controllers/consent-controller.js';
import { TransactionController } from './controllers/transaction-controller.js';
import { DatabaseController } from './controllers/database-controller.js';
import { UserController } from './controllers/user-controller.js';

export class CoreBankingServer {
  private app: express.Application;
  private bankId: string;
  private port: number;

  // Controllers
  private customerController: CustomerController;
  private accountController: AccountController;
  private consentController: ConsentController;
  private transactionController: TransactionController;
  private databaseController: DatabaseController;
  private userController: UserController;


  constructor(bankId: string, port: number) {
    this.bankId = bankId;
    this.port = port;
    this.app = express();

    // Initialize controllers
    this.customerController = new CustomerController(bankId);
    this.accountController = new AccountController(bankId);
    this.consentController = new ConsentController(bankId);
    this.transactionController = new TransactionController(bankId);
    this.databaseController = new DatabaseController(bankId);
    this.userController = new UserController(bankId);

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Add bank ID to request context
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      (req as any).bankId = this.bankId;
      next();
    });

    // Logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  private configureRoutes(): void {
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
    this.app.put('/api/v1/consent/:consent_id', this.consentController.updateConsent.bind(this.consentController));
    this.app.put('/api/v1/consent/:consent_id/revoke', this.consentController.revokeConsent.bind(this.consentController));

    // Transaction endpoints
    this.app.post('/api/v1/accounts/:account_id/transactions', this.transactionController.createTransaction.bind(this.transactionController));
    this.app.get('/api/v1/transactions/:transaction_id', this.transactionController.getTransaction.bind(this.transactionController));
    this.app.get('/api/v1/accounts/:account_id/transactions', this.transactionController.getTransactionsForAccount.bind(this.transactionController));

    // user routes
    this.app.post('/api/v1/users', this.userController.createUser.bind(this.userController));
    this.app.post('/api/v1/users/authenticate', this.userController.authenticateUser.bind(this.userController));
    this.app.get('/api/v1/users/:user_id', this.userController.getUser.bind(this.userController));
    this.app.get('/api/v1/users', this.userController.getAllUsers.bind(this.userController));

    // Database endpoints
    this.app.get('/api/v1/database/snapshot', this.databaseController.getDatabaseSnapshot.bind(this.databaseController));
    // this.app.get('/api/v1/database/stats', this.databaseController.getStats.bind(this.databaseController));

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        bankId: this.bankId,
        timestamp: new Date().toISOString(),
      });
    });

    // Error handling middleware
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(`[ERROR] ${err.message}`);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
      });
    });

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Core Banking API for Bank ${this.bankId} running on port ${this.port}`);
      console.log(`Health check available at http://localhost:${this.port}/health`);
    });
  }
}
