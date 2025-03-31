export declare class CoreBankingServer {
    private app;
    private bankId;
    private port;
    private customerController;
    private accountController;
    private consentController;
    private transactionController;
    private databaseController;
    constructor(bankId: string, port: number);
    private configureMiddleware;
    private configureRoutes;
    start(): void;
}
