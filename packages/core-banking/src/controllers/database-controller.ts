// src/controllers/database-controller.ts
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database-service.js';
import { getDatabaseService } from '../services/mongodb-service.js';

export class DatabaseController {
  private databaseService: DatabaseService | null = null;
  private bankId: string;

  constructor(bankId: string) {
    this.bankId = bankId;
    // We'll initialize the service when needed, not in the constructor
  }
  
  private async getDatabaseService(): Promise<DatabaseService> {
    if (!this.databaseService) {
      this.databaseService = await getDatabaseService();
    }
    return this.databaseService;
  }

  // Get database snapshot
  async getDatabaseSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const bankId = req.query.bankId as string || (req as any).bankId || this.bankId;
      const snapshot = await dbService.getDatabaseSnapshot(bankId);
      res.status(200).json(snapshot);
    } catch (error) {
      next(error);
    }
  }

  // Customers
  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const bankId = req.query.bankId as string || (req as any).bankId || this.bankId;
      const customers = await dbService.getCustomers(bankId);
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  }

  async getCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const customerId = req.params.customerId;
      const customer = await dbService.getCustomer(customerId);
      
      if (!customer) {
        res.status(404).json({ message: 'Customer not found' });
        return;
      }
      
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async addCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const customer = req.body;
      await dbService.addCustomer(customer);
      res.status(201).json({ message: 'Customer added successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const customer = req.body;
      await dbService.updateCustomer(customer);
      res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const customerId = req.params.customerId;
      await dbService.deleteCustomer(customerId);
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Accounts
  async getAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const bankId = req.query.bankId as string || (req as any).bankId || this.bankId;
      const accounts = await dbService.getAccounts(bankId);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  }

  async getAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const accountId = req.params.accountId;
      const account = await dbService.getAccount(accountId);
      
      if (!account) {
        res.status(404).json({ message: 'Account not found' });
        return;
      }
      
      res.status(200).json(account);
    } catch (error) {
      next(error);
    }
  }

  async getAccountsByCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const customerId = req.params.customerId;
      const accounts = await dbService.getAccountsByCustomer(customerId);
      res.status(200).json(accounts);
    } catch (error) {
      next(error);
    }
  }

  // Database management
  async resetDatabase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dbService = await this.getDatabaseService();
      const bankId = req.query.bankId as string || (req as any).bankId || this.bankId;
      
      if (!bankId) {
        res.status(400).json({ message: 'Bank ID is required for reset operation' });
        return;
      }
      
      await dbService.reset(bankId);
      res.status(200).json({ message: `Database reset successfully for bank ${bankId}` });
    } catch (error) {
      next(error);
    }
  }

  // Make sure to close the connection when the application is shutting down
  async close(): Promise<void> {
    if (this.databaseService) {
      await this.databaseService.close();
      this.databaseService = null;
    }
  }
}
