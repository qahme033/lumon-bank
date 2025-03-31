import { Request, Response, NextFunction } from 'express';
export declare class AccountController {
    private accountService;
    constructor(bankId: string);
    createAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAccounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAccountBalance(req: Request, res: Response, next: NextFunction): Promise<void>;
}
