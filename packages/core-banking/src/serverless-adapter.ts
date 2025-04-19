import { NextFunction, Request, Response } from 'express';
import { CustomerController } from './controllers/customer-controller.js';
import { AccountController } from './controllers/account-controller.js';
import { ConsentController } from './controllers/consent-controller.js';
import { TransactionController } from './controllers/transaction-controller.js';
import { DatabaseController } from './controllers/database-controller.js';
import { UserController } from './controllers/user-controller.js'; // Import UserController

// Create a handler factory for serverless functions
export function createCoreBankingHandler(bankId: string) {
  // Create controllers (reuse your existing controllers)
  const customerController = new CustomerController(bankId);
  const accountController = new AccountController(bankId);
  const consentController = new ConsentController(bankId);
  const transactionController = new TransactionController(bankId);
  const databaseController = new DatabaseController(bankId);
  const userController = new UserController(bankId); // Initialize UserController

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
      
      // User routes
      if (path.startsWith('/core-banking/users')) {
        // Authentication route
        if (path.endsWith('authenticate')) {
          if (req.method === 'POST') {
            return await userController.authenticateUser(req, res, dummyNext);
          }
        } 
        // Token verification route
        else if (path.endsWith('/verify-token')) {
          if (req.method === 'POST') {
            return await userController.verifyToken(req, res, dummyNext);
          }
        }
        // Single user operations
        else if (path.match(/\/core-banking\/users\/[^\/]+$/)) {
          const userId = path.split('path=')[1];
          req.params = { ...req.params, user_id: userId };
          
          if (req.method === 'GET') {
            return await userController.getUser(req, res, dummyNext);
          } else if (req.method === 'PUT') {
            return await userController.updateUser(req, res, dummyNext);
          } else if (req.method === 'DELETE') {
            return await userController.deleteUser(req, res, dummyNext);
          }
        } 
        // List or create users
        else {
          if (req.method === 'POST') {
            return await userController.createUser(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await userController.getAllUsers(req, res, dummyNext);
          }
        }
      }
      
      // Customer routes
      else if (path.startsWith('/core-banking/customers')) {
        if (path.match(/\/core-banking\/customers\/[^\/]+\/accounts$/)) {
          // GET /core-banking/customers/:customer_id/accounts
          const customerId = path.split('/')[4];
          req.params = { ...req.params, customer_id: customerId };
          return await customerController.getCustomerAccounts(req, res, dummyNext);
        } else if (path.match(/\/core-banking\/customers\/[^\/]+$/)) {
          // GET, PUT, DELETE /core-banking/customers/:customer_id
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
          // POST or GET /core-banking/customers
          if (req.method === 'POST') {
            return await customerController.createCustomer(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await customerController.getCustomers(req, res, dummyNext);
          }
        }
      } 
      
      // Account routes
      else if (path.startsWith('/core-banking/accounts')) {
        if (path.match(/\/core-banking\/accounts\/[^\/]+\/transactions$/)) {
          // GET or POST /core-banking/accounts/:account_id/transactions
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          
          if (req.method === 'POST') {
            return await transactionController.createTransaction(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await transactionController.getTransactionsForAccount(req, res, dummyNext);
          }
        } else if (path.match(/\/core-banking\/accounts\/[^\/]+\/balance$/)) {
          // GET /core-banking/accounts/:account_id/balance
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          return await accountController.getAccountBalance(req, res, dummyNext);
        } else if (path.match(/\/core-banking\/accounts\/[^\/]+$/)) {
          // GET /core-banking/accounts/:account_id
          const accountId = path.split('/')[4];
          req.params = { ...req.params, account_id: accountId };
          return await accountController.getAccount(req, res, dummyNext);
        } else {
          // POST or GET /core-banking/accounts
          if (req.method === 'POST') {
            return await accountController.createAccount(req, res, dummyNext);
          } else if (req.method === 'GET') {
            return await accountController.getAccounts(req, res, dummyNext);
          }
        }
      } 
      
      // Consent routes
      else if (path.startsWith('/core-banking/consent')) {
        if (path.match(/\/core-banking\/consent\/[^\/]+\/revoke$/)) {
          // PUT /core-banking/consent/:consent_id/revoke
          const consentId = path.split('/')[4];
          req.params = { ...req.params, consent_id: consentId };
          return await consentController.revokeConsent(req, res, dummyNext);
        } else if (path.match(/\/core-banking\/consent\/[^\/]+$/)) {
          // GET or PUT /core-banking/consent/:consent_id
          const consentId = path.split('/')[4];
          req.params = { ...req.params, consent_id: consentId };
          
          if (req.method === 'GET') {
            return await consentController.getConsent(req, res, dummyNext);
          } else if (req.method === 'PUT') {
            return await consentController.updateConsent(req, res, dummyNext);
          }
        } else {
          // POST /core-banking/consent
          if (req.method === 'POST') {
            return await consentController.createConsent(req, res, dummyNext);
          }
        }
      } 
      
      // Transaction routes
      else if (path.startsWith('/core-banking/transactions')) {
        // GET /core-banking/transactions/:transaction_id
        if (path.match(/\/core-banking\/transactions\/[^\/]+$/)) {
          const transactionId = path.split('/')[4];
          req.params = { ...req.params, transaction_id: transactionId };
          return await transactionController.getTransaction(req, res, dummyNext);
        }
      } 
      
      // Database routes
      else if (path.startsWith('/core-banking/database')) {
        // Database endpoints
        if (path.endsWith('/snapshot')) {
          return await databaseController.getDatabaseSnapshot(req, res, dummyNext);
        } 
        // else if (path.endsWith('/stats')) {
        //   return await databaseController.getStats(req, res, dummyNext);
        // }
      } 
      
      // Health check
      else if (path.startsWith('/core-banking/health')) {
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
