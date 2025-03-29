
// packages/admin-api/src/controllers/admin-system-controller.ts
import { Request, Response } from 'express';
import { seedBankData } from '@banking-sim/core-banking';

export class AdminSystemController {
  private bankId: string;

  constructor(bankId: string) {
    this.bankId = bankId;
  }

  async resetSystem(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would go here - reset the database for this bank
      res.status(200).json({
        success: true,
        message: 'System reset successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async seedData(req: Request, res: Response): Promise<void> {
    try {
      // Seed the database with test data
      seedBankData(this.bankId);
      
      res.status(200).json({
        success: true,
        message: 'Test data seeded successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      // Implementation would go here - get system status
      res.status(200).json({
        success: true,
        data: {
          status: 'RUNNING',
          bankId: this.bankId,
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        // message: error.message
      });
    }
  }
}
