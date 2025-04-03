import { Request, Response } from 'express';
export declare class AdminAccountController {
    constructor();
    /**
     * Create a new account by delegating to the core banking API via the common package.
     */
    createAccount(req: Request, res: Response): Promise<void>;
    /**
     * Retrieve all accounts for a specific customer.
     */
    getAccounts(req: Request, res: Response): Promise<void>;
    /**
     * Retrieve a specific account by its ID.
     */
    getAccount(req: Request, res: Response): Promise<void>;
    /**
     * Update an existing account.
     */
    updateAccount(req: Request, res: Response): Promise<void>;
    /**
     * Delete an account.
     */
    deleteAccount(req: Request, res: Response): Promise<void>;
    /**
     * Update the balance of an account.
     */
    updateBalance(req: Request, res: Response): Promise<void>;
}
