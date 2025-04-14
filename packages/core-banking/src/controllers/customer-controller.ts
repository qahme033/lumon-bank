// src/controllers/customer-controller.ts
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer-service.js'; // Adjust the import path as needed
import { ICustomer } from '@banking-sim/common';

export class CustomerController {
  private customerService: CustomerService;

  constructor(bankId: string) {
    this.customerService = new CustomerService(bankId);
  }

  // Create a new customer
  async createCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, phone } = req.body;
      const customer: ICustomer = await this.customerService.createCustomer(firstName, lastName, email, phone);
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  }

  // Get a customer by ID
  async getCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id } = req.params;
      const customer: ICustomer | null = await this.customerService.getCustomer(customer_id);
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get all customers
  async getCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customers: ICustomer[] = await this.customerService.getCustomers();
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  }

  // Update a customer
  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id } = req.params;
      const updates = req.body;
      const updatedCustomer: ICustomer | null = await this.customerService.updateCustomer(customer_id, updates);
      if (updatedCustomer) {
        res.status(200).json(updatedCustomer);
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Delete a customer
  async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id } = req.params;
      const success: boolean = await this.customerService.deleteCustomer(customer_id);
      if (success) {
        res.status(200).json({ message: 'Customer deleted successfully' });
      } else {
        res.status(404).json({ error: 'Customer not found' });
      }
    } catch (error) {
      next(error);
    }
  }

  // Get customer accounts
  async getCustomerAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customer_id } = req.params;
      const accountIds: string[] = await this.customerService.getCustomerAccounts(customer_id);
      res.status(200).json({ accountIds });
    } catch (error) {
      next(error);
    }
  }
}
