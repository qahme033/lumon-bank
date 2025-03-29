// packages/admin-api/src/controllers/admin-database-controller.ts
import { Request, Response } from 'express';
import { DatabaseService } from '@banking-sim/core-banking';

export class AdminDatabaseController {
  private bankId: string;
  private databaseService: DatabaseService;

  constructor(bankId: string) {
    this.bankId = bankId;
    this.databaseService = new DatabaseService(bankId);
  }

  async getDatabaseSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const includeAllBanks = req.query.includeAllBanks === 'true';
      const snapshot = await this.databaseService.getDatabaseSnapshot(includeAllBanks);
      
      res.status(200).json({
        success: true,
        data: snapshot
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      console.error(`Error in getDatabaseSnapshot: ${errorMessage}`);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: errorMessage
      });
    }
  }

  async getDatabaseStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.databaseService.getStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      console.error(`Error in getDatabaseStats: ${errorMessage}`);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: errorMessage
      });
    }
  }
}
