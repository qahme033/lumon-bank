import { Request, Response } from 'express';
export declare class AdminDatabaseController {
    private bankId;
    private databaseService;
    constructor(bankId: string);
    getDatabaseSnapshot(req: Request, res: Response): Promise<void>;
    getDatabaseStats(req: Request, res: Response): Promise<void>;
}
