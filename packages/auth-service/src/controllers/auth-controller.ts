// packages/auth-service/src/controllers/auth-controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth-service.js';
import { renderAuthorizationPage, renderAuthorizationResult } from '../authorization.js';
import { ConsentStatus } from '@banking-sim/core-banking-client';

export class AuthController {
  private authService: AuthService;
  
  constructor(coreBankingApiUrl?: string) {
    this.authService = new AuthService();
  }

  /**
   * Handle user registration
   */
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, role, customerId } = req.body;
      
      if (!username || !password || !role) {
        res.status(400).json({ 
          success: false,
          error: 'Bad Request',
          message: 'Username, password, and role are required'
        });
        return;
      }
      
      const user = await this.authService.registerUser(
        username, 
        password, 
        role, 
        customerId
      );
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error: any) {
      console.error(`Error in registerUser: ${error.message}`);
      
      const status = error.response?.status || 400;
      res.status(status).json({
        success: false,
        error: 'Registration Failed',
        message: error.message
      });
    }
  }

  /**
   * Handle user login
   */
  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ 
          success: false,
          error: 'Bad Request',
          message: 'Username and password are required'
        });
        return;
      }
      
      const result = await this.authService.authenticateUser(username, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      console.error(`Error in loginUser: ${error.message}`);
      
      res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: error.message
      });
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ 
          success: false,
          error: 'Unauthorized',
          message: 'No token provided' 
        });
        return;
      }
      
      const token = authHeader.split(' ')[1];
      const user = await this.authService.verifyToken(token);
      
      const profile = this.authService.getUserById(user.id.toString());
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error: any) {
      console.error(`Error in getUserProfile: ${error.message}`);
      
      res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: error.message
      });
    }
  }

  /**
   * Handle authorization consent request (GET)
   */
  async getAuthorizationConsent(req: Request, res: Response): Promise<void> {
    try {
      const consentId = req.query.consent_id as string;

      if (!consentId) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'consent_id is required'
        });
        return;
      }

      const consent = await this.authService.getConsent(consentId);

      if (!consent) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Consent not found'
        });
        return;
      }

      if (consent.status !== ConsentStatus.AWAITING_AUTHORIZATION) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Consent is not awaiting authorization'
        });
        return;
      }

      // Render the authorization page with consent details
      return renderAuthorizationPage(res, consent);
    } catch (error: any) {
      console.error(`Error in getAuthorizationConsent: ${error.message}`);
      
      const status = error.response?.status || 500;
      res.status(status).json({
        success: false,
        error: 'Error Processing Request',
        message: error.message
      });
    }
  }

  /**
   * Handle authorization consent approval/denial (POST)
   */
  async processAuthorizationConsent(req: Request, res: Response): Promise<void> {
    try {
      const { consent_id, action } = req.body;

      if (!consent_id || !action) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'consent_id and action are required'
        });
        return;
      }

      const consent = await this.authService.getConsent(consent_id);

      if (!consent) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Consent not found'
        });
        return;
      }

      if (consent.status !== ConsentStatus.AWAITING_AUTHORIZATION) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Consent is not awaiting authorization'
        });
        return;
      }

      let updatedConsent = null;
      if (action === 'approve') {
        updatedConsent = await this.authService.updateConsentStatus(
          consent_id, 
          ConsentStatus.AUTHORIZED
        );
      } else if (action === 'deny') {
        updatedConsent = await this.authService.updateConsentStatus(
          consent_id, 
          ConsentStatus.REVOKED
        );
      } else {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid action. Must be "approve" or "deny"'
        });
        return;
      }

      if (!updatedConsent) {
        res.status(500).json({
          success: false,
          error: 'Internal Server Error',
          message: 'Failed to update consent'
        });
        return;
      }

      // Render the result page
      return renderAuthorizationResult(res, updatedConsent);
    } catch (error: any) {
      console.error(`Error in processAuthorizationConsent: ${error.message}`);
      
      const status = error.response?.status || 500;
      res.status(status).json({
        success: false,
        error: 'Error Processing Request',
        message: error.message
      });
    }
  }

  /**
   * Render login page
   */
  renderLoginPage(req: Request, res: Response): void {
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
  }
}
