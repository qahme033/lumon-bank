// src/controllers/database-controller.ts
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database-service.js'; // Adjust the import path as needed

export class DatabaseController {
  private databaseService: DatabaseService;

  constructor(bankId: string) {
    this.databaseService = new DatabaseService(bankId);
  }

  // Get database snapshot
  async getDatabaseSnapshot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const includeAllBanks = req.query.includeAllBanks === 'true';
      const snapshot = await this.databaseService.getDatabaseSnapshot(includeAllBanks);
      res.status(200).json(snapshot);
    } catch (error) {
      next(error);
    }
  }

  // Get database stats
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await this.databaseService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
