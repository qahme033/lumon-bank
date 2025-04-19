// packages/admin-api/src/controllers/admin-database-controller.ts
import { Request, Response } from 'express';
import { CoreBankingClient } from '@banking-sim/core-banking-client';

export class AdminDatabaseController {
  private client: CoreBankingClient;

  /**
   * Initialize the database controller with a core banking client.
   * @param bankId The bank ID for this controller
   * @param apiBaseUrl Optional base URL for the core banking API
   */
  constructor(bankId: string, apiBaseUrl?: string) {
    this.client = new CoreBankingClient({
      bankId,
      baseUrl: apiBaseUrl
    });
  }

  /**
   * Get a snapshot of the database contents.
   */
  async getDatabaseSnapshot(req: Request, res: Response): Promise<void> {
    try {
      // The includeAllBanks parameter can be passed as a query param
      // if your API supports filtering by bank
      const includeAllBanks = req.query.includeAllBanks === 'true';
      
      // Get the database snapshot using the client
      const snapshot = await this.client.getDatabaseSnapshot();
      
      res.status(200).json({
        success: true,
        data: snapshot
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      console.error(`Error in getDatabaseSnapshot: ${errorMessage}`);
      
      const statusCode = error instanceof Error && 'response' in error && 
        (error as any).response?.status ? (error as any).response.status : 500;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }

  /**
   * Check the health of the core banking service.
   */
  async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.client.checkHealth();
      
      res.status(200).json({
        success: true,
        data: health
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      console.error(`Error in checkHealth: ${errorMessage}`);
      
      res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: errorMessage
      });
    }
  }

  // Uncomment if you add a getStats method to your CoreBankingClient
  /*
  async getDatabaseStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.client.getDatabaseStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      console.error(`Error in getDatabaseStats: ${errorMessage}`);
      
      const statusCode = error instanceof Error && 'response' in error && 
        (error as any).response?.status ? (error as any).response.status : 500;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : 'Request Failed',
        message: errorMessage
      });
    }
  }
  */
}
