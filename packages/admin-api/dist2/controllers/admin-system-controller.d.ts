import { Request, Response } from 'express';
export declare class AdminSystemController {
    private bankId;
    constructor(bankId: string);
    resetSystem(req: Request, res: Response): Promise<void>;
    seedData(req: Request, res: Response): Promise<void>;
    getStatus(req: Request, res: Response): Promise<void>;
}
