import express, { Request, Response } from 'express';
import { AuthService } from './auth-service';
import { ConsentStatus, IConsent, InMemoryDatabase } from '@banking-sim/core-banking';
import { renderAuthorizationPage, renderAuthorizationResult } from './authorization';

export class AuthServer {
  private app: express.Application;
  private port: number;
  private authService: AuthService;
  
  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.authService = new AuthService();
    this.configureMiddleware();
    this.configureRoutes();
  }
  
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  
  private configureRoutes(): void {
    // Serve a barebones login page
    this.app.get('/auth/login', (req: Request, res: Response) => {
      res.send(`
        <html>
          <head>
            <title>Login</title>
          </head>
          <body>
            <h1>Login</h1>
            <form method="POST" action="/auth/login">
              <label for="username">Username:</label>
              <input type="text" id="username" name="username" required /><br/>
              <label for="password">Password:</label>
              <input type="password" id="password" name="password" required /><br/>
              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `);
    });
    
    // Register user
    this.app.post('/auth/register', async (req: Request, res: Response) => {
      try {
        const { username, password, role, customerId } = req.body;
        
        if (!username || !password || !role) {
          return res.status(400).json({ 
            error: 'Bad Request',
            message: 'Username, password, and role are required'
          });
        }
        
        const user = await this.authService.registerUser(
          username, 
          password, 
          role, 
          customerId
        );
        
        res.status(201).json({
          message: 'User registered successfully',
          user
        });
      } catch (error: any) {
        res.status(400).json({
          error: 'Registration failed',
          message: error.message
        });
      }
    });
    
    // Login (POST)
    this.app.post('/auth/login', async (req: Request, res: Response) => {
      try {
        const { username, password } = req.body;
        
        if (!username || !password) {
          return res.status(400).json({ 
            error: 'Bad Request',
            message: 'Username and password are required'
          });
        }
        
        const result = await this.authService.authenticateUser(username, password);
        
        res.status(200).json({
          message: 'Login successful',
          ...result
        });
      } catch (error: any) {
        res.status(401).json({
          error: 'Authentication failed',
          message: error.message
        });
      }
    });
    
    // Get user profile
    this.app.get('/auth/profile', async (req: Request, res: Response) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        const user = this.authService.verifyToken(token);
        
        const profile = this.authService.getUserById(user.id);
        
        res.status(200).json({
          profile
        });
      } catch (error: any) {
        res.status(401).json({
          error: 'Authentication failed',
          message: error.message
        });
      }
    });
    /**
 * GET /authorize?consent_id={consent_id}
 * Render the authorization page for the customer to approve or deny the consent.
 */
this.app.get('/authorize', async (req: Request, res: Response) => {
  const consentId = req.query.consent_id as string;

  if (!consentId) {
      return res.status(400).send('Bad Request: consent_id is required');
  }

  const db = InMemoryDatabase.getInstance();
  const consent = db.consents.get(consentId) as IConsent | undefined;

  if (!consent) {
      return res.status(404).send('Consent not found');
  }

  if (consent.status !== ConsentStatus.AWAITING_AUTHORIZATION) {
      return res.status(400).send('Consent is not awaiting authorization');
  }

  // Render the authorization page with consent details
  return renderAuthorizationPage(res, consent);
});

/**
* POST /authorize
* Handle the customer's approval or denial of the consent.
*/
this.app.post('/authorize', async (req: Request, res: Response) => {
  const { consent_id, action } = req.body;

  // if (!consent_id || !action) {
  //     return res.status(400).send('Bad Request: consent_id and action are required');
  // }

  // const db = InMemoryDatabase.getInstance();
  // const consent = db.consents.get(consent_id) as IConsent | undefined;

  // if (!consent) {
  //     return res.status(404).send('Consent not found');
  // }

  // if (consent.status !== ConsentStatus.AWAITING_AUTHORIZATION) {
  //     return res.status(400).send('Consent is not awaiting authorization');
  // }

  // if (action === 'approve') {
  //     consent.status = ConsentStatus.AUTHORIZED;
  // } else if (action === 'deny') {
  //     consent.status = ConsentStatus.REVOKED;
  // } else {
  //     return res.status(400).send('Invalid action');
  // }

  // // Update the consent in the database
  // db.consents.set(consent_id, consent);

  // Render the result page
  return renderAuthorizationResult(res, {status : 'consent'});
})
  }
  
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Authentication server running on port ${this.port}`);
    });
  }
}
