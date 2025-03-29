// packages/psd2-api/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AccountController } from './controllers/account-controller';
// import { PaymentController } from './controllers/payment-controller';
// import { ConsentController } from './controllers/consent-controller';
// import { TransactionController } from './controllers/transaction-controller';

export class PSD2Server {
  private app: express.Application;
  private bankId: string;
  private port: number;
  
  // Controllers
  private accountController: AccountController;
//   private paymentController: PaymentController;
//   private consentController: ConsentController;
//   private transactionController: TransactionController;

  constructor(bankId: string, port: number) {
    this.bankId = bankId;
    this.port = port;
    this.app = express();
    
    // Initialize controllers
    this.accountController = new AccountController(bankId);
    // this.paymentController = new PaymentController(bankId);
    // this.consentController = new ConsentController(bankId);
    // this.transactionController = new TransactionController(bankId);
    
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
    // Consent endpoints
    // this.app.post('/api/v1/consent', this.consentController.createConsent.bind(this.consentController));
    // this.app.get('/api/v1/consent/:consent_id', this.consentController.getConsent.bind(this.consentController));
    // this.app.delete('/api/v1/consent/:consent_id', this.consentController.revokeConsent.bind(this.consentController));
    
    // Payment endpoints
    // this.app.post('/api/v1/payments/domestic', this.paymentController.createDomesticPayment.bind(this.paymentController));
    // this.app.post('/api/v1/payments/international', this.paymentController.createInternationalPayment.bind(this.paymentController));
    // this.app.post('/api/v1/payments/recurring', this.paymentController.createRecurringPayment.bind(this.paymentController));
    // this.app.get('/api/v1/payments/:payment_id/status', this.paymentController.getPaymentStatus.bind(this.paymentController));
    
    // Account endpoints
    this.app.get('/api/v1/accounts', this.accountController.getAccounts.bind(this.accountController));
    this.app.get('/api/v1/accounts/:account_id', this.accountController.getAccount.bind(this.accountController));
    this.app.get('/api/v1/accounts/:account_id/balance', this.accountController.getAccountBalance.bind(this.accountController));
    
    // Transaction endpoints
    // this.app.get('/api/v1/accounts/:account_id/transactions', this.transactionController.getAccountTransactions.bind(this.transactionController));
    
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'UP',
        bankId: this.bankId,
        timestamp: new Date().toISOString()
      });
    });
    
    // Error handling middleware
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(`[ERROR] ${err.message}`);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
      });
    });
    
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`PSD2 API for Bank ${this.bankId} running on port ${this.port}`);
      console.log(`Health check available at http://localhost:${this.port}/health`);
    });
  }
}
