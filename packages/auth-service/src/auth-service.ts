// packages/auth-service/src/auth-service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// JWT secret (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory user store (replace with database in production)
const users = new Map<string, any>();

export class AuthService {
  // Register a new user
  async registerUser(
    username: string, 
    password: string, 
    role: 'admin' | 'customer',
    customerId?: string
  ): Promise<any> {
    // Check if user exists
    if (users.has(username)) {
      throw new Error('User already exists');
    }
    
    // For customer role, customerId is required
    if (role === 'customer' && !customerId) {
      throw new Error('Customer ID is required for customer users');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      role,
      customerId: role === 'customer' ? customerId : undefined,
      authType: 'password', // Mark as password auth for future extensibility
      createdAt: new Date()
    };
    
    // Store user
    users.set(username, user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  // Authenticate user with password
  async authenticateUser(username: string, password: string): Promise<any> {
    // Get user
    const user = users.get(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid username or password');
    }
    
    // Generate token
    const token = this.generateToken(user);
    
    // Return user and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token
    };
  }
  
  // Generate JWT token
  generateToken(user: any): string {
    // Define token payload based on user role
    let payload: any = {
      sub: user.id,
      username: user.username,
      role: user.role,
      authType: user.authType,
      iat: Math.floor(Date.now() / 1000)
    };
    
    // Add role-specific claims
    if (user.role === 'admin') {
      payload.scope = 'admin:read admin:write';
    } else if (user.role === 'customer') {
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
  
// packages/auth-service/src/auth-service.ts
verifyToken(token: string): any {
    try {
      // First, verify the token cryptographically
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Get the user ID from the token
      const userId = decoded.sub;
      
      // Check if the user still exists
      const user = this.getUserById(userId);
      
      if (!user) {
        throw new Error('User no longer exists');
      }
      
      // Optionally, you could also check if the user's role or permissions have changed
      if (user.role !== decoded.role) {
        throw new Error('User role has changed');
      }
      
      // For customer users, check if their customerId is still the same
      if (decoded.role === 'customer' && user.customerId !== decoded.customerId) {
        throw new Error('User customer ID has changed');
      }
      
      // Return the verified user information
      return {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        customerId: decoded.customerId,
        authType: decoded.authType,
        scopes: decoded.scope ? decoded.scope.split(' ') : []
      };
    } catch (error: unknown) {
      // Properly handle the unknown error type
      if (error instanceof Error) {
        throw new Error(`Invalid token: ${error.message}`);
      } else {
        throw new Error('Invalid token: Unknown error');
      }
    }
  }
  
  
  // Get user by ID
  getUserById(id: string): any {
    for (const user of users.values()) {
      if (user.id === id) {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  }
  
  // Get all users (admin function)
  getAllUsers(): any[] {
    return Array.from(users.values()).map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
