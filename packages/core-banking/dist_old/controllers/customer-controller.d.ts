import { Request, Response, NextFunction } from 'express';
export declare class CustomerController {
    private customerService;
    constructor(bankId: string);
    createCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomers(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCustomerAccounts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
