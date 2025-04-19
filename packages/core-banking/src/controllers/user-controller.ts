// src/controllers/user-controller.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user-service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class UserController {
  private userService: UserService;

  constructor(bankId: string) {
    this.userService = new UserService(bankId);
  }

  // Create a new user
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password, role, customerId } = req.body;
      
      if (!username || !password || !role) {
        res.status(400).json({ error: 'Username, password, and role are required' });
        return;
      }
      
      if (role !== 'admin' && role !== 'customer') {
        res.status(400).json({ error: 'Role must be either "admin" or "customer"' });
        return;
      }
      
      const user = await this.userService.createUser(
        username,
        password,
        role,
        customerId
      );
      
      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'User already exists') {
        res.status(409).json({ error: error.message });
      } else if (error.message === 'Customer ID is required for customer users' || 
                 error.message === 'Customer not found') {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }

  // Authenticate a user
  async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }
      
      const user = await this.userService.authenticateUser(username, password);
      
      if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      
      // // Generate JWT token
      // const token = this.generateToken(user);
      
      res.status(200).json({
        user,
        // token
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id } = req.params;
      const user = await this.userService.getUserById(user_id);
      
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  // Update a user
  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id } = req.params;
      const { username, password, role, customerId } = req.body;
      
      const updatedUser = await this.userService.updateUser(user_id, {
        username,
        password,
        role,
        customerId
      });
      
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Delete a user
  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id } = req.params;
      const result = await this.userService.deleteUser(user_id);
      
      if (result) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Generate JWT token (helper method)
  private generateToken(user: any): string {
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

  // Verify a token
  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        res.status(401).json({ error: 'Token is required' });
        return;
      }
      
      // Verify token cryptographically
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Get user from database to make sure it still exists
      const user = await this.userService.getUserById(decoded.sub);
      
      if (!user) {
        res.status(401).json({ error: 'User no longer exists' });
        return;
      }
      
      // Check if role matches
      if (user.role !== decoded.role) {
        res.status(401).json({ error: 'User role has changed' });
        return;
      }
      
      // For customer users, check if customerId matches
      if (decoded.role === 'customer' && 
          (user.customerId ?? "").toString() !== decoded.customerId.toString()) {
        res.status(401).json({ error: 'User customer ID has changed' });
        return;
      }
      
      // Return the verified user information
      res.status(200).json({
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        customerId: decoded.customerId,
        authType: decoded.authType,
        scopes: decoded.scope ? decoded.scope.split(' ') : []
      });
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        res.status(401).json({ error: `Invalid token: ${error.message}` });
      } else {
        next(error);
      }
    }
  }
}
