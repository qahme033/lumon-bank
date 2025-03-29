// packages/common/src/services/auth-service.ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  BANK_STAFF = 'BANK_STAFF',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  TPP = 'TPP'
}

export interface IAuthUser {
  id: string;
  username: string;
  role: UserRole;
  bankId: string;
}

export class AuthService {
  /**
   * Generate a JWT token
   */
  static generateToken(
    user: IAuthUser, 
    expiresIn: string = '1h',
    additionalClaims: Record<string, any> = {}
  ): string {
    return jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        bankId: user.bankId,
        ...additionalClaims
      },
      JWT_SECRET,
      { expiresIn }
    );
  }
  
  /**
   * Verify a JWT token
   */
  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
  
  /**
   * Generate a random code (for 2FA, etc.)
   */
  static generateRandomCode(length: number = 6): string {
    return crypto.randomInt(100000, 999999).toString().padStart(length, '0');
  }
  
  /**
   * Hash a password
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }
  
  /**
   * Verify a password
   */
  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
  }
}
