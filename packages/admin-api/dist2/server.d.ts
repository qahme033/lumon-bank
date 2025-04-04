export declare class AdminServer {
    private app;
    private bankId;
    private port;
    private accountController;
    private databaseController;
    constructor(bankId: string, port: number);
    private configureMiddleware;
    private configureRoutes;
    start(): void;
}
