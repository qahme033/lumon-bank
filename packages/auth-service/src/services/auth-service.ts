// packages/auth-service/src/auth-service.ts
import jwt from 'jsonwebtoken';
import { CoreBankingClient, ConsentStatus, Consent, User, UserRole } from '@banking-sim/core-banking-client';

// JWT secret (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthService {
  private client: CoreBankingClient;
  
  constructor(bankId: string = 'default-bank-id', apiBaseUrl?: string) {
    this.client = new CoreBankingClient({
      bankId,
      baseUrl: apiBaseUrl
    });
  }

  /**
   * Register a new user
   */
  async registerUser(
    username: string, 
    password: string, 
    role: UserRole,
    customerId?: string
  ): Promise<User> {
    try {
      const user = await this.client.createUser({
        username,
        password,
        role,
        customerId
      });
      
      return user;
    } catch (error: any) {
      throw new Error(`Failed to register user: ${error.message}`);
    }
  }
  
  /**
   * Authenticate user with password
   */
  async authenticateUser(username: string, password: string): Promise<{
    user: User;
    token: string;
  }> {
    try {
      const { user } = await this.client.authenticateUser({
        username,
        password
      });
      
      const token = this.generateToken(user);
      
      return {
        user,
        token
      };
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
  
  /**
   * Generate JWT token
   */
  generateToken(user: User): string {
    // Define token payload based on user role
    let payload: any = {
      sub: user.id,
      username: user.username,
      role: user.role,
      authType: user.authType,
      iat: Math.floor(Date.now() / 1000)
    };
    
    // Add role-specific claims
    if (user.role === 'ADMIN') {
      payload.scope = 'admin:read admin:write';
    } else if (user.role === 'CUSTOMER') {
      payload.customerId = user.customerId;
      payload.scope = 'accounts:read balances:read transactions:read payments:write';
    }
    
    // Generate and return the token
    return jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: '1h',
        audience: 'api.banking-simulation.com',
        issuer: 'banking-simulation'
      }
    );
  }
  
  /**
   * Verify token
   */
  async verifyToken(token: string): Promise<User> {
    try {
      // First, verify the token cryptographically
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Get the user ID from the token
      const userId = decoded.sub;
      
      // Check if the user still exists
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User no longer exists');
      }
      
      // Check if the user's role or permissions have changed
      if (user.role !== decoded.role) {
        throw new Error('User role has changed');
      }
      
      // For customer users, check if their customerId is still the same
      if (decoded.role === 'CUSTOMER' && user.customerId !== decoded.customerId) {
        throw new Error('User customer ID has changed');
      }
      
      // Return the verified user information
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Invalid token: ${error.message}`);
      } else {
        throw new Error('Invalid token: Unknown error');
      }
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.client.getUser(id);
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
  
  /**
   * Get all users (admin function)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.client.getAllUsers();
    } catch (error: any) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  /**
   * Get consent by ID
   */
  async getConsent(consentId: string): Promise<Consent | null> {
    try {
      return await this.client.getConsent(consentId);
    } catch (error: any) {
      throw new Error(`Error fetching consent: ${error.message}`);
    }
  }
  
  /**
   * Update consent status
   */
  async updateConsentStatus(consentId: string, status: ConsentStatus): Promise<Consent | null> {
    try {
      return await this.client.updateConsent(consentId, { status });
    } catch (error: any) {
      throw new Error(`Error updating consent: ${error.message}`);
    }
  }
  
  /**
   * For managing authentication in API calls
   */
  setAuthToken(token: string): void {
    this.client.setAuthToken(token);
  }
  
  /**
   * Clear auth token when logging out
   */
  clearAuthToken(): void {
    this.client.clearAuthToken();
  }
}
