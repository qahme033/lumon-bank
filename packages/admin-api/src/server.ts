// packages/admin-api/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AdminAccountController } from './controllers/admin-account-controller';
import { AdminCustomerController } from './controllers/admin-customer-controller';
import { AdminTransactionController } from './controllers/admin-transaction-controller';
import { AdminSystemController } from './controllers/admin-system-controller';
import { AdminDatabaseController } from './controllers/admin-database-controller';
import { 
  verifyToken, 
  requireRole, 
  requireScope 
} from '@banking-sim/auth-service';

export class AdminServer {
  private app: express.Application;
  private bankId: string;
  private port: number;
  
  // Controllers
  private accountController: AdminAccountController;
//   private customerController: AdminCustomerController;
//   private transactionController: AdminTransactionController;
//   private systemController: AdminSystemController;
    private databaseController: AdminDatabaseController
  constructor(bankId: string, port: number) {
    this.bankId = bankId;
    this.port = port;
    this.app = express();
    
    // Initialize controllers
    this.accountController = new AdminAccountController(bankId);
    // this.customerController = new AdminCustomerController(bankId);
    // this.transactionController = new AdminTransactionController(bankId);
    // this.systemController = new AdminSystemController(bankId);
    this.databaseController = new AdminDatabaseController(bankId);

    
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    // CORS middleware
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
      console.log(`[ADMIN] [${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
    
    // Public health check endpoint (no authentication required)
    this.app.get('/admin/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        bankId: this.bankId,
        timestamp: new Date().toISOString()
      });
    });
    
    // Apply authentication to all API routes
    this.app.use('/admin/api', verifyToken);
    
    // Apply admin role check to all API routes
    this.app.use('/admin/api', requireRole('admin'));
  }
  


  private configureRoutes(): void {
    // Customer management
    // this.app.post('/admin/api/customers', this.customerController.createCustomer.bind(this.customerController));
    // this.app.get('/admin/api/customers', this.customerController.getCustomers.bind(this.customerController));
    // this.app.get('/admin/api/customers/:customerId', this.customerController.getCustomer.bind(this.customerController));
    // this.app.put('/admin/api/customers/:customerId', this.customerController.updateCustomer.bind(this.customerController));
    // this.app.delete('/admin/api/customers/:customerId', this.customerController.deleteCustomer.bind(this.customerController));
    
    // Account management
  // Public health check endpoint (no authentication required)
  this.app.get('/admin/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      bankId: this.bankId,
      timestamp: new Date().toISOString()
    });
  });
  
  // Account management (protected routes)
  this.app.post(
    '/admin/api/accounts', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:write'),
    this.accountController.createAccount.bind(this.accountController)
  );
  
  this.app.get(
    '/admin/api/accounts', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:read'),
    this.accountController.getAccounts.bind(this.accountController)
  );
  
  this.app.get(
    '/admin/api/accounts/:accountId', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:read'),
    this.accountController.getAccount.bind(this.accountController)
  );
  
  this.app.put(
    '/admin/api/accounts/:accountId', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:write'),
    this.accountController.updateAccount.bind(this.accountController)
  );
  
  this.app.delete(
    '/admin/api/accounts/:accountId', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:write'),
    this.accountController.deleteAccount.bind(this.accountController)
  );
  
  this.app.post(
    '/admin/api/accounts/:accountId/balance', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:write'),
    this.accountController.updateBalance.bind(this.accountController)
  );
  
  // Database inspection (protected routes)
  this.app.get(
    '/admin/api/database', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:read'),
    this.databaseController.getDatabaseSnapshot.bind(this.databaseController)
  );
  
  this.app.get(
    '/admin/api/database/stats', 
    verifyToken,
    requireRole('admin'),
    requireScope('admin:read'),
    this.databaseController.getDatabaseStats.bind(this.databaseController)
  );
  

    
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
    this.app.get('/admin/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        bankId: this.bankId,
        timestamp: new Date().toISOString()
      });
    });
    
// Error handling middleware
this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Admin API for Bank ${this.bankId} running on port ${this.port}`);
      console.log(`Health check available at http://localhost:${this.port}/admin/health`);
    });
  }
}
