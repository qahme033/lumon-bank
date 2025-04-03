import { Request, Response } from 'express';
export declare class AdminCustomerController {
    private bankId;
    private customerService;
    constructor(bankId: string);
    createCustomer(req: Request, res: Response): Promise<void>;
    getCustomers(req: Request, res: Response): Promise<void>;
    getCustomer(req: Request, res: Response): Promise<void>;
    updateCustomer(req: Request, res: Response): Promise<void>;
    deleteCustomer(req: Request, res: Response): Promise<void>;
}
