import { Request, Response, NextFunction } from 'express';
export declare class TransactionController {
    private transactionService;
    constructor(bankId: string);
    createTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTransactionsForAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
