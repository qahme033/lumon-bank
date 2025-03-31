import { Request, Response, NextFunction } from 'express';
export declare class DatabaseController {
    private databaseService;
    constructor(bankId: string);
    getDatabaseSnapshot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStats(req: Request, res: Response, next: NextFunction): Promise<void>;
}
