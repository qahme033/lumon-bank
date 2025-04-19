// // packages/psd2-api/src/server.ts
// import express, { Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import { AccountController } from './controllers/account-controller.js';
// // import { PaymentController } from './controllers/payment-controller';
// import { ConsentController } from './controllers/consent-controller.js';
// import { TransactionController } from './controllers/transaction-controller.js';
// import { 
//   verifyToken, 
//   requireRole, 
//   requireScope, 
//   verifyConsent
// } from '@banking-sim/auth-service';
// import { ConsentPermission } from '@banking-sim/common';

// export class PSD2Server {
//   private app: express.Application;
//   private bankId: string;
//   private port: number;
  
//   // Controllers
//   private accountController: AccountController;
//   private consentController: ConsentController;

//   constructor(bankId: string, port: number) {
//     this.bankId = bankId;
//     this.port = port;
//     this.app = express();
    
//     // Initialize controllers
//     this.accountController = new AccountController(bankId);
//     this.consentController = new ConsentController(bankId);
    
//     this.configureMiddleware();
//     this.configureRoutes();
//   }

//   private configureMiddleware(): void {
//     // Security middleware
//     this.app.use(helmet());
//     this.app.use(cors());
    
//     // Body parsing middleware
//     this.app.use(express.json());
//     this.app.use(express.urlencoded({ extended: true }));
    
//     // Add bank ID to request context
//     this.app.use((req: Request, res: Response, next: NextFunction) => {
//       (req as any).bankId = this.bankId;
//       next();
//     });
    
//     // Logging middleware
//     this.app.use((req: Request, res: Response, next: NextFunction) => {
//       console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//       next();
//     });
//   }

//   private configureRoutes(): void {
//     // Consent endpoints
//     this.app.post('/api/v1/consent', verifyToken, this.consentController.createConsent.bind(this.consentController));
//     this.app.get('/api/v1/consent/:consent_id', verifyToken, this.consentController.getConsent.bind(this.consentController));
//     this.app.put('/api/v1/consent/:consent_id', verifyToken, this.consentController.updateConsent.bind(this.consentController));
//     this.app.delete('/api/v1/consent/:consent_id',verifyToken,  this.consentController.revokeConsent.bind(this.consentController));
    
    
//     // Account endpoints - require both authentication and valid customer consent
//     this.app.get(
//       '/api/v1/accounts', 
//       verifyToken,         // authenticate the calling TPP
//       verifyConsent([ConsentPermission.ACCOUNT_DETAILS]),
//       this.accountController.getAccounts.bind(this.accountController)
//     );
//     this.app.get(
//       '/api/v1/accounts/:account_id', 
//       verifyToken,
//       verifyConsent([ConsentPermission.ACCOUNT_DETAILS]),
//       this.accountController.getAccount.bind(this.accountController)
//     );
//     this.app.get(
//       '/api/v1/accounts/:account_id/balance', 
//       verifyToken,
//       verifyConsent([ConsentPermission.ACCOUNT_DETAILS]),
//       this.accountController.getAccountBalance.bind(this.accountController)
//     );
    
//     // Health check endpoint
//     this.app.get('/health', (req: Request, res: Response) => {
//       res.status(200).json({
//         status: 'UP',
//         bankId: this.bankId,
//         timestamp: new Date().toISOString()
//       });
//     });
    
//     // Error handling middleware
//     this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//       console.error(`[ERROR] ${err.message}`);
//       res.status(500).json({
//         error: 'Internal Server Error',
//         message: err.message
//       });
//     });
    
//     // 404 handler
//     this.app.use((req: Request, res: Response) => {
//       res.status(404).json({
//         error: 'Not Found',
//         message: `Route ${req.method} ${req.url} not found`
//       });
//     });
//   }

//   public start(): void {
//     this.app.listen(this.port, () => {
//       console.log(`PSD2 API for Bank ${this.bankId} running on port ${this.port}`);
//       console.log(`Health check available at http://localhost:${this.port}/health`);
//     });
//   }
// }
