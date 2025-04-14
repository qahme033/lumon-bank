import { NextFunction, Request, Response } from 'express';
import { CustomerController } from './controllers/customer-controller.js';
import { AccountController } from './controllers/account-controller.js';
import { ConsentController } from './controllers/consent-controller.js';
import { TransactionController } from './controllers/transaction-controller.js';
import { DatabaseController } from './controllers/database-controller.js';

// Create a handler factory for serverless functions
export function createCoreBankingHandler(bankId: string) {
  // Create controllers (reuse your existing controllers)
  const customerController = new CustomerController(bankId);
  const accountController = new AccountController(bankId);
  const consentController = new ConsentController(bankId);
  const transactionController = new TransactionController(bankId);
  const databaseController = new DatabaseController(bankId);

    // Create a dummy next function for Express compatibility
    const dummyNext: NextFunction = (err?: any) => {
        if (err) {
          console.error('[NextFunction Error]', err);
          throw err; // This will be caught by our try/catch
        }
      };
  
  // Return the handler function
  return async function handler(req: Request, res: Response) {
    // Add bankId to request
    (req as any).bankId = bankId;
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Parse the path
    const path = req.url || '';
    
    try {
      // Route to appropriate controller based on the path
      if (path.startsWith('/api/v1/customers')) {
        if (path.match(/\/api\/v1\/customers\/[^\/]+\/accounts$/)) {
          // GET /api/v1/customers/:customer_id/accounts
          const customerId = path.split('/')[4];
          req.params = { ...req.params, customer_id: customerId };
          return await customerController.getCustomerAccounts(req, res, dummyNext);
        } else if (path.match(/\/api\/v1\/customers\/[^\/]+$/)) {
          // GET, PUT, DELETE /api/v1/customers/:customer_id
          const customerId = path.split('/')[4];
          req.params = { ...req.params, customer_id: customerId };
          
          if (req.method === 'GET') {
            return await customerController.getCustomer(req, res, dummyNext);
          } else if (req.method === 'PUT') {
            return await customerController.updateCustomer(req, res, dummyNext);
          } else if (req.method === 'DELETE') {
            return await customerController.deleteCustomer(req, res, dummyNext);
          }
        } else {
          // POST or GET /api/v1/customers
          if (req.method === 'POST') {
            return await customerController.createCustomer(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await customerController.getCustomers(req, res, dummyNext);
          }
        }
      } else if (path.startsWith('/api/v1/accounts')) {
        if (path.match(/\/api\/v1\/accounts\/[^\/]+\/transactions$/)) {
          // GET or POST /api/v1/accounts/:account_id/transactions
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          
          if (req.method === 'POST') {
            return await transactionController.createTransaction(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await transactionController.getTransactionsForAccount(req, res, dummyNext);
          }
        } else if (path.match(/\/api\/v1\/accounts\/[^\/]+\/balance$/)) {
          // GET /api/v1/accounts/:account_id/balance
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          return await accountController.getAccountBalance(req, res, dummyNext);
        } else if (path.match(/\/api\/v1\/accounts\/[^\/]+$/)) {
          // GET /api/v1/accounts/:account_id
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          return await accountController.getAccount(req, res, dummyNext);
        } else {
          // POST or GET /api/v1/accounts
          if (req.method === 'POST') {
            return await accountController.createAccount(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await accountController.getAccounts(req, res, dummyNext);
          }
        }
      } else if (path.startsWith('/api/v1/consent')) {
        if (path.match(/\/api\/v1\/consent\/[^\/]+\/revoke$/)) {
          // PUT /api/v1/consent/:consent_id/revoke
          const consentId = path.split('/')[4];
          req.params = { ...req.params, consent_id: consentId };
          return await consentController.revokeConsent(req, res, dummyNext);
        } else if (path.match(/\/api\/v1\/consent\/[^\/]+$/)) {
          // GET or PUT /api/v1/consent/:consent_id
          const consentId = path.split('/')[4];
          req.params = { ...req.params, consent_id: consentId };
          
          if (req.method === 'GET') {
            return await consentController.getConsent(req, res, dummyNext);
          } else if (req.method === 'PUT') {
            return await consentController.updateConsent(req, res, dummyNext);
          }
        } else {
          // POST /api/v1/consent
          if (req.method === 'POST') {
            return await consentController.createConsent(req, res, dummyNext);
          }
        }
      } else if (path.startsWith('/api/v1/transactions')) {
        // GET /api/v1/transactions/:transaction_id
        if (path.match(/\/api\/v1\/transactions\/[^\/]+$/)) {
          const transactionId = path.split('/')[4];
          req.params = { ...req.params, transaction_id: transactionId };
          return await transactionController.getTransaction(req, res, dummyNext);
        }
      } else if (path.startsWith('/api/v1/database')) {
        // Database endpoints
        if (path.endsWith('/snapshot')) {
          return await databaseController.getDatabaseSnapshot(req, res, dummyNext);
        } 
        // else if (path.endsWith('/stats')) {
        //   return await databaseController.getStats(req, res, dummyNext);
        // }
      } else if (path.startsWith('/health')) {
        // Health check
        return res.status(200).json({
          status: 'UP',
          bankId: bankId,
          timestamp: new Date().toISOString(),
          serverless: true
        });
      }
      
      // If no route matches, send 404
      return res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${path} not found`,
      });
    } catch (err: any) {
      // Error handling
      console.error(`[ERROR] ${err.message}`);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
      });
    }
  };
}
