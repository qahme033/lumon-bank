// packages/auth-service/src/auth-server.ts
import express, { Request, Response } from 'express';
import { AuthController } from './controllers/auth-controller.js';

export class AuthServer {
  private app: express.Application;
  private port: number;
  private authController: AuthController;
  
  constructor(port: number, bankId: string = 'default-bank-id') {
    this.port = port;
    this.app = express();
    this.authController = new AuthController(bankId);
    
    if (port !== 0) {
      this.configureMiddleware();
      this.configureRoutes();
    }
  }
  
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  
  private configureRoutes(): void {
    // Serve a barebones login page
    this.app.get('/auth/login', (req: Request, res: Response) => {
      this.authController.renderLoginPage(req, res);
    });
    
    // Register user
    this.app.post('/auth/register', async (req: Request, res: Response) => {
      await this.authController.registerUser(req, res);
    });
    
    // Login (POST)
    this.app.post('/auth/login', async (req: Request, res: Response) => {
      await this.authController.loginUser(req, res);
    });
    
    // Get user profile
    this.app.get('/auth/profile', async (req: Request, res: Response) => {
      await this.authController.getUserProfile(req, res);
    });
    
    // GET /authorize?consent_id={consent_id}
    this.app.get('/authorize', async (req: Request, res: Response) => {
      await this.authController.getAuthorizationConsent(req, res);
    });
    
    // POST /authorize
    this.app.post('/authorize', async (req: Request, res: Response) => {
      await this.authController.processAuthorizationConsent(req, res);
    });
  }
  
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Authentication server running on port ${this.port}`);
    });
  }
  
  // These methods may still be needed for direct use in serverless contexts
  public async handleRegister(req: Request, res: Response): Promise<void> {
    await this.authController.registerUser(req, res);
  }
  
  public async handleLogin(req: Request, res: Response): Promise<void> {
    await this.authController.loginUser(req, res);
  }
  
  public async handleProfile(req: Request, res: Response): Promise<void> {
    await this.authController.getUserProfile(req, res);
  }
  
  public async handleAuthorizeGet(req: Request, res: Response): Promise<void> {
    await this.authController.getAuthorizationConsent(req, res);
  }
  
  public async handleAuthorizePost(req: Request, res: Response): Promise<void> {
    await this.authController.processAuthorizationConsent(req, res);
  }
  
  public handleLoginPage(req: Request, res: Response): void {
    this.authController.renderLoginPage(req, res);
  }
}
