import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database-service.js';
import { getDatabaseService } from './mongodb-service.js';
import { ICustomer } from '../types/persistance.js';
import { ObjectId } from 'mongodb';

export class CustomerService {
  private db?: DatabaseService;
  private bankId: string;

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
   * Create a new customer
   */
  async createCustomer(
    firstName: string,
    lastName: string,
    email: string,
    phone?: string
  ): Promise<ICustomer> {
    const db = await this.getDatabase();

    // Validate inputs
    if (!firstName || !lastName || !email) {
      throw new Error('First name, last name, and email are required');
    }
    
    // Check if customer with the same email already exists
    const existingCustomers = await db.getCustomers(this.bankId);
    const customerWithEmail = existingCustomers.find(c => c.email === email);
    
    if (customerWithEmail) {
      throw new Error(`Customer with email ${email} already exists`);
    }
    const stringId = uuidv4();
    const id = new ObjectId(stringId);
    const bankOId = new ObjectId(this.bankId);
  // Create the customer
  const customer: ICustomer = {
    id,
    firstName,
    lastName,
    email,
    phone,
    bankId: bankOId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
    
    // Store the customer
    await db.addCustomer(customer);
    
    return customer;
  }

  /**
   * Get a customer by ID
   */
  async getCustomer(customerId: string): Promise<ICustomer | null> {
    const db = await this.getDatabase();
    const customer = await db.getCustomer(customerId);
    
    if (customer && customer.bankId.toString() === this.bankId) {
      return customer;
    }
    return null;
  }

  /**
   * Get all customers for this bank
   */
  async getCustomers(): Promise<ICustomer[]> {
    const db = await this.getDatabase();
    const customers = await db.getCustomers(this.bankId);
    return customers;
  }

  /**
   * Update a customer
   */
  async updateCustomer(
    customerId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<ICustomer | null> {
    const db = await this.getDatabase();
    const customer = await this.getCustomer(customerId);
    
    if (!customer) {
      return null;
    }
    
    // If updating email, check if it's already in use
    if (updates.email && updates.email !== customer.email) {
      const customers = await db.getCustomers(this.bankId);
      const emailInUse = customers.some(c => 
        c.email === updates.email && c.id.toString() !== customerId
      );
      
      if (emailInUse) {
        throw new Error(`Email ${updates.email} is already in use`);
      }
    }
    
    // Update the customer
    const updatedCustomer: ICustomer = {
      ...customer,
      firstName: updates.firstName || customer.firstName,
      lastName: updates.lastName || customer.lastName,
      email: updates.email || customer.email,
      phone: updates.phone !== undefined ? updates.phone : customer.phone
    };
    
    // Store the updated customer
    await db.updateCustomer(updatedCustomer);
    
    return updatedCustomer;
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(customerId: string): Promise<boolean> {
    const db = await this.getDatabase();
    const customer = await this.getCustomer(customerId);
    
    if (!customer) {
      return false;
    }
    
    // Check if customer has any accounts
    const accounts = await db.getAccountsByCustomer(customerId);
    
    if (accounts.length > 0) {
      throw new Error('Cannot delete customer with active accounts');
    }
    
    // Delete the customer
    await db.deleteCustomer(customerId);
    
    return true;
  }

  /**
   * Get customer accounts
   */
  async getCustomerAccounts(customerId: string): Promise<string[]> {
    const db = await this.getDatabase();
    const accounts = await db.getAccountsByCustomer(customerId);
    
    // Filter accounts by bank ID and return account IDs
    return accounts
      .filter(account => account.bankId.toString() === this.bankId)
      .map(account => account.id.toString());
  }
}
