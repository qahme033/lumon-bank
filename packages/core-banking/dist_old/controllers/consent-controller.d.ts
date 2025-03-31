import { Request, Response, NextFunction } from 'express';
export declare class ConsentController {
    private consentService;
    constructor(bankId: string);
    createConsent(req: Request, res: Response, next: NextFunction): Promise<void>;
    getConsent(req: Request, res: Response, next: NextFunction): Promise<void>;
    revokeConsent(req: Request, res: Response, next: NextFunction): Promise<void>;
}
