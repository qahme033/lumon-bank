// packages/admin-api/src/controllers/admin-database-controller.ts
import { Request, Response } from 'express';
import { DatabaseService } from '@banking-sim/core-banking';
import { getDatabaseService } from '@banking-sim/core-banking/src/services/mongodb-service.js';

export class AdminDatabaseController {
  private bankId: string;
  private databaseService?: DatabaseService;

  constructor(bankId: string) {
    this.bankId = bankId;
  }

    // Helper method to get database instance
    private async getDatabase(): Promise<DatabaseService> {
      if (!this.databaseService) {
        this.databaseService = await getDatabaseService();
      }
      return this.databaseService;
    }

  async getDatabaseSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const db = await this.getDatabase();
      const includeAllBanks = req.query.includeAllBanks === 'true';
      const snapshot = await db.getDatabaseSnapshot();
      
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

  // async getDatabaseStats(req: Request, res: Response): Promise<void> {
  //   try {
  //     const db = await this.getDatabase();
  //     const stats = await db.getStats();
      
  //     res.status(200).json({
  //       success: true,
  //       data: stats
  //     });
  //   } catch (error: unknown) {
  //     const errorMessage = error instanceof Error 
  //       ? error.message 
  //       : 'Unknown error occurred';
        
  //     console.error(`Error in getDatabaseStats: ${errorMessage}`);
  //     res.status(500).json({
  //       success: false,
  //       error: 'Internal Server Error',
  //       message: errorMessage
  //     });
  //   }
  // }
}
