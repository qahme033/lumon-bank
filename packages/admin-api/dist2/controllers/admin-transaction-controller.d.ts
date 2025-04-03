import { Request, Response } from 'express';
export declare class AdminTransactionController {
    private bankId;
    constructor(bankId: string);
    createTransaction(req: Request, res: Response): Promise<void>;
    getTransactions(req: Request, res: Response): Promise<void>;
}
