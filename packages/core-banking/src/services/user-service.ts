// src/services/user-service.ts
import bcrypt from 'bcrypt';
import { DatabaseService } from './database-service.js';
import { getDatabaseService } from './mongodb-service.js';
import { ObjectId } from 'mongodb';
import { UserRole, AuthType, UserStatus, IUser } from '../types/persistance.js';
import { to_user_dto } from '../types/mappers.js';
import { User } from '../types/dto.js';
export class UserService {
  private bankId: string;
  private db?: DatabaseService;

  constructor(bankId: string) {
    this.bankId = bankId;
  }

  // Helper method to get database instance
  private async getDatabase(): Promise<DatabaseService> {
    if (!this.db) {
      this.db = await getDatabaseService();
    }
    return this.db;
  }

  /**
   * Creates a new user in the system
   */
  async createUser(
    username: string,
    password: string,
    role: 'admin' | 'customer',
    customerId?: string
  ): Promise<Omit<IUser, 'password'>> {
    const db = await this.getDatabase();
    
    // Check if user already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // For customer role, customerId is required
    if (role === 'customer' && !customerId) {
      throw new Error('Customer ID is required for customer users');
    }
    
    // If customerId is provided for a customer, verify it exists
    if (role === 'customer' && customerId) {
      const customer = await db.getCustomer(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userOId = new ObjectId();
    const bankOId = new ObjectId(this.bankId);
    const customerOId = customerId ? new ObjectId(customerId) : undefined;
    
    const user: IUser = {
      id: userOId,
      username,
      password: hashedPassword,
      role: role as UserRole,
      customerId: customerOId,
      authType: AuthType.PASSWORD,
      bankId: bankOId,
      createdAt: new Date(),
      status: UserStatus.ACTIVE
    };
    
    // Store user using database service
    await db.addUser(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Authenticates a user with username and password
   */
  async authenticateUser(username: string, password: string): Promise<Omit<User, 'password'> | null> {
    const db = await this.getDatabase();
    
    // Get user from database service
    const user = await db.getUserByUsername(username);
    if (!user) {
      return null;
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password ?? "");
    if (!isMatch) {
      return null;
    }
    const userDTO =  to_user_dto(user);
    // Return user without password
    const { password: _, ...userWithoutPassword } = userDTO;
    return userWithoutPassword;
  }

  /**
   * Gets a user by ID
   */
  async getUserById(userId: string): Promise<Omit<IUser, 'password'> | null> {
    const db = await this.getDatabase();
    
    // Get user from database service
    const user = await db.getUser(userId);
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Gets all users for a specific bank
   */
  async getUsers(): Promise<Omit<IUser, 'password'>[]> {
    const db = await this.getDatabase();
    
    // Get all users for this bank from database service
    const users = await db.getUsers(this.bankId);
    
    // Return users without passwords
    return users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Updates a user's details
   */
  async updateUser(
    userId: string,
    updates: {
      username?: string;
      password?: string;
      role?: 'admin' | 'customer';
      customerId?: string;
      status?: UserStatus;
    }
  ): Promise<Omit<IUser, 'password'> | null> {
    const db = await this.getDatabase();
    
    // Get existing user
    const user = await db.getUser(userId);
    if (!user) {
      return null;
    }
    
    // Create updated user object
    const updatedUser: IUser = {
      ...user,
      updatedAt: new Date()
    };
    
    // Update fields if provided
    if (updates.username) updatedUser.username = updates.username;
    if (updates.role) updatedUser.role = updates.role as UserRole;
    if (updates.customerId) updatedUser.customerId = new ObjectId(updates.customerId);
    if (updates.status) updatedUser.status = updates.status;
    
    // Handle password separately (need to hash it)
    if (updates.password) {
      updatedUser.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Update user using database service
    await db.updateUser(updatedUser);
    
    // Get updated user and return without password
    const refreshedUser = await db.getUser(userId);
    if (!refreshedUser) return null;
    
    const { password: _, ...userWithoutPassword } = refreshedUser;
    return userWithoutPassword;
  }

  /**
   * Deletes a user
   */
  async deleteUser(userId: string): Promise<boolean> {
    const db = await this.getDatabase();
    
    // Check if user exists
    const user = await db.getUser(userId);
    if (!user) {
      return false;
    }
    
    // Delete user using database service
    await db.deleteUser(userId);
    return true;
  }
}
